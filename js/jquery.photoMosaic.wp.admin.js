/*
 * SimpleModal v1.4.3 - jQuery Plugin (modified by makfak)
 * http://simplemodal.com/
 * Copyright (c) 2012 Eric Martin
 * Licensed under MIT and GPL
 */
(function(factory){if(typeof define==="function"&&define.amd)define(["jquery"],factory);else factory(JQPM)})(function($){var d=[],doc=$(document),ie6=$.browser.msie&&parseInt($.browser.version)===6&&typeof window["XMLHttpRequest"]!=="object",ie7=$.browser.msie&&parseInt($.browser.version)===7,ieQuirks=null,wndw=$(window),w=[];$.modal=function(data,options){return $.modal.impl.init(data,options)};$.modal.close=function(){$.modal.impl.close()};$.modal.focus=function(pos){$.modal.impl.focus(pos)};$.modal.setContainerDimensions=
function(){$.modal.impl.setContainerDimensions()};$.modal.setPosition=function(){$.modal.impl.setPosition()};$.modal.update=function(height,width){$.modal.impl.update(height,width)};$.fn.modal=function(options){return $.modal.impl.init(this,options)};$.modal.defaults={appendTo:"body",focus:true,opacity:50,overlayId:"simplemodal-overlay",overlayCss:{},containerId:"simplemodal-container",containerCss:{},dataId:"simplemodal-data",dataCss:{},minHeight:null,minWidth:null,maxHeight:null,maxWidth:null,autoResize:false,
autoPosition:true,zIndex:1E3,close:true,closeHTML:'<a class="modalCloseImg" title="Close"></a>',closeClass:"simplemodal-close",escClose:true,overlayClose:false,fixed:true,position:null,persist:false,modal:true,onOpen:null,onShow:null,onClose:null};$.modal.impl={d:{},init:function(data,options){var s=this;if(s.d.data)return false;ieQuirks=$.browser.msie&&!$.support.boxModel;s.o=$.extend({},$.modal.defaults,options);s.zIndex=s.o.zIndex;s.occb=false;if(typeof data==="object"){data=data instanceof $?
data:$(data);s.d.placeholder=false;if(data.parent().parent().size()>0){data.before($("<span></span>").attr("id","simplemodal-placeholder").css({display:"none"}));s.d.placeholder=true;s.display=data.css("display");if(!s.o.persist)s.d.orig=data.clone(true)}}else if(typeof data==="string"||typeof data==="number")data=$("<div></div>").html(data);else{alert("SimpleModal Error: Unsupported data type: "+typeof data);return s}s.create(data);data=null;s.open();if($.isFunction(s.o.onShow))s.o.onShow.apply(s,
[s.d]);return s},create:function(data){var s=this;s.getDimensions();if(s.o.modal&&ie6)s.d.iframe=$('<iframe src="javascript:false;"></iframe>').css($.extend(s.o.iframeCss,{display:"none",opacity:0,position:"fixed",height:w[0],width:w[1],zIndex:s.o.zIndex,top:0,left:0})).appendTo(s.o.appendTo);s.d.overlay=$("<div></div>").attr("id",s.o.overlayId).addClass("simplemodal-overlay").css($.extend(s.o.overlayCss,{display:"none",opacity:s.o.opacity/100,height:s.o.modal?d[0]:0,width:s.o.modal?d[1]:0,position:"fixed",
left:0,top:0,zIndex:s.o.zIndex+1})).appendTo(s.o.appendTo);s.d.container=$("<div></div>").attr("id",s.o.containerId).addClass("simplemodal-container").css($.extend({position:s.o.fixed?"fixed":"absolute"},s.o.containerCss,{display:"none",zIndex:s.o.zIndex+2})).append(s.o.close&&s.o.closeHTML?$(s.o.closeHTML).addClass(s.o.closeClass):"").appendTo(s.o.appendTo);s.d.wrap=$("<div></div>").attr("tabIndex",-1).addClass("simplemodal-wrap").css({height:"100%",outline:0,width:"100%"}).appendTo(s.d.container);
s.d.data=data.attr("id",data.attr("id")||s.o.dataId).addClass("simplemodal-data").css($.extend(s.o.dataCss,{display:"none"})).appendTo("body");data=null;s.setContainerDimensions();s.d.data.appendTo(s.d.wrap);if(ie6||ieQuirks)s.fixIE()},bindEvents:function(){var s=this;$("."+s.o.closeClass).bind("click.simplemodal",function(e){e.preventDefault();s.close()});if(s.o.modal&&s.o.close&&s.o.overlayClose)s.d.overlay.bind("click.simplemodal",function(e){e.preventDefault();s.close()});doc.bind("keydown.simplemodal",
function(e){if(s.o.modal&&e.keyCode===9)s.watchTab(e);else if(s.o.close&&s.o.escClose&&e.keyCode===27){e.preventDefault();s.close()}});wndw.bind("resize.simplemodal orientationchange.simplemodal",function(){s.getDimensions();s.o.autoResize?s.setContainerDimensions():s.o.autoPosition&&s.setPosition();if(ie6||ieQuirks)s.fixIE();else if(s.o.modal){s.d.iframe&&s.d.iframe.css({height:w[0],width:w[1]});s.d.overlay.css({height:d[0],width:d[1]})}})},unbindEvents:function(){$("."+this.o.closeClass).unbind("click.simplemodal");
doc.unbind("keydown.simplemodal");wndw.unbind(".simplemodal");this.d.overlay.unbind("click.simplemodal")},fixIE:function(){var s=this,p=s.o.position;$.each([s.d.iframe||null,!s.o.modal?null:s.d.overlay,s.d.container.css("position")==="fixed"?s.d.container:null],function(i,el){if(el){var bch="document.body.clientHeight",bcw="document.body.clientWidth",bsh="document.body.scrollHeight",bsl="document.body.scrollLeft",bst="document.body.scrollTop",bsw="document.body.scrollWidth",ch="document.documentElement.clientHeight",
cw="document.documentElement.clientWidth",sl="document.documentElement.scrollLeft",st="document.documentElement.scrollTop",s=el[0].style;s.position="absolute";if(i<2){s.removeExpression("height");s.removeExpression("width");s.setExpression("height",""+bsh+" > "+bch+" ? "+bsh+" : "+bch+' + "px"');s.setExpression("width",""+bsw+" > "+bcw+" ? "+bsw+" : "+bcw+' + "px"')}else{var te,le;if(p&&p.constructor===Array){var top=p[0]?typeof p[0]==="number"?p[0].toString():p[0].replace(/px/,""):el.css("top").replace(/px/,
"");te=top.indexOf("%")===-1?top+" + (t = "+st+" ? "+st+" : "+bst+') + "px"':parseInt(top.replace(/%/,""))+" * (("+ch+" || "+bch+") / 100) + (t = "+st+" ? "+st+" : "+bst+') + "px"';if(p[1]){var left=typeof p[1]==="number"?p[1].toString():p[1].replace(/px/,"");le=left.indexOf("%")===-1?left+" + (t = "+sl+" ? "+sl+" : "+bsl+') + "px"':parseInt(left.replace(/%/,""))+" * (("+cw+" || "+bcw+") / 100) + (t = "+sl+" ? "+sl+" : "+bsl+') + "px"'}}else{te="("+ch+" || "+bch+") / 2 - (this.offsetHeight / 2) + (t = "+
st+" ? "+st+" : "+bst+') + "px"';le="("+cw+" || "+bcw+") / 2 - (this.offsetWidth / 2) + (t = "+sl+" ? "+sl+" : "+bsl+') + "px"'}s.removeExpression("top");s.removeExpression("left");s.setExpression("top",te);s.setExpression("left",le)}}})},focus:function(pos){var s=this,p=pos&&$.inArray(pos,["first","last"])!==-1?pos:"first";var input=$(":input:enabled:visible:"+p,s.d.wrap);setTimeout(function(){input.length>0?input.focus():s.d.wrap.focus()},10)},getDimensions:function(){var s=this,h=typeof window.innerHeight===
"undefined"?wndw.height():window.innerHeight;d=[doc.height(),doc.width()];w=[h,wndw.width()]},getVal:function(v,d){return v?typeof v==="number"?v:v==="auto"?0:v.indexOf("%")>0?parseInt(v.replace(/%/,""))/100*(d==="h"?w[0]:w[1]):parseInt(v.replace(/px/,"")):null},update:function(height,width){var s=this;if(!s.d.data)return false;s.d.origHeight=s.getVal(height,"h");s.d.origWidth=s.getVal(width,"w");s.d.data.hide();height&&s.d.container.css("height",height);width&&s.d.container.css("width",width);s.setContainerDimensions();
s.d.data.show();s.o.focus&&s.focus();s.unbindEvents();s.bindEvents()},setContainerDimensions:function(){var s=this,badIE=ie6||ie7;var ch=s.d.origHeight?s.d.origHeight:$.browser.opera?s.d.container.height():s.getVal(badIE?s.d.container[0].currentStyle["height"]:s.d.container.css("height"),"h"),cw=s.d.origWidth?s.d.origWidth:$.browser.opera?s.d.container.width():s.getVal(badIE?s.d.container[0].currentStyle["width"]:s.d.container.css("width"),"w"),dh=s.d.data.outerHeight(true),dw=s.d.data.outerWidth(true);
s.d.origHeight=s.d.origHeight||ch;s.d.origWidth=s.d.origWidth||cw;var mxoh=s.o.maxHeight?s.getVal(s.o.maxHeight,"h"):null,mxow=s.o.maxWidth?s.getVal(s.o.maxWidth,"w"):null,mh=mxoh&&mxoh<w[0]?mxoh:w[0],mw=mxow&&mxow<w[1]?mxow:w[1];var moh=s.o.minHeight?s.getVal(s.o.minHeight,"h"):"auto";if(!ch)if(!dh)ch=moh;else if(dh>mh)ch=mh;else if(s.o.minHeight&&moh!=="auto"&&dh<moh)ch=moh;else ch=dh;else ch=s.o.autoResize&&ch>mh?mh:ch<moh?moh:ch;var mow=s.o.minWidth?s.getVal(s.o.minWidth,"w"):"auto";if(!cw)if(!dw)cw=
mow;else if(dw>mw)cw=mw;else if(s.o.minWidth&&mow!=="auto"&&dw<mow)cw=mow;else cw=dw;else cw=s.o.autoResize&&cw>mw?mw:cw<mow?mow:cw;s.d.container.css({height:ch,width:cw});s.d.wrap.css({overflow:dh>ch||dw>cw?"auto":"visible"});s.o.autoPosition&&s.setPosition()},setPosition:function(){var s=this,top,left,hc=w[0]/2-s.d.container.outerHeight(true)/2,vc=w[1]/2-s.d.container.outerWidth(true)/2,st=s.d.container.css("position")!=="fixed"?wndw.scrollTop():0;if(s.o.position&&Object.prototype.toString.call(s.o.position)===
"[object Array]"){top=st+(s.o.position[0]||hc);left=s.o.position[1]||vc}else{top=st+hc;left=vc}s.d.container.css({left:left,top:top})},watchTab:function(e){var s=this;if($(e.target).parents(".simplemodal-container").length>0){s.inputs=$(":input:enabled:visible:first, :input:enabled:visible:last",s.d.data[0]);if(!e.shiftKey&&e.target===s.inputs[s.inputs.length-1]||e.shiftKey&&e.target===s.inputs[0]||s.inputs.length===0){e.preventDefault();var pos=e.shiftKey?"last":"first";s.focus(pos)}}else{e.preventDefault();
s.focus()}},open:function(){var s=this;s.d.iframe&&s.d.iframe.show();if($.isFunction(s.o.onOpen))s.o.onOpen.apply(s,[s.d]);else{s.d.overlay.show();s.d.container.show();s.d.data.show()}s.o.focus&&s.focus();s.bindEvents()},close:function(){var s=this;if(!s.d.data)return false;s.unbindEvents();if($.isFunction(s.o.onClose)&&!s.occb){s.occb=true;s.o.onClose.apply(s,[s.d])}else{if(s.d.placeholder){var ph=$("#simplemodal-placeholder");if(s.o.persist)ph.replaceWith(s.d.data.removeClass("simplemodal-data").css("display",
s.display));else{s.d.data.hide().remove();ph.replaceWith(s.d.orig)}}else s.d.data.hide().remove();s.d.container.hide().remove();s.d.overlay.hide();s.d.iframe&&s.d.iframe.hide().remove();s.d.overlay.remove();s.d={}}}}});

/*!
  * Morpheus - A Brilliant Animator
  * https://github.com/ded/morpheus - (c) Dustin Diaz 2011
  * License MIT
  */
!function(a,b){typeof define=="function"?define(b):typeof module!="undefined"?module.exports=b():this[a]=b()}("morpheus",function(){function s(a,b,c){if(Array.prototype.indexOf)return a.indexOf(b);for(c=0;c<a.length;++c)if(a[c]===b)return c}function t(a){var b,c=r.length;for(b=c;b--;)r[b](a);r.length&&q(t)}function u(a){r.push(a)===1&&q(t)}function v(a){var b,c,d=s(r,a);d>=0&&(c=r.slice(d+1),r.length=d,r=r.concat(c))}function w(a,b){var c={},d;if(d=a.match(i))c.rotate=G(d[1],b?b.rotate:null);if(d=a.match(j))c.scale=G(d[1],b?b.scale:null);if(d=a.match(k))c.skewx=G(d[1],b?b.skewx:null),c.skewy=G(d[3],b?b.skewy:null);if(d=a.match(l))c.translatex=G(d[1],b?b.translatex:null),c.translatey=G(d[3],b?b.translatey:null);return c}function x(a){var b="";return"rotate"in a&&(b+="rotate("+a.rotate+"deg) "),"scale"in a&&(b+="scale("+a.scale+") "),"translatex"in a&&(b+="translate("+a.translatex+"px,"+a.translatey+"px) "),"skewx"in a&&(b+="skew("+a.skewx+"deg,"+a.skewy+"deg)"),b}function y(a,b,c){return"#"+(1<<24|a<<16|b<<8|c).toString(16).slice(1)}function z(a){var b=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(a);return(b?y(b[1],b[2],b[3]):a).replace(/#(\w)(\w)(\w)$/,"#$1$1$2$2$3$3")}function A(a){return a.replace(/-(.)/g,function(a,b){return b.toUpperCase()})}function B(a){return typeof a=="function"}function C(a,b,c,d,f,g){function n(a){var e=a-k;if(e>h||l)return g=isFinite(g)?g:1,l?m&&b(g):b(g),v(n),c&&c.apply(i);isFinite(g)?b(j*d(e/h)+f):b(d(e/h))}d=B(d)?d:H.easings[d]||function(a){return Math.sin(a*Math.PI/2)};var h=a||e,i=this,j=g-f,k=+(new Date),l=0,m=0;return u(n),{stop:function(a){l=1,m=a,a||(c=null)}}}function D(a,b){var c=a.length,d=[],e,f;for(e=0;e<c;++e)d[e]=[a[e][0],a[e][1]];for(f=1;f<c;++f)for(e=0;e<c-f;++e)d[e][0]=(1-b)*d[e][0]+b*d[parseInt(e+1,10)][0],d[e][1]=(1-b)*d[e][1]+b*d[parseInt(e+1,10)][1];return[d[0][0],d[0][1]]}function E(a,b,c){var d=[],e,f,g,h;for(e=0;e<6;e++)g=Math.min(15,parseInt(b.charAt(e),16)),h=Math.min(15,parseInt(c.charAt(e),16)),f=Math.floor((h-g)*a+g),f=f>15?15:f<0?0:f,d[e]=f.toString(16);return"#"+d.join("")}function F(a,b,c,d,f,g,h){if(f=="transform"){h={};for(var i in c[g][f])h[i]=i in d[g][f]?Math.round(((d[g][f][i]-c[g][f][i])*a+c[g][f][i])*e)/e:c[g][f][i];return h}return typeof c[g][f]=="string"?E(a,c[g][f],d[g][f]):(h=Math.round(((d[g][f]-c[g][f])*a+c[g][f])*e)/e,f in m||(h+=b[g][f]||"px"),h)}function G(a,b,c,d,e){return(c=g.exec(a))?(e=parseFloat(c[2]))&&b+(c[1]=="+"?1:-1)*e:parseFloat(a)}function H(a,b){var c=a?c=isFinite(a.length)?a:[a]:[],d,e=b.complete,g=b.duration,i=b.easing,j=b.bezier,k=[],l=[],m=[],q=[],r,s;delete b.complete,delete b.duration,delete b.easing,delete b.bezier,j&&(r=b.left,s=b.top,delete b.right,delete b.bottom,delete b.left,delete b.top);for(d=c.length;d--;){k[d]={},l[d]={},m[d]={};if(j){var t=p(c[d],"left"),u=p(c[d],"top"),v=[G(B(r)?r(c[d]):r||0,parseFloat(t)),G(B(s)?s(c[d]):s||0,parseFloat(u))];q[d]=B(j)?j(c[d],v):j,q[d].push(v),q[d].unshift([parseInt(t,10),parseInt(u,10)])}for(var y in b){var E=p(c[d],y),H,I=B(b[y])?b[y](c[d]):b[y];if(typeof I=="string"&&f.test(I)&&!f.test(E)){delete b[y];continue}k[d][y]=y=="transform"?w(E):typeof I=="string"&&f.test(I)?z(E).slice(1):parseFloat(E),l[d][y]=y=="transform"?w(I,k[d][y]):typeof I=="string"&&I.charAt(0)=="#"?z(I).slice(1):G(I,parseFloat(E)),typeof I=="string"&&(H=I.match(h))&&(m[d][y]=H[1])}}return C.apply(c,[g,function(a,e,f){for(d=c.length;d--;){j&&(f=D(q[d],a),c[d].style.left=f[0]+"px",c[d].style.top=f[1]+"px");for(var g in b)e=F(a,m,k,l,g,d),g=="transform"?c[d].style[n]=x(e):g=="opacity"&&!o?c[d].style.filter="alpha(opacity="+e*100+")":c[d].style[A(g)]=e}},e,i])}var a=this,b=document,c=window,d=b.documentElement,e=1e3,f=/^rgb\(|#/,g=/^([+\-])=([\d\.]+)/,h=/^(?:[\+\-]=)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,i=/rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,j=/scale\(((?:[+\-]=)?([\d\.]+))\)/,k=/skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,l=/translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,m={lineHeight:1,zoom:1,zIndex:1,opacity:1,transform:1},n=function(){var a=b.createElement("a").style,c=["webkitTransform","MozTransform","OTransform","msTransform","Transform"],d;for(d=0;d<c.length;d++)if(c[d]in a)return c[d]}(),o=function(){return typeof b.createElement("a").style.opacity!="undefined"}(),p=b.defaultView&&b.defaultView.getComputedStyle?function(a,c){c=c=="transform"?n:c;var d=null,e=b.defaultView.getComputedStyle(a,"");return e&&(d=e[A(c)]),a.style[c]||d}:d.currentStyle?function(a,b){b=A(b);if(b=="opacity"){var c=100;try{c=a.filters["DXImageTransform.Microsoft.Alpha"].opacity}catch(d){try{c=a.filters("alpha").opacity}catch(e){}}return c/100}var f=a.currentStyle?a.currentStyle[b]:null;return a.style[b]||f}:function(a,b){return a.style[A(b)]},q=function(){return c.requestAnimationFrame||c.webkitRequestAnimationFrame||c.mozRequestAnimationFrame||c.oRequestAnimationFrame||c.msRequestAnimationFrame||function(a){c.setTimeout(function(){a(+(new Date))},11)}}(),r=[];return H.tween=C,H.getStyle=p,H.bezier=D,H.transform=n,H.parseTransform=w,H.formatTransform=x,H.easings={},H})

/*
    transformBuilder by makfak
    she ain't pretty but she's contained
*/
;(function($) {
    var transformBuilder = function(){};

    $.fn.transformBuilder = function(options) {
        this.each(function(i) {
            if (!this.transformBuilder) {
                this.transformBuilder = new transformBuilder();
                this.transformBuilder.init(this, options, i);
            }
        });
        return this;
    };

    $.extend(transformBuilder.prototype, {
        init: function(el, options, i) {
            var defaults = {};
            var self = this;
            
            this.opts = $.extend({}, defaults, options);
            this.obj = $(el);

            this.$coords = $('.coords', this.obj);
            this.$cover = $('.cover', this.obj);
            this.$img = $('img', this.$cover);
            this.$onion = $('.onionskin', this.obj);
            this.dims = {
                size: {
                    w: this.$img.width(),
                    h: this.$img.height()
                },
                step: {},
                min: {}
            };
            this.dims.step = {
                w: Math.floor((this.dims.size.w - (this.dims.size.w * 0.99))),
                h: Math.floor((this.dims.size.h - (this.dims.size.h * 0.99)))
            };
            this.dims.min = {
                w: Math.floor((this.dims.size.w * 0.01)),
                h: Math.floor((this.dims.size.w * 0.01))
            };
console.log(this.dims);
            this.$cover.css({
                width: this.dims.size.w,
                height: this.dims.size.h
            });

            this.$onion.draggable({
                containment: this._getContainment(),
                drag: function(e, ui) {
                    self.$img.css({
                        top: ui.position.top,
                        left: ui.position.left
                    });
                }
            });

            this.$onion.resizable({
                aspectRatio: true,
                handles: 'se',
                grid: [
                    this.dims.step.w,
                    this.dims.step.h
                ],
                minWidth: this.dims.min.w,
                minHeight: this.dims.min.h,
                maxWidth: this.dims.size.w,
                maxHeight: this.dims.size.h,
                alsoResize: this.$img,
                stop: function(e, ui) {
                    self.$onion.draggable('option', 'containment', self._getContainment());
                }
            });

            $('#reset', this.obj).click(function(){
                this.$onion.attr('style','');
                this.$img.attr('style','');
                return false;
            });

            $('#save', this.obj).click(function(){
                console.log( this._getTransform() )
            });

            $('#test', this.obj).click(function(){
                $('.test').attr('style', this.$cover.attr('style'));
                $('.test img')[0].style[morpheus.transform] = this._getTransform();
                $('.test img')[0].style.opacity = 0;

                setTimeout(function(){
                    self.$container.addClass('testing');
                }, 350);

                setTimeout(function(){
                    $('.test img', self.obj).attr('style', '');
                }, 1000);

                return false;
            });

            $('#done', this.obj).click(function(){
                this.obj.removeClass('testing');
                return false;
            });
        },

        _getContainment: function() {
            var containerOffset = this.obj.offset();
            return [
                containerOffset.left - this.$onion.width(),
                containerOffset.top - this.$onion.height(),
                containerOffset.left + this.obj.width(),
                containerOffset.top + this.obj.height()
            ];
        },

        _getTransform: function() {
            var width = parseInt(this.$onion.css('width'));
            var height = parseInt(this.$onion.css('height'));
            var top = parseInt(this.$onion.css('top'));
            var left = parseInt(this.$onion.css('left'));
            var scale = ((width * 100) / this.dims.size.w) / 100;
            var x = Math.round((left * 100) / width);
            var y = Math.round((top * 100) / height);
            return 'scale('+ scale +') translate('+ x +'%,'+ y +'%)';
        }
    });
})(JQPM);

(function($) {
    $(document).ready(function(){

// ==== TABS ====
        var $tabContainers = $('.tab');
        var $tabs = $('.nav-tab');

        $tabs.click(function() {
            var hash = $(this).attr('href');
            $tabs.removeClass('nav-tab-active').filter(this).addClass('nav-tab-active');
            $tabContainers.hide().filter(hash).show();
            return false;
        }).eq(0).click();

// ==== FORM ====
        var $lb = $('input[name="lightbox"]');
        var $custom_lb = $('input[name="custom_lightbox"]');
        var $custom_lb_name = $('input[name="custom_lightbox_name"]');
        var $custom_lb_params = $('textarea[name="custom_lightbox_params"]');
        var $auto_play = $('textarea[name="auto_play"]');
        var $auto_play_interval = $('textarea[name="auto_play_interval"]');
        var $links = $('input[name="links"]');
        var $link_to_url = $('input[name="link_to_url"]');
        var $external_links = $('input[name="external_links"]');
        var $transition = $('select[name="loading_transition"]');
        var $transition_link = $('#PMtrans');
            
        $lb.click(function(){
            if($lb.is(':checked')){
                $custom_lb.removeAttr('checked');
            }
            if($lb.is(':checked') && $link_to_url.is(':checked')){
                $link_to_url.removeAttr('checked');
            }
            if($lb.is(':checked') && $external_links.is(':checked')){
                $external_links.removeAttr('checked');
            }
            if($lb.is(':checked') && $links.is(':not(":checked")')){
                $links.attr('checked', true);
            }
        });
        $custom_lb.click(function(){
            if($custom_lb.is(':checked')){
                $lb.removeAttr('checked');
            }
            if($custom_lb.is(':checked') && $link_to_url.is(':checked')){
                $link_to_url.removeAttr('checked');
            }
            if($custom_lb.is(':checked') && $external_links.is(':checked')){
                $external_links.removeAttr('checked');
            }
            if($custom_lb.is(':checked') && $links.is(':not(":checked")')){
                $links.attr('checked', true);
            }
        });
        $link_to_url.click(function(){
            if($lb.is(':checked')){
                $lb.removeAttr('checked');
            }
            if($custom_lb.is(':checked')){
                $custom_lb.removeAttr('checked');
            }
            if($link_to_url.is(':checked') && $links.is(':not(":checked")')){
                $links.attr('checked', true);
            }
        });
        $external_links.click(function(){
            if($lb.is(':checked')){
                $lb.removeAttr('checked');
            }
            if($custom_lb.is(':checked')){
                $custom_lb.removeAttr('checked');
            }
            if($external_links.is(':checked') && $links.is(':not(":checked")')){
                $links.attr('checked', true);
            }
            if($external_links.is(':checked') && $link_to_url.is(':not(":checked")')){
                $link_to_url.attr('checked', true);
            }
        });
        $links.click(function(){
            if($links.is(':not(":checked")')){
                $link_to_url.removeAttr('checked');
                $external_links.removeAttr('checked');
            }
        });

        var checkTransitionSelection = function() {
            if ($transition.val() === 'custom') {
                $transition_link.show();
            } else {
                $transition_link.hide();
            }
        };
        $transition.change(function() {
            checkTransitionSelection();
        });
        checkTransitionSelection();

        // $transition_link.click(function() {
        //     debugger;
        //     return false;
        // });

        $('#photomosaic-options').submit(function(){
            
            // TODO: make this less half-assed
            var returnState = true,
                $errorList = $('#photomosaic-error-list').empty().attr('style', '');
                
            if( $lb.is(':checked') && $custom_lb.is(':checked') ) {
                $errorList.append('<li style="list-style:disc; margin-left:20px;">"Use Default Lightbox" and "Use Custom Lightbox" can\'t both be selected.</li>');
                returnState = false;
            }

            if( $custom_lb.is(':checked') && $custom_lb_params.val().trim() == '' ) {            
                $custom_lb_params.val('{}');
            }
            
            if( $custom_lb.is(':checked') && $custom_lb_name.val().trim() == '' ) {            
                $errorList.append('<li style="list-style:disc; margin-left:20px;">"Custom Lightbox Name" can\'t be empty.</li>');
                returnState = false;
            }
            
            if( !$links.is(':checked') ) {
                if ($lb.is(':checked') || $custom_lb.is(':checked')) {
                    $errorList.append('<li style="list-style:disc; margin-left:20px;">"Image Links" must be selected to use a lightbox.</li>');
                    returnState = false;
                }
                if ($link_to_url.is(':checked')) {
                    $errorList.append('<li style="list-style:disc; margin-left:20px;">"Link to URL" requires "Image Links"</li>');
                    returnState = false;
                }
                if ($external_links.is(':checked')) {
                    $errorList.append('<li style="list-style:disc; margin-left:20px;">"Open Links in New Window" requires "Image Links"</li>');
                    returnState = false;
                }
            }
            
            if( !returnState ) {
                $errorList.prepend('<li style="font-size:16px; color:#cc0000;">Please fix the following errors</li>');
                $errorList.css({
                    'border':'1px solid #de7d7d',
                    'padding':'10px',
                    'background-color':'#f8dfdf'
                });
            }
            return returnState;
        });
    });

    $(window).load(function() {
        $('#PMtrans').click(function(){
            $('#transformer').modal({
                onShow: function(dialog) {
                    dialog.data.transformBuilder();
                }
            });
            return false;
        });
    });

})(JQPM);