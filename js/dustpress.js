window.DustPress = ( function( window, document, $ ) {

	var dp = {};

	dp.defaults = {
		"type"	  		   : "post",
		"tidy"    		   :	false,
		"render"  		   : false,
		"partial" 		   : "",
		"upload"  		   : false,
		"success" 		   : function() {},
		"error"   		   : function() {},
		"uploadProgress"   : function() {},
		"downloadProgress" : function() {}
	};

	dp.start = function() {};
	dp.complete = function() {};

	dp.ajax = function( path, params ) {

		var post = $.extend( {}, dp.defaults, params );

		dp.success 	        = post.success;
		dp.error 	        = post.error;
		dp.uploadProgress   = post.uploadProgress;
		dp.downloadProgress = post.downloadProgress;
		dp.get 		        = post.get ? params.get : '';
		dp.path		        = path;
		dp.params 	        = params;

		if ( dp.get.length && ! dp.get.startsWith('?') ) {
			dp.get = '?' + dp.get;
		}

		var token = '';

		// Create token for CSRF protection
		if ( typeof window.crypto !== 'undefined' && typeof window.crypto.getRandomValues === 'function' ) { 
		    for ( var i = 0; i < 4; i++ ) {
		    	token += window.crypto.getRandomValues( new Uint32Array(1) );
		    }
		}
		else {
			token = Math.random() + '' + Math.random();
		}

		var date = new Date();
        date.setTime(date.getTime() + (24*60*60*1000));
	    
	    // Set the cookie for the token
	    document.cookie = 'dpjs_token=' + token + '; expires=' + date.toGMTString() + '; path=/';

		var options = {
			url: window.location + dp.get,
			method: post.type,
			data: {
				dustpress_data: {
					path    : path,
					args    : post.args,
					render  : post.render,
					tidy    : post.tidy,
					partial : post.partial,
					token   : token
				}
			}
		};

		if ( post.upload ) {
			options.xhr = function() {
				var xhr = new window.XMLHttpRequest();

				xhr.upload.addEventListener( 'progress', dp.uploadProgressHandler, false );
				xhr.addEventListener( 'progress', dp.downloadProgressHandler, false );
			};
		}

		dp.start();

		$.ajax( options )
		.done( dp.successHandler )
		.fail( dp.errorHandler )
		.complete( dp.complete );

	};

	dp.successHandler = function(data, textStatus, jqXHR) {
		if ( typeof data == 'string' ) {
			var parsed = $.parseJSON(data);
		}
		else {
			var parsed = data;
		}
		// Expire CSRF cookie
		document.cookie = 'dpjs_token=; expires=-1; path=/';

		// Add to debugger data if it exists
		if ( window.DustPressDebugger ) {
			delete dp.params.success;
			delete dp.params.error;

			var debug = {
				params: dp.params,
				data: parsed.debug ? parsed.debug : parsed
			};
			window.DustPressDebugger.extend(debug, dp.path);
		}

		if ( parsed.error === undefined ) {
			dp.success(parsed.success, textStatus, jqXHR);
		}
		else {
			dp.error(parsed, textStatus, jqXHR);
		}
	};

	dp.errorHandler = function(jqXHR, textStatus, errorThrown) {
		// Expire CSRF cookie
		document.cookie = 'dpjs_token=; expires=-1; path=/';

		dp.error({error: errorThrown}, textStatus, jqXHR);
	};

	dp.uploadProgressHandler = function( event ) {
		if ( event.lengthComputable ) {
			var complete = ( event.loaded / event.total );

			dp.uploadProgress( complete );	
		}
	};

	dp.downloadProgressHandler = function( event ) {
		if ( event.lengthComputable ) {
			var complete = ( event.loaded / event.total );

			dp.downloadProgress( complete );
		}
	};

	return dp;

})( window, document, jQuery );

var dp = window.DustPress.ajax;
