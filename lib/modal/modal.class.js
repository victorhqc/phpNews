(function(){
	/**
	 * Creates Modals for general use, inspired in
	 * http://tympanus.net/Development/ModalWindowEffects/
	 *
	 * @class Modal
	 * @requires Initclass
	 * @requires classie
	 * @param  {JSON} j Contains all the neccesary parameters
	 * @return {Modal}   A modal DOM is created and shown
	 */
	var Modal = function(j){
		/**
		 * Default values if not specified in Modal Class
		 * @type {JSON}
		 * @param {String} title Title of the Modal
		 * @param {String} message Message or description
		 * @param {JSON} actions Contains the actions to perform, each action object must be a function, And will be converted to a button. If actions is equal to {} no actions will be created
		 * @param {Function} createHelper After the DOM is created, this function will come in handy if extra DOM is required.
		 * @param {String} container The specified DOM node that will contain the Modal
		 * @param {Integer} effect Specifies the decired effect to perform
		 */
		var defaults = {
			title: 'Modal Title',
			message: 'Lorem ipsum ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores.',
			actions: {
				accept: function(){},
				cancel: function(){}
			},
			createHelper: function(){},
			container:'body',
			effect: 1
		};

		var js = {data:j, defaults:defaults};
		Initclass.call(this, js);

		this.create();

		var This = this;
	};

	/**
	 * Creates the DOM
	 * @private
	 */
	Modal.prototype.create = function(){

		var container = document.querySelector(this.container);

		var main = document.createElement('div');
		main.className = 'md-modal md-effect-'+this.effect;

		var content = document.createElement('div');
		content.className = 'md-content';

		var header = document.createElement('div');
		header.className = 'md-header modal-header';

		var body = document.createElement('div');
		body.className = 'md-body modal-body';

		var footer = document.createElement('div');
		footer.className = 'md-footer modal-footer';


		var title = document.createElement('h2');
		title.className = 'md-title';
		title.appendChild(document.createTextNode(this.title));

		var message = document.createElement('p');
		message.appendChild(document.createTextNode(this.message));

		header.appendChild(title);
		content.appendChild(header);
		
		body.appendChild(message);
		content.appendChild(body);

		
		content.appendChild(footer)

		main.appendChild(content);

		this.modal = main;

		var overlay = document.createElement('div');
		overlay.className = 'md-overlay';

		var This = this;
		overlay.addEventListener('click', function(){
			This.hide(function(){
				//300 plus 1 ms of the css until deletion
				setTimeout(function(){
					This.remove();
				}, 301);
			});
		});

		//Before appending, removes if existing
		this.remove();

		this.header = header;
		this.footer = footer;
		this.body = body;

		container.appendChild(main);
		container.appendChild(overlay);

		this.createHelper(this);
	};

	/**
	 * Deletes the DOM
	 */
	Modal.prototype.remove = function(){
		var ex = document.querySelector('.md-modal');
		if(ex !== null){
			ex.parentNode.removeChild(ex);
		}

		var ex1 = document.querySelector('.md-overlay');
		if(ex1 !== null){
			ex1.parentNode.removeChild(ex1);
		}
	};

	/**
	 * Shows the DOM
	 */
	Modal.prototype.show = function(){
		classie.toggle(this.modal, 'md-show');
	};

	/**
	 * Hides the DOM
	 */
	Modal.prototype.hide = function(){
		classie.toggle(this.modal, 'md-show');
	};

	window.Modal = function(j){
		return new Modal(j);
	};
})();