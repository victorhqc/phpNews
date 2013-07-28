var App;

(function(){
	"use strict";
	var Init = function(){
		//Gets the initial modules
		var I = this;
		new Vi({url:'data.json', response:'json'}).server(function(r){
			var j = {name: 'My App', modules:r.modules, div:'#content'};
			App = new AppSystem(j);
			App.init(function(){
				//Checks if the user is logged in.
				I.checkCredentials();
			});
		});
	}

	Init.prototype.checkCredentials = function() {
		new Vi({url:'members.php', response: 'json'}).server(function(r){
			if(r.success === true){
				//Access to the platform
				App.getModule('backend');
			}else{
				//Login required
				App.getModule('login');
			}

			App.current.start(function(){});
		});
	};

	var i = new Init();

})();