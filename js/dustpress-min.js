!function(e){var t={};function n(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(r,s,function(t){return e[t]}.bind(null,s));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t),function(e){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.d(t,"default",function(){return a});var a=function(){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),s(this,"defaults",{get:"",type:"post",tidy:!1,render:!1,partial:null,upload:!1,data:!1,url:null,bypassMainQuery:!0,contentType:"application/json",success:function(){},error:function(){},uploadProgress:function(){},downloadProgress:function(){},start:function(){},complete:function(){}}),s(this,"instance",{}),this.setupCrypto()}var n,a,i;return n=t,(a=[{key:"setupCrypto",value:function(){if(void 0!==window.crypto&&"function"==typeof window.crypto.getRandomValues){this.defaults.token="";for(var e=0;e<4;e++)this.defaults.token+=window.crypto.getRandomValues(new Uint32Array(1))}else this.defaults.token=Math.random()+""+Math.random()}},{key:"successHandler",value:function(t,n,r){var s;s="string"==typeof t?e.parseJSON(t):t,document.cookie="dpjs_token=; expires=-1; path=/",window.DustPressDebugger&&this.addToDebugger(s),s&&!s.error?this.instance.success(s.success,s.data,n,r):this.instance.error(s,n,r)}},{key:"addToDebugger",value:function(e){delete this.instance.params.success,delete this.instance.params.error;var t={params:this.instance.params,data:e.debug?e.debug:e};window.DustPressDebugger.extend(t,this.instance.path)}},{key:"xhrUpload",value:function(){var e=this,t=new window.XMLHttpRequest;t.upload.addEventListener("progress",function(t){return e.instance.uploadProgressHandler(t)},!1),t.addEventListener("progress",function(t){return e.instance.uploadDownloadProgressHandler(t)},!1)}},{key:"errorHandler",value:function(e,t,n){document.cookie="dpjs_token=; expires=-1; path=/",this.instance.error({error:n},t,e)}},{key:"uploadDownloadProgressHandler",value:function(e){if(e.lengthComputable){var t=e.loaded/e.total;this.instance.downloadProgress(t)}}},{key:"ajax",value:function(t,n){var r=this;this.instance=Object.assign({},this.defaults,n),this.instance.get.length&&!this.instance.get.startsWith("?")&&(this.instance.get="?"+this.instance.get);var s=new Date;s.setTime(s.getTime()+864e5),document.cookie="dpjs_token="+this.instance.token+"; expires="+s.toGMTString()+"; path=/";var a={url:this.instance.url||dustpressjs_endpoint||window.location+this.instance.get,method:this.instance.type,contentType:this.instance.contentType,data:{dustpress_data:{path:t,args:this.instance.args,render:this.instance.render,tidy:this.instance.tidy,partial:this.instance.partial,data:this.instance.data,token:this.instance.token,bypassMainQuery:this.instance.bypassMainQuery}}};return a.data=JSON.stringify(a.data),this.instance.upload&&(a.xhr=function(){return r.xhrUpload()}),this.instance.start(),this.instance.successHandler=function(e,t,n){return r.successHandler(e,t,n)},this.instance.errorHandler=function(e,t,n){return r.errorHandler(e,t,n)},this.instance.uploadProgressHandler=function(e){return r.uploadDownloadProgressHandler(e)},this.instance.downloadProgressHandler=function(e){return r.uploadDownloadProgressHandler(e)},e.ajax(a).done(function(e,t,n){return r.instance.successHandler(e,t,n)}).fail(function(e,t,n){return r.instance.errorHandler(e,t,n)}).always(function(e,t,n){return r.instance.complete(e,t,n)})}}])&&r(n.prototype,a),i&&r(n,i),t}();void 0===window.DustPress&&(window.DustPress=new a,window.dp=function(e,t){return window.DustPress.ajax(e,t)})}.call(this,n(1))},function(e,t){e.exports=jQuery}]);
//# sourceMappingURL=dustpress-min.js.map