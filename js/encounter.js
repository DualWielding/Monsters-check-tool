import { readJSONFile } from "./tools.js"

class Encounter {
	constructor(encounterData, callback, container) {
		
		this.monsterNames = encounterData;
		this.monsters = [];
	
		// Fetch the monsters and gather their decks
		this.monsterNames.forEach(name => {
			var monsterPath = document.location.pathname.replace("main.html", `monsters/${name}.json`);
		
			readJSONFile(monsterPath, txt => {
				this.monsters.push(JSON.parse(txt));
				// Once decks are gathered, calculate the odds
				if(this.monsters.length == this.monsterNames.length){
					this.calculateOdds(callback, container);
				}
			});
		});
	}
	
	calculateOdds(callback, container){
		this.scenarios = {};
		
		var counter = []
		var base = {
			"monsters": [],
			"summary": {
				"attack": 0,
				"defense": 0
			}
		};
		
		this.monsters.forEach(monster => {
			base.monsters.push({
				"attack" : monster.attack, 
				"defense": monster.defense,
				"name": monster.name
				});
			base.summary.attack += monster.attack;
			base.summary.defense += monster.defense;
			counter.push(0);
		});
				
		while( counter[this.monsters.length-1] < this.monsters[this.monsters.length - 1].deck.length ){
			var scenario = JSON.parse(JSON.stringify(base));
			scenario.odds = 1;
			
			var incremented = false;
			
			for(var idx in this.monsters){
				scenario.monsters[idx].cards = [this.monsters[idx].deck[counter[idx]]];
				scenario.summary.attack += this.monsters[idx].deck[counter[idx]].attack;
				scenario.summary.defense += this.monsters[idx].deck[counter[idx]].defense;
				scenario.odds *= 1.0 / this.monsters[idx].deck.length
				
				if(!incremented && counter[idx] < this.monsters[idx].deck.length - 1){
					counter[idx]++;
					incremented = true;
				} else if(!incremented && counter[idx] == this.monsters[idx].deck.length - 1){
					if(idx != this.monsters.length - 1){
						counter[idx] = 0;
					} else {
						counter[idx]++;
					}
				}
			}
			
			var id = `${scenario.summary.attack}:${scenario.summary.defense}`
			
			if(this.scenarios.hasOwnProperty(id)){
				this.scenarios[id].odds += scenario.odds;
				for(var monsterIdx in scenario.monsters){
					this.scenarios[id].monsters[monsterIdx].cards.push(scenario.monsters[monsterIdx].cards[0])
				}
			} else {
				this.scenarios[id] = scenario;
			}
			
			
		}
		
		callback(this.scenarios, container);
	};
}

export { Encounter };