let CURRENT_USER, COUNTER, CASES, selectedCases, RATING , OPTIONS;
const LOG_IN_FORM = document.querySelector(".create-user-form");
const MAIN = document.querySelector("#center-field");


function main(){
    fetchCases();
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
            <input type="submit" value="Play">
            </form><br>
        </div>
        <div class="column">
            <br><br><br><button id="creative-btn">Create New Case</button>
        </div>
    </div>`.trim();

    addPlayListener()
    addCreativeListener();
}

function addCreativeListener(){
    const creative = document.querySelector("#creative-btn");
    creative.addEventListener("click", event => {
       renderCreateForm();
    })
}
function renderCreateForm(){
    MAIN.style.width = '1200px'
    MAIN.innerHTML = `<div class="row">
    <div class="column">
        <h1 style="margin-top: 0px; margin-bottom: 8px;">Create A New Case</h1>
        <form id="case-form">
            <input type="text" name="title" float='left' style="width: 365px; font-size: large;" placeholder="Case Title">
            <input type="number" name="boost" float='right' style="width: 120px;" placeholder="Rating Boost"><br><br>
            <textarea style="resize: none; margin: 0px; width: 528px; height: 72px; font-size: large; background-color: rgb(240, 223, 148);" name="disclosure" placeholder="Case Disclosure"></textarea><br><br>
            <input type="text" placeholder="Option 1" float='left' style="width: 365px; font-size: large;" name="option1">
            <input type="number" placeholder="Rating Effect" float='right' style="width: 120px;" name="points1">
            <input type="text" placeholder="Option 2" float='left' style="width: 365px; font-size: large;" name="option2">
            <input type="number" placeholder="Rating Effect" float='right' style="width: 120px;" name="points2"><br><br>
            <input type="submit" float='left' value="Create Case">
            <button float='right' class='return-to-menu'>Return to Main Menu</button>
        </form>  
        </div>
        <div class="column">
        <h1>Delete Your Cases</h1>
        <ul id="delete-list">
            ${renderDeleteList()}
        </ul>
        </div>
        </div>
        `;
        addCreateFormListener();
        addDeleteListener();
}

function renderDeleteList(){
    let html = "";
    CURRENT_USER.attributes.creations.forEach(cas => {
        html += `<li><h2>${cas.title}</h2><button class="delete-btn" data-id="${cas.id}">Delete Case</button></li>`
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

function addCreateFormListener(){
    const createForm = document.querySelector("#case-form");
    createForm.addEventListener("submit", event => {
        event.preventDefault();
        const reqObj = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: event.target.title.value,
                rating_boost: event.target.boost.value,
                disclosure: event.target.disclosure.value,
                creator_id: CURRENT_USER.id,
                description1: event.target.option1.value,
                points1: event.target.points1.value,
                description2: event.target.option2.value,
                points2: event.target.points2.value
            })
        }

        fetch("http://localhost:3000/cases", reqObj)
        .then(resp => resp.json())
        .then(cas => {
            CASES.push(cas.data);
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
    playBtn.addEventListener('submit', function(e) {
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
        selectedCases = CASES.filter(cas => selectedIds.includes(cas.id));
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
            renderPlayOrCreate()
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
        MAIN.style = 'margin-top: 40px;'
        const ratDiv = document.querySelector("#rating");
        ratDiv.style = 'background: none'
        ratDiv.innerHTML = ``;
        MAIN.innerHTML = ''
        renderPlayOrCreate()
    })

}

main();