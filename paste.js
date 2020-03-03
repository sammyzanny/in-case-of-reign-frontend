
function addPlayListener(){
    const playForm = document.querySelector("#play-form")
    playForm.addEventListener("submit", event => {
        const selectedCases = CASES.filter(cas => selectedIds.include(cas.id));
        COUNTER = 0;
        renderCases(selectedCases);
    })
}

function renderCases(selectedCases){
    if (COUNTER === selectedCases.length){
        renderWinScreen();
    } else if (CURRENT_USER.attributes.rating =< 0){
        renderLoseScreen();
    } else {
        renderCase(selectedCases[COUNTER]);
    }
}

function renderCase(cas){
    MAIN.innerHTML = `
    <textarea readonly>${cas.attributes.disclosure}</textarea><br>
    ${renderOptions(cas)}`
}

function renderOptions(cas){
    let html = "";
    cas.attributes.options.forEach(option => {
        html += `<button id="${cas.attributes.options[0].id}">${cas.attributes.options[0]}</button>`
    })
    return html
}