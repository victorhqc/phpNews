(function(){
	"use strict";
	var Init = function(){
		this.gatherData(function(r){
			console.log('r', r);
		});
	};

	//Looks up for important information like tags
	Init.prototype.gatherData = function(callback) {
		var j = {file:'mainInfo.php', data: {}, callback:callback};
		App.current.getServer(j);
	};

	var i = new Init();
})();