(function(){
	"use strict";
	var Init = function(){
		this.initialFunctionality();
	}

	Init.prototype.initialFunctionality = function() {
		var form = document.getElementById('form-login');

		var T = this;
		form.addEventListener('submit', function(e){
			if(e.preventDefault){
				e.preventDefault();
			}
			e.returnValue = false;

			T.sendRequest();
		}, false);
	};

	Init.prototype.sendRequest = function(){
		var btn = document.getElementById('login-button');
		btn.setAttribute('disabled', 'disabled');

		var data = {};
		var inputs = document.querySelectorAll('#form-login fieldset input');
		for(var i = 0, len = inputs.length; i < len; i++){
			var input = inputs[i];
			var id = input.id;
			data[id] = input.value;
		}

		new Vi({url:'verifyEntry.php', data:data}).server(function(r){
			console.log('r', r);
		});
	}

	var i = new Init();
})();