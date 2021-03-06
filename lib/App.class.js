function Initclass(j){
	if(typeof j !== 'object'){
		throw new Error('j was expected to be an object, '+(typeof j+' was received.'));
	}

	var data = (j.data !== undefined) ? j.data : {};
	var defaults = (j.defaults !== undefined) ? j.defaults : {};
	var synonyms = (j.synonyms !== undefined) ? j.synonyms : {};
    	
    for(var k in synonyms){
    	if(data[k] !== undefined){
    		data[ synonyms[k] ] = data[k];
    	}
    }

    var types = {};
    for (var llave in defaults){
    	types[llave] = typeof defaults[llave];
    }
    
    for(var key in defaults){
        data[key] = (typeof data[key] === 'undefined') ? defaults[key] : data[key];    
    }
    
    for(var key in data){
    	var t = typeof data[key];
        if(t !== types[key] && types[k] !== undefined){
        	throw new Error ('Error : '+key+' was expected to be '+types[key]+', but was received: '+t);
        }else{
        	this[key] = data[key];
        }
    }
}

(function(){
	// 
	// JSONHttpRequest 0.3.0
	//
	// Copyright 2011 Torben Schulz <http://pixelsvsbytes.com/>
	// 
	// This program is free software: you can redistribute it and/or modify
	// it under the terms of the GNU General Public License as published by
	// the Free Software Foundation, either version 3 of the License, or
	// (at your option) any later version.
	// 
	// This program is distributed in the hope that it will be useful,
	// but WITHOUT ANY WARRANTY; without even the implied warranty of
	// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	// GNU General Public License for more details.
	// 
	// You should have received a copy of the GNU General Public License
	// along with _self program. If not, see <http://www.gnu.org/licenses/>.
	// 
	///////////////////////////////////////////////////////////////////////

	function JSONHttpRequest() {
		var _xmlHttpRequest = getXMLHTTPRequest();
		var _responseJSON = null;
		var _userContentType = false;
		// INFO Defining 'this' as '_self' improves compression, since keywords won't be shortened,
		//      but variables will, and it delivers us from the need to reset the scope of the anonymous
		//      function in the for-loop via call() or apply().
		var _self = this;

		var property = {
			get: function() {
				try {
					_responseJSON = _xmlHttpRequest.responseText ? (!_responseJSON ? JSON.parse(_xmlHttpRequest.responseText) : _responseJSON) : null;
				}
				catch (e) {
					if (_self.strictJSON)
						throw e;
				}
				return _responseJSON;
			},
			enumerable: true,
			configurable: true
		}
		
		_self.strictJSON = true;
		Object.defineProperty(_self, 'responseJSON', property);
		
		_self.sendJSON = function(data) {
	    	try {
	    		data = JSON.stringify(data);
	    		_responseJSON = null;
	    		if (!_userContentType)
	    			_xmlHttpRequest.setRequestHeader('Content-Type', 'application/json;charset=encoding');    		
	    		_userContentType = false;
			}
			catch (e) {
				if (_self.strictJSON)
					throw e;
			}
			_xmlHttpRequest.send(data);
	    }
		
		// INFO proxy setup
		
		function proxy(name) {
			try {
				if ((typeof _xmlHttpRequest[name]) == 'function') {
					_self[name] = function() {
						if (name == 'setRequestHeader')
							_userContentType = arguments[0].toLowerCase() == 'content-type';
						return _xmlHttpRequest[name].apply(_xmlHttpRequest, Array.prototype.slice.apply(arguments));
					};
				}
				else {
					property.get = function() { return _xmlHttpRequest[name]; }
					property.set = function(value) { _xmlHttpRequest[name] = value; }
					Object.defineProperty(_self, name, property);	
				}
			}
			catch (e) {
				// NOTE Swallow any exceptions, which may rise here.
			}
		}
		
		// FIX onreadystatechange is not enumerable [Opera]
		proxy('onreadystatechange');
		
		for (n in _xmlHttpRequest)
			proxy(n);
	}

	// Ajax Stuff
	// =======================
	var _Vi = function(j){

		var json = (j === undefined ) ? {} : j;
    	
        var defaults = {
            url: '',
            cache: false,
            header:'Content-Type',
            valorHeader:'application/x-www-form-urlencoded',
            div:'',
            cargando:'...',
            modo:'GET',
            datos:{},
            respuesta:'text',
            input:'',
            formulario:'',
            enviaArchivo:false,
            historial:false,
            urlH: '/',
            mensajeH: '',
            mClass: false,
            mensaje:{}
        }

        // The original variables are in spanish, so I added translated variables as well
        synonyms = {
        	headerValue: 'valorHeader',
        	container: 'div',
        	loading: 'cargando',
        	mode: 'modo',
        	data: 'datos',
        	response: 'respuesta',
        	sendFile: 'enviaArchivo',
        	history: 'historial',
        	messageH: 'mensajeH',
        	message: 'mensaje',
        }

        var js = {data:j, defaults:defaults, synonyms:synonyms};
        Initclass.call(this, js);
    }

	function getXMLHTTPRequest() {
    	var req;
    	if(XMLHttpRequest){
            req = new XMLHttpRequest();
        }else{
        	try {
	    		req = new XMLHttpRequest();
	    	} catch(err1) {
	    		try {
	    			req = new ActiveXObject("Msxml2.XMLHTTP");
	    		} catch (err2) {
	    			try {
	    				req = new ActiveXObject("Microsoft.XMLHTTP");
	    			} catch (err3) {
	    				req = false;
	    			} 
	    		} 
		    }
        }
	    return req;
    }

    _Vi.prototype.httpHandler = function(){
    	var http;
    	switch(this.respuesta){
    		case 'objeto':
    		case 'object':
    		case 'json':
    			http = new JSONHttpRequest();
    		break;
    		default:
    			if(XMLHttpRequest){
		            http = new XMLHttpRequest();
		        }else{
		            http = getXMLHTTPRequest();
		        }
    		break;
    	}

    	return http;
    };

	_Vi.prototype.ajax = function(callback){
		var http = this.httpHandler();
        this.http = http;
        
        var myRand = '';
        if(this.cache === false){
            myRand = "?rand="+ parseInt(Math.random()*999999999999999);
        }
        
        var url = this.url+myRand;
        if(this.mod === 'GET' && this.enviaArchivo === false){
            var datos = '';
            
            for(var llave in this.datos){
                datos += '&' + encodeURIComponent(llave) + '=' + encodeURIComponent(this.datos[llave]);
            }
            
            url += datos;
        }
        
        if(this.modo === 'POST' && this.enviaArchivo === false){
            var datos = '';
            for(var llave in this.datos){
            	if(typeof this.datos[llave] === "object"){
                	this.datos[llave] = JSON.pruned(this.datos[llave]);
            	}
                datos +=encodeURIComponent(llave)+'='+encodeURIComponent(this.datos[llave])+'&';
            }
        }
        
        var esto = this;
        if(http.open !== undefined){
        	http.open(this.modo, url, true);
        	if(this.enviaArchivo == false) {
	            http.setRequestHeader(this.header, this.valorHeader);
	        }

	        http.send(datos);
        }else{
        	http.sendJSON();
        }
        

        http.onreadystatechange = function(){
            if(http.readyState === 4){
                if(http.status === 200){
                    esto.success(callback);
                }
            } 
        }
    }

    _Vi.prototype.success = function(callback){                    
        if(this.historial == true){
            if(window.dhtmlHistory === undefined){
                console.log('Para que el historial funcione, necesitas implementar RSH');
            }else{
                dhtmlHistory.add(
                    this.urlH,
                    {message: this.mensajeH});
            }
        }
        
        var respuesta;
        switch(this.respuesta){
        	case 'xml':
        		respuesta = this.http.responseXML.documentElement;
        	break;
        	case 'texto':
        	case 'text':
        	default:
        		respuesta = this.http.responseText;
        	break;
        	case 'objeto':
        	case 'object':
        	case 'json':
        		respuesta = this.http.responseJSON;
        		this.messageHandler();
        	break;
        }

        if(this.dom !== null && this.dom !== undefined){
        	this.showInDOM(callback, respuesta);
        }else{
        	if(typeof callback === 'function'){
	        	callback(respuesta);
	        }
        }
    }

    _Vi.prototype.messageHandler = function(){
    	if(window.Mensaje !== undefined && this.mClass === true){
        	if(this.respuesta.exito !== undefined && this.mensaje.tipo === undefined){
        		var t;
        		switch(this.respuesta.exito){
        			case true:
        				t = 'info';
        			break;
        			case false:
        				t = 'danger';
        			break;
        			default:
        				t = respuesta.exito;
        		}
        		this.mensaje.tipo = t;
        	}
        	if(respuesta.titulo !== undefined && this.mensaje.titulo === undefined){
        		this.mensaje.titulo = respuesta.titulo;
        	}
        	if(respuesta.mensaje !== undefined && this.mensaje.mensaje === undefined){
        		this.mensaje.mensaje = respuesta.mensaje;
        	}
        	var m = Mensaje(this.mensaje);
        	m.insertar();
        }
    }

    _Vi.prototype.uploader = function(callback){
        var uri = this.url;
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        var metodo;
        
        fd = this.datos;
        
        xhr.open(this.modo, uri, true);
        xhr.send(fd);

        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 200) {
                respuesta = eval('('+xhr.responseText+')');
                
                if(callback!=undefined){
                    callback(respuesta);
                }else{
                    return respuesta;
                }
                
            }
        }
        
        delete xhr;
        delete fd;
    }

    _Vi.prototype.DOMHandler = function(){
    	var dom = document.querySelector(this.div);
    	this.dom = dom;
    }

    _Vi.prototype.showInDOM = function(callback, response){
    	this.dom.innerHTML = response;
    	if(typeof callback === 'function'){
    		callback();
    	}
    }

    _Vi.prototype.content = function(callback){
    	this.contenido(callback);
    }

    _Vi.prototype.contenido = function(callback){
    	this.respuesta = 'string';
        this.modo = 'GET';
        this.DOMHandler();

        if(this.dom !== null){
        	return this.ajax(callback);
        }else{
        	console.log('No se ha encontrado el elemento DOM '.this.div);
        }
    }

    _Vi.prototype.server = function(callback){
    	this.response = 'object';
    	this.respondo(callback);
    }

    _Vi.prototype.respondo = function(callback){
        
        this.modo = 'POST';
        this.div = undefined;
        return this.ajax(callback);
    }

    _Vi.prototype.form = function(json, callback){
        
        for(var llave in json){
            this.llave = json.llave;
        }
        
        var datos = {};
        var esto = this;

        var dom = document.querySelector(this.input);
        for(var i = 0, len = dom.length; i < len; i++){
        	var d = dom[i];
        	var vlr = d.value;
            var nombre = d.name;
            if(nombre==''){
                nombre = d.id;
            }
            datos[nombre]=vlr;
        }

        this.datos = datos;
        
        this.modo = 'POST';
        var respondo = esto.ajax(callback);
        
        return respondo;
        
    }

    window.Vi = function(json){
    	return new _Vi(json);
    }

})();

(function(){
	var _Layout = function(json){
		var defaults ={
			skin: null,
			name: null,
			current_lang:'es',
			language: 'es',
			template: new template(),
			sistema: {}
		};
		
		var js = {data:json, defaults:defaults};
		Initclass.call(this, js);
	}

	var childElement = function(js){
		js = (typeof js !== 'object') ? {} : js;
		
		var defaults = {
			id: '',
			className:'',
			html: '',
			parent:{},
			active: false,
			archive: ''
		}

		var json = {data:js, defaults:defaults};

		Initclass.call(this, json);
	}

	childElement.prototype = {
		setId: function(id){ this.id = id; },
		setHtml: function(html){ this.html = html; },
		setParent: function(parent){ this.parent = parent; },
		setActive: function(active){this.active = active; },
		setArchivo: function(archivo){this.archivo = archivo; },
		getArchivo: function(){ return this.archivo; },
		getActive: function(){return this.active; },
		getParent: function(){ return this.parent;},
		getId: function(){ return this.id; },
		getHtml: function(){ return this.html; },
		setClass: function(className){this.className = className},
		getClass: function(){ return this.className}
	}
			
	childElement.prototype.skin = function(skin, callback){
		if(this.active == true){
			Vi({url:skin+'/'+this.archivo, container:'#'+this.id}).contenido(callback);
		}else{
			callback();
		}
		
	};
	
	childElement.prototype.insertar = function(){
		var dom = document.querySelector(this.parent);
		var div = document.createElement('div');
		div.id = this.id;

		if(this.className !== ''){
			div.className = this.className;
		}

		dom.appendChild(div);
	};
		
	var template = function(){
		this.constructor = null;
		this.header = new childElement();
		this.footer = new childElement();
		this.main = new childElement();
		this.menu = new childElement();
		this.wrapper = new childElement();
	}
		
	template.prototype.getXML = function(skin, callback){
		var temp = this;
		var rutaXML = skin+'/constructor.xml';
		
		Vi({url:rutaXML, respuesta:'xml', cache:true}).respondo(function(resp){
			temp.constructor = resp;
			if(typeof callback === 'function'){
				callback();
			}
		});
	};
			
	template.prototype.getCSS = function(skin, callback){
		var href = './'+skin+'/css/style.css';
		
		var antiq = document.querySelector('head link[data-skin]');
		if(antiq !== null){
			antiq.parentNode.removeChild(antiq);
		}

		var l = document.createElement('link');
		l.setAttribute('href', href);
		l.setAttribute('data-skin', skin);
		l.type = 'text/css';
		l.rel = 'stylesheet';

		var head = document.getElementsByTagName('head')[0];
		head.appendChild(l);

		if(typeof callback === 'function'){
			callback();
		}
	};
			
	template.prototype.getJS = function(skin,callback){
		var head	= document.getElementsByTagName("head")[0];
		var script	= document.createElement("script");
		var done 	= false; // Handle Script loading
		
		var url = skin+'/js/main.js';
		script.src	= url;
		script.onload = script.onreadystatechange = function() { // Attach handlers for all browsers
			if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
				done = true;
				if (typeof callback === 'function') { callback(); }
				script.onload = script.onreadystatechange = null; // Handle memory leak in IE
			}
		};
 
		head.appendChild(script);
	};
			
	template.prototype.construir = function(callback){
		var temp = this;
							
		if(temp.constructor == null){ throw new Error('Imposible construir con constructor == null '); }
			
		for(var i = 0, len = this.constructor.childNodes.length; i < len; i++){
			var node = this.constructor.childNodes[i];
			if(node.nodeName !== '#text'){
				var n = temp[node.tagName];
				var id = node.getAttribute('id');
				var archive = node.getAttribute('archivo') || node.getAttribute('file');
				var parent = node.getAttribute('padre') || node.getAttribute('parent');
				var className = node.getAttribute('class');
				if(className !== null){
					n.setClass(className);
				}
				n.setId(id);
				n.setParent(parent);
				n.insertar();
				n.setArchivo(archive);
				n.setActive(true);
			}
		}

		if(typeof callback === 'function'){
			callback();
		}
	};
						
	_Layout.prototype = {
			setSkin: function(skin){ this.skin = skin; },
			getSkin: function(){return this.skin; },
			setName: function(name){this.name = name; },
			getName: function(){return this.name; },
		}

	
	_Layout.prototype.init = function(callback){
	    this.inicializado = true;
		lay = this;
		
		if(typeof lay.skin == "object"){ 
	    	var t_skin = lay.skin.skin;
	    }else{
		    var t_skin = lay.skin;
	    }
	    
		lay.template.getXML(t_skin, function(){
			lay.template.getCSS(t_skin, function(){
				lay.template.construir(function(){
					lay.template.header.skin(t_skin, function(){
						lay.template.footer.skin(t_skin, function(){
							lay.template.menu.skin(t_skin,function(){
								lay.template.main.skin(t_skin, function(){
									lay.template.getJS(t_skin, function(){
										if(typeof callback === 'function'){
											callback();
										}
									});
								});
							});
						});
					});
				});
			});
		});
	};
		
	window.Layout = function(json){	    
		return new _Layout(json);
	};

})();

(function(){
	var _Sistema = function(json){
		var defaults ={
			name:'',
			language: {},
			currentLang: 'en',
			modules: {},
			div: ''
		};
		
		js = {data:json, defaults:defaults};
		Initclass.call(this, js);
		
		for(var key in this.modules){
			this.setModule(key, this.modules[key]);
		}
		
	}
	
	_Sistema.prototype.init = function(callback){
		var This = this;
		var js = {language:this.currentLang};
		this.language = Language(js);
		this.language.init(function(){
			if(typeof callback === 'function'){
				callback();
			}
		});
	}
	
	_Sistema.prototype.setModule = function(name, json){
		json.padre = this;
		this.modules[name] = Modulo(json);
	}
	
	_Sistema.prototype.getModule = function(name){
		this.current = this.modules[name];
		return this.modules[name];
	}
	
	_Sistema.prototype.getModules = function(){
		return this.modules;
	}
	
	_Sistema.prototype.getProperties = function(){
		return this;
	}

	_Sistema.prototype.setLang = function(lang){
		this.currentLang = lang;
		this.language.setLang(lang);
	}

	_Sistema.prototype.getLang = function(){
		return this.currentLang;
	}

	_Sistema.prototype.translateTo = function(lang, callback){
		this.setLang(lang);

		this.language.setUrl('./language/'+this.getLang()+'/main.xml');
		
		this.language.translateTo(function(){
			if(typeof callback == 'function'){
				callback();
			}
		});
	}
	
	window.Sistema = function(json){
		return new _Sistema(json); 
	}

	window.AppSystem = function(json){
		return new _Sistema(json);
	}
})();

(function(){
	
	var _Modulo = function(json){
		var defaults ={
			nombre: '',
			xml: '',
			data: {},
			url:''
		}
		
		var js = {data: json, defaults: defaults};
		Initclass.call(this, js);

		var jl = {language:this.getLang()};
		this.language = Language(jl);
	}
		
	_Modulo.prototype = {
		getCurrentLang: function(){ return this.currentLang},
		setNombre: function(nombre){ this.nombre = nombre; },
		getNombre: function(){ return this.nombre; },
		setLang: function(lang){
			
		}, 
		getLang: function(){ 
			return this.padre.currentLang; 
		}
	}
		
	_Modulo.prototype.getCSS = function(callback){
		var ya = new Date();
		ya = 'v'+ya.getDate()+''+(ya.getMonth()+1)+''+ya.getFullYear();
		
		var href = this.url+this.getNombre()+'/css/style.css';		
		var antiq = document.querySelector('head link[data-'+this.getNombre()+']');
		if(antiq !== null){
			antiq.parentNode.removeChild(antiq);
		}

		var l = document.createElement('link');
		l.setAttribute('href', href);
		l.setAttribute('data-'+this.getNombre(), this.getNombre());
		l.type = 'text/css';
		l.rel = 'stylesheet';

		var head = document.getElementsByTagName('head')[0];
		head.appendChild(l);

		if(typeof callback === 'function'){
			callback();
		}		
	};
		
	_Modulo.prototype.getHTML = function(json, callback){
		var modulo = this;
		json.callback = callback;
		this.ViHTML(json, callback);
	};
		
	_Modulo.prototype.ViHTML = function(json, callback){
		json.url = this.url+this.getNombre()+'/html/main.html';
	    delete json.archivo;
	    json.div = json['div_id'];
	    delete json['div_id'];
	    
	    Vi(json).contenido(function(){
			if(typeof callback == 'function'){
				callback();
			}
		});
	}
		
	_Modulo.prototype.getJS = function(callback){

		var head	= document.getElementsByTagName("head")[0];
		var script	= document.createElement("script");
		var done 	= false; // Handle Script loading
		
		var url = this.url+this.getNombre()+'/js/main.js';
		script.src	= url;
		script.onload = script.onreadystatechange = function() { // Attach handlers for all browsers
			if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
				done = true;
				if (typeof callback === 'function') { callback(); }
				script.onload = script.onreadystatechange = null; // Handle memory leak in IE
			}
		};
 
		head.appendChild(script);
	};
	
	_Modulo.prototype.translate = function(callback){
		this.language.setLang(this.getLang());
		
		var t = this;
		
		this.language.setUrl('./language/'+this.getLang()+'/'+this.nombre+'/content.xml');
		this.language.translate(function(){
			if(typeof callback == 'function'){
				callback();
			}
		});
	};

	_Modulo.prototype.parentTranslateTo = function(lang, callback){
		this.padre.translateTo(lang, function(){
			if(typeof callback === 'function'){
				callback();
			}
		});
	}
	
	_Modulo.prototype.translateTo = function(lang, callback){
		this.setLang(lang);
		var t = this;
		this.parentTranslateTo(lang, function(){
			t.language.setLang(t.getLang());
			t.language.setUrl('./language/'+t.getLang()+'/'+t.getNombre()+'/content.xml');
			
			t.language.translateTo(function(){
				if(typeof callback == 'function'){
					callback();
				}
			});
		})
	};
	
	_Modulo.prototype.peticion = function(url, j){
		if(j.mClass === undefined){
			j.mClass = false;
		}
		if(j.mensaje === undefined){
			j.mensaje = {};
		}
		j.respuesta = 'objeto';
		j.url = url + j.file;
		delete j.file; 

		Vi(j).respondo(function(r){
			if(typeof j.callback === 'function'){
				j.callback(r);
			}
		});
	}
	
	//Obtiene la dirección de la categoría a la que pertenece el módulo (si es que aplica).
	_Modulo.prototype.getServerCat = function(file, data, callback){
		var j = {};
		if(typeof file !== 'object'){
			j.file = file;
			j.data = data;
			j.callback = callback;
			j.multiple = true;
		}else{
			j = file;
		}
		this.peticion(this.getUrlServerCat()+'/server/', j);
	}
	
	//Obtiene la dirección del módulo en el servidor.
	_Modulo.prototype.getServer = function(file, data, callback){
		var j = {};
		if(typeof file !== 'object'){
			j.file = file;
			j.data = data;
			j.callback = callback;
		}else{
			j = file;
		}
		this.peticion(this.getUrlServer()+'/server/', j);
	}
	
	//url url de los archivos del servidor de la categoría a la que pertenece el módulo (si es que aplica).
	_Modulo.prototype.getUrlServerCat = function(){
		var url;
		if(typeof this.moduloCategoria === 'undefined'){
			console.log('EL módulo no pertenece a ninguna categoría, revisa que exista la propiedad "moduloCategoria"');
		}else{
			url = 'modules/'+this.moduloCategoria.getNombre();
		}
		return url;
	}
	
	_Modulo.prototype.getUrl = function(){
		return this.url+'/'+this.getNombre();
	}
	
	//url url de los archivos del servidor
	_Modulo.prototype.getUrlServer = function(){
		var url = 'modules/'+this.getNombre();
		return url;
	}
	
	_Modulo.prototype.getText = function(tag){
		return this.padre.language.getText(tag);
	}
	
	_Modulo.prototype.parcialInit = function(callback){
		var modulo = this;
		this.url = this.url;
		
		modulo.getCSS(function(){				
			modulo.getJS(function(){
			    if(typeof callback == 'function'){
			        callback();
			    }
			});
		});
	}

	_Modulo.prototype.start = function(callback){
		var modulo = this;
		
		var This = this;
		modulo.getCSS(function(){				
			var json = {div_id: This.padre.div};
			modulo.getHTML(json, function(){
				modulo.translate(function(){
					modulo.getJS(function(){
					    if(typeof callback == 'function'){
					        callback();
					    }
					});
				});
			});
		});	
	}
	
	_Modulo.prototype.init = function(archivo, div_id, callback){
	    var json = {};
	    this.url = this.url;
	    fade = false;
	    
	    if(typeof archivo === 'object'){
	        var json = archivo;
	        var callback = json.callback;
	        if(div_id !== undefined && typeof div_id === 'function'){
	            callback = div_id;
	        }
	    }else{
	        json = {archivo:archivo, 'div_id':div_id, callback:callback, fade:fade, historial:false};
	    }
	    
		var modulo = this;
		
		if(modulo.nombre == null){ throw new Error('No se puede inicializar con modulo.nombre igual a NULL'); }
		
		modulo.getCSS(function(){				
			modulo.getHTML(json, function(){
				modulo.translate(function(){
					modulo.getJS(function(){
					    if(typeof callback == 'function'){
					        callback();
					    }
					});
				});
			});
		});				
	};						
	
	window.Modulo = function(json){
		return new _Modulo(json);
	};

	window.AppModule = function(json){
		return new _Modulo(json);
	}
	
})();

(function(){
	var _Lang = function(json){
		var defaults = {
			language:'es',
			main:'main.xml',
			url:'',
			langs:{}
		};
		
		var js = {data:json, defaults: defaults};
		Initclass.call(this, js);
		
		this.url = 'language/'+this.getLang()+'/main.xml';
		
	}
	
	_Lang.prototype.init = function(callback){
		// Al iniciar, se carga el XML principal
		this.translate(callback);
	}
	
	_Lang.prototype.setJson = function(xml){
		var name = this.getNameUrl();
		this.langs[this.getLang()][name] = xml;
	}
	
	_Lang.prototype.getNameUrl = function(){
		var name = this.url.match(/\/?([a-z.]+)/gi);
		name = name[name.length - 2];
		name = name.substring(1);
		
		return name;
	}
	
	_Lang.prototype.getJson = function(){
		if(this.langs[this.getLang()] === undefined){
			this.langs[this.getLang()] = {};
		}
		
		var name = this.getNameUrl();
		this.ultimo = name;
		
		return this.langs[this.getLang()][name];
	}
	
	_Lang.prototype.getLang = function(){
		return this.language;
	}
	
	_Lang.prototype.setLang = function(lang){
		this.language = lang;
		this.url = 'language/'+lang+'/main.xml';
		this.mainUrl = 'language/'+lang+'/main.xml';
	}
	
	_Lang.prototype.getUrl = function(){
		return this.url;
	}
	
	_Lang.prototype.setUrl = function(url){
		this.url = url;
	}
	
	_Lang.prototype.translate = function(callback, eff){
		if(eff === undefined){
			eff = false;
		}
		var This = this;
		if(typeof this.getJson() === 'undefined'){
			getXML(This, function(xml){
				This.setJson(xml);
				languageToDOM(This, eff, callback);
			});
		}else{
			languageToDOM(this, eff, callback);
		}
	}

	_Lang.prototype.translateTo = function(callback){
		var This = this;
		var j = this.getJson();
		
		//Al traducir, primero se va a cargar el texto de "Main" y luego el del módulo en curso
		var url = this.url;
		this.setUrl(this.mainUrl);
		this.translate(function(){
			This.setUrl(url);
			This.translate(callback, true);
		}, true);
	}

	//Searchs for a language tag and then searches for the DOM element and applies it.
	_Lang.prototype.translateDOM = function(node){
		var text = this.getText(node);
		var elm = document.querySelector('*[data-ltag="'+node+'"]');
		elm.innerHTML = text;
	}
	
	_Lang.prototype.getMainText = function(node){
		var x = this.langs[this.getLang()][this.getLang()].getElementsByTagName(node)[0];
		var y = x.childNodes[0];
		return y.nodeValue;
	}
	
	_Lang.prototype.getText = function(node){
		var x = this.getJson().getElementsByTagName(node)[0];
		y = x.childNodes[0];
		return y.nodeValue;
	}
	
	
	function languageToDOM(This, effect, callback){
		var XMLdom = This.getJson().getElementsByTagName('dom');
		for(var i = 0, len = XMLdom.length; i < len; i++){
			var dom = XMLdom[i];
			for(var j = 0, len2 = dom.childNodes.length; j < len2; j++){
				var node = dom.childNodes[j];
				if(node.nodeName!='#text'){
					var tag = document.querySelector('*[data-ltag="'+node.childNodes[0].parentNode.tagName+'"]');
					if(tag !== null){
						var c = 'class';
						var attr = node.getAttribute(c);
						if(attr !== '' && attr !== null){
							tag.setAttribute(c, attr);
						}
						var t = node.childNodes[0].data;
						tag.innerHTML = t;
					}
				}
			}
		}
		
		if(typeof callback == 'function'){
			callback();
		}
	}
	
	function getXML(This, callback){
		Vi({url:This.getUrl(), respuesta:'xml', cache:true}).respondo(function(respuesta){
			if(typeof callback == 'function'){
				callback(respuesta);
			}
		});
	}
	
	window.Language = function(json){
		return new _Lang(json);
	}
})();

// JSON.pruned : a function to stringify any object without overflow
// example : var json = JSON.pruned({a:'e', c:[1,2,{d:{e:42, f:'deep'}}]})
// two additional optional parameters :
//   - the maximal depth (default : 6)
//   - the maximal length of arrays (default : 50)
// GitHub : https://github.com/Canop/JSON.prune
// This is based on Douglas Crockford's code ( https://github.com/douglascrockford/JSON-js/blob/master/json2.js )
(function () {
    'use strict';

    var DEFAULT_MAX_DEPTH = 1000;
    var DEFAULT_ARRAY_MAX_LENGTH = 1000;
    var seen; // Same variable used for all stringifications

    Date.prototype.toPrunedJSON = Date.prototype.toJSON;
    String.prototype.toPrunedJSON = String.prototype.toJSON;

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder, depthDecr, arrayMaxLength) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            partial,
            value = holder[key];
        if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
            value = value.toPrunedJSON(key);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
            return String(value);
        case 'object':
            if (!value) {
                return 'null';
            }
            if (depthDecr<=0 || seen.indexOf(value)!==-1) {
                return '"-pruned-"';
            }
            seen.push(value);
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = Math.min(value.length, arrayMaxLength);
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value, depthDecr-1, arrayMaxLength) || 'null';
                }
                v = partial.length === 0
                    ? '[]'
                    : '[' + partial.join(',') + ']';
                return v;
            }
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    try {
                        v = str(k, value, depthDecr-1, arrayMaxLength);
                        if (v) partial.push(quote(k) + ':' + v);
                    } catch (e) { 
                        // this try/catch due to some "Accessing selectionEnd on an input element that cannot have a selection." on Chrome
                    }
                }
            }
            v = partial.length === 0
                ? '{}'
                : '{' + partial.join(',') + '}';
            return v;
        }
    }

    JSON.pruned = function (value, depthDecr, arrayMaxLength) {
        seen = [];
        depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
        arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
        return str('', {'': value}, depthDecr, arrayMaxLength);
    };

}());