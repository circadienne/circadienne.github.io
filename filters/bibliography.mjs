// Terminology:
//      The main object is a `bibliography`. It consists of `items`. Each item is an
//      object containing information about the cited work, such as its title, its
//      author(s) etc. In text, `citations` refer to a given item using its `key`.
//
//      In the Nunjucks file, the `cite` filter takes a `cite reference` (`citeRef`),
//      which is an object that contains the citations key, the cited page range and
//      the style to apply.

import { error, assert } from "../util.mjs";

const bibSymbol = Symbol();

function getCitationId(key, id) {
    return `${key}cite${id}`;
}

function getAuthorLastName(author) {
    let lastPrefix = author.lastPrefix;
    if (lastPrefix) lastPrefix += ' ';
    return lastPrefix + author.last;
}

function citationAuthorsToString(cited) {
    if (!cited.authors)
        return null;

    if (cited.authors.length === 1)
        return getAuthorLastName(cited.authors[0]);
    else if (cited.authors.length === 2)
        return `${getAuthorLastName(cited.authors[0])} and ${getAuthorLastName(cited.authors[1])}`;
    else
        return `${getAuthorLastName(cited.authors[0])} et al.`;
}

function bibliographyAuthorToString(cited) {
    if (!cited.authors)
        return null;

    const authorStrings = [];
    for (let i = 0; i < cited.authors.length; i++) {
        const a = cited.authors[i];
        if (i === 0)
            authorStrings.push(`${getAuthorLastName(a)}, ${a.first}`);
        else
            authorStrings.push(`${a.first} ${getAuthorLastName(a)}`);
    }

    if (authorStrings.length === 1)
        return authorStrings[0];
    else if (authorStrings.length === 2)
        return authorStrings.join(", and ");
    else
        return authorStrings.slice(0, -1).join(", ")
            + ", and " + authorStrings[authorStrings.length - 1];
}

function normalizeAuthors(arr) {
    const newArr = [];

    for (const obj of arr) {
        if (!(obj instanceof Array)) {
            assert(normalizeAuthors, obj.first !== undefined && obj.last !== undefined, `author object ${obj} (part of the array ${arr}) is malformed: missing either \`first\` or \`last\` attribute`);
            assert(normalizeAuthors, typeof obj.first === "string" && typeof obj.last === "string", `author object ${obj} (part of the array ${arr}) is malformed: either \`first\` or \`last\` attribute isn't a string`);

            if (obj.lastPrefix === undefined)
                obj.lastPrefix = '';
            newArr.push(obj);
        }
        else
            newArr.push({
                last: obj[0],
                lastPrefix: '',
                first: obj.slice(1).join(' '),
            });
    }

    return newArr;
}

function pageInfoToString(obj) {
    let pageInfo = '';
    if (obj.page) {
        pageInfo = obj.page + '';
        if (obj.pageSuf)
            pageInfo += ' ' + obj.pageSuf;
    }
    return pageInfo;
}

// If pageStr refers to one page: return "p."
// Else: "pp."
function getPagePrefix(pageStr) {
    if (!isNaN(Number(pageStr)))
        return "p.";
    else
        return "pp.";
}

/** Given a list of items, create a new bibliography object. */
export function createBibFilter(items) {
    const bib = {
        // used for sanity checks (e.g. if the object passed to "cite" is actually a bibliography)
        _bibSymbol: bibSymbol,
        items: {}
    };

    for (const key in items) {
        const item = items[key];
        item.key = key;
        bib.items[key] = item;

        let authors;
        if (item.author) {
            authors = [item.author];
            delete item.author;
        }
        else
            authors = item.authors;

        item.authors = normalizeAuthors(authors);
        if (item.in && item.in.authors)
            item.in.authors = normalizeAuthors(item.in.authors);
        item.citations = [];

        // computed items
        const c = item.computed = {};
        c.citeAuthor = citationAuthorsToString(item);
        // used in bibliography
        c.entry = displayItem(item);
        // used in tooltips
        c.entryPlain = displayItem(item, { plainText: true });
    }

    return bib;
}

function cite(cited, options) {
    const pageStr = pageInfoToString(options);
    const id = cited.citations.length + 1;

    const createLink = (content) => {
        if (options.plainText)
            return content;
        else
            return `<a href="#${cited.key}" id="${getCitationId(cited.key, id)}" data-citation-id="${id}" title="Citation № ${id} of `
                + cited.computed.entryPlain
                + (pageStr ? ` (${getPagePrefix(pageStr)} ${pageStr})` : '') + `.">${content}</a>`;
    }

    const yearStr = (cited.year || cited.in?.year || 'n.d.') + (pageStr ? `: ${pageStr}` : '');

    const author = cited.computed.citeAuthor;

    let text;
    // "Year"
    if (options.style == 'year')
        text = createLink(yearStr);
    // "Author (Year)"
    else if (options.style == 'prose')
        text = createLink(`${author} (${yearStr})`);
    else {
        text = `${author} ${yearStr}`;
        // "(Author Year)"
        if (options.style !== 'noparens')
            text = `(${createLink(text)})`;
        // "Author Year"
        else
            text = createLink(text);
    }

    return options.plainText ? text : `<span class="citation">${text}</span>`;
}

export function citeFilter(citeObjs, bib) {
    if (!bib || typeof bib !== "object")
        error(citeFilter, `no bibliography provided (got ${bib})`);
    else if (bib._bibSymbol !== bibSymbol)
        error(citeFilter, `passed bibliography missing required _bibSymbol, which means it can't have been created using the \`createBib\` filter; bib =`, bib);

    if (!(citeObjs instanceof Array))
        citeObjs = [citeObjs];

    const strings = [];
    for (const citeObj of citeObjs) {
        const cited = bib.items[citeObj.key];
        if (cited === undefined)
            error(citeFilter, `key ${citeObj.key} not found`);

        const options = {
            page: citeObj.page,
            style: citeObj.style
        };

        if (citeObjs.length > 1)
            options.style = "noparens";

        strings.push(cite(cited, options));

        const id = cited.citations.length + 1;
        const pageStr = pageInfoToString(citeObj);
        cited.citations.push({ id, page: pageStr });
    }

    if (strings.length === 1)
        return strings[0];
    else
        return '(' + strings.join("; ") + ')';
}

export function displayItem(cited, options) {
    if (!options) options = {};

    function addPeriod(str) {
        return str ? str + '. ' : '';
    }

    const authorStr = bibliographyAuthorToString(cited);
    const year = cited.year || undefined;

    let title = cited.title;

    // title + containing book info
    let suffix = '';

    if (cited.in || cited.journal) {
        title = `“${title}”`;
        if (cited.in)
            suffix = `In: ${displayItem(cited.in, options)}`;
    }
    else if (!options.plainText)
        title = `<cite>${title}</cite>`;

    if (cited.journal) {
        const journal = options.plainText ? cited.journal : `<cite>${cited.journal}</cite>`;
        const nbsp = options.plainText ? ' ' : '&nbsp;';
        return `${authorStr}. ${title}. ${journal}, vol.${nbsp + cited.volume}, no.${nbsp + cited.issue}, ${year}, ${getPagePrefix(cited.pages) + nbsp + cited.pages}`;
    }
    return addPeriod(authorStr) + addPeriod(year) + addPeriod(title) + addPeriod(suffix);
}

function sortBib(bib) {
    const items = Object.values(bib.items);
    return items.sort((a, b) => {
        // console.log(`comparing ${a.authors[0].last} to ${b.authors[0].last}`);
        const authorA = a.authors[0].last.toUpperCase();
        const authorB = b.authors[0].last.toUpperCase();
        const authorComparison = authorA.localeCompare(authorB);
        if (authorComparison === 0)
            return a.year - b.year;
        return authorComparison;
    });
}

export function displayBibFilter(bib) {
    let result = '<ul class="bibliography">\n';

    const sortedBibItems = sortBib(bib);
    for (const cited of sortedBibItems) {
        // skip if not cited
        if (cited.citations.length === 0)
            continue;

        const citationList = [];
        for (let i = 0; i < cited.citations.length; i++) {
            const id = i+1;
            const citation = cited.citations[i];
            const page = citation.page ? `&nbsp;[${getPagePrefix(citation.page)} ${citation.page}]` : '';
            citationList.push(`<a href="#${getCitationId(cited.key, id)}" title="`
                + cite(cited, {plainText: true, style: "prose", page: citation.page}) + `">${id + page}</a>`);
        }

        const citationsString = citationList.map(cit => `<li>${cit}</li>`).join('');

        result += `<li id="${cited.key}">${cited.computed.entry} <ul class="citation-list">  ${citationsString}</ul></li>\n`;
    }

    return result + '</ul>\n';
}

export default {
    createBib: createBibFilter,
    cite: citeFilter,
    displayBib: displayBibFilter,
};
