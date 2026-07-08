function capitalize(str) {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

class IpaSymbol {
    constructor(symbol, group) {
        this.symbol = symbol;
        this.group = group;
    }
}

class ConsonantSymbol extends IpaSymbol {
    static position = {
        bilabial: { value: 0, en: 'bilabial', it: 'bilabiale' },
        labiodental: { value: 1, en: 'labiodental', it: 'labiodentale' },
        dental: { value: 2, en: 'dental', it: 'dentale' },
        alveolar: { value: 3, en: 'alveolar', it: 'alveolare' },
        postalveolar: { value: 4, en: 'postalveolar', it: 'postalveolare' },
        retroflex: { value: 5, en: 'retroflex', it: 'retroflessa' },
        palatal: { value: 6, en: 'palatal', it: 'palatale' },
        velar: { value: 7, en: 'velar', it: 'velare' },
        uvular: { value: 8, en: 'uvular', it: 'uvulare' },
        pharyngeal: { value: 9, en: 'pharyngeal', it: 'faringale' },
        glottal: { value: 10, en: 'glottal', it: 'glottidale' },
    }

    static mode = {
        plosive: { value: 0, en: 'plosive', it: 'occlusiva' },
        fricative: { value: 1, en: 'fricative', it: 'fricativa' },
        lateralFricative: { value: 2, en: 'lateral fricative', it: 'fricativa laterale' },
        affricate: { value: 3, en: 'affricate', it: 'affricata' },
        nasal: { value: 4, en: 'nasal', it: 'nasale' },
        approximant: { value: 5, en: 'approximant', it: 'approssimante' },
        lateralApproximant: { value: 6, en: 'lateral approximant', it: 'approssimante laterale' },
        trill: { value: 7, en: 'trill', it: 'vibrante' },
        tap: { value: 8, en: 'tap', it: 'monovibrante' },
    }

    constructor(symbol, group, mode, position, voiced) {
        super(symbol, group);
        this.mode = mode;
        this.position = position;
        this.voiced = voiced;
        this.name = `${window.translate(voiced ? "voiced" : "voiceless")} ${position[locale]} ${mode[locale]}`;
        this.link = 'https://en.wikipedia.org/wiki/' + capitalize(this.name.replace(/ /g, '_'));
        this.button = null;
    }
}

class VowelSymbol extends IpaSymbol {
    static position = {
        front: { value: 0, en: 'front', it: 'anteriore' },
        central: { value: 1, en: 'central', it: 'centrale' },
        back: { value: 2, en: 'back', it: 'posteriore' }
    }

    static height = {
        close: { value: 0, en: 'close', it: 'alta' },
        nearClose: { value: 1, en: 'near-close', it: 'quasi chiusa' },
        closeMid: { value: 2, en: 'close-mid', it: 'medio-alta' },
        mid: { value: 3, en: 'mid', it: 'media' },
        openMid: { value: 4, en: 'open-mid', it: 'medio-bassa' },
        nearOpen: { value: 5, en: 'near-open', it: 'quasi aperta' },
        open: { value: 6, en: 'open', it: 'bassa' }
    }

    constructor(symbol, group, pos, height, rounded) {
        super(symbol, group);
        this.position = pos;
        this.height = height;
        this.rounded = rounded;
        this.name = `${height[locale]} ${pos[locale]} ${window.translate(rounded ? "rounded" : "unrounded")} vowel`;
        this.link = 'https://en.wikipedia.org/wiki/' + capitalize(this.name.replace(/ /g, '_'));
        this.button = null;
    }
}

const consonants = [
    // Occlusive
    new ConsonantSymbol('p', 'p', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.bilabial, false),
    new ConsonantSymbol('b', 'b', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.bilabial, true),

    new ConsonantSymbol('t', 't', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.alveolar, false),
    new ConsonantSymbol('d', 'd', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.alveolar, true),

    new ConsonantSymbol('ʈ', 't', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.retroflex, false),
    new ConsonantSymbol('ɖ', 'd', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.retroflex, true),

    new ConsonantSymbol('c', 'c', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.palatal, false),
    new ConsonantSymbol('ɟ', 'j', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.palatal, true),

    new ConsonantSymbol('k', 'k', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.velar, false),
    new ConsonantSymbol('ɡ', 'g', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.velar, true),

    new ConsonantSymbol('q', 'q', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.uvular, false),
    new ConsonantSymbol('ɢ', 'g', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.uvular, true),

    new ConsonantSymbol('ʔ', '2', ConsonantSymbol.mode.plosive, ConsonantSymbol.position.glottal, false),

    // Nasali
    new ConsonantSymbol('m', 'm', ConsonantSymbol.mode.nasal, ConsonantSymbol.position.bilabial, true),
    new ConsonantSymbol('ɱ', 'm', ConsonantSymbol.mode.nasal, ConsonantSymbol.position.labiodental, true),
    new ConsonantSymbol('n', 'n', ConsonantSymbol.mode.nasal, ConsonantSymbol.position.alveolar, true),
    new ConsonantSymbol('ɳ', 'n', ConsonantSymbol.mode.nasal, ConsonantSymbol.position.retroflex, true),
    new ConsonantSymbol('ɲ', 'n', ConsonantSymbol.mode.nasal, ConsonantSymbol.position.palatal, true),
    new ConsonantSymbol('ŋ', 'n', ConsonantSymbol.mode.nasal, ConsonantSymbol.position.velar, true),
    new ConsonantSymbol('ɴ', 'n', ConsonantSymbol.mode.nasal, ConsonantSymbol.position.uvular, true),

    // Vibranti
    new ConsonantSymbol('ʙ', 'b', ConsonantSymbol.mode.trill, ConsonantSymbol.position.bilabial, true),
    new ConsonantSymbol('r', 'r', ConsonantSymbol.mode.trill, ConsonantSymbol.position.alveolar, true),
    new ConsonantSymbol('ʀ', 'r', ConsonantSymbol.mode.trill, ConsonantSymbol.position.uvular, true),

    // Monovibranti
    new ConsonantSymbol('ⱱ', 'v', ConsonantSymbol.mode.tap, ConsonantSymbol.position.labiodental, true),
    new ConsonantSymbol('ɾ', 'r', ConsonantSymbol.mode.tap, ConsonantSymbol.position.alveolar, true),
    new ConsonantSymbol('ɽ', 'r', ConsonantSymbol.mode.tap, ConsonantSymbol.position.retroflex, true),

    // Fricative
    new ConsonantSymbol('ɸ', 'p', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.bilabial, false),
    new ConsonantSymbol('β', 'b', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.bilabial, true),

    new ConsonantSymbol('f', 'f', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.labiodental, false),
    new ConsonantSymbol('v', 'v', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.labiodental, true),

    new ConsonantSymbol('θ', 't', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.dental, false),
    new ConsonantSymbol('ð', 'd', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.dental, true),

    new ConsonantSymbol('s', 's', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.alveolar, false),
    new ConsonantSymbol('z', 'z', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.alveolar, true),

    new ConsonantSymbol('ʃ', 's', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.postalveolar, false),
    new ConsonantSymbol('ʒ', 'z', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.postalveolar, true),

    new ConsonantSymbol('ʂ', 's', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.retroflex, false),
    new ConsonantSymbol('ʐ', 'z', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.retroflex, true),

    new ConsonantSymbol('ç', 'c', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.palatal, false),
    new ConsonantSymbol('ʝ', 'j', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.palatal, true),

    new ConsonantSymbol('x', 'x', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.velar, false),
    new ConsonantSymbol('ɣ', 'y', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.velar, true),

    new ConsonantSymbol('χ', 'x', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.uvular, false),
    new ConsonantSymbol('ʁ', 'r', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.uvular, true),

    new ConsonantSymbol('ħ', 'h', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.pharyngeal, false),
    new ConsonantSymbol('ʕ', '2', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.pharyngeal, true),

    new ConsonantSymbol('h', 'h', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.glottal, false),
    new ConsonantSymbol('ɦ', 'h', ConsonantSymbol.mode.fricative, ConsonantSymbol.position.glottal, true),

    // Fricativi laterali
    new ConsonantSymbol('ɬ', 'l', ConsonantSymbol.mode.lateralFricative, ConsonantSymbol.position.alveolar, false),
    new ConsonantSymbol('ɮ', 'l', ConsonantSymbol.mode.lateralFricative, ConsonantSymbol.position.alveolar, true),

    // Approssimanti
    new ConsonantSymbol('w', 'w', ConsonantSymbol.mode.approximant, ConsonantSymbol.position.bilabial, true),
    new ConsonantSymbol('ʋ', 'v', ConsonantSymbol.mode.approximant, ConsonantSymbol.position.labiodental, true),
    new ConsonantSymbol('ɹ', 'r', ConsonantSymbol.mode.approximant, ConsonantSymbol.position.alveolar, true),
    new ConsonantSymbol('ɻ', 'r', ConsonantSymbol.mode.approximant, ConsonantSymbol.position.retroflex, true),
    new ConsonantSymbol('j', 'j', ConsonantSymbol.mode.approximant, ConsonantSymbol.position.palatal, true),
    new ConsonantSymbol('ɰ', 'w', ConsonantSymbol.mode.approximant, ConsonantSymbol.position.velar, true),

    // Approssimanti laterali
    new ConsonantSymbol('l', 'l', ConsonantSymbol.mode.lateralApproximant, ConsonantSymbol.position.alveolar, true),
    new ConsonantSymbol('ɭ', 'l', ConsonantSymbol.mode.lateralApproximant, ConsonantSymbol.position.retroflex, true),
    new ConsonantSymbol('ʎ', 'y', ConsonantSymbol.mode.lateralApproximant, ConsonantSymbol.position.palatal, true),
    new ConsonantSymbol('ʟ', 'l', ConsonantSymbol.mode.lateralApproximant, ConsonantSymbol.position.velar, true),
];

const vowels = [
    // Close
    new VowelSymbol('i', 'i', VowelSymbol.position.front, VowelSymbol.height.close, false),
    new VowelSymbol('y', 'y', VowelSymbol.position.front, VowelSymbol.height.close, true),
    new VowelSymbol('ɨ', 'i', VowelSymbol.position.central, VowelSymbol.height.close, false),
    new VowelSymbol('ʉ', 'u', VowelSymbol.position.central, VowelSymbol.height.close, true),
    new VowelSymbol('ɯ', 'm', VowelSymbol.position.back, VowelSymbol.height.close, false),
    new VowelSymbol('u', 'u', VowelSymbol.position.back, VowelSymbol.height.close, true),

    // Near-close
    new VowelSymbol('ɪ', 'i', VowelSymbol.position.front, VowelSymbol.height.nearClose, false),
    new VowelSymbol('ʏ', 'y', VowelSymbol.position.front, VowelSymbol.height.nearClose, true),
    new VowelSymbol('ʊ', 'u', VowelSymbol.position.back, VowelSymbol.height.nearClose, true),

    // Mid-close
    new VowelSymbol('e', 'e', VowelSymbol.position.front, VowelSymbol.height.closeMid, false),
    new VowelSymbol('ø', 'o', VowelSymbol.position.front, VowelSymbol.height.closeMid, true),
    new VowelSymbol('ɘ', 'e', VowelSymbol.position.central, VowelSymbol.height.closeMid, false),
    new VowelSymbol('ɵ', 'o', VowelSymbol.position.central, VowelSymbol.height.closeMid, true),
    new VowelSymbol('ɤ', 'y', VowelSymbol.position.back, VowelSymbol.height.closeMid, false),
    new VowelSymbol('o', 'o', VowelSymbol.position.back, VowelSymbol.height.closeMid, true),

    // Mid
    new VowelSymbol('ə', 'e', VowelSymbol.position.central, VowelSymbol.height.mid, false),

    // Mid-open
    new VowelSymbol('ɛ', 'e', VowelSymbol.position.front, VowelSymbol.height.openMid, false),
    new VowelSymbol('œ', 'o', VowelSymbol.position.front, VowelSymbol.height.openMid, true),
    new VowelSymbol('ɜ', 'e', VowelSymbol.position.central, VowelSymbol.height.openMid, false),
    new VowelSymbol('ɞ', 'e', VowelSymbol.position.central, VowelSymbol.height.openMid, true),
    new VowelSymbol('ʌ', 'v', VowelSymbol.position.back, VowelSymbol.height.openMid, false),
    new VowelSymbol('ɔ', 'o', VowelSymbol.position.back, VowelSymbol.height.openMid, true),

    // Near-open
    new VowelSymbol('æ', 'a', VowelSymbol.position.front, VowelSymbol.height.nearOpen, false),
    new VowelSymbol('ɐ', 'a', VowelSymbol.position.central, VowelSymbol.height.nearOpen, false),

    // Open
    new VowelSymbol('a', 'a', VowelSymbol.position.front, VowelSymbol.height.open, false),
    new VowelSymbol('ɶ', 'o', VowelSymbol.position.front, VowelSymbol.height.open, true),
    new VowelSymbol('ɑ', 'a', VowelSymbol.position.back, VowelSymbol.height.open, false),
    new VowelSymbol('ɒ', 'a', VowelSymbol.position.back, VowelSymbol.height.open, true),
];

window.consonants = consonants;
window.vowelsNoNear = vowels.filter(s => s.height != VowelSymbol.height.nearOpen && s.height != VowelSymbol.height.nearClose)
window.vowelsNear = vowels.filter(s => s.height == VowelSymbol.height.nearOpen || s.height == VowelSymbol.height.nearClose)
window.vowels = vowels;

window.symbols = window.consonants.concat(window.vowels);

window.findSymbol = function(type, arg1, arg2, arg3) {
    for (const sym of type === "consonant" ? window.consonants : window.vowels) {
        if (type === "consonant") {
            if (sym.mode === arg1 && sym.position === arg2 && sym.voiced === arg3)
                return sym;
        }
        else {
            if (sym.position === arg1 && sym.height === arg2 && sym.rounded === arg3)
                return sym;
        }
    }

    return null;
}

window.selectSymbols = function(syms) {
    const symbols = [];

    for (const s of syms) {
        let found;
        for (const r of window.symbols) {
            if (r.symbol == s) {
                found = r;
                break;
            }
        }
        if (!found) {
            console.error('symbol ' + s + ' not found');
            break;
        }

        symbols.push(found);
    }

    return symbols;
}

window.italianSymbols = window.selectSymbols("pbtdkɡfvszʃjwlʎmɱnŋɲraeiouɛɔ");
