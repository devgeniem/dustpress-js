window.DustPress = ( function( window, document, $ ) {

	var dp = {};
	
	dp.defaults = {
		"type"	  		   : "post",
		"tidy"    		   : false,
		"render"  		   : false,
		"partial" 		   : null,
		"upload"  		   : false,
		"data"             : false,
		"success" 		   : function() {},
		"error"   		   : function() {},
		"uploadProgress"   : function() {},
		"downloadProgress" : function() {},
		"contentType"      : "application/json",
	};

	dp.start    = function() {};
	dp.complete = function() {};

	// Create token for CSRF protection
	if ( typeof window.crypto !== 'undefined' && typeof window.crypto.getRandomValues === 'function' ) { 
		dp.token = '';

		for ( var i = 0; i < 4; i++ ) {
			dp.token += window.crypto.getRandomValues( new Uint32Array(1) );
		}
	}
	else {
		dp.token = Math.random() + '' + Math.random();
	}

	dp.ajax = function( path, params ) {

		var post = $.extend( {}, dp.defaults, params );

		// Create a new instance of the default object so that simultaneous	calls wouldn't clash.
		var instance = {};

		instance.success 	        = post.success;
		instance.error 	            = post.error;
		instance.uploadProgress     = post.uploadProgress;
		instance.downloadProgress   = post.downloadProgress;
		instance.get 		        = post.get ? params.get : '';
		instance.path		        = path;
		instance.data               = post.data;
		instance.params 	        = params;
		instance.start              = dp.start;
		instance.complete           = dp.complete;

		if ( instance.get.length && ! instance.get.startsWith('?') ) {
			instance.get = '?' + instance.get;
		}

		

		var date = new Date();
        date.setTime(date.getTime() + (24*60*60*1000));
	    
	    // Set the cookie for the token
	    document.cookie = 'dpjs_token=' + dp.token + '; expires=' + date.toGMTString() + '; path=/';

		var options = {
			url: window.location + instance.get,
			method: post.type,
			contentType: post.contentType,
			data: {
				dustpress_data: {
					path    : path,
					args    : post.args,
					render  : post.render,
					tidy    : post.tidy,
					partial : post.partial,
					data    : post.data,
					token   : dp.token
				}
			}
		};

		// Stringify data so it can be sent
		options.data = JSON.stringify(options.data);

		if ( post.upload ) {
			options.xhr = function() {
				var xhr = new window.XMLHttpRequest();

				xhr.upload.addEventListener( 'progress', instance.uploadProgressHandler, false );
				xhr.addEventListener( 'progress', instance.downloadProgressHandler, false );
			};
		}

		instance.start();

		instance.successHandler = function(data, textStatus, jqXHR) {
			var parsed;

			if ( typeof data === 'string' ) {
				parsed = $.parseJSON(data);
			}
			else {
				parsed = data;
			}
			
			// Expire CSRF cookie
			document.cookie = 'dpjs_token=; expires=-1; path=/';
	
			// Add to debugger data if it exists
			if ( window.DustPressDebugger ) {
				delete instance.params.success;
				delete instance.params.error;
	
				var debug = {
					params: instance.params,
					data: parsed.debug ? parsed.debug : parsed
				};
				window.DustPressDebugger.extend(debug, instance.path);
			}
	
			if ( parsed.error === undefined ) {
				instance.success(parsed.success, parsed.data, textStatus, jqXHR);
			}
			else {
				instance.error(parsed, textStatus, jqXHR);
			}
		};
	
		instance.errorHandler = function(jqXHR, textStatus, errorThrown) {
			// Expire CSRF cookie
			document.cookie = 'dpjs_token=; expires=-1; path=/';
	
			instance.error({error: errorThrown}, textStatus, jqXHR);
		};
	
		instance.uploadProgressHandler = function( event ) {
			if ( event.lengthComputable ) {
				var complete = ( event.loaded / event.total );
	
				instance.uploadProgress( complete );	
			}
		};
	
		instance.downloadProgressHandler = function( event ) {
			if ( event.lengthComputable ) {
				var complete = ( event.loaded / event.total );
	
				instance.downloadProgress( complete );
			}
		};

		return $.ajax( options )
		.done( instance.successHandler )
		.fail( instance.errorHandler )
		.complete( instance.complete );
	};

	return dp;

})( window, document, jQuery );

var dp = window.DustPress.ajax;
