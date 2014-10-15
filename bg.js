//The defualt root download directory for chrome
var defaultDir = "Downloads";
//The query option for the update data file
var queryOption = {
    orderBy : ['-startTime'] ,
    limit : 50
};

var table = {};

/*
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
    suggest({filename: "test/" + item.filename });
    
}); */
//chrome.storage.sync.set({"data":JSON.stringify({})},function() {});
chrome.storage.sync.get("data",function (obj) {
    //first get the table 
    console.log(obj);
    if(obj && obj["data"]) {
	table = JSON.parse(obj["data"]);
    }
    init();
});

function init(){
//read the history mapping
//start by fetching the  downloads histroy
    chrome.downloads.search(queryOption,function(results) {
	for(var i = 0;i < results.length;++i) {
	    var path = results[i].filename.trim();
	    var splices = path.split(defaultDir);
	    if(splices.length <= 1) {
		//which means it may not in the Downloads directory,so ignore it
		continue;
	    }

	    path = splices[1];splices = path.split("/"); 
	    var filename = splices[splices.length-1];
	    var dir = path.split(filename)[0];

	    if(table[filename]) {
		if(!table[filename][dir]) {
		    table[filename][dir] = 1;
		}
	    }else {
		table[filename] = {};
		table[filename][dir] = 1;

	    }
	}
	chrome.storage.sync.set({"data":JSON.stringify(table)}, function() { console.log("done");});
    });
}



