import{ Encounter } from "./encounter.js";

const body = document.querySelector('body');
const encounters_number = 2;

// Add every encounters
for( var i = 1 ; i <= encounters_number ; i++){
	var encounterContainer = addNode(body, "section");
	addNode(addNode(encounterContainer, "h2"), "text", `Encounter ${i}`);
	var encounter = new Encounter(i, showEncounter, encounterContainer);
}

function showEncounter(scenarios, container){
	
	var mainTable = addNode(container, "table");
	var headRow = addNode(mainTable, "tr");
	var subHeadRow = addNode(mainTable, "tr");
		
	Object.values(scenarios)[0].monsters.forEach(function(monster){
		var headCell = addNode(headRow, "th");
		headCell.colSpan = "3";
		addNode(headCell, "text", monster.name);
		
		addNode(addNode(subHeadRow, "th"), "text", "Attack");
		addNode(addNode(subHeadRow, "th"), "text", "Defense");
		addNode(addNode(subHeadRow, "th"), "text", "Card");
	});
	
	var summaryCell = addNode(headRow, "th");
	addNode(summaryCell, "text", "Summary");
	summaryCell.colSpan = "2";
	addNode(addNode(subHeadRow, "th"), "text", "Attack");
	addNode(addNode(subHeadRow, "th"), "text", "Defense");
	
	var oddsCell = addNode(headRow, "th");
	addNode(oddsCell, "text", "Odds");
	
	Object.values(scenarios).sort(sortByOdds).forEach(function(scenario){
		var row = addNode(mainTable, "tr");
		
		scenario.monsters.forEach(function(monster){
			addNode(addNode(row, "td"), "text", `${monster.attack}`);
			addNode(addNode(row, "td"), "text", `${monster.defense}`);
			addNode(addNode(row, "td"), "text", `atk(${monster.card.attack}), def(${monster.card.defense})`);
		});
		
		addNode(addNode(row, "td"), "text", `${scenario.summary.attack}`)
		addNode(addNode(row, "td"), "text", `${scenario.summary.defense}`)
		addNode(addNode(row, "td"), "text", `${scenario.odds * 100}%`)
	});
}

function addNode(to, type, txt=null){
	var node
	if(type == "text"){
		node = document.createTextNode(txt);
	} else {
		node = document.createElement(type);
	}
	to.appendChild(node);
	return node;
}

function sortByOdds(a, b){
	return a.odds - b.odds;
}