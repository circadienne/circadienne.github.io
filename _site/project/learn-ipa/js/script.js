$ = id => document.getElementById(id);

function generateTableVowelMap() {
    const buttons = [];

    let topRow = document.createElement("tr");
    window.tableVowelMap.appendChild(topRow);
    topRow.appendChild(document.createElement("th"));

    for (const key in VowelSymbol.position) {
        const c = VowelSymbol.position[key];
        let th = document.createElement("th");
        th.colSpan = 2;
        th.textContent = c[locale];
        topRow.appendChild(th);
    }

    for (const rowKey in VowelSymbol.height) {
        const height = VowelSymbol.height[rowKey];
        let row = document.createElement("tr");
        window.tableVowelMap.appendChild(row);
        let th = document.createElement("th");
        th.textContent = height[locale];
        row.appendChild(th);

        for (const colKey in VowelSymbol.position) {
            const pos = VowelSymbol.position[colKey];

            let td1 = document.createElement("td");
            row.appendChild(td1);
            let td2 = document.createElement("td");
            row.appendChild(td2);

            if ((height == VowelSymbol.height.mid && pos != VowelSymbol.position.central) ||
                (height == VowelSymbol.height.nearClose && pos == VowelSymbol.position.central) ||
                (height == VowelSymbol.height.nearOpen && pos == VowelSymbol.position.back) ||
                (height == VowelSymbol.height.open && pos == VowelSymbol.position.central)) {
                continue;
            }

            function addButton(rounded) {
                const sym = window.findSymbol("vowel", pos, height, rounded);
                if (sym === null)
                    return;

                let button = document.createElement("button");
                buttons.push(button);
                sym.button = button;
                button.dataset.type = "vowel";
                button.dataset.position = pos.value;
                button.dataset.height = height.value;
                button.dataset.rounded = rounded;
                button.title = sym.name;
                button.dataset.link = sym.link;
                button.textContent = rounded ? "O" : "–";
                (rounded ? td2 : td1).appendChild(button);
            }

            if (height != VowelSymbol.height.nearClose || pos != VowelSymbol.position.back) {
                addButton(false);
            }

            if (height != VowelSymbol.height.mid && height != VowelSymbol.height.nearOpen) {
                addButton(true);
            }
        }
    }

    buttons.forEach(b => {
        b.addEventListener('click', _ => {
            window.correct(b);
        });
    });
}

function generateTableConsonantMap() {
    const buttons = [];

    let topRow = document.createElement("tr");
    window.tableConsonantMap.appendChild(topRow);
    topRow.appendChild(document.createElement("th"));

    for (const key in ConsonantSymbol.position) {
        const c = ConsonantSymbol.position[key];
        let th = document.createElement("th");
        th.colSpan = 2;
        th.textContent = c[locale];
        topRow.appendChild(th);
    }

    for (const rowKey in ConsonantSymbol.mode) {
        const mode = ConsonantSymbol.mode[rowKey];
        let row = document.createElement("tr");
        window.tableConsonantMap.appendChild(row);
        let th = document.createElement("th");
        th.textContent = mode[locale];
        row.appendChild(th);

        for (const colKey in ConsonantSymbol.position) {
            const pos = ConsonantSymbol.position[colKey];

            let td1 = document.createElement("td");
            row.appendChild(td1);
            let td2 = document.createElement("td");
            row.appendChild(td2);

            function addButton(voiced) {
                const sym = window.findSymbol("consonant", mode, pos, voiced);
                if (sym === null)
                    return;

                let button = document.createElement("button");
                buttons.push(button);
                sym.button = button;
                button.dataset.type = "consonant";
                button.dataset.position = pos.value;
                button.dataset.mode = mode.value;
                button.dataset.voiced = voiced;
                button.title = sym.name;
                button.dataset.link = sym.link;
                button.textContent = voiced ? "~" : "|";
                (!voiced ? td1 : td2).appendChild(button);
            }

            addButton(false);
            addButton(true);
        }
    }

    buttons.forEach(b => {
        b.addEventListener('click', _ => {
            window.correct(b);
        });
    });
}

window.game = {
    currentSymbol: null,
    queue: null,
    untestedSymbols: [],
    learnedSymbols: [],
    toLearnSymbols: [],
    counter: 0,
    tries: 0,
    guessed: false
}

function startGame() {
    game.counter = 0;
    game.untestedSymbols = [].concat(window.consonants, window.vowelsNoNear, window.vowelsNear);
    game.toLearnSymbols = [];
    game.learnedSymbols = [];
    game.queue = [].concat(game.untestedSymbols);
    nextSymbol();
}

function nextSymbol() {
    resetAllButtons();
    game.guessed = false;
    game.tries = 0;
    if (!game.queue || !game.queue.length) {
        updateStatus("All symbols tested. Press Restart to try it again.");
        console.error("queue empty");
        return;
    }
    let ix = Math.floor(Math.random() * game.queue.length);
    game.currentSymbol = game.queue[ix];
    game.queue.splice(ix, 1);
    updateStatus("Select where the symbol goes.");
    $("status-selected").textContent = "";
    window.symbolDisplay.innerText = game.currentSymbol.symbol;
    window.counterDisplay.innerText = `${++game.counter}, ${game.queue.length} left; ${game.learnedSymbols.length} marked as learned, ${game.toLearnSymbols.length} marked as to learn`;
}

modifiedButtons = [];

function disableButton(button) {
    modifiedButtons.push(button);
    button.disabled = true;
    button.classList.add("button-incorrect")
}

function markCorrectButton(button) {
    modifiedButtons.push(button);
    button.classList.add("button-correct");
    switchToTab(button.dataset.type);
}

function resetAllButtons() {
    modifiedButtons.forEach(b => {
        b.disabled = false;
        b.classList.remove("button-correct");
        b.classList.remove("button-incorrect");
    });
    modifiedButtons.length = 0;
}

function correct(button) {
    if (game.guessed)
        return;

    game.tries++;
    let isCorrect = false;
    if (game.currentSymbol instanceof VowelSymbol
        && button.dataset.type == "vowel"
        && game.currentSymbol.height.value == button.dataset.height
        && game.currentSymbol.position.value == button.dataset.position
        && game.currentSymbol.rounded == (button.dataset.rounded == "true")
    )   isCorrect = true;
    else if (game.currentSymbol instanceof ConsonantSymbol
        && button.dataset.type == "consonant"
        && game.currentSymbol.mode.value == button.dataset.mode
        && game.currentSymbol.position.value == button.dataset.position
        && game.currentSymbol.voiced == (button.dataset.voiced == "true")
    )   isCorrect = true;

    if (isCorrect) {
        game.guessed = true;
        updateStatus(
            "Correct (" + pluralForm(game.tries, "try", "tries")
            + "). Use the buttons below to mark this symbol as learned or as to learn."
        );
        markCorrectButton(button);
        showCorrect();
    }
    else {
        updateStatus("Incorrect.");
        disableButton(button);
        updateSelected(button);
    }
};

function updateStatus(text) {
    $("status-info").textContent = text;
}

function showCorrect() {
    $("status-selected").textContent = "Correct: ";
    const wikipediaLink = $('status-selected').appendChild(document.createElement('a'));
    wikipediaLink.target = "_blank";
    wikipediaLink.href = game.currentSymbol.link;
    wikipediaLink.innerText = game.currentSymbol.name;
}

function updateSelected(button) {
    $("status-selected").textContent = 'You selected: ';
    const wikipediaLink = $('status-selected').appendChild(document.createElement('a'));
    wikipediaLink.target = "_blank";
    wikipediaLink.href = button.dataset.link;
    wikipediaLink.innerText = button.title;
}

function switchToTab(type) {
    document.querySelector(`button[data-tab-id=tab-${type}]`).click();
}

window.onload = function() {
    window.tableVowelMap = $("table-vowel-map");
    window.tableConsonantMap = $("table-consonant-map");
    window.symbolDisplay = $("symbol-display");

    window.counterDisplay = $("status-counter-display");
    window.cbSymtypeVowels = $('in-symtype-vowels');
    window.cbSymtypeConsonants = $('in-symtype-consonants');
    window.cbSymtypeNearOpenVowels = $('in-symtype-vowels')

    generateTableVowelMap();
    generateTableConsonantMap();
    startGame();

    $('button-restart').onclick = function() {
        startGame();
    }

    $('button-mark-learned').onclick = function() {
        game.learnedSymbols.push(game.currentSymbol);
        nextSymbol();
    };

    $('button-mark-to-learn').onclick = function() {
        game.toLearnSymbols.push(game.currentSymbol);
        nextSymbol();
    };

    $('button-reveal').onclick = function() {
        game.guessed = true;
        showCorrect();
        markCorrectButton(game.currentSymbol.button);
    };

    const tab1 = $("tab-vowel");
    const tab2 = $("tab-consonant");

    function setShown(tab, shown) {
        tab.hidden = !shown;
    }

    const tabButtons = Array.from(document.getElementById("tabs").children[0].children);

    tabButtons.forEach(function(b) {
        if (b instanceof HTMLInputElement) {
            b.addEventListener("click", function(_) {
                if (b.dataset.active != "true") {
                    const shown = b.dataset.tabId == tab1.id;
                    setShown(tab1, shown);
                    setShown(tab2, !shown);
                    b.dataset.hidden = false;
                    (b === tabButtons[0] ? tabButtons[1] : tabButtons[0]).hidden = true;
                }
            });
        }
    });
};
