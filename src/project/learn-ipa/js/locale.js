window.locale = "en";

window.translate = function(key) {
    return {
        en: {
            consonant: "consonant",
            vowel: "vowel",
            voiced: "voiced",
            voiceless: "voiceless",
            rounded: "rounded",
            unrounded: "unrounded"
        },
        it: {
            consonant: "consonante",
            vowel: "vocale",
            voiced: "sonora",
            voiceless: "sorda",
            rounded: "arrotondata",
            unrounded: "non arrotondata"
        }
    }[window.locale][key];
}

window.pluralForm = function(n, sg, pl) {
    return n + ' ' + (n == 1 ? sg : pl);
}
