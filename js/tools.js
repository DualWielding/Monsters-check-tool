function readJSONFile(path, callback){
	var file = new XMLHttpRequest();
	file.overrideMimeType("application/json");
	file.open("GET", path, true);
	file.onreadystatechange = function(){
		if(file.readyState === 4 && file.status == "200") {
			callback(file.responseText);
		}
	}
	file.send(null);
}

export { readJSONFile };