let CURRENT_USER;
const LOG_IN_FORM = document.querySelector(".create-user-form")

function main(){
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
            const rulings = userData.attributes.rulings
            LOG_IN_FORM.display = "none";
            if (rulings.length === 0){
                renderPlayOrCreate(user)
            }
            else if (rulings.length > 0){
                renderGameSesh();
            }

        })
    })
}

function renderPlayOrCreate(){
    
}

main();