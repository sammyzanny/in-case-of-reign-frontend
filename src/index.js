let CURRENT_USER;
let COUNTER = 0;
const LOG_IN_FORM = document.querySelector(".create-user-form");
const MAIN = document.querySelector("#center-field");
let CASES;

function main(){
    fetchCases();
    addFormListener();
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
            const rulings = userData.data.attributes.rulings;
            
            renderPlayOrCreate();
            

        })
    })
}

function renderPlayOrCreate(){
    MAIN.innerHTML = `
    <form id="play-form">
        ${renderCaseBoxes()}<br>
        <input type="submit" value="Play">
    </form><br>
    <button id="creative-btn">Creative Mode</button>`.trim();
    addCreativeListener();
}

function addCreativeListener(){
    const creative = document.querySelector("#creative-btn");
    creative.addEventListener("click", event => {
        MAIN.innerHTML = `
        <h1>Create A New Case</h1>
        <form id="case-form">
            <input type="text" name="title" placeholder="Case Title">
            <input type="number" name="boost" placeholder="Rating Boost" step="10"> 
            <textarea name="disclosure" placeholder="Case Disclosure"></textarea>
            <input type="text" placeholder="Option 1" name="option1">
            <input type="number" placeholder="Option 1 Rating Effect" step="10" name="points1">
            <input type="text" placeholder="Option 2" name="option2">
            <input type="number" placeholder="Option 2 Rating Effect" step="10" name="points2"> 
            <input type="submit" value="Create Case">
        </form>  `;
        addCreateFormListener();
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
        .then(cas => console.log(cas))
    })
}

function fetchCases(){
    fetch("http://localhost:3000/cases")
    .then(resp => resp.json())
    .then(cases => {
        console.log(cases)
        CASES = cases.data;
        
    })
}

function renderCaseBoxes(){
    let html = "";
    CASES.forEach((cas) => {
        html += `<label style="color:white" for="case${cas.id}">${cas.attributes.title}</label><input id="case${cas.id}" type="checkbox" name="case" value="${cas.id}"><br> `
    })
    return html
}
main();