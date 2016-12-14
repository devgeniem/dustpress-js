window.DustPress = ( function( window, document, $ ) {

	var dp = {};

	dp.defaults = {
		"type"	  : "post",
		"tidy"    :	false,
		"render"  : false,
		"partial" : "",
		"success" : function() {},
		"error"   : function() {}
	};

	dp.ajax = function( path, params ) {

		var post = $.extend( params, dp.defaults );

		dp.success 	= params.success;
		dp.error 	= params.error;
		dp.get 		= params.get ? params.get : '';
		dp.path		= path;
		dp.params 	= params;

		if ( dp.get.length && ! dp.get.startsWith('?') ) {
			dp.get = '?' + dp.get;
		}

		$.ajax({
			url: window.location + dp.get,
			method: post.type,
			data: {
				dustpress_data: {
					path: 	 path,
					args: 	 post.args,
					render:  post.render,
					tidy: 	 post.tidy,
					partial: post.partial
				}
			}
		})
		.done(dp.successHandler)
		.fail(dp.errorHandler);

	};

	dp.successHandler = function(data, textStatus, jqXHR) {
		var parsed = $.parseJSON(data);

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
			if ( "function" === typeof dp.error ) {
				dp.error(parsed, textStatus, jqXHR);
			}
		}
	};

	dp.errorHandler = function(jqXHR, textStatus, errorThrown) {
		if ( "function" === typeof dp.error ) {
			dp.error({error: errorThrown}, textStatus, jqXHR);
		}
	};

	return dp;

})( window, document, jQuery );

var dp = window.DustPress.ajax;
