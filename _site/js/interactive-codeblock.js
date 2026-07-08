Array.from(document.getElementsByClassName("code-interactive")).forEach(el => {
    const section = el.appendChild(document.createElement("section"));
    section.classList.add("code-info-panel");
    Array.from(el.querySelectorAll(".code-info")).forEach(el => {
        el.onclick = () => section.innerHTML = el.dataset.info;
    });
});
