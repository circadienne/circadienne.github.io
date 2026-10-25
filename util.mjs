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

export function dateToString(date) {
    if (!(date instanceof Date))
        throw new TypeError("invalid date passed: " + date);
    return date.getDate() + '/' + romanize(date.getMonth()+1) + '/' + date.getFullYear();
}

export function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export function isWhitespace(text) {
    return text.trim() == '';
}

// unique ID
// collisions are so unlikely at this small a scale that
// it's not even worth it to check for duplicates
export function uid() {
    return Math.random().toString(16).slice(2);
}

export function error(func, ...args) {
    console.error(`[ERROR in ${func.name}]`, ...args);
    throw new Error(`${func.name}: ${args.join(' ')}`);
}

export function assert(func, cond, ...args) {
    if (!cond) error(func, ...args);
}

export function sanity(...args) {
    console.log("=> SANITY CHECK: GOT HERE!!!", ...args);
}
