function romanize(num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
               "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
               "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return (Array(+digits.join("") + 1).join("M") + roman).toLowerCase();
}

export function dateFilter(dateObj) {
    if (dateObj instanceof Date) {
        return '<span class="date">' +
            dateObj.getDate() + '/' +
            romanize(dateObj.getMonth()+1) + '/' +
            dateObj.getFullYear() + '</span>';
    } else {
        throw new Error("invalid date passed");
    };
}

export function filterDisplayedTags(tags) {
    return tags.filter(t => !["post", "blog", "writing", "project"].includes(t));
}

export function tagFilter(tags) {
    return "<ul class='data-tags'>" + tags.map(t => `<li>${t}</li>`).join('') + "</ul>";
}

export function postThumbnailFilter(post) {
    let content = `
        <div class="post-thumb">
            <a href="${post.url}">
                <h2 class="post-thumb-title">${post.data.title}</h2>`
    if (post.data.subtitle || post.data.preview)
        content += `<div class="post-thumb-subtitle">${post.data.subtitle || post.data.preview}</div>`
    if (post.data.date)
        content += `<div class="post-thumb-date">${dateFilter(post.data.date)}</div>`;
    content += "</a></div>";
    return content;
}

import { ipa as xsToIpa } from '@auctumnus/xsampa'
import { escapeHTML } from "./util.mjs";

export function ipa(text) {
    return `<span class="ipa">${xsToIpa(text)}</span>`;
}

export function inlineCode(code) {
    const escaped = escapeHTML(code);
    return `<code class="code-inline">${escaped}</code>`;
}
