/* 
 *  PhotoMosaic v2.3.4 starts around line ~#110
 */

(function (window) {
    if (!window.PhotoMosaic) {
        window.PhotoMosaic = {};
    }
}(window));


/*
    JSTween JavaScript Library v1.1
    http://www.jstween.org/
    JSTween by Marco Wolfsheimer is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
*/
(function (window) {
    if (!window.PhotoMosaic) {
        window.PhotoMosaic = {};
    }
    window.PhotoMosaic.JSTween = function(e,t){
        var n=/[\-]{0,1}[0-9\.]{1,}|#[0-9\.abcdef]{3,6}/gi,r=/[pxemtcin%]{1,2}|deg/gi,s=/[0-9\.\-]{1,}/gi,o=/[0-9a-f]{3,6}/gi,u=/^#/,a=/^[0-9\.\-]{1,}([pxemtcin%]{1,2}|deg)$/,f=/[a-z]{1,}/,l=/^rgb\(/,c=/^scroll/,h=/-([a-z])/ig,p=/^-ms/ig,d={opacity:["opacity","-moz-opacity","filter"],shadow:["box-shadow","-moz-box-shadow","-o-box-shadow","-ms-box-shadow","-webkit-box-shadow"],transform:["-moz-transform","transform","-o-transform","-ms-transform","-webkit-transform"],transformOrigin:["-moz-transform-origin","transform-origin","-o-transform-origin","-ms-transform-origin","-webkit-transform-origin"],borderRadius:["-moz-border-radius","border-radius","-webkit-border-radius"],borderRadiusTopLeft:["-moz-border-radius-topleft","border-top-left-radius","-webkit-border-top-left-radius"],borderRadiusTopRight:["-moz-border-radius-topright","border-top-right-radius","-webkit-border-top-right-radius"],borderRadiusBottomLeft:["-moz-border-radius-bottomleft","border-bottom-left-radius","-webkit-border-bottom-left-radius"],borderRadiusBottomRight:["-moz-border-radius-bottomright","border-bottom-right-radius","-webkit-border-bottom-right-radius"],backgroundSize:["background-size","-moz-background-size","-o-background-size","-webkit-background-size"]},v={},m=[],g=0,y=0,b=false,w=false,E=false,S=0,x={},T=/iPad/i.test(navigator.userAgent)||/iPhone OS/i.test(navigator.userAgent);var N=function(){A(T?30:45);O();try{C()}catch(e){return}};var C=function(){var n=e.fn;e.JSTween=t;n.tween=function(e){var t,n=this.length;for(t=0;t<n;t++){z(this[t],e)}return this};e.framerate=function(e){A(e)};e.play=function(e){V(e)};e.clear=function(e,t){$(e,t)};n.play=function(e){V(e);return this};n.clear=function(e){var t,n=this.length;for(t=0;t<n;t++){$(this[t],e)}return this};n.property=function(e){var t=[],n,r=this.length;for(n=0;n<r;n++){t.push(M(this[n],e))}return t.length===1?t[0]:t};n.opacity=function(e){var t,n=this.length;for(t=0;t<n;t++){Z(this[t],e)}return this};n.alpha=n.opacity;n.transparency=n.opacity;n.rotate=function(e){var t,n=this.length;for(t=0;t<n;t++){tt(this[t],e)}return this};n.action=function(t,n,i,o){var u,f,l,c=this.length,h={};if(typeof t==="object"){for(f in t){if(t.hasOwnProperty(f)&&typeof t[f]==="string"){if(a.test(t[f])){h[f]={value:parseFloat(t[f].match(s)[0],10),units:t[f].match(r)[0]}}else{h[f]={value:t[f],units:undefined}}}}for(l=0;l<c;l++){u=e.JSTween.register(this[l]);for(f in h){if(h.hasOwnProperty(f)){e.JSTween.action(u,f,h[f].value,h[f].units,undefined,true)}}}}else{for(l=0;l<c;l++){Q(ut(this[l]),t,n,i,o,true)}}return this};n.state=function(e){if(this.length>0){if(this[0].__animate!==undefined){if(e!==undefined&&this[0].__animate.state[e]!==undefined){return this[0].__animate.state[e]}else if(e===undefined){return this[0].__animate.state}}}};n.transform=function(e){var t,n=this.length;for(t=0;t<n;t++){nt(this[t],e)}return this};n.transformOrigin=function(e){var t,n=this.length;for(t=0;t<n;t++){it(this[t],e)}return this};n.backgroundSize=function(e){var t,n=this.length;for(t=0;t<n;t++){rt(this[t],e)}return this};n.shadow=function(e){var t,n=this.length;for(t=0;t<n;t++){et(this[t],e)}return this};n.borderRadius=function(e,t){var n,r=this.length;for(n=0;n<r;n++){st(this[n],e,t)}return this};n.borderRadiusTopRight=function(e,t){var n,r=this.length;for(n=0;n<r;n++){ot(this[n],"top","right",e,t)}return this};n.borderRadiusTopLeft=function(e,t){var n,r=this.length;for(n=0;n<r;n++){ot(this[n],"top","left",e,t)}return this};n.borderRadiusBottomRight=function(e,t){var n,r=this.length;for(n=0;n<r;n++){ot(this[n],"bottom","right",e,t)}return this};n.borderRadiusBottomLeft=function(e,t){var n,r=this.length;for(n=0;n<r;n++){ot(this[n],"bottom","left",e,t)}return this};n.borderRadiusCorner=function(e,t,n,r){var i,s=this.length;for(i=0;i<this.length;i++){ot(this[i],e,t,n,r)}return this}};var k=function(e,t){return t.toUpperCase()};var L=function(e){return e.replace(p,"ms").replace(h,k)};var A=function(e){if(!e){return x.frameRate}x.frameRate=e||45;x.frameDelay=Math.round(1e3/x.frameRate);x.frameLength=1/x.frameRate;return x.frameRate};var O=function(){var e=document.getElementsByTagName("html"),t,n;if(e[0]!==undefined){t=e[0].style;for(n in d){if(d.hasOwnProperty(n)){for(i=0;i<d[n].length;i++){if(t[d[n][i]]!==undefined){d[n]=d[n][i];break}else if(t[L(d[n][i])]!==undefined){d[n]=L(d[n][i]);break}}}}}};var M=function(e,t){if(e.__animate!==undefined){if(t===undefined){return e.__animate.state}else if(e.__animate.state[t]){return e.__animate.state[t]}else{return false}}else{return false}};var _=function(t,n,r){if(t.tagName===undefined&&(t.scroll!==undefined||t.scrollTo!==undefined)){return e(t).scrollLeft()+"px "+e(t).scrollTop()+"px"}else{return t.scrollLeft+"px "+t.scrollTop+"px"}};var D=function(e,t,n){var i=M(e,t),o,u,a,f;if(i!==false&&!c.test(t)){return{value:i.value,units:e.__animate.state[t].units}}else{switch(t){case"transform":case"transformOrigin":case"shadow":case"boxShadow":case"backgroundSize":u=n;break;case"opacity":case"transparency":case"alpha":u=100;break;case"scrollLeft":case"scrollTop":case"scroll":case"scrollTo":u=_(e,t,n);break;default:if(window.getComputedStyle!==undefined){o=window.getComputedStyle(e,null)[t]}else if(e.currentStyle!==undefined){o=e.currentStyle[t]}if(o==="auto"||o===undefined||o===""){u=0;a="px"}else if(l.test(o)){u=B(o)}else{u=parseFloat(o.match(s),10);a=o.match(r)}break}return{value:u,units:a}}};var P=function(e,t){var n={},r,i;for(r in t){if(t.hasOwnProperty(r)&&r!=="onStart"&&r!=="onStop"&&r!=="onFrame"){n[r]={};if(t[r].start===undefined){i=D(e,r,t[r].stop);n[r].start=i.value}else{n[r].start=H(t[r].start)}n[r].stop=H(t[r].stop,1);n[r].duration=H(t[r].duration||n[r].dur,1);n[r].time=H(t[r].time,0);n[r].merge=H(t[r].merge,false);n[r].effect=H(t[r].effect,"linear");n[r].framerate=H(t[r].framerate,x.frameRate);n[r].units=H(t[r].units,i?i.units:"px");n[r].end=H(t[r].end,n[r].time+n[r].duration);if(c.test(r)){if(typeof n[r].start==="number"){n[r].start=n[r].start+"px "+n[r].start+"px"}if(typeof n[r].stop==="number"){n[r].stop=n[r].stop+"px "+n[r].stop+"px"}}n[r].callback={onStart:t[r].onStart,onFrame:t[r].onFrame,onStop:t[r].onStop}}}return n};var H=function(e,t){if(typeof e==="function"){return e()}else if(e!==undefined){return e}else{return t}};var B=function(e){var t=e.match(s),n,r,i;n=parseInt(t[0],10).toString(16);if(n.length===1){n="0"+n}r=parseInt(t[1],10).toString(16);if(r.length===1){r="0"+r}i=parseInt(t[2],10).toString(16);if(i.length===1){i="0"+i}return"#"+n+r+i};var j=function(e){if(e.length===3){return[parseInt(e.substr(0,1),16)*16,parseInt(e.substr(1,1),16)*16,parseInt(e.substr(2,1),16)*16]}else{return[parseInt(e.substr(0,2),16),parseInt(e.substr(2,2),16),parseInt(e.substr(4,2),16)]}};var F=function(e){var t=e.match(n),r=e.split(n),i=[],a,f=t.length;for(a=0;a<f;a++){if(u.test(t[a])){t[a]=j(t[a].match(o)[0])}else{t[a]=parseFloat(t[a].match(s)[0],10)}}return{value:t,delimiter:r}};var I=function(e,t,n,r,i,s){var o="",u="",a,f,l=e.value.length,c=0;for(a=0;a<l;a++){if(typeof e.value[a]==="object"&&e.value[a].length!==undefined){o+=e.delimiter[a]+"#";c=e.value[a].length;for(f=0;f<c;f++){u=Math.round(at[r.effect](i-r.time,e.value[a][f],t.value[a][f]-e.value[a][f],s-r.time),10).toString(16);if(u.length===1){u="0"+u}o+=u}}else{o+=e.delimiter[a]+at[r.effect](i-r.time,e.value[a],t.value[a]-e.value[a],s-r.time)}}return o+e.delimiter[e.delimiter.length-1]};var q=function(e,t,n){var r,i=F(n.start),s=F(n.stop),o,u,a,f,l=x.frameLength,c=n.end;r=f=Math.round(x.frameRate/n.framerate-1);for(o=n.time;o<c;o+=l){u=g+Math.round(o*x.frameRate);if(r===0){a=I(i,s,t,n,o,n.end);W(u,e,t,a,n.units,false,false);r=f}else{W(u,e,t);r--}}u=g+Math.round(n.end*x.frameRate);W(u,e,t,n.stop,n.units,false,true)};var R=function(e,t,n){var r,i,s,o,u,a=x.frameLength,f=n.end;r=u=Math.round(x.frameRate/n.framerate-1);for(i=n.time;i<f;i+=a){s=g+Math.round(i*x.frameRate);if(r===0){o=at[n.effect](i-n.time,n.start,n.stop-n.start,n.end-n.time);W(s,e,t,o,n.units,false,false);r=u}else{W(s,e,t);r--}}s=g+Math.round(n.end*x.frameRate);W(s,e,t,n.stop,n.units,false,true)};var U=function(e){var t={start:0,stop:0},n;for(n in e){if(e.hasOwnProperty(n)){if(e[n].end>t.stop){t.stop=e[n].end}}}t.start=t.stop;for(n in e){if(e.hasOwnProperty(n)){if(e[n].time<t.start){t.start=e[n].time}}}return t};var z=function(e,t){var n=ut(e),r=0,i=0,s,o,u=0,a=P(e,t),f,l=U(a);for(f in a){if(a.hasOwnProperty(f)){if(typeof a[f].start==="string"){q(n,f,a[f])}else{R(n,f,a[f])}if(typeof a[f].callback.onStart==="function"){X(g+Math.round(a[f].time*x.frameRate),n,f,a[f].callback.onStart)}if(typeof a[f].callback.onFrame==="function"){for(i=a[f].time;i<a[f].end;i+=x.frameLength){r=g+Math.round(i*x.frameRate);X(r,n,f,a[f].callback.onFrame)}}if(typeof a[f].callback.onStop==="function"){X(g+Math.round(a[f].end*x.frameRate),n,f,a[f].callback.onStop)}r=g+Math.round(a[f].end*x.frameRate);if(r>y){y=r}}}if(typeof t.onStart==="function"){X(g+Math.round(l.start*x.frameRate),n,"callback",t.onStart)}if(typeof t.onFrame==="function"){for(frame=g+Math.round(l.start*x.frameRate);frame<=g+Math.round(l.stop*x.frameRate);frame++){X(frame,n,"callback",t.onFrame)}}if(typeof t.onStop==="function"){X(g+Math.round(l.stop*x.frameRate),n,"callback",t.onStop)}};var W=function(e,t,n,r,i,s,o){if(t!==undefined){if(v[e]===undefined){v[e]={};v[e][t]={};v[e][t][n]={value:r,units:i,callback:[],skip:o}}else if(v[e][t]===undefined){v[e][t]={};v[e][t][n]={value:r,units:i,callback:[],skip:o}}else if(v[e][t][n]===undefined){v[e][t][n]={value:r,units:i,callback:[],skip:o}}else{if(r!==false){v[e][t][n].value=r}if(i!==false){v[e][t][n].units=i}v[e][t][n].skip=o}if(typeof s==="function"){v[e][t][n].callback.push(s)}}else if(v[e]===undefined){v[e]={}}};var X=function(e,t,n,r){W(e,t,n,false,false,r,true)};var V=function(e){if(b===false){E=false;b=true;S=J();w=e;K()}};var $=function(e,t){var n;if(e!==undefined&&t!==undefined&&e.__animate!==undefined){for(n in v){if(v.hasOwnProperty(n)&&v[n][e.__animate.id]!==undefined&&v[n][e.__animate.id][t]!==undefined){delete v[n][e.__animate.id][t]}}}else if(e!==undefined&&e.__animate!==undefined){for(n in v){if(v.hasOwnProperty(n)&&v[n][e.__animate.id]!==undefined){delete v[n][e.__animate.id]}}}else{for(n in v){if(v.hasOwnProperty(n)){delete v[n]}}}};var J=function(){var e=new Date;return e.getTime()};var K=function(){var e,t,n,r;if(g<=y){r=x.frameDelay-(J()-S-g*x.frameDelay);if(r<0){r=0}else if(r>x.frameDelay){r=x.frameDelay}setTimeout(function(){K(r?true:false)},r);for(t in v[g]){if(v[g].hasOwnProperty(t)){e=v[g][t];for(n in e){if(e.hasOwnProperty(n)){Q(t,n,e[n].value,e[n].units,e[n].callback,e[n].skip===true?true:r?true:false)}}}}delete v[g];g++;E=J()}else{E=b=false;g=0;if(typeof w==="function"){w();w=false}}};var Q=function(e,t,n,r,s,o){var u=m[e].__animate.state[t];if(o===true&&n!==false&&(u===undefined||u.value!=n||u.units!=r)){switch(t){case"zIndex":m[e].style.zIndex=n;break;case"alpha":case"transparency":case"opacity":Z(m[e],n);break;case"scroll":case"scrollTop":case"scrollLeft":case"scrollTo":G(m[e],t,n);break;case"shadow":case"boxShadow":et(m[e],n);break;case"rotate":tt(m[e],n);break;case"transformOrigin":it(m[e],n);break;case"transform":nt(m[e],n);break;case"backgroundSize":rt(m[e],n);break;case"borderRadius":st(m[e],n,r);break;case"borderRadiusTopRight":ot(m[e],"top","right",n,r);break;case"borderRadiusTopLeft":ot(m[e],"top","left",n,r);break;case"borderRadiusBottomRight":ot(m[e],"bottom","right",n,r);break;case"borderRadiusBottomLeft":ot(m[e],"bottom","left",n,r);break;default:if(typeof n==="string"){m[e].style[t]=n}else{m[e].style[t]=n+r}break}}m[e].__animate.state[t]={value:n,units:r};if(s!==undefined&&s.length>0){for(i=0;i<s.length;i++){if(typeof s[i]==="function"){s[i](m[e],{type:t,value:n,units:r,id:e})}}}};var G=function(e,t,n){var r;if(e.tagName===undefined&&(typeof e.scroll==="function"||typeof e.scrollTo==="function")&&typeof n==="string"){r=n.match(s);if(r){if(self.pageYOffset){window.scroll(parseInt(r[0],10),parseInt(r[1],10))}else if(document.documentElement&&document.documentElement.scrollTop){window.scrollTo(parseInt(r[0],10),parseInt(r[1],10))}else if(document.body){window.scrollTo(parseInt(r[0],10),parseInt(r[1],10))}}}else{if(typeof n==="string"){r=n.match(s)}else{r=[n,n]}if(t==="scrollTop"){e.scrollTop=parseInt(r[1],10)}else if(t==="scrollLeft"){e.scrollLeft=parseInt(r[0],10)}else{e.scrollLeft=parseInt(r[0],10);e.scrollTop=parseInt(r[1],10)}}};var Y=function(e,t,n,r){e.style[t]=n+(r?r:"")};var Z=function(e,t){if(d.opacity==="filter"){Y(e,"filter","alpha(opacity="+t+")")}else{Y(e,d.opacity,t/100)}};var et=function(e,t){Y(e,d.shadow,t)};var tt=function(e,t){Y(e,d.transform,"rotate("+t+"deg)")};var nt=function(e,t){Y(e,d.transform,t)};var rt=function(e,t){Y(e,d.backgroundSize,t)};var it=function(e,t){Y(e,d.transformOrigin,t)};var st=function(e,t,n){Y(e,d.borderRadius,t,n)};var ot=function(e,t,n,r,i){if(t==="top"){if(n==="left"){Y(e,d.borderRadiusTopLeft,r,i)}else{Y(e,d.borderRadiusTopRight,r,i)}}else{if(n==="left"){Y(e,d.borderRadiusBottomLeft,r,i)}else{Y(e,d.borderRadiusBottomRight,r,i)}}};var ut=function(e){if(e.__animate===undefined){var t=m.length;e.__animate={id:t,state:{},callback:{},dragging:false};m.push(e);return t}else{return e.__animate.id}};var at={linear:function(e,t,n,r){return n*e/r+t},quadIn:function(e,t,n,r){return n*(e/=r)*e+t},quadOut:function(e,t,n,r){return-n*(e/=r)*(e-2)+t},quadInOut:function(e,t,n,r){if((e/=r/2)<1){return n/2*e*e+t}return-n/2*(--e*(e-2)-1)+t},cubicIn:function(e,t,n,r){return n*(e/=r)*e*e+t},cubicOut:function(e,t,n,r){return n*((e=e/r-1)*e*e+1)+t},cubicInOut:function(e,t,n,r){if((e/=r/2)<1){return n/2*e*e*e+t}return n/2*((e-=2)*e*e+2)+t},easeIn:function(e,t,n,r){return n*(e/=r)*e*e+t},easeOut:function(e,t,n,r){return n*((e=e/r-1)*e*e+1)+t},easeInOut:function(e,t,n,r){if((e/=r/2)<1){return n/2*e*e*e+t}return n/2*((e-=2)*e*e+2)+t},quartIn:function(e,t,n,r){return n*(e/=r)*e*e*e+t},quartOut:function(e,t,n,r){return-n*((e=e/r-1)*e*e*e-1)+t},quartInOut:function(e,t,n,r){if((e/=r/2)<1){return n/2*e*e*e*e+t}return-n/2*((e-=2)*e*e*e-2)+t},quintIn:function(e,t,n,r){return n*(e/=r)*e*e*e*e+t},quintOut:function(e,t,n,r){return n*((e=e/r-1)*e*e*e*e+1)+t},quintInOut:function(e,t,n,r){if((e/=r/2)<1){return n/2*e*e*e*e*e+t}return n/2*((e-=2)*e*e*e*e+2)+t},sineIn:function(e,t,n,r){return-n*Math.cos(e/r*(Math.PI/2))+n+t},sineOut:function(e,t,n,r){return n*Math.sin(e/r*(Math.PI/2))+t},sineInOut:function(e,t,n,r){return-n/2*(Math.cos(Math.PI*e/r)-1)+t},expoIn:function(e,t,n,r){return e===0?t:n*Math.pow(2,10*(e/r-1))+t},expoOut:function(e,t,n,r){return e===r?t+n:n*(-Math.pow(2,-10*e/r)+1)+t},expoInOut:function(e,t,n,r){if(e===0){return t}if(e===r){return t+n}if((e/=r/2)<1){return n/2*Math.pow(2,10*(e-1))+t}return n/2*(-Math.pow(2,-10*--e)+2)+t},circIn:function(e,t,n,r){return-n*(Math.sqrt(1-(e/=r)*e)-1)+t},circOut:function(e,t,n,r){return n*Math.sqrt(1-(e=e/r-1)*e)+t},circInOut:function(e,t,n,r){if((e/=r/2)<1){return-n/2*(Math.sqrt(1-e*e)-1)+t}return n/2*(Math.sqrt(1-(e-=2)*e)+1)+t},bounceIn:function(e,t,n,r){return n-at.bounceOut(r-e,0,n,r)+t},bounceOut:function(e,t,n,r){if((e/=r)<1/2.75){return n*7.5625*e*e+t}else if(e<2/2.75){return n*(7.5625*(e-=1.5/2.75)*e+.75)+t}else if(e<2.5/2.75){return n*(7.5625*(e-=2.25/2.75)*e+.9375)+t}else{return n*(7.5625*(e-=2.625/2.75)*e+.984375)+t}},bounceInOut:function(e,t,n,r){if(e<r/2){return at.bounceIn(e*2,0,n,r)*.5+t}return at.bounceOut(e*2-r,0,n,r)*.5+n*.5+t},elasticIn:function(e,t,n,r,i,s){if(e===0){return t}if((e/=r)===1){return t+n}if(!s){s=r*.3}if(!i){i=1}var o=0;if(i<Math.abs(n)){i=n;o=s/4}else{o=s/(2*Math.PI)*Math.asin(n/i)}return-(i*Math.pow(2,10*(e-=1))*Math.sin((e*r-o)*2*Math.PI/s))+t},elasticOut:function(e,t,n,r,i,s){if(e===0){return t}if((e/=r)===1){return t+n}if(!s){s=r*.3}if(!i){i=1}var o=0;if(i<Math.abs(n)){i=n;o=s/4}else{o=s/(2*Math.PI)*Math.asin(n/i)}return i*Math.pow(2,-10*e)*Math.sin((e*r-o)*2*Math.PI/s)+n+t},elasticInOut:function(e,t,n,r,i,s){if(e===0){return t}if((e/=r/2)===2){return t+n}if(!s){s=r*.3*1.5}if(!i){i=1}var o=0;if(i<Math.abs(n)){i=n;o=s/4}else{o=s/(2*Math.PI)*Math.asin(n/i)}if(e<1){return-.5*i*Math.pow(2,10*(e-=1))*Math.sin((e*r-o)*2*Math.PI/s)+t}return i*Math.pow(2,-10*(e-=1))*Math.sin((e*r-o)*2*Math.PI/s)*.5+n+t}};t.tween=z;t.action=Q;t.register=ut;t.shadow=et;t.opacity=Z;t.borderRadius=st;t.borderRadiusCorner=ot;t.backgroundSize=rt;t.transformOrigin=it;t.rotate=tt;t.transform=nt;t.clear=$;t.play=V;t.property=M;t.getScroll=_;t.scroll=G;t.framerate=A;N();return t;
    }(jQuery, window.PhotoMosaic.JSTween||{});
}(window));


/*
    mustache.js — Logic-less templates in JavaScript
    See http://mustache.github.com/ for more info.
*/
(function(window){

if (!window.PhotoMosaic) {
    window.PhotoMosaic = {};
}

    window.PhotoMosaic.Mustache = function(){var Renderer=function(){};Renderer.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":true},context:{},render:function(template,context,partials,in_recursion){if(!in_recursion){this.context=context;this.buffer=[];}
    if(!this.includes("",template)){if(in_recursion){return template;}else{this.send(template);return;}}
    template=this.render_pragmas(template);var html=this.render_section(template,context,partials);if(in_recursion){return this.render_tags(html,context,partials,in_recursion);}
    this.render_tags(html,context,partials,in_recursion);},send:function(line){if(line!=""){this.buffer.push(line);}},render_pragmas:function(template){if(!this.includes("%",template)){return template;}
    var that=this;var regex=new RegExp(this.otag+"%([\\w-]+) ?([\\w]+=[\\w]+)?"+
    this.ctag);return template.replace(regex,function(match,pragma,options){if(!that.pragmas_implemented[pragma]){throw({message:"This implementation of mustache doesn't understand the '"+
    pragma+"' pragma"});}
    that.pragmas[pragma]={};if(options){var opts=options.split("=");that.pragmas[pragma][opts[0]]=opts[1];}
    return"";});},render_partial:function(name,context,partials){name=this.trim(name);if(!partials||partials[name]===undefined){throw({message:"unknown_partial '"+name+"'"});}
    if(typeof(context[name])!="object"){return this.render(partials[name],context,partials,true);}
    return this.render(partials[name],context[name],partials,true);},render_section:function(template,context,partials){if(!this.includes("#",template)&&!this.includes("^",template)){return template;}
    var that=this;var regex=new RegExp(this.otag+"(\\^|\\#)\\s*(.+)\\s*"+this.ctag+"\n*([\\s\\S]+?)"+this.otag+"\\/\\s*\\2\\s*"+this.ctag+"\\s*","mg");return template.replace(regex,function(match,type,name,content){var value=that.find(name,context);if(type=="^"){if(!value||that.is_array(value)&&value.length===0){return that.render(content,context,partials,true);}else{return"";}}else if(type=="#"){if(that.is_array(value)){return that.map(value,function(row){return that.render(content,that.create_context(row),partials,true);}).join("");}else if(that.is_object(value)){return that.render(content,that.create_context(value),partials,true);}else if(typeof value==="function"){return value.call(context,content,function(text){return that.render(text,context,partials,true);});}else if(value){return that.render(content,context,partials,true);}else{return"";}}});},render_tags:function(template,context,partials,in_recursion){var that=this;var new_regex=function(){return new RegExp(that.otag+"(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?"+
    that.ctag+"+","g");};var regex=new_regex();var tag_replace_callback=function(match,operator,name){switch(operator){case"!":return"";case"=":that.set_delimiters(name);regex=new_regex();return"";case">":return that.render_partial(name,context,partials);case"{":return that.find(name,context);default:return that.escape(that.find(name,context));}};var lines=template.split("\n");for(var i=0;i<lines.length;i++){lines[i]=lines[i].replace(regex,tag_replace_callback,this);if(!in_recursion){this.send(lines[i]);}}
    if(in_recursion){return lines.join("\n");}},set_delimiters:function(delimiters){var dels=delimiters.split(" ");this.otag=this.escape_regex(dels[0]);this.ctag=this.escape_regex(dels[1]);},escape_regex:function(text){if(!arguments.callee.sRE){var specials=['/','.','*','+','?','|','(',')','[',']','{','}','\\'];arguments.callee.sRE=new RegExp('(\\'+specials.join('|\\')+')','g');}
    return text.replace(arguments.callee.sRE,'\\$1');},find:function(name,context){name=this.trim(name);function is_kinda_truthy(bool){return bool===false||bool===0||bool;}
    var value;if(is_kinda_truthy(context[name])){value=context[name];}else if(is_kinda_truthy(this.context[name])){value=this.context[name];}
    if(typeof value==="function"){return value.apply(context);}
    if(value!==undefined){return value;}
    return"";},includes:function(needle,haystack){return haystack.indexOf(this.otag+needle)!=-1;},escape:function(s){s=String(s===null?"":s);return s.replace(/&(?!\w+;)|["'<>\\]/g,function(s){switch(s){case "&": return "&amp;";case "\\": return "\\\\";case '"': return '&quot;';case "'": return '&#39;';case "<": return "&lt;";case ">": return "&gt;";default: return s;
    }});},create_context:function(_context){if(this.is_object(_context)){return _context;}else{var iterator=".";if(this.pragmas["IMPLICIT-ITERATOR"]){iterator=this.pragmas["IMPLICIT-ITERATOR"].iterator;}
    var ctx={};ctx[iterator]=_context;return ctx;}},is_object:function(a){return a&&typeof a=="object";},is_array:function(a){return Object.prototype.toString.call(a)==='[object Array]';},trim:function(s){return s.replace(/^\s*|\s*$/g,"");},map:function(array,fn){if(typeof array.map=="function"){return array.map(fn);}else{var r=[];var l=array.length;for(var i=0;i<l;i++){r.push(fn(array[i]));}
    return r;}}};return({name:"mustache.js",version:"0.3.1-dev",to_html:function(template,view,partials,send_fun){var renderer=new Renderer();if(send_fun){renderer.send=send_fun;}
    renderer.render(template,view,partials);if(!send_fun){return renderer.buffer.join("\n");}}});}();

}(window));

/*
    Modernizr 2.6.2 (Custom Build) | MIT & BSD
    Build: http://modernizr.com/download/#-csstransforms-csstransitions-testprop-testallprops-domprefixes
*/
(function(window){
    if (!window.PhotoMosaic) {
        window.PhotoMosaic = {};
    }
    window.PhotoMosaic.Modernizr=function(a,b,c){function x(a){j.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransforms=function(){return!!D("transform")},p.csstransitions=function(){return D("transition")};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" PM_"+(b?"":"no-")+a),e[a]=b}return e},x(""),i=k=null,e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return B([a])},e.testAllProps=D,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" PM_js PM_"+s.join(" PM_"):""),e}(this,this.document);
}(window));

/*
    imagesLoaded.js — Because you can't do ".load()"" on cached images.
    See http://desandro.github.com/imagesloaded/ for more info.
*/
(function(c,n){var l="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";c.fn.imagesLoaded=function(f){function m(){var b=c(i),a=c(h);d&&(h.length?d.reject(e,b,a):d.resolve(e));c.isFunction(f)&&f.call(g,e,b,a)}function j(b,a){b.src===l||-1!==c.inArray(b,k)||(k.push(b),a?h.push(b):i.push(b),c.data(b,"imagesLoaded",{isBroken:a,src:b.src}),o&&d.notifyWith(c(b),[a,e,c(i),c(h)]),e.length===k.length&&(setTimeout(m),e.unbind(".imagesLoaded")))}var g=this,d=c.isFunction(c.Deferred)?c.Deferred():
0,o=c.isFunction(d.notify),e=g.find("img").add(g.filter("img")),k=[],i=[],h=[];c.isPlainObject(f)&&c.each(f,function(b,a){if("callback"===b)f=a;else if(d)d[b](a)});e.length?e.bind("load.imagesLoaded error.imagesLoaded",function(b){j(b.target,"error"===b.type)}).each(function(b,a){var d=a.src,e=c.data(a,"imagesLoaded");if(e&&e.src===d)j(a,e.isBroken);else if(a.complete&&a.naturalWidth!==n)j(a,0===a.naturalWidth||0===a.naturalHeight);else if(a.readyState||a.complete)a.src=l,a.src=d}):m();return d?d.promise(g):
g}}(jQuery));


/*
    jQuery photoMosaic v2.3.4
    requires: jQuery 1.7+ (included externally), JSTween, Mustache, Modernizr, & ImagesLoaded (included above)
    optional: prettyPhoto (included externally)
*/
(function ($) {
    // for debugging
    if (window.PhotoMosaic) {
        window.PhotoMosaic.$ = $;
        window.PhotoMosaic.mosaics = [];
    }

    var pluginName = 'photoMosaic';

    var Plugin = function (el, options, i) {
        this._name = pluginName;
        this.version = '2.3.4';
        this.el = el;
        this.obj = $(el);
        this._options = options;
        this._id = (Date.parse(new Date()) + Math.round(Math.random() * 10000));

        this.init();
    };

    $.extend(Plugin.prototype, {

        // IE sucks so hard
        log: {
            info: function (msg) {
                this.prefix(msg);
            },

            error: function (msg) {
                this.prefix("ERROR: " + msg);
            },

            prefix: function (msg) {
                this.print("PhotoMosaic: " + msg);
            },

            print: function (msg) {
                if (console !== 'undefined') {
                    console.log(msg);
                }
            }
        },

        _defaults: {
            input : 'json', // json, html, xml
            gallery : 'PMalbum', // json object, xml file path
            padding : 2,
            columns : 'auto', // auto (str) or (int)
            width : 'auto', // auto (str) or (int)
            height : 'auto', // auto (str) or (int)
            links : true,
            external_links: false,
            order : 'rows', // rows, columns, masonry, random
            center : true,
            prevent_crop : false,
            show_loading : false,
            loading_transition : 'fade', // none, fade, scale-up|down, slide-top|right|bottom|left, custom
            responsive_transition : true,
            responsive_transition_settings : {
                time: 0,
                duration: 0.3,
                effect: 'easeOut'
            },
            modal_name : null,
            modal_group : true,
            modal_ready_callback : null,
            log_gallery_data : false
            // random : false (deprecated: v2.2)
            // force_order : false (deprecated: v2.2)
            // auto_columns : false (deprecated: v2.2)
        },

        template: ' ' +
            '<div id="photoMosaic_{{id}}" class="photoMosaic loading {{transition}}" style="width:{{width}}px; height:{{height}}px; {{#center}}margin-left:auto; margin-right:auto;{{/center}}">' +
                '{{#images}}' +
                    '{{#link}}' +
                        '<a class="loading" href="{{path}}" {{#external}}target="_blank"{{/external}}' +
                            ' {{#modal}}rel="{{modal}}"{{/modal}}' +
                            ' {{#caption}}title="{{caption}}"{{/caption}}' +
                            'style="' +
                                ' width:{{#width}}{{constraint}}{{/width}}px;' +
                                ' height:{{#height}}{{constraint}}{{/height}}px;' +
                                ' position:absolute; {{#position}}top:{{top}}px; left:{{left}}px;{{/position}}' +
                            '"' +
                        '>' +
                    '{{/link}}' +
                    '{{^link}}' +
                        '<span class="loading"' +
                            'style="' +
                                ' width:{{#width}}{{constraint}}{{/width}}px;' +
                                ' height:{{#height}}{{constraint}}{{/height}}px;' +
                                ' position:absolute; {{#position}}top:{{top}}px; left:{{left}}px;{{/position}}' +
                            '"' +
                        '>' +
                    '{{/link}}' +
                        '<img id="{{id}}" src="{{src}}" style="' +
                            'width:{{#width}}{{adjusted}}{{/width}}px; ' +
                            'height:{{#height}}{{adjusted}}{{/height}}px; ' +
                            '{{#adjustment}}{{type}}:-{{value}}px;{{/adjustment}}" ' +
                            'title="{{caption}}"' +
                            'alt="{{alt}}"/>' +
                    '{{#link}}</a>{{/link}}' +
                    '{{^link}}</span>{{/link}}' +
                '{{/images}}' +
            '</div>',

        loading_template: ' ' +
                '<div id="photoMosaic_{{id}}" class="photoMosaic">' +
                    '<div class="photoMosaicLoading">loading gallery...</div>' +
                '</div>',

        init: function () {
            var self = this;

            this.opts = $.extend({}, this._defaults, this._options);
            this.opts = this.adjustDeprecatedOptions(this.opts);
            this._options = $.extend(true, {}, this.opts); // jQuery deep copy

            this.preload = 'PM_preloadify' + this._id;

            this.images = [];
            this.columns = [];

            if (this.opts.width === 'auto') {
                this.opts.width = this.obj.width();
            }

            // Error Checks
            if (this.opts.input === 'xml') {
                if (typeof this.opts.gallery !== 'string' || this.opts.gallery === '') {
                    this.log.error("No XML file path specified.");
                    return;
                }
            }
            if (this.opts.input === 'json') {
                if (typeof this.opts.gallery === 'string') {
                    if (this.opts.gallery === '') {
                        this.log.error("No JSON object defined.");
                        return;
                    }
                    if (typeof window[this.opts.gallery] !== 'undefined') {
                        this.opts.gallery = window[this.opts.gallery];
                    } else {
                        this.log.error("No JSON object found when referencing '" + this.opts.gallery + "'.")
                        this.log.info("Make sure your variable is avaible to the global scope (window['" + this.opts.gallery + "']) or simply pass the object literal (gallery:" + this.opts.gallery + ") instead of a string (gallery:\"" + this.opts.gallery + "\").");
                        return;
                    }
                }
                if (this.opts.gallery === 0) {
                    this.log.error("Specified gallery data is empty.");
                    return;
                }
            }
            if (this.opts.prevent_crop && this.opts.height !== 'auto') {
                this.log.info("Height must be set to 'auto' to Prevent Cropping. The value for height (" + this.opts.height + ") is being ignored so as to prevent cropping.");
                this.opts.height = "auto";
            }

            $.when(
                this.getGalleryData()
            ).then(function (data) {
                self.opts.gallery = data;
                self.configure();
            });
        },

        configure: function () {
            var self = this;

            if (this.opts.show_loading) {
                this.obj.html(PhotoMosaic.Mustache.to_html(this.loading_template, {
                    id: this._id
                }));
            }

            this.opts.columns = this.autoCols();

            this.col_width = Math.floor((this.opts.width - (this.opts.padding * (this.opts.columns - 1))) / this.opts.columns);

            this._size = this.pickImageSize(this.opts.gallery);

            if (this._size) {
                for (var i = 0; i < this.opts.gallery.length; i++) {
                    this.opts.gallery[i].thumb = this.opts.gallery[i].sizes[this._size];
                };
            }

            // if all items have defined w/h we don't need to
            // wait for them to load to do the mosaic math
            if (this.hasDims()) {
                this.opts.gallery = this.prepData(this.opts.gallery);
                this.render();
            } else {
                $.when(this.preloadify()).then(function () {
                    self.opts.gallery = self.addPreloadData(self.opts.gallery);
                    self.render();
                });
            }
        },

        render: function () {
            var self = this;

            this.obj.html(this.makeMosaic());

            this.obj.imagesLoaded({
                progress: function (isBroken, $images, $proper, $broken) {
                    setTimeout(function () {
                        $($proper[$proper.length - 1]).parents('a').removeClass('loading');
                    }, 0);
                },
                always: function () {
                    setTimeout(function () {
                        self.obj.children('.photoMosaic').removeClass('loading');
                    }, 1000);
                }
            });

            this.bindEvents();

            this.modalCallback();

            if (this.opts.log_gallery_data) {
                this.logGalleryData();
            }
        },

        makeMosaic: function () {
            var self = this;

            // get image sizes, set modalhook, & get link paths
            $.each(this.opts.gallery, function (i) {
                var image = $.extend(true, {}, this); // jQuery deep copy
                var image_url = (image.thumb && image.thumb !== '') ? image.thumb : image.src;
                var modal_text;

                image.id = self.makeID();

                // image sizes
                image.full = image.src;
                image.src = image_url;
                image.padding = self.opts.padding;

                image.width.adjusted = self.col_width;
                image.height.adjusted = Math.floor((image.height.original * image.width.adjusted) / image.width.original);

                // modal hooks
                if (self.opts.modal_name) {
                    if (self.opts.modal_group) {
                        modal_text = self.opts.modal_name + '[' + self._id + ']';
                    } else {
                        modal_text = self.opts.modal_name;
                    }
                    image.modal = modal_text;
                }

                // link paths
                if (self.opts.links && image.url) {
                    image.link = true;
                    image.path = image.url;
                    image.external = self.opts.external_links;
                    // delete image.modal;
                } else if (self.opts.links) {
                    image.link = true;
                    image.path = image.full;
                    image.external = self.opts.external_links;
                } else {
                    image.link = false;
                }

                self.images.push(image);
            });

            // remove any images that failed to load
            this.images = this.errorCheck(this.images);

            var json = this.makeMosaicView();

            // ERROR CHECK: don't load if the layout is broken
            if (this.layoutHasErrors(json)) {
                this.log.error("Your gallery's height is too small for your current settings and won't render correctly.");
                return PhotoMosaic.Mustache.to_html('', {});
            }

            return PhotoMosaic.Mustache.to_html(this.template, json);
        },

        makeMosaicView: function (isRefreshing) {
            /*
                Images are already in order.

                Deal into columns
                 - order == random --> randomize => rows
                 - order == rows --> rows
                 - order == columns --> rows => columns
                 - order == masonry --> masonry
            */
            if (this.opts.order === 'random' && !isRefreshing) {
                this.images.sort(function (a, b) {
                    return (0.5 - Math.random());
                });
            }

            this.columns = this.sortIntoRows(this.images);

            if (this.opts.order === 'columns') {
                this.columns = this.sortIntoColumns(this.columns, this.images);
            }

            if (this.opts.order === 'masonry') {
                this.columns = this.sortIntoMasonry(this.images);
            }

            // construct template object
            var json = {
                    id: this._id,
                    transition: this.getTransition(),
                    width: (this.col_width * this.columns.length) + (this.opts.padding * (this.columns.length - 1)),
                    center: this.opts.center,
                    columns:[]
                };

            // get column heights (img height adjusted for col width)
            var col_heights = [];

            for (var i = 0; i < this.columns.length; i++) {
                var col_height = 0;

                for (var j = 0; j < this.columns[i].length; j++) {
                    col_height += this.columns[i][j].height.adjusted;
                }

                col_height += (this.columns[i].length - 1) * this.opts.padding;
                col_heights.push(col_height);

                json.columns[i] = {};
                json.columns[i].images = this.columns[i];
                json.columns[i].height = col_height;
                json.columns[i].padding = this.opts.padding;
            }

            // normalize column heights
            var shortest_col = Math.min.apply( Math, col_heights );
                var tallest_col = Math.max.apply( Math, col_heights );
                var average_col_height = Math.ceil((shortest_col + tallest_col) / 2);

            if (this.opts.height === 'auto') {
                json = this.adjustHeights(json, average_col_height);
            } else {
                json = this.adjustHeights(json, this.opts.height);
            }

            // create position information for each image
            for (var i = 0; i < json.columns.length; i++) {
                var col_height = 0;

                for (var j = 0; j < json.columns[i].images.length; j++) {
                    json.columns[i].images[j].position = {
                        top : col_height,
                        left : (i * this.col_width) + (i * this.opts.padding)
                    };

                    col_height = col_height + json.columns[i].images[j].height.constraint + this.opts.padding;
                };
            };

            // lightboxes index by node order and we add nodes by columns
            // leading to a mismatch between read order and lightbox-gallery-step-through order
            json.images = this.unpackColumns(json.columns);

            return json;
        },

        autoCols: function (){
            if (!this._auto_cols && this.opts.columns !== 'auto') {
                this._auto_cols = false;
                return this.opts.columns;
            }

            this._auto_cols = true;

            var max_width = this.opts.width;
            var num_images = this.opts.gallery.length;

            // this.opts.sizes only supported in PM4WP
            var sizes = {
                thumbnail : (this.opts.sizes) ? this.opts.sizes.thumbnail : 150,
                medium : (this.opts.sizes) ? this.opts.sizes.medium : 300,
                large : (this.opts.sizes) ? this.opts.sizes.large : 1024
            };
            var maths = {
                plus : (sizes.medium + (sizes.thumbnail / 1.2)),
                minus : (sizes.medium - (sizes.thumbnail / 1.2))
            };

            if (num_images < this.opts.columns) {
                cols = num_images;
            } else {
                cols = (max_width < maths.plus) ? 1 : Math.floor(max_width / maths.minus);
            }

            return cols;
        },

        sortIntoRows: function (imgs) {
            var images = $.extend(true, [], imgs); // jQuery deep copy || imgs.slice()
            var col = 0;
            var columns = [];

            for (var i = 0; i < images.length; i++) {
                col = i % this.opts.columns;

                if (!columns[col]) {
                    columns[col] = [];
                }

                columns[col].push(images[i]);
            }

            return columns;
        },

        sortIntoColumns: function (columns, imgs) {
            var images = $.extend(true, [], imgs); // jQuery deep copy || imgs.slice()
            var forced_cols = [];

            for (var i = 0; i < columns.length; i++) {
                for (var j = 0; j < columns[i].length; j++) {
                    if (!forced_cols[i]) {
                        forced_cols[i] = [];
                    }
                    forced_cols[i].push(images[0]);
                    images.shift();
                }
            }

            return forced_cols;
        },

        sortIntoMasonry: function (imgs) {
            var images = $.extend(true, [], imgs); // jQuery deep copy || imgs.slice()
            var col_heights = [];
            var col = 0;
            var columns = [];

            // construct column-height memory obj
            for (var i = 0; i < this.opts.columns; i++) {
                col_heights[i] = 0;
                columns.push([]);
            }

            for (var i = 0; i < images.length; i++) {
                col = $.inArray( Math.min.apply( Math, col_heights ), col_heights );
                columns[col].push(images[i]);
                col_heights[col] = col_heights[col] + images[i].height.adjusted;
            }

            return columns;
        },

        unpackColumns: function (columns) {
            var image;
            var images = [];

            for (var i = 0; i < this.images.length; i++) {
                image = this.deepSearch(columns, 'id', this.images[i].id);
                images.push(image);
            };

            return images;
        },

        deepSearch : function (obj, key, value) {
            // recursively traverses an nested arrays, and objects looking for a key/value pair
            var response = null;
            var i = 0;
            var prop;

            if (obj instanceof Array) {
                for (i = 0; i < obj.length; i++) {
                    response = this.deepSearch(obj[i], key, value);
                    if (response) {
                        return response;
                    }
                }
            } else {
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if ( (prop == key) && (obj[prop] == value) ) {
                            return obj;
                        } else if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
                            response = this.deepSearch(obj[prop], key, value);
                            if (response) {
                                return response;
                            }
                        }
                    }
                }
            }

            return response;
        },

        adjustHeights: function (json, target_height) {
            var column_heights = [];
            var column = null;
            var adjusted_height = 0;

            json = this.markLastColumn(json);

            for (var i = 0; i < json.columns.length; i++) {
                column = json.columns[i];
                json = this.markLastImageInColumn(json, i);

                if (this.opts.prevent_crop) {
                    column = this.scaleColumn(column, column.height);
                } else {
                    column = this.scaleColumn(column, target_height);
                }

                column_heights.push(column.height);

                json.columns[i] = column;
            }

            if (this.opts.prevent_crop) {
                adjusted_height = Math.max.apply(Math, column_heights);
            } else {
                adjusted_height = Math.min.apply(Math, column_heights);
            }

            json.height = adjusted_height;

            if (!this.opts.prevent_crop) {
                json = this.flattenColumns(json, adjusted_height);
            }

            json = this.adjustImagesToConstraint(json);

            return json;
        },

        scaleColumn: function (col, height) {
            var count = col.images.length;
            var total_padding = (this.opts.padding * (count - 1));
            var column_start = col.height - total_padding;
            var column_end = height - total_padding;
            var image = null;
            var images_height = 0;
            var image_start = 0;
            var image_end = 0;
            var mod = 0;

            // image's already have width|height.adjusted set
            // they need width|height.constraint
            for (var i = 0; i < count; i++) {
                image = col.images[i];

                image_start = image.height.adjusted;
                image_end = Math.floor( column_end * ( Math.floor( (image_start / column_start) * 1000 ) / 1000 ) );
                images_height += image_end;

                image = this.setImageContraints(image, this.col_width, image_end);
            }

            col.height = images_height + total_padding;

            return col;
        },

        flattenColumns: function (json, height) {
            var column = null;
            var image = null;
            var diff = 0;
            var total_padding = null;
            var adjusted_height;

            for (var i = 0; i < json.columns.length; i++) {
                column = json.columns[i];
                image = column.images[column.images.length - 1];
                diff = Math.abs(column.height - height);
                total_padding = (this.opts.padding * (column.images.length - 1));

                if (diff > 0) {
                    if (column.height > height) {
                        adjusted_height = (image.height.constraint - diff);
                    } else {
                        adjusted_height = (image.height.constraint + diff);
                    }

                    image = this.setImageContraints(image, null, adjusted_height);
                }
            }

            return json;
        },

        setImageContraints: function (image, width, height) {
            image.width.constraint = width || image.width.constraint;
            image.height.constraint = height || image.height.constraint;
            return image;
        },

        adjustImagesToConstraint: function (json) {
            var column;
            var image;
            var test_height;

            for (var i = 0; i < json.columns.length; i++) {
                column = json.columns[i];

                for (var j = 0; j < column.images.length; j++) {
                    image = column.images[j];

                    // adjusted is still scaled to the column's width
                    if (image.height.adjusted > image.height.constraint) {
                        image.adjustment = {
                            type : 'top',
                            value : Math.floor((image.height.adjusted - image.height.constraint) / 2)
                        };
                    } else {
                        image.width.adjusted = Math.floor((image.width.adjusted * image.height.constraint) / image.height.adjusted);
                        image.height.adjusted = image.height.constraint;

                        image.adjustment = {
                            type : 'left',
                            value : Math.floor((image.width.adjusted - image.width.constraint) / 2)
                        };
                    }

                    column.images[j] = image;
                };

                json.columns[i] = column;
            };

            return json;
        },

        findSmallestImage: function (images) {
            var smallest_height = 0;
            var index_of_smallest = 0;

            for (var i = 0; i < images.length; i++) {
                if (smallest_height === 0) {
                    smallest_height = images[i].height.adjusted;
                } else if (images[i].height.adjusted < smallest_height) {
                    smallest_height = images[i].height.adjusted;
                    index_of_smallest = i;
                }
            }

            return { 
                height : smallest_height,
                index : index_of_smallest
            };
        },

        findLargestImage: function (images) {
            var largest_height = 0;
            var index_of_largest = 0;

            for (var i = 0; i < images.length; i++) {
                if (images[i].height.adjusted > largest_height) {
                    largest_height = images[i].height.adjusted;
                    index_of_largest = i;
                }
            }

            return { 
                height : largest_height,
                index : index_of_largest
            };
        },

        markLastColumn: function (json) {
            json.columns[json.columns.length - 1].last = true;
            return json;
        },

        markLastImageInColumn: function (json, i) {
            json.columns[i].images[json.columns[i].images.length - 1].last = true;
            return json;
        },

        errorCheck: function (images) {
            var to_delete = [];

            $.each(images, function (i) {
                if (isNaN(this.height.adjusted)){
                    to_delete.push(i);
                }
            });

            for (var i = to_delete.length - 1; i >= 0; i--) {
                this.log.error("The following image failed to load and was skipped.\n" + images[to_delete[i]].src);
                var rest = images.slice( to_delete[i] + 1 );
                images.length = to_delete[i];
                images.push.apply(images, rest);
            }

            return images;
        },

        layoutHasErrors: function (json) {
            var hasErrors = false;

            for (var i = 0; i < json.columns.length; i++) {
                for (var j = 0; j < json.columns[i].images.length; j++) {
                    if (json.columns[i].images[j].height.constraint <= 0) {
                        hasErrors = true;
                    }
                };
            };

            return hasErrors;
        },

        preloadify: function () {
            var $images = $('<div>').attr({
                    'id': this.preload,
                    'class' : 'PM_preloadify'
                });

            $.each(this.opts.gallery, function (i) {
                var image_url = (this.thumb && this.thumb !== '') ? this.thumb : this.src;
                var $item = $('<img>').attr({src : image_url});
                $images.append($item);
            });

            $('body').append($images);

            return $images.imagesLoaded();
        },

        addPreloadData: function (gallery) {
            var $preload = $('#' + this.preload);

            $.each(gallery, function (i) {
                var image_url = (this.thumb && this.thumb !== '') ? this.thumb : this.src;
                var $img = $preload.find('img[src="'+ image_url +'"]');

                this.width = {
                    original: $img.width()
                };
                this.height = {
                    original: $img.height()
                };
            });

            return gallery;
        },

        prepData: function (gallery) {
            var mem = { w:0, h:0 };

            $.each(gallery, function (i) {
                mem.w = parseInt(this.width);
                mem.h = parseInt(this.height);

                this.width = {
                    original: mem.w
                };
                this.height = {
                    original: mem.h
                };
            });

            return gallery;
        },

        getGalleryData: function () {
            var self = this;

            // construct the gallery
            if (this.opts.input === 'json') {
                return this.opts.gallery;

            } else if (this.opts.input === 'html') {
                return this.constructGalleryFromHTML();

            } else if (this.opts.input === 'xml' ) {
                return $.when(
                        $.get(this.opts.gallery)
                    ).then(
                        // success
                        function (data) {
                            var gallery;
                            if ($(data).find('photos').length > 0) {
                                gallery = $(data).find('photos');
                                return self.constructGalleryFromXML(gallery);
                            } else {
                                self.log.error("The XML doesn't contain any <photo> nodes.");
                                return;
                            }
                        },
                        // fail
                        function () {
                            self.log.error("The XML either couldn't be found or was malformed.");
                            return;
                        }
                    );
            }
        },

        pickImageSize: function (gallery) {
            var size = null;

            // currently only supported in PM4WP
            if (!this.opts.sizes || !gallery[0].sizes) {
                return null;
            }

            for (key in this.opts.sizes) {
                if (!size && (this.opts.sizes[key] > this.col_width)) {
                    size = key;
                }
            };

            if (!size) {
                size = 'full';
            }

            return size;
        },

        swapImage: function (image, size) {
            var self = this;
            var $img = this.obj.find('#' + image.id);
            var $a = $img.parent();
            var $new_img = $('<img/>')
                                .attr('src', image.sizes[size])
                                .attr('class', size)
                                .attr('style', $img.attr('style'))
                                .opacity(0);

            if (
                $a.find('.' + size).length === 0 &&
                $a.find('img[src="' + image.sizes[size] + '"]').length === 0
            ) {
                $a.append($new_img);

                $new_img.imagesLoaded({
                    fail: function ($images, $proper, $broken) {
                        $images.remove();
                    },
                    done: function ($images) {
                        var sibs = $images.siblings();
                        var id = sibs.eq(0).attr('id');
                        $images.attr('id', id)
                        $images.opacity(100);
                        sibs.remove();
                        setTimeout(function () {
                            $images.removeClass();
                        }, 0);
                    }
                });
            }
        },

        constructGalleryFromHTML: function () {
            var gallery = [];
            var $images = this.obj.find('img');

            for (var i = 0; i < $images.length; i++) {
                var $image = $images.eq(i)
                var image = {};

                if ($image.parent('a').length > 0 && this.opts.links) {
                    image.src = $image.attr('src');
                    image.url = $image.parent('a').attr('href');
                } else if ($image.parent('a').length > 0) {
                    image.src = $image.parent('a').attr('src');
                } else {
                    image.src = $image.attr('src');
                }

                image.caption = $images.eq(i).attr('title');
                image.alt = $images.eq(i).attr('alt');

                gallery.push(image);
            }

            return gallery;
        },

        constructGalleryFromXML: function (gallery) {
            var response = [];

            gallery.find('photo').each(function (i) {
                var photo = {};
                var data = $(this);

                photo.caption = data.children('title').text();
                photo.alt = data.children('alt').text();
                photo.src = data.children('src').text();
                photo.thumb = data.children('thumb').text();
                photo.url = data.children('url').text();
                photo.width = data.children('width').text();
                photo.height = data.children('height').text();

                response.push(photo);
            });

            return response;
        },

        hasDims: function () {
            var some = false; // set to true if any dims are found
            var all = true; // set to false if any dims aren't found

            if (this.hasSpecifiedDims !== undefined) {
                return this.hasSpecifiedDims;
            }

            for (var i = 0; i < this.opts.gallery.length; i++) {
                // are w/h properties present?
                if (this.opts.gallery[i].hasOwnProperty('width') && this.opts.gallery[i].hasOwnProperty('height')) {
                    // is there valid data?
                    // in some cases WP reports 0 for both the height and width
                    if (
                        isNaN(parseInt(this.opts.gallery[i].width)) ||
                        isNaN(parseInt(this.opts.gallery[i].height)) ||
                        this.opts.gallery[i].width == 0 ||
                        this.opts.gallery[i].height == 0
                    ) {
                        all = false;
                    } else {
                        some = true;
                    }
                } else {
                    all = false;
                }
            };

            if (some && !all) {
                this.log.error("Width / Height data not present for all images.");
            }

            this.hasSpecifiedDims = all;

            return this.hasSpecifiedDims;
        },

        getTransition: function () {
            var transition = 'none';

            if (PhotoMosaic.Modernizr.csstransitions && PhotoMosaic.Modernizr.csstransforms) {
                transition = this.opts.loading_transition
            }
            return 'transition-' + transition;
        },

        bindEvents: function () {
            var self = this;

            $(window).unbind('resize.photoMosaic' + this._id).bind('resize.photoMosaic' + this._id, function () {
                self.refresh();
            });
        },

        refresh: function () {
            if (this._options.width !== 'auto') {
                return;
            }

            var self = this;
            var image = null;
            var $img = null;
            var $a = null;
            var json = null;
            var size = this.pickImageSize(this.images);


            this.obj.addClass('resizing');

            // get the container width
            this.opts.width = this.obj.width();

            // get new column count & math
            this.opts.columns = this.autoCols();
            this.col_width = Math.floor((this.opts.width - (this.opts.padding * (this.opts.columns - 1))) / this.opts.columns);

            for (var i = 0; i < this.images.length; i++) {
                image = this.images[i];

                image.width.adjusted = this.col_width;
                image.height.adjusted = Math.floor((image.height.original * image.width.adjusted) / image.width.original);

                if (size) {
                    // we get a new image if we need a bigger image
                    if (this.opts.sizes[size] > this.opts.sizes[this._size]) {
                        this.swapImage(image, size);
                    }
                }

                this.images[i] = image;
            };

            if (size) {
                this._size = size;
            }

            var json = this.makeMosaicView(true);

            this.obj.children().css({
                width: json.width,
                height: json.height
            });

            for (var i = 0; i < json.images.length; i++) {
                image = json.images[i];
                $img = this.obj.find('#' + image.id).parent().find('img');
                $a = $img.parent();

                $img.css({
                    width : image.width.adjusted + 'px',
                    height : image.height.adjusted + 'px',
                    top : '0px',
                    left : '0px'
                });

                $img.css(image.adjustment.type, (image.adjustment.value * -1) + 'px');

                $a.css({
                    width : image.width.constraint + 'px',
                    height : image.height.constraint + 'px',
                });

                if (!this.shouldAnimate()) {
                    $a.css({
                        top : image.position.top + 'px',
                        left : image.position.left + 'px'
                    });
                } else {
                    $a.tween({
                        top: $.extend({}, this.opts.responsive_transition_settings, {
                            stop: image.position.top
                        }),
                        left: $.extend({}, this.opts.responsive_transition_settings, {
                            stop: image.position.left
                        })
                    });
                }
            }

            if (this.shouldAnimate()) {
                $.play();
            }

            setTimeout(function () {
                self.obj.removeClass('resizing');
            }, 0);
        },

        modalCallback: function () {
            var $node = this.obj.children().get(0);
            if ($.isFunction(this.opts.modal_ready_callback)) {
                this.opts.modal_ready_callback.apply(this, [$node]);
            }
        },

        adjustDeprecatedOptions: function (opts) {
            // random : true | false
            if (opts.random) {
                opts.order = 'random';
            }
            // force_order : true | false
            if (opts.force_order) {
                opts.order = 'columns';
            }

            return opts;
        },

        makeID: function () {
            var S4 = function () {
                return ( ( (1 + Math.random()) * 0x10000 ) | 0 ).toString(16).substring(1);
            };
            return 'pm_' + ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() );
        },

        logGalleryData: function () {
            var response = [];
            for (var i = 0; i < this.opts.gallery.length; i++) {
                response.push({
                    src: this.opts.gallery[i].src,
                    thumb: this.opts.gallery[i].thumb,
                    caption: this.opts.gallery[i].caption,
                    width: this.opts.gallery[i].width.original,
                    height: this.opts.gallery[i].height.original
                });
            }
            this.log.info("Generate Gallery Data...");
            this.log.print( JSON.stringify(response) );
        },

        shouldAnimate: function () {
            return (
                this._auto_cols &&
                this.opts.responsive_transition
            );
        },

        __: function () { return this.version }

    });


    $.fn[pluginName] = function (options) {
        options = options || {};
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Plugin(this, options));

                // for debugging
                window.PhotoMosaic.mosaics.push({
                    'el' : this,
                    'opts' : options
                });
            }
        });
    };

}(jQuery));