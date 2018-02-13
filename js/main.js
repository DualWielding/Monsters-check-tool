import { Encounter } from "./encounter.js";
import { readJSONFile } from "./tools.js"

const body = document.querySelector('body');
var encountersPath = document.location.pathname.replace("main.html", "encounters.json")

readJSONFile(encountersPath, txt => {
	var encounterDatas = JSON.parse(txt);
	
	encounterDatas.forEach(function(encounterData){
		// Set DOM Container and title
		var encounterContainer = addNode(body, "section");
		addNode(addNode(encounterContainer, "h2"), "text", "Encounter");
		
		// Actually calculate the encounter
		var encounter = new Encounter(encounterData, showEncounter, encounterContainer);
	});
	
});

// Add every encounters


function showEncounter(scenarios, container){
	
	var mainTable = addNode(container, "table");
	var headRow = addNode(mainTable, "tr");
	var subHeadRow = addNode(mainTable, "tr");
	var scenariosArray = Object.values(scenarios)
		
	scenariosArray[0].monsters.forEach(function(monster){
		var headCell = addNode(headRow, "th");
		headCell.colSpan = "3";
		addNode(headCell, "text", monster.name);
		
		addNode(addNode(subHeadRow, "th"), "text", "Attack");
		addNode(addNode(subHeadRow, "th"), "text", "Defense");
		addNode(addNode(subHeadRow, "th"), "text", "Cards");
	});
	
	var summaryCell = addNode(headRow, "th");
	addNode(summaryCell, "text", "Summary");
	summaryCell.colSpan = "2";
	addNode(addNode(subHeadRow, "th"), "text", "Attack");
	addNode(addNode(subHeadRow, "th"), "text", "Defense");
	
	var oddsCell = addNode(headRow, "th");
	addNode(oddsCell, "text", "Odds");
	
	scenariosArray.sort(sortByOdds).forEach(function(scenario){
		var row = addNode(mainTable, "tr");
		
		scenario.monsters.forEach(function(monster){
			addNode(addNode(row, "td"), "text", `${monster.attack}`);
			addNode(addNode(row, "td"), "text", `${monster.defense}`);
			var cardsCell = addNode(row, "td");
			monster.cards.forEach(function(card){
				addNode(cardsCell, "text", `atk: ${card.attack} | def: ${card.defense}`);
				addNode(cardsCell, "br");
			});
		});
		
		addNode(addNode(row, "td"), "text", `${scenario.summary.attack}`)
		addNode(addNode(row, "td"), "text", `${scenario.summary.defense}`)
		addNode(addNode(row, "td"), "text", `${scenario.odds * 100}%`)
	});
	
	// Avg
	var averageDefRow = addNode(mainTable, "tr");
	var averageAtkRow = addNode(mainTable, "tr");
	addNode(addNode(averageDefRow, "th"), "text", "Average Defense");
	addNode(addNode(averageDefRow, "td"), "text", `${scenariosArray.reduce((acc, sc) => (acc + sc.summary.defense * sc.odds), 0 )}`);
	addNode(addNode(averageAtkRow, "th"), "text", "Average Attack");
	addNode(addNode(averageAtkRow, "td"), "text", `${scenariosArray.reduce((acc, sc) => (acc + sc.summary.attack * sc.odds), 0 )}`);
	
	// Median
	var medianDefRow = addNode(mainTable, "tr");
	var medianAtkRow = addNode(mainTable, "tr");
	
	// Q1
	addNode(addNode(medianDefRow, "th"), "text", "Q1 Defense");
	addNode(addNode(medianDefRow, "td"), "text", `${findQuartile(0.25, scenariosArray.sort(sortByDefense)).summary.defense}`);
	addNode(addNode(medianAtkRow, "th"), "text", "Q1 Attack");
	addNode(addNode(medianAtkRow, "td"), "text", `${findQuartile(0.25, scenariosArray.sort(sortByAttack)).summary.attack}`);
	
	// Q2
	addNode(addNode(medianDefRow, "th"), "text", "Median Defense");
	addNode(addNode(medianDefRow, "td"), "text", `${findQuartile(0.5, scenariosArray.sort(sortByDefense)).summary.defense}`);
	addNode(addNode(medianAtkRow, "th"), "text", "Median Attack");
	addNode(addNode(medianAtkRow, "td"), "text", `${findQuartile(0.5, scenariosArray.sort(sortByAttack)).summary.attack}`);
	
	// Q3
	addNode(addNode(medianDefRow, "th"), "text", "Q3 Defense");
	addNode(addNode(medianDefRow, "td"), "text", `${findQuartile(0.75, scenariosArray.sort(sortByDefense)).summary.defense}`);
	addNode(addNode(medianAtkRow, "th"), "text", "Q3 Attack");
	addNode(addNode(medianAtkRow, "td"), "text", `${findQuartile(0.75, scenariosArray.sort(sortByAttack)).summary.attack}`);
	
}

function findQuartile(percentage, scenariosArray){
	var odds = 0;
	var i = 0;
	while( odds < percentage ){
		odds += scenariosArray[i].odds;
		i++;
	}
	return scenariosArray[i-1];
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

function sortByAttack(a, b){
	return a.summary.attack - b.summary.attack;
}

function sortByDefense(a, b){
	return a.summary.defense - b.summary.defense;
}