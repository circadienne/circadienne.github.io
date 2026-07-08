import markdownIt from "markdown-it";
import markdownFootnotePlugin from 'markdown-it-footnote';
import * as filters from "./filters/filters.mjs";

export default async function (eleventyConfig) {
    eleventyConfig.addFilter("debug", console.log);
    eleventyConfig.setNunjucksEnvironmentOptions({
        throwOnUndefined: true,
        autoescape: false,
    });
    eleventyConfig.addPassthroughCopy({
        "./public/": "/",
        "./public/favicon.ico": "/favicon.ico",
    });
    eleventyConfig.addPassthroughCopy("src/**/*.{js,css}");
    const mdLib = new markdownIt({
        html: true,
        typographer: true,
        breaks: true,
    });
    mdLib.use(markdownFootnotePlugin);
    eleventyConfig.setLibrary("md", mdLib);
    eleventyConfig.addFilter("contains", (list, value) => {
        return list.includes(value);
    });
    eleventyConfig.addFilter("markdown", (content) => {
        return mdLib.render(content);
    });
    eleventyConfig.addFilter("date", filters.dateFilter);
    eleventyConfig.addFilter("tagDisplay", filters.tagFilter);
    eleventyConfig.addFilter("postThumbnail", filters.postThumbnailFilter);
    eleventyConfig.addFilter("ipa", filters.ipa);
    eleventyConfig.addFilter("inlineCode", filters.inlineCode);
    eleventyConfig.addFilter("prettyURL", function(text) {
        return text.replace(/https?:\/\//, '');
    });
    const counters = {};
    eleventyConfig.addFilter("setCounter", (name, value) => {
        counters[name] = value;
        return '';
    });
    eleventyConfig.addFilter("getCounter", (name) => {
        return counters[name];
    });
    eleventyConfig.addFilter("getIncCounter", (name) => {
        return counters[name]++;
    });
    let n = 0;
    eleventyConfig.addPairedShortcode("spoiler", (text) => {
        const labelName = `__spoiler-cb${n++}`;
        return `<input type="checkbox" checked hidden id="${labelName}"><label class="spoiler" for="${labelName}">${text}</label>`;
    });
    eleventyConfig.addPairedShortcode("sidenote", (text, heading) => {
        if (heading)
            return `<details class="sidenote"><summary>${heading}</summary>${text}</details>`
        return `<aside class="sidenote">${text}</aside>`;
    });
    eleventyConfig.addPairedShortcode("htmlsnippet", (code, type) => {
        if (code[0] == '\n') code = code.slice(1);
        const escaped = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        if (type === "nopreview") {
            return `<div class="code-snippet">
                <fieldset>
                    <legend>Code</legend>
                    <pre class="code-source"><code>${escaped}</code></pre>
                </fieldset>
            </div>`;
        }
        else {
            return `<div class="code-snippet with-preview${type === 'long' ? '' : ' code-snippet-short'}">
                <fieldset>
                    <legend>Code</legend>
                    <pre class="code-source"><code>${escaped}</code></pre>
                </fieldset>
                <fieldset>
                    <legend>Preview</legend>
                    <div class="code-preview">${code}</div>
                </fieldset>
            </div>`;
        }
    });
};

export const config = {
    templateFormats: [ "md", "njk" ],
    markdownTemplateEngine: "njk",
    dir: {
        input: "src",
        output: "_site",
        includes: "../_includes",
    }
};
