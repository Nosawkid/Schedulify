import groupSports from "./sports.js";

const select = document.getElementById("sports-select")
function fillSelect() {
    let count = 0;
    for (let i of groupSports) {
        const option = document.createElement("option")
        option.id = `sport-${count}`
        count++;
        option.value = i;
        option.textContent = i;
        select.appendChild(option)
    }

}

function changeTitle(e) {
    const titles = document.getElementsByClassName("sport-name")
    const selectedTitle = e.target.value
    if (selectedTitle) {
        for (let i of titles) {
            i.textContent = selectedTitle;
        }
    }

}

const handleForm = e =>{
    e.preventDefault();
    const numOfTeams = document.getElementById("number-of-teams").value
    const scheduleType = document.getElementById("schedule-type").value
    const sport = document.querySelector("#sports-select").value
    window.location.href =  `schedule.html?numOfTeams=${encodeURIComponent(numOfTeams)}&sport=${encodeURIComponent(sport)}&type=${encodeURIComponent(scheduleType)}`
}


document.addEventListener("DOMContentLoaded",()=>{
    fillSelect()
    select.addEventListener("change", changeTitle)
    const form = document.querySelector("#type-form")
    form.addEventListener("submit",handleForm)
})