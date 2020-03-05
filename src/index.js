let CURRENT_USER, COUNTER, CASES, selectedCases, RATING , OPTIONS, BUNDLES, OPTIONS_COUNTER;
const LOG_IN_FORM = document.querySelector(".create-user-form");
const MAIN = document.querySelector("#center-field");


function main(){
    fetchCases();
    fetchBundles();
    addFormListener();
    addButtonListeners()
}


function addFormListener(){
    LOG_IN_FORM.addEventListener("submit", event => {
        event.preventDefault();
        const name = event.target[0].value;
        const title = event.target[1].value

        const reqObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
               name,
               title 
            })
        }

        fetch("http://localhost:3000/users", reqObj)
        .then(resp => resp.json())
        .then(userData => {
            CURRENT_USER = userData.data;
            renderPlayOrCreate();
        })
    })
}


function renderPlayOrCreate(){
    MAIN.innerHTML = `<div class="row">
        <div class="column">
            <label style='font-size: medium' for='play-form'>Select Cases<br>(Hold cmd to select multiple)</label>
            <form id="play-form">
            ${renderCaseBoxes()}<br><br>
            ${renderBundles()}
            <input type="submit" value="Play">
            </form><br>
        </div>
        <div class="column">
            <br><br><br><button id="creative-btn">Creator Mode</button>
        </div>
    </div>`.trim();

    addPlayListener()
    addCreativeListener();
}

function renderBundles(){
    let html = "";
    BUNDLES.forEach(bundle => {
        html += `<label for="bundle${bundle.id}">${bundle.theme}</label><input id="bundle${bundle.id}" data-id="${bundle.id}" type="checkbox" name="bundles"><br>`
    })
    return html
}

function addCreativeListener(){
    const creative = document.querySelector("#creative-btn");
    creative.addEventListener("click", event => {
       renderCreateForm();
    })
}
function renderCreateForm(){
    OPTIONS_COUNTER = 3;
    MAIN.style.width = '1200px'
    MAIN.style.height = '450px'
    MAIN.style.marginTop = '0px'
    MAIN.innerHTML = `<div style="height: 225px;" class="row">
    <div class="column">
        <h2 style="margin-top: 0px; margin-bottom: 8px;">Create A New Case</h2>
        <form id="case-form">

           <input type="text" name="title" float='left' style="width: 365px; font-size: small; padding: 0px; margin-bottom: 4px;" placeholder="Case Title">
            <input type="number" name="boost" float='right' style="width: 120px; font-size: small; padding: 0px;" placeholder="Rating Boost"><br>
            <textarea style="resize: none; margin: 0px; width: 475px; height: 45px; font-size: small; padding: 0px; background-color: rgb(240, 223, 148);" name="disclosure" placeholder="Case Disclosure"></textarea><br>
            <div id="options">
                <input type="text" placeholder="Option 1" float='left' style="width: 365px; font-size: small; padding: 0px;" name="descriptions">
                <input type="number" placeholder="Rating Effect" float='right' style="width: 120px; font-size: small; padding: 0px;" name="points">
                <input type="text" placeholder="Consequence" name="alerts">
                <input type="text" placeholder="Option 2" float='left' style="width: 365px; font-size: large;" name="descriptions">
                <input type="number" placeholder="Rating Effect" float='right' style="width: 120px;" name="points"><br><br>
                <input type="text" placeholder="Consequence" name="alerts">
            </div>
            <button id="add-options">Add Options</button><br><br>
            <input type="submit" float='left' style="font-size: large" value="Create Case">
            <button float='right' style="font-size: large" class='return-to-menu'>Return to Main Menu</button>
            </form>  

        </div>
        <div class="column" style='height: 225px'>
        <h2 style='margin-top: 0px; margin-bottom: 8px'>Delete Your Cases</h2>
        <ul style='height: 215px; width: 520px; overflow: scroll; margin-top: 0px; margin-bottom: 0px' id="delete-list">
            ${renderDeleteList()}
        </ul>
        </div>
        </div>
        <div style="height: 225px;" class="row">
            <div class="column">
                <h2 style='margin-top: 0px; margin-bottom: 8px'>Bundle Your Cases With a Theme</h2>
                <form id="bundle-form">
                    <input type="text" style="width: 365px; font-size: small; padding: 0px; margin-bottom: 4px;" placeholder="Bundle Theme" name="theme">
                    ${renderCaseBoxes()}<br><br>
                    <input type="submit" style='font-size: large' value="Bundle">
                </form>
            </div>
            <div class="column">
                <h2 style='margin-top: 0px; margin-bottom: 8px'>Remove Bundles</h2>
                <ul style='height: 215px; width: 520px; overflow: scroll; margin-top: 0px; margin-bottom: 0px' id="delete-bundle-list">
                ${renderDeleteBundleList()}
                </ul>
            </div>
        </div>
        `;
        addCreateFormListener();
        addDeleteListener();
        addBundleListener();
        addDeleteBundleListener();
        addOptionsListener();
}

function addOptionsListener(){
    const optionsBtn = document.querySelector("#add-options");
    const optionsDiv = document.querySelector("#options")
    optionsBtn.addEventListener("click", event => {
        event.preventDefault();
        optionsDiv.innerHTML += `
        <input type="text" placeholder="Option ${OPTIONS_COUNTER}" float='left' style="width: 365px; font-size: large;" name="descriptions">
        <input type="number" placeholder="Rating Effect" float='right' style="width: 120px;" name="points">
        <input type="text" placeholder="Consequence" name="alerts">
        `.trim();
        OPTIONS_COUNTER++;
    })
}

function addBundleListener(){
    const bunFor = document.querySelector("#bundle-form");
    const caseSelection = document.getElementById('multiselect')
    bunFor.addEventListener('submit', function(e) {
        e.preventDefault()


        function getSelectValues(select) {
            let result = [];
            let options = select && select.options;
            let opt;
          
            for (let i=0, iLen=options.length; i<iLen; i++) {
              opt = options[i];
          
              if (opt.selected) {
                result.push(opt.value || opt.text);
              }
            }
            return result;
        }
        const selectedIds = getSelectValues(caseSelection)

        const reqObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                theme: event.target.theme.value,
                case_ids: selectedIds
            })
        }

        fetch("http://localhost:3000/bundles", reqObj)
        .then(resp => resp.json())
        .then(bundle => {
            BUNDLES.push(bundle.data.attributes);
            renderCreateForm();
        })
    })
}
function renderDeleteBundleList(){
    let html = "";
    BUNDLES.forEach(bun => {
        if (bun.id != 4){
            html += `<li style='margin-bottom: 5px'><p style='float: left; margin-top: 0px; margin-bottom: 0px'>${bun.theme}</p><button style='float: right' class="delete-btn" data-id="${bun.id}">Remove Bundle</button></li>`
        }
    })
    return html
}


function renderDeleteList(){
    let html = "";
    CURRENT_USER.attributes.creations.forEach(cas => {
        html += `<li style='margin-bottom: 5px'><p style='float: left; margin-top: 0px; margin-bottom: 0px'>${cas.title}</p><button style='float: right' class="delete-btn" data-id="${cas.id}">Delete Case</button><br></li>`
    })
    return html
}

function fetchCurrentUser(myFunc){
    fetch(`http://localhost:3000/users/${CURRENT_USER.id}`)
        .then(resp => resp.json())
        .then(userData => {
            CURRENT_USER = userData.data;
            myFunc();
        })
}

function addDeleteListener(){
    const deleteList = document.querySelector("#delete-list");
    deleteList.addEventListener("click", event => {
        if (event.target.className === "delete-btn"){
            const caseId = parseInt(event.target.dataset.id)
            fetch(`http://localhost:3000/cases/${caseId}`, {method: "DELETE"})
            .then(resp => {
                fetchCurrentUser(renderCreateForm)
            })
            
            
        }
    })
}

function addDeleteBundleListener(){
    const delBunLis = document.querySelector("#delete-bundle-list")
    delBunLis.addEventListener("click", event => {
        if (event.target.className === "delete-btn"){
            const bundleId = parseInt(event.target.dataset.id)
            fetch(`http://localhost:3000/bundles/${bundleId}`, {method: "DELETE"})
            .then(resp => {
                fetch("http://localhost:3000/bundles")
                .then(resp => resp.json())
                .then(bundles => {
                    BUNDLES = bundles.data.map(bundle => bundle.attributes);
                    renderCreateForm();
                })
            })
        }
    })
}

function addCreateFormListener(){
    const createForm = document.querySelector("#case-form");
    createForm.addEventListener("submit", event => {
        event.preventDefault();
        const descriptions = [], points = [], alerts = [];
        event.target.descriptions.forEach(description => descriptions.push(description.value)),
        event.target.points.forEach(point => points.push(point.value)),
        event.target.alerts.forEach(alert => alerts.push(alert.value))
        const reqObj = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: event.target.title.value,
                rating_boost: event.target.boost.value,
                disclosure: event.target.disclosure.value,
                creator_id: CURRENT_USER.id,
                descriptions: descriptions,
                all_points: points,
                alerts: alerts
            })
        }

        fetch("http://localhost:3000/cases", reqObj)
        .then(resp => resp.json())
        .then(cas => {
            CASES.push(cas.data);
            OPTIONS = CASES.map(cas => cas.attributes.options).flat();
            MAIN.style = 'margin-top: 40px;'
            MAIN.innerHTML = ''
            fetchCurrentUser(renderPlayOrCreate);
        })
    })
}

function fetchCases(){
    fetch("http://localhost:3000/cases")
    .then(resp => resp.json())
    .then(cases => {
        CASES = cases.data;
        OPTIONS = CASES.map(cas => cas.attributes.options).flat();
        
    })
}

function fetchBundles(){
    fetch("http://localhost:3000/bundles")
    .then(resp => resp.json())
    .then(bundles => {
        BUNDLES = bundles.data.map(bundle => bundle.attributes);
    })
}

function renderCaseBoxes(){
    let html = "<select id='multiselect' multiple>"

    CASES.forEach((cas) => {
        html += `<option id="case${cas.id}" name="case" value="${cas.id}">${cas.attributes.title}</option>`
    })

    html += "</select>"
    return html
}

function addPlayListener() {
    const playBtn = document.getElementById('play-form')
    const caseSelection = document.getElementById('multiselect')
    playBtn.addEventListener('submit', function(event) {
        event.preventDefault()


        function getSelectValues(select) {
            let result = [];
            let options = select && select.options;
            let opt;
          
            for (let i=0, iLen=options.length; i<iLen; i++) {
              opt = options[i];
          
              if (opt.selected) {
                result.push(opt.value || opt.text);
              }
            }
            return result;
        }
        const selectedIds = getSelectValues(caseSelection)

        const selectedBundles = [];
        if (event.target.bundles.length){
            event.target.bundles.forEach(bundle => {
                if (bundle.checked){
                    selectedBundles.push(BUNDLES.find(bund => {return bund.id == bundle.dataset.id}))
                }
            })
        } else {
            if (event.target.bundles.checked){
                selectedBundles.push(BUNDLES.find(bund => {return bund.id == event.target.bundles.dataset.id}))
            }
        }
    

        selectedBundles.forEach(bundle => {
            bundle.cases.forEach(cas => {
                selectedIds.push(cas.id.toString())
            })
        })

        
        selectedCases = CASES.filter(cas => {return selectedIds.includes(cas.id)});

        COUNTER = 0;
        RATING = selectedCases.reduce((total, cas) => {return total + parseInt(cas.attributes.rating_boost)}, 0);
        renderRating();
        renderCases(selectedCases);
    })
}


function renderCases(selectedCases){
    if (RATING <= 0){
        renderLoseScreen();
    } else if (COUNTER === selectedCases.length){
        renderWinScreen();
    } else {
        renderCase(selectedCases[COUNTER]);
    }
}

function renderCase(cas){
    COUNTER++;
    MAIN.innerHTML = `
    <img style="width: 200px; height: auto;) id="case-pic" src=${cas.attributes.picture}>
    <h2>${cas.attributes.title}</h2>
    <p>${cas.attributes.disclosure}</p><br>
    ${renderOptions(cas)}`
}

function renderOptions(cas){
    let html = "";
    cas.attributes.options.forEach(option => {
        html += `<button style='margin-left: 5px;margin-right: 5px' class="option-btn" data-id="${option.id}">${option.description}</button>`
    })
    return html
}

function addButtonListeners(){
    MAIN.addEventListener("click", event => {
        if (event.target.className === "option-btn"){
            const optionId = parseInt(event.target.dataset.id);
            const selectedOption = OPTIONS.find(opt => { return opt.id === optionId})
            alert(selectedOption.alert)
            updateRating(selectedOption.points);
            renderCases(selectedCases);

        } else if (event.target.className === "return-to-menu"){
            MAIN.style = 'margin-top: 40px;'
            MAIN.innerHTML = ''
            fetch("http://localhost:3000/cases")
            .then(resp => resp.json())
            .then(cases => {
                CASES = cases.data;
                OPTIONS = CASES.map(cas => cas.attributes.options).flat();
                renderPlayOrCreate()
            })
        }
    })
}

function updateRating(pts){
    RATING += pts;
    renderRating();
}

function renderRating(){
    const ratDiv = document.querySelector("#rating");
    ratDiv.style = `background: radial-gradient(rgba(240, 223, 148, 1), rgba(240, 223, 148, .85));
        width: 320px;
        border-radius: 25px;
        text-align: center;
        height: 45px;
        padding-top: 5px;
    `
    ratDiv.innerHTML = `<h1 style='margin-top: 0px'>Approval Rating: ${RATING}</h1>`;
}
 

function renderWinScreen() {
    MAIN.style = 'margin-top: 0px;'
    MAIN.innerHTML = `<h2 style='margin-top: 0px'>Congratulations ${CURRENT_USER.attributes.title} ${CURRENT_USER.attributes.name}, you have won.</h2>
    <img id="win-gif" src="assets/win.gif" alt="winning"><br><br>
    <button id='start-over-button'>Start Over</button>`
    addStartOverListener()
}

function renderLoseScreen() {
    MAIN.style = 'margin-top: 0px;'
    MAIN.innerHTML = `<h2 style='margin-top: 0px'>Sorry ${CURRENT_USER.attributes.title} ${CURRENT_USER.attributes.name}, you have lost and been dethroned. Your family has probably been killed.</h2>
    <img id="lose-gif" src="assets/lose.gif" alt="winning"><br><br>
    <button id='start-over-button'>Start Over</button>`
    addStartOverListener()
}

function addStartOverListener() {
    let startOver = document.getElementById('start-over-button')
    startOver.addEventListener('click', function(e) {
        MAIN.style = 'margin-top: 10px;'
        const ratDiv = document.querySelector("#rating");
        ratDiv.style = 'background: none'
        ratDiv.innerHTML = ``;
        MAIN.innerHTML = ''
        renderPlayOrCreate()
    })

}

main();