window.DustPress=function(e,t,$){var r={};if(r.defaults={type:"post",tidy:!1,render:!1,partial:null,upload:!1,data:!1,success:function(){},error:function(){},uploadProgress:function(){},downloadProgress:function(){},contentType:"application/json"},r.start=function(){},r.complete=function(){},"undefined"!=typeof e.crypto&&"function"==typeof e.crypto.getRandomValues){r.token="";for(var a=0;4>a;a++)r.token+=e.crypto.getRandomValues(new Uint32Array(1))}else r.token=Math.random()+""+Math.random();return r.ajax=function(a,o){var s=$.extend({},r.defaults,o),n={};n.success=s.success,n.error=s.error,n.uploadProgress=s.uploadProgress,n.downloadProgress=s.downloadProgress,n.get=s.get?o.get:"",n.path=a,n.data=s.data,n.params=o,n.start=r.start,n.complete=r.complete,n.get.length&&!n.get.startsWith("?")&&(n.get="?"+n.get);var d=new Date;d.setTime(d.getTime()+864e5),t.cookie="dpjs_token="+r.token+"; expires="+d.toGMTString()+"; path=/";var p={url:e.location+n.get,method:s.type,contentType:s.contentType,data:{dustpress_data:{path:a,args:s.args,render:s.render,tidy:s.tidy,partial:s.partial,data:s.data,token:r.token}}};return p.data=JSON.stringify(p.data),s.upload&&(p.xhr=function(){var t=new e.XMLHttpRequest;t.upload.addEventListener("progress",n.uploadProgressHandler,!1),t.addEventListener("progress",n.downloadProgressHandler,!1)}),n.start(),n.successHandler=function(r,a,o){var s;if(s="string"==typeof r?$.parseJSON(r):r,t.cookie="dpjs_token=; expires=-1; path=/",e.DustPressDebugger){delete n.params.success,delete n.params.error;var d={params:n.params,data:s.debug?s.debug:s};e.DustPressDebugger.extend(d,n.path)}void 0===s.error?n.success(s.success,s.data,a,o):n.error(s,a,o)},n.errorHandler=function(e,r,a){t.cookie="dpjs_token=; expires=-1; path=/",n.error({error:a},r,e)},n.uploadProgressHandler=function(e){if(e.lengthComputable){var t=e.loaded/e.total;n.uploadProgress(t)}},n.downloadProgressHandler=function(e){if(e.lengthComputable){var t=e.loaded/e.total;n.downloadProgress(t)}},$.ajax(p).done(n.successHandler).fail(n.errorHandler).complete(n.complete)},r}(window,document,jQuery);var dp=window.DustPress.ajax;