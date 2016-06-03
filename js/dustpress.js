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

		var post = $.extend( dp.defaults, params );

		dp.success 	= params.success;
		dp.error 	= params.error;

		$.ajax({
			url: window.location,
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
		if(parsed.error === undefined) {
			dp.success(parsed.success, textStatus, jqXHR);
		}
		else {
			dp.error(parsed, textStatus, jqXHR);
		}
	};

	dp.errorHandler = function(jqXHR, textStatus, errorThrown) {
		dp.error({error: errorThrown}, textStatus, jqXHR);
	};

	return dp;

})( window, document, jQuery );

var dp = window.DustPress.ajax;
