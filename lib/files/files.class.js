(function(){
	var MyFile = function(j){
		var d = {
			container: 'body',
			file: 'some_file.png',
			idFile:0,
			callbacks: {
				delete: function(){}
			}
		}

		var js = {defaults: d, data: j};
		Initclass.call(this, js);

		this.defineType();
		this.build();
	};

	//Defines the type of the file
	MyFile.prototype.defineType = function() {
		var ext = this.file.match(/(.[a-z0-9]{3,4}$)/g);
		var type = '';
		if(ext !== null){
			//Clean the dot
			ext = ext[0].substr(1);

			switch(ext){
				case 'png':
				case 'gif':
				case 'jpg':
				case 'jpeg':
					type = 'image';
				break;
			}

			type = type+'/'+ext;
		}

		this.type = type;
	};

	MyFile.prototype.build = function() {
		var container = document.querySelector(this.container);
		this.container = container;
		switch(this.type){
			case 'image/png':
			case 'image/jpg':
			case 'image/jpeg':
			case 'image/gif':
				this._renderImage();
			break;
			default:
				this._renderDefault();
			break;
		}
	};

	//Creates a thumbnail of the picture
	MyFile.prototype._renderImage = function() {
		console.log('image!');
	};

	//Default filr rendering
	//Nothing to fancy, is just a fallback
	MyFile.prototype._renderDefault = function() {
		console.log('default!');	
	};

	window.nFile = function(j){
		return new MyFile(j);
	}
})();