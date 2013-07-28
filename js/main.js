var App;

(function(){
	"use strict";
	var Init = function(){
		//Gets the initial modules
		var I = this;
		var lang = this.browserLanguage();
		new Vi({url:'data.json', response:'json'}).server(function(r){
			var j = {name: 'My App', modules:r.modules, div:'#content', currentLang: lang};
			App = new AppSystem(j);
			App._data = r;
			App.init(function(){
				//Checks if the user is logged in.
				I.checkCredentials();
			});
		});
	}

	Init.prototype.browserLanguage = function() {
		var lang = navigator.language || navigator.userLanguage;
		lang = lang.match(/([a-z]+)/gi);
		if(lang !== null){
			lang = lang[0];
		}

		var l = '';
		switch(lang){
			case 'es':
				l = lang;
			break;
			default:
			case 'en':
				l = lang;
			break;
		}

		return l;
	};

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