(function(){
	"use strict";
	var Init = function(){
		this.btnFunc();	
	}

	Init.prototype.btnFunc = function() {
		var frm = document.getElementById('form-new-user');
		frm._t = this;
		frm.addEventListener('submit', function(e){
			var b = document.getElementById('mainbtn');
			b.setAttribute('disabled', 'disabled');

			if(e.preventDefault){
				e.preventDefault();
			}
			e.returnValue = false;

			if(this._t.passwordCheck()){
				this._t.authorizeUser()
			}else{
				var err = document.getElementById('err');
				err.style.display = 'block';
				var text = App.current.language.getText('wrong-password');
				err.innerHTML = '';
				err.appendChild(document.createTextNode(text));
			}
		});
	};

	Init.prototype.authorizeUser = function() {
		var data = {};
		var inps = document.getElementsByClassName('form-control');
		for(var i = 0, len = inps.length; i < len; i++){
			var inp = inps[i];
			var k = inp.name;
			data[k] = inp.value;
		}

		console.log(data);
		App.current.getServer('newUser.php', data, function(){
			location.reload();
		});
	};

	Init.prototype.passwordCheck = function() {
		var p1 = document.getElementById('input-password1');
		p1 = p1.value;
		var p2 = document.getElementById('input-password2');
		p2 = p2.value;

		var r = (p1 === p2) ? true : false;

		return r;
	};

	var i = new Init();
})();