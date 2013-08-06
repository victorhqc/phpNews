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

		var main = document.createElement('div');
		this.main = main;
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

		this.generateDownloadLink();
	};

	//Creates a thumbnail of the picture
	MyFile.prototype._renderImage = function() {
		var a = document.createElement('a');
		a.href = '#';
		a.className = 'thumbnail';

		var img = document.createElement('img');
		img.setAttribute('data-src', this.file);
		a.appendChild(img);
		this.link = a;
		this.main.appendChild(a);
		this.container.appendChild(this.main);

		//After the dom element is created, the height is assigned and the image rendered
		var width = a.offsetWidth;
		var height = width;
		img.height = height;
		img.width = width;
		img.src = this.file;
	};

	//Default filr rendering
	//Nothing to fancy, is just a fallback
	MyFile.prototype._renderDefault = function() {
		var a = document.createElement('a');
		a.href = '#';
		a.className = 'thumbnail';

		var i = document.createElement('i');
		i.className = 'glyphicon glyphicon-paperclip';
		a.appendChild(i);
		var text = document.createTextNode(' '+this.fileName);
		a.appendChild(text);
		this.link = a;
		this.main.appendChild(a);
		this.container.appendChild(this.main);
	};

	MyFile.prototype.generateDownloadLink = function() {
		this.link.href = this.file;
		this.link.setAttribute('target', '_blank');
	};

	window.nFile = function(j){
		return new MyFile(j);
	}
})();