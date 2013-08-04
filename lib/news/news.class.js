(function(){
	var MyNews = function(j){
		var d = {
			container: 'body',
			title: 'Som news',
			id:1,
			description: 'Lorem ipsum ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores',
			tags: [],
			files: [],
			callbacks: {
				delete:function(){},
				edit: function(){}
			}
		};

		var js = {defaults: d, data:j};
		Initclass.call(this, js);

		this.build();
		this.renderFiles();
	};

	MyNews.prototype.build = function() {
		var container = document.querySelector(this.container);
		this.container = container;

		//Main container of the news
		var main = document.createElement('div');
		main.className = 'panel';

		//Title
		var titleContainer = document.createElement('div');
		titleContainer.className = 'panel-heading';

		var title = document.createElement('h3');
		title.className = 'panel-title';
		title.appendChild(document.createTextNode(this.title));
		titleContainer.appendChild(title);
		main.appendChild(titleContainer);

		//Description of the news
		var description = document.createElement('p');
		description.appendChild(document.createTextNode(this.description));
		main.appendChild(description);

		//File container
		var fileContainer = document.createElement('div');
		var fileIcon = document.createElement('i');
		fileIcon.className = 'glyphicon glyphicon-file';
		var fileTitle = document.createElement('h3');
		fileTitle.appendChild(fileIcon);
		fileContainer.appendChild(fileTitle);

		var fileDiv = document.createElement('div');
		fileDiv.id = 'f-'+this.id;
		fileContainer.appendChild(fileDiv);
		main.appendChild(fileContainer);
		this.fileContainer = fileDiv;

		this.container.appendChild(main);
	};

	MyNews.prototype.renderFiles = function() {
		var c = '#'+this.fileContainer.id;
		for(var i = 0, len = this.files.length; i < len; i++){
			var file = this.files[i];

			var f = new nFile(file);
		}
	};

	window.News = function(j){
		return new MyNews(j);
	}
})();