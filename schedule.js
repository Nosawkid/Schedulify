import groupSports from "./sports.js";

const getParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        numOfTeams: parseInt(params.get("numOfTeams")),
        sport: params.get("sport"),
        type: params.get("type"),
    };
};

const fillArray = (num) => {
    return Array.from({ length: num }, (_, i) => `Team ${i + 1}`);
};

const rotateTeams = (teams) => {
    const firstTeam = teams[0];
    for (let i = 0; i < teams.length - 1; i++) {
        teams[i] = teams[i + 1];
    }
    teams[teams.length - 1] = firstTeam;
};

const simulateLeague = (params) => {
    const { numOfTeams } = params;
    const teams = fillArray(numOfTeams);
    const fixedTeam = teams[0];
    const teamsToRotate = teams.slice(1);
    const totalWeeks = Math.floor((numOfTeams * (numOfTeams - 1)) / 2) / Math.floor(numOfTeams / 2);
    const fixtures = [];

    for (let i = 0; i < totalWeeks; i++) {
        const weekMatches = [{ team1: fixedTeam, team2: teamsToRotate[0] }];
        for (let j = 1; j < teamsToRotate.length; j += 2) {
            if (j + 1 < teamsToRotate.length) {
                weekMatches.push({ team1: teamsToRotate[j], team2: teamsToRotate[j + 1] });
            }
        }
        fixtures.push(weekMatches);
        rotateTeams(teamsToRotate);
    }
    return [teams, fixtures];
};

const teamNames = {}; // Stores updated team names

const renderTeams = (teams) => {
    const tbody = document.getElementById("teams");
    tbody.innerHTML = "";

    teams.forEach((team, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td contenteditable="true" class="team-name" data-index="${index}">${team}</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listener for editing team names
    document.querySelectorAll(".team-name").forEach((cell) => {
        cell.addEventListener("input", (e) => {
            const index = parseInt(e.target.getAttribute("data-index"));
            teamNames[index] = e.target.textContent.trim();
            updateFixtures();
        });
    });
};

const updateFixtures = () => {
    const fixtureCards = document.querySelectorAll(".fixture-card");

    fixtureCards.forEach((card) => {
        const team1Index = parseInt(card.getAttribute("data-team1"));
        const team2Index = parseInt(card.getAttribute("data-team2"));

        const team1 = teamNames[team1Index] || `Team ${team1Index + 1}`;
        const team2 = teamNames[team2Index] || `Team ${team2Index + 1}`;

        card.querySelector(".team1").textContent = team1;
        card.querySelector(".team2").textContent = team2;
    });
};

const renderFixtures = (fixtures) => {
    const container = document.getElementById("fixtures");
    container.innerHTML = "";

    let weekNumber = 1;
    const flatFixtures = fixtures.flat();

    for (let i = 0; i < flatFixtures.length; i += 3) {
        const weekDiv = document.createElement("div");
        weekDiv.className = "mb-4";

        const weekHeader = document.createElement("h4");
        weekHeader.textContent = `Week ${weekNumber++}`;
        weekDiv.appendChild(weekHeader);

        const fixtureRow = document.createElement("div");
        fixtureRow.className = "row";

        for (let j = i; j < i + 3 && j < flatFixtures.length; j++) {
            const fixture = flatFixtures[j];

            const colDiv = document.createElement("div");
            colDiv.className = "col-md-4 mb-3";

            const card = document.createElement("div");
            card.className = "card shadow-sm fixture-card";
            card.setAttribute("data-team1", fixture.team1.match(/\d+/)[0] - 1);
            card.setAttribute("data-team2", fixture.team2.match(/\d+/)[0] - 1);

            const cardBody = document.createElement("div");
            cardBody.className = "card-body text-center";

            const team1 = document.createElement("h5");
            team1.className = "team1";
            team1.textContent = fixture.team1;

            const vs = document.createElement("p");
            vs.textContent = "vs";
            vs.className = "my-2";

            const team2 = document.createElement("h5");
            team2.className = "team2";
            team2.textContent = fixture.team2;

            cardBody.appendChild(team1);
            cardBody.appendChild(vs);
            cardBody.appendChild(team2);
            card.appendChild(cardBody);
            colDiv.appendChild(card);
            fixtureRow.appendChild(colDiv);
        }

        weekDiv.appendChild(fixtureRow);
        container.appendChild(weekDiv);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const parameters = getParams();
    document.getElementById("sport-name").textContent = parameters.sport;
    document.getElementById("team-nums").textContent = parameters.numOfTeams;
    document.getElementById("schedule-type").textContent = parameters.type === "rr" ? "Round Robin" : "";

    const [teams, fixtures] = simulateLeague(parameters);
    renderTeams(teams);
    renderFixtures(fixtures);
});
