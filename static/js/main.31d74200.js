!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/snake/",e(e.s=1)}([function(t,e,n){"use strict";function i(){}function r(t){try{return t.then}catch(t){return g=t,v}}function s(t,e){try{return t(e)}catch(t){return g=t,v}}function o(t,e,n){try{t(e,n)}catch(t){return g=t,v}}function a(t){if("object"!==typeof this)throw new TypeError("Promises must be constructed via new");if("function"!==typeof t)throw new TypeError("Promise constructor's argument is not a function");this._75=0,this._83=0,this._18=null,this._38=null,t!==i&&p(t,this)}function h(t,e,n){return new t.constructor(function(r,s){var o=new a(i);o.then(r,s),u(t,new y(e,n,o))})}function u(t,e){for(;3===t._83;)t=t._18;if(a._47&&a._47(t),0===t._83)return 0===t._75?(t._75=1,void(t._38=e)):1===t._75?(t._75=2,void(t._38=[t._38,e])):void t._38.push(e);c(t,e)}function c(t,e){b(function(){var n=1===t._83?e.onFulfilled:e.onRejected;if(null===n)return void(1===t._83?l(e.promise,t._18):f(e.promise,t._18));var i=s(n,t._18);i===v?f(e.promise,g):l(e.promise,i)})}function l(t,e){if(e===t)return f(t,new TypeError("A promise cannot be resolved with itself."));if(e&&("object"===typeof e||"function"===typeof e)){var n=r(e);if(n===v)return f(t,g);if(n===t.then&&e instanceof a)return t._83=3,t._18=e,void d(t);if("function"===typeof n)return void p(n.bind(e),t)}t._83=1,t._18=e,d(t)}function f(t,e){t._83=2,t._18=e,a._71&&a._71(t,e),d(t)}function d(t){if(1===t._75&&(u(t,t._38),t._38=null),2===t._75){for(var e=0;e<t._38.length;e++)u(t,t._38[e]);t._38=null}}function y(t,e,n){this.onFulfilled="function"===typeof t?t:null,this.onRejected="function"===typeof e?e:null,this.promise=n}function p(t,e){var n=!1,i=o(t,function(t){n||(n=!0,l(e,t))},function(t){n||(n=!0,f(e,t))});n||i!==v||(n=!0,f(e,g))}var b=n(4),g=null,v={};t.exports=a,a._47=null,a._71=null,a._44=i,a.prototype.then=function(t,e){if(this.constructor!==a)return h(this,t,e);var n=new a(i);return u(this,new y(t,e,n)),n}},function(t,e,n){n(2),t.exports=n(9)},function(t,e,n){"use strict";"undefined"===typeof Promise&&(n(3).enable(),window.Promise=n(6)),n(7),Object.assign=n(8)},function(t,e,n){"use strict";function i(){u=!1,a._47=null,a._71=null}function r(t){function e(e){(t.allRejections||o(l[e].error,t.whitelist||h))&&(l[e].displayId=c++,t.onUnhandled?(l[e].logged=!0,t.onUnhandled(l[e].displayId,l[e].error)):(l[e].logged=!0,s(l[e].displayId,l[e].error)))}function n(e){l[e].logged&&(t.onHandled?t.onHandled(l[e].displayId,l[e].error):l[e].onUnhandled||(console.warn("Promise Rejection Handled (id: "+l[e].displayId+"):"),console.warn('  This means you can ignore any previous messages of the form "Possible Unhandled Promise Rejection" with id '+l[e].displayId+".")))}t=t||{},u&&i(),u=!0;var r=0,c=0,l={};a._47=function(t){2===t._83&&l[t._56]&&(l[t._56].logged?n(t._56):clearTimeout(l[t._56].timeout),delete l[t._56])},a._71=function(t,n){0===t._75&&(t._56=r++,l[t._56]={displayId:null,error:n,timeout:setTimeout(e.bind(null,t._56),o(n,h)?100:2e3),logged:!1})}}function s(t,e){console.warn("Possible Unhandled Promise Rejection (id: "+t+"):"),((e&&(e.stack||e))+"").split("\n").forEach(function(t){console.warn("  "+t)})}function o(t,e){return e.some(function(e){return t instanceof e})}var a=n(0),h=[ReferenceError,TypeError,RangeError],u=!1;e.disable=i,e.enable=r},function(t,e,n){"use strict";(function(e){function n(t){o.length||(s(),a=!0),o[o.length]=t}function i(){for(;h<o.length;){var t=h;if(h+=1,o[t].call(),h>u){for(var e=0,n=o.length-h;e<n;e++)o[e]=o[e+h];o.length-=h,h=0}}o.length=0,h=0,a=!1}function r(t){return function(){function e(){clearTimeout(n),clearInterval(i),t()}var n=setTimeout(e,0),i=setInterval(e,50)}}t.exports=n;var s,o=[],a=!1,h=0,u=1024,c="undefined"!==typeof e?e:self,l=c.MutationObserver||c.WebKitMutationObserver;s="function"===typeof l?function(t){var e=1,n=new l(t),i=document.createTextNode("");return n.observe(i,{characterData:!0}),function(){e=-e,i.data=e}}(i):r(i),n.requestFlush=s,n.makeRequestCallFromTimer=r}).call(e,n(5))},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"===typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";function i(t){var e=new r(r._44);return e._83=1,e._18=t,e}var r=n(0);t.exports=r;var s=i(!0),o=i(!1),a=i(null),h=i(void 0),u=i(0),c=i("");r.resolve=function(t){if(t instanceof r)return t;if(null===t)return a;if(void 0===t)return h;if(!0===t)return s;if(!1===t)return o;if(0===t)return u;if(""===t)return c;if("object"===typeof t||"function"===typeof t)try{var e=t.then;if("function"===typeof e)return new r(e.bind(t))}catch(t){return new r(function(e,n){n(t)})}return i(t)},r.all=function(t){var e=Array.prototype.slice.call(t);return new r(function(t,n){function i(o,a){if(a&&("object"===typeof a||"function"===typeof a)){if(a instanceof r&&a.then===r.prototype.then){for(;3===a._83;)a=a._18;return 1===a._83?i(o,a._18):(2===a._83&&n(a._18),void a.then(function(t){i(o,t)},n))}var h=a.then;if("function"===typeof h){return void new r(h.bind(a)).then(function(t){i(o,t)},n)}}e[o]=a,0===--s&&t(e)}if(0===e.length)return t([]);for(var s=e.length,o=0;o<e.length;o++)i(o,e[o])})},r.reject=function(t){return new r(function(e,n){n(t)})},r.race=function(t){return new r(function(e,n){t.forEach(function(t){r.resolve(t).then(e,n)})})},r.prototype.catch=function(t){return this.then(null,t)}},function(t,e){!function(t){"use strict";function e(t){if("string"!==typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function n(t){return"string"!==typeof t&&(t=String(t)),t}function i(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return g.iterable&&(e[Symbol.iterator]=function(){return e}),e}function r(t){this.map={},t instanceof r?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function s(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function o(t){return new Promise(function(e,n){t.onload=function(){e(t.result)},t.onerror=function(){n(t.error)}})}function a(t){var e=new FileReader,n=o(e);return e.readAsArrayBuffer(t),n}function h(t){var e=new FileReader,n=o(e);return e.readAsText(t),n}function u(t){for(var e=new Uint8Array(t),n=new Array(e.length),i=0;i<e.length;i++)n[i]=String.fromCharCode(e[i]);return n.join("")}function c(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function l(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t,t)if("string"===typeof t)this._bodyText=t;else if(g.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(g.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(g.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(g.arrayBuffer&&g.blob&&w(t))this._bodyArrayBuffer=c(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!g.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!m(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=c(t)}else this._bodyText="";this.headers.get("content-type")||("string"===typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):g.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},g.blob&&(this.blob=function(){var t=s(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?s(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(a)}),this.text=function(){var t=s(this);if(t)return t;if(this._bodyBlob)return h(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(u(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},g.formData&&(this.formData=function(){return this.text().then(y)}),this.json=function(){return this.text().then(JSON.parse)},this}function f(t){var e=t.toUpperCase();return k.indexOf(e)>-1?e:t}function d(t,e){e=e||{};var n=e.body;if(t instanceof d){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new r(t.headers)),this.method=t.method,this.mode=t.mode,n||null==t._bodyInit||(n=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new r(e.headers)),this.method=f(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function y(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var n=t.split("="),i=n.shift().replace(/\+/g," "),r=n.join("=").replace(/\+/g," ");e.append(decodeURIComponent(i),decodeURIComponent(r))}}),e}function p(t){var e=new r;return t.split(/\r?\n/).forEach(function(t){var n=t.split(":"),i=n.shift().trim();if(i){var r=n.join(":").trim();e.append(i,r)}}),e}function b(t,e){e||(e={}),this.type="default",this.status="status"in e?e.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new r(e.headers),this.url=e.url||"",this._initBody(t)}if(!t.fetch){var g={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(g.arrayBuffer)var v=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],w=function(t){return t&&DataView.prototype.isPrototypeOf(t)},m=ArrayBuffer.isView||function(t){return t&&v.indexOf(Object.prototype.toString.call(t))>-1};r.prototype.append=function(t,i){t=e(t),i=n(i);var r=this.map[t];this.map[t]=r?r+","+i:i},r.prototype.delete=function(t){delete this.map[e(t)]},r.prototype.get=function(t){return t=e(t),this.has(t)?this.map[t]:null},r.prototype.has=function(t){return this.map.hasOwnProperty(e(t))},r.prototype.set=function(t,i){this.map[e(t)]=n(i)},r.prototype.forEach=function(t,e){for(var n in this.map)this.map.hasOwnProperty(n)&&t.call(e,this.map[n],n,this)},r.prototype.keys=function(){var t=[];return this.forEach(function(e,n){t.push(n)}),i(t)},r.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),i(t)},r.prototype.entries=function(){var t=[];return this.forEach(function(e,n){t.push([n,e])}),i(t)},g.iterable&&(r.prototype[Symbol.iterator]=r.prototype.entries);var k=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];d.prototype.clone=function(){return new d(this,{body:this._bodyInit})},l.call(d.prototype),l.call(b.prototype),b.prototype.clone=function(){return new b(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new r(this.headers),url:this.url})},b.error=function(){var t=new b(null,{status:0,statusText:""});return t.type="error",t};var x=[301,302,303,307,308];b.redirect=function(t,e){if(-1===x.indexOf(e))throw new RangeError("Invalid status code");return new b(null,{status:e,headers:{location:t}})},t.Headers=r,t.Request=d,t.Response=b,t.fetch=function(t,e){return new Promise(function(n,i){var r=new d(t,e),s=new XMLHttpRequest;s.onload=function(){var t={status:s.status,statusText:s.statusText,headers:p(s.getAllResponseHeaders()||"")};t.url="responseURL"in s?s.responseURL:t.headers.get("X-Request-URL");var e="response"in s?s.response:s.responseText;n(new b(e,t))},s.onerror=function(){i(new TypeError("Network request failed"))},s.ontimeout=function(){i(new TypeError("Network request failed"))},s.open(r.method,r.url,!0),"include"===r.credentials&&(s.withCredentials=!0),"responseType"in s&&g.blob&&(s.responseType="blob"),r.headers.forEach(function(t,e){s.setRequestHeader(e,t)}),s.send("undefined"===typeof r._bodyInit?null:r._bodyInit)})},t.fetch.polyfill=!0}}("undefined"!==typeof self?self:this)},function(t,e,n){"use strict";function i(t){if(null===t||void 0===t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}var r=Object.getOwnPropertySymbols,s=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable;t.exports=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},n=0;n<10;n++)e["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(e).map(function(t){return e[t]}).join(""))return!1;var i={};return"abcdefghijklmnopqrst".split("").forEach(function(t){i[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},i)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var n,a,h=i(t),u=1;u<arguments.length;u++){n=Object(arguments[u]);for(var c in n)s.call(n,c)&&(h[c]=n[c]);if(r){a=r(n);for(var l=0;l<a.length;l++)o.call(n,a[l])&&(h[a[l]]=n[a[l]])}}return h}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(10),r=n(13);n.n(r),new i.a(0)},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var r=n(11),s=n(12),o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),a=function(){function t(e){var n=this;i(this,t),this.cellSize=15,this.width=25,this.widthMax=45,this.height=21,this.heightMax=37,this.snakes=[new r.a({x:Math.ceil(this.width/2)+2,y:Math.ceil(this.height/2),dir:"right"},"red",{on:!1,goalType:"closest"},{extra:1,ignore:!1}),new r.a({x:Math.ceil(this.width/2)-4,y:Math.ceil(this.height/2),dir:"left"},"purple",{on:!0,goalType:"last"},{extra:0,ignore:!0})],this.food=new s.a([{value:1,color:"blue"},{value:3,color:"green"},{value:5,color:"yellow"}]),this.highScore=e,this.state="paused",this.speed=600,this.maxSpeed=175,this.screen=document.createElement("canvas"),this.screen.width=this.width*this.cellSize,this.screen.height=this.height*this.cellSize+43,document.body.appendChild(this.screen),this.screenCTX=this.screen.getContext("2d"),this.back=document.createElement("canvas"),this.back.width=this.width*this.cellSize,this.back.height=this.height*this.cellSize+43,this.backCTX=this.back.getContext("2d"),this.backCTX.font="12px Arial",this.handleKeyDown=this.handleKeyDown.bind(this),window.onkeydown=this.handleKeyDown,this.food.placeFood(this.snakes,this.width,this.height),this.snakes.forEach(function(t){t.setGoal(n.food)}),this.render("Paused - Interval: "+this.speed,"To start the game hit [P].")}return o(t,[{key:"handleKeyDown",value:function(t){switch(t.preventDefault(),String.fromCharCode(t.keyCode)){case"W":this.snakes[0].tryUp();break;case"A":this.snakes[0].tryLeft();break;case"S":this.snakes[0].tryDown();break;case"D":this.snakes[0].tryRight();break;case"P":switch(this.state){case"running":this.pause();break;case"paused":this.unpause();break;case"over":this.reset()}}}},{key:"render",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";this.backCTX.save(),this.backCTX.fillStyle="black",this.backCTX.fillRect(0,0,this.width*this.cellSize,this.width*this.cellSize+43),this.backCTX.restore(),this.backCTX.save(),this.snakes[0].renderRay(this.backCTX,this.cellSize,this.width,this.height),this.backCTX.restore(),this.backCTX.save(),this.snakes.forEach(function(t){t.render(e.backCTX,e.cellSize)}),this.backCTX.restore(),this.backCTX.save(),this.food.render(this.backCTX,this.cellSize),this.backCTX.restore();var i="Your Score: "+this.snakes[0].score+" - High Score: "+this.highScore+" - Extra Lives: "+this.snakes[0].lives.extra,r=this.backCTX.measureText(i),s=this.backCTX.measureText(t),o=this.backCTX.measureText(n);this.backCTX.fillStyle="orange",this.backCTX.fillText(i,this.width/2*this.cellSize-r.width/2,(this.height+1)*this.cellSize+5),this.backCTX.fillText(t,this.width/2*this.cellSize-s.width/2,(this.height+1)*this.cellSize+20),this.backCTX.fillText(n,this.width/2*this.cellSize-o.width/2,this.height/2*this.cellSize),this.screenCTX.drawImage(this.back,0,0)}},{key:"removeSnake",value:function(t){if(1===this.snakes.filter(function(t){return!t.ai.on}).length||0===this.snakes.filter(function(t){return!t.ai.on}).length&&2===this.snakes.length)return void(this.state="over");this.snakes.splice(t,1)}},{key:"replaceSnake",value:function(t,e,n){var i=this.snakes[t];this.snakes[t]=new r.a(i.spawn,i.color,i.ai,{extra:i.lives.extra-(i.lives.ignore?0:1),ignore:i.lives.ignore},i.score)}},{key:"update",value:function(){for(var t=this,e=[],n=[],i=0,r=0;r<this.snakes.length;r++)this.snakes[r].ai.on&&this.snakes[r].steerAI(this.snakes,this.food.loc,this.width,this.height);for(var s=0;s<this.snakes.length;s++)this.snakes[s].updatePosition(),this.snakes[s].checkEat(this.food)&&(this.speed>this.maxSpeed&&(this.speed-=25,this.state="refresh"),this.snakes[s].segments.length%10===0&&(this.width<this.widthMax&&this.width++,this.height<this.heightMax&&this.height++,this.screen.width=this.width*this.cellSize,this.screen.height=this.height*this.cellSize+43,this.back.width=this.width*this.cellSize,this.back.height=this.height*this.cellSize+43),e.push(s));for(var o=0;o<this.snakes.length;o++)this.snakes[o].checkHit(this.snakes,e,this.width,this.height)&&n.push(o);n.forEach(function(e){t.snakes[e].lives.ignore||0!==t.snakes[e].lives.extra?t.replaceSnake(e,n.length,i):(t.removeSnake(e-i),i++)}),e.length>0&&(this.food.placeFood(this.snakes,this.width,this.height),this.snakes.forEach(function(e){e.setGoal(t.food)}))}},{key:"pause",value:function(){this.state="paused",clearInterval(this.loopID),this.render("Paused - Interval: "+this.speed,"Paused! Hit [P] to unpause.")}},{key:"unpause",value:function(){var t=this;this.state="running",this.loopID=setInterval(function(){return t.loop()},this.speed),this.render("Running - Interval: "+this.speed)}},{key:"reset",value:function(){document.body.removeChild(this.screen),new t(this.snakes[0].score>this.highScore?this.snakes[0].score:this.highScore)}},{key:"loop",value:function(){var t=this;switch(this.update(),this.state){case"running":this.render("Running - Interval: "+this.speed);break;case"paused":this.render("Paused - Interval: "+this.speed,"Paused! Hit [P] to unpause.");break;case"refresh":clearInterval(this.loopID),this.state="running",this.loopID=setInterval(function(){return t.loop()},this.speed),this.render("Running - Interval: "+this.speed);break;case"over":clearInterval(this.loopID),this.render("Game Over - Interval: "+this.speed,"Game Over! Hit [P] to replay.")}}}]),t}();e.a=a},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),s=function(){function t(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{on:!1,goalType:"random",goal:0},s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{extra:0,ignore:!1},o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0;switch(i(this,t),this.spawn=e,this.segments=[{x:e.x,y:e.y}],e.dir){case"up":this.segments.push({x:e.x,y:e.y+1}),this.segments.push({x:e.x,y:e.y+2});break;case"left":this.segments.push({x:e.x+1,y:e.y}),this.segments.push({x:e.x+2,y:e.y});break;case"down":this.segments.push({x:e.x,y:e.y-1}),this.segments.push({x:e.x,y:e.y-2});break;case"right":this.segments.push({x:e.x-1,y:e.y}),this.segments.push({x:e.x-2,y:e.y})}this.dir={curr:e.dir,next:e.dir},this.color=n,this.ai=r,this.lives=s,this.score=o}return r(t,[{key:"findClosest",value:function(t){var e=this.segments[0],n=[];return t.forEach(function(t){n.push(Math.abs(e.x-t.x)+Math.abs(e.y-t.y))}),n.indexOf(Math.min.apply(null,n))}},{key:"setGoal",value:function(t){if(this.ai.on)switch(this.ai.goalType){case"closest":this.ai.goal=this.findClosest(t.loc);break;case"last":this.ai.goal=t.loc.length-1;break;case"random":this.ai.goal=Math.round(Math.random()*(t.loc.length-1))}}},{key:"tryUp",value:function(){return"down"!==this.dir.curr&&(this.dir.next="up",!0)}},{key:"tryLeft",value:function(){return"right"!==this.dir.curr&&(this.dir.next="left",!0)}},{key:"tryDown",value:function(){return"up"!==this.dir.curr&&(this.dir.next="down",!0)}},{key:"tryRight",value:function(){return"left"!==this.dir.curr&&(this.dir.next="right",!0)}},{key:"steerAI",value:function(t,e,n,i){for(var r,s,o=this.segments.pop(),a={up:!0,left:!0,down:!0,right:!0},h=e[this.ai.goal],u=0;u<4;u++){if(r=this.segments[0].x,s=this.segments[0].y,r>h.x)a.left&&this.tryLeft()||s>h.y&&a.up&&this.tryUp()||s<h.y&&a.down&&this.tryDown()||a.up&&this.tryUp()||a.down&&this.tryDown()||(this.dir.next="right");else if(r<h.x)a.right&&this.tryRight()||s>h.y&&a.up&&this.tryUp()||s<h.y&&a.down&&this.tryDown()||a.down&&this.tryDown()||a.up&&this.tryUp()||(this.dir.next="left");else if(s>h.y)a.up&&this.tryUp()||a.right&&this.tryRight()||a.left&&this.tryLeft()||(this.dir.next="down");else if(s<h.y)a.down&&this.tryDown()||a.left&&this.tryLeft()||a.right&&this.tryRight()||(this.dir.next="up");else if(!(a.up&&this.tryUp()||a.right&&this.tryRight()||a.down&&this.tryDown()||a.left&&this.tryLeft()))return void this.segments.push(o);switch(this.dir.next){case"up":s--;break;case"left":r--;break;case"down":s++;break;case"right":r++}if(!(r<0||s<0||r>=n||s>=i||t.find(function(t){return t.segments.find(function(t){return t.x===r&&t.y===s})})))return void this.segments.push(o);a[this.dir.next]=!1}this.segments.push(o)}},{key:"updatePosition",value:function(){var t=this.segments[0].x,e=this.segments[0].y;switch(this.dir.curr=this.dir.next,this.dir.curr){case"up":e--;break;case"left":t--;break;case"down":e++;break;case"right":t++}this.segments.unshift({x:t,y:e})}},{key:"checkEat",value:function(t){for(var e,n=this.segments[0].x,i=this.segments[0].y,r=0;r<t.loc.length;r++)if(e=t.eatFood(n,i))return this.score+=e.value,this.lives.ignore||(this.segments.length-1)%(30*Math.pow(2,this.lives.extra))!==0||this.lives.extra++,!0;return this.segments.pop(),!1}},{key:"checkHit",value:function(t,e,n,i){for(var r=this.segments.shift(),s={},o=0;o<t.length;o++)e.includes(o)||(s[o]=t[o].segments.pop());if(r.x<0||r.y<0||r.x>=n||r.y>=i||t.find(function(t){return t.segments.find(function(t){return t.x===r.x&&t.y===r.y})})){this.segments.unshift(r);for(var a=0;a<t.length;a++)e.includes(a)||t[a].segments.push(s[a]);return!0}this.segments.unshift(r);for(var h=0;h<t.length;h++)e.includes(h)||t[h].segments.push(s[h]);return!1}},{key:"render",value:function(t,e){var n=this.segments[0],i=this.segments.length-1;switch(t.fillStyle=this.color,this.segments.slice(1,i).forEach(function(n){t.fillRect(n.x*e,n.y*e,e,e)}),t.beginPath(),t.arc((this.segments[i].x+.5)*e,(this.segments[i].y+.5)*e,e/2,0,2*Math.PI,!0),t.fill(),this.dir.curr){case"up":t.fillRect(n.x*e,(n.y+.5)*e,e,e/2),t.beginPath(),t.arc((n.x+.5)*e,(n.y+.5)*e,e/2,0,2*Math.PI,!0),t.fill(),t.fillStyle="white",t.fillRect(n.x*e+2,(n.y+1)*e-5,3,2),t.fillRect((n.x+1)*e-5,(n.y+1)*e-5,3,2);break;case"left":t.fillRect((n.x+.5)*e,n.y*e,e/2,e),t.beginPath(),t.arc((n.x+.5)*e,(n.y+.5)*e,e/2,0,2*Math.PI,!0),t.fill(),t.fillStyle="white",t.fillRect((n.x+1)*e-5,n.y*e+2,2,3),t.fillRect((n.x+1)*e-5,(n.y+1)*e-5,2,3);break;case"down":t.fillRect(n.x*e,n.y*e,e,e/2),t.beginPath(),t.arc((n.x+.5)*e,(n.y+.5)*e,e/2,0,2*Math.PI,!0),t.fill(),t.fillStyle="white",t.fillRect(n.x*e+2,n.y*e+3,3,2),t.fillRect((n.x+1)*e-5,n.y*e+3,3,2);break;case"right":t.fillRect(n.x*e,n.y*e,e/2,e),t.beginPath(),t.arc((n.x+.5)*e,(n.y+.5)*e,e/2,0,2*Math.PI,!0),t.fill(),t.fillStyle="white",t.fillRect(n.x*e+3,n.y*e+2,2,3),t.fillRect(n.x*e+3,(n.y+1)*e-5,2,3)}}},{key:"renderRay",value:function(t,e,n,i){var r=this.segments[0].x*e+e/2,s=this.segments[0].y*e+e/2;switch(t.strokeStyle="white",this.dir.curr){case"up":t.beginPath(),t.moveTo(r,s),t.lineTo(r,0),t.stroke();break;case"left":t.beginPath(),t.moveTo(r,s),t.lineTo(0,s),t.stroke();break;case"down":t.beginPath(),t.moveTo(r,s),t.lineTo(r,i*e-1),t.stroke();break;case"right":t.beginPath(),t.moveTo(r,s),t.lineTo(n*e-1,s),t.stroke()}}}]),t}();e.a=s},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),s=function(){function t(e){i(this,t),this.typ=e,this.loc=[]}return r(t,[{key:"eatFood",value:function(t,e){var n=this.loc.findIndex(function(n){return n.x===t&&n.y===e});if(!(n<0))return this.typ[n]}},{key:"placeFood",value:function(t,e,n){var i=this;this.loc=[],this.typ.forEach(function(r){for(var s=Math.floor(Math.random()*(e-2)+1),o=Math.floor(Math.random()*(n-2)+1);t.find(function(t){return t.segments.find(function(t){return t.x===s&&t.y===o})})||i.loc.find(function(t){return t.x===s&&t.y===o});)s=Math.floor(Math.random()*(e-2)+1),o=Math.floor(Math.random()*(n-2)+1);i.loc.push({x:s,y:o})})}},{key:"render",value:function(t,e){for(var n=0;n<this.typ.length;n++)t.fillStyle=this.typ[n].color,t.beginPath(),t.arc((this.loc[n].x+.5)*e,(this.loc[n].y+.5)*e,e/2-2,0,2*Math.PI,!0),t.fill()}}]),t}();e.a=s},function(t,e){}]);
//# sourceMappingURL=main.31d74200.js.map