function _showTab(tabs, id) {
    let found = false;
    for (const tab of tabs.children) {
        // skip tab bar
        if (!tab.classList.contains("tab")) continue;
        tab.hidden = tab.dataset.tabId !== id;
        if (!tab.hidden) found = true;
    }
    if (!found) throw new Error(`no such tab in ${tabs}: ${id}`);
}

window.addEventListener("load", () => {
    document.querySelectorAll(".tabs").forEach(tabs => {
        const tabBar = tabs.querySelector(".tab-bar");
        for (const n of tabBar.children) {
            if (n instanceof HTMLInputElement) {
                n.addEventListener("change", () => {
                    _showTab(tabs, n.dataset.tabId);
                });
            }
        }
    });
});
