import markdownIt from "markdown-it";
import markdownFootnotePlugin from "markdown-it-footnote";
import { dateToString, escapeHTML, uid, error } from "./util.mjs";
import { ipa as xsToIpa } from "@auctumnus/xsampa";
import { LANGUAGE_NAMES } from "./locale.mjs";
import bibFilters from "./filters/bibliography.mjs";

function dateFilter(date) {
    return `<span class="date">${dateToString(date)}</span>`;
}

export default async function (eleventyConfig) {
    // === Eleventy config ===
    eleventyConfig.addPassthroughCopy({
        "./public/": "/",
        "./public/favicon.png": "/favicon.png",
    });
    eleventyConfig.addPassthroughCopy("src/**/*.{js,css}");

    eleventyConfig.setNunjucksEnvironmentOptions({
        throwOnUndefined: true,
        autoescape: false,
    });

    const mdLib = new markdownIt({
        html: true,
        typographer: true,
        breaks: true,
    });
    mdLib.use(markdownFootnotePlugin);
    eleventyConfig.setLibrary("md", mdLib);

    // === Utility filters ===
    eleventyConfig.addFilter("contains", (list, value) => list.includes(value));
    // return a list containing the first `n` elements from `list`
    eleventyConfig.addFilter("firstN", (list, n) => list.filter((_, i) => i < n));
    // show only displayed tags (e.g. no collection tags)
    eleventyConfig.addFilter("filterDisplayedTags", tags => tags.filter(t => !["post", "blog", "writing", "project"].includes(t)));

    // render content as markdown
    eleventyConfig.addFilter("markdown", (content) => mdLib.render(content));
    // render content in X-SAMPA as IPA
    eleventyConfig.addFilter("ipa", xsampa => `<span class="ipa">${xsToIpa(xsampa)}</span>`);
    // render as inline code
    eleventyConfig.addFilter("inlineCode", code => `<code class="code-inline">${escapeHTML(code)}</code>`);
    // pretty print URL (just takes out the protocol name)
    eleventyConfig.addFilter("prettyURL", text => text.replace(/https?:\/\//, ''));
    // render date
    eleventyConfig.addFilter("date", dateFilter);
    // display tags
    eleventyConfig.addFilter("tagDisplay", tags => `<ul class='data-tags'>${tags.map(t => `<li>${t}</li>`).join('')}</ul>`);
    // display post thumbnail
    eleventyConfig.addFilter("postThumbnail", (post) => {
        let content = `
            <div class="post-thumb">
                <a href="${post.url}">
                    <h2 class="post-thumb-title">${post.data.title}</h2>`;
        if (post.data.subtitle || post.data.preview)
            content += `<div class="post-thumb-subtitle">${post.data.subtitle || post.data.preview}</div>`;
        if (post.data.date)
            content += `<div class="post-thumb-date">${dateFilter(post.data.date)}</div>`;;
        content += "</a></div>";
        return content;
    });

    eleventyConfig.addFilter("createBib", bibFilters.createBib);
    eleventyConfig.addFilter("cite", bibFilters.cite);
    eleventyConfig.addFilter("displayBib", bibFilters.displayBib);

    eleventyConfig.addPairedShortcode("spoiler", (text) => {
        const labelName = `__spoiler-cb${uid()}`;
        return `<input type="checkbox" checked hidden id="${labelName}"><label class="spoiler" for="${labelName}">${text}</label>`;
    });

    eleventyConfig.addPairedShortcode("sidenote", (text, heading) => {
        if (heading)
            return `<details class="sidenote"><summary>${heading}</summary>${text}</details>`
        return `<aside class="sidenote">${text}</aside>`;
    });

    eleventyConfig.addPairedShortcode("multilang", function _multilangShortcode(text, ...langs) {
        const parts = text.split('===');
        if (parts.length !== langs.length)
            error(_multilangShortcode, `parts length (${parts.length}) and lang arg number (${langs.length}) must be equal`);

        const tabsId = uid();
        const tabIds = [];
        let res = `<div class="tabs">
            <div class="tab-bar">\n`;
        for (let i = 0; i < langs.length; i++) {
            const tabButtonId = uid();
            const l = langs[i];
            const tabId = tabsId + '-' + langs[i];
            tabIds.push(tabId);
            res += `<input type="radio" name="tab-radio-${tabsId}" id="tab-radio-${tabButtonId}" data-tab-id="${tabId}" ${i === 0 ? 'checked' : ''}>
                <label for="tab-radio-${tabButtonId}">${LANGUAGE_NAMES[l]}</label>`;
        }
        res += `<div></div>\n` // spacer
        res += `</div>\n`;
        for (let i = 0; i < parts.length; i++) {
            res += `\t<div class="tab" data-tab-id="${tabIds[i]}" ${i === 0 ? "" : "hidden"}>${mdLib.render(parts[i])}</div>\n`;
        }
        return res + `\n</div>`;
    });

    eleventyConfig.addPairedShortcode("htmlsnippet", (code, type) => {
        if (code[0] == '\n') code = code.slice(1);
        const escaped = escapeHTML(code);
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
