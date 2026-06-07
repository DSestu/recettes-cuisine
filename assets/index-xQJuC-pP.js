var Ux=Object.defineProperty;var Hx=(e,n,t)=>n in e?Ux(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var re=(e,n,t)=>Hx(e,typeof n!="symbol"?n+"":n,t);function Wx(e,n){for(var t=0;t<n.length;t++){const r=n[t];if(typeof r!="string"&&!Array.isArray(r)){for(const i in r)if(i!=="default"&&!(i in e)){const s=Object.getOwnPropertyDescriptor(r,i);s&&Object.defineProperty(e,i,s.get?s:{enumerable:!0,get:()=>r[i]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();function Kx(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Pg={exports:{}},Ja={},jg={exports:{}},X={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fs=Symbol.for("react.element"),Yx=Symbol.for("react.portal"),Gx=Symbol.for("react.fragment"),Xx=Symbol.for("react.strict_mode"),Qx=Symbol.for("react.profiler"),Zx=Symbol.for("react.provider"),Jx=Symbol.for("react.context"),e_=Symbol.for("react.forward_ref"),n_=Symbol.for("react.suspense"),t_=Symbol.for("react.memo"),r_=Symbol.for("react.lazy"),ep=Symbol.iterator;function i_(e){return e===null||typeof e!="object"?null:(e=ep&&e[ep]||e["@@iterator"],typeof e=="function"?e:null)}var Tg={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},zg=Object.assign,Eg={};function gi(e,n,t){this.props=e,this.context=n,this.refs=Eg,this.updater=t||Tg}gi.prototype.isReactComponent={};gi.prototype.setState=function(e,n){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,n,"setState")};gi.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Ag(){}Ag.prototype=gi.prototype;function ed(e,n,t){this.props=e,this.context=n,this.refs=Eg,this.updater=t||Tg}var nd=ed.prototype=new Ag;nd.constructor=ed;zg(nd,gi.prototype);nd.isPureReactComponent=!0;var np=Array.isArray,Mg=Object.prototype.hasOwnProperty,td={current:null},Rg={key:!0,ref:!0,__self:!0,__source:!0};function Ng(e,n,t){var r,i={},s=null,o=null;if(n!=null)for(r in n.ref!==void 0&&(o=n.ref),n.key!==void 0&&(s=""+n.key),n)Mg.call(n,r)&&!Rg.hasOwnProperty(r)&&(i[r]=n[r]);var a=arguments.length-2;if(a===1)i.children=t;else if(1<a){for(var l=Array(a),u=0;u<a;u++)l[u]=arguments[u+2];i.children=l}if(e&&e.defaultProps)for(r in a=e.defaultProps,a)i[r]===void 0&&(i[r]=a[r]);return{$$typeof:Fs,type:e,key:s,ref:o,props:i,_owner:td.current}}function s_(e,n){return{$$typeof:Fs,type:e.type,key:n,ref:e.ref,props:e.props,_owner:e._owner}}function rd(e){return typeof e=="object"&&e!==null&&e.$$typeof===Fs}function o_(e){var n={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(t){return n[t]})}var tp=/\/+/g;function Ml(e,n){return typeof e=="object"&&e!==null&&e.key!=null?o_(""+e.key):n.toString(36)}function Do(e,n,t,r,i){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Fs:case Yx:o=!0}}if(o)return o=e,i=i(o),e=r===""?"."+Ml(o,0):r,np(i)?(t="",e!=null&&(t=e.replace(tp,"$&/")+"/"),Do(i,n,t,"",function(u){return u})):i!=null&&(rd(i)&&(i=s_(i,t+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(tp,"$&/")+"/")+e)),n.push(i)),1;if(o=0,r=r===""?".":r+":",np(e))for(var a=0;a<e.length;a++){s=e[a];var l=r+Ml(s,a);o+=Do(s,n,t,l,i)}else if(l=i_(e),typeof l=="function")for(e=l.call(e),a=0;!(s=e.next()).done;)s=s.value,l=r+Ml(s,a++),o+=Do(s,n,t,l,i);else if(s==="object")throw n=String(e),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.");return o}function oo(e,n,t){if(e==null)return e;var r=[],i=0;return Do(e,r,"","",function(s){return n.call(t,s,i++)}),r}function a_(e){if(e._status===-1){var n=e._result;n=n(),n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var He={current:null},Io={transition:null},l_={ReactCurrentDispatcher:He,ReactCurrentBatchConfig:Io,ReactCurrentOwner:td};function Lg(){throw Error("act(...) is not supported in production builds of React.")}X.Children={map:oo,forEach:function(e,n,t){oo(e,function(){n.apply(this,arguments)},t)},count:function(e){var n=0;return oo(e,function(){n++}),n},toArray:function(e){return oo(e,function(n){return n})||[]},only:function(e){if(!rd(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};X.Component=gi;X.Fragment=Gx;X.Profiler=Qx;X.PureComponent=ed;X.StrictMode=Xx;X.Suspense=n_;X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=l_;X.act=Lg;X.cloneElement=function(e,n,t){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=zg({},e.props),i=e.key,s=e.ref,o=e._owner;if(n!=null){if(n.ref!==void 0&&(s=n.ref,o=td.current),n.key!==void 0&&(i=""+n.key),e.type&&e.type.defaultProps)var a=e.type.defaultProps;for(l in n)Mg.call(n,l)&&!Rg.hasOwnProperty(l)&&(r[l]=n[l]===void 0&&a!==void 0?a[l]:n[l])}var l=arguments.length-2;if(l===1)r.children=t;else if(1<l){a=Array(l);for(var u=0;u<l;u++)a[u]=arguments[u+2];r.children=a}return{$$typeof:Fs,type:e.type,key:i,ref:s,props:r,_owner:o}};X.createContext=function(e){return e={$$typeof:Jx,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Zx,_context:e},e.Consumer=e};X.createElement=Ng;X.createFactory=function(e){var n=Ng.bind(null,e);return n.type=e,n};X.createRef=function(){return{current:null}};X.forwardRef=function(e){return{$$typeof:e_,render:e}};X.isValidElement=rd;X.lazy=function(e){return{$$typeof:r_,_payload:{_status:-1,_result:e},_init:a_}};X.memo=function(e,n){return{$$typeof:t_,type:e,compare:n===void 0?null:n}};X.startTransition=function(e){var n=Io.transition;Io.transition={};try{e()}finally{Io.transition=n}};X.unstable_act=Lg;X.useCallback=function(e,n){return He.current.useCallback(e,n)};X.useContext=function(e){return He.current.useContext(e)};X.useDebugValue=function(){};X.useDeferredValue=function(e){return He.current.useDeferredValue(e)};X.useEffect=function(e,n){return He.current.useEffect(e,n)};X.useId=function(){return He.current.useId()};X.useImperativeHandle=function(e,n,t){return He.current.useImperativeHandle(e,n,t)};X.useInsertionEffect=function(e,n){return He.current.useInsertionEffect(e,n)};X.useLayoutEffect=function(e,n){return He.current.useLayoutEffect(e,n)};X.useMemo=function(e,n){return He.current.useMemo(e,n)};X.useReducer=function(e,n,t){return He.current.useReducer(e,n,t)};X.useRef=function(e){return He.current.useRef(e)};X.useState=function(e){return He.current.useState(e)};X.useSyncExternalStore=function(e,n,t){return He.current.useSyncExternalStore(e,n,t)};X.useTransition=function(){return He.current.useTransition()};X.version="18.3.1";jg.exports=X;var S=jg.exports;const u_=Kx(S),c_=Wx({__proto__:null,default:u_},[S]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d_=S,f_=Symbol.for("react.element"),p_=Symbol.for("react.fragment"),h_=Object.prototype.hasOwnProperty,m_=d_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,g_={key:!0,ref:!0,__self:!0,__source:!0};function Dg(e,n,t){var r,i={},s=null,o=null;t!==void 0&&(s=""+t),n.key!==void 0&&(s=""+n.key),n.ref!==void 0&&(o=n.ref);for(r in n)h_.call(n,r)&&!g_.hasOwnProperty(r)&&(i[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps,n)i[r]===void 0&&(i[r]=n[r]);return{$$typeof:f_,type:e,key:s,ref:o,props:i,_owner:m_.current}}Ja.Fragment=p_;Ja.jsx=Dg;Ja.jsxs=Dg;Pg.exports=Ja;var w=Pg.exports,Ig={exports:{}},dn={},Fg={exports:{}},qg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function n(z,M){var R=z.length;z.push(M);e:for(;0<R;){var U=R-1>>>1,K=z[U];if(0<i(K,M))z[U]=M,z[R]=K,R=U;else break e}}function t(z){return z.length===0?null:z[0]}function r(z){if(z.length===0)return null;var M=z[0],R=z.pop();if(R!==M){z[0]=R;e:for(var U=0,K=z.length,be=K>>>1;U<be;){var Z=2*(U+1)-1,oe=z[Z],Q=Z+1,te=z[Q];if(0>i(oe,R))Q<K&&0>i(te,oe)?(z[U]=te,z[Q]=R,U=Q):(z[U]=oe,z[Z]=R,U=Z);else if(Q<K&&0>i(te,R))z[U]=te,z[Q]=R,U=Q;else break e}}return M}function i(z,M){var R=z.sortIndex-M.sortIndex;return R!==0?R:z.id-M.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;e.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();e.unstable_now=function(){return o.now()-a}}var l=[],u=[],c=1,d=null,f=3,p=!1,v=!1,g=!1,_=typeof setTimeout=="function"?setTimeout:null,h=typeof clearTimeout=="function"?clearTimeout:null,m=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(z){for(var M=t(u);M!==null;){if(M.callback===null)r(u);else if(M.startTime<=z)r(u),M.sortIndex=M.expirationTime,n(l,M);else break;M=t(u)}}function x(z){if(g=!1,y(z),!v)if(t(l)!==null)v=!0,E(k);else{var M=t(u);M!==null&&N(x,M.startTime-z)}}function k(z,M){v=!1,g&&(g=!1,h(j),j=-1),p=!0;var R=f;try{for(y(M),d=t(l);d!==null&&(!(d.expirationTime>M)||z&&!O());){var U=d.callback;if(typeof U=="function"){d.callback=null,f=d.priorityLevel;var K=U(d.expirationTime<=M);M=e.unstable_now(),typeof K=="function"?d.callback=K:d===t(l)&&r(l),y(M)}else r(l);d=t(l)}if(d!==null)var be=!0;else{var Z=t(u);Z!==null&&N(x,Z.startTime-M),be=!1}return be}finally{d=null,f=R,p=!1}}var C=!1,T=null,j=-1,F=5,I=-1;function O(){return!(e.unstable_now()-I<F)}function $(){if(T!==null){var z=e.unstable_now();I=z;var M=!0;try{M=T(!0,z)}finally{M?q():(C=!1,T=null)}}else C=!1}var q;if(typeof m=="function")q=function(){m($)};else if(typeof MessageChannel<"u"){var P=new MessageChannel,L=P.port2;P.port1.onmessage=$,q=function(){L.postMessage(null)}}else q=function(){_($,0)};function E(z){T=z,C||(C=!0,q())}function N(z,M){j=_(function(){z(e.unstable_now())},M)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(z){z.callback=null},e.unstable_continueExecution=function(){v||p||(v=!0,E(k))},e.unstable_forceFrameRate=function(z){0>z||125<z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):F=0<z?Math.floor(1e3/z):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_getFirstCallbackNode=function(){return t(l)},e.unstable_next=function(z){switch(f){case 1:case 2:case 3:var M=3;break;default:M=f}var R=f;f=M;try{return z()}finally{f=R}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(z,M){switch(z){case 1:case 2:case 3:case 4:case 5:break;default:z=3}var R=f;f=z;try{return M()}finally{f=R}},e.unstable_scheduleCallback=function(z,M,R){var U=e.unstable_now();switch(typeof R=="object"&&R!==null?(R=R.delay,R=typeof R=="number"&&0<R?U+R:U):R=U,z){case 1:var K=-1;break;case 2:K=250;break;case 5:K=1073741823;break;case 4:K=1e4;break;default:K=5e3}return K=R+K,z={id:c++,callback:M,priorityLevel:z,startTime:R,expirationTime:K,sortIndex:-1},R>U?(z.sortIndex=R,n(u,z),t(l)===null&&z===t(u)&&(g?(h(j),j=-1):g=!0,N(x,R-U))):(z.sortIndex=K,n(l,z),v||p||(v=!0,E(k))),z},e.unstable_shouldYield=O,e.unstable_wrapCallback=function(z){var M=f;return function(){var R=f;f=M;try{return z.apply(this,arguments)}finally{f=R}}}})(qg);Fg.exports=qg;var v_=Fg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var y_=S,ln=v_;function D(e){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)n+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Vg=new Set,us={};function vr(e,n){ni(e,n),ni(e+"Capture",n)}function ni(e,n){for(us[e]=n,e=0;e<n.length;e++)Vg.add(n[e])}var rt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Tu=Object.prototype.hasOwnProperty,x_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,rp={},ip={};function __(e){return Tu.call(ip,e)?!0:Tu.call(rp,e)?!1:x_.test(e)?ip[e]=!0:(rp[e]=!0,!1)}function w_(e,n,t,r){if(t!==null&&t.type===0)return!1;switch(typeof n){case"function":case"symbol":return!0;case"boolean":return r?!1:t!==null?!t.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function b_(e,n,t,r){if(n===null||typeof n>"u"||w_(e,n,t,r))return!0;if(r)return!1;if(t!==null)switch(t.type){case 3:return!n;case 4:return n===!1;case 5:return isNaN(n);case 6:return isNaN(n)||1>n}return!1}function We(e,n,t,r,i,s,o){this.acceptsBooleans=n===2||n===3||n===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=t,this.propertyName=e,this.type=n,this.sanitizeURL=s,this.removeEmptyString=o}var Ee={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){Ee[e]=new We(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var n=e[0];Ee[n]=new We(n,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){Ee[e]=new We(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){Ee[e]=new We(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){Ee[e]=new We(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){Ee[e]=new We(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){Ee[e]=new We(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){Ee[e]=new We(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){Ee[e]=new We(e,5,!1,e.toLowerCase(),null,!1,!1)});var id=/[\-:]([a-z])/g;function sd(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var n=e.replace(id,sd);Ee[n]=new We(n,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var n=e.replace(id,sd);Ee[n]=new We(n,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var n=e.replace(id,sd);Ee[n]=new We(n,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){Ee[e]=new We(e,1,!1,e.toLowerCase(),null,!1,!1)});Ee.xlinkHref=new We("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){Ee[e]=new We(e,1,!1,e.toLowerCase(),null,!0,!0)});function od(e,n,t,r){var i=Ee.hasOwnProperty(n)?Ee[n]:null;(i!==null?i.type!==0:r||!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(b_(n,t,i,r)&&(t=null),r||i===null?__(n)&&(t===null?e.removeAttribute(n):e.setAttribute(n,""+t)):i.mustUseProperty?e[i.propertyName]=t===null?i.type===3?!1:"":t:(n=i.attributeName,r=i.attributeNamespace,t===null?e.removeAttribute(n):(i=i.type,t=i===3||i===4&&t===!0?"":""+t,r?e.setAttributeNS(r,n,t):e.setAttribute(n,t))))}var ct=y_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ao=Symbol.for("react.element"),jr=Symbol.for("react.portal"),Tr=Symbol.for("react.fragment"),ad=Symbol.for("react.strict_mode"),zu=Symbol.for("react.profiler"),$g=Symbol.for("react.provider"),Og=Symbol.for("react.context"),ld=Symbol.for("react.forward_ref"),Eu=Symbol.for("react.suspense"),Au=Symbol.for("react.suspense_list"),ud=Symbol.for("react.memo"),gt=Symbol.for("react.lazy"),Bg=Symbol.for("react.offscreen"),sp=Symbol.iterator;function wi(e){return e===null||typeof e!="object"?null:(e=sp&&e[sp]||e["@@iterator"],typeof e=="function"?e:null)}var he=Object.assign,Rl;function Li(e){if(Rl===void 0)try{throw Error()}catch(t){var n=t.stack.trim().match(/\n( *(at )?)/);Rl=n&&n[1]||""}return`
`+Rl+e}var Nl=!1;function Ll(e,n){if(!e||Nl)return"";Nl=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(n)if(n=function(){throw Error()},Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(n,[])}catch(u){var r=u}Reflect.construct(e,[],n)}else{try{n.call()}catch(u){r=u}e.call(n.prototype)}else{try{throw Error()}catch(u){r=u}e()}}catch(u){if(u&&r&&typeof u.stack=="string"){for(var i=u.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,a=s.length-1;1<=o&&0<=a&&i[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(i[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||i[o]!==s[a]){var l=`
`+i[o].replace(" at new "," at ");return e.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",e.displayName)),l}while(1<=o&&0<=a);break}}}finally{Nl=!1,Error.prepareStackTrace=t}return(e=e?e.displayName||e.name:"")?Li(e):""}function k_(e){switch(e.tag){case 5:return Li(e.type);case 16:return Li("Lazy");case 13:return Li("Suspense");case 19:return Li("SuspenseList");case 0:case 2:case 15:return e=Ll(e.type,!1),e;case 11:return e=Ll(e.type.render,!1),e;case 1:return e=Ll(e.type,!0),e;default:return""}}function Mu(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Tr:return"Fragment";case jr:return"Portal";case zu:return"Profiler";case ad:return"StrictMode";case Eu:return"Suspense";case Au:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Og:return(e.displayName||"Context")+".Consumer";case $g:return(e._context.displayName||"Context")+".Provider";case ld:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ud:return n=e.displayName||null,n!==null?n:Mu(e.type)||"Memo";case gt:n=e._payload,e=e._init;try{return Mu(e(n))}catch{}}return null}function S_(e){var n=e.type;switch(e.tag){case 24:return"Cache";case 9:return(n.displayName||"Context")+".Consumer";case 10:return(n._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=n.render,e=e.displayName||e.name||"",n.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return n;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Mu(n);case 8:return n===ad?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n}return null}function Nt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ug(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function C_(e){var n=Ug(e)?"checked":"value",t=Object.getOwnPropertyDescriptor(e.constructor.prototype,n),r=""+e[n];if(!e.hasOwnProperty(n)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var i=t.get,s=t.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(e,n,{enumerable:t.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function lo(e){e._valueTracker||(e._valueTracker=C_(e))}function Hg(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var t=n.getValue(),r="";return e&&(r=Ug(e)?e.checked?"true":"false":e.value),e=r,e!==t?(n.setValue(e),!0):!1}function ra(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Ru(e,n){var t=n.checked;return he({},n,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??e._wrapperState.initialChecked})}function op(e,n){var t=n.defaultValue==null?"":n.defaultValue,r=n.checked!=null?n.checked:n.defaultChecked;t=Nt(n.value!=null?n.value:t),e._wrapperState={initialChecked:r,initialValue:t,controlled:n.type==="checkbox"||n.type==="radio"?n.checked!=null:n.value!=null}}function Wg(e,n){n=n.checked,n!=null&&od(e,"checked",n,!1)}function Nu(e,n){Wg(e,n);var t=Nt(n.value),r=n.type;if(t!=null)r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+t):e.value!==""+t&&(e.value=""+t);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}n.hasOwnProperty("value")?Lu(e,n.type,t):n.hasOwnProperty("defaultValue")&&Lu(e,n.type,Nt(n.defaultValue)),n.checked==null&&n.defaultChecked!=null&&(e.defaultChecked=!!n.defaultChecked)}function ap(e,n,t){if(n.hasOwnProperty("value")||n.hasOwnProperty("defaultValue")){var r=n.type;if(!(r!=="submit"&&r!=="reset"||n.value!==void 0&&n.value!==null))return;n=""+e._wrapperState.initialValue,t||n===e.value||(e.value=n),e.defaultValue=n}t=e.name,t!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,t!==""&&(e.name=t)}function Lu(e,n,t){(n!=="number"||ra(e.ownerDocument)!==e)&&(t==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+t&&(e.defaultValue=""+t))}var Di=Array.isArray;function Kr(e,n,t,r){if(e=e.options,n){n={};for(var i=0;i<t.length;i++)n["$"+t[i]]=!0;for(t=0;t<e.length;t++)i=n.hasOwnProperty("$"+e[t].value),e[t].selected!==i&&(e[t].selected=i),i&&r&&(e[t].defaultSelected=!0)}else{for(t=""+Nt(t),n=null,i=0;i<e.length;i++){if(e[i].value===t){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}n!==null||e[i].disabled||(n=e[i])}n!==null&&(n.selected=!0)}}function Du(e,n){if(n.dangerouslySetInnerHTML!=null)throw Error(D(91));return he({},n,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function lp(e,n){var t=n.value;if(t==null){if(t=n.children,n=n.defaultValue,t!=null){if(n!=null)throw Error(D(92));if(Di(t)){if(1<t.length)throw Error(D(93));t=t[0]}n=t}n==null&&(n=""),t=n}e._wrapperState={initialValue:Nt(t)}}function Kg(e,n){var t=Nt(n.value),r=Nt(n.defaultValue);t!=null&&(t=""+t,t!==e.value&&(e.value=t),n.defaultValue==null&&e.defaultValue!==t&&(e.defaultValue=t)),r!=null&&(e.defaultValue=""+r)}function up(e){var n=e.textContent;n===e._wrapperState.initialValue&&n!==""&&n!==null&&(e.value=n)}function Yg(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Iu(e,n){return e==null||e==="http://www.w3.org/1999/xhtml"?Yg(n):e==="http://www.w3.org/2000/svg"&&n==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var uo,Gg=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(n,t,r,i){MSApp.execUnsafeLocalFunction(function(){return e(n,t,r,i)})}:e}(function(e,n){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=n;else{for(uo=uo||document.createElement("div"),uo.innerHTML="<svg>"+n.valueOf().toString()+"</svg>",n=uo.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;n.firstChild;)e.appendChild(n.firstChild)}});function cs(e,n){if(n){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=n;return}}e.textContent=n}var Wi={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},P_=["Webkit","ms","Moz","O"];Object.keys(Wi).forEach(function(e){P_.forEach(function(n){n=n+e.charAt(0).toUpperCase()+e.substring(1),Wi[n]=Wi[e]})});function Xg(e,n,t){return n==null||typeof n=="boolean"||n===""?"":t||typeof n!="number"||n===0||Wi.hasOwnProperty(e)&&Wi[e]?(""+n).trim():n+"px"}function Qg(e,n){e=e.style;for(var t in n)if(n.hasOwnProperty(t)){var r=t.indexOf("--")===0,i=Xg(t,n[t],r);t==="float"&&(t="cssFloat"),r?e.setProperty(t,i):e[t]=i}}var j_=he({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Fu(e,n){if(n){if(j_[e]&&(n.children!=null||n.dangerouslySetInnerHTML!=null))throw Error(D(137,e));if(n.dangerouslySetInnerHTML!=null){if(n.children!=null)throw Error(D(60));if(typeof n.dangerouslySetInnerHTML!="object"||!("__html"in n.dangerouslySetInnerHTML))throw Error(D(61))}if(n.style!=null&&typeof n.style!="object")throw Error(D(62))}}function qu(e,n){if(e.indexOf("-")===-1)return typeof n.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Vu=null;function cd(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var $u=null,Yr=null,Gr=null;function cp(e){if(e=$s(e)){if(typeof $u!="function")throw Error(D(280));var n=e.stateNode;n&&(n=il(n),$u(e.stateNode,e.type,n))}}function Zg(e){Yr?Gr?Gr.push(e):Gr=[e]:Yr=e}function Jg(){if(Yr){var e=Yr,n=Gr;if(Gr=Yr=null,cp(e),n)for(e=0;e<n.length;e++)cp(n[e])}}function e0(e,n){return e(n)}function n0(){}var Dl=!1;function t0(e,n,t){if(Dl)return e(n,t);Dl=!0;try{return e0(e,n,t)}finally{Dl=!1,(Yr!==null||Gr!==null)&&(n0(),Jg())}}function ds(e,n){var t=e.stateNode;if(t===null)return null;var r=il(t);if(r===null)return null;t=r[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(D(231,n,typeof t));return t}var Ou=!1;if(rt)try{var bi={};Object.defineProperty(bi,"passive",{get:function(){Ou=!0}}),window.addEventListener("test",bi,bi),window.removeEventListener("test",bi,bi)}catch{Ou=!1}function T_(e,n,t,r,i,s,o,a,l){var u=Array.prototype.slice.call(arguments,3);try{n.apply(t,u)}catch(c){this.onError(c)}}var Ki=!1,ia=null,sa=!1,Bu=null,z_={onError:function(e){Ki=!0,ia=e}};function E_(e,n,t,r,i,s,o,a,l){Ki=!1,ia=null,T_.apply(z_,arguments)}function A_(e,n,t,r,i,s,o,a,l){if(E_.apply(this,arguments),Ki){if(Ki){var u=ia;Ki=!1,ia=null}else throw Error(D(198));sa||(sa=!0,Bu=u)}}function yr(e){var n=e,t=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,n.flags&4098&&(t=n.return),e=n.return;while(e)}return n.tag===3?t:null}function r0(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function dp(e){if(yr(e)!==e)throw Error(D(188))}function M_(e){var n=e.alternate;if(!n){if(n=yr(e),n===null)throw Error(D(188));return n!==e?null:e}for(var t=e,r=n;;){var i=t.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){t=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===t)return dp(i),e;if(s===r)return dp(i),n;s=s.sibling}throw Error(D(188))}if(t.return!==r.return)t=i,r=s;else{for(var o=!1,a=i.child;a;){if(a===t){o=!0,t=i,r=s;break}if(a===r){o=!0,r=i,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,r=i;break}if(a===r){o=!0,r=s,t=i;break}a=a.sibling}if(!o)throw Error(D(189))}}if(t.alternate!==r)throw Error(D(190))}if(t.tag!==3)throw Error(D(188));return t.stateNode.current===t?e:n}function i0(e){return e=M_(e),e!==null?s0(e):null}function s0(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var n=s0(e);if(n!==null)return n;e=e.sibling}return null}var o0=ln.unstable_scheduleCallback,fp=ln.unstable_cancelCallback,R_=ln.unstable_shouldYield,N_=ln.unstable_requestPaint,xe=ln.unstable_now,L_=ln.unstable_getCurrentPriorityLevel,dd=ln.unstable_ImmediatePriority,a0=ln.unstable_UserBlockingPriority,oa=ln.unstable_NormalPriority,D_=ln.unstable_LowPriority,l0=ln.unstable_IdlePriority,el=null,qn=null;function I_(e){if(qn&&typeof qn.onCommitFiberRoot=="function")try{qn.onCommitFiberRoot(el,e,void 0,(e.current.flags&128)===128)}catch{}}var An=Math.clz32?Math.clz32:V_,F_=Math.log,q_=Math.LN2;function V_(e){return e>>>=0,e===0?32:31-(F_(e)/q_|0)|0}var co=64,fo=4194304;function Ii(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function aa(e,n){var t=e.pendingLanes;if(t===0)return 0;var r=0,i=e.suspendedLanes,s=e.pingedLanes,o=t&268435455;if(o!==0){var a=o&~i;a!==0?r=Ii(a):(s&=o,s!==0&&(r=Ii(s)))}else o=t&~i,o!==0?r=Ii(o):s!==0&&(r=Ii(s));if(r===0)return 0;if(n!==0&&n!==r&&!(n&i)&&(i=r&-r,s=n&-n,i>=s||i===16&&(s&4194240)!==0))return n;if(r&4&&(r|=t&16),n=e.entangledLanes,n!==0)for(e=e.entanglements,n&=r;0<n;)t=31-An(n),i=1<<t,r|=e[t],n&=~i;return r}function $_(e,n){switch(e){case 1:case 2:case 4:return n+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function O_(e,n){for(var t=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,s=e.pendingLanes;0<s;){var o=31-An(s),a=1<<o,l=i[o];l===-1?(!(a&t)||a&r)&&(i[o]=$_(a,n)):l<=n&&(e.expiredLanes|=a),s&=~a}}function Uu(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function u0(){var e=co;return co<<=1,!(co&4194240)&&(co=64),e}function Il(e){for(var n=[],t=0;31>t;t++)n.push(e);return n}function qs(e,n,t){e.pendingLanes|=n,n!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,n=31-An(n),e[n]=t}function B_(e,n){var t=e.pendingLanes&~n;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=n,e.mutableReadLanes&=n,e.entangledLanes&=n,n=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<t;){var i=31-An(t),s=1<<i;n[i]=0,r[i]=-1,e[i]=-1,t&=~s}}function fd(e,n){var t=e.entangledLanes|=n;for(e=e.entanglements;t;){var r=31-An(t),i=1<<r;i&n|e[r]&n&&(e[r]|=n),t&=~i}}var ne=0;function c0(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var d0,pd,f0,p0,h0,Hu=!1,po=[],St=null,Ct=null,Pt=null,fs=new Map,ps=new Map,yt=[],U_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function pp(e,n){switch(e){case"focusin":case"focusout":St=null;break;case"dragenter":case"dragleave":Ct=null;break;case"mouseover":case"mouseout":Pt=null;break;case"pointerover":case"pointerout":fs.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":ps.delete(n.pointerId)}}function ki(e,n,t,r,i,s){return e===null||e.nativeEvent!==s?(e={blockedOn:n,domEventName:t,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},n!==null&&(n=$s(n),n!==null&&pd(n)),e):(e.eventSystemFlags|=r,n=e.targetContainers,i!==null&&n.indexOf(i)===-1&&n.push(i),e)}function H_(e,n,t,r,i){switch(n){case"focusin":return St=ki(St,e,n,t,r,i),!0;case"dragenter":return Ct=ki(Ct,e,n,t,r,i),!0;case"mouseover":return Pt=ki(Pt,e,n,t,r,i),!0;case"pointerover":var s=i.pointerId;return fs.set(s,ki(fs.get(s)||null,e,n,t,r,i)),!0;case"gotpointercapture":return s=i.pointerId,ps.set(s,ki(ps.get(s)||null,e,n,t,r,i)),!0}return!1}function m0(e){var n=Zt(e.target);if(n!==null){var t=yr(n);if(t!==null){if(n=t.tag,n===13){if(n=r0(t),n!==null){e.blockedOn=n,h0(e.priority,function(){f0(t)});return}}else if(n===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Fo(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var t=Wu(e.domEventName,e.eventSystemFlags,n[0],e.nativeEvent);if(t===null){t=e.nativeEvent;var r=new t.constructor(t.type,t);Vu=r,t.target.dispatchEvent(r),Vu=null}else return n=$s(t),n!==null&&pd(n),e.blockedOn=t,!1;n.shift()}return!0}function hp(e,n,t){Fo(e)&&t.delete(n)}function W_(){Hu=!1,St!==null&&Fo(St)&&(St=null),Ct!==null&&Fo(Ct)&&(Ct=null),Pt!==null&&Fo(Pt)&&(Pt=null),fs.forEach(hp),ps.forEach(hp)}function Si(e,n){e.blockedOn===n&&(e.blockedOn=null,Hu||(Hu=!0,ln.unstable_scheduleCallback(ln.unstable_NormalPriority,W_)))}function hs(e){function n(i){return Si(i,e)}if(0<po.length){Si(po[0],e);for(var t=1;t<po.length;t++){var r=po[t];r.blockedOn===e&&(r.blockedOn=null)}}for(St!==null&&Si(St,e),Ct!==null&&Si(Ct,e),Pt!==null&&Si(Pt,e),fs.forEach(n),ps.forEach(n),t=0;t<yt.length;t++)r=yt[t],r.blockedOn===e&&(r.blockedOn=null);for(;0<yt.length&&(t=yt[0],t.blockedOn===null);)m0(t),t.blockedOn===null&&yt.shift()}var Xr=ct.ReactCurrentBatchConfig,la=!0;function K_(e,n,t,r){var i=ne,s=Xr.transition;Xr.transition=null;try{ne=1,hd(e,n,t,r)}finally{ne=i,Xr.transition=s}}function Y_(e,n,t,r){var i=ne,s=Xr.transition;Xr.transition=null;try{ne=4,hd(e,n,t,r)}finally{ne=i,Xr.transition=s}}function hd(e,n,t,r){if(la){var i=Wu(e,n,t,r);if(i===null)Kl(e,n,r,ua,t),pp(e,r);else if(H_(i,e,n,t,r))r.stopPropagation();else if(pp(e,r),n&4&&-1<U_.indexOf(e)){for(;i!==null;){var s=$s(i);if(s!==null&&d0(s),s=Wu(e,n,t,r),s===null&&Kl(e,n,r,ua,t),s===i)break;i=s}i!==null&&r.stopPropagation()}else Kl(e,n,r,null,t)}}var ua=null;function Wu(e,n,t,r){if(ua=null,e=cd(r),e=Zt(e),e!==null)if(n=yr(e),n===null)e=null;else if(t=n.tag,t===13){if(e=r0(n),e!==null)return e;e=null}else if(t===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null);return ua=e,null}function g0(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(L_()){case dd:return 1;case a0:return 4;case oa:case D_:return 16;case l0:return 536870912;default:return 16}default:return 16}}var _t=null,md=null,qo=null;function v0(){if(qo)return qo;var e,n=md,t=n.length,r,i="value"in _t?_t.value:_t.textContent,s=i.length;for(e=0;e<t&&n[e]===i[e];e++);var o=t-e;for(r=1;r<=o&&n[t-r]===i[s-r];r++);return qo=i.slice(e,1<r?1-r:void 0)}function Vo(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function ho(){return!0}function mp(){return!1}function fn(e){function n(t,r,i,s,o){this._reactName=t,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in e)e.hasOwnProperty(a)&&(t=e[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ho:mp,this.isPropagationStopped=mp,this}return he(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=ho)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=ho)},persist:function(){},isPersistent:ho}),n}var vi={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},gd=fn(vi),Vs=he({},vi,{view:0,detail:0}),G_=fn(Vs),Fl,ql,Ci,nl=he({},Vs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:vd,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ci&&(Ci&&e.type==="mousemove"?(Fl=e.screenX-Ci.screenX,ql=e.screenY-Ci.screenY):ql=Fl=0,Ci=e),Fl)},movementY:function(e){return"movementY"in e?e.movementY:ql}}),gp=fn(nl),X_=he({},nl,{dataTransfer:0}),Q_=fn(X_),Z_=he({},Vs,{relatedTarget:0}),Vl=fn(Z_),J_=he({},vi,{animationName:0,elapsedTime:0,pseudoElement:0}),ew=fn(J_),nw=he({},vi,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),tw=fn(nw),rw=he({},vi,{data:0}),vp=fn(rw),iw={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},sw={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ow={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function aw(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=ow[e])?!!n[e]:!1}function vd(){return aw}var lw=he({},Vs,{key:function(e){if(e.key){var n=iw[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=Vo(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?sw[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:vd,charCode:function(e){return e.type==="keypress"?Vo(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Vo(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),uw=fn(lw),cw=he({},nl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),yp=fn(cw),dw=he({},Vs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:vd}),fw=fn(dw),pw=he({},vi,{propertyName:0,elapsedTime:0,pseudoElement:0}),hw=fn(pw),mw=he({},nl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),gw=fn(mw),vw=[9,13,27,32],yd=rt&&"CompositionEvent"in window,Yi=null;rt&&"documentMode"in document&&(Yi=document.documentMode);var yw=rt&&"TextEvent"in window&&!Yi,y0=rt&&(!yd||Yi&&8<Yi&&11>=Yi),xp=" ",_p=!1;function x0(e,n){switch(e){case"keyup":return vw.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function _0(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var zr=!1;function xw(e,n){switch(e){case"compositionend":return _0(n);case"keypress":return n.which!==32?null:(_p=!0,xp);case"textInput":return e=n.data,e===xp&&_p?null:e;default:return null}}function _w(e,n){if(zr)return e==="compositionend"||!yd&&x0(e,n)?(e=v0(),qo=md=_t=null,zr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return y0&&n.locale!=="ko"?null:n.data;default:return null}}var ww={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function wp(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!ww[e.type]:n==="textarea"}function w0(e,n,t,r){Zg(r),n=ca(n,"onChange"),0<n.length&&(t=new gd("onChange","change",null,t,r),e.push({event:t,listeners:n}))}var Gi=null,ms=null;function bw(e){M0(e,0)}function tl(e){var n=Mr(e);if(Hg(n))return e}function kw(e,n){if(e==="change")return n}var b0=!1;if(rt){var $l;if(rt){var Ol="oninput"in document;if(!Ol){var bp=document.createElement("div");bp.setAttribute("oninput","return;"),Ol=typeof bp.oninput=="function"}$l=Ol}else $l=!1;b0=$l&&(!document.documentMode||9<document.documentMode)}function kp(){Gi&&(Gi.detachEvent("onpropertychange",k0),ms=Gi=null)}function k0(e){if(e.propertyName==="value"&&tl(ms)){var n=[];w0(n,ms,e,cd(e)),t0(bw,n)}}function Sw(e,n,t){e==="focusin"?(kp(),Gi=n,ms=t,Gi.attachEvent("onpropertychange",k0)):e==="focusout"&&kp()}function Cw(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return tl(ms)}function Pw(e,n){if(e==="click")return tl(n)}function jw(e,n){if(e==="input"||e==="change")return tl(n)}function Tw(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var Rn=typeof Object.is=="function"?Object.is:Tw;function gs(e,n){if(Rn(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var t=Object.keys(e),r=Object.keys(n);if(t.length!==r.length)return!1;for(r=0;r<t.length;r++){var i=t[r];if(!Tu.call(n,i)||!Rn(e[i],n[i]))return!1}return!0}function Sp(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Cp(e,n){var t=Sp(e);e=0;for(var r;t;){if(t.nodeType===3){if(r=e+t.textContent.length,e<=n&&r>=n)return{node:t,offset:n-e};e=r}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Sp(t)}}function S0(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?S0(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function C0(){for(var e=window,n=ra();n instanceof e.HTMLIFrameElement;){try{var t=typeof n.contentWindow.location.href=="string"}catch{t=!1}if(t)e=n.contentWindow;else break;n=ra(e.document)}return n}function xd(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}function zw(e){var n=C0(),t=e.focusedElem,r=e.selectionRange;if(n!==t&&t&&t.ownerDocument&&S0(t.ownerDocument.documentElement,t)){if(r!==null&&xd(t)){if(n=r.start,e=r.end,e===void 0&&(e=n),"selectionStart"in t)t.selectionStart=n,t.selectionEnd=Math.min(e,t.value.length);else if(e=(n=t.ownerDocument||document)&&n.defaultView||window,e.getSelection){e=e.getSelection();var i=t.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!e.extend&&s>r&&(i=r,r=s,s=i),i=Cp(t,s);var o=Cp(t,r);i&&o&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(n=n.createRange(),n.setStart(i.node,i.offset),e.removeAllRanges(),s>r?(e.addRange(n),e.extend(o.node,o.offset)):(n.setEnd(o.node,o.offset),e.addRange(n)))}}for(n=[],e=t;e=e.parentNode;)e.nodeType===1&&n.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<n.length;t++)e=n[t],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Ew=rt&&"documentMode"in document&&11>=document.documentMode,Er=null,Ku=null,Xi=null,Yu=!1;function Pp(e,n,t){var r=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;Yu||Er==null||Er!==ra(r)||(r=Er,"selectionStart"in r&&xd(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Xi&&gs(Xi,r)||(Xi=r,r=ca(Ku,"onSelect"),0<r.length&&(n=new gd("onSelect","select",null,n,t),e.push({event:n,listeners:r}),n.target=Er)))}function mo(e,n){var t={};return t[e.toLowerCase()]=n.toLowerCase(),t["Webkit"+e]="webkit"+n,t["Moz"+e]="moz"+n,t}var Ar={animationend:mo("Animation","AnimationEnd"),animationiteration:mo("Animation","AnimationIteration"),animationstart:mo("Animation","AnimationStart"),transitionend:mo("Transition","TransitionEnd")},Bl={},P0={};rt&&(P0=document.createElement("div").style,"AnimationEvent"in window||(delete Ar.animationend.animation,delete Ar.animationiteration.animation,delete Ar.animationstart.animation),"TransitionEvent"in window||delete Ar.transitionend.transition);function rl(e){if(Bl[e])return Bl[e];if(!Ar[e])return e;var n=Ar[e],t;for(t in n)if(n.hasOwnProperty(t)&&t in P0)return Bl[e]=n[t];return e}var j0=rl("animationend"),T0=rl("animationiteration"),z0=rl("animationstart"),E0=rl("transitionend"),A0=new Map,jp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function qt(e,n){A0.set(e,n),vr(n,[e])}for(var Ul=0;Ul<jp.length;Ul++){var Hl=jp[Ul],Aw=Hl.toLowerCase(),Mw=Hl[0].toUpperCase()+Hl.slice(1);qt(Aw,"on"+Mw)}qt(j0,"onAnimationEnd");qt(T0,"onAnimationIteration");qt(z0,"onAnimationStart");qt("dblclick","onDoubleClick");qt("focusin","onFocus");qt("focusout","onBlur");qt(E0,"onTransitionEnd");ni("onMouseEnter",["mouseout","mouseover"]);ni("onMouseLeave",["mouseout","mouseover"]);ni("onPointerEnter",["pointerout","pointerover"]);ni("onPointerLeave",["pointerout","pointerover"]);vr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));vr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));vr("onBeforeInput",["compositionend","keypress","textInput","paste"]);vr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));vr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));vr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Fi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Rw=new Set("cancel close invalid load scroll toggle".split(" ").concat(Fi));function Tp(e,n,t){var r=e.type||"unknown-event";e.currentTarget=t,A_(r,n,void 0,e),e.currentTarget=null}function M0(e,n){n=(n&4)!==0;for(var t=0;t<e.length;t++){var r=e[t],i=r.event;r=r.listeners;e:{var s=void 0;if(n)for(var o=r.length-1;0<=o;o--){var a=r[o],l=a.instance,u=a.currentTarget;if(a=a.listener,l!==s&&i.isPropagationStopped())break e;Tp(i,a,u),s=l}else for(o=0;o<r.length;o++){if(a=r[o],l=a.instance,u=a.currentTarget,a=a.listener,l!==s&&i.isPropagationStopped())break e;Tp(i,a,u),s=l}}}if(sa)throw e=Bu,sa=!1,Bu=null,e}function ae(e,n){var t=n[Ju];t===void 0&&(t=n[Ju]=new Set);var r=e+"__bubble";t.has(r)||(R0(n,e,2,!1),t.add(r))}function Wl(e,n,t){var r=0;n&&(r|=4),R0(t,e,r,n)}var go="_reactListening"+Math.random().toString(36).slice(2);function vs(e){if(!e[go]){e[go]=!0,Vg.forEach(function(t){t!=="selectionchange"&&(Rw.has(t)||Wl(t,!1,e),Wl(t,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[go]||(n[go]=!0,Wl("selectionchange",!1,n))}}function R0(e,n,t,r){switch(g0(n)){case 1:var i=K_;break;case 4:i=Y_;break;default:i=hd}t=i.bind(null,n,t,e),i=void 0,!Ou||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(i=!0),r?i!==void 0?e.addEventListener(n,t,{capture:!0,passive:i}):e.addEventListener(n,t,!0):i!==void 0?e.addEventListener(n,t,{passive:i}):e.addEventListener(n,t,!1)}function Kl(e,n,t,r,i){var s=r;if(!(n&1)&&!(n&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var a=r.stateNode.containerInfo;if(a===i||a.nodeType===8&&a.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===i||l.nodeType===8&&l.parentNode===i))return;o=o.return}for(;a!==null;){if(o=Zt(a),o===null)return;if(l=o.tag,l===5||l===6){r=s=o;continue e}a=a.parentNode}}r=r.return}t0(function(){var u=s,c=cd(t),d=[];e:{var f=A0.get(e);if(f!==void 0){var p=gd,v=e;switch(e){case"keypress":if(Vo(t)===0)break e;case"keydown":case"keyup":p=uw;break;case"focusin":v="focus",p=Vl;break;case"focusout":v="blur",p=Vl;break;case"beforeblur":case"afterblur":p=Vl;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=gp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Q_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=fw;break;case j0:case T0:case z0:p=ew;break;case E0:p=hw;break;case"scroll":p=G_;break;case"wheel":p=gw;break;case"copy":case"cut":case"paste":p=tw;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=yp}var g=(n&4)!==0,_=!g&&e==="scroll",h=g?f!==null?f+"Capture":null:f;g=[];for(var m=u,y;m!==null;){y=m;var x=y.stateNode;if(y.tag===5&&x!==null&&(y=x,h!==null&&(x=ds(m,h),x!=null&&g.push(ys(m,x,y)))),_)break;m=m.return}0<g.length&&(f=new p(f,v,null,t,c),d.push({event:f,listeners:g}))}}if(!(n&7)){e:{if(f=e==="mouseover"||e==="pointerover",p=e==="mouseout"||e==="pointerout",f&&t!==Vu&&(v=t.relatedTarget||t.fromElement)&&(Zt(v)||v[it]))break e;if((p||f)&&(f=c.window===c?c:(f=c.ownerDocument)?f.defaultView||f.parentWindow:window,p?(v=t.relatedTarget||t.toElement,p=u,v=v?Zt(v):null,v!==null&&(_=yr(v),v!==_||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=u),p!==v)){if(g=gp,x="onMouseLeave",h="onMouseEnter",m="mouse",(e==="pointerout"||e==="pointerover")&&(g=yp,x="onPointerLeave",h="onPointerEnter",m="pointer"),_=p==null?f:Mr(p),y=v==null?f:Mr(v),f=new g(x,m+"leave",p,t,c),f.target=_,f.relatedTarget=y,x=null,Zt(c)===u&&(g=new g(h,m+"enter",v,t,c),g.target=y,g.relatedTarget=_,x=g),_=x,p&&v)n:{for(g=p,h=v,m=0,y=g;y;y=Sr(y))m++;for(y=0,x=h;x;x=Sr(x))y++;for(;0<m-y;)g=Sr(g),m--;for(;0<y-m;)h=Sr(h),y--;for(;m--;){if(g===h||h!==null&&g===h.alternate)break n;g=Sr(g),h=Sr(h)}g=null}else g=null;p!==null&&zp(d,f,p,g,!1),v!==null&&_!==null&&zp(d,_,v,g,!0)}}e:{if(f=u?Mr(u):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var k=kw;else if(wp(f))if(b0)k=jw;else{k=Cw;var C=Sw}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(k=Pw);if(k&&(k=k(e,u))){w0(d,k,t,c);break e}C&&C(e,f,u),e==="focusout"&&(C=f._wrapperState)&&C.controlled&&f.type==="number"&&Lu(f,"number",f.value)}switch(C=u?Mr(u):window,e){case"focusin":(wp(C)||C.contentEditable==="true")&&(Er=C,Ku=u,Xi=null);break;case"focusout":Xi=Ku=Er=null;break;case"mousedown":Yu=!0;break;case"contextmenu":case"mouseup":case"dragend":Yu=!1,Pp(d,t,c);break;case"selectionchange":if(Ew)break;case"keydown":case"keyup":Pp(d,t,c)}var T;if(yd)e:{switch(e){case"compositionstart":var j="onCompositionStart";break e;case"compositionend":j="onCompositionEnd";break e;case"compositionupdate":j="onCompositionUpdate";break e}j=void 0}else zr?x0(e,t)&&(j="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(j="onCompositionStart");j&&(y0&&t.locale!=="ko"&&(zr||j!=="onCompositionStart"?j==="onCompositionEnd"&&zr&&(T=v0()):(_t=c,md="value"in _t?_t.value:_t.textContent,zr=!0)),C=ca(u,j),0<C.length&&(j=new vp(j,e,null,t,c),d.push({event:j,listeners:C}),T?j.data=T:(T=_0(t),T!==null&&(j.data=T)))),(T=yw?xw(e,t):_w(e,t))&&(u=ca(u,"onBeforeInput"),0<u.length&&(c=new vp("onBeforeInput","beforeinput",null,t,c),d.push({event:c,listeners:u}),c.data=T))}M0(d,n)})}function ys(e,n,t){return{instance:e,listener:n,currentTarget:t}}function ca(e,n){for(var t=n+"Capture",r=[];e!==null;){var i=e,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=ds(e,t),s!=null&&r.unshift(ys(e,s,i)),s=ds(e,n),s!=null&&r.push(ys(e,s,i))),e=e.return}return r}function Sr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function zp(e,n,t,r,i){for(var s=n._reactName,o=[];t!==null&&t!==r;){var a=t,l=a.alternate,u=a.stateNode;if(l!==null&&l===r)break;a.tag===5&&u!==null&&(a=u,i?(l=ds(t,s),l!=null&&o.unshift(ys(t,l,a))):i||(l=ds(t,s),l!=null&&o.push(ys(t,l,a)))),t=t.return}o.length!==0&&e.push({event:n,listeners:o})}var Nw=/\r\n?/g,Lw=/\u0000|\uFFFD/g;function Ep(e){return(typeof e=="string"?e:""+e).replace(Nw,`
`).replace(Lw,"")}function vo(e,n,t){if(n=Ep(n),Ep(e)!==n&&t)throw Error(D(425))}function da(){}var Gu=null,Xu=null;function Qu(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Zu=typeof setTimeout=="function"?setTimeout:void 0,Dw=typeof clearTimeout=="function"?clearTimeout:void 0,Ap=typeof Promise=="function"?Promise:void 0,Iw=typeof queueMicrotask=="function"?queueMicrotask:typeof Ap<"u"?function(e){return Ap.resolve(null).then(e).catch(Fw)}:Zu;function Fw(e){setTimeout(function(){throw e})}function Yl(e,n){var t=n,r=0;do{var i=t.nextSibling;if(e.removeChild(t),i&&i.nodeType===8)if(t=i.data,t==="/$"){if(r===0){e.removeChild(i),hs(n);return}r--}else t!=="$"&&t!=="$?"&&t!=="$!"||r++;t=i}while(t);hs(n)}function jt(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?")break;if(n==="/$")return null}}return e}function Mp(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"){if(n===0)return e;n--}else t==="/$"&&n++}e=e.previousSibling}return null}var yi=Math.random().toString(36).slice(2),In="__reactFiber$"+yi,xs="__reactProps$"+yi,it="__reactContainer$"+yi,Ju="__reactEvents$"+yi,qw="__reactListeners$"+yi,Vw="__reactHandles$"+yi;function Zt(e){var n=e[In];if(n)return n;for(var t=e.parentNode;t;){if(n=t[it]||t[In]){if(t=n.alternate,n.child!==null||t!==null&&t.child!==null)for(e=Mp(e);e!==null;){if(t=e[In])return t;e=Mp(e)}return n}e=t,t=e.parentNode}return null}function $s(e){return e=e[In]||e[it],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Mr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(D(33))}function il(e){return e[xs]||null}var ec=[],Rr=-1;function Vt(e){return{current:e}}function le(e){0>Rr||(e.current=ec[Rr],ec[Rr]=null,Rr--)}function se(e,n){Rr++,ec[Rr]=e.current,e.current=n}var Lt={},qe=Vt(Lt),Je=Vt(!1),ur=Lt;function ti(e,n){var t=e.type.contextTypes;if(!t)return Lt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===n)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in t)i[s]=n[s];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=n,e.__reactInternalMemoizedMaskedChildContext=i),i}function en(e){return e=e.childContextTypes,e!=null}function fa(){le(Je),le(qe)}function Rp(e,n,t){if(qe.current!==Lt)throw Error(D(168));se(qe,n),se(Je,t)}function N0(e,n,t){var r=e.stateNode;if(n=n.childContextTypes,typeof r.getChildContext!="function")return t;r=r.getChildContext();for(var i in r)if(!(i in n))throw Error(D(108,S_(e)||"Unknown",i));return he({},t,r)}function pa(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Lt,ur=qe.current,se(qe,e),se(Je,Je.current),!0}function Np(e,n,t){var r=e.stateNode;if(!r)throw Error(D(169));t?(e=N0(e,n,ur),r.__reactInternalMemoizedMergedChildContext=e,le(Je),le(qe),se(qe,e)):le(Je),se(Je,t)}var Gn=null,sl=!1,Gl=!1;function L0(e){Gn===null?Gn=[e]:Gn.push(e)}function $w(e){sl=!0,L0(e)}function $t(){if(!Gl&&Gn!==null){Gl=!0;var e=0,n=ne;try{var t=Gn;for(ne=1;e<t.length;e++){var r=t[e];do r=r(!0);while(r!==null)}Gn=null,sl=!1}catch(i){throw Gn!==null&&(Gn=Gn.slice(e+1)),o0(dd,$t),i}finally{ne=n,Gl=!1}}return null}var Nr=[],Lr=0,ha=null,ma=0,mn=[],gn=0,cr=null,Qn=1,Zn="";function Yt(e,n){Nr[Lr++]=ma,Nr[Lr++]=ha,ha=e,ma=n}function D0(e,n,t){mn[gn++]=Qn,mn[gn++]=Zn,mn[gn++]=cr,cr=e;var r=Qn;e=Zn;var i=32-An(r)-1;r&=~(1<<i),t+=1;var s=32-An(n)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Qn=1<<32-An(n)+i|t<<i|r,Zn=s+e}else Qn=1<<s|t<<i|r,Zn=e}function _d(e){e.return!==null&&(Yt(e,1),D0(e,1,0))}function wd(e){for(;e===ha;)ha=Nr[--Lr],Nr[Lr]=null,ma=Nr[--Lr],Nr[Lr]=null;for(;e===cr;)cr=mn[--gn],mn[gn]=null,Zn=mn[--gn],mn[gn]=null,Qn=mn[--gn],mn[gn]=null}var on=null,sn=null,ce=!1,jn=null;function I0(e,n){var t=vn(5,null,null,0);t.elementType="DELETED",t.stateNode=n,t.return=e,n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)}function Lp(e,n){switch(e.tag){case 5:var t=e.type;return n=n.nodeType!==1||t.toLowerCase()!==n.nodeName.toLowerCase()?null:n,n!==null?(e.stateNode=n,on=e,sn=jt(n.firstChild),!0):!1;case 6:return n=e.pendingProps===""||n.nodeType!==3?null:n,n!==null?(e.stateNode=n,on=e,sn=null,!0):!1;case 13:return n=n.nodeType!==8?null:n,n!==null?(t=cr!==null?{id:Qn,overflow:Zn}:null,e.memoizedState={dehydrated:n,treeContext:t,retryLane:1073741824},t=vn(18,null,null,0),t.stateNode=n,t.return=e,e.child=t,on=e,sn=null,!0):!1;default:return!1}}function nc(e){return(e.mode&1)!==0&&(e.flags&128)===0}function tc(e){if(ce){var n=sn;if(n){var t=n;if(!Lp(e,n)){if(nc(e))throw Error(D(418));n=jt(t.nextSibling);var r=on;n&&Lp(e,n)?I0(r,t):(e.flags=e.flags&-4097|2,ce=!1,on=e)}}else{if(nc(e))throw Error(D(418));e.flags=e.flags&-4097|2,ce=!1,on=e}}}function Dp(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;on=e}function yo(e){if(e!==on)return!1;if(!ce)return Dp(e),ce=!0,!1;var n;if((n=e.tag!==3)&&!(n=e.tag!==5)&&(n=e.type,n=n!=="head"&&n!=="body"&&!Qu(e.type,e.memoizedProps)),n&&(n=sn)){if(nc(e))throw F0(),Error(D(418));for(;n;)I0(e,n),n=jt(n.nextSibling)}if(Dp(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(D(317));e:{for(e=e.nextSibling,n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"){if(n===0){sn=jt(e.nextSibling);break e}n--}else t!=="$"&&t!=="$!"&&t!=="$?"||n++}e=e.nextSibling}sn=null}}else sn=on?jt(e.stateNode.nextSibling):null;return!0}function F0(){for(var e=sn;e;)e=jt(e.nextSibling)}function ri(){sn=on=null,ce=!1}function bd(e){jn===null?jn=[e]:jn.push(e)}var Ow=ct.ReactCurrentBatchConfig;function Pi(e,n,t){if(e=t.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(D(309));var r=t.stateNode}if(!r)throw Error(D(147,e));var i=r,s=""+e;return n!==null&&n.ref!==null&&typeof n.ref=="function"&&n.ref._stringRef===s?n.ref:(n=function(o){var a=i.refs;o===null?delete a[s]:a[s]=o},n._stringRef=s,n)}if(typeof e!="string")throw Error(D(284));if(!t._owner)throw Error(D(290,e))}return e}function xo(e,n){throw e=Object.prototype.toString.call(n),Error(D(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e))}function Ip(e){var n=e._init;return n(e._payload)}function q0(e){function n(h,m){if(e){var y=h.deletions;y===null?(h.deletions=[m],h.flags|=16):y.push(m)}}function t(h,m){if(!e)return null;for(;m!==null;)n(h,m),m=m.sibling;return null}function r(h,m){for(h=new Map;m!==null;)m.key!==null?h.set(m.key,m):h.set(m.index,m),m=m.sibling;return h}function i(h,m){return h=At(h,m),h.index=0,h.sibling=null,h}function s(h,m,y){return h.index=y,e?(y=h.alternate,y!==null?(y=y.index,y<m?(h.flags|=2,m):y):(h.flags|=2,m)):(h.flags|=1048576,m)}function o(h){return e&&h.alternate===null&&(h.flags|=2),h}function a(h,m,y,x){return m===null||m.tag!==6?(m=tu(y,h.mode,x),m.return=h,m):(m=i(m,y),m.return=h,m)}function l(h,m,y,x){var k=y.type;return k===Tr?c(h,m,y.props.children,x,y.key):m!==null&&(m.elementType===k||typeof k=="object"&&k!==null&&k.$$typeof===gt&&Ip(k)===m.type)?(x=i(m,y.props),x.ref=Pi(h,m,y),x.return=h,x):(x=Ko(y.type,y.key,y.props,null,h.mode,x),x.ref=Pi(h,m,y),x.return=h,x)}function u(h,m,y,x){return m===null||m.tag!==4||m.stateNode.containerInfo!==y.containerInfo||m.stateNode.implementation!==y.implementation?(m=ru(y,h.mode,x),m.return=h,m):(m=i(m,y.children||[]),m.return=h,m)}function c(h,m,y,x,k){return m===null||m.tag!==7?(m=ir(y,h.mode,x,k),m.return=h,m):(m=i(m,y),m.return=h,m)}function d(h,m,y){if(typeof m=="string"&&m!==""||typeof m=="number")return m=tu(""+m,h.mode,y),m.return=h,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case ao:return y=Ko(m.type,m.key,m.props,null,h.mode,y),y.ref=Pi(h,null,m),y.return=h,y;case jr:return m=ru(m,h.mode,y),m.return=h,m;case gt:var x=m._init;return d(h,x(m._payload),y)}if(Di(m)||wi(m))return m=ir(m,h.mode,y,null),m.return=h,m;xo(h,m)}return null}function f(h,m,y,x){var k=m!==null?m.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return k!==null?null:a(h,m,""+y,x);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case ao:return y.key===k?l(h,m,y,x):null;case jr:return y.key===k?u(h,m,y,x):null;case gt:return k=y._init,f(h,m,k(y._payload),x)}if(Di(y)||wi(y))return k!==null?null:c(h,m,y,x,null);xo(h,y)}return null}function p(h,m,y,x,k){if(typeof x=="string"&&x!==""||typeof x=="number")return h=h.get(y)||null,a(m,h,""+x,k);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case ao:return h=h.get(x.key===null?y:x.key)||null,l(m,h,x,k);case jr:return h=h.get(x.key===null?y:x.key)||null,u(m,h,x,k);case gt:var C=x._init;return p(h,m,y,C(x._payload),k)}if(Di(x)||wi(x))return h=h.get(y)||null,c(m,h,x,k,null);xo(m,x)}return null}function v(h,m,y,x){for(var k=null,C=null,T=m,j=m=0,F=null;T!==null&&j<y.length;j++){T.index>j?(F=T,T=null):F=T.sibling;var I=f(h,T,y[j],x);if(I===null){T===null&&(T=F);break}e&&T&&I.alternate===null&&n(h,T),m=s(I,m,j),C===null?k=I:C.sibling=I,C=I,T=F}if(j===y.length)return t(h,T),ce&&Yt(h,j),k;if(T===null){for(;j<y.length;j++)T=d(h,y[j],x),T!==null&&(m=s(T,m,j),C===null?k=T:C.sibling=T,C=T);return ce&&Yt(h,j),k}for(T=r(h,T);j<y.length;j++)F=p(T,h,j,y[j],x),F!==null&&(e&&F.alternate!==null&&T.delete(F.key===null?j:F.key),m=s(F,m,j),C===null?k=F:C.sibling=F,C=F);return e&&T.forEach(function(O){return n(h,O)}),ce&&Yt(h,j),k}function g(h,m,y,x){var k=wi(y);if(typeof k!="function")throw Error(D(150));if(y=k.call(y),y==null)throw Error(D(151));for(var C=k=null,T=m,j=m=0,F=null,I=y.next();T!==null&&!I.done;j++,I=y.next()){T.index>j?(F=T,T=null):F=T.sibling;var O=f(h,T,I.value,x);if(O===null){T===null&&(T=F);break}e&&T&&O.alternate===null&&n(h,T),m=s(O,m,j),C===null?k=O:C.sibling=O,C=O,T=F}if(I.done)return t(h,T),ce&&Yt(h,j),k;if(T===null){for(;!I.done;j++,I=y.next())I=d(h,I.value,x),I!==null&&(m=s(I,m,j),C===null?k=I:C.sibling=I,C=I);return ce&&Yt(h,j),k}for(T=r(h,T);!I.done;j++,I=y.next())I=p(T,h,j,I.value,x),I!==null&&(e&&I.alternate!==null&&T.delete(I.key===null?j:I.key),m=s(I,m,j),C===null?k=I:C.sibling=I,C=I);return e&&T.forEach(function($){return n(h,$)}),ce&&Yt(h,j),k}function _(h,m,y,x){if(typeof y=="object"&&y!==null&&y.type===Tr&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case ao:e:{for(var k=y.key,C=m;C!==null;){if(C.key===k){if(k=y.type,k===Tr){if(C.tag===7){t(h,C.sibling),m=i(C,y.props.children),m.return=h,h=m;break e}}else if(C.elementType===k||typeof k=="object"&&k!==null&&k.$$typeof===gt&&Ip(k)===C.type){t(h,C.sibling),m=i(C,y.props),m.ref=Pi(h,C,y),m.return=h,h=m;break e}t(h,C);break}else n(h,C);C=C.sibling}y.type===Tr?(m=ir(y.props.children,h.mode,x,y.key),m.return=h,h=m):(x=Ko(y.type,y.key,y.props,null,h.mode,x),x.ref=Pi(h,m,y),x.return=h,h=x)}return o(h);case jr:e:{for(C=y.key;m!==null;){if(m.key===C)if(m.tag===4&&m.stateNode.containerInfo===y.containerInfo&&m.stateNode.implementation===y.implementation){t(h,m.sibling),m=i(m,y.children||[]),m.return=h,h=m;break e}else{t(h,m);break}else n(h,m);m=m.sibling}m=ru(y,h.mode,x),m.return=h,h=m}return o(h);case gt:return C=y._init,_(h,m,C(y._payload),x)}if(Di(y))return v(h,m,y,x);if(wi(y))return g(h,m,y,x);xo(h,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,m!==null&&m.tag===6?(t(h,m.sibling),m=i(m,y),m.return=h,h=m):(t(h,m),m=tu(y,h.mode,x),m.return=h,h=m),o(h)):t(h,m)}return _}var ii=q0(!0),V0=q0(!1),ga=Vt(null),va=null,Dr=null,kd=null;function Sd(){kd=Dr=va=null}function Cd(e){var n=ga.current;le(ga),e._currentValue=n}function rc(e,n,t){for(;e!==null;){var r=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),e===t)break;e=e.return}}function Qr(e,n){va=e,kd=Dr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&n&&(Xe=!0),e.firstContext=null)}function wn(e){var n=e._currentValue;if(kd!==e)if(e={context:e,memoizedValue:n,next:null},Dr===null){if(va===null)throw Error(D(308));Dr=e,va.dependencies={lanes:0,firstContext:e}}else Dr=Dr.next=e;return n}var Jt=null;function Pd(e){Jt===null?Jt=[e]:Jt.push(e)}function $0(e,n,t,r){var i=n.interleaved;return i===null?(t.next=t,Pd(n)):(t.next=i.next,i.next=t),n.interleaved=t,st(e,r)}function st(e,n){e.lanes|=n;var t=e.alternate;for(t!==null&&(t.lanes|=n),t=e,e=e.return;e!==null;)e.childLanes|=n,t=e.alternate,t!==null&&(t.childLanes|=n),t=e,e=e.return;return t.tag===3?t.stateNode:null}var vt=!1;function jd(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function O0(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function et(e,n){return{eventTime:e,lane:n,tag:0,payload:null,callback:null,next:null}}function Tt(e,n,t){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,J&2){var i=r.pending;return i===null?n.next=n:(n.next=i.next,i.next=n),r.pending=n,st(e,t)}return i=r.interleaved,i===null?(n.next=n,Pd(r)):(n.next=i.next,i.next=n),r.interleaved=n,st(e,t)}function $o(e,n,t){if(n=n.updateQueue,n!==null&&(n=n.shared,(t&4194240)!==0)){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,fd(e,t)}}function Fp(e,n){var t=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,t===r)){var i=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?i=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?i=s=n:s=s.next=n}else i=s=n;t={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=n:e.next=n,t.lastBaseUpdate=n}function ya(e,n,t,r){var i=e.updateQueue;vt=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,a=i.shared.pending;if(a!==null){i.shared.pending=null;var l=a,u=l.next;l.next=null,o===null?s=u:o.next=u,o=l;var c=e.alternate;c!==null&&(c=c.updateQueue,a=c.lastBaseUpdate,a!==o&&(a===null?c.firstBaseUpdate=u:a.next=u,c.lastBaseUpdate=l))}if(s!==null){var d=i.baseState;o=0,c=u=l=null,a=s;do{var f=a.lane,p=a.eventTime;if((r&f)===f){c!==null&&(c=c.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=e,g=a;switch(f=n,p=t,g.tag){case 1:if(v=g.payload,typeof v=="function"){d=v.call(p,d,f);break e}d=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=g.payload,f=typeof v=="function"?v.call(p,d,f):v,f==null)break e;d=he({},d,f);break e;case 2:vt=!0}}a.callback!==null&&a.lane!==0&&(e.flags|=64,f=i.effects,f===null?i.effects=[a]:f.push(a))}else p={eventTime:p,lane:f,tag:a.tag,payload:a.payload,callback:a.callback,next:null},c===null?(u=c=p,l=d):c=c.next=p,o|=f;if(a=a.next,a===null){if(a=i.shared.pending,a===null)break;f=a,a=f.next,f.next=null,i.lastBaseUpdate=f,i.shared.pending=null}}while(!0);if(c===null&&(l=d),i.baseState=l,i.firstBaseUpdate=u,i.lastBaseUpdate=c,n=i.shared.interleaved,n!==null){i=n;do o|=i.lane,i=i.next;while(i!==n)}else s===null&&(i.shared.lanes=0);fr|=o,e.lanes=o,e.memoizedState=d}}function qp(e,n,t){if(e=n.effects,n.effects=null,e!==null)for(n=0;n<e.length;n++){var r=e[n],i=r.callback;if(i!==null){if(r.callback=null,r=t,typeof i!="function")throw Error(D(191,i));i.call(r)}}}var Os={},Vn=Vt(Os),_s=Vt(Os),ws=Vt(Os);function er(e){if(e===Os)throw Error(D(174));return e}function Td(e,n){switch(se(ws,n),se(_s,e),se(Vn,Os),e=n.nodeType,e){case 9:case 11:n=(n=n.documentElement)?n.namespaceURI:Iu(null,"");break;default:e=e===8?n.parentNode:n,n=e.namespaceURI||null,e=e.tagName,n=Iu(n,e)}le(Vn),se(Vn,n)}function si(){le(Vn),le(_s),le(ws)}function B0(e){er(ws.current);var n=er(Vn.current),t=Iu(n,e.type);n!==t&&(se(_s,e),se(Vn,t))}function zd(e){_s.current===e&&(le(Vn),le(_s))}var de=Vt(0);function xa(e){for(var n=e;n!==null;){if(n.tag===13){var t=n.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if(n.flags&128)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Xl=[];function Ed(){for(var e=0;e<Xl.length;e++)Xl[e]._workInProgressVersionPrimary=null;Xl.length=0}var Oo=ct.ReactCurrentDispatcher,Ql=ct.ReactCurrentBatchConfig,dr=0,pe=null,ke=null,Ce=null,_a=!1,Qi=!1,bs=0,Bw=0;function Me(){throw Error(D(321))}function Ad(e,n){if(n===null)return!1;for(var t=0;t<n.length&&t<e.length;t++)if(!Rn(e[t],n[t]))return!1;return!0}function Md(e,n,t,r,i,s){if(dr=s,pe=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,Oo.current=e===null||e.memoizedState===null?Kw:Yw,e=t(r,i),Qi){s=0;do{if(Qi=!1,bs=0,25<=s)throw Error(D(301));s+=1,Ce=ke=null,n.updateQueue=null,Oo.current=Gw,e=t(r,i)}while(Qi)}if(Oo.current=wa,n=ke!==null&&ke.next!==null,dr=0,Ce=ke=pe=null,_a=!1,n)throw Error(D(300));return e}function Rd(){var e=bs!==0;return bs=0,e}function Dn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ce===null?pe.memoizedState=Ce=e:Ce=Ce.next=e,Ce}function bn(){if(ke===null){var e=pe.alternate;e=e!==null?e.memoizedState:null}else e=ke.next;var n=Ce===null?pe.memoizedState:Ce.next;if(n!==null)Ce=n,ke=e;else{if(e===null)throw Error(D(310));ke=e,e={memoizedState:ke.memoizedState,baseState:ke.baseState,baseQueue:ke.baseQueue,queue:ke.queue,next:null},Ce===null?pe.memoizedState=Ce=e:Ce=Ce.next=e}return Ce}function ks(e,n){return typeof n=="function"?n(e):n}function Zl(e){var n=bn(),t=n.queue;if(t===null)throw Error(D(311));t.lastRenderedReducer=e;var r=ke,i=r.baseQueue,s=t.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,t.pending=null}if(i!==null){s=i.next,r=r.baseState;var a=o=null,l=null,u=s;do{var c=u.lane;if((dr&c)===c)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),r=u.hasEagerState?u.eagerState:e(r,u.action);else{var d={lane:c,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(a=l=d,o=r):l=l.next=d,pe.lanes|=c,fr|=c}u=u.next}while(u!==null&&u!==s);l===null?o=r:l.next=a,Rn(r,n.memoizedState)||(Xe=!0),n.memoizedState=r,n.baseState=o,n.baseQueue=l,t.lastRenderedState=r}if(e=t.interleaved,e!==null){i=e;do s=i.lane,pe.lanes|=s,fr|=s,i=i.next;while(i!==e)}else i===null&&(t.lanes=0);return[n.memoizedState,t.dispatch]}function Jl(e){var n=bn(),t=n.queue;if(t===null)throw Error(D(311));t.lastRenderedReducer=e;var r=t.dispatch,i=t.pending,s=n.memoizedState;if(i!==null){t.pending=null;var o=i=i.next;do s=e(s,o.action),o=o.next;while(o!==i);Rn(s,n.memoizedState)||(Xe=!0),n.memoizedState=s,n.baseQueue===null&&(n.baseState=s),t.lastRenderedState=s}return[s,r]}function U0(){}function H0(e,n){var t=pe,r=bn(),i=n(),s=!Rn(r.memoizedState,i);if(s&&(r.memoizedState=i,Xe=!0),r=r.queue,Nd(Y0.bind(null,t,r,e),[e]),r.getSnapshot!==n||s||Ce!==null&&Ce.memoizedState.tag&1){if(t.flags|=2048,Ss(9,K0.bind(null,t,r,i,n),void 0,null),Pe===null)throw Error(D(349));dr&30||W0(t,n,i)}return i}function W0(e,n,t){e.flags|=16384,e={getSnapshot:n,value:t},n=pe.updateQueue,n===null?(n={lastEffect:null,stores:null},pe.updateQueue=n,n.stores=[e]):(t=n.stores,t===null?n.stores=[e]:t.push(e))}function K0(e,n,t,r){n.value=t,n.getSnapshot=r,G0(n)&&X0(e)}function Y0(e,n,t){return t(function(){G0(n)&&X0(e)})}function G0(e){var n=e.getSnapshot;e=e.value;try{var t=n();return!Rn(e,t)}catch{return!0}}function X0(e){var n=st(e,1);n!==null&&Mn(n,e,1,-1)}function Vp(e){var n=Dn();return typeof e=="function"&&(e=e()),n.memoizedState=n.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ks,lastRenderedState:e},n.queue=e,e=e.dispatch=Ww.bind(null,pe,e),[n.memoizedState,e]}function Ss(e,n,t,r){return e={tag:e,create:n,destroy:t,deps:r,next:null},n=pe.updateQueue,n===null?(n={lastEffect:null,stores:null},pe.updateQueue=n,n.lastEffect=e.next=e):(t=n.lastEffect,t===null?n.lastEffect=e.next=e:(r=t.next,t.next=e,e.next=r,n.lastEffect=e)),e}function Q0(){return bn().memoizedState}function Bo(e,n,t,r){var i=Dn();pe.flags|=e,i.memoizedState=Ss(1|n,t,void 0,r===void 0?null:r)}function ol(e,n,t,r){var i=bn();r=r===void 0?null:r;var s=void 0;if(ke!==null){var o=ke.memoizedState;if(s=o.destroy,r!==null&&Ad(r,o.deps)){i.memoizedState=Ss(n,t,s,r);return}}pe.flags|=e,i.memoizedState=Ss(1|n,t,s,r)}function $p(e,n){return Bo(8390656,8,e,n)}function Nd(e,n){return ol(2048,8,e,n)}function Z0(e,n){return ol(4,2,e,n)}function J0(e,n){return ol(4,4,e,n)}function ev(e,n){if(typeof n=="function")return e=e(),n(e),function(){n(null)};if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function nv(e,n,t){return t=t!=null?t.concat([e]):null,ol(4,4,ev.bind(null,n,e),t)}function Ld(){}function tv(e,n){var t=bn();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&Ad(n,r[1])?r[0]:(t.memoizedState=[e,n],e)}function rv(e,n){var t=bn();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&Ad(n,r[1])?r[0]:(e=e(),t.memoizedState=[e,n],e)}function iv(e,n,t){return dr&21?(Rn(t,n)||(t=u0(),pe.lanes|=t,fr|=t,e.baseState=!0),n):(e.baseState&&(e.baseState=!1,Xe=!0),e.memoizedState=t)}function Uw(e,n){var t=ne;ne=t!==0&&4>t?t:4,e(!0);var r=Ql.transition;Ql.transition={};try{e(!1),n()}finally{ne=t,Ql.transition=r}}function sv(){return bn().memoizedState}function Hw(e,n,t){var r=Et(e);if(t={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null},ov(e))av(n,t);else if(t=$0(e,n,t,r),t!==null){var i=Ue();Mn(t,e,r,i),lv(t,n,r)}}function Ww(e,n,t){var r=Et(e),i={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null};if(ov(e))av(n,i);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=n.lastRenderedReducer,s!==null))try{var o=n.lastRenderedState,a=s(o,t);if(i.hasEagerState=!0,i.eagerState=a,Rn(a,o)){var l=n.interleaved;l===null?(i.next=i,Pd(n)):(i.next=l.next,l.next=i),n.interleaved=i;return}}catch{}finally{}t=$0(e,n,i,r),t!==null&&(i=Ue(),Mn(t,e,r,i),lv(t,n,r))}}function ov(e){var n=e.alternate;return e===pe||n!==null&&n===pe}function av(e,n){Qi=_a=!0;var t=e.pending;t===null?n.next=n:(n.next=t.next,t.next=n),e.pending=n}function lv(e,n,t){if(t&4194240){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,fd(e,t)}}var wa={readContext:wn,useCallback:Me,useContext:Me,useEffect:Me,useImperativeHandle:Me,useInsertionEffect:Me,useLayoutEffect:Me,useMemo:Me,useReducer:Me,useRef:Me,useState:Me,useDebugValue:Me,useDeferredValue:Me,useTransition:Me,useMutableSource:Me,useSyncExternalStore:Me,useId:Me,unstable_isNewReconciler:!1},Kw={readContext:wn,useCallback:function(e,n){return Dn().memoizedState=[e,n===void 0?null:n],e},useContext:wn,useEffect:$p,useImperativeHandle:function(e,n,t){return t=t!=null?t.concat([e]):null,Bo(4194308,4,ev.bind(null,n,e),t)},useLayoutEffect:function(e,n){return Bo(4194308,4,e,n)},useInsertionEffect:function(e,n){return Bo(4,2,e,n)},useMemo:function(e,n){var t=Dn();return n=n===void 0?null:n,e=e(),t.memoizedState=[e,n],e},useReducer:function(e,n,t){var r=Dn();return n=t!==void 0?t(n):n,r.memoizedState=r.baseState=n,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n},r.queue=e,e=e.dispatch=Hw.bind(null,pe,e),[r.memoizedState,e]},useRef:function(e){var n=Dn();return e={current:e},n.memoizedState=e},useState:Vp,useDebugValue:Ld,useDeferredValue:function(e){return Dn().memoizedState=e},useTransition:function(){var e=Vp(!1),n=e[0];return e=Uw.bind(null,e[1]),Dn().memoizedState=e,[n,e]},useMutableSource:function(){},useSyncExternalStore:function(e,n,t){var r=pe,i=Dn();if(ce){if(t===void 0)throw Error(D(407));t=t()}else{if(t=n(),Pe===null)throw Error(D(349));dr&30||W0(r,n,t)}i.memoizedState=t;var s={value:t,getSnapshot:n};return i.queue=s,$p(Y0.bind(null,r,s,e),[e]),r.flags|=2048,Ss(9,K0.bind(null,r,s,t,n),void 0,null),t},useId:function(){var e=Dn(),n=Pe.identifierPrefix;if(ce){var t=Zn,r=Qn;t=(r&~(1<<32-An(r)-1)).toString(32)+t,n=":"+n+"R"+t,t=bs++,0<t&&(n+="H"+t.toString(32)),n+=":"}else t=Bw++,n=":"+n+"r"+t.toString(32)+":";return e.memoizedState=n},unstable_isNewReconciler:!1},Yw={readContext:wn,useCallback:tv,useContext:wn,useEffect:Nd,useImperativeHandle:nv,useInsertionEffect:Z0,useLayoutEffect:J0,useMemo:rv,useReducer:Zl,useRef:Q0,useState:function(){return Zl(ks)},useDebugValue:Ld,useDeferredValue:function(e){var n=bn();return iv(n,ke.memoizedState,e)},useTransition:function(){var e=Zl(ks)[0],n=bn().memoizedState;return[e,n]},useMutableSource:U0,useSyncExternalStore:H0,useId:sv,unstable_isNewReconciler:!1},Gw={readContext:wn,useCallback:tv,useContext:wn,useEffect:Nd,useImperativeHandle:nv,useInsertionEffect:Z0,useLayoutEffect:J0,useMemo:rv,useReducer:Jl,useRef:Q0,useState:function(){return Jl(ks)},useDebugValue:Ld,useDeferredValue:function(e){var n=bn();return ke===null?n.memoizedState=e:iv(n,ke.memoizedState,e)},useTransition:function(){var e=Jl(ks)[0],n=bn().memoizedState;return[e,n]},useMutableSource:U0,useSyncExternalStore:H0,useId:sv,unstable_isNewReconciler:!1};function Cn(e,n){if(e&&e.defaultProps){n=he({},n),e=e.defaultProps;for(var t in e)n[t]===void 0&&(n[t]=e[t]);return n}return n}function ic(e,n,t,r){n=e.memoizedState,t=t(r,n),t=t==null?n:he({},n,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var al={isMounted:function(e){return(e=e._reactInternals)?yr(e)===e:!1},enqueueSetState:function(e,n,t){e=e._reactInternals;var r=Ue(),i=Et(e),s=et(r,i);s.payload=n,t!=null&&(s.callback=t),n=Tt(e,s,i),n!==null&&(Mn(n,e,i,r),$o(n,e,i))},enqueueReplaceState:function(e,n,t){e=e._reactInternals;var r=Ue(),i=Et(e),s=et(r,i);s.tag=1,s.payload=n,t!=null&&(s.callback=t),n=Tt(e,s,i),n!==null&&(Mn(n,e,i,r),$o(n,e,i))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var t=Ue(),r=Et(e),i=et(t,r);i.tag=2,n!=null&&(i.callback=n),n=Tt(e,i,r),n!==null&&(Mn(n,e,r,t),$o(n,e,r))}};function Op(e,n,t,r,i,s,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,s,o):n.prototype&&n.prototype.isPureReactComponent?!gs(t,r)||!gs(i,s):!0}function uv(e,n,t){var r=!1,i=Lt,s=n.contextType;return typeof s=="object"&&s!==null?s=wn(s):(i=en(n)?ur:qe.current,r=n.contextTypes,s=(r=r!=null)?ti(e,i):Lt),n=new n(t,s),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=al,e.stateNode=n,n._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=s),n}function Bp(e,n,t,r){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(t,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(t,r),n.state!==e&&al.enqueueReplaceState(n,n.state,null)}function sc(e,n,t,r){var i=e.stateNode;i.props=t,i.state=e.memoizedState,i.refs={},jd(e);var s=n.contextType;typeof s=="object"&&s!==null?i.context=wn(s):(s=en(n)?ur:qe.current,i.context=ti(e,s)),i.state=e.memoizedState,s=n.getDerivedStateFromProps,typeof s=="function"&&(ic(e,n,s,t),i.state=e.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(n=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),n!==i.state&&al.enqueueReplaceState(i,i.state,null),ya(e,t,i,r),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function oi(e,n){try{var t="",r=n;do t+=k_(r),r=r.return;while(r);var i=t}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:n,stack:i,digest:null}}function eu(e,n,t){return{value:e,source:null,stack:t??null,digest:n??null}}function oc(e,n){try{console.error(n.value)}catch(t){setTimeout(function(){throw t})}}var Xw=typeof WeakMap=="function"?WeakMap:Map;function cv(e,n,t){t=et(-1,t),t.tag=3,t.payload={element:null};var r=n.value;return t.callback=function(){ka||(ka=!0,gc=r),oc(e,n)},t}function dv(e,n,t){t=et(-1,t),t.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var i=n.value;t.payload=function(){return r(i)},t.callback=function(){oc(e,n)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){oc(e,n),typeof r!="function"&&(zt===null?zt=new Set([this]):zt.add(this));var o=n.stack;this.componentDidCatch(n.value,{componentStack:o!==null?o:""})}),t}function Up(e,n,t){var r=e.pingCache;if(r===null){r=e.pingCache=new Xw;var i=new Set;r.set(n,i)}else i=r.get(n),i===void 0&&(i=new Set,r.set(n,i));i.has(t)||(i.add(t),e=cb.bind(null,e,n,t),n.then(e,e))}function Hp(e){do{var n;if((n=e.tag===13)&&(n=e.memoizedState,n=n!==null?n.dehydrated!==null:!0),n)return e;e=e.return}while(e!==null);return null}function Wp(e,n,t,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===n?e.flags|=65536:(e.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(n=et(-1,1),n.tag=2,Tt(t,n,1))),t.lanes|=1),e)}var Qw=ct.ReactCurrentOwner,Xe=!1;function $e(e,n,t,r){n.child=e===null?V0(n,null,t,r):ii(n,e.child,t,r)}function Kp(e,n,t,r,i){t=t.render;var s=n.ref;return Qr(n,i),r=Md(e,n,t,r,s,i),t=Rd(),e!==null&&!Xe?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~i,ot(e,n,i)):(ce&&t&&_d(n),n.flags|=1,$e(e,n,r,i),n.child)}function Yp(e,n,t,r,i){if(e===null){var s=t.type;return typeof s=="function"&&!Bd(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(n.tag=15,n.type=s,fv(e,n,s,r,i)):(e=Ko(t.type,null,r,n,n.mode,i),e.ref=n.ref,e.return=n,n.child=e)}if(s=e.child,!(e.lanes&i)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:gs,t(o,r)&&e.ref===n.ref)return ot(e,n,i)}return n.flags|=1,e=At(s,r),e.ref=n.ref,e.return=n,n.child=e}function fv(e,n,t,r,i){if(e!==null){var s=e.memoizedProps;if(gs(s,r)&&e.ref===n.ref)if(Xe=!1,n.pendingProps=r=s,(e.lanes&i)!==0)e.flags&131072&&(Xe=!0);else return n.lanes=e.lanes,ot(e,n,i)}return ac(e,n,t,r,i)}function pv(e,n,t){var r=n.pendingProps,i=r.children,s=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(n.mode&1))n.memoizedState={baseLanes:0,cachePool:null,transitions:null},se(Fr,tn),tn|=t;else{if(!(t&1073741824))return e=s!==null?s.baseLanes|t:t,n.lanes=n.childLanes=1073741824,n.memoizedState={baseLanes:e,cachePool:null,transitions:null},n.updateQueue=null,se(Fr,tn),tn|=e,null;n.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:t,se(Fr,tn),tn|=r}else s!==null?(r=s.baseLanes|t,n.memoizedState=null):r=t,se(Fr,tn),tn|=r;return $e(e,n,i,t),n.child}function hv(e,n){var t=n.ref;(e===null&&t!==null||e!==null&&e.ref!==t)&&(n.flags|=512,n.flags|=2097152)}function ac(e,n,t,r,i){var s=en(t)?ur:qe.current;return s=ti(n,s),Qr(n,i),t=Md(e,n,t,r,s,i),r=Rd(),e!==null&&!Xe?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~i,ot(e,n,i)):(ce&&r&&_d(n),n.flags|=1,$e(e,n,t,i),n.child)}function Gp(e,n,t,r,i){if(en(t)){var s=!0;pa(n)}else s=!1;if(Qr(n,i),n.stateNode===null)Uo(e,n),uv(n,t,r),sc(n,t,r,i),r=!0;else if(e===null){var o=n.stateNode,a=n.memoizedProps;o.props=a;var l=o.context,u=t.contextType;typeof u=="object"&&u!==null?u=wn(u):(u=en(t)?ur:qe.current,u=ti(n,u));var c=t.getDerivedStateFromProps,d=typeof c=="function"||typeof o.getSnapshotBeforeUpdate=="function";d||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==r||l!==u)&&Bp(n,o,r,u),vt=!1;var f=n.memoizedState;o.state=f,ya(n,r,o,i),l=n.memoizedState,a!==r||f!==l||Je.current||vt?(typeof c=="function"&&(ic(n,t,c,r),l=n.memoizedState),(a=vt||Op(n,t,a,r,f,l,u))?(d||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(n.flags|=4194308)):(typeof o.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=l),o.props=r,o.state=l,o.context=u,r=a):(typeof o.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{o=n.stateNode,O0(e,n),a=n.memoizedProps,u=n.type===n.elementType?a:Cn(n.type,a),o.props=u,d=n.pendingProps,f=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=wn(l):(l=en(t)?ur:qe.current,l=ti(n,l));var p=t.getDerivedStateFromProps;(c=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==d||f!==l)&&Bp(n,o,r,l),vt=!1,f=n.memoizedState,o.state=f,ya(n,r,o,i);var v=n.memoizedState;a!==d||f!==v||Je.current||vt?(typeof p=="function"&&(ic(n,t,p,r),v=n.memoizedState),(u=vt||Op(n,t,u,r,f,v,l)||!1)?(c||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,v,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,v,l)),typeof o.componentDidUpdate=="function"&&(n.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&f===e.memoizedState||(n.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&f===e.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=v),o.props=r,o.state=v,o.context=l,r=u):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&f===e.memoizedState||(n.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&f===e.memoizedState||(n.flags|=1024),r=!1)}return lc(e,n,t,r,s,i)}function lc(e,n,t,r,i,s){hv(e,n);var o=(n.flags&128)!==0;if(!r&&!o)return i&&Np(n,t,!1),ot(e,n,s);r=n.stateNode,Qw.current=n;var a=o&&typeof t.getDerivedStateFromError!="function"?null:r.render();return n.flags|=1,e!==null&&o?(n.child=ii(n,e.child,null,s),n.child=ii(n,null,a,s)):$e(e,n,a,s),n.memoizedState=r.state,i&&Np(n,t,!0),n.child}function mv(e){var n=e.stateNode;n.pendingContext?Rp(e,n.pendingContext,n.pendingContext!==n.context):n.context&&Rp(e,n.context,!1),Td(e,n.containerInfo)}function Xp(e,n,t,r,i){return ri(),bd(i),n.flags|=256,$e(e,n,t,r),n.child}var uc={dehydrated:null,treeContext:null,retryLane:0};function cc(e){return{baseLanes:e,cachePool:null,transitions:null}}function gv(e,n,t){var r=n.pendingProps,i=de.current,s=!1,o=(n.flags&128)!==0,a;if((a=o)||(a=e!==null&&e.memoizedState===null?!1:(i&2)!==0),a?(s=!0,n.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),se(de,i&1),e===null)return tc(n),e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(n.mode&1?e.data==="$!"?n.lanes=8:n.lanes=1073741824:n.lanes=1,null):(o=r.children,e=r.fallback,s?(r=n.mode,s=n.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=cl(o,r,0,null),e=ir(e,r,t,null),s.return=n,e.return=n,s.sibling=e,n.child=s,n.child.memoizedState=cc(t),n.memoizedState=uc,e):Dd(n,o));if(i=e.memoizedState,i!==null&&(a=i.dehydrated,a!==null))return Zw(e,n,o,r,a,i,t);if(s){s=r.fallback,o=n.mode,i=e.child,a=i.sibling;var l={mode:"hidden",children:r.children};return!(o&1)&&n.child!==i?(r=n.child,r.childLanes=0,r.pendingProps=l,n.deletions=null):(r=At(i,l),r.subtreeFlags=i.subtreeFlags&14680064),a!==null?s=At(a,s):(s=ir(s,o,t,null),s.flags|=2),s.return=n,r.return=n,r.sibling=s,n.child=r,r=s,s=n.child,o=e.child.memoizedState,o=o===null?cc(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=e.childLanes&~t,n.memoizedState=uc,r}return s=e.child,e=s.sibling,r=At(s,{mode:"visible",children:r.children}),!(n.mode&1)&&(r.lanes=t),r.return=n,r.sibling=null,e!==null&&(t=n.deletions,t===null?(n.deletions=[e],n.flags|=16):t.push(e)),n.child=r,n.memoizedState=null,r}function Dd(e,n){return n=cl({mode:"visible",children:n},e.mode,0,null),n.return=e,e.child=n}function _o(e,n,t,r){return r!==null&&bd(r),ii(n,e.child,null,t),e=Dd(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function Zw(e,n,t,r,i,s,o){if(t)return n.flags&256?(n.flags&=-257,r=eu(Error(D(422))),_o(e,n,o,r)):n.memoizedState!==null?(n.child=e.child,n.flags|=128,null):(s=r.fallback,i=n.mode,r=cl({mode:"visible",children:r.children},i,0,null),s=ir(s,i,o,null),s.flags|=2,r.return=n,s.return=n,r.sibling=s,n.child=r,n.mode&1&&ii(n,e.child,null,o),n.child.memoizedState=cc(o),n.memoizedState=uc,s);if(!(n.mode&1))return _o(e,n,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var a=r.dgst;return r=a,s=Error(D(419)),r=eu(s,r,void 0),_o(e,n,o,r)}if(a=(o&e.childLanes)!==0,Xe||a){if(r=Pe,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,st(e,i),Mn(r,e,i,-1))}return Od(),r=eu(Error(D(421))),_o(e,n,o,r)}return i.data==="$?"?(n.flags|=128,n.child=e.child,n=db.bind(null,e),i._reactRetry=n,null):(e=s.treeContext,sn=jt(i.nextSibling),on=n,ce=!0,jn=null,e!==null&&(mn[gn++]=Qn,mn[gn++]=Zn,mn[gn++]=cr,Qn=e.id,Zn=e.overflow,cr=n),n=Dd(n,r.children),n.flags|=4096,n)}function Qp(e,n,t){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n),rc(e.return,n,t)}function nu(e,n,t,r,i){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:t,tailMode:i}:(s.isBackwards=n,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=t,s.tailMode=i)}function vv(e,n,t){var r=n.pendingProps,i=r.revealOrder,s=r.tail;if($e(e,n,r.children,t),r=de.current,r&2)r=r&1|2,n.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Qp(e,t,n);else if(e.tag===19)Qp(e,t,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(se(de,r),!(n.mode&1))n.memoizedState=null;else switch(i){case"forwards":for(t=n.child,i=null;t!==null;)e=t.alternate,e!==null&&xa(e)===null&&(i=t),t=t.sibling;t=i,t===null?(i=n.child,n.child=null):(i=t.sibling,t.sibling=null),nu(n,!1,i,t,s);break;case"backwards":for(t=null,i=n.child,n.child=null;i!==null;){if(e=i.alternate,e!==null&&xa(e)===null){n.child=i;break}e=i.sibling,i.sibling=t,t=i,i=e}nu(n,!0,t,null,s);break;case"together":nu(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function Uo(e,n){!(n.mode&1)&&e!==null&&(e.alternate=null,n.alternate=null,n.flags|=2)}function ot(e,n,t){if(e!==null&&(n.dependencies=e.dependencies),fr|=n.lanes,!(t&n.childLanes))return null;if(e!==null&&n.child!==e.child)throw Error(D(153));if(n.child!==null){for(e=n.child,t=At(e,e.pendingProps),n.child=t,t.return=n;e.sibling!==null;)e=e.sibling,t=t.sibling=At(e,e.pendingProps),t.return=n;t.sibling=null}return n.child}function Jw(e,n,t){switch(n.tag){case 3:mv(n),ri();break;case 5:B0(n);break;case 1:en(n.type)&&pa(n);break;case 4:Td(n,n.stateNode.containerInfo);break;case 10:var r=n.type._context,i=n.memoizedProps.value;se(ga,r._currentValue),r._currentValue=i;break;case 13:if(r=n.memoizedState,r!==null)return r.dehydrated!==null?(se(de,de.current&1),n.flags|=128,null):t&n.child.childLanes?gv(e,n,t):(se(de,de.current&1),e=ot(e,n,t),e!==null?e.sibling:null);se(de,de.current&1);break;case 19:if(r=(t&n.childLanes)!==0,e.flags&128){if(r)return vv(e,n,t);n.flags|=128}if(i=n.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),se(de,de.current),r)break;return null;case 22:case 23:return n.lanes=0,pv(e,n,t)}return ot(e,n,t)}var yv,dc,xv,_v;yv=function(e,n){for(var t=n.child;t!==null;){if(t.tag===5||t.tag===6)e.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break;for(;t.sibling===null;){if(t.return===null||t.return===n)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};dc=function(){};xv=function(e,n,t,r){var i=e.memoizedProps;if(i!==r){e=n.stateNode,er(Vn.current);var s=null;switch(t){case"input":i=Ru(e,i),r=Ru(e,r),s=[];break;case"select":i=he({},i,{value:void 0}),r=he({},r,{value:void 0}),s=[];break;case"textarea":i=Du(e,i),r=Du(e,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=da)}Fu(t,r);var o;t=null;for(u in i)if(!r.hasOwnProperty(u)&&i.hasOwnProperty(u)&&i[u]!=null)if(u==="style"){var a=i[u];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(us.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in r){var l=r[u];if(a=i!=null?i[u]:void 0,r.hasOwnProperty(u)&&l!==a&&(l!=null||a!=null))if(u==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(u,t)),t=l;else u==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(u,l)):u==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(u,""+l):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(us.hasOwnProperty(u)?(l!=null&&u==="onScroll"&&ae("scroll",e),s||a===l||(s=[])):(s=s||[]).push(u,l))}t&&(s=s||[]).push("style",t);var u=s;(n.updateQueue=u)&&(n.flags|=4)}};_v=function(e,n,t,r){t!==r&&(n.flags|=4)};function ji(e,n){if(!ce)switch(e.tailMode){case"hidden":n=e.tail;for(var t=null;n!==null;)n.alternate!==null&&(t=n),n=n.sibling;t===null?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Re(e){var n=e.alternate!==null&&e.alternate.child===e.child,t=0,r=0;if(n)for(var i=e.child;i!==null;)t|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)t|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=t,n}function eb(e,n,t){var r=n.pendingProps;switch(wd(n),n.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Re(n),null;case 1:return en(n.type)&&fa(),Re(n),null;case 3:return r=n.stateNode,si(),le(Je),le(qe),Ed(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(yo(n)?n.flags|=4:e===null||e.memoizedState.isDehydrated&&!(n.flags&256)||(n.flags|=1024,jn!==null&&(xc(jn),jn=null))),dc(e,n),Re(n),null;case 5:zd(n);var i=er(ws.current);if(t=n.type,e!==null&&n.stateNode!=null)xv(e,n,t,r,i),e.ref!==n.ref&&(n.flags|=512,n.flags|=2097152);else{if(!r){if(n.stateNode===null)throw Error(D(166));return Re(n),null}if(e=er(Vn.current),yo(n)){r=n.stateNode,t=n.type;var s=n.memoizedProps;switch(r[In]=n,r[xs]=s,e=(n.mode&1)!==0,t){case"dialog":ae("cancel",r),ae("close",r);break;case"iframe":case"object":case"embed":ae("load",r);break;case"video":case"audio":for(i=0;i<Fi.length;i++)ae(Fi[i],r);break;case"source":ae("error",r);break;case"img":case"image":case"link":ae("error",r),ae("load",r);break;case"details":ae("toggle",r);break;case"input":op(r,s),ae("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},ae("invalid",r);break;case"textarea":lp(r,s),ae("invalid",r)}Fu(t,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?r.textContent!==a&&(s.suppressHydrationWarning!==!0&&vo(r.textContent,a,e),i=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&vo(r.textContent,a,e),i=["children",""+a]):us.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&ae("scroll",r)}switch(t){case"input":lo(r),ap(r,s,!0);break;case"textarea":lo(r),up(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=da)}r=i,n.updateQueue=r,r!==null&&(n.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Yg(t)),e==="http://www.w3.org/1999/xhtml"?t==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(t,{is:r.is}):(e=o.createElement(t),t==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,t),e[In]=n,e[xs]=r,yv(e,n,!1,!1),n.stateNode=e;e:{switch(o=qu(t,r),t){case"dialog":ae("cancel",e),ae("close",e),i=r;break;case"iframe":case"object":case"embed":ae("load",e),i=r;break;case"video":case"audio":for(i=0;i<Fi.length;i++)ae(Fi[i],e);i=r;break;case"source":ae("error",e),i=r;break;case"img":case"image":case"link":ae("error",e),ae("load",e),i=r;break;case"details":ae("toggle",e),i=r;break;case"input":op(e,r),i=Ru(e,r),ae("invalid",e);break;case"option":i=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=he({},r,{value:void 0}),ae("invalid",e);break;case"textarea":lp(e,r),i=Du(e,r),ae("invalid",e);break;default:i=r}Fu(t,i),a=i;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?Qg(e,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Gg(e,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&cs(e,l):typeof l=="number"&&cs(e,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(us.hasOwnProperty(s)?l!=null&&s==="onScroll"&&ae("scroll",e):l!=null&&od(e,s,l,o))}switch(t){case"input":lo(e),ap(e,r,!1);break;case"textarea":lo(e),up(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Nt(r.value));break;case"select":e.multiple=!!r.multiple,s=r.value,s!=null?Kr(e,!!r.multiple,s,!1):r.defaultValue!=null&&Kr(e,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=da)}switch(t){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(n.flags|=4)}n.ref!==null&&(n.flags|=512,n.flags|=2097152)}return Re(n),null;case 6:if(e&&n.stateNode!=null)_v(e,n,e.memoizedProps,r);else{if(typeof r!="string"&&n.stateNode===null)throw Error(D(166));if(t=er(ws.current),er(Vn.current),yo(n)){if(r=n.stateNode,t=n.memoizedProps,r[In]=n,(s=r.nodeValue!==t)&&(e=on,e!==null))switch(e.tag){case 3:vo(r.nodeValue,t,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&vo(r.nodeValue,t,(e.mode&1)!==0)}s&&(n.flags|=4)}else r=(t.nodeType===9?t:t.ownerDocument).createTextNode(r),r[In]=n,n.stateNode=r}return Re(n),null;case 13:if(le(de),r=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ce&&sn!==null&&n.mode&1&&!(n.flags&128))F0(),ri(),n.flags|=98560,s=!1;else if(s=yo(n),r!==null&&r.dehydrated!==null){if(e===null){if(!s)throw Error(D(318));if(s=n.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(D(317));s[In]=n}else ri(),!(n.flags&128)&&(n.memoizedState=null),n.flags|=4;Re(n),s=!1}else jn!==null&&(xc(jn),jn=null),s=!0;if(!s)return n.flags&65536?n:null}return n.flags&128?(n.lanes=t,n):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(n.child.flags|=8192,n.mode&1&&(e===null||de.current&1?Se===0&&(Se=3):Od())),n.updateQueue!==null&&(n.flags|=4),Re(n),null);case 4:return si(),dc(e,n),e===null&&vs(n.stateNode.containerInfo),Re(n),null;case 10:return Cd(n.type._context),Re(n),null;case 17:return en(n.type)&&fa(),Re(n),null;case 19:if(le(de),s=n.memoizedState,s===null)return Re(n),null;if(r=(n.flags&128)!==0,o=s.rendering,o===null)if(r)ji(s,!1);else{if(Se!==0||e!==null&&e.flags&128)for(e=n.child;e!==null;){if(o=xa(e),o!==null){for(n.flags|=128,ji(s,!1),r=o.updateQueue,r!==null&&(n.updateQueue=r,n.flags|=4),n.subtreeFlags=0,r=t,t=n.child;t!==null;)s=t,e=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,e=o.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t=t.sibling;return se(de,de.current&1|2),n.child}e=e.sibling}s.tail!==null&&xe()>ai&&(n.flags|=128,r=!0,ji(s,!1),n.lanes=4194304)}else{if(!r)if(e=xa(o),e!==null){if(n.flags|=128,r=!0,t=e.updateQueue,t!==null&&(n.updateQueue=t,n.flags|=4),ji(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!ce)return Re(n),null}else 2*xe()-s.renderingStartTime>ai&&t!==1073741824&&(n.flags|=128,r=!0,ji(s,!1),n.lanes=4194304);s.isBackwards?(o.sibling=n.child,n.child=o):(t=s.last,t!==null?t.sibling=o:n.child=o,s.last=o)}return s.tail!==null?(n=s.tail,s.rendering=n,s.tail=n.sibling,s.renderingStartTime=xe(),n.sibling=null,t=de.current,se(de,r?t&1|2:t&1),n):(Re(n),null);case 22:case 23:return $d(),r=n.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(n.flags|=8192),r&&n.mode&1?tn&1073741824&&(Re(n),n.subtreeFlags&6&&(n.flags|=8192)):Re(n),null;case 24:return null;case 25:return null}throw Error(D(156,n.tag))}function nb(e,n){switch(wd(n),n.tag){case 1:return en(n.type)&&fa(),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return si(),le(Je),le(qe),Ed(),e=n.flags,e&65536&&!(e&128)?(n.flags=e&-65537|128,n):null;case 5:return zd(n),null;case 13:if(le(de),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(D(340));ri()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return le(de),null;case 4:return si(),null;case 10:return Cd(n.type._context),null;case 22:case 23:return $d(),null;case 24:return null;default:return null}}var wo=!1,De=!1,tb=typeof WeakSet=="function"?WeakSet:Set,B=null;function Ir(e,n){var t=e.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(r){ge(e,n,r)}else t.current=null}function fc(e,n,t){try{t()}catch(r){ge(e,n,r)}}var Zp=!1;function rb(e,n){if(Gu=la,e=C0(),xd(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var r=t.getSelection&&t.getSelection();if(r&&r.rangeCount!==0){t=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,l=-1,u=0,c=0,d=e,f=null;n:for(;;){for(var p;d!==t||i!==0&&d.nodeType!==3||(a=o+i),d!==s||r!==0&&d.nodeType!==3||(l=o+r),d.nodeType===3&&(o+=d.nodeValue.length),(p=d.firstChild)!==null;)f=d,d=p;for(;;){if(d===e)break n;if(f===t&&++u===i&&(a=o),f===s&&++c===r&&(l=o),(p=d.nextSibling)!==null)break;d=f,f=d.parentNode}d=p}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(Xu={focusedElem:e,selectionRange:t},la=!1,B=n;B!==null;)if(n=B,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,B=e;else for(;B!==null;){n=B;try{var v=n.alternate;if(n.flags&1024)switch(n.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var g=v.memoizedProps,_=v.memoizedState,h=n.stateNode,m=h.getSnapshotBeforeUpdate(n.elementType===n.type?g:Cn(n.type,g),_);h.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var y=n.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(D(163))}}catch(x){ge(n,n.return,x)}if(e=n.sibling,e!==null){e.return=n.return,B=e;break}B=n.return}return v=Zp,Zp=!1,v}function Zi(e,n,t){var r=n.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var s=i.destroy;i.destroy=void 0,s!==void 0&&fc(n,t,s)}i=i.next}while(i!==r)}}function ll(e,n){if(n=n.updateQueue,n=n!==null?n.lastEffect:null,n!==null){var t=n=n.next;do{if((t.tag&e)===e){var r=t.create;t.destroy=r()}t=t.next}while(t!==n)}}function pc(e){var n=e.ref;if(n!==null){var t=e.stateNode;switch(e.tag){case 5:e=t;break;default:e=t}typeof n=="function"?n(e):n.current=e}}function wv(e){var n=e.alternate;n!==null&&(e.alternate=null,wv(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&(delete n[In],delete n[xs],delete n[Ju],delete n[qw],delete n[Vw])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function bv(e){return e.tag===5||e.tag===3||e.tag===4}function Jp(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||bv(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function hc(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.nodeType===8?t.parentNode.insertBefore(e,n):t.insertBefore(e,n):(t.nodeType===8?(n=t.parentNode,n.insertBefore(e,t)):(n=t,n.appendChild(e)),t=t._reactRootContainer,t!=null||n.onclick!==null||(n.onclick=da));else if(r!==4&&(e=e.child,e!==null))for(hc(e,n,t),e=e.sibling;e!==null;)hc(e,n,t),e=e.sibling}function mc(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.insertBefore(e,n):t.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(mc(e,n,t),e=e.sibling;e!==null;)mc(e,n,t),e=e.sibling}var je=null,Pn=!1;function pt(e,n,t){for(t=t.child;t!==null;)kv(e,n,t),t=t.sibling}function kv(e,n,t){if(qn&&typeof qn.onCommitFiberUnmount=="function")try{qn.onCommitFiberUnmount(el,t)}catch{}switch(t.tag){case 5:De||Ir(t,n);case 6:var r=je,i=Pn;je=null,pt(e,n,t),je=r,Pn=i,je!==null&&(Pn?(e=je,t=t.stateNode,e.nodeType===8?e.parentNode.removeChild(t):e.removeChild(t)):je.removeChild(t.stateNode));break;case 18:je!==null&&(Pn?(e=je,t=t.stateNode,e.nodeType===8?Yl(e.parentNode,t):e.nodeType===1&&Yl(e,t),hs(e)):Yl(je,t.stateNode));break;case 4:r=je,i=Pn,je=t.stateNode.containerInfo,Pn=!0,pt(e,n,t),je=r,Pn=i;break;case 0:case 11:case 14:case 15:if(!De&&(r=t.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&fc(t,n,o),i=i.next}while(i!==r)}pt(e,n,t);break;case 1:if(!De&&(Ir(t,n),r=t.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=t.memoizedProps,r.state=t.memoizedState,r.componentWillUnmount()}catch(a){ge(t,n,a)}pt(e,n,t);break;case 21:pt(e,n,t);break;case 22:t.mode&1?(De=(r=De)||t.memoizedState!==null,pt(e,n,t),De=r):pt(e,n,t);break;default:pt(e,n,t)}}function eh(e){var n=e.updateQueue;if(n!==null){e.updateQueue=null;var t=e.stateNode;t===null&&(t=e.stateNode=new tb),n.forEach(function(r){var i=fb.bind(null,e,r);t.has(r)||(t.add(r),r.then(i,i))})}}function kn(e,n){var t=n.deletions;if(t!==null)for(var r=0;r<t.length;r++){var i=t[r];try{var s=e,o=n,a=o;e:for(;a!==null;){switch(a.tag){case 5:je=a.stateNode,Pn=!1;break e;case 3:je=a.stateNode.containerInfo,Pn=!0;break e;case 4:je=a.stateNode.containerInfo,Pn=!0;break e}a=a.return}if(je===null)throw Error(D(160));kv(s,o,i),je=null,Pn=!1;var l=i.alternate;l!==null&&(l.return=null),i.return=null}catch(u){ge(i,n,u)}}if(n.subtreeFlags&12854)for(n=n.child;n!==null;)Sv(n,e),n=n.sibling}function Sv(e,n){var t=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(kn(n,e),Ln(e),r&4){try{Zi(3,e,e.return),ll(3,e)}catch(g){ge(e,e.return,g)}try{Zi(5,e,e.return)}catch(g){ge(e,e.return,g)}}break;case 1:kn(n,e),Ln(e),r&512&&t!==null&&Ir(t,t.return);break;case 5:if(kn(n,e),Ln(e),r&512&&t!==null&&Ir(t,t.return),e.flags&32){var i=e.stateNode;try{cs(i,"")}catch(g){ge(e,e.return,g)}}if(r&4&&(i=e.stateNode,i!=null)){var s=e.memoizedProps,o=t!==null?t.memoizedProps:s,a=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Wg(i,s),qu(a,o);var u=qu(a,s);for(o=0;o<l.length;o+=2){var c=l[o],d=l[o+1];c==="style"?Qg(i,d):c==="dangerouslySetInnerHTML"?Gg(i,d):c==="children"?cs(i,d):od(i,c,d,u)}switch(a){case"input":Nu(i,s);break;case"textarea":Kg(i,s);break;case"select":var f=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?Kr(i,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?Kr(i,!!s.multiple,s.defaultValue,!0):Kr(i,!!s.multiple,s.multiple?[]:"",!1))}i[xs]=s}catch(g){ge(e,e.return,g)}}break;case 6:if(kn(n,e),Ln(e),r&4){if(e.stateNode===null)throw Error(D(162));i=e.stateNode,s=e.memoizedProps;try{i.nodeValue=s}catch(g){ge(e,e.return,g)}}break;case 3:if(kn(n,e),Ln(e),r&4&&t!==null&&t.memoizedState.isDehydrated)try{hs(n.containerInfo)}catch(g){ge(e,e.return,g)}break;case 4:kn(n,e),Ln(e);break;case 13:kn(n,e),Ln(e),i=e.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(qd=xe())),r&4&&eh(e);break;case 22:if(c=t!==null&&t.memoizedState!==null,e.mode&1?(De=(u=De)||c,kn(n,e),De=u):kn(n,e),Ln(e),r&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!c&&e.mode&1)for(B=e,c=e.child;c!==null;){for(d=B=c;B!==null;){switch(f=B,p=f.child,f.tag){case 0:case 11:case 14:case 15:Zi(4,f,f.return);break;case 1:Ir(f,f.return);var v=f.stateNode;if(typeof v.componentWillUnmount=="function"){r=f,t=f.return;try{n=r,v.props=n.memoizedProps,v.state=n.memoizedState,v.componentWillUnmount()}catch(g){ge(r,t,g)}}break;case 5:Ir(f,f.return);break;case 22:if(f.memoizedState!==null){th(d);continue}}p!==null?(p.return=f,B=p):th(d)}c=c.sibling}e:for(c=null,d=e;;){if(d.tag===5){if(c===null){c=d;try{i=d.stateNode,u?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=d.stateNode,l=d.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=Xg("display",o))}catch(g){ge(e,e.return,g)}}}else if(d.tag===6){if(c===null)try{d.stateNode.nodeValue=u?"":d.memoizedProps}catch(g){ge(e,e.return,g)}}else if((d.tag!==22&&d.tag!==23||d.memoizedState===null||d===e)&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===e)break e;for(;d.sibling===null;){if(d.return===null||d.return===e)break e;c===d&&(c=null),d=d.return}c===d&&(c=null),d.sibling.return=d.return,d=d.sibling}}break;case 19:kn(n,e),Ln(e),r&4&&eh(e);break;case 21:break;default:kn(n,e),Ln(e)}}function Ln(e){var n=e.flags;if(n&2){try{e:{for(var t=e.return;t!==null;){if(bv(t)){var r=t;break e}t=t.return}throw Error(D(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(cs(i,""),r.flags&=-33);var s=Jp(e);mc(e,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,a=Jp(e);hc(e,a,o);break;default:throw Error(D(161))}}catch(l){ge(e,e.return,l)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function ib(e,n,t){B=e,Cv(e)}function Cv(e,n,t){for(var r=(e.mode&1)!==0;B!==null;){var i=B,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||wo;if(!o){var a=i.alternate,l=a!==null&&a.memoizedState!==null||De;a=wo;var u=De;if(wo=o,(De=l)&&!u)for(B=i;B!==null;)o=B,l=o.child,o.tag===22&&o.memoizedState!==null?rh(i):l!==null?(l.return=o,B=l):rh(i);for(;s!==null;)B=s,Cv(s),s=s.sibling;B=i,wo=a,De=u}nh(e)}else i.subtreeFlags&8772&&s!==null?(s.return=i,B=s):nh(e)}}function nh(e){for(;B!==null;){var n=B;if(n.flags&8772){var t=n.alternate;try{if(n.flags&8772)switch(n.tag){case 0:case 11:case 15:De||ll(5,n);break;case 1:var r=n.stateNode;if(n.flags&4&&!De)if(t===null)r.componentDidMount();else{var i=n.elementType===n.type?t.memoizedProps:Cn(n.type,t.memoizedProps);r.componentDidUpdate(i,t.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=n.updateQueue;s!==null&&qp(n,s,r);break;case 3:var o=n.updateQueue;if(o!==null){if(t=null,n.child!==null)switch(n.child.tag){case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}qp(n,o,t)}break;case 5:var a=n.stateNode;if(t===null&&n.flags&4){t=a;var l=n.memoizedProps;switch(n.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(n.memoizedState===null){var u=n.alternate;if(u!==null){var c=u.memoizedState;if(c!==null){var d=c.dehydrated;d!==null&&hs(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(D(163))}De||n.flags&512&&pc(n)}catch(f){ge(n,n.return,f)}}if(n===e){B=null;break}if(t=n.sibling,t!==null){t.return=n.return,B=t;break}B=n.return}}function th(e){for(;B!==null;){var n=B;if(n===e){B=null;break}var t=n.sibling;if(t!==null){t.return=n.return,B=t;break}B=n.return}}function rh(e){for(;B!==null;){var n=B;try{switch(n.tag){case 0:case 11:case 15:var t=n.return;try{ll(4,n)}catch(l){ge(n,t,l)}break;case 1:var r=n.stateNode;if(typeof r.componentDidMount=="function"){var i=n.return;try{r.componentDidMount()}catch(l){ge(n,i,l)}}var s=n.return;try{pc(n)}catch(l){ge(n,s,l)}break;case 5:var o=n.return;try{pc(n)}catch(l){ge(n,o,l)}}}catch(l){ge(n,n.return,l)}if(n===e){B=null;break}var a=n.sibling;if(a!==null){a.return=n.return,B=a;break}B=n.return}}var sb=Math.ceil,ba=ct.ReactCurrentDispatcher,Id=ct.ReactCurrentOwner,_n=ct.ReactCurrentBatchConfig,J=0,Pe=null,_e=null,ze=0,tn=0,Fr=Vt(0),Se=0,Cs=null,fr=0,ul=0,Fd=0,Ji=null,Ge=null,qd=0,ai=1/0,Kn=null,ka=!1,gc=null,zt=null,bo=!1,wt=null,Sa=0,es=0,vc=null,Ho=-1,Wo=0;function Ue(){return J&6?xe():Ho!==-1?Ho:Ho=xe()}function Et(e){return e.mode&1?J&2&&ze!==0?ze&-ze:Ow.transition!==null?(Wo===0&&(Wo=u0()),Wo):(e=ne,e!==0||(e=window.event,e=e===void 0?16:g0(e.type)),e):1}function Mn(e,n,t,r){if(50<es)throw es=0,vc=null,Error(D(185));qs(e,t,r),(!(J&2)||e!==Pe)&&(e===Pe&&(!(J&2)&&(ul|=t),Se===4&&xt(e,ze)),nn(e,r),t===1&&J===0&&!(n.mode&1)&&(ai=xe()+500,sl&&$t()))}function nn(e,n){var t=e.callbackNode;O_(e,n);var r=aa(e,e===Pe?ze:0);if(r===0)t!==null&&fp(t),e.callbackNode=null,e.callbackPriority=0;else if(n=r&-r,e.callbackPriority!==n){if(t!=null&&fp(t),n===1)e.tag===0?$w(ih.bind(null,e)):L0(ih.bind(null,e)),Iw(function(){!(J&6)&&$t()}),t=null;else{switch(c0(r)){case 1:t=dd;break;case 4:t=a0;break;case 16:t=oa;break;case 536870912:t=l0;break;default:t=oa}t=Rv(t,Pv.bind(null,e))}e.callbackPriority=n,e.callbackNode=t}}function Pv(e,n){if(Ho=-1,Wo=0,J&6)throw Error(D(327));var t=e.callbackNode;if(Zr()&&e.callbackNode!==t)return null;var r=aa(e,e===Pe?ze:0);if(r===0)return null;if(r&30||r&e.expiredLanes||n)n=Ca(e,r);else{n=r;var i=J;J|=2;var s=Tv();(Pe!==e||ze!==n)&&(Kn=null,ai=xe()+500,rr(e,n));do try{lb();break}catch(a){jv(e,a)}while(!0);Sd(),ba.current=s,J=i,_e!==null?n=0:(Pe=null,ze=0,n=Se)}if(n!==0){if(n===2&&(i=Uu(e),i!==0&&(r=i,n=yc(e,i))),n===1)throw t=Cs,rr(e,0),xt(e,r),nn(e,xe()),t;if(n===6)xt(e,r);else{if(i=e.current.alternate,!(r&30)&&!ob(i)&&(n=Ca(e,r),n===2&&(s=Uu(e),s!==0&&(r=s,n=yc(e,s))),n===1))throw t=Cs,rr(e,0),xt(e,r),nn(e,xe()),t;switch(e.finishedWork=i,e.finishedLanes=r,n){case 0:case 1:throw Error(D(345));case 2:Gt(e,Ge,Kn);break;case 3:if(xt(e,r),(r&130023424)===r&&(n=qd+500-xe(),10<n)){if(aa(e,0)!==0)break;if(i=e.suspendedLanes,(i&r)!==r){Ue(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=Zu(Gt.bind(null,e,Ge,Kn),n);break}Gt(e,Ge,Kn);break;case 4:if(xt(e,r),(r&4194240)===r)break;for(n=e.eventTimes,i=-1;0<r;){var o=31-An(r);s=1<<o,o=n[o],o>i&&(i=o),r&=~s}if(r=i,r=xe()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*sb(r/1960))-r,10<r){e.timeoutHandle=Zu(Gt.bind(null,e,Ge,Kn),r);break}Gt(e,Ge,Kn);break;case 5:Gt(e,Ge,Kn);break;default:throw Error(D(329))}}}return nn(e,xe()),e.callbackNode===t?Pv.bind(null,e):null}function yc(e,n){var t=Ji;return e.current.memoizedState.isDehydrated&&(rr(e,n).flags|=256),e=Ca(e,n),e!==2&&(n=Ge,Ge=t,n!==null&&xc(n)),e}function xc(e){Ge===null?Ge=e:Ge.push.apply(Ge,e)}function ob(e){for(var n=e;;){if(n.flags&16384){var t=n.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var r=0;r<t.length;r++){var i=t[r],s=i.getSnapshot;i=i.value;try{if(!Rn(s(),i))return!1}catch{return!1}}}if(t=n.child,n.subtreeFlags&16384&&t!==null)t.return=n,n=t;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function xt(e,n){for(n&=~Fd,n&=~ul,e.suspendedLanes|=n,e.pingedLanes&=~n,e=e.expirationTimes;0<n;){var t=31-An(n),r=1<<t;e[t]=-1,n&=~r}}function ih(e){if(J&6)throw Error(D(327));Zr();var n=aa(e,0);if(!(n&1))return nn(e,xe()),null;var t=Ca(e,n);if(e.tag!==0&&t===2){var r=Uu(e);r!==0&&(n=r,t=yc(e,r))}if(t===1)throw t=Cs,rr(e,0),xt(e,n),nn(e,xe()),t;if(t===6)throw Error(D(345));return e.finishedWork=e.current.alternate,e.finishedLanes=n,Gt(e,Ge,Kn),nn(e,xe()),null}function Vd(e,n){var t=J;J|=1;try{return e(n)}finally{J=t,J===0&&(ai=xe()+500,sl&&$t())}}function pr(e){wt!==null&&wt.tag===0&&!(J&6)&&Zr();var n=J;J|=1;var t=_n.transition,r=ne;try{if(_n.transition=null,ne=1,e)return e()}finally{ne=r,_n.transition=t,J=n,!(J&6)&&$t()}}function $d(){tn=Fr.current,le(Fr)}function rr(e,n){e.finishedWork=null,e.finishedLanes=0;var t=e.timeoutHandle;if(t!==-1&&(e.timeoutHandle=-1,Dw(t)),_e!==null)for(t=_e.return;t!==null;){var r=t;switch(wd(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&fa();break;case 3:si(),le(Je),le(qe),Ed();break;case 5:zd(r);break;case 4:si();break;case 13:le(de);break;case 19:le(de);break;case 10:Cd(r.type._context);break;case 22:case 23:$d()}t=t.return}if(Pe=e,_e=e=At(e.current,null),ze=tn=n,Se=0,Cs=null,Fd=ul=fr=0,Ge=Ji=null,Jt!==null){for(n=0;n<Jt.length;n++)if(t=Jt[n],r=t.interleaved,r!==null){t.interleaved=null;var i=r.next,s=t.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}t.pending=r}Jt=null}return e}function jv(e,n){do{var t=_e;try{if(Sd(),Oo.current=wa,_a){for(var r=pe.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}_a=!1}if(dr=0,Ce=ke=pe=null,Qi=!1,bs=0,Id.current=null,t===null||t.return===null){Se=1,Cs=n,_e=null;break}e:{var s=e,o=t.return,a=t,l=n;if(n=ze,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=l,c=a,d=c.tag;if(!(c.mode&1)&&(d===0||d===11||d===15)){var f=c.alternate;f?(c.updateQueue=f.updateQueue,c.memoizedState=f.memoizedState,c.lanes=f.lanes):(c.updateQueue=null,c.memoizedState=null)}var p=Hp(o);if(p!==null){p.flags&=-257,Wp(p,o,a,s,n),p.mode&1&&Up(s,u,n),n=p,l=u;var v=n.updateQueue;if(v===null){var g=new Set;g.add(l),n.updateQueue=g}else v.add(l);break e}else{if(!(n&1)){Up(s,u,n),Od();break e}l=Error(D(426))}}else if(ce&&a.mode&1){var _=Hp(o);if(_!==null){!(_.flags&65536)&&(_.flags|=256),Wp(_,o,a,s,n),bd(oi(l,a));break e}}s=l=oi(l,a),Se!==4&&(Se=2),Ji===null?Ji=[s]:Ji.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,n&=-n,s.lanes|=n;var h=cv(s,l,n);Fp(s,h);break e;case 1:a=l;var m=s.type,y=s.stateNode;if(!(s.flags&128)&&(typeof m.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(zt===null||!zt.has(y)))){s.flags|=65536,n&=-n,s.lanes|=n;var x=dv(s,a,n);Fp(s,x);break e}}s=s.return}while(s!==null)}Ev(t)}catch(k){n=k,_e===t&&t!==null&&(_e=t=t.return);continue}break}while(!0)}function Tv(){var e=ba.current;return ba.current=wa,e===null?wa:e}function Od(){(Se===0||Se===3||Se===2)&&(Se=4),Pe===null||!(fr&268435455)&&!(ul&268435455)||xt(Pe,ze)}function Ca(e,n){var t=J;J|=2;var r=Tv();(Pe!==e||ze!==n)&&(Kn=null,rr(e,n));do try{ab();break}catch(i){jv(e,i)}while(!0);if(Sd(),J=t,ba.current=r,_e!==null)throw Error(D(261));return Pe=null,ze=0,Se}function ab(){for(;_e!==null;)zv(_e)}function lb(){for(;_e!==null&&!R_();)zv(_e)}function zv(e){var n=Mv(e.alternate,e,tn);e.memoizedProps=e.pendingProps,n===null?Ev(e):_e=n,Id.current=null}function Ev(e){var n=e;do{var t=n.alternate;if(e=n.return,n.flags&32768){if(t=nb(t,n),t!==null){t.flags&=32767,_e=t;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Se=6,_e=null;return}}else if(t=eb(t,n,tn),t!==null){_e=t;return}if(n=n.sibling,n!==null){_e=n;return}_e=n=e}while(n!==null);Se===0&&(Se=5)}function Gt(e,n,t){var r=ne,i=_n.transition;try{_n.transition=null,ne=1,ub(e,n,t,r)}finally{_n.transition=i,ne=r}return null}function ub(e,n,t,r){do Zr();while(wt!==null);if(J&6)throw Error(D(327));t=e.finishedWork;var i=e.finishedLanes;if(t===null)return null;if(e.finishedWork=null,e.finishedLanes=0,t===e.current)throw Error(D(177));e.callbackNode=null,e.callbackPriority=0;var s=t.lanes|t.childLanes;if(B_(e,s),e===Pe&&(_e=Pe=null,ze=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||bo||(bo=!0,Rv(oa,function(){return Zr(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=_n.transition,_n.transition=null;var o=ne;ne=1;var a=J;J|=4,Id.current=null,rb(e,t),Sv(t,e),zw(Xu),la=!!Gu,Xu=Gu=null,e.current=t,ib(t),N_(),J=a,ne=o,_n.transition=s}else e.current=t;if(bo&&(bo=!1,wt=e,Sa=i),s=e.pendingLanes,s===0&&(zt=null),I_(t.stateNode),nn(e,xe()),n!==null)for(r=e.onRecoverableError,t=0;t<n.length;t++)i=n[t],r(i.value,{componentStack:i.stack,digest:i.digest});if(ka)throw ka=!1,e=gc,gc=null,e;return Sa&1&&e.tag!==0&&Zr(),s=e.pendingLanes,s&1?e===vc?es++:(es=0,vc=e):es=0,$t(),null}function Zr(){if(wt!==null){var e=c0(Sa),n=_n.transition,t=ne;try{if(_n.transition=null,ne=16>e?16:e,wt===null)var r=!1;else{if(e=wt,wt=null,Sa=0,J&6)throw Error(D(331));var i=J;for(J|=4,B=e.current;B!==null;){var s=B,o=s.child;if(B.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var u=a[l];for(B=u;B!==null;){var c=B;switch(c.tag){case 0:case 11:case 15:Zi(8,c,s)}var d=c.child;if(d!==null)d.return=c,B=d;else for(;B!==null;){c=B;var f=c.sibling,p=c.return;if(wv(c),c===u){B=null;break}if(f!==null){f.return=p,B=f;break}B=p}}}var v=s.alternate;if(v!==null){var g=v.child;if(g!==null){v.child=null;do{var _=g.sibling;g.sibling=null,g=_}while(g!==null)}}B=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,B=o;else e:for(;B!==null;){if(s=B,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Zi(9,s,s.return)}var h=s.sibling;if(h!==null){h.return=s.return,B=h;break e}B=s.return}}var m=e.current;for(B=m;B!==null;){o=B;var y=o.child;if(o.subtreeFlags&2064&&y!==null)y.return=o,B=y;else e:for(o=m;B!==null;){if(a=B,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:ll(9,a)}}catch(k){ge(a,a.return,k)}if(a===o){B=null;break e}var x=a.sibling;if(x!==null){x.return=a.return,B=x;break e}B=a.return}}if(J=i,$t(),qn&&typeof qn.onPostCommitFiberRoot=="function")try{qn.onPostCommitFiberRoot(el,e)}catch{}r=!0}return r}finally{ne=t,_n.transition=n}}return!1}function sh(e,n,t){n=oi(t,n),n=cv(e,n,1),e=Tt(e,n,1),n=Ue(),e!==null&&(qs(e,1,n),nn(e,n))}function ge(e,n,t){if(e.tag===3)sh(e,e,t);else for(;n!==null;){if(n.tag===3){sh(n,e,t);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(zt===null||!zt.has(r))){e=oi(t,e),e=dv(n,e,1),n=Tt(n,e,1),e=Ue(),n!==null&&(qs(n,1,e),nn(n,e));break}}n=n.return}}function cb(e,n,t){var r=e.pingCache;r!==null&&r.delete(n),n=Ue(),e.pingedLanes|=e.suspendedLanes&t,Pe===e&&(ze&t)===t&&(Se===4||Se===3&&(ze&130023424)===ze&&500>xe()-qd?rr(e,0):Fd|=t),nn(e,n)}function Av(e,n){n===0&&(e.mode&1?(n=fo,fo<<=1,!(fo&130023424)&&(fo=4194304)):n=1);var t=Ue();e=st(e,n),e!==null&&(qs(e,n,t),nn(e,t))}function db(e){var n=e.memoizedState,t=0;n!==null&&(t=n.retryLane),Av(e,t)}function fb(e,n){var t=0;switch(e.tag){case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(t=i.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(D(314))}r!==null&&r.delete(n),Av(e,t)}var Mv;Mv=function(e,n,t){if(e!==null)if(e.memoizedProps!==n.pendingProps||Je.current)Xe=!0;else{if(!(e.lanes&t)&&!(n.flags&128))return Xe=!1,Jw(e,n,t);Xe=!!(e.flags&131072)}else Xe=!1,ce&&n.flags&1048576&&D0(n,ma,n.index);switch(n.lanes=0,n.tag){case 2:var r=n.type;Uo(e,n),e=n.pendingProps;var i=ti(n,qe.current);Qr(n,t),i=Md(null,n,r,e,i,t);var s=Rd();return n.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(n.tag=1,n.memoizedState=null,n.updateQueue=null,en(r)?(s=!0,pa(n)):s=!1,n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,jd(n),i.updater=al,n.stateNode=i,i._reactInternals=n,sc(n,r,e,t),n=lc(null,n,r,!0,s,t)):(n.tag=0,ce&&s&&_d(n),$e(null,n,i,t),n=n.child),n;case 16:r=n.elementType;e:{switch(Uo(e,n),e=n.pendingProps,i=r._init,r=i(r._payload),n.type=r,i=n.tag=hb(r),e=Cn(r,e),i){case 0:n=ac(null,n,r,e,t);break e;case 1:n=Gp(null,n,r,e,t);break e;case 11:n=Kp(null,n,r,e,t);break e;case 14:n=Yp(null,n,r,Cn(r.type,e),t);break e}throw Error(D(306,r,""))}return n;case 0:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Cn(r,i),ac(e,n,r,i,t);case 1:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Cn(r,i),Gp(e,n,r,i,t);case 3:e:{if(mv(n),e===null)throw Error(D(387));r=n.pendingProps,s=n.memoizedState,i=s.element,O0(e,n),ya(n,r,null,t);var o=n.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},n.updateQueue.baseState=s,n.memoizedState=s,n.flags&256){i=oi(Error(D(423)),n),n=Xp(e,n,r,t,i);break e}else if(r!==i){i=oi(Error(D(424)),n),n=Xp(e,n,r,t,i);break e}else for(sn=jt(n.stateNode.containerInfo.firstChild),on=n,ce=!0,jn=null,t=V0(n,null,r,t),n.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(ri(),r===i){n=ot(e,n,t);break e}$e(e,n,r,t)}n=n.child}return n;case 5:return B0(n),e===null&&tc(n),r=n.type,i=n.pendingProps,s=e!==null?e.memoizedProps:null,o=i.children,Qu(r,i)?o=null:s!==null&&Qu(r,s)&&(n.flags|=32),hv(e,n),$e(e,n,o,t),n.child;case 6:return e===null&&tc(n),null;case 13:return gv(e,n,t);case 4:return Td(n,n.stateNode.containerInfo),r=n.pendingProps,e===null?n.child=ii(n,null,r,t):$e(e,n,r,t),n.child;case 11:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Cn(r,i),Kp(e,n,r,i,t);case 7:return $e(e,n,n.pendingProps,t),n.child;case 8:return $e(e,n,n.pendingProps.children,t),n.child;case 12:return $e(e,n,n.pendingProps.children,t),n.child;case 10:e:{if(r=n.type._context,i=n.pendingProps,s=n.memoizedProps,o=i.value,se(ga,r._currentValue),r._currentValue=o,s!==null)if(Rn(s.value,o)){if(s.children===i.children&&!Je.current){n=ot(e,n,t);break e}}else for(s=n.child,s!==null&&(s.return=n);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===r){if(s.tag===1){l=et(-1,t&-t),l.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var c=u.pending;c===null?l.next=l:(l.next=c.next,c.next=l),u.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),rc(s.return,t,n),a.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===n.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(D(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),rc(o,t,n),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===n){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}$e(e,n,i.children,t),n=n.child}return n;case 9:return i=n.type,r=n.pendingProps.children,Qr(n,t),i=wn(i),r=r(i),n.flags|=1,$e(e,n,r,t),n.child;case 14:return r=n.type,i=Cn(r,n.pendingProps),i=Cn(r.type,i),Yp(e,n,r,i,t);case 15:return fv(e,n,n.type,n.pendingProps,t);case 17:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Cn(r,i),Uo(e,n),n.tag=1,en(r)?(e=!0,pa(n)):e=!1,Qr(n,t),uv(n,r,i),sc(n,r,i,t),lc(null,n,r,!0,e,t);case 19:return vv(e,n,t);case 22:return pv(e,n,t)}throw Error(D(156,n.tag))};function Rv(e,n){return o0(e,n)}function pb(e,n,t,r){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function vn(e,n,t,r){return new pb(e,n,t,r)}function Bd(e){return e=e.prototype,!(!e||!e.isReactComponent)}function hb(e){if(typeof e=="function")return Bd(e)?1:0;if(e!=null){if(e=e.$$typeof,e===ld)return 11;if(e===ud)return 14}return 2}function At(e,n){var t=e.alternate;return t===null?(t=vn(e.tag,n,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=n,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&14680064,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,n=e.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t}function Ko(e,n,t,r,i,s){var o=2;if(r=e,typeof e=="function")Bd(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case Tr:return ir(t.children,i,s,n);case ad:o=8,i|=8;break;case zu:return e=vn(12,t,n,i|2),e.elementType=zu,e.lanes=s,e;case Eu:return e=vn(13,t,n,i),e.elementType=Eu,e.lanes=s,e;case Au:return e=vn(19,t,n,i),e.elementType=Au,e.lanes=s,e;case Bg:return cl(t,i,s,n);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case $g:o=10;break e;case Og:o=9;break e;case ld:o=11;break e;case ud:o=14;break e;case gt:o=16,r=null;break e}throw Error(D(130,e==null?e:typeof e,""))}return n=vn(o,t,n,i),n.elementType=e,n.type=r,n.lanes=s,n}function ir(e,n,t,r){return e=vn(7,e,r,n),e.lanes=t,e}function cl(e,n,t,r){return e=vn(22,e,r,n),e.elementType=Bg,e.lanes=t,e.stateNode={isHidden:!1},e}function tu(e,n,t){return e=vn(6,e,null,n),e.lanes=t,e}function ru(e,n,t){return n=vn(4,e.children!==null?e.children:[],e.key,n),n.lanes=t,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}function mb(e,n,t,r,i){this.tag=n,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Il(0),this.expirationTimes=Il(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Il(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Ud(e,n,t,r,i,s,o,a,l){return e=new mb(e,n,t,a,l),n===1?(n=1,s===!0&&(n|=8)):n=0,s=vn(3,null,null,n),e.current=s,s.stateNode=e,s.memoizedState={element:r,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},jd(s),e}function gb(e,n,t){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:jr,key:r==null?null:""+r,children:e,containerInfo:n,implementation:t}}function Nv(e){if(!e)return Lt;e=e._reactInternals;e:{if(yr(e)!==e||e.tag!==1)throw Error(D(170));var n=e;do{switch(n.tag){case 3:n=n.stateNode.context;break e;case 1:if(en(n.type)){n=n.stateNode.__reactInternalMemoizedMergedChildContext;break e}}n=n.return}while(n!==null);throw Error(D(171))}if(e.tag===1){var t=e.type;if(en(t))return N0(e,t,n)}return n}function Lv(e,n,t,r,i,s,o,a,l){return e=Ud(t,r,!0,e,i,s,o,a,l),e.context=Nv(null),t=e.current,r=Ue(),i=Et(t),s=et(r,i),s.callback=n??null,Tt(t,s,i),e.current.lanes=i,qs(e,i,r),nn(e,r),e}function dl(e,n,t,r){var i=n.current,s=Ue(),o=Et(i);return t=Nv(t),n.context===null?n.context=t:n.pendingContext=t,n=et(s,o),n.payload={element:e},r=r===void 0?null:r,r!==null&&(n.callback=r),e=Tt(i,n,o),e!==null&&(Mn(e,i,o,s),$o(e,i,o)),o}function Pa(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function oh(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<n?t:n}}function Hd(e,n){oh(e,n),(e=e.alternate)&&oh(e,n)}function vb(){return null}var Dv=typeof reportError=="function"?reportError:function(e){console.error(e)};function Wd(e){this._internalRoot=e}fl.prototype.render=Wd.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(D(409));dl(e,n,null,null)};fl.prototype.unmount=Wd.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;pr(function(){dl(null,e,null,null)}),n[it]=null}};function fl(e){this._internalRoot=e}fl.prototype.unstable_scheduleHydration=function(e){if(e){var n=p0();e={blockedOn:null,target:e,priority:n};for(var t=0;t<yt.length&&n!==0&&n<yt[t].priority;t++);yt.splice(t,0,e),t===0&&m0(e)}};function Kd(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function pl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function ah(){}function yb(e,n,t,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var u=Pa(o);s.call(u)}}var o=Lv(n,r,e,0,null,!1,!1,"",ah);return e._reactRootContainer=o,e[it]=o.current,vs(e.nodeType===8?e.parentNode:e),pr(),o}for(;i=e.lastChild;)e.removeChild(i);if(typeof r=="function"){var a=r;r=function(){var u=Pa(l);a.call(u)}}var l=Ud(e,0,!1,null,null,!1,!1,"",ah);return e._reactRootContainer=l,e[it]=l.current,vs(e.nodeType===8?e.parentNode:e),pr(function(){dl(n,l,t,r)}),l}function hl(e,n,t,r,i){var s=t._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var a=i;i=function(){var l=Pa(o);a.call(l)}}dl(n,o,e,i)}else o=yb(t,n,e,i,r);return Pa(o)}d0=function(e){switch(e.tag){case 3:var n=e.stateNode;if(n.current.memoizedState.isDehydrated){var t=Ii(n.pendingLanes);t!==0&&(fd(n,t|1),nn(n,xe()),!(J&6)&&(ai=xe()+500,$t()))}break;case 13:pr(function(){var r=st(e,1);if(r!==null){var i=Ue();Mn(r,e,1,i)}}),Hd(e,1)}};pd=function(e){if(e.tag===13){var n=st(e,134217728);if(n!==null){var t=Ue();Mn(n,e,134217728,t)}Hd(e,134217728)}};f0=function(e){if(e.tag===13){var n=Et(e),t=st(e,n);if(t!==null){var r=Ue();Mn(t,e,n,r)}Hd(e,n)}};p0=function(){return ne};h0=function(e,n){var t=ne;try{return ne=e,n()}finally{ne=t}};$u=function(e,n,t){switch(n){case"input":if(Nu(e,t),n=t.name,t.type==="radio"&&n!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+n)+'][type="radio"]'),n=0;n<t.length;n++){var r=t[n];if(r!==e&&r.form===e.form){var i=il(r);if(!i)throw Error(D(90));Hg(r),Nu(r,i)}}}break;case"textarea":Kg(e,t);break;case"select":n=t.value,n!=null&&Kr(e,!!t.multiple,n,!1)}};e0=Vd;n0=pr;var xb={usingClientEntryPoint:!1,Events:[$s,Mr,il,Zg,Jg,Vd]},Ti={findFiberByHostInstance:Zt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},_b={bundleType:Ti.bundleType,version:Ti.version,rendererPackageName:Ti.rendererPackageName,rendererConfig:Ti.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ct.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=i0(e),e===null?null:e.stateNode},findFiberByHostInstance:Ti.findFiberByHostInstance||vb,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ko=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ko.isDisabled&&ko.supportsFiber)try{el=ko.inject(_b),qn=ko}catch{}}dn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=xb;dn.createPortal=function(e,n){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Kd(n))throw Error(D(200));return gb(e,n,null,t)};dn.createRoot=function(e,n){if(!Kd(e))throw Error(D(299));var t=!1,r="",i=Dv;return n!=null&&(n.unstable_strictMode===!0&&(t=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),n=Ud(e,1,!1,null,null,t,!1,r,i),e[it]=n.current,vs(e.nodeType===8?e.parentNode:e),new Wd(n)};dn.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(D(188)):(e=Object.keys(e).join(","),Error(D(268,e)));return e=i0(n),e=e===null?null:e.stateNode,e};dn.flushSync=function(e){return pr(e)};dn.hydrate=function(e,n,t){if(!pl(n))throw Error(D(200));return hl(null,e,n,!0,t)};dn.hydrateRoot=function(e,n,t){if(!Kd(e))throw Error(D(405));var r=t!=null&&t.hydratedSources||null,i=!1,s="",o=Dv;if(t!=null&&(t.unstable_strictMode===!0&&(i=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),n=Lv(n,null,e,1,t??null,i,!1,s,o),e[it]=n.current,vs(e),r)for(e=0;e<r.length;e++)t=r[e],i=t._getVersion,i=i(t._source),n.mutableSourceEagerHydrationData==null?n.mutableSourceEagerHydrationData=[t,i]:n.mutableSourceEagerHydrationData.push(t,i);return new fl(n)};dn.render=function(e,n,t){if(!pl(n))throw Error(D(200));return hl(null,e,n,!1,t)};dn.unmountComponentAtNode=function(e){if(!pl(e))throw Error(D(40));return e._reactRootContainer?(pr(function(){hl(null,null,e,!1,function(){e._reactRootContainer=null,e[it]=null})}),!0):!1};dn.unstable_batchedUpdates=Vd;dn.unstable_renderSubtreeIntoContainer=function(e,n,t,r){if(!pl(t))throw Error(D(200));if(e==null||e._reactInternals===void 0)throw Error(D(38));return hl(e,n,t,!1,r)};dn.version="18.3.1-next-f1338f8080-20240426";function Iv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Iv)}catch(e){console.error(e)}}Iv(),Ig.exports=dn;var Fv=Ig.exports,qv,lh=Fv;qv=lh.createRoot,lh.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Ps(){return Ps=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},Ps.apply(this,arguments)}var bt;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(bt||(bt={}));const uh="popstate";function wb(e){e===void 0&&(e={});function n(i,s){let{pathname:o="/",search:a="",hash:l=""}=xr(i.location.hash.substr(1));return!o.startsWith("/")&&!o.startsWith(".")&&(o="/"+o),_c("",{pathname:o,search:a,hash:l},s.state&&s.state.usr||null,s.state&&s.state.key||"default")}function t(i,s){let o=i.document.querySelector("base"),a="";if(o&&o.getAttribute("href")){let l=i.location.href,u=l.indexOf("#");a=u===-1?l:l.slice(0,u)}return a+"#"+(typeof s=="string"?s:ja(s))}function r(i,s){ml(i.pathname.charAt(0)==="/","relative pathnames are not supported in hash history.push("+JSON.stringify(s)+")")}return kb(n,t,r,e)}function ve(e,n){if(e===!1||e===null||typeof e>"u")throw new Error(n)}function ml(e,n){if(!e){typeof console<"u"&&console.warn(n);try{throw new Error(n)}catch{}}}function bb(){return Math.random().toString(36).substr(2,8)}function ch(e,n){return{usr:e.state,key:e.key,idx:n}}function _c(e,n,t,r){return t===void 0&&(t=null),Ps({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof n=="string"?xr(n):n,{state:t,key:n&&n.key||r||bb()})}function ja(e){let{pathname:n="/",search:t="",hash:r=""}=e;return t&&t!=="?"&&(n+=t.charAt(0)==="?"?t:"?"+t),r&&r!=="#"&&(n+=r.charAt(0)==="#"?r:"#"+r),n}function xr(e){let n={};if(e){let t=e.indexOf("#");t>=0&&(n.hash=e.substr(t),e=e.substr(0,t));let r=e.indexOf("?");r>=0&&(n.search=e.substr(r),e=e.substr(0,r)),e&&(n.pathname=e)}return n}function kb(e,n,t,r){r===void 0&&(r={});let{window:i=document.defaultView,v5Compat:s=!1}=r,o=i.history,a=bt.Pop,l=null,u=c();u==null&&(u=0,o.replaceState(Ps({},o.state,{idx:u}),""));function c(){return(o.state||{idx:null}).idx}function d(){a=bt.Pop;let _=c(),h=_==null?null:_-u;u=_,l&&l({action:a,location:g.location,delta:h})}function f(_,h){a=bt.Push;let m=_c(g.location,_,h);t&&t(m,_),u=c()+1;let y=ch(m,u),x=g.createHref(m);try{o.pushState(y,"",x)}catch(k){if(k instanceof DOMException&&k.name==="DataCloneError")throw k;i.location.assign(x)}s&&l&&l({action:a,location:g.location,delta:1})}function p(_,h){a=bt.Replace;let m=_c(g.location,_,h);t&&t(m,_),u=c();let y=ch(m,u),x=g.createHref(m);o.replaceState(y,"",x),s&&l&&l({action:a,location:g.location,delta:0})}function v(_){let h=i.location.origin!=="null"?i.location.origin:i.location.href,m=typeof _=="string"?_:ja(_);return m=m.replace(/ $/,"%20"),ve(h,"No window.location.(origin|href) available to create URL for href: "+m),new URL(m,h)}let g={get action(){return a},get location(){return e(i,o)},listen(_){if(l)throw new Error("A history only accepts one active listener");return i.addEventListener(uh,d),l=_,()=>{i.removeEventListener(uh,d),l=null}},createHref(_){return n(i,_)},createURL:v,encodeLocation(_){let h=v(_);return{pathname:h.pathname,search:h.search,hash:h.hash}},push:f,replace:p,go(_){return o.go(_)}};return g}var dh;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(dh||(dh={}));function Sb(e,n,t){return t===void 0&&(t="/"),Cb(e,n,t)}function Cb(e,n,t,r){let i=typeof n=="string"?xr(n):n,s=li(i.pathname||"/",t);if(s==null)return null;let o=Vv(e);Pb(o);let a=null;for(let l=0;a==null&&l<o.length;++l){let u=Ib(s);a=Lb(o[l],u)}return a}function Vv(e,n,t,r){n===void 0&&(n=[]),t===void 0&&(t=[]),r===void 0&&(r="");let i=(s,o,a)=>{let l={relativePath:a===void 0?s.path||"":a,caseSensitive:s.caseSensitive===!0,childrenIndex:o,route:s};l.relativePath.startsWith("/")&&(ve(l.relativePath.startsWith(r),'Absolute route path "'+l.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),l.relativePath=l.relativePath.slice(r.length));let u=Mt([r,l.relativePath]),c=t.concat(l);s.children&&s.children.length>0&&(ve(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+u+'".')),Vv(s.children,n,c,u)),!(s.path==null&&!s.index)&&n.push({path:u,score:Rb(u,s.index),routesMeta:c})};return e.forEach((s,o)=>{var a;if(s.path===""||!((a=s.path)!=null&&a.includes("?")))i(s,o);else for(let l of $v(s.path))i(s,o,l)}),n}function $v(e){let n=e.split("/");if(n.length===0)return[];let[t,...r]=n,i=t.endsWith("?"),s=t.replace(/\?$/,"");if(r.length===0)return i?[s,""]:[s];let o=$v(r.join("/")),a=[];return a.push(...o.map(l=>l===""?s:[s,l].join("/"))),i&&a.push(...o),a.map(l=>e.startsWith("/")&&l===""?"/":l)}function Pb(e){e.sort((n,t)=>n.score!==t.score?t.score-n.score:Nb(n.routesMeta.map(r=>r.childrenIndex),t.routesMeta.map(r=>r.childrenIndex)))}const jb=/^:[\w-]+$/,Tb=3,zb=2,Eb=1,Ab=10,Mb=-2,fh=e=>e==="*";function Rb(e,n){let t=e.split("/"),r=t.length;return t.some(fh)&&(r+=Mb),n&&(r+=zb),t.filter(i=>!fh(i)).reduce((i,s)=>i+(jb.test(s)?Tb:s===""?Eb:Ab),r)}function Nb(e,n){return e.length===n.length&&e.slice(0,-1).every((r,i)=>r===n[i])?e[e.length-1]-n[n.length-1]:0}function Lb(e,n,t){let{routesMeta:r}=e,i={},s="/",o=[];for(let a=0;a<r.length;++a){let l=r[a],u=a===r.length-1,c=s==="/"?n:n.slice(s.length)||"/",d=wc({path:l.relativePath,caseSensitive:l.caseSensitive,end:u},c),f=l.route;if(!d)return null;Object.assign(i,d.params),o.push({params:i,pathname:Mt([s,d.pathname]),pathnameBase:Ob(Mt([s,d.pathnameBase])),route:f}),d.pathnameBase!=="/"&&(s=Mt([s,d.pathnameBase]))}return o}function wc(e,n){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[t,r]=Db(e.path,e.caseSensitive,e.end),i=n.match(t);if(!i)return null;let s=i[0],o=s.replace(/(.)\/+$/,"$1"),a=i.slice(1);return{params:r.reduce((u,c,d)=>{let{paramName:f,isOptional:p}=c;if(f==="*"){let g=a[d]||"";o=s.slice(0,s.length-g.length).replace(/(.)\/+$/,"$1")}const v=a[d];return p&&!v?u[f]=void 0:u[f]=(v||"").replace(/%2F/g,"/"),u},{}),pathname:s,pathnameBase:o,pattern:e}}function Db(e,n,t){n===void 0&&(n=!1),t===void 0&&(t=!0),ml(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let r=[],i="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,a,l)=>(r.push({paramName:a,isOptional:l!=null}),l?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(r.push({paramName:"*"}),i+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):t?i+="\\/*$":e!==""&&e!=="/"&&(i+="(?:(?=\\/|$))"),[new RegExp(i,n?void 0:"i"),r]}function Ib(e){try{return e.split("/").map(n=>decodeURIComponent(n).replace(/\//g,"%2F")).join("/")}catch(n){return ml(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+n+").")),e}}function li(e,n){if(n==="/")return e;if(!e.toLowerCase().startsWith(n.toLowerCase()))return null;let t=n.endsWith("/")?n.length-1:n.length,r=e.charAt(t);return r&&r!=="/"?null:e.slice(t)||"/"}const Fb=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,qb=e=>Fb.test(e);function Vb(e,n){n===void 0&&(n="/");let{pathname:t,search:r="",hash:i=""}=typeof e=="string"?xr(e):e,s;if(t)if(qb(t))s=t;else{if(t.includes("//")){let o=t;t=t.replace(/\/\/+/g,"/"),ml(!1,"Pathnames cannot have embedded double slashes - normalizing "+(o+" -> "+t))}t.startsWith("/")?s=ph(t.substring(1),"/"):s=ph(t,n)}else s=n;return{pathname:s,search:Bb(r),hash:Ub(i)}}function ph(e,n){let t=n.replace(/\/+$/,"").split("/");return e.split("/").forEach(i=>{i===".."?t.length>1&&t.pop():i!=="."&&t.push(i)}),t.length>1?t.join("/"):"/"}function iu(e,n,t,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+n+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+t+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function $b(e){return e.filter((n,t)=>t===0||n.route.path&&n.route.path.length>0)}function Ov(e,n){let t=$b(e);return n?t.map((r,i)=>i===t.length-1?r.pathname:r.pathnameBase):t.map(r=>r.pathnameBase)}function Bv(e,n,t,r){r===void 0&&(r=!1);let i;typeof e=="string"?i=xr(e):(i=Ps({},e),ve(!i.pathname||!i.pathname.includes("?"),iu("?","pathname","search",i)),ve(!i.pathname||!i.pathname.includes("#"),iu("#","pathname","hash",i)),ve(!i.search||!i.search.includes("#"),iu("#","search","hash",i)));let s=e===""||i.pathname==="",o=s?"/":i.pathname,a;if(o==null)a=t;else{let d=n.length-1;if(!r&&o.startsWith("..")){let f=o.split("/");for(;f[0]==="..";)f.shift(),d-=1;i.pathname=f.join("/")}a=d>=0?n[d]:"/"}let l=Vb(i,a),u=o&&o!=="/"&&o.endsWith("/"),c=(s||o===".")&&t.endsWith("/");return!l.pathname.endsWith("/")&&(u||c)&&(l.pathname+="/"),l}const Mt=e=>e.join("/").replace(/\/\/+/g,"/"),Ob=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Bb=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Ub=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Hb(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const Uv=["post","put","patch","delete"];new Set(Uv);const Wb=["get",...Uv];new Set(Wb);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function js(){return js=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},js.apply(this,arguments)}const gl=S.createContext(null),Hv=S.createContext(null),Ot=S.createContext(null),vl=S.createContext(null),dt=S.createContext({outlet:null,matches:[],isDataRoute:!1}),Wv=S.createContext(null);function Kb(e,n){let{relative:t}=n===void 0?{}:n;Bs()||ve(!1);let{basename:r,navigator:i}=S.useContext(Ot),{hash:s,pathname:o,search:a}=yl(e,{relative:t}),l=o;return r!=="/"&&(l=o==="/"?r:Mt([r,o])),i.createHref({pathname:l,search:a,hash:s})}function Bs(){return S.useContext(vl)!=null}function _r(){return Bs()||ve(!1),S.useContext(vl).location}function Kv(e){S.useContext(Ot).static||S.useLayoutEffect(e)}function Us(){let{isDataRoute:e}=S.useContext(dt);return e?u2():Yb()}function Yb(){Bs()||ve(!1);let e=S.useContext(gl),{basename:n,future:t,navigator:r}=S.useContext(Ot),{matches:i}=S.useContext(dt),{pathname:s}=_r(),o=JSON.stringify(Ov(i,t.v7_relativeSplatPath)),a=S.useRef(!1);return Kv(()=>{a.current=!0}),S.useCallback(function(u,c){if(c===void 0&&(c={}),!a.current)return;if(typeof u=="number"){r.go(u);return}let d=Bv(u,JSON.parse(o),s,c.relative==="path");e==null&&n!=="/"&&(d.pathname=d.pathname==="/"?n:Mt([n,d.pathname])),(c.replace?r.replace:r.push)(d,c.state,c)},[n,r,o,s,e])}const Gb=S.createContext(null);function Xb(e){let n=S.useContext(dt).outlet;return n&&S.createElement(Gb.Provider,{value:e},n)}function Qb(){let{matches:e}=S.useContext(dt),n=e[e.length-1];return n?n.params:{}}function yl(e,n){let{relative:t}=n===void 0?{}:n,{future:r}=S.useContext(Ot),{matches:i}=S.useContext(dt),{pathname:s}=_r(),o=JSON.stringify(Ov(i,r.v7_relativeSplatPath));return S.useMemo(()=>Bv(e,JSON.parse(o),s,t==="path"),[e,o,s,t])}function Zb(e,n){return Jb(e,n)}function Jb(e,n,t,r){Bs()||ve(!1);let{navigator:i}=S.useContext(Ot),{matches:s}=S.useContext(dt),o=s[s.length-1],a=o?o.params:{};o&&o.pathname;let l=o?o.pathnameBase:"/";o&&o.route;let u=_r(),c;if(n){var d;let _=typeof n=="string"?xr(n):n;l==="/"||(d=_.pathname)!=null&&d.startsWith(l)||ve(!1),c=_}else c=u;let f=c.pathname||"/",p=f;if(l!=="/"){let _=l.replace(/^\//,"").split("/");p="/"+f.replace(/^\//,"").split("/").slice(_.length).join("/")}let v=Sb(e,{pathname:p}),g=i2(v&&v.map(_=>Object.assign({},_,{params:Object.assign({},a,_.params),pathname:Mt([l,i.encodeLocation?i.encodeLocation(_.pathname).pathname:_.pathname]),pathnameBase:_.pathnameBase==="/"?l:Mt([l,i.encodeLocation?i.encodeLocation(_.pathnameBase).pathname:_.pathnameBase])})),s,t,r);return n&&g?S.createElement(vl.Provider,{value:{location:js({pathname:"/",search:"",hash:"",state:null,key:"default"},c),navigationType:bt.Pop}},g):g}function e2(){let e=l2(),n=Hb(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),t=e instanceof Error?e.stack:null,i={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return S.createElement(S.Fragment,null,S.createElement("h2",null,"Unexpected Application Error!"),S.createElement("h3",{style:{fontStyle:"italic"}},n),t?S.createElement("pre",{style:i},t):null,null)}const n2=S.createElement(e2,null);class t2 extends S.Component{constructor(n){super(n),this.state={location:n.location,revalidation:n.revalidation,error:n.error}}static getDerivedStateFromError(n){return{error:n}}static getDerivedStateFromProps(n,t){return t.location!==n.location||t.revalidation!=="idle"&&n.revalidation==="idle"?{error:n.error,location:n.location,revalidation:n.revalidation}:{error:n.error!==void 0?n.error:t.error,location:t.location,revalidation:n.revalidation||t.revalidation}}componentDidCatch(n,t){console.error("React Router caught the following error during render",n,t)}render(){return this.state.error!==void 0?S.createElement(dt.Provider,{value:this.props.routeContext},S.createElement(Wv.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function r2(e){let{routeContext:n,match:t,children:r}=e,i=S.useContext(gl);return i&&i.static&&i.staticContext&&(t.route.errorElement||t.route.ErrorBoundary)&&(i.staticContext._deepestRenderedBoundaryId=t.route.id),S.createElement(dt.Provider,{value:n},r)}function i2(e,n,t,r){var i;if(n===void 0&&(n=[]),t===void 0&&(t=null),r===void 0&&(r=null),e==null){var s;if(!t)return null;if(t.errors)e=t.matches;else if((s=r)!=null&&s.v7_partialHydration&&n.length===0&&!t.initialized&&t.matches.length>0)e=t.matches;else return null}let o=e,a=(i=t)==null?void 0:i.errors;if(a!=null){let c=o.findIndex(d=>d.route.id&&(a==null?void 0:a[d.route.id])!==void 0);c>=0||ve(!1),o=o.slice(0,Math.min(o.length,c+1))}let l=!1,u=-1;if(t&&r&&r.v7_partialHydration)for(let c=0;c<o.length;c++){let d=o[c];if((d.route.HydrateFallback||d.route.hydrateFallbackElement)&&(u=c),d.route.id){let{loaderData:f,errors:p}=t,v=d.route.loader&&f[d.route.id]===void 0&&(!p||p[d.route.id]===void 0);if(d.route.lazy||v){l=!0,u>=0?o=o.slice(0,u+1):o=[o[0]];break}}}return o.reduceRight((c,d,f)=>{let p,v=!1,g=null,_=null;t&&(p=a&&d.route.id?a[d.route.id]:void 0,g=d.route.errorElement||n2,l&&(u<0&&f===0?(c2("route-fallback"),v=!0,_=null):u===f&&(v=!0,_=d.route.hydrateFallbackElement||null)));let h=n.concat(o.slice(0,f+1)),m=()=>{let y;return p?y=g:v?y=_:d.route.Component?y=S.createElement(d.route.Component,null):d.route.element?y=d.route.element:y=c,S.createElement(r2,{match:d,routeContext:{outlet:c,matches:h,isDataRoute:t!=null},children:y})};return t&&(d.route.ErrorBoundary||d.route.errorElement||f===0)?S.createElement(t2,{location:t.location,revalidation:t.revalidation,component:g,error:p,children:m(),routeContext:{outlet:null,matches:h,isDataRoute:!0}}):m()},null)}var Yv=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(Yv||{}),Gv=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(Gv||{});function s2(e){let n=S.useContext(gl);return n||ve(!1),n}function o2(e){let n=S.useContext(Hv);return n||ve(!1),n}function a2(e){let n=S.useContext(dt);return n||ve(!1),n}function Xv(e){let n=a2(),t=n.matches[n.matches.length-1];return t.route.id||ve(!1),t.route.id}function l2(){var e;let n=S.useContext(Wv),t=o2(),r=Xv();return n!==void 0?n:(e=t.errors)==null?void 0:e[r]}function u2(){let{router:e}=s2(Yv.UseNavigateStable),n=Xv(Gv.UseNavigateStable),t=S.useRef(!1);return Kv(()=>{t.current=!0}),S.useCallback(function(i,s){s===void 0&&(s={}),t.current&&(typeof i=="number"?e.navigate(i):e.navigate(i,js({fromRouteId:n},s)))},[e,n])}const hh={};function c2(e,n,t){hh[e]||(hh[e]=!0)}function d2(e,n){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function f2(e){return Xb(e.context)}function qi(e){ve(!1)}function p2(e){let{basename:n="/",children:t=null,location:r,navigationType:i=bt.Pop,navigator:s,static:o=!1,future:a}=e;Bs()&&ve(!1);let l=n.replace(/^\/*/,"/"),u=S.useMemo(()=>({basename:l,navigator:s,static:o,future:js({v7_relativeSplatPath:!1},a)}),[l,a,s,o]);typeof r=="string"&&(r=xr(r));let{pathname:c="/",search:d="",hash:f="",state:p=null,key:v="default"}=r,g=S.useMemo(()=>{let _=li(c,l);return _==null?null:{location:{pathname:_,search:d,hash:f,state:p,key:v},navigationType:i}},[l,c,d,f,p,v,i]);return g==null?null:S.createElement(Ot.Provider,{value:u},S.createElement(vl.Provider,{children:t,value:g}))}function h2(e){let{children:n,location:t}=e;return Zb(bc(n),t)}new Promise(()=>{});function bc(e,n){n===void 0&&(n=[]);let t=[];return S.Children.forEach(e,(r,i)=>{if(!S.isValidElement(r))return;let s=[...n,i];if(r.type===S.Fragment){t.push.apply(t,bc(r.props.children,s));return}r.type!==qi&&ve(!1),!r.props.index||!r.props.children||ve(!1);let o={id:r.props.id||s.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(o.children=bc(r.props.children,s)),t.push(o)}),t}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Ta(){return Ta=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},Ta.apply(this,arguments)}function Qv(e,n){if(e==null)return{};var t={},r=Object.keys(e),i,s;for(s=0;s<r.length;s++)i=r[s],!(n.indexOf(i)>=0)&&(t[i]=e[i]);return t}function m2(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function g2(e,n){return e.button===0&&(!n||n==="_self")&&!m2(e)}function kc(e){return e===void 0&&(e=""),new URLSearchParams(typeof e=="string"||Array.isArray(e)||e instanceof URLSearchParams?e:Object.keys(e).reduce((n,t)=>{let r=e[t];return n.concat(Array.isArray(r)?r.map(i=>[t,i]):[[t,r]])},[]))}function v2(e,n){let t=kc(e);return n&&n.forEach((r,i)=>{t.has(i)||n.getAll(i).forEach(s=>{t.append(i,s)})}),t}const y2=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],x2=["aria-current","caseSensitive","className","end","style","to","viewTransition","children"],_2="6";try{window.__reactRouterVersion=_2}catch{}const w2=S.createContext({isTransitioning:!1}),b2="startTransition",mh=c_[b2];function k2(e){let{basename:n,children:t,future:r,window:i}=e,s=S.useRef();s.current==null&&(s.current=wb({window:i,v5Compat:!0}));let o=s.current,[a,l]=S.useState({action:o.action,location:o.location}),{v7_startTransition:u}=r||{},c=S.useCallback(d=>{u&&mh?mh(()=>l(d)):l(d)},[l,u]);return S.useLayoutEffect(()=>o.listen(c),[o,c]),S.useEffect(()=>d2(r),[r]),S.createElement(p2,{basename:n,children:t,location:a.location,navigationType:a.action,navigator:o,future:r})}const S2=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",C2=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,at=S.forwardRef(function(n,t){let{onClick:r,relative:i,reloadDocument:s,replace:o,state:a,target:l,to:u,preventScrollReset:c,viewTransition:d}=n,f=Qv(n,y2),{basename:p}=S.useContext(Ot),v,g=!1;if(typeof u=="string"&&C2.test(u)&&(v=u,S2))try{let y=new URL(window.location.href),x=u.startsWith("//")?new URL(y.protocol+u):new URL(u),k=li(x.pathname,p);x.origin===y.origin&&k!=null?u=k+x.search+x.hash:g=!0}catch{}let _=Kb(u,{relative:i}),h=j2(u,{replace:o,state:a,target:l,preventScrollReset:c,relative:i,viewTransition:d});function m(y){r&&r(y),y.defaultPrevented||h(y)}return S.createElement("a",Ta({},f,{href:v||_,onClick:g||s?r:m,ref:t,target:l}))}),gh=S.forwardRef(function(n,t){let{"aria-current":r="page",caseSensitive:i=!1,className:s="",end:o=!1,style:a,to:l,viewTransition:u,children:c}=n,d=Qv(n,x2),f=yl(l,{relative:d.relative}),p=_r(),v=S.useContext(Hv),{navigator:g,basename:_}=S.useContext(Ot),h=v!=null&&T2(f)&&u===!0,m=g.encodeLocation?g.encodeLocation(f).pathname:f.pathname,y=p.pathname,x=v&&v.navigation&&v.navigation.location?v.navigation.location.pathname:null;i||(y=y.toLowerCase(),x=x?x.toLowerCase():null,m=m.toLowerCase()),x&&_&&(x=li(x,_)||x);const k=m!=="/"&&m.endsWith("/")?m.length-1:m.length;let C=y===m||!o&&y.startsWith(m)&&y.charAt(k)==="/",T=x!=null&&(x===m||!o&&x.startsWith(m)&&x.charAt(m.length)==="/"),j={isActive:C,isPending:T,isTransitioning:h},F=C?r:void 0,I;typeof s=="function"?I=s(j):I=[s,C?"active":null,T?"pending":null,h?"transitioning":null].filter(Boolean).join(" ");let O=typeof a=="function"?a(j):a;return S.createElement(at,Ta({},d,{"aria-current":F,className:I,ref:t,style:O,to:l,viewTransition:u}),typeof c=="function"?c(j):c)});var Sc;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(Sc||(Sc={}));var vh;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(vh||(vh={}));function P2(e){let n=S.useContext(gl);return n||ve(!1),n}function j2(e,n){let{target:t,replace:r,state:i,preventScrollReset:s,relative:o,viewTransition:a}=n===void 0?{}:n,l=Us(),u=_r(),c=yl(e,{relative:o});return S.useCallback(d=>{if(g2(d,t)){d.preventDefault();let f=r!==void 0?r:ja(u)===ja(c);l(e,{replace:f,state:i,preventScrollReset:s,relative:o,viewTransition:a})}},[u,l,c,r,i,t,e,s,o,a])}function Yd(e){let n=S.useRef(kc(e)),t=S.useRef(!1),r=_r(),i=S.useMemo(()=>v2(r.search,t.current?null:n.current),[r.search]),s=Us(),o=S.useCallback((a,l)=>{const u=kc(typeof a=="function"?a(i):a);t.current=!0,s("?"+u,l)},[s,i]);return[i,o]}function T2(e,n){n===void 0&&(n={});let t=S.useContext(w2);t==null&&ve(!1);let{basename:r}=P2(Sc.useViewTransitionState),i=yl(e,{relative:n.relative});if(!t.isTransitioning)return!1;let s=li(t.currentLocation.pathname,r)||t.currentLocation.pathname,o=li(t.nextLocation.pathname,r)||t.nextLocation.pathname;return wc(i.pathname,o)!=null||wc(i.pathname,s)!=null}const z2=()=>w.jsx("svg",{className:"w-12 md:w-8",viewBox:"0 0 40 40",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:w.jsx("path",{d:"M18 16.25H15V7.5H12V16.25H9V7.5H6V16.25C6 18.9 8.49 21.05 11.625 21.2125V32.5H15.375V21.2125C18.51 21.05 21 18.9 21 16.25V7.5H18V16.25ZM25.5 12.5V22.5H29.25V32.5H33V7.5C28.86 7.5 25.5 10.3 25.5 12.5Z",fill:"currentColor"})}),E2=()=>w.jsx("svg",{className:"w-12 md:w-8",viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:w.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M13 21.5C13 16.8056 16.8056 13 21.5 13C26.1944 13 30 16.8056 30 21.5C30 23.8248 29.0667 25.9315 27.5544 27.4661C27.5392 27.4801 27.5241 27.4946 27.5093 27.5093C27.4946 27.5241 27.4801 27.5392 27.4661 27.5544C25.9315 29.0667 23.8248 30 21.5 30C16.8056 30 13 26.1944 13 21.5ZM28.502 30.6233C26.5628 32.1139 24.1349 33 21.5 33C15.1487 33 10 27.8513 10 21.5C10 15.1487 15.1487 10 21.5 10C27.8513 10 33 15.1487 33 21.5C33 24.1349 32.1139 26.5628 30.6233 28.502L37.5607 35.4393C38.1464 36.0251 38.1464 36.9749 37.5607 37.5607C36.9749 38.1465 36.0251 38.1465 35.4393 37.5607L28.502 30.6233Z",fill:"currentColor"})}),A2=()=>w.jsx("svg",{className:"w-12 md:w-8",viewBox:"0 0 48 48",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:w.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M24 8C17.9256 8 13 12.9256 13 19V28.5C13 29.8816 11.8816 31 10.5 31C9.67157 31 9 31.6716 9 32.5C9 33.3284 9.67157 34 10.5 34H37.5C38.3284 34 39 33.3284 39 32.5C39 31.6716 38.3284 31 37.5 31C36.1184 31 35 29.8816 35 28.5V19C35 12.9256 30.0744 8 24 8ZM32 28.5C32 29.4003 32.2161 30.25 32.5994 31H15.4006C15.7839 30.25 16 29.4003 16 28.5V19C16 14.5824 19.5824 11 24 11C28.4176 11 32 14.5824 32 19V28.5ZM26.4 36C26.702 36 26.986 36.136 27.176 36.37C27.366 36.604 27.442 36.912 27.38 37.206C27.034 38.85 25.644 40 24.002 40C22.36 40 20.97 38.85 20.624 37.206C20.562 36.912 20.636 36.604 20.826 36.37C21.016 36.136 21.3 36 21.602 36H26.4Z",fill:"#212121"})}),M2=()=>w.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",children:w.jsx("path",{fillRule:"evenodd",d:"M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z",clipRule:"evenodd"})});function R2(){const e=S.useRef(null),n=S.useRef(null),t=S.useRef(0);S.useEffect(()=>{const i=n.current;if(!i)return;function s(){if(!i||!window.matchMedia("(max-width: 767px)").matches)return;const a=window.scrollY;a>t.current&&a>6?(i.classList.add("nav-hidden"),i.classList.remove("nav-visible")):(i.classList.remove("nav-hidden"),i.classList.add("nav-visible")),t.current=a}return window.addEventListener("scroll",s,{passive:!0}),()=>window.removeEventListener("scroll",s)},[]),S.useEffect(()=>{const i=e.current;if(!i)return;const s=i.querySelector("#desktop-edge-strip");function o(){i.classList.add("desktop-sidebar-expanded"),s==null||s.classList.remove("desktop-edge-strip--visible")}function a(){i.classList.remove("desktop-sidebar-expanded")}function l(){i.classList.contains("desktop-sidebar-expanded")||s==null||s.classList.add("desktop-edge-strip--visible")}function u(){s==null||s.classList.remove("desktop-edge-strip--visible")}return i.addEventListener("mouseenter",o),i.addEventListener("mouseleave",a),s==null||s.addEventListener("mouseenter",l),s==null||s.addEventListener("mouseleave",u),()=>{i.removeEventListener("mouseenter",o),i.removeEventListener("mouseleave",a),s==null||s.removeEventListener("mouseenter",l),s==null||s.removeEventListener("mouseleave",u)}},[]);const r=({isActive:i})=>`flex flex-col md:flex-row items-center gap-0 md:gap-2${i?" text-primary":""}`;return w.jsxs("div",{className:"desktop-sidebar-wrap",ref:e,id:"desktop-sidebar-wrap",children:[w.jsx("div",{id:"desktop-edge-strip",className:"md:block hidden","aria-hidden":"true"}),w.jsxs("div",{className:"desktop-sidebar-panel",children:[w.jsxs("nav",{ref:n,className:"mobile-nav nav-visible w-screen md:w-full md:h-full bg-orange-50 fixed md:relative left-0 right-0 bottom-0 overflow-x-hidden flex md:flex-col justify-between md:justify-start px-6 py-4 md:p-5 md:gap-3 z-[9999] shadow-3xl md:shadow-none",id:"main-nav","aria-expanded":"false",style:{viewTransitionName:"vt-nav"},children:[w.jsxs(gh,{to:"/",end:!0,className:r,children:[w.jsx(z2,{}),w.jsx("span",{className:"text-sm md:text-xl font-medium md:font-gelica",children:"Accueil"})]}),w.jsxs(gh,{to:"/recherche",className:r,children:[w.jsx(E2,{}),w.jsx("span",{className:"text-sm md:text-xl font-medium md:font-gelica",children:"Recherche"})]}),w.jsxs("a",{href:"https://github.com/DSestu/recettes-cuisine",className:"flex flex-col md:flex-row items-center gap-0 md:gap-2",target:"_blank",rel:"noreferrer",children:[w.jsx(A2,{}),w.jsx("span",{className:"text-sm md:text-xl font-medium md:font-gelica",children:"Repository"})]})]}),w.jsx("button",{type:"button",id:"desktop-sidebar-open-btn",className:"hidden md:flex","aria-label":"Ouvrir le menu",title:"Ouvrir le menu",children:w.jsx(M2,{})})]})]})}function yh(e){return e==="/"||e===""?"home":e.startsWith("/recherche")?"search":e.startsWith("/recette/")?"recipe":"other"}function N2(){const e=Us(),n=_r(),t=S.useRef(e),r=S.useRef(n);return t.current=e,r.current=n,S.useEffect(()=>{function i(s){const o=s.target.closest("a");if(!o)return;const a=o.getAttribute("href");if(!a)return;let l;if(a==="#/"||a==="#")l="/";else if(a.startsWith("#/"))l=a.slice(1);else return;s.preventDefault(),s.stopPropagation();const u=yh(r.current.pathname),c=yh(l);u==="recipe"&&c==="recipe"&&document.querySelectorAll(".recipe-image-panel, .post-content").forEach(f=>{f.style.viewTransitionName=""});const d=()=>{Fv.flushSync(()=>t.current(l))};if(!("startViewTransition"in document)){t.current(l);return}try{document.startViewTransition({types:[`from-${u}`,`to-${c}`],update:d})}catch{document.startViewTransition(d)}}return document.addEventListener("click",i,{capture:!0}),()=>document.removeEventListener("click",i,{capture:!0})},[]),w.jsxs("div",{className:"flex min-h-screen w-full font-inter bg-orange-50 text-orange-950",children:[w.jsx(R2,{}),w.jsx("main",{className:"relative flex-1 w-full",children:w.jsx(f2,{})})]})}const L2=`---\r
layout: recipe\r
title: "Boulettes de tofu avec sauce Ankake aux champignons"\r
image:  tofu_meatball_with_mushroom_ankake_sauce\r
\r
tags:\r
- entrée\r
- japon\r
- voyage\r
- poulet\r
- tofu\r
- poireau japonais\r
- fécule de pomme de terre\r
- sel\r
- saké\r
- boulettes\r
- poêle\r
- vapeur\r
\r
ingredients:\r
- 40g de poulet haché\r
- 20g de tofu\r
- poireau japonais\r
- une pincée de sel\r
- 1/2 c. à café de fécule de pomme de terre\r
\r
directions:\r
- Enveloppez le tofu dans du papier absorbant et posez un poids léger dessus pour l'égoutter.\r
- Hachez finement le poireau. Mélangez dans un bol le poulet haché, le tofu, le poireau, le sel et la fécule de pomme de terre. Divisez la préparation en deux et façonnez des ovales.\r
- Faites chauffer de l'huile dans une poêle et faites revenir les boulettes. Retournez-les lorsqu'un côté est bien doré.\r
- Versez du saké. Couvrez et laissez cuire à la vapeur jusqu'à évaporation du saké, puis retirez les boulettes.\r
- Ajoutez la sauce Ankake.\r
\r
components:\r
- Sauce ankake aux champignons\r
- Dashi\r
---\r
\r
Pour 1 personne.\r
`,D2=`---\r
\r
layout: recipe\r
title: "Aiguillettes de poulet au miel et au cidre"\r
image: aiguillettes_de_poulet_au_miel_et_au_cidre\r
\r
tags:\r
- repas\r
- plat\r
- poele\r
- sucre-sale\r
- facile\r
- poulet\r
- miel\r
- cidre\r
- poire\r
- oignon\r
- echalotes\r
- persil\r
- creme\r
- sauce soja\r
- livre\r
- gourmand\r
\r
ingredients:\r
- 400 g d'aiguillettes de poulet\r
- 200 g de poires\r
- 1 oignon\r
- 1 échalote\r
- 25 g de persil\r
- 1 cl de crème liquide\r
- 20 cl de cidre demi-sec\r
- 4 cl de sauce soja salée\r
- 25 g de miel\r
- 2 c. à soupe d'huile végétale\r
- 1 cube de bouillon de légumes\r
\r
---\r
\r
Pour 4 personnes. Préparation : 30 min. Cuisson : 30 min.\r
\r
## Préparation\r
\r
- Saisir les aiguillettes dans 1 cuillerée à soupe d'huile et les dorer de chaque côté, saler et poivrer puis réserver.\r
- Peler l'oignon et l'échalote, les ciseler et les faire revenir dans la même poêle pendant quelques minutes. Déglacer au cidre puis laisser réduire de moitié.\r
- Ajouter le miel, la sauce soja et le cube de bouillon émietté. Mélanger et faire de nouveau réduire.\r
- Éplucher les poires et les couper en quartiers, les incorporer à la sauce et laisser mijoter 10 minutes.\r
- Lier la sauce avec la crème liquide.\r
- Déposer les aiguillettes dans la préparation pour les réchauffer. Saupoudrer de persil plat et servir.\r
`,I2=`---
layout: recipe
title: "Bavette sauce au vin"
image: bavette_sauce_au_vin

tags:
- repas
- plat
- plat principal
- viande
- boeuf
- bavette
- vin rouge
- sauce
- fond de veau
- beurre
- chaud
- gourmand

ingredients:
- 1 kg de bavette de bœuf
- 20 g de beurre
- 2 c. à soupe d'huile
- Sel et poivre

components:
- Sauce au vin rouge
---

Pour 6 personnes. Préparation : 25 min. Cuisson : 25 min.

## Préparation

- Préparer la *Sauce au vin rouge* — voir composant.
- Saisir la bavette (entière ou détaillée en steaks) avec le beurre et l'huile bien chauds, 2 minutes de chaque côté à feu vif, puis 3 à 4 minutes à feu moyen de chaque côté, selon le degré de cuisson désiré. Retirer de la poêle. Couvrir et laisser reposer quelques minutes.
- Rincer et sécher la poêle, réchauffer la sauce dedans puis déposer la bavette, laisser chauffer 2 à 3 minutes à feu doux. Accompagner de frites de polenta ou de pommes de terre.
`,F2=`---
layout: recipe
title: "Beignets italiens à la ricotta"
image: beignets_italiens_ricotta

tags:
- dessert
- sestu
- beignets
- friture
- ricotta
- farine
- sucre
- oeufs
- lait
- huile
- levure chimique

ingredients:
- 250 g de ricotta
- 80 g de sucre
- 40 g de jaune d'œuf (environ 2 jaunes)
- 50 g d'huile
- 80 ml de lait
- 16 g de levure chimique
- farine (quantité ajustée pour obtenir une pâte épaisse)
- huile pour la friture
- sucre glace (pour saupoudrer)
---

## Préparation

- Dans un saladier, mélanger la ricotta, le sucre et les jaunes d'œufs jusqu'à obtenir une crème lisse.
- Ajouter l'huile et le lait, mélanger.
- Incorporer la farine et la levure chimique jusqu'à obtenir une pâte épaisse mais souple.
- Façonner des petites boules ou des bâtonnets.
- Faire chauffer l'huile de friture et y plonger les beignets jusqu'à ce qu'ils soient dorés.
- Égoutter sur papier absorbant et saupoudrer de sucre glace avant de servir.
`,q2=`---
layout: recipe
title: "Blanquette de veau"
image: blanquette_de_veau

tags:
- repas
- plat
- gourmand
- chaud
- veau
- champignons
- carottes
- celeri
- oignon
- laurier
- creme
- beurre
- farine
- clous de girofle
- citron
- ciboulette

ingredients:
- 1,2 kg de morceaux de veau
- 2 carottes
- 1 branche de céleri
- 250 g de champignons de Paris
- ½ citron (jus)
- 1 oignon
- 1 c. à soupe de ciboulette ciselée (facultatif)
- 1 feuille de laurier
- 20 cl de crème entière épaisse
- 85 g de beurre mou
- 70 g de farine
- 3 clous de girofle
- Sel et poivre
---

Pour 6 personnes. Préparation : 20 min. Cuisson : 1h20.

## Préparation

- Pelez l'oignon et ciselez-le. Effilez le céleri et émincez-le. Épluchez les carottes et coupez-les en morceaux.
- Mettez la viande, le céleri, l'oignon, les carottes, les clous de girofle, le laurier et 1 pincée de sel dans une grande cocotte. Couvrez d'eau à hauteur. Portez à ébullition et écumez si nécessaire. Laissez cuire ensuite à petits frémissements pendant 1 heure. Filtrez le bouillon.
- Préparez un roux blanc : mélangez 70 g de beurre et la farine dans une casserole, versez le bouillon chaud par-dessus et portez à ébullition en mélangeant sans cesse. Ajoutez la crème et laissez cuire jusqu'à l'obtention d'une sauce crémeuse. Remettez la viande et les légumes dans la cocotte, mélangez.
- Coupez les champignons en 2. Mettez dans une casserole le beurre restant, le jus de citron et 1 cuillère à soupe d'eau. Portez à ébullition, ajoutez les champignons et laissez cuire à feu moyen 5 à 10 minutes.
- Ajoutez les champignons à la blanquette dans la cocotte, mélangez, poivrez et parsemez de ciboulette.
`,V2=`---\r
\r
layout: recipe\r
title:  "Bouillon Emilia"\r
image: bouillon_emilia\r
\r
\r
tags:\r
- ail\r
- bouillon\r
- carottes\r
- céleri\r
- clous de girofle\r
- laurier\r
- oignon\r
- poireaux\r
- pommes de terre\r
- repas\r
- sestu\r
- soupe\r
- thym\r
- tomates\r
- traditionnel\r
- viande\r
- emilia\r
\r
ingredients:\r
- 1kg de viande (e.g. plat de côte, jarret de bœuf, langue de boeuf). Le jarret contient des os à moelle.\r
- Gros plus avec plusieurs os à moelle potentiellement à rajouter\r
- 500g de carottes\r
- 3-4 poireaux\r
- 1 oignon\r
- 3-4 gousses d'ail\r
- 1 feuille de laurier\r
- 3-4 tomates pelées\r
- 4-5 clous de girofle\r
- Thym\r
- Céléri\r
- 2-3 pommes de terre\r
\r
directions:\r
- Bonne dose d'eau\r
- Coupes les ingrédients en petits morceaux\r
- Faire cuire 2h à feu doux\r
- Laisser réduire en fonction de l'intensité désirée\r
- Sortir la viande et les légumes, découper la viande\r
- Le "solide" et le liquide peuvent se manger séparément. Exemple le solide le midi, et le bouillon le soir\r
\r
\r
---\r
\r
Bouillon d'Emilia Sestu, plein de variantes possibles.\r
\r
Fort en gout, se marie très bien avec des vermicelles et du Pecorino rapé sur le pouce, du pain grillé/biscottes.\r
\r
Recette très chaleureuse et gourmande.\r
\r
Un peu 2 repas en un, exemple le solide le midi, et le bouillon le soir.\r
\r
Sortir l'os à moelle cuit pour le tartiner avec du sel !!!\r
`,$2=`---
layout: recipe
title: "Bûche framboise & mascarpone"
image: buche_framboise_mascarpone

tags:
- dessert
- sestu
- buche
- framboises
- mascarpone
- rhum
- vanille
- farine
- oeufs
- sucre
- sucre glace
- levure chimique

ingredients:
- 4 œufs
- 140 g de farine
- 110 g de sucre
- 2 sachets de sucre vanillé
- 6 g de levure chimique
- 225 g de mascarpone
- 77 g de sucre glace
- vanille liquide
- 7 ml d'extrait de vanille
- sirop de rhum
- framboises fraîches ou surgelées
---

Pour 6 personnes. Biscuit roulé garni de crème mascarpone et de framboises, imbibé d'un sirop au rhum.

## Préparation

### I. Le biscuit roulé

- Préchauffer le four à 200 °C.
- Séparer les blancs des jaunes d'œufs.
- Dans un saladier, fouetter les jaunes avec le sucre et le sucre vanillé jusqu'à blanchiment.
- Ajouter la farine et la levure tamisées.
- Monter les blancs en neige ferme et les incorporer délicatement.
- Étaler la pâte sur une plaque recouverte de papier sulfurisé et cuire 10 min à 200 °C.

### II. La crème mascarpone

- Mixer une partie des framboises pour obtenir un coulis ; en réserver d'autres entières.
- Mélanger le mascarpone avec le sucre glace et la vanille liquide jusqu'à obtenir une crème lisse.

### III. Montage

- Verser le sirop de rhum dans un bol avec 3 fois son volume d'eau.
- Démouler le biscuit sur un torchon humide et le badigeonner de sirop.
- Étaler la crème mascarpone, parsemer de framboises mixées et entières.
- Rouler délicatement le biscuit en bûche.
- Réserver au frais avant de napper d'un glaçage à la vanille (mascarpone, sucre glace et vanille).
`,O2=`---
layout: recipe
title: "Champignons en salade"
image: champignons_en_salade


tags:
- salade
- champignons
- haricots verts
- entrée
- froid
- bocuse
- echalote
- huile d'arachide
- vinaigre de vin
- moutarde
- sel
- poivre
- entree

ingredients:
- 125 g de haricots verts
- 125 g de champignons de Paris
- 1 échalote

components:
- Vinaigrette à la moutarde

directions:
- Faire chauffer 2 litres d'eau salée
- Éplucher les haricots verts, les laver sous l'eau courante
- Plonger les haricots dans l'eau bouillante et cuire 10 à 15 minutes
- Nettoyer les champignons en retirant le pied terreux
- Laver soigneusement les champignons à l'eau courante et les éponger
- Couper les champignons en lamelles fines et les disposer dans un saladier
- Passer les haricots cuits sous l'eau froide et les égoutter
- Ajouter les haricots aux champignons
- Éplucher et hacher finement l'échalote
- Parsemer l'échalote sur la salade
- Préparer la *Vinaigrette à la moutarde* — voir composant
- Verser la vinaigrette au moment de servir et remuer

---

Pour 4 personnes.

Temps de préparation : 15 minutes

Temps de cuisson : 10 minutes
`,B2=`---
layout: recipe
title: "Chili con carne"
image: chili_con_carne

tags:
- repas
- plat
- gourmand
- chaud
- boeuf
- viande de boeuf hachee
- oignon
- ail
- citron vert
- origan
- laurier
- haricots rouges
- pulpe de tomate
- concentre de tomate
- huile d'olive

ingredients:
- 800 g de bœuf haché
- 2 oignons rouges
- 2 gousses d'ail
- 1 citron vert
- 2 brins d'origan
- 2 feuilles de laurier
- 500 g de haricots rouges (conserve)
- 350 g de pulpe de tomate
- 20 cl de bouillon de bœuf chaud
- 2 c. à soupe de concentré de tomate
- 2 c. à soupe d'huile d'olive
- 2 c. à café d'épices à chili
- Sel et poivre
---

Pour 6 personnes. Préparation : 20 min. Cuisson : 45 min.

## Préparation

- Pelez puis hachez les oignons et l'ail. Faites-les revenir 5 minutes avec l'huile d'olive à feu vif.
- Ajoutez le bœuf haché en l'émiettant. Poursuivez la cuisson 5 minutes en remuant. Incorporez les épices à chili et le concentré de tomate. Mélangez 2 minutes sur feu moyen.
- Versez le bouillon, la pulpe de tomate, le laurier et les haricots égouttés. Salez, poivrez, laissez cuire 30 minutes.
- Effeuillez l'origan, pressez le citron. Incorporez l'origan et le jus dans le chili et servez très chaud.
`,U2=`---

layout: recipe
title: "Chouquettes"
image: chouquettes

tags:
- dessert
- beurre
- oeufs
- farine
- sucre
- classique
- facile
- sestu

ingredients:
- 25 cl d'eau
- 100 g de beurre doux
- 150 g de farine
- 1 cuillère à soupe rase de sucre semoule
- 1/2 cuillerée à café de sel
- 1/2 cuillerée à café de levure chimique
- 1 sachet de sucre vanillé
- 3 œufs

directions:
- Mettre l'eau et le beurre dans une casserole et porter à ébullition.
- Lorsque le mélange bout, retirer la casserole du feu et ajouter d'un seul coup la farine avec le sel et la levure. Mélanger à l'aide d'une spatule jusqu'à ce que la pâte se décolle toute seule des bords de la casserole et ne fasse plus qu'une masse.
- Laisser refroidir quelques instants.
- Ajouter le sucre, puis le premier œuf et fouetter énergiquement jusqu'à absorption complète de celui-ci par la pâte. Recommencer avec les 2 autres œufs (cette opération peut se faire au batteur électrique).
- Préchauffer le four à 210°C (thermostat 7).
- Déposer sur une plaque beurrée ou recouverte de papier sulfurisé des cuillerées à café de pâte en les espaçant bien (2 plaques pour cette quantité).
- Ajouter les grains de sucre perlé sur chaque chou en les enfonçant légèrement dans la pâte.
- Mettre à cuire dans le four préchauffé à 210°C (thermostat 7) pendant 15 à 20 minutes (190°C suffisent pour un four à chaleur tournante).

---

Chouquettes légères et croquantes, parsemées de sucre perlé. Temps total : 35 min (préparation 20 min, cuisson 15 min).
`,H2=`---
layout: recipe
title: "Coquilles Saint-Jacques gratinées"
image: coquilles_saint_jacques_gratinees

tags:
- entree
- sestu
- saint-jacques
- vin blanc
- fumet de poisson
- bechamel
- champignons
- gruyere
- chapelure
- beurre

ingredients:
- 2 noix de Saint-Jacques avec corail par personne
- vin blanc sec (court-bouillon)
- fumet de poisson et crustacés
- 50 g de beurre
- farine
- poivre
- champignons en morceaux (petite boîte)
- gruyère râpé
- chapelure
- noix de beurre
---

## Préparation

- Préparer un court-bouillon avec du vin blanc sec, du fumet de poisson et de crustacés.
- Pocher les noix de Saint-Jacques 10 min à feu juste, couvertes.
- Préparer une béchamel : faire fondre 50 g de beurre, ajouter la farine, mouiller avec un peu du fumet, poivrer.
- Mélanger la béchamel avec les champignons en morceaux et une bonne poignée de gruyère râpé.
- Garnir les coquilles : disposer les noix de Saint-Jacques, napper de béchamel, parsemer de chapelure et de gruyère râpé, déposer une noix de beurre par coquille.
- Passer au four chaud (gratiner) jusqu'à ce que le dessus soit doré.
`,W2=`---

layout: recipe
title: "Crème brûlée"
image: creme_brulee


tags:
- dessert
- classique
- vanille
- creme fraiche
- sestu
- oeufs
- sucre
- cassonade

ingredients:
- 500 ml de crème fraîche liquide entière
- 6 jaunes d'œufs
- 100 g de sucre en poudre
- 1 gousse de vanille (ou 1 c. à c. d'extrait de vanille)
- cassonade (pour la caramélisation finale)

directions:
- Préchauffer le four à 160°C (chaleur traditionnelle).
- Fendre la gousse de vanille et gratter les graines. Mettre graines et gousse dans une casserole avec la crème.
- Chauffer la crème à feu doux jusqu'aux premiers frémissements, puis couper le feu. Couvrir et laisser infuser 10 minutes.
- Dans un grand bol, fouetter les jaunes d'œufs avec le sucre jusqu'à ce que le mélange blanchisse et devienne légèrement mousseux.
- Retirer la gousse de vanille. Verser la crème tiède et filtrée petit à petit sur le mélange jaunes/sucre en fouettant constamment.
- Répartir l'appareil dans des ramequins. Déposer les ramequins dans un plat et verser de l'eau chaude à mi-hauteur (bain‑marie).
- Enfourner 30 à 35 minutes. La crème doit être prise sur les bords et encore légèrement tremblotante au centre.
- Laisser refroidir à température ambiante, puis réserver au réfrigérateur au moins 2 heures (idéalement 4 à 6 h).
- Juste avant de servir, saupoudrer chaque crème d'une fine couche de cassonade et caraméliser au chalumeau (ou sous le gril bien chaud 1 à 2 minutes en surveillant).

---

Crème brûlée vanille classique, soyeuse et parfumée.
`,K2=`---
layout: recipe
title: "Entremet framboises & mascarpone au kirsch"
image: entremet_framboises_mascarpone_kirsch

tags:
- dessert
- sestu
- entremet
- genoise
- framboises
- mascarpone
- kirsch
- gelatine
- miel
- vanille
- farine
- oeufs
- sucre

ingredients:
- 250 g de framboises
- 250 g de mascarpone
- 90 g de miel (ou sucre)
- 100 g de pâte de lait concentré (ou autre liaison sucrée)
- 4 feuilles de gélatine
- 4 œufs
- 100 g de sucre (génoise)
- 150 g de farine (génoise)
- 1 sachet de levure chimique
- 50 g de sucre (sirop)
- 75 ml de kirsch
- 100 ml d'eau (sirop)
- sel
---

Dessert léger en plusieurs couches : une génoise imbibée d'un sirop au kirsch, surmontée d'une mousse mascarpone à la gélatine et garnie de framboises fraîches.

## Préparation

### 1. Tremper la gélatine

- Faire tremper les feuilles de gélatine dans un bol d'eau froide pendant 10 minutes.

### 2. Préparer le sirop

- Faire chauffer 100 ml d'eau avec 50 g de sucre et le kirsch jusqu'à dissolution du sucre. Réserver.

### 3. La crème mascarpone

- Dans une casserole, faire tiédir un peu de la masse de mascarpone avec le miel.
- Essorer la gélatine et l'ajouter hors du feu, en remuant jusqu'à dissolution complète.
- Battre le reste du mascarpone avec le sucre, incorporer la gélatine tiède et mélanger jusqu'à obtenir une mousse homogène. Réserver au frais.

### 4. La génoise

- Préchauffer le four à 150 °C.
- Séparer les blancs des jaunes.
- Fouetter les jaunes avec le sucre jusqu'à blanchiment, ajouter la farine et la levure.
- Monter les blancs en neige ferme avec une pincée de sel et les incorporer délicatement.
- Étaler la pâte sur une plaque chemisée et cuire environ 10 minutes. Laisser refroidir.

### 5. Le montage

- Démouler la génoise sur un torchon humide. La couper aux dimensions souhaitées.
- L'imbiber généreusement de sirop au kirsch.
- Étaler la crème mascarpone, parsemer de framboises fraîches.
- Répéter une couche si possible, terminer par les framboises.
- Réserver au frais au moins 2 heures avant de servir.
`,Y2=`---
layout: recipe
title: "Faux-filet, sauce au poivre"
image: faux_fillet_sauce_poivre

components:
- Sauce au poivre

tags:
- repas
- plat
- gourmand
- chaud
- boeuf
- champignons
- pommes de terre
- cerfeuil
- beurre
- huile d'olive
- echalotes

ingredients:
- 6 faux-filets de 150 g
- 800 g de pommes de terre grenaille
- 400 g de champignons de Paris
- ½ botte de cerfeuil
- 80 g de beurre
- 3 c. à soupe d'huile
- Sel et poivre
---

Pour 6 personnes. Préparation : 30 min. Cuisson : 1h05.

## Préparation

- Faites cuire les pommes de terre grenaille 15 à 20 minutes, selon le calibre, dans de l'eau frémissante salée. Émincez les champignons, faites-les sauter 10 minutes à feu moyen avec 15 g de beurre et 1 cuillère à soupe d'huile.
- Préchauffez le four à 180°C. Égouttez les pommes de terre, dorez-les 5 minutes à feu vif avec 10 g de beurre dans une sauteuse allant au four. Ajoutez les champignons et 30 g de beurre, salez et poivrez. Mélangez puis enfournez pour 20 minutes.
- Préparez la *Sauce au poivre* — voir composant.
- Faites cuire les faux-filets : effeuillez le cerfeuil. Chauffez le beurre restant dans une grande poêle à feu vif, saisissez les pièces de viande 3 minutes de chaque côté. Réduisez le feu et poursuivez la cuisson 2 minutes de chaque côté. Salez en fin de cuisson.
- Servez les faux-filets avec la garniture et la sauce, le tout parsemé de cerfeuil.
`,G2=`---
layout: recipe
title: "Filet de poulet à la crème et aux champignons"
image: filet_de_poulet_creme_champignons

tags:
- repas
- plat
- gourmand
- chaud
- poulet
- champignons
- oignon
- creme
- beurre
- persil
- bouillon de volaille
- farine
- muscade
- sauce worcestershire
- huile

ingredients:
- 1 kg de filets de poulet fermier
- 500 g de champignons bruns
- 2 oignons
- 4 brins de persil
- 20 cl de crème liquide
- 20 g de beurre
- 20 cl de bouillon de volaille
- 2 c. à soupe d'huile
- 1 c. à soupe de farine
- ½ c. à café de sauce Worcestershire
- 2 pincées de muscade
- Sel et poivre
---

Pour 6 personnes. Préparation : 35 min. Cuisson : 30 min.

## Préparation

- Coupez les filets de poulet en aiguillettes. Émincez finement les champignons. Pelez et taillez les oignons en tranches.
- Chauffez l'huile et le beurre dans une sauteuse et saisissez les aiguillettes de poulet 10 minutes en les tournant de tous côtés. Retirez-les et réservez.
- Ajoutez les oignons et les champignons dans la sauteuse. Laissez cuire 5 minutes en remuant puis salez, poivrez et poursuivez la cuisson 5 minutes. Saupoudrez de farine et mélangez.
- Versez le bouillon de volaille. Lorsqu'il frémit, ajoutez la crème, la sauce Worcestershire et la muscade. Laissez cuire à feu doux jusqu'à ce que la sauce épaississe.
- Déposez les aiguillettes de poulet, laissez cuire 5 minutes.
- Ciselez le persil. Rectifiez l'assaisonnement et parsemez de persil.
`,X2=`---
layout: recipe
title: "Filet mignon sauce chasseur"
image: filet_mignon_sauce_chasseur

tags:
- plat principal
- porc
- bacon
- choux de bruxelles
- pommes de terre
- ail
- oignons
- champignons
- chasseur
- four
- gourmand

ingredients:
- 2 filets mignons de porc
- 10 fines tranches de bacon
- 400 g de choux de Bruxelles
- 400 g de pommes de terre
- 4 gousses d'ail
- 20 g de beurre
- 100 g d'oignons grelot (conserve)
- 5 c. à soupe d'huile
- Sel et poivre

components:
- Sauce chasseur
---

Pour 6 personnes. Préparation : 30 min. Cuisson : 1 h 10. Difficulté : ⚠️⚠️⚠️.

## Préparation

- Peler les pommes de terre et les tailler en cubes.
- Couper les choux de Bruxelles en deux. Faire cuire le tout 20 minutes à la vapeur. Réserver.
- Préchauffer le four à 180 °C. Dorer les filets mignons 10 minutes sur tous côtés avec le beurre et 2 cuillerées à soupe d'huile bien chaudes.
- Déposer les filets mignons dans un grand plat, ajouter les choux de Bruxelles, les pommes de terre, les oignons grelot égouttés, les gousses d'ail en chemise et le bacon déchiré en lanières.
- Saler, poivrer, arroser du reste d'huile.
- Enfourner pour 15 à 20 minutes.
- Pendant ce temps, préparer la *Sauce chasseur* — voir composant.
- Trancher les filets mignons en médaillons, les servir avec les légumes et la sauce.
`,Q2=`---

layout: recipe
title:  "Gateau de riz"
image: gateau_de_riz


tags:
- sestu
- dessert
- riz
- lait
- oeufs
- beurre
- sucre
- rhum
- vanille

ingredients:
- 200 g de riz rond (*)
- 1l de lait
- 3 œufs
- 30 g de beurre + un peu pour le moule
- 120 g de sucre roux
- 30 ml de rhum (**)
- 1 gousse de vanille

directions:
- Blanchissez le riz 3-4 minutes dans de l’eau bouillante. Égouttez-le puis remettez dans la casserole.
- Ajoutez le lait + sucre + gousse de vanille grattée puis portez à ébullition.
- Laissez ainsi deux minutes, puis baissez à feu doux. Laissez cuire à feux doux (en remuant régulièrement) pendant 15-20 minutes.
- Lorsque le lait affleure le riz, retirez du feu et laissez tiédir.
- Fouettez les œufs avec le rhum et le beurre fondu. Une fois le riz au lait tiède, mélange- le avec œufs/rhum/beurre fondu jusqu’à bien homogénéiser.
- Beurrez légèrement un moule (***), puis versez la préparation de riz au lait.
- Enfournez pour 30 minutes à 180°C..
- A la sortie du four, attendez 5 minutes puis démoulez dans une assiette et laissez refroidir
- Le gâteau de riz se déguste plutôt frais, accompagné ou pas d’une sauce caramel (recette juste en dessous)

- (*) Il est important de choisir un riz rond (ou riz à dessert) car c’est celui qui aura la texture fondante désirée dans le gâteau de riz.
- (**) Le rhum n’est pas indispensable dans la recette mais apporte un petit goût très sympathique.
- (***) L’idéal est d’utiliser un moule étroit afin d’avoir une bonne épaisseur de gâteau de riz. Si vous n’en avez pas de moule à brioche/charlotte comme celui en photo, utilisez un moule à cake.

components:
- Sauce caramel
---

`,Z2=`---
layout: recipe
title: "Gâteau marbré"
image: gateau_marbre

tags:
- beurre
- chocolat
- dessert
- farine
- gâteau
- lait
- levure
- marbré
- oeufs
- sestu
- sucre

ingredients:
- 1 sachet de levure chimique
- 3 œufs
- 60g de chocolat
- 100g de beurre
- 200g de sucre
- 200g de farine
- 1 dl de lait

directions:
- Mélanger le beurre et le sucre.
- Ajouter les jaunes d'œufs, la farine, le lait, la levure chimique, puis incorporer les blancs battus en neige.
- Diviser la pâte en deux parts égales.
- Ajouter le chocolat fondu dans l'une des deux moitiés de pâte.
- Beurrer un moule, puis verser successivement les deux pâtes en alternant pour obtenir l'effet marbré.
- Cuire 1 heure thermostat 5-6 (env. 160-180°C).

---

Gâteau marbré moelleux pour 6 à 8 personnes.

Temps de préparation : 20 minutes  
Temps de cuisson : 1 heure
`,J2=`---
layout: recipe
title: "Gnocchi maison à la sauce tomate"
image: gnocchi_maison_sauce_tomate

tags:
- plat principal
- sestu
- gnocchi
- pomme de terre
- beurre
- oeufs
- gruyere
- muscade
- bouillon
- coulis de tomate
- farine

ingredients:
- 800 g de pommes de terre
- 60 g de beurre
- 1 œuf entier + 2 jaunes d'œufs
- 50 g de fromage râpé (gruyère ou parmesan)
- sel, poivre, muscade
- 2 cubes de bouillon
- 20 cl de coulis de tomate
- farine (pour le plan de travail)
---

Pour 5 personnes.

## Préparation

- Cuire les pommes de terre à l'eau, les éplucher et les écraser à la fourchette ou au presse-purée.
- Ajouter le beurre fondu, l'œuf entier et les deux jaunes, le fromage râpé, du sel, du poivre et une pointe de muscade. Bien mélanger jusqu'à obtenir une pâte homogène.
- Sur un plan de travail fariné, façonner des boudins ; couper de petits morceaux de la taille d'une noix.
- Pocher les gnocchi dans une grande casserole d'eau frémissante salée additionnée des cubes de bouillon, environ 3 minutes : ils sont prêts dès qu'ils remontent à la surface.
- Égoutter, dresser dans le plat et napper de coulis de tomate ; parsemer de gruyère râpé et servir aussitôt.
`,ek=`---
layout: recipe
title: "Gratin patate douce, bœuf haché & feta"
image: gratin_patate_douce_boeuf_feta

tags:
- plat principal
- sestu
- gratin
- patate douce
- boeuf
- feta
- mozzarella
- oeufs
- lait
- ail
- oignon
- concentre de tomate
- origan

ingredients:
- 450 g de patate douce
- 1 oignon (80 g)
- 500 g de bœuf haché
- 2 gousses d'ail
- 2 c. à s. de concentré de tomates
- origan
- sel et poivre
- 150 g de feta
- 100 ml de lait
- 1 œuf
- mozzarella râpée
---

Plat au four. 200°C pendant 30 min.

## Préparation

- Faire cuire les patates douces à l'eau environ 20 min, puis les couper en rondelles.
- Dans une poêle, faire revenir l'ail et l'oignon hachés ; ajouter le bœuf haché.
- Saler, poivrer, ajouter l'origan et le concentré de tomates ; bien mélanger.
- Dans un plat à four, déposer un fond de patate douce, une couche de bœuf, puis émietter la feta.
- Battre l'œuf avec le lait ; verser le mélange dans le plat et parsemer de mozzarella râpée.
- Enfourner à 200 °C pendant 30 min jusqu'à ce que le dessus soit doré.
`,nk=`---
layout: recipe
title: "Gratin de pêches à la crème d'amandes"
image: gratin_peches_creme_amandes

tags:
- dessert
- sestu
- gratin
- peche
- poudre d'amande
- amandes effilees
- creme
- maizena
- citron vert
- sucre vanille
- beurre

ingredients:
- 4 pêches blanches
- 40 g de poudre d'amandes
- 40 g d'amandes effilées
- 60 g de sucre
- 20 cl de crème liquide
- 1 c. à c. de maïzena
- 1 citron vert non traité
- 1 sachet de sucre vanillé
- 20 g de beurre
---

Pour de petits ramequins. Cuisson : 20 min à 150 °C.

## Préparation

- Préchauffer le four à 150 °C.
- Brosser le citron vert sous l'eau ; en prélever le zeste (1 c. à s.) et le jus.
- Couper les pêches en lamelles d'environ 3 cm.
- Dans un saladier, mélanger la moitié du sucre, le zeste et 1 c. à c. de jus de citron vert ; y faire macérer les lamelles de pêche.
- Dans un autre saladier, mélanger la poudre d'amandes, la maïzena, les amandes effilées, le reste du sucre, le sucre vanillé et la crème liquide pour obtenir une crème d'amandes lisse.
- Beurrer les ramequins. Verser une couche de crème d'amandes, déposer les lamelles de pêche, puis recouvrir du reste de crème.
- Enfourner 20 min à 150 °C jusqu'à ce que le dessus soit doré.
`,tk=`---
layout: recipe
title: "Gratin de pennes et champignons au bouillon"
image: gratin_penne_champignons_bouillon

tags:
- repas
- plat principal
- pates
- penne
- gratin
- champignons
- epinards
- echalotes
- ail
- parmesan
- creme
- bouillon
- muscade
- beurre
- farine
- huile
- four
- chaud

ingredients:
- 400 g de champignons de Paris
- 100 g de pousses d'épinards
- 2 échalotes
- 1 gousse d'ail
- 100 g de parmesan râpé
- 10 g de beurre (+ pour le moule)
- 10 cl de crème liquide entière
- 500 g de pennes
- 70 cl de bouillon de volaille
- 2 c. à soupe d'huile
- 1 c. à soupe rase de farine
- 2 pincées de muscade
- Sel et poivre
---

Pour 4 personnes. Temps de préparation : 20 min. Temps de cuisson : 40 min.

## Préparation

- Coupez le pied des champignons, nettoyez les têtes puis émincez-les. Pelez les échalotes et l'ail puis hachez-les.
- Faites cuire les pâtes al dente en suivant les indications sur le paquet, et égouttez-les.
- Faites sauter les champignons pendant 5 minutes dans une sauteuse avec l'huile et le beurre. Salez, poivrez puis ajoutez les échalotes et l'ail. Poursuivez la cuisson 3 minutes.
- Saupoudrez de farine en mélangeant puis versez le bouillon, la crème et la muscade. Remuez 2 minutes à feu doux.
- Ajoutez, hors du feu, les pâtes, les épinards et la moitié du parmesan.
- Mélangez et rectifiez l'assaisonnement puis transvasez l'ensemble dans un plat beurré. Couvrez et laissez refroidir en remuant de temps en temps. Préchauffez le four à 180 °C.
- Saupoudrez le plat du reste de parmesan et enfournez pour 30 minutes.
`,rk=`---\r
layout: recipe\r
title: "Gratinée lyonnaise"\r
image: gratinee_lyonnaise\r
\r
\r
tags:\r
- repas\r
- soupe\r
- oignon\r
- gruyere\r
- pain\r
- bocuse\r
- beurre\r
- farine\r
- bouquet garni\r
- sel\r
- poivre\r
- madere\r
- oeufs\r
- jaunes d'oeufs\r
\r
ingredients:\r
- 600g d'oignons paille\r
- 150g de beurre\r
- 2 cuillères à soupe de farine\r
- 1 petit bouquet garni\r
- 200g de pain (flûte)\r
- 250g de gruyère râpé\r
- 4 jaunes d'œufs\r
- 1 petit verre de vieux madère\r
- Sel\r
- Poivre du moulin\r
\r
directions:\r
- Émincer finement les oignons\r
- Les faire sauter au beurre dans une grande poêle pour les faire roussir, bien les colorer sans les brûler\r
- Saupoudrer de farine et donner quelques tours de poêle pour que la farine cuise comme un roux\r
- Mettre les oignons dans une marmite contenant 2,5 litres d'eau\r
- Saler, poivrer et ajouter le petit bouquet garni\r
- Cuire à petit feu 30 minutes environ\r
- Retirer le bouquet garni\r
- Passer les oignons et le bouillon au tamis ou au passe-légumes\r
- Dans une soupière allant au four, mettre le pain coupé en fines lamelles et légèrement séché\r
- Intercaler entre chaque couche de pain la moitié du gruyère râpé\r
- Après rectification de l'assaisonnement, verser le bouillon dessus\r
- Masquer copieusement la surface avec le restant du gruyère râpé\r
- Introduire la soupière dans un four chaud jusqu'à ce que le gruyère fonde et que la surface soit bien dorée\r
- Pour servir, diluer les jaunes d'œufs avec le madère dans un bol\r
- Verser cette préparation dans la soupière en remuant aussitôt avec une louche pour faire la liaison\r
---\r
\r
Soupe gratinée traditionnelle lyonnaise pour 4 à 6 personnes.\r
\r
Cette soupe dite "gratinée" est très appréciée à Lyon ; elle se déguste principalement le soir en famille ou entre amis, à la sortie des spectacles.\r
\r
Temps de préparation : 20 minutes\r
Temps de cuisson : 40 minutes\r
`,ik=`---\r
layout: recipe\r
title: "Salade de racine de lotus et algue hijiki au miso"\r
image: hijiki\r
\r
\r
tags:\r
- entrée\r
- japon\r
- voyage\r
- salade\r
- racine de lotus\r
- algue hijiki\r
- tomates\r
- edamame\r
- fèves de soja vertes\r
- dashi\r
- sésame\r
- miso\r
- tomate cerise\r
- casserole\r
\r
ingredients:\r
- 20g de racine de lotus\r
- 1 c. à café d'algue hijiki\r
- 1 tomate cerise\r
- 5g de fèves de soja vertes\r
- 50ml de dashi\r
\r
directions:\r
- Faire tremper l'algue hijiki dans l'eau pendant 15 minutes, puis égoutter\r
- Couper la racine de lotus en fines tranches, et couper les tomates cerises en petits morceaux\r
- Ajouter la racine de lotus, l'hijiki et le dashi dans une casserole et cuire jusqu'à ce que le dashi soit absorbé\r
- Moudre le sésame à environ 70% de broyage. Mélanger la vinaigrette miso dans un bol\r
- Ajouter les ingrédients cuits à la vinaigrette miso, puis ajouter les tomates cerises et les fèves de soja vertes, et tout mélanger ensemble.\r
\r
components:\r
- Dashi\r
- Vinaigrette miso\r
---\r
\r
Pour 1 personne.\r
`,sk=`---\r
layout: recipe\r
title: "Karaage - Poulet frit japonais avec sauce aromatique"\r
image: karaage\r
\r
\r
tags:\r
- entrée\r
- japon\r
- voyage\r
- frit\r
- poulet\r
- sauce soja foncée\r
- sauce soja\r
- saké\r
- gingembre\r
- fécule de pomme de terre\r
- vinaigre\r
- mirin\r
- prune salée\r
- radis\r
- pousses de radis\r
- shiso\r
- cuisse de poulet\r
- marinade\r
- friture\r
- dashi\r
\r
ingredients:\r
- 80g de cuisse de poulet\r
- 1 c. à café de sauce soja foncée\r
- 1 c. à café de saké\r
- petite quantité de gingembre\r
- 1-2 c. à café de fécule de pomme de terre\r
\r
directions:\r
- Mariner le poulet avec la sauce soja foncée, le saké et le gingembre râpé, et laisser reposer environ 20 minutes pour assaisonner\r
- Ajouter la fécule de pomme de terre au poulet mariné et mélanger.\r
- Faire frire dans l'huile chauffée (180°C) jusqu'à ce que ce soit cuit.\r
- Placer sur une assiette et verser la sauce aromatique par-dessus\r
\r
components:\r
- Sauce aromatique pour Karaage\r
- Dashi\r
---\r
\r
Pour 1 personne.\r
`,ok=`---\r
layout: recipe\r
title: "Kinpira Gobo - Racine de bardane et carotte sautées"\r
image: kinpira_gobo\r
\r
\r
tags:\r
- entrée\r
- japon\r
- voyage\r
- carotte\r
- racine de bardane\r
- huile de sésame\r
- sésame\r
- teriyaki\r
- sauté\r
- sauce teriyaki\r
- légumes\r
- poêle\r
\r
ingredients:\r
- 10g de carotte\r
- 15g de racine de bardane\r
- 1 c. à café d'huile de sésame\r
- 1/2 c. à café de sésame\r
- 2 c. à café de sauce teriyaki\r
\r
directions:\r
- Mettre la sauce teriyaki dans un bol\r
- Râper la carotte et la racine de bardane\r
- Mettre dans une poêle chauffée avec l'huile de sésame\r
- Sauter jusqu'à ce que ce soit légèrement cuit, puis ajouter la sauce teriyaki dans la poêle\r
- Tout mélanger jusqu'à ce que le liquide soit réduit\r
- Saupoudrer de sésame et mélanger\r
\r
components:\r
- Sauce teriyaki\r
---\r
\r
Pour 1 personne.\r
`,ak=`---
layout: recipe
title: "Lapin mijoté aux pommes et au cidre"
image: lapin_mijote_pommes_cidre

tags:
- repas
- plat
- plat principal
- viande
- lapin
- pomme
- cidre
- creme fraiche
- thym
- romarin
- calvados
- chaud
- automne
- gourmand

ingredients:
- 3 cuisses de lapin
- 3 râbles de lapin
- 6 pommes
- 2 oignons roses
- Quelques branches de thym
- Quelques branches de romarin
- 4 c. à soupe de crème fraîche
- 75 cl de cidre brut
- 2 c. à soupe d'huile d'olive
- 1 petit verre de calvados (facultatif)
- Sel et poivre
---

Pour 6 personnes. Préparation : 10 min. Cuisson : 50 min.

## Préparation

- Éplucher les oignons et les émincer finement en rondelles.
- Verser l'huile d'olive dans une cocotte en fonte et faire revenir les oignons 5 minutes à feu moyen. Ajouter les morceaux de lapin et les faire dorer sur toutes les faces.
- Verser le cidre dans la cocotte, ajouter le thym et le romarin. Couvrir et laisser cuire 40 minutes à feu doux, en retournant les morceaux de lapin à mi-cuisson.
- Laver les pommes. 10 minutes après le début de la cuisson, déposer les pommes entières dans la cocotte et poursuivre la cuisson. Retirer ensuite les pommes et les morceaux de lapin, puis les réserver au chaud.
- Ajouter la crème fraîche dans la cocotte. Porter à ébullition, puis baisser le feu et laisser réduire la sauce quelques minutes.
- Remettre le lapin dans la cocotte, parsemer de thym frais et servir sans attendre, accompagné des pommes fondantes.
`,lk=`---\r
layout: recipe\r
title: "Lasagnes"\r
image: lasagnes\r
\r
tags:\r
- sestu\r
- gratin\r
- pâtes\r
- fromage\r
- boeuf\r
- repas\r
- lait\r
- noix de muscade\r
- farine\r
- beurre\r
- sel\r
- poivre\r
- sucre\r
- parmesan\r
- emmental\r
- herbes aromatiques\r
- huile d'olive\r
- ail\r
- oignon\r
- viande de bœuf hachée\r
- pulpe de tomate\r
- tomates fraîches\r
\r
ingredients:\r
- 50 cl de lait\r
- pincée de noix de muscade\r
- 70 g de farine\r
- 70 g de beurre\r
- sel\r
- poivre\r
- 50 g de parmesan râpé\r
- 100 g d'emmental râpé\r
- 8 feuilles de lasagnes\r
\r
components:\r
- Sauce bolognaise\r
\r
directions:\r
- Préparer la *Sauce bolognaise* — voir composant.\r
- Préparer la béchamel, faire fondre le beurre, ajouter la farine hors du feu et mélanger. Ajouter le lait progressivement en mélangeant pour éviter les grumeaux.\r
- Remettre sur feu doux et laisser épaissir quelques minutes. Saler, poivrer et ajouter la noix de muscade.\r
- Beurrer un plat et monter les lasagnes en alternant couches de béchamel, lasagnes, sauce bolognaise et emmental râpé.\r
- Terminer par une couche de béchamel et saupoudrer de parmesan râpé.\r
- Enfourner à 165°C (thermostat 5/6) pendant environ 45 minutes jusqu'à ce que les lasagnes soient bien gratinées. Couvrir de papier d'aluminium si nécessaire.\r
\r
\r
---\r
\r
Recette classique de lasagnes italiennes. Pour 6 personnes. Préparation : 20 min ; Cuisson : 1 h.\r
`,uk=`---

layout: recipe
title: "Limoncello"
image: limoncello

tags:
- boisson
- citron
- sucre
- alcool
- classique
- traditionnel
- sestu

ingredients:
- 1 L d'alcool à 95°
- 2,5 kg de citrons non traités (pelures uniquement, sans le blanc)
- 1,5 L d'eau
- 800 g de sucre

directions:
- Prélever les pelures des citrons (sans le blanc). Les mettre dans l'alcool et laisser macérer 1 mois. Secouer le bocal tous les 2-3 jours.
- Porter 1,5 L d'eau à frémir avec 800 g de sucre jusqu'à ce que le sucre soit dissous. Laisser refroidir.
- Ajouter le sirop refroidi au mélange alcool et pelures de citron. Filtrer puis mettre en bouteille.

---

Liqueur de citron italienne, à déguster bien fraîche. Macération 1 mois.
`,ck=`---

layout: recipe
title: "Limoncello tiramisu"
image: limoncello_tiramisu

tags:
- dessert
- tiramisu
- mascarpone
- citron
- limoncello
- oeufs
- sucre
- classique
- sestu

ingredients:
- 1 tasse d'eau
- 3/4 tasse de limoncello
- 1/4 tasse de sucre
- 2 c. à s. de jus de citron
- 1 ½ tasse de crème épaisse
- 250 g de mascarpone (température ambiante)
- 1/4 tasse de sucre cristallisé
- 2 c. à s. de limoncello
- 2 jaunes d'œuf + 1 œuf entier
- 2/3 tasse de sucre cristallisé
- zeste d'1 citron
- 1/3 tasse de jus de citron
- 6 c. à c. de beurre non salé
- 1 pincée de sel
- boudoirs (biscuits à la cuillère)

directions:
- Sirop. mélanger l'eau, le limoncello, le sucre et le jus de citron. Chauffer sur feu doux pour faire fondre le sucre. Laisser refroidir.
- Crème au citron. dans une casserole, mélanger jaunes, œuf entier, sucre cristallisé, zeste et jus de citron. Chauffer sur feu doux en fouettant jusqu'à épaississement. Hors du feu, incorporer le beurre et le sel. Laisser refroidir.
- Garniture mascarpone. fouetter la crème épaisse en chantilly. Dans un autre bol, mélanger le mascarpone, le sucre cristallisé et le limoncello, puis incorporer la chantilly délicatement.
- Montage. tremper les boudoirs dans le sirop refroidi et les disposer au fond d'un plat. Alterner une couche de boudoirs trempés, une couche de crème mascarpone et une couche de crème au citron. Répéter jusqu'à épuisement en terminant par la crème. Réfrigérer 4 à 6 h.

---

Tiramisu au limoncello et citron : sirop, crème mascarpone et crème au citron. À servir bien froid après 4 à 6 h au frais.
`,dk=`---
layout: recipe
title: "Linguines aux girolles et à la tomate"
image: linguines_girolles_tomate

tags:
- repas
- plat principal
- pates
- linguines
- girolles
- tomates
- lentilles vertes
- oignon
- ail
- bouquet garni
- persil
- emmental
- gourmand

ingredients:
- 300 g de girolles
- 1 oignon jaune
- 1 gousse d'ail
- 1 bouquet garni
- 1 bouquet de persil
- 70 g d'emmental râpé
- 400 g de tomates concassées
- 300 g de linguines
- 250 g de lentilles vertes
- 1 c. à soupe d'huile d'olive
- Sel et poivre
---

Pour 4 personnes. Préparation : 15 min. Cuisson : 25 min.

## Préparation

- Faites chauffer l'huile dans une sauteuse.
- Écrasez la gousse d'ail et coupez l'oignon en petits dés. Faites-le colorer dans la sauteuse. Ajoutez les girolles. Laissez dorer puis ajoutez les tomates concassées. Réduisez le feu. Salez, poivrez. Couvrez et laissez mijoter 15 minutes.
- Faites cuire les lentilles dans une casserole d'eau (départ eau froide) avec le bouquet garni pendant 20 minutes. Égouttez-les et ajoutez-les à la sauce tomate.
- Ôtez le couvercle et éteignez le feu le temps de cuire les pâtes dans un grand volume d'eau salée. Mélangez les linguines et la sauce. Servez à l'assiette et parsemez chacune d'emmental râpé et de persil ciselé.
`,fk=`---
layout: recipe
title: "Linguines ricotta, pecorino et guanciale"
image: linguines_ricotta_pecorino_et_guanciale

tags:
- plat
- plat principal
- pates
- ricotta
- pecorino
- guanciale
- basilic
- huile d'olive
- fromage
- rapide
- repas
- sel
- poivre

ingredients:
- 400 g de guanciale
- 1 bouquet de basilic pourpre
- 250 g de ricotta
- 200 g de pecorino romano
- 500 g de linguine
- 4 c. à soupe d'huile d'olive vierge extra
- Sel
- Poivre noir du moulin

directions:
- Préparer les ingrédients en taillant la guanciale en petits lardons, en râpant le pecorino après avoir retiré la croûte et en effeuillant le basilic.
- Porter à ébullition une grande marmite d'eau salée et y plonger les linguines. Cuire en suivant les indications du paquet pour obtenir des pâtes al dente.
- Préparer la garniture en fouettant la ricotta avec les deux tiers du pecorino râpé jusqu'à obtenir une préparation crémeuse.
- Faire griller la guanciale dans une grande sauteuse à sec, en remuant bien, jusqu'à ce que les lardons soient dorés et croustillants.
- Égoutter les pâtes et les verser dans la sauteuse avec la guanciale. Ajouter la préparation à base de ricotta, poivrer généreusement, puis remuer pendant 1 à 2 minutes sur feu moyen en ajoutant l'huile d'olive.
- Dresser en répartissant les linguines dans 4 assiettes, ajouter les feuilles de basilic et saupoudrer du reste de pecorino. Proposer encore du poivre à part.
---

Linguines crémeuses à la ricotta et au pecorino, garnies de lardons de guanciale grillés et de basilic pourpre, pour un plat de pâtes riche et savoureux.

Pour 4 personnes

Temps de préparation : 10 minutes
Temps de cuisson : 15 minutes
`,pk=`---
layout: recipe
title: "Magret de canard, clémentines de Corse et purée de butternut"
image: magret_de_canard_clementines_corse_puree_de_butternut

tags:
- plat
- plat principal
- viande
- canard
- clementine
- agrumes
- butternut
- puree
- noisettes
- miel
- biere
- vinaigre
- fond
- muscade
- thym
- sel
- poivre

ingredients:
- 2 magrets de canard
- 6 clémentines de Corse
- 1 branche de thym
- 15 cl de bière
- 10 cl de vinaigre d'agrumes
- 30 g de noisettes concassées
- 2 c. à soupe de miel
- 1 c. à café de fond de veau déshydraté
- Fleur de sel
- Poivre du moulin
- 800 g de butternut
- 30 cl de lait
- 2 pincées de noix de muscade
- 1 c. à soupe de purée de noisettes
- Sel
- Poivre

directions:
- Éplucher le butternut, le couper en morceaux puis les plonger dans une casserole avec le lait. Cuire à feu doux pendant environ 20 minutes, jusqu'à ce que la chair soit tendre.
- Égoutter les morceaux de butternut en réservant le lait de cuisson. Mixer finement pour obtenir une purée bien lisse, ajouter un peu de lait de cuisson si nécessaire pour ajuster la consistance. Assaisonner avec du sel, du poivre, la noix de muscade et la purée de noisettes, puis réserver au chaud.
- Verser le vinaigre d'agrumes et le miel dans une casserole et faire chauffer à feu vif pendant environ 3 minutes pour obtenir un début de caramel. Ajouter la bière, 10 cl d'eau, le fond de veau, le jus de 3 clémentines et la branche de thym. Mélanger au fouet et laisser réduire une dizaine de minutes jusqu'à obtenir une sauce légèrement sirupeuse. Garder la sauce au chaud.
- Chauffer une poêle antiadhésive à feu vif. Déposer les magrets côté peau et cuire 2 à 3 minutes à feu fort pour bien faire dorer la peau, puis baisser le feu et retourner les magrets. Poursuivre la cuisson environ 4 minutes côté chair.
- Envelopper les magrets dans du papier aluminium et les laisser reposer 5 minutes afin qu'ils deviennent tendres et juteux.
- Éplucher les 3 clémentines restantes, détacher les quartiers et les faire revenir 3 à 4 minutes dans le gras de canard restant dans la poêle.
- Découper les magrets en tranches, saupoudrer de fleur de sel et de poivre. Servir avec la sauce aux clémentines et à la bière, la purée de butternut, les quartiers de clémentines poêlés et décorer avec les noisettes concassées.
---

Magret de canard rôti servi avec une sauce aux clémentines de Corse, à la bière et au miel, accompagné d'une purée de butternut à la purée de noisettes et parfumée à la noix de muscade.

Pour 4 personnes

Temps de préparation : 20 minutes
Temps de cuisson : 35 minutes
`,hk=`---
layout: recipe
title: "Maquereaux marinés"
image: maquereaux_marines


tags:
- poisson
- maquereau
- marinade
- plat
- froid
- bocuse
- sel
- poivre
- vin blanc
- vinaigre
- carotte
- oignon
- thym
- laurier
- citron

ingredients:
- 12 petits maquereaux vidés et nettoyés
- Sel
- Poivre du moulin
- Citron

components:
- Marinade cuite pour poisson

directions:
- Ranger les maquereaux dans un plat en terre allant au four
- Assaisonner de sel et poivre frais moulu
- Préparer la *Marinade cuite pour poisson* — voir composant
- Verser la marinade chaude sur les maquereaux
- Cuire au four 8 à 10 minutes à 180°C (th. 6)
- Laisser refroidir tel quel
- Servir bien froid avec une rondelle de citron pelé à vif sur chaque maquereau

---

Pour 6 personnes.

Temps de préparation : 20 minutes

Temps de cuisson : 10 minutes

Temps de marinade : 20 minutes

Temps de repos : 1 heure
`,mk=`---

layout: recipe
title: "Meringue aux amandes"
image: meringue_aux_amandes

tags:
- dessert
- amandes
- oeufs
- sucre
- classique
- facile
- sestu

ingredients:
- 3 blancs d'œuf
- 160 g de sucre en poudre (110 g + 50 g)
- 50 g de sucre glace
- 100 g d'amandes effilées

directions:
- Battre les blancs d'œufs en neige dans un récipient assez profond en y ajoutant 110 g de sucre en poudre au fur et à mesure. La préparation doit devenir bien ferme (cela peut nécessiter plus de 10 min) ; c'est très important pour que les meringues soient croquantes à l'extérieur et moelleuses à l'intérieur.
- Lorsque la préparation est bien ferme, y ajouter les 50 g de sucre en poudre restants et le sucre glace, bien mélangés.
- Préparer la plaque de cuisson en y déposant du papier sulfurisé. Préchauffer le four à 90°C (thermostat 3).
- Deux options pour les amandes. Si vous disposez les meringues à la cuillère, mélanger environ 100 g d'amandes effilées à la préparation dès la première étape ; si vous utilisez une poche à douille, disposer quelques amandes effilées sur les meringues une fois dressées sur la plaque.
- Disposer des petits tas égaux en les espaçant pour qu'ils ne se touchent pas pendant la cuisson (ils gonflent légèrement).
- Cuire les meringues à 120°C pendant 20 min, puis à 100°C pendant 1 h.
- Une fois refroidies, les conserver dans une boîte hermétique.

---

Petites meringues croquantes et moelleuses aux amandes effilées. Pour environ 25 meringues. Temps total : 1 h 25 (préparation 25 min, cuisson 1 h).
`,gk=`---
layout: recipe
title: "Minestrone"
image: minestrone


tags:
- soupe
- chou
- lardons
- saucisse de morteau
- carottes
- lentilles corail
- poireau
- orge perlé
- épeautre
- oignon
- ail
- pommes de terre
- tomates
- légumes
- sestu

ingredients:
- 1 petite portion de lardons
- 1/2 saucisse de morteau
- 3 carottes
- 2 tasses moyennes de lentilles corail
- 1 poireau
- 1 tasse orge perlé ou épeautre 1 tasse
- 1 oignon
- 1 ail
- 1 grosse patate
- 1 petite boîte de tomates en dés

directions:
- Couper tout en petits morceaux
- Faire revenir lardons, saucisse en dés puis oignon et ail, ajouter 1L d'eau pour commencer
- Ajouter carottes, orge perlé, poireau, lentilles, tomates, saler, poivrer
- Ajouter de l'eau au-dessus des légumes, de sorte à ce que l'eau recouvre les légumes au double de la hauteur des légumes
- Faire cuire 1 heure

---

On peut rajouter les légumes que l'on veut en réalité, e.g. des petits pois
`,vk=`---\r
\r
layout: recipe\r
title: "Moelleux au chocolat"\r
image: moelleux_au_chocolat\r
\r
tags:\r
- beurre\r
- chocolat\r
- dessert\r
- facile\r
- fondant\r
- gâteau\r
- oeufs\r
- rapide\r
- sestu\r
- sucre\r
\r
ingredients:\r
- 300 g de chocolat noir\r
- 200 g de sucre\r
- 200 g de beurre fondu\r
- 6 œufs\r
\r
directions:\r
- Préchauffer le four à 180°C.\r
- Faire fondre le chocolat au bain-marie.\r
- Mélanger le sucre avec le beurre fondu dans un saladier.\r
- Séparer les blancs des jaunes d'œufs.\r
- Ajouter les jaunes d'œufs au mélange sucre + beurre. Bien mélanger.\r
- Ajouter le chocolat fondu à ce mélange (sucre + beurre + jaunes). Mélanger à nouveau.\r
- Monter les blancs en neige ferme.\r
- Incorporer délicatement les blancs en neige au mélange précédent à l'aide d'une spatule.\r
- Verser la préparation dans un moule beurré d'environ 30 cm de diamètre.\r
- Enfourner pour 40 minutes à 180°C.\r
- Laisser refroidir légèrement, puis déguster c'est un délice !\r
\r
---\r
\r
Moelleux au chocolat fondant, simple et gourmand. Parfait pour les amateurs de chocolat !\r
Astuce : dégustez tiède pour encore plus de fondant.\r
`,yk=`---
layout: recipe
title: "Moelleux à la poire et à la frangipane"
image: moelleux_poire_frangipane

tags:
- dessert
- gateau
- frangipane
- poire
- amandes
- amandes effilees
- poudre d'amande
- oeufs
- yaourt
- beurre
- farine
- sucre
- levure chimique
- four
- automne
- hiver

ingredients:
- 3 poires
- Amandes effilées
- Pour le moelleux
- 2 œufs
- 1 yaourt nature
- 100 g de beurre fondu (+ pour le moule)
- 150 g de farine
- 100 g de sucre
- 1 sachet de levure chimique
- Sel
- Pour la frangipane
- 1 œuf
- 50 g de beurre pommade
- 60 g de poudre d'amande
- 50 g de sucre
- 2 gouttes d'extrait d'amande amère
---

Pour 6 personnes. Temps de préparation : 30 min. Temps de cuisson : 30 min.

## Préparation

- Préparez le moelleux : mélangez dans un saladier la farine avec la levure, le sucre et 1 pincée de sel. Creusez un puits puis ajoutez les œufs battus au préalable, le yaourt et le beurre fondu. Mélangez jusqu'à obtenir une pâte homogène.
- Beurrez un moule à manqué et versez-y la préparation précédente. Réservez.
- Préparez la frangipane : battez le beurre avec le sucre jusqu'à ce que le mélange soit mousseux. Incorporez l'œuf et mélangez. Ajoutez la poudre d'amande et l'extrait d'amande amère. Mélangez bien puis versez le mélange dans le moule, par-dessus la première pâte. Lissez avec une spatule.
- Préchauffez le four à 180 °C. Pelez les poires, coupez-les en deux et épépinez-les. Coupez les demi-poires en fines lamelles sans les couper jusqu'au bout. Déposez-les en rosace sur le dessus de la pâte.
- Parsemez d'amandes effilées et enfournez pour 30 minutes environ, jusqu'à ce que le gâteau soit bien doré.
`,xk=`---
layout: recipe
title: "Œuf en croûte de pain au fromage"
image: oeuf_en_croute_de_pain_au_fromage

tags:
- repas
- plat principal
- pain
- fromage
- tomme de savoie
- cantal
- fromage blanc
- oeufs
- lait
- beurre
- farine
- levure de boulanger deshydratee
- persil
- four
- gourmand

ingredients:
- 6 petits œufs
- Pour la pâte
- 1 œuf
- 25 cl de lait
- 30 g de beurre
- 450 g de farine
- 7 g de levure de boulanger déshydratée (1,5 c. à café)
- 1,5 c. à café de sel
- Pour la farce au fromage
- 2 c. à soupe de persil haché
- 1 œuf + 1 jaune
- 300 g de tomme de Savoie
- 200 g de cantal entre-deux
- 150 g de fromage blanc
- Poivre
---

Pour 6 personnes. Préparation : 30 min. Repos : 2 h 20. Cuisson : 15 min.

## Préparation

- Préparez la pâte. Faites chauffer le lait, ajoutez le beurre pour le faire fondre, puis versez le mélange tiède sur la levure. Fouettez et laissez reposer 5 minutes. Ajoutez l'œuf, fouettez puis ajoutez la farine et le sel. Pétrissez la pâte pendant 5 minutes puis mettez-la dans un saladier huilé et laissez doubler de volume pendant 2 heures.
- Préparez la farce. Enlevez la croûte des fromages. Hachez la tomme de Savoie au couteau et râpez le cantal. Mélangez-les avec le fromage blanc, l'œuf entier, le persil et du poivre.
- Préchauffez le four à 250 °C. Divisez la pâte en 6 morceaux, étalez-les en forme ovale de 10 x 20 cm environ sur 2 plaques à four couvertes de papier cuisson, puis laissez reposer 15 minutes.
- Garnissez la pâte de farce, rabattez les bords pour former des barquettes, badigeonnez du jaune d'œuf battu et enfournez. Réglez la température du four à 180 °C puis laissez cuire 10 minutes.
- Faites un creux dans chaque barquette et cassez-y un œuf. Enfournez de nouveau pour 5 à 6 minutes.
`,_k=`---\r
layout: recipe\r
title: "Okonomiyaki"\r
image: okonomiyaki\r
\r
\r
tags:\r
- japon\r
- voyage\r
- repas\r
- crevettes\r
- chou\r
- dashi\r
- oeufs\r
- farine a gateau\r
- flocons de tempura\r
- gingembre rouge\r
- sauce okonomiyaki\r
- algue sechee\r
- aonori\r
- frit\r
- poele\r
\r
ingredients:\r
- 10g de crevettes\r
- 25g de chou\r
- 15ml (1 c. à café) de Dashi\r
- 3/2 c. à café d'œuf\r
- 15g de farine à gâteau\r
- 1 c. à café de flocons de tempura\r
- 1/2 c. à café de gingembre rouge\r
- 1 c. à café de sauce okonomiyaki\r
- Un peu d'Aonori (algue verte séchée)\r
\r
directions:\r
- Hacher grossièrement le chou en carrés de <5mm\r
- Dans un bol, mélanger le dashi, l'œuf et la farine à gâteau, puis ajouter le chou, les crevettes, les flocons de tempura, le gingembre rouge, et bien mélanger\r
- Dans une poêle, chauffer l'huile et étaler le mélange en cercle\r
- Couvrir et cuire un côté à feu moyen. Retourner, couvrir à nouveau, cuire jusqu'à ce que ce soit entièrement cuit\r
\r
components:\r
- Dashi\r
---\r
\r
Pour 1 personne.\r
`,wk=`---
layout: recipe
title: "Pappardelles aux champignons, bleu, comté et poulet"
image: pappardelles_champignons_bleu_comte_poulet

tags:
- repas
- plat principal
- pates
- pappardelles
- poulet
- champignons
- echalotes
- ciboulette
- bleu
- comte
- creme fraiche
- beurre
- gourmand

ingredients:
- 4 blancs de poulet
- 200 g de champignons de Paris bruns
- 1 échalote
- 6 brins de ciboulette
- 100 g de bleu
- 20 cl de crème fraîche
- 70 g de comté râpé
- 40 g de beurre
- 250 g de pappardelles
- Sel et poivre
---

Pour 4 personnes. Préparation : 20 min. Cuisson : 25 min.

## Préparation

- Faites cuire les blancs de poulet dans une poêle chaude et beurrée environ 5 à 6 minutes sur chaque face, jusqu'à ce qu'ils soient bien dorés. Réservez, mais gardez la matière grasse en fond de poêle.
- Ciselez l'échalote, nettoyez les champignons, coupez-les en quatre, puis faites-les revenir dans la poêle qui a servi pour le poulet. Au bout de 5 minutes de cuisson et après avoir remué à plusieurs reprises, ajoutez la crème et le bleu. Salez et poivrez. Laissez cuire à feu doux afin que la sauce épaississe.
- Plongez pendant ce temps les pappardelles dans une grande casserole d'eau frémissante et laissez cuire environ 10 minutes. Après avoir égoutté les pâtes, ajoutez-les à la sauce, mélangez bien et retirez du feu.
- Préchauffez le four en mode grill.
- Mettez les blancs de poulet préalablement tranchés dans un plat allant au four, ajoutez les pappardelles tout autour, recouvrez les pâtes de comté râpé et enfournez en mode grill pour 3 minutes.
- Dégustez aussitôt, parsemé de ciboulette ciselée.
`,bk=`---
layout: recipe
title: "Pâtes crémeuses à la courge rôtie, à l'ail et à la sauge"
image: pates_courge_ail_sauge

tags:
- repas
- plat principal
- pates
- pates fraiches
- butternut
- ail
- sauge
- pancetta
- parmesan
- mascarpone
- ricotta
- huile d'olive
- four
- automne
- gourmand

ingredients:
- 8 tranches de pancetta
- 1 petite courge butternut
- 1 tête d'ail
- 1 bouquet de sauge fraîche
- 100 g de parmesan
- 1 c. à soupe de mascarpone ou de ricotta
- 400 g de pâtes fraîches (type paccheris)
- Huile d'olive
- Fleur de sel et poivre
---

Pour 4 personnes. Temps de préparation : 15 min. Temps de cuisson : 50 min.

## Préparation

- Préchauffez le four à 180 °C.
- Coupez la courge butternut en deux dans le sens de la longueur, retirez les graines, puis quadrillez la chair. Coupez le chapeau de la tête d'ail. Disposez le tout dans un plat allant au four. Salez, poivrez et arrosez généreusement d'huile d'olive. Déposez le bouquet de sauge fraîche. Enfournez pour 45 minutes (la chair de la courge doit être fondante).
- Portez à ébullition une grande casserole d'eau avec de la fleur de sel, puis faites cuire les pâtes selon le temps indiqué sur le paquet (environ 3 à 4 minutes). Égouttez-les en conservant 1 à 2 louches d'eau de cuisson.
- Grattez la chair de la courge à l'aide d'une cuillère, retirez l'ail confit de sa tête puis mettez le tout dans le bol d'un mixeur. Versez le mascarpone ou la ricotta. Mixez, puis ajoutez l'eau de cuisson des pâtes réservée (selon la texture souhaitée). Rectifiez l'assaisonnement en sel et en poivre si besoin.
- Versez la sauce dans une casserole, ajoutez les pâtes et laissez chauffer à feu doux. Râpez la moitié du parmesan et ajoutez-le. Mélangez bien jusqu'à ce qu'il fonde.
- Faites chauffer une poêle à sec puis faites-y griller la pancetta. Débarrassez, puis hachez-la à l'aide d'un couteau.
- Dressez les pâtes dans des assiettes. Déposez la pancetta grillée et réalisez des copeaux de parmesan à l'aide d'un économe. Poivrez, décorez de quelques feuilles de sauge et dégustez bien chaud.
`,kk=`---
layout: recipe
title: "Pâtes sauce tomate"
image: pates_sauce_tomate

tags:
- repas
- plat principal
- pates
- tomates
- boeuf
- viande
- oignon
- basilic
- perso

ingredients:
- 300g de Pâtes
- 200 cl de purée de tomates sans concentré, nature
- 350 g de boeuf haché
- 1 gros oignon et demi
- Basilic
- Beurre
- Huile d'olive
- Poudre de fond de veau
- Sucre
- Sel
- Poivre
- Parmesan
---

Sauce tomate gourmande au boeuf pour ~2-3 personnes.

## Préparation

- <b>Faire chauffer la poêle.</b>
- Préparer les oignons, environ un gros oignon et demi.
![Un gros oignon et demi](../images/pates_sauce_tomate/oignons.webp)
- Les couper très finement, cela aidera à avoir davantage de caramélisation <i>(plus de surface)</i>.
![Oignons coupés](../images/pates_sauce_tomate/oignons_coupes.webp)
- Une fois que la poele est à bonne température, faire fondre une noix de beurre sur l'huile d'olive. <br>La bonne température est le point où le beurre mousse à l'ajout sans bruler. <br>La matière grasse va aider à caraméliser intensément les oignons sans les brûler. <br>Pas de panique car c'est la seule matière grasse ajoutée de la recette.
![Matière grasse, bonne température pour l'ajout du beurre](../images/pates_sauce_tomate/matiere_grasse.webp)
- Versez les oignons et les saler.
- <b> Faire chauffer l'eau des pates et saler l'eau.</b>
- Faire cuire les oignons à couvert, avec un température plus élevée qu'à la normale (à la découverte). Cela permet de garder de l'humidité et ainsi de les faire caraméliser davantage sans les brûler.
- Remuer régulièrement pour éviter que les oignons ne brûlent. <br>En revanche, <b>bien veiller à reverser l'humidité condensée sur le couvercle dans la poêle afin de continuer à garder les oignons humides et éviter qu'ils ne brûlent</b>. S'ils deviennent trop secs, ajouter soit un peu d'eau, soit un peu de matière grasse.
- <b> Pendant ce temps, découper plus finement le boeuf haché.</b>
![Bœuf haché](../images/pates_sauce_tomate/boeuf_hache.webp)
- Les oignons devraient être bien caramélisés mais pas brulés. <br><i>Dans l'exemple ci-dessous, j'ai malheureusement attendu trop longtemps une fois, cela a rendu la caramélisation un peu trop hétérogène. <br>Le principal est d'avoir une caramélisation homogène et franche.</i>
![Oignons caramélisés](../images/pates_sauce_tomate/oignons_caramel.webp)
- <b>Ajouter le boeuf haché.</b> Saler, poivrer, ajouter environ 3 cuillères à soupe de sauce huitre. Bien mélanger. <br><i>(La sauce huitre n'a presque pas de goût mais va apporter la saveur umami à la viande, la rendant plus savoureuse.)</i>
- Faire cuire le boeuf à couvert. Il va libérer de l'humidité, mais la conserver pour le moment. Remuer régulièrement.
- Faire cuire les pates.
- Préparer le basilic, ne pas hésiter à en prendre une bonne quantité.
![Basilic](../images/pates_sauce_tomate/basilic.webp)
- Superposer et enrouler les feuilles de basilic, puis les ciseler.
![Basilic coupé](../images/pates_sauce_tomate/basilic_coupe.webp)
- Une fois la viande quasiment cuite, continuer à cuire sans le couvercle afin de laisser le liquide s'évaporer.
- Les pâtes devraient être quasiment cuites. <br>Lorsque le liquide de la viande est quasiment évaporé, prendre deux louches de jus de cuisson des pâtes et les ajouter à la poêle. <br>Y ajouter une bonne cuillière à café de poudre de fond de veau. Bien mélanger.
- <b>Ici, le dosage est important:</b><br>Laisser réduire le jus de cuisson, de sorte qu'à l'ajout du coulis de tomates, il y ait 2/3 de volume de jus de tomates pour 1/3 de volume de jus de cuisson.
- Ajouter le coulis de tomates et le basilic.
- En fonction de l'acidité du coulis de tomates, ajouter du sucre. <br>2 cuillères à soupe de sucre est en général la moyenne. Garder à l'esprit que la sucrosité va devenir plus intense au fil de la réduction de la sauce.
- <b>Réduire la sauce à feu plus doux.</b> <br>Les bulles sont épaisses dûes à la viscosité de la sauce tomate. <br><i>Lorsque les bulles deviennent beaucoup plus fines, cela indique que l'eau est trop remontée à la surface, il faut alors mélanger pour éviter de faire bruler la sauce.</i>
- Réduire en fonction de la viscosité finale souhaitée.
- Lorsque la sauce est quasiment prête, il y a très probablement un déséquilibre de saveur (trop peu de sel par rapport au sucre). <br>Ajouter alors le sel pour rectifier l'assaisonnement. <br>Le sel doit être légèrement plus présent que le sucre à ce stade, car le parmesan va encore ajouter du sel. <br><b>Aussi, attention lors du goutage de l'équilibre de la sauce: gouter une trop petite quantité va donner l'impression que la sauce est moins sucrée qu'en réalité.</b>
- Terminer la sauce. L'ajouter aux pâtes, mettre une bonne quantité de parmesan, et mélanger bien.
![Sauce finale](../images/pates_sauce_tomate/sauce_finale.webp)
`,Sk=`---
layout: recipe
title: "Pavé d'agneau et girolles au beurre d'estragon"
image: pave_agneau_girolles_beurre_estragon

tags:
- repas
- plat principal
- viande
- agneau
- girolles
- echalotes
- estragon
- beurre
- huile d'olive
- automne
- gourmand

ingredients:
- 4 pavés d'agneau bio
- 400 g de girolles
- 2 échalotes
- 1 botte d'estragon
- 100 g de beurre demi-sel
- 2 c. à soupe d'huile d'olive
- Sel et poivre
---

Pour 4 personnes. Temps de préparation : 35 min. Temps de cuisson : 12 min.

## Préparation

- Nettoyez les girolles. Effeuillez l'estragon et ciselez-le grossièrement. Hachez les échalotes.
- Chauffez une poêle avec l'huile, salez et poivrez les pavés d'agneau. Colorez-les à feu vif 1 minute de chaque côté, puis cuisez-les 5 minutes à feu modéré en les retournant à mi-cuisson et en les arrosant régulièrement avec le jus de cuisson. Réservez-les au chaud.
- Mettez les girolles dans la poêle avec les échalotes hachées et le jus de cuisson des pavés d'agneau.
- Faites-les cuire 5 minutes à feu vif. Hors du feu, ajoutez le beurre et l'estragon, salez, poivrez et mélangez.
- Servez les pavés accompagnés des girolles au beurre d'estragon.
`,Ck=`---\r
\r
layout: recipe\r
title: "Pomme de terre farcie aux rillettes de thon"\r
image: pomme_de_terre_farcie_aux_rillettes_de_thon\r
\r
tags:\r
- repas\r
- plat\r
- facile\r
- four\r
- pommes de terre\r
- thon\r
- poisson\r
- fromage frais\r
- ciboulette\r
- persil\r
- citron\r
- huile d'olive\r
- gourmand\r
- livre\r
\r
ingredients:\r
- 4 grosses pommes de terre bintje (ou roseval)\r
- ½ bouquet de ciboulette\r
- 3 brins de persil\r
- Huile d'olive\r
- Sel et poivre\r
\r
components:\r
- Rillettes de thon\r
\r
---\r
\r
Pour 4 personnes. Préparation : 20 min. Cuisson : 30 min.\r
\r
## Préparation\r
\r
- Laver et frotter les pommes de terre. Les couper en deux dans le sens de la longueur.\r
- Les plonger dans une casserole d'eau salée et laisser cuire 25 minutes, jusqu'à ce qu'elles soient tendres (mais pas fondantes). Les égoutter et les mettre à refroidir.\r
- Creuser les pommes de terre à l'aide d'une petite cuillère, retirer un tiers de la chair et la réserver.\r
- Préchauffer le four à 180 °C. Laver et essorer la ciboulette et le persil, puis les ciseler.\r
- Préparer les rillettes de thon : incorporer le thon au fromage frais. Ajouter la chair des pommes de terre prélevée, les trois quarts des herbes et mélanger. Verser le jus de citron. Saler et poivrer.\r
- Garnir les pommes de terre de rillettes de thon. Les déposer sur une plaque à four couverte de papier cuisson. Verser un filet d'huile d'olive.\r
- Enfourner pour 5 minutes sous le grill. Parsemer des herbes restantes et servir tiède accompagné d'une salade verte.\r
`,Pk=`---
layout: recipe
title: "Potage au concombre"
image: potage_au_concombre


tags:
- repas
- soupe
- concombre
- yaourt
- noix
- froid
- bocuse
- ciboulette
- ail
- huile d'olive
- sel
- poivre

ingredients:
- 1 gros concombre
- 3 cuillères à soupe de ciboulette hachée
- 2 gousses d'ail
- 15 cerneaux de noix
- 2 cuillères à soupe d'huile d'olive
- 4 yaourts nature
- Sel, poivre du moulin

directions:
- Eplucher le concombre, le couper dans son milieu, enlever les graines, le couper en petits cubes dans un saladier, saler, laisser dégorger 45 minutes à 1 heure
- Laver la ciboulette, éplucher l'ail, hacher le tout sur la planche avec une berceuse (hachoir de ménage). Hacher séparément les cerneaux de noix. Mettre en réserve
- Une fois que le concombre a rendu son eau, le rincer sous l'eau froide, l'égoutter et l'éponger avec du papier absorbant
- Mettre le concombre dans une soupière, ajouter les noix hachées, l'huile, une pincée de sel, un peu de poivre du moulin, les yaourts, la ciboulette hachée (conserver 1 cuillère à soupe de ciboulette qui vous servira à décorer). Mélanger le tout intimement
- Lorsque vous obtenez un mélange pâteux, cesser de remuer. Nettoyer les bords de la soupière avec un papier absorbant humide. Mettre au réfrigérateur pendant 3 à 4 heures
- Au moment de servir, parsemer le reste de ciboulette sur le centre du potage
---

Soupe froide pour 4 personnes.

Temps de préparation : 15 minutes
Temps de réfrigération : 4 heures
`,jk=`---
layout: recipe
title: "Potage Dubarry"
image: potage_de_chou-fleur


tags:
- repas
- soupe
- chou-fleur
- pommes de terre
- creme fraiche
- bocuse
- beurre
- lait
- bouillon blanc
- sel
- cerfeuil
- croûtons

ingredients:
- 600 g de chou-fleur
- 130 g de beurre
- 350 g de pommes de terre
- 1 litre de lait
- 1 bouillon blanc
- 15 g de sel
- 10 cl de crème fraîche
- 1 pincée de cerfeuil
- Croûtons

directions:
- Eplucher et ébouillanter le chou-fleur. Rafraîchir puis égoutter
- Mettre dans une casserole avec 100 g de beurre fondu. Etuver 20 minutes
- Ajouter les pommes de terre coupées en quartiers, le lait, le bouillon blanc (ou de l'eau à défaut) et le sel
- Cuire doucement 20 minutes
- Passer à l'étamine en foulant à fond les légumes. Recueillir la purée dans une casserole
- Faire bouillir et, hors du feu, donner la consistance normale avec une addition de lait bouillant ou de la crème fraîche
- Beurrer le potage au moment de servir
- Adjoindre une pincée de feuilles de cerfeuil et des petits croûtons taillés en dés et frits au beurre
---

Soupe traditionnelle pour 4 personnes.

Temps de préparation : 15 minutes
Temps de cuisson : 45 minutes
`,Tk=`---\r
\r
layout: recipe\r
title:  "Poulet curry"\r
image: poulet_curry\r
\r
\r
tags:\r
- repas\r
- poulet\r
- curry\r
- riz\r
- oignon\r
- sauce huitre\r
- poivre\r
- piment d'espelette\r
- creme fraiche\r
- perso\r
\r
ingredients:\r
- 300-400g de filet de poulet ou d'émincé de dinde (encore mieux)\r
- 1 gros oignon\r
- Sauce huître\r
- Poivre\r
- Piment d'Espelette\r
- Crème fraîche semi-épaisse\r
- riz\r
\r
directions:\r
- Couper l'oignon très finement\r
- A feu vif, huile d'olive, et mettre une noix de beurre dans l'huile lorsque celle-ci peut commencer à crépiter sans brûler\r
- Laisser cuire à feu vif couvert et caraméliser les oignons, ils doivent devenir sucrés et dorés, à la limite de la pâte. Faire attention à ne pas les bruler, mais toutefois essayer de ne pas trop retirer le couvercle pour concerver un maximum d'humidité\r
- Lancer la cuisson du riz (gérer la cuisson)\r
- Couper la viande en dés de 2cm\r
- Ajouter de la sauce huître, poivre et piment d'Espelette\r
- Mélanger le tout et attendre que les oignons soient dorés mais pas encore trop trop cuits\r
- Ajouter la viande et laisser cuire jusqu'à ce que la viande soit bien cuite\r
- Ajouter la crème fraîche, 2 cuillères à café de curry, mélanger et laisser réduire\r
- Une fois la consistance désirée, servir avec le riz\r
---\r
\r
Poulet curry simple, environ 2 portions.\r
\r
Taux de protéines assez élevé compte tenu de la quantité importante de viande blanche: ~120g de protéines en 2 repas.\r
\r
Se mange très facilement.\r
`,zk=`---
layout: recipe
title: "Boulettes poulet Yakitori"
image: poulet_yakitori


tags:
- chapelure
- japon
- oignon
- poulet
- repas
- sauce
- sestu
- yakitori
- miel


ingredients:
- 1 kg de blancs de poulet
- 1 oignon
- 100g de chapelure
- sauce yakitori

directions:
- Hacher le pouler au mixeur + oignon + chapelure, sel, poivre
- Faire cuire les boulettes à la poêle
- Ajouter la sauce sur les boulettes cuites, puis refaire cuire quelques minutes pour bien enrober les boulettes et ajouter le miel

components:
- Sauce Yakitori

---
`,Ek=`---

layout: recipe
title: "Pounchkis (beignets fourrés)"
image: pounchkis


tags:
- beignets
- beurre
- blanc d'oeuf
- chocolat
- confiture
- dessert
- farine
- friture
- huile de friture
- jaunes d'oeufs
- lait
- levure
- levure de boulanger déshydratée
- margarine
- oeufs
- pâte levée
- sel
- sestu
- sucre
- sucre en poudre
- sucre semoule

ingredients:
- 330 g de farine
- 2 jaunes d'œufs + 1 blanc
- 40 g de margarine (ou beurre)
- 25 g de sucre en poudre
- 40 g de sucre semoule (pour sucrer le lait et/ou l'enrobage)
- 1/2 sachet de levure de boulanger déshydratée (5–6 g)
- 1/2 litre de lait, tiède (à ajouter progressivement; vous n'aurez peut‑être pas besoin de tout)
- 1 pincée de sel
- Huile de friture

directions:
- Délayer la levure dans un peu d'eau tiède (ou 2–3 c. à s. de lait tiède). Laisser mousser 5–10 minutes.
- Faire tiédir doucement le lait avec 40 g de sucre et la margarine jusqu'à ce que le sucre soit dissous et la matière grasse fondue. Laisser tiédir.
- Verser la farine et le sel dans un grand saladier, former un puits. Ajouter les 2 jaunes et le blanc d'œuf, le sucre (25 g), la levure délayée, puis commencer à mélanger.
- Ajouter le lait tiède petit à petit en mélangeant, jusqu'à obtenir une pâte souple et légèrement collante. Pétrir 8–10 minutes (main ou robot) jusqu'à ce que la pâte devienne lisse et se décolle des parois.
- Bouler, couvrir et laisser lever 1 h dans un endroit tiède, jusqu'à ce que la pâte double de volume.
- Dégazer. Étaler ou prélever des portions, puis façonner des disques de 3 à 5 cm de diamètre. Déposer au centre un peu de confiture ou de chocolat, refermer soigneusement en scellant les bords. Disposer soudure vers le bas.
- Couvrir et laisser détendre 15 minutes.
- Chauffer l'huile de friture à 170–175°C. Frire les beignets par petites fournées, 2–3 minutes par face, jusqu'à coloration dorée.
- Égoutter sur papier absorbant. Saupoudrer de sucre semoule (ou de sucre glace) tant qu'ils sont encore tièdes.

---

Beignets gonflés et moelleux, à garnir selon l'envie (confiture, chocolat…).
`,Ak=`---
layout: recipe
title: "Punch frais"
image: punch

tags:
- apéritif
- boisson
- cocktail
- été
- frais
- fruits
- jus d'ananas
- jus d'orange
- jus de banane
- jus de citron vert
- jus de goyave
- poivre
- punch
- rhum
- sucre de canne
- vanille
- vanille liquide
- sestu

ingredients:
- 1L de rhum blanc
- 1L de jus de banane
- 1L de jus de goyave
- 1L de jus d'ananas
- 1L de jus d'orange
- 1 fiole de jus de citron vert
- 1 gousse de vanille
- 2 verres de sucre de canne
- 4 cuillères à soupe de vanille liquide
- Un peu de poivre

directions:
- Mélanger tous les jus de fruits avec le rhum blanc dans un grand récipient.
- Ouvrir la gousse de vanille et ajouter les graines, ainsi que la gousse entière au mélange.
- Ajouter le sucre de canne et la vanille liquide, bien mélanger jusqu'à dissolution complète du sucre.
- Ajouter une pincée de poivre pour relever subtilement le goût.
- Laisser reposer au frais au moins 1 heure avant de servir.
- Servir bien frais avec des glaçons.

---

Idéal pour un grand apéritif d'été ou une fête conviviale.
`,Mk=`---\r
\r
layout: recipe\r
title:  "Quatre quart Emilia"\r
image: quatre_quart_emilia\r
\r
tags:\r
- quatre-quarts\r
- gâteau\r
- dessert\r
- sucre\r
- farine\r
- oeufs\r
- huile\r
- sucre vanillé\r
- levure\r
- fruits\r
- sestu\r
- emilia\r
\r
ingredients:\r
- 200 g de farine\r
- 2 sachets de sucre vanillé\r
- 4 œufs\r
- 150 g de sucre\r
- 8 cuillères à soupe d'huile\r
- 1/2 sachet de levure chimique\r
- 1 pincée de sel\r
\r
directions:\r
- Séparer les blancs des jaunes d'œufs.\r
- Mélanger les jaunes uniquement avec le sucre et l'huile.\r
- Ajouter la farine tamisée.\r
- Incorporer le sucre vanillé, la levure chimique et la pincée de sel.\r
- Monter les blancs en neige ferme.\r
- Ajouter délicatement les blancs en neige à la préparation.\r
- Ajouter des fruits de votre choix (raisins secs, poires, pommes, etc.).\r
- Cuire 30-40 minutes à 180°C.\r
\r
---\r
\r
Quatre quarts familial, recette ultra-moelleuse et facile à personnaliser avec divers fruits !\r
Parfait pour le goûter ou le petit-déjeuner.\r
`,Rk=`---

layout: recipe
title: "Ramen maison"
image: ramen_maison

tags:
- plat principal
- ramen
- nouilles
- pâtes fraîches
- farine à pain
- porc
- char siu
- soupe
- bouillon
- japon
- voyage
- fait maison
- saké
- mirin
- sauce soja
- gingembre
- ail
- chou
- pousses de soja
- saindoux
- fond chinois
- dashi

ingredients:
- "**Nouilles (2 pers.)**"
- 200 g de farine à pain
- 1/2 c. à c. de poudre d'eau alcaline (kansui)
- 100 ml d'eau
- fécule de maïs (pour fariner), selon besoin
- sel 1 g
- "**Garnitures**"
- 100 g de pousses de soja
- 250 g de chou (type chou blanc ou chou chinois)
- 20 g d'ail frais
- "**Soupe**"
- 30 g de saké
- 20 g de mirin
- 100 g de sauce soja
- 1 g de sel
- 2 g d'ail frais
- 2 g de gingembre râpé ou en pâte
- 6 g de fond chinois (voir composant Dashi ou équivalent)
- 850 ml d'eau
- 25 g de saindoux
- ajinomoto (MSG) selon goût

directions:
- "**Préparation** : Faire bouillir de l'eau pour blanchir les légumes et pour cuire les nouilles. Préparer le char siu selon le composant « Char siu (porc doré au chalumeau) »."
- "**Nouilles** — Mélanger la farine et la poudre alcaline dans un saladier. Verser l'eau progressivement et mélanger jusqu'à former des grumeaux, puis rassembler la pâte (elle peut sembler un peu sèche, c'est normal). Pétrir à la main jusqu'à ce que la surface soit lisse et la pâte homogène. Fariner le saladier, filmer la pâte et laisser reposer 30 min."
- "**Nouilles (suite)** — Fariner le plan de travail et le rouleau, étaler la pâte en rectangle (environ 30×12 cm). Fariner à nouveau, plier et couper en nouilles de 2 mm d'épaisseur au couteau. Fariner les nouilles, les regrouper et les malaxer légèrement pour créer un effet ondulé. Cuire 5 à 6 min à l'eau bouillante."
- "**Garnitures et soupe** — Couper le chou en lanières en séparant trognon et feuilles. Râper l'ail pour la soupe et hacher l'ail pour la garniture. Dans une grande casserole, mélanger saké, mirin, sauce soja et sel, porter à ébullition pour évaporer l'alcool. Ajouter ail, gingembre, fond chinois et eau, porter à ébullition. À ébullition, ajouter le trognon de chou 30 s, puis les feuilles et les pousses de soja 30 s, égoutter."
- "**Dressage** — Pendant la cuisson des nouilles, mettre le saindoux dans chaque bol et verser la soupe pour pré-assaisonner. Répartir les nouilles cuites dans les bols, garnir de chou, pousses de soja, ail haché et char siu. Saupoudrer d'ajinomoto selon goût."

components:
- Char siu (porc doré au chalumeau)
- Dashi

---

Ramen maison pour 2 personnes : nouilles fraîches à l'eau alcaline, char siu de poitrine de porc au cuiseur à riz puis doré au chalumeau, soupe soja-mirin et garnitures (chou, pousses de soja, ail).
`,Nk=`---

layout: recipe
title: "Raviolis sestu (WIP)"
image: raviolis_sestu

tags:
- plat principal
- pates
- ricotta
- pommes de terre
- parmesan
- sestu
- noix de muscade
- oignons
- echalotes
- perso

ingredients:
- 1,5 kg de farine
- 15 œufs
- 300 g d'huile d'olive
- 1,5 kg de pommes de terre
- 1 kg de ricotta
- parmesan râpé
- 200 g d'oignons et échalotes
- 3 œufs
- noix de muscade

directions:
- Préparer la pâte à raviolis selon le composant « Pâtes fraîches / à raviolis » avec les quantités ci-dessus (farine, 15 œufs, huile). Filmer et réserver au frais 1 h.
- Préparer la farce : cuire les pommes de terre, les écraser. Faire revenir oignons et échalotes. Mélanger avec la ricotta, le parmesan, les 3 œufs et la noix de muscade. Saler, poivrer.
- Étaler la pâte finement, déposer des noisettes de farce, refermer en raviolis en chassant l'air.
- Cuire les raviolis à l'eau bouillante salée jusqu'à ce qu'ils remontent en surface. Servir.

components:
- Pâtes fraîches / à raviolis

---

Raviolis maison farcis pomme de terre, ricotta et parmesan. Pour 20 personnes.
`,Lk=`---
layout: recipe
title: "Ribs sauce à l'orange"
image: ribs_sauce_orange

tags:
- plat
- plat principal
- porc
- viande
- four
- orange
- agrumes
- sucre-sale
- gourmand
- repas
- fait maison

ingredients:
- 2,5 kg de travers de porc
- 3 oranges
- 1 échalote
- 2 gousses d'ail
- 20 cl de fond de veau
- 5 cl d'huile
- 3 c. à soupe de sauce soja
- 2 c. à soupe de sucre roux
- 2 c. à soupe de vinaigre balsamique
- 1 c. à soupe de paprika fumé
- Sel et poivre

components:
- Sauce à l'orange
---

Travers de porc rôtis au four, laqués d'une sauce à l'orange légèrement amère et sucrée-salée, à servir avec des frites.

Pour 6 personnes. Préparation : 25 min. Cuisson : 40 min.

## Préparation

- Préchauffer le four à 180 °C. Déposer les travers sur la plaque du four chemisée de papier sulfurisé. Badigeonner d'huile, saler légèrement. Couvrir de papier ou d'aluminium et enfourner pour 25 minutes.
- Préparer la *Sauce à l'orange* — voir composant.
- Badigeonner généreusement les ribs de sauce. Enfourner à nouveau, sans couvrir, pour 15 minutes à 210 °C. Badigeonner les ribs en cours de cuisson.
- Servir avec des frites et le reste de sauce.

**Une touche amère :** les zestes apportent une note d'amertume à la sauce, que l'on peut atténuer en les faisant blanchir quelques secondes au préalable.
`,Dk=`---\r
layout: recipe\r
title: "Risotto aux champignons et aux châtaignes"\r
image: risotto_aux_champignons_et_aux_chataignes\r
\r
tags:\r
- plat\r
- plat principal\r
- risotto\r
- champignons\r
- chataigne\r
- oignon\r
- ail\r
- parmesan\r
- beurre\r
- bouillon\r
- riz\r
- vin blanc\r
- huile d'olive\r
- repas\r
- casserole\r
\r
ingredients:\r
- 200 g de champignons de Paris\r
- 1 oignon\r
- 1 gousse d'ail\r
- 40 g de parmesan râpé\r
- 30 g de beurre\r
- 1 l de bouillon de légumes\r
- 300 g de riz arborio\r
- 150 g de châtaignes cuites (sous vide ou en bocal)\r
- 10 cl de vin blanc sec\r
- 2 c. à soupe d'huile d'olive\r
- Sel et poivre du moulin\r
---\r
\r
Pour 4 personnes.\r
\r
Temps de préparation : 15 minutes  \r
Temps de cuisson : environ 20 minutes\r
\r
## Préparation\r
\r
- **Préparez la garniture** : émincez l'oignon, hachez l'ail. Nettoyez les champignons et coupez-les en lamelles. Concassez grossièrement les châtaignes. Faites revenir l'oignon et l'ail dans une grande sauteuse avec l'huile d'olive pendant 5 minutes. Ajoutez les champignons et faites-les dorer 10 minutes. Salez et poivrez.\r
- **Ajoutez le riz** : faites-le nacrer 2 minutes en mélangeant, jusqu'à ce qu'il devienne translucide. Versez le vin blanc et laissez-le s'évaporer complètement. Dans une autre casserole, faites chauffer le bouillon à feu très doux.\r
- **Ajoutez le bouillon** : versez le bouillon chaud, louche par louche, en remuant souvent, jusqu'à absorption complète (environ 20 minutes). Ajoutez les châtaignes 5 minutes avant la fin de la cuisson.\r
- **Liez le risotto** : incorporez le beurre et le parmesan. Mélangez délicatement et rectifiez l'assaisonnement. Servez aussitôt.\r
`,Ik=`---
layout: recipe
title: "Riz au lait aux framboises en verrines"
image: riz_au_lait_framboises

tags:
- dessert
- sestu
- riz
- lait
- creme
- sucre
- vanille
- framboises
- gelatine
- biscuits secs

ingredients:
- 25 cl de lait
- 20 cl de crème liquide
- 150 g de riz rond
- 100 g de sucre
- 1 gousse de vanille
- 350 g de framboises
- 2 feuilles de gélatine
- 1 paquet de biscuits secs
---

Pour 4 verrines. Préparation : 20 min. Cuisson : 35 min. Réfrigération : 1 h minimum.

## Préparation

- Dans une casserole, faire chauffer le lait avec la crème liquide et la moitié du sucre à feu moyen. Rincer rapidement le riz à l'eau froide et l'égoutter.
- Ajouter le riz à la préparation lait-crème. Fendre la gousse de vanille en deux dans le sens de la longueur ; gratter les grains au-dessus de la casserole avec la pointe d'un couteau, puis ajouter la gousse. Laisser cuire à feu doux jusqu'à ce que le riz soit tendre et la préparation crémeuse.
- Pendant ce temps, faire tremper les feuilles de gélatine 10 min dans un bol d'eau froide. Mettre les framboises dans une casserole avec le sucre restant et 2 c. à s. d'eau.
- Faire chauffer à feu doux. Essorer la gélatine et l'ajouter aux framboises ; remuer jusqu'à dissolution complète.
- Laisser le riz au lait et le coulis au frais pendant au moins 1 h. Émietter les biscuits secs en chapelure.
- Montage : remplir les verrines aux 3/4 de riz au lait, verser un peu de coulis de framboise, puis parsemer de biscuits émiettés.

**Astuces :** vous pouvez remplacer le coulis par un caramel versé juste avant de servir, ou utiliser de la confiture de fruits rouges. Quelques framboises, fraises ou morceaux d'abricot frais font aussi très bien l'affaire.
`,Fk=`---
layout: recipe
title: "Saint-Jacques façon chaudrée"
image: saint_jacques_facon_chaudree

tags:
- entree
- repas
- poisson
- crevettes
- saint-jacques
- pommes de terre
- carotte
- celeri
- persil
- lait
- creme fraiche
- laurier
- vin blanc
- beurre
- chaud
- livre
- marmiton

ingredients:
- 12 noix de Saint-Jacques de la baie de Saint-Brieuc
- 200 g de filet de poisson blanc
- 4 crevettes
- 400 g de pommes de terre
- 1 carotte
- 1 oignon
- 1/2 blanc de poireau
- 1 petite branche de céleri
- 2 branches de persil
- 1 feuille de laurier
- 15 cl de lait
- 15 cl de crème fraîche
- 1 noix de beurre
- 20 cl de vin blanc sec
- 1 c. à soupe rase de fécule de maïs
- Sel
- Poivre

directions:
- Peler les pommes de terre, la carotte et l'oignon.
- Couper les pommes de terre et la carotte en petits cubes, émincer l'oignon. Couper le céleri et le poireau en fines tranches. Couper le filet de poisson en morceaux.
- Verser le vin blanc et 35 cl d'eau dans une grande casserole. Ajouter la feuille de laurier et porter à frémissement, puis pocher quelques minutes les crevettes et le poisson. Les réserver et conserver le jus de cuisson.
- Faire fondre le beurre dans une cocotte, ajouter l'oignon et cuire pendant 5 minutes à feu moyen. Incorporer les cubes de pommes de terre et de carotte, le céleri et le poireau, puis couvrir avec le jus de cuisson réservé. Saler et laisser cuire pendant environ 25 minutes jusqu'à ce que les légumes soient tendres.
- Délayer la fécule de maïs dans un peu d'eau froide, la verser dans la cocotte et faire épaissir en remuant sans arrêt.
- Ajouter les crevettes, le poisson, les noix de Saint-Jacques, le lait et la crème. Laisser cuire quelques minutes jusqu'à ce que les Saint-Jacques soient juste cuites. Parsemer de persil ciselé, poivrer et servir bien chaud.
---

Chaudrée crémeuse de poisson, crevettes et noix de Saint-Jacques, servie bien chaude en entrée pour quatre personnes.

Pour 4 personnes

Temps de préparation : 20 minutes
Temps de cuisson : 45 minutes

Conservation des Saint-Jacques : les conserver dans le bac à légumes ou dans un endroit frais entre 5 et 10 °C, ventilé et à l'abri du soleil, pendant 2 jours maximum. Les envelopper dans un linge propre.
`,qk=`---
layout: recipe
title: "Salade de chou rouge"
image: salade_chou_rouge


tags:
- salade
- chou
- marinade
- entrée
- froid
- bocuse
- ail
- laurier
- vinaigre
- huile d'olive
- sel
- poivre
- entree

ingredients:
- 1 petit chou rouge
- 3 cuillères à soupe d'huile d'olive
- Sel fin
- Poivre du moulin

components:
- Marinade au vinaigre, ail et laurier

directions:
- Effeuiller le chou, enlever les côtes et laver les feuilles
- Égoutter les feuilles, les réunir et les tailler en julienne fine
- Ébouillanter la julienne 6 minutes, puis l'égoutter à fond
- Préparer la *Marinade au vinaigre, ail et laurier* — voir composant — et l'appliquer en couches successives sur la julienne de chou
- Laisser mariner 2 jours au frais
- Au moment de servir, égoutter et assaisonner avec 3 cuillères à soupe d'huile pour 150g de chou

- Variante 1, Servir tel quel après la marinade
- Variante 2, Mélanger après assaisonnement avec un poids égal de pommes acides coupées en tranches minces
- Méthode rapide alternative, Faire bouillir 2 dl de vinaigre, y ajouter la julienne de chou, donner un bon bouillon et laisser refroidir. Égoutter légèrement et assaisonner de sel, poivre et huile au moment de servir
- Ces procédés ont la propriété d'attendrir le chou et de le rendre plus digeste

---

Pour 4 personnes.

Temps de préparation : 15 minutes

Temps de cuisson : 6 minutes

Temps de marinade : 2 jours
`,Vk=`---\r
layout: recipe\r
title: "Saumon laqué au gingembre, poêlée de marrons et choux de Bruxelles"\r
image: saumon_laque_gingembre_marron_choux_bruxelles\r
\r
tags:\r
- poisson\r
- saumon\r
- gingembre\r
- choux de Bruxelles\r
- marrons\r
- asiatique\r
- automne\r
- plat principal\r
- facile\r
- repas\r
- marmiton\r
- sauce soja\r
- basilic\r
- hiver\r
- four\r
- marinade\r
- sucré-salé\r
\r
ingredients:\r
- 4 pavés de saumon\r
- 500 g de choux de Bruxelles\r
- 1 oignon\r
- 1/2 botte de basilic thaï\r
- 400 g de marrons cuits en bocal\r
- Miel liquide\r
- Sauce soja\r
- 2 c. à soupe d'huile d'olive\r
- Poivre\r
\r
components:\r
- Marinade gingembre-soja\r
\r
directions:\r
- Préparez la *Marinade gingembre-soja* — voir composant.\r
-\r
- Préparez le saumon\r
- Rincez et épongez les pavés de saumon.\r
- Placez-les dans un plat creux, peau vers le bas, et versez la marinade dessus.\r
- Couvrez et laissez reposer 1 heure au frais, en retournant les pavés à mi-temps.\r
- \r
- Faites cuire le saumon\r
- Préchauffez le four à 200 °C.\r
- Disposez les pavés de saumon dans un plat.\r
- Enfournez pour 12 minutes.\r
- Terminez la cuisson quelques minutes sous le gril selon la coloration désirée.\r
- \r
- Préparez l'accompagnement\r
- Épluchez l'oignon et émincez-le.\r
- Nettoyez les choux de Bruxelles et coupez-les en deux.\r
- Dans une sauteuse, faites suer l'oignon avec l'huile d'olive.\r
- Ajoutez les choux de Bruxelles, puis les marrons égouttés.\r
- Arrosez d'un filet de miel et d'un trait de sauce soja.\r
- Poivrez et poursuivez la cuisson 8 minutes à feu moyen.\r
- \r
- Finition. Parsemez de basilic thaï ciselé juste avant de servir.\r
\r
---\r
\r
Pour 4 personnes\r
\r
Temps de préparation: 30m\r
\r
Temps de cuisson: 25m\r
\r
Temps de repos: 1h\r
`,$k=`---\r
layout: recipe\r
title: "Sauté de porc aux abricots, sauce soja et citron vert"\r
image: saute_de_porc_aux_abricots_sauce_soja_citron_vert\r
\r
tags:\r
- plat\r
- plat principal\r
- porc\r
- viande\r
- oignon\r
- abricot\r
- citron\r
- coriandre\r
- sauce soja\r
- miel\r
- huile d'olive\r
- asiatique\r
- repas\r
- casserole\r
- sucre-sale\r
\r
ingredients:\r
- 1,2 kg d'échine de porc en cubes\r
- 4 oignons en lamelles moyennes\r
- 15 petits abricots frais\r
- 1 ou 2 citrons verts (zeste et jus)\r
- 1 bouquet de coriandre fraîche ciselée\r
- 6 c. à soupe de sauce soja\r
- 3 c. à soupe de miel d'acacia\r
- Huile d'olive\r
- Sel\r
- Poivre du moulin\r
---\r
\r
Pour 6 personnes.\r
\r
Temps de préparation : 5 minutes  \r
Temps de cuisson : 1 h 10\r
\r
## Préparation\r
\r
- Dans une cocotte, faire revenir les oignons dans un trait d'huile avec du sel. Attendre un peu, ajouter la viande, puis faire rissoler le tout en remuant souvent (10 minutes en tout).\r
- Verser tous les autres ingrédients sauf les abricots, arroser d'un verre d'eau, couvrir et cuire de 40 à 50 minutes.\r
- Couper les abricots en deux, les rincer, les sécher et les disposer dans la cocotte pour 10 minutes.\r
- Servir avec du riz, des nouilles chinoises ou une fricassée de choi chinouis (pak chaï ou bok choy)... ou tout autre légume de votre choix.\r
`,Ok=`---
layout: recipe
title: "Soupe à l'oignon"
image: soupe_a_loignon


tags:
- repas
- soupe
- oignon
- gruyere
- chaud
- bocuse
- beurre
- farine
- bouillon
- pain
- chapelure
- sel
- poivre
- jaunes d'oeufs
- creme fraiche
- porto
- muscade


ingredients:
- 400 g d'oignons
- 100 g de beurre
- 2 cuillères à soupe de farine
- 1,5 litre de bouillon ou d'eau
- 1 baguette de pain
- 200 g de pain
- 100 g de gruyère
- 1 paquet de chapelure
- Sel, poivre
- 3 jaunes d'œufs (facultatif)
- Crème fraîche (facultatif)
- 1 verre de porto (facultatif)
- Noix de muscade (facultatif)

directions:
- Éplucher puis émincer les oignons
- Mettre le beurre dans une casserole et faire revenir les oignons jusqu'à ce qu'ils prennent une belle couleur blonde
- Ajouter les cuillères de farine, remuer avec une cuillère en bois, bien faire dorer
- Ajouter 6 louches de bouillon chaud (ou d'eau bouillante salée). Laisser cuire à feu moyen 15 minutes environ
- Pendant ce temps, faire griller une baguette de pain coupée dans le sens de la longueur et recoupée en tranches
- Dans une soupière allant au four, disposer le pain en couches, en alternant une couche de pain, une couche de gruyère râpé, quelques lamelles de beurre et un tour de moulin à poivre
- Verser dessus le bouillon chaud, couvrir quelques minutes
- Recouvrir de chapelure, mettre encore un peu de gruyère râpé
- Passer au four à découvert 20 minutes environ à 180°C (th. 6)
- Optionnel - Pour enrichir la soupe, avant de verser le bouillon, battre dans un bol 3 jaunes d'œufs avec de la crème fraîche, un verre de porto et de la noix de muscade râpée. Ajouter un verre de bouillon chaud, mélanger, faire cuire doucement sans cesser de remuer et sans laisser bouillir. Verser dans la soupière avec le reste du bouillon

---

Soupe chaude pour 4 personnes.

Temps de préparation : 20 minutes

Temps de cuisson : 45 minutes
`,Bk=`---
layout: recipe
title: "Soupe ardennaise"
image: 0_TBD


tags:
- repas
- soupe
- endives
- poireaux
- pommes de terre
- pain
- bocuse
- beurre
- eau
- sel
- lait

ingredients:
- 6 endives
- 2 blancs de poireaux
- 2 pommes de terre moyennes
- 150g de beurre
- 1 litre d'eau
- 10g de sel
- 0,5 litre de lait
- 1 flûte à potage (ou équivalent en pain)

directions:
- Éplucher et nettoyer les légumes
- Tailler en julienne les endives et les blancs de poireaux
- Couper les pommes de terre en lames minces
- Faire chauffer 50g de beurre dans une casserole
- Ajouter les légumes et étuver à couvert doucement 15 minutes (les légumes doivent être fondus, non rissolés)
- Ajouter l'eau et saler (8g de sel)
- Cuire à ébullition lente 45 minutes
- Ajouter le lait à la fin de la cuisson
- Couper la flûte ou le pain en fines tranches
- Faire griller légèrement les tranches au four
- Placer les tranches dans la soupière avec le restant du beurre
- Vérifier l'assaisonnement de la soupe
- Verser la soupe bouillante sur le pain au moment de servir
---

Soupe traditionnelle ardennaise pour 6 personnes.

Temps de préparation : 20 minutes
Temps de cuisson : 1 heure
`,Uk=`---
layout: recipe
title: "Soupe au chou"
image: soupe_au_chou


tags:
- repas
- soupe
- chou
- lard
- chaud
- légumes
- bocuse
- pommes de terre
- carottes
- navets
- poireaux
- oignon
- clou de girofle
- eau
- saindoux
- sel
- poivre
- pain

ingredients:
- 400 g de lard demi-sel
- 1 beau chou vert
- 5 pommes de terre (bintje)
- 3 carottes
- 2 navets
- 2 poireaux
- 1 gros oignon
- 1 clou de girofle
- 3 litres d'eau
- 1 cuillère à soupe de saindoux
- Gros sel
- Poivre blanc en grains
- 6 tranches de pain de campagne

directions:
- Remplir une grande marmite de 3 litres d'eau. Ajouter le lard. Porter à ébullition et laisser frémir 10 minutes en écumant
- Eplucher le chou, le laver, le couper en quatre. Faire blanchir 5 minutes dans l'eau bouillante et le retirer
- Eplucher pommes de terre, carottes, navets, poireaux et oignon. Piquer le clou de girofle dans l'oignon
- Laver les légumes. Couper les carottes, les navets, les poireaux en gros morceaux
- Ajouter le chou, les carottes, les navets, les poireaux, l'oignon et le saindoux dans la marmite
- Faire repartir l'ébullition et ajouter une poignée de gros sel et quelques grains de poivre. Couvrir et laisser cuire à petits bouillonnements pendant 45 minutes
- Ajouter les pommes de terre coupées en quatre, 20 minutes avant la fin de la cuisson
- Servir cette soupe sur tranches de pain de campagne mises au fond des assiettes

---

Soupe chaude pour 6 personnes.

Temps de préparation : 30 minutes

Temps de cuisson : 1 heure 05 minutes
`,Hk=`---\r
layout: recipe\r
title: "Soupe de moules"\r
image: soupe_de_moules\r
\r
\r
tags:\r
- ail\r
- beurre\r
- bocuse\r
- creme fraiche\r
- eau\r
- echalotes\r
- fenouil\r
- fromage\r
- huile d'olive\r
- laurier\r
- mediterranee\r
- moules\r
- oignon\r
- pain\r
- persil\r
- poireaux\r
- poisson\r
- poivre\r
- repas\r
- safran\r
- sel\r
- soupe\r
- thym\r
- tomates\r
- vin blanc\r
\r
ingredients:\r
- 4 litres de moules de bouchot\r
- 1 bouteille de Pouilly-Fuissé\r
- 2 gousses d'ail haché\r
- 3 échalotes\r
- 50 g de persil\r
- 100 g de beurre\r
- 250 ml d'huile d'olive\r
- 300 g d'oignons émincés\r
- 300 g de poireaux coupés en julienne\r
- 50 g de fenouil frais\r
- 3 litres d'eau\r
- 4 kg de poisson de la Méditerranée\r
- 1.5 kg de tomates mondées et coupées en morceaux\r
- 1/2 feuille de laurier\r
- 1 branche de thym\r
- Safran en pistil\r
- 250 ml de crème\r
- Sel\r
- Poivre\r
- Pain grillé\r
- Fromage râpé\r
\r
directions:\r
- Faire ouvrir les moules avec 250 ml de vin blanc, l'ail, les échalotes, le persil et le beurre\r
- Faire chauffer l'huile d'olive dans une casserole de 8 à 10 litres\r
- Ajouter les oignons, les poireaux, le fenouil et cuire à feu doux pendant 5 minutes\r
- Verser l'eau, le vin restant, le jus de cuisson des moules, le poisson, les tomates, les herbes et l'assaisonnement\r
- Faire cuire pendant 40 minutes\r
- Passer le bouillon avec un chinois très fin en pressant fortement les ingrédients pour extraire le jus et la chair de poisson\r
- Verser le bouillon dans une marmite et porter à ébullition\r
- Ajouter au dernier moment les moules et la crème\r
- Laisser cuire pendant 2 minutes\r
- Servir en soupière, en présentant à part des croûtons de pain grillé et du fromage râpé\r
---\r
\r
Soupe de moules traditionnelle pour 10 personnes.\r
\r
Temps de préparation : 20 minutes\r
Temps de cuisson : 1 heure\r
`,Wk=`---
layout: recipe
title: "Soupe de poisson au saumon"
image: soupe_de_poisson_au_saumon

tags:
- soupe
- sestu
- poisson
- saumon
- poireau
- carotte
- pomme de terre
- citron
- creme
- bouillon
- fumet de poisson

ingredients:
- 2 filets de saumon (sans peau), coupés en dés
- 2 poireaux (blancs uniquement)
- 2 pommes de terre
- 1 ou 2 carottes râpées
- 1 litre de bouillon (ou fumet) de poisson
- 20 cl de crème fraîche à 30%
- 1 citron (jus et zeste)
- beurre ou huile de tournesol
- sel, poivre
---

## Préparation

- Émincer finement les blancs de poireaux et les faire suer dans du beurre ou de l'huile de tournesol jusqu'à ce qu'ils réduisent de moitié.
- Ajouter les pommes de terre coupées en dés, les carottes râpées, le bouillon de poisson et le zeste de citron. Saler, poivrer.
- Laisser mijoter jusqu'à ce que les pommes de terre soient bien cuites.
- Ajouter les dés de saumon ; laisser cuire 2 à 3 minutes à feu doux.
- Verser la crème fraîche et un trait de jus de citron ; bien ne pas faire bouillir.
- Couvrir et laisser infuser hors du feu 5 minutes avant de servir.
`,Kk=`---
layout: recipe
title: "Soupe nîmoise"
image: soupe_nimoise


tags:
- repas
- soupe
- poireaux
- chou
- celeri
- orge
- riz
- basilic
- bocuse
- sel
- beurre
- eau
- gruyere

ingredients:
- 3 blancs de poireaux
- 300g de chou
- 1 coeur de céleri
- 100g d'orge perlé (ou de riz)
- 1 pincée de basilic écrasé
- 15g de sel
- 50g de beurre
- 2 litres d'eau
- Gruyère râpé

directions:
- Éplucher et nettoyer les légumes
- Tailler les légumes en julienne
- Faire chauffer le beurre dans une casserole
- Ajouter les légumes et faire fondre en étuvant doucement, remuer de temps en temps
- Ajouter l'orge, le basilic et le sel
- Mouiller avec l'eau
- Cuire 45 minutes
- Si l'orge est remplacé par le riz, cuire la soupe 15 minutes, ajouter le riz et continuer la cuisson 30 minutes
- Servir avec un ravier de gruyère râpé
---

Soupe traditionnelle niçoise pour 6 personnes.

Temps de préparation : 15 minutes
Temps de cuisson : 1 heure 15
`,Yk=`---
layout: recipe
title: "Soupe de poireaux et pommes de terre"
image: soupe_poireau_pommes_de_terres


tags:
- beurre
- bocuse
- couennes
- creme fraiche
- poireaux
- poivre
- pommes de terre
- repas
- sel
- soupe

ingredients:
- 500 g de pommes de terre
- 4 poireaux moyens
- 30 g de beurre
- 10 cl de crème fraîche
- Sel, poivre
- Facultatif, 2 paquets de couennes cuites

directions:
- Mettre à bouillir 1,5 litre d'eau salée
- Eplucher et laver les pommes de terre. Eplucher et laver soigneusement les poireaux, les couper en petits tronçons de 1 centimètre environ, à l'aide de ciseaux
- Dans une casserole, faire revenir les poireaux au beurre, dès qu'ils ont rendu leur humidité, verser l'eau bouillante dessus. Couper finement les pommes de terre et les ajouter
- Laisser cuire 20 minutes environ. Faire chauffer la soupière
- Poivrer au moulin et 5 minutes avant de servir ajouter la crème fraîche. Bien remuer. Verser dans la soupière. Servir bien chaud
- Facultatif : 10 minutes avant la fin de la cuisson, mettre à réchauffer dans votre soupe des paquets de couennes que vous garderez au chaud dans un fond de soupe et que vous servirez en deuxième plat accompagnés d'olives noires et de moutarde. Dans ce dernier cas, ne pas ajouter de crème fraîche
---

Soupe traditionnelle pour 4 personnes.

Temps de préparation : 10 minutes
Temps de cuisson : 35 minutes
`,Gk=`---
layout: recipe
title: "Soupe savoyarde"
image: soupe_savoyarde


tags:
- repas
- soupe
- poireaux
- oignon
- celeri
- pommes de terre
- lard
- pain
- gruyere
- bocuse
- lait
- eau
- sel

ingredients:
- 50g de lard gras
- 4 poireaux
- 1 oignon
- 1 branche de céleri
- 2 pommes de terre moyennes
- 1 litre d'eau
- 0.5 litre de lait
- 100g de pain
- Gruyère ou parmesan râpé
- Sel

directions:
- Couper le lard, débarrassé de la couenne, en dés menus
- Faire fondre le lard dans une casserole
- Tailler les poireaux, l'oignon et le céleri en julienne
- Couper les pommes de terre en minces lames
- Ajouter les légumes au lard
- Étuver 15 minutes en remuant de temps à autre
- Mouiller avec l'eau, saler légèrement
- Cuire 35 minutes
- Ajouter le lait et porter à ébullition
- Diviser le pain en petites tranches
- Placer les tranches sur une plaque à pâtisserie
- Saupoudrer de fromage râpé
- Faire gratiner à four chaud
- Mettre le pain dans une soupière
- Au moment de servir, verser la soupe bouillante sur le pain
---

Soupe traditionnelle savoyarde pour 4 personnes.

Temps de préparation : 15 minutes
Temps de cuisson : 50 minutes
`,Xk=`---
layout: recipe
title: "Spaghettis aux girolles sautées"
image: spaghettis_aux_girolles_sautees

tags:
- plat
- plat principal
- pates
- champignons
- beurre
- ail
- persil
- parmesan
- fromage
- saute
- repas
- sel
- poivre

ingredients:
- 600 g de girolles
- 1/2 botte de persil plat
- 2 gousses d'ail
- 125 g de parmesan
- 40 g de beurre mou
- 500 g de spaghettis
- Sel
- Poivre du moulin

directions:
- Préparer les ingrédients en lavant les girolles, en coupant la base de leur pied, en pelant et en hachant l'ail, en effeuillant et en hachant le persil puis en râpant le parmesan.
- Faire sauter les girolles dans une grande sauteuse avec 20 g de beurre pendant environ 8 minutes en salant et en poivrant.
- Ajouter l'ail et le persil dans la sauteuse puis faire revenir l'ensemble encore 10 minutes.
- Porter à ébullition une grande marmite d'eau bouillante salée et y plonger les spaghettis.
- Cuire les spaghettis en suivant le temps de cuisson indiqué sur l'emballage pour obtenir un résultat al dente.
- Égoutter les pâtes, les placer dans un grand saladier avec le reste de beurre et bien mélanger pour les en enrober.
- Incorporer la garniture de girolles aux pâtes et servir immédiatement en proposant le parmesan râpé à part.
---

Spaghettis aux girolles sautées au beurre, parfumées d'ail, de persil et de parmesan, pour un plat de pâtes simple et très parfumé.

Pour 4 personnes

Temps de préparation : 12 minutes
Temps de cuisson : 30 minutes
`,Qk=`---
layout: recipe
title: "Spaghettonis à la crème de roquette et de basilic"
image: spaghettonis_a_la_creme_de_roquette_et_de_basilic

tags:
- plat
- plat principal
- pates
- roquette
- basilic
- brousse de brebis
- mascarpone
- parmesan
- huile d'olive
- fromage
- rapide
- repas
- sel
- poivre

ingredients:
- 100 g de roquette
- 1 gros bouquet de basilic
- 200 g de brousse de brebis
- 200 g de mascarpone
- 100 g de parmesan râpé
- 500 g de spaghettonis
- Huile d'olive vierge extra
- Sel
- Poivre du moulin

directions:
- Préparer les ingrédients en rinçant puis en essorant la roquette, et en effeuillant le basilic.
- Préparer la crème en mixant la brousse avec le mascarpone, le parmesan, environ 60 g de roquette et le basilic. Saler et poivrer.
- Porter à ébullition une grande marmite d'eau bouillante salée et y plonger les pâtes. Cuire en suivant le temps indiqué sur le paquet pour obtenir un résultat al dente.
- Prélever un peu d'eau de cuisson des pâtes et la verser progressivement dans la moitié de la crème placée dans un grand saladier, tout en fouettant pour la détendre. Égoutter les pâtes et les mélanger directement avec cette crème détendue pour bien les enrober.
- Dresser en répartissant les spaghettonis crémeux dans 4 assiettes, garnir avec le reste de feuilles de roquette et déposer une petite cuillerée de crème non détendue sur le dôme de pâtes. Arroser d'un filet d'huile d'olive et servir immédiatement.
---

Spaghettonis crémeux à la crème de roquette, basilic, brousse de brebis, mascarpone et parmesan, pour un plat de pâtes végétarien riche en saveurs herbacées.

Pour 4 personnes

Temps de préparation : 10 minutes
Temps de cuisson : 15 minutes
`,Zk=`---
layout: recipe
title: "Tagliatelles aux gambas flambées"
image: tagliatelles_aux_gambas_flambes

tags:
- pates
- plat principal
- repas
- crevettes
- tomates
- ail
- coriandre
- parmesan
- huile d'olive
- alcool
- chaud
- facile
- whisky

ingredients:
- 28 gambas crues
- 250 g de tomates cocktail
- 1 citron vert
- 3 gousses d'ail
- 1 botte de coriandre
- 100 g de parmesan
- 15 cl d'huile d'olive vierge extra
- 8 cl de whisky
- 3 c. à soupe de sauce Worcestershire
- 1 c. à soupe de piment doux moulu
- 1 c. à soupe de concentré de tomate
- Sel
- Poivre du moulin
- 500 g de tagliatelles

directions:
- Décortiquer les gambas en conservant la queue, fendre le dos pour retirer le boyau noir puis rincer à l'eau froide avant de les sécher dans un papier absorbant.
- Couper les tomates en quartiers.
- Effeuiller la coriandre puis la hacher.
- Peler l'ail puis le hacher finement.
- Presser le citron vert pour en récupérer le jus.
- Porter à ébullition un grand faitout d'eau salée puis y plonger les tagliatelles et cuire en suivant le temps indiqué sur le paquet pour obtenir une texture al dente.
- Faire chauffer la moitié de l'huile d'olive dans une grande sauteuse puis faire revenir les gambas pendant environ 5 minutes pour bien les colorer en salant, en poivrant et en ajoutant le piment doux moulu.
- Verser le whisky sur les gambas et les flamber prudemment jusqu'à extinction de la flamme.
- Laisser réduire le jus de cuisson pendant environ 5 minutes puis déglacer avec la sauce Worcestershire.
- Ajouter l'ail haché et faire revenir 2 minutes en remuant.
- Incorporer le concentré de tomate, détendre avec le jus de citron vert puis ajouter progressivement un peu d'eau de cuisson des pâtes jusqu'à obtenir une sauce onctueuse.
- Ajouter les tomates dans la sauteuse et faire réduire le tout pendant environ 5 minutes.
- Égoutter les tagliatelles puis les ajouter dans la sauteuse, verser le reste d'huile d'olive et mélanger soigneusement pour bien enrober les pâtes de sauce.
- Dresser dans des assiettes creuses en répartissant les gambas.
- Parsemer de coriandre hachée et de parmesan râpé et proposer le reste de parmesan à part.

---

Tagliatelles aux gambas flambées, relevées de whisky, de citron vert et de piment doux, servies avec des tomates cocktail et de la coriandre fraîche.

Pour 4 personnes.

Temps de préparation : 20 minutes.
Temps de cuisson : 30 minutes.
`,Jk=`---
layout: recipe
title: "Tarte amandine aux poires"
image: tarte_amandine_aux_poires

tags:
- dessert
- tarte
- sestu
- poire
- poudre d'amande
- farine
- beurre
- oeufs
- sucre
- citron

ingredients:
- 120 g de farine de blé
- 200 g de beurre
- 180 g de sucre en poudre
- 4 œufs
- 5 poires
- 100 g de poudre d'amandes
- 1 citron
- sel
---

Pour 6 à 8 personnes. Temps de préparation : 1 heure. Temps de cuisson : 45 min.

## Préparation

- Dans un bol, mélanger 100 g de beurre et 90 g de sucre, ajouter 2 jaunes d'œufs puis la farine et une pincée de sel.
- Étaler la pâte et foncer un moule à tarte. Réserver au frais une demi-heure.
- Préchauffer le four à 180°C puis cuire 12 minutes. Laisser refroidir.
- Pendant la cuisson, préparer la crème d'amande : malaxer le beurre restant ramolli et 90 g de sucre, la poudre d'amandes et 2 œufs entiers.
- Éplucher les poires et les citronner pour éviter qu'elles ne s'oxydent. Les couper en deux, ôter le cœur et les tailler en lamelles.
- Étaler la crème d'amande de manière homogène sur le fond de tarte et y disposer les lamelles de poire en éventail.
- Enfourner pendant une bonne demi-heure.
- Vous pouvez glacer votre tarte avec un caramel léger et peu teinté.
`,eS=`---\r
\r
layout: recipe\r
title: "Tartinable chèvre chorizo"\r
image: tartinable_chevre_chorizo\r
\r
tags:\r
- apéritif\r
- entree\r
- chèvre\r
- chorizo\r
- tomates\r
- facile\r
- pain\r
- tartinade\r
- fromage\r
- sésame\r
\r
ingredients:\r
- 100 g de chorizo doux ou fort selon le goût\r
- 200 g de chèvre frais\r
- 1/2 cuillère à café de piment doux\r
- 2 cuillères à soupe de purée de tomates\r
- 1 pincée de sel\r
- 4 wraps de blé\r
- 2 cuillères à soupe d'huile d'olive\r
- 1 cuillère à soupe de sésame doré\r
- 1 cuillère à soupe de ciboulette ciselée\r
\r
directions:\r
- Préchauffer le four à 180°C.\r
- Retirer la peau du chorizo et le couper en petits morceaux.\r
- Mettre le chorizo dans le mixeur avec le chèvre frais, le piment doux, la purée de tomates et un peu de sel. Mixer jusqu'à obtenir une texture rillettes. Réserver.\r
- Couper les wraps en bandelettes puis les disposer sur une plaque de cuisson recouverte de papier sulfurisé.\r
- Badigeonner les wraps d'huile d'olive puis les parsemer de sésame doré et de ciboulette. Enfourner 10 minutes.\r
- Servir le tartinable de chèvre au chorizo dans un bol avec les wraps croûstillants.\r
\r
---\r
\r
Tartinade chèvre et chorizo en texture rillettes, servie avec des bandelettes de wraps toastés au sésame et à la ciboulette.\r
`,nS=`---
layout: recipe
title: "New templating example"
image: 0_TBD

tags:
- example
- tag

ingredients:
- 1 ingrédient exemple
---

Pour X personnes. Temps de préparation : ... Temps de cuisson : ...

## Préparation

- Décrivez ici la première étape de la préparation.
- **Décrivez ici la deuxième étape**: de la préparation.

### (h3 here) Only h2 headings have a style

## Arbitrary h2 heading

~~Strikethrough text works.~~

HTML works.

<iframe width="200" height="200" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

![Annotation de l'image](../images/ankake_sauce.webp){: data-max-width="400px" data-max-height="300px" data-aspect-ratio="16/9" }

Continuez avec toutes les étapes nécessaires.

<button onclick="alert('Bienvenue sur la page de recette !')" style="margin-top:1em">
  Cliquez-moi !
</button>
`,tS=`---
layout: recipe
title: "Tiramisu à l'orange"
image: tiramisu_a_l_orange

tags:
- biscuits cuillere
- cacao
- cointreau
- dessert
- froid
- gourmand
- mascarpone
- oeufs
- orange
- sucre
- tiramisu

ingredients:
- 3 grosses oranges à jus bio
- 2 gros œufs
- 500 g de mascarpone
- 25 à 30 biscuits à la cuillère
- 70 g de sucre en poudre
- 25 g de sucre glace
- 2 c. à soupe de Cointreau (facultatif)
- 1 c. à café de cacao
- 1 pincée de sel
---

Pour 8 personnes. Temps de préparation : 25 min. Réfrigération : 24 h.

## Préparation

- Commencer la recette la veille : laver 1 orange, râper son zeste puis la presser pour récupérer son jus. Presser une deuxième orange. Mélanger les deux jus, ajouter éventuellement le Cointreau et réserver.
- Séparer les blancs des jaunes d'œufs. Monter les blancs en neige avec la pincée de sel. Lorsqu'ils ont doublé de volume, ajouter le sucre glace puis continuer à battre jusqu'à ce qu'ils soient fermes.
- Dans un saladier, fouetter les jaunes d'œufs avec le sucre en poudre et le zeste d'orange au batteur électrique jusqu'à ce que le mélange blanchisse.
- Ajouter le mascarpone et fouetter encore au moins 2 minutes. Incorporer délicatement les blancs en neige à la spatule.
- Déposer une fine couche de crème au mascarpone au fond d'un plat à gratin. Tremper rapidement les biscuits dans le jus d'orange, les ranger au fur et à mesure dans le plat, recouvrir d'une couche de crème, puis répéter une seconde couche biscuits/crème et terminer par la crème.
- Réserver le tiramisu au réfrigérateur pendant 24 heures.
- Le jour du service, éplucher l'orange restante à vif, prélever les suprêmes et les recouper en petits morceaux. Saupoudrer la surface du tiramisu de cacao à l'aide d'une petite passoire, répartir les morceaux d'orange et servir sans attendre.
`,rS=`---

layout: recipe
title: "Tiramisu aux framboises"
image: tiramisu_framboise


tags:
- dessert
- framboises
- sestu
- mascarpone
- speculoos
- pistaches
- oeufs
- sucre en poudre
- sucre
- pistaches natures
- tiramisu

ingredients:
- 3 œufs (blancs et jaunes séparés)
- 200 g de mascarpone
- 80 g de sucre en poudre (à répartir)
- 16 spéculoos
- 250 g de framboises (fraîches ou surgelées, décongelées et égouttées)
- 50 g de pistaches natures, décortiquées (concassées)

directions:
- Réservez quelques framboises entières pour la décoration. Écrasez le reste grossièrement (au besoin, sucrez légèrement avec 1–2 c. à s. (20g) prélevées sur les 80 g de sucre).
- Séparez les œufs. Fouettez les jaunes avec le 50g de sucre jusqu'à ce que le mélange devienne mousseux. Incorporez le mascarpone et fouettez jusqu'à obtenir une crème lisse (sans grumeaux).
- Montez les blancs d'œufs en neige bien ferme. Ajouter les 10g de sucre restants. Incorporez-les délicatement à la crème au mascarpone à l'aide d'une spatule (mouvements enveloppants).
- Concassez les pistaches et réservez.
- --- Montage (4 verrines) 
- Emiettez environ la moitié des spéculoos au fond des verres. Ajoutez une couche de framboises écrasées, puis une couche de crème mascarpone.
- Émiettez le reste des spéculoos par-dessus, ajoutez de nouveau des framboises écrasées puis terminez avec de la crème. Décorez avec les framboises entières et les pistaches concassées.
- Réfrigérez au moins 2 heures avant de servir (idéalement 4 heures) pour que les saveurs se fondent et que la crème prenne.

---

Tiramisu fruité et frais, sans café ni alcool, relevé par le croquant des pistaches et le parfum des spéculoos.
`,iS=`---

layout: recipe
title: "Tiramisu (classique au café)"
image: tiramisu


tags:
- amaretto
- biscuits cuillère
- cacao
- café
- dessert
- marsala
- mascarpone
- oeufs
- sestu
- sucre
- tiramisu

ingredients:
- 500 g de mascarpone
- 4 œufs (blancs et jaunes séparés)
- 150 g de sucre en poudre
- 2 sachets de sucre vanillé (ou 2 c. à c. d'extrait de vanille)
- 300 ml de café fort, refroidi
- 3 à 4 c. à s. d'amaretto ou de marsala (optionnel)
- 30 à 40 biscuits cuillère
- Cacao amer non sucré (pour saupoudrer)
- (Option) 5 bouchons de Marsala (marque Perlino) à la place des c. à s.

directions:
- Préparez un café serré (environ 300 ml). Ajoutez les 2 sachets de sucre vanillé, mélangez, laissez refroidir puis ajoutez l'amaretto ou le marsala. Le trempage des biscuits doit être très rapide (aller‑retour) pour éviter de les détremper.
- Séparez les œufs. Fouettez les jaunes avec le sucre jusqu'à blanchiment (mousseux et pâle). Ajoutez le mascarpone et fouettez de nouveau jusqu'à obtenir une crème lisse, sans grumeaux.
- Montez les blancs en neige bien ferme. Incorporez‑les délicatement à la crème au mascarpone, à la spatule, par mouvements enveloppants.
- --- Montage
- Dans un plat, disposez une première couche de biscuits rapidement trempés dans le café aromatisé. Étalez une couche de crème. Recommencez en alternant biscuits et crème. Terminez par une couche de crème.
- Filmez le plat et réfrigérez au moins 4 heures (idéalement une nuit) afin que la crème prenne et que les saveurs se fondent.
- Juste avant de servir, saupoudrez généreusement de cacao amer non sucré.
- -- (Grand plat, repère mémo):
- ~3 pots de mascarpone, ~3 cafetières de café, ~4 paquets de biscuits.

---

Tiramisu au café traditionnel, onctueux et bien équilibré en amertume (cacao/café) et douceur (mascarpone/sucre).
`,sS=`---
layout: recipe
title: "Travers de porc à la moutarde, au miel et aux pommes"
image: travers_de_porc_moutarde_miel_pommes

tags:
- plat
- plat principal
- porc
- viande
- four
- miel
- moutarde
- pommes de terre
- sucre-sale
- marinade
- automne
- repas
- fait maison

ingredients:
- 800 g de travers de porc
- 5 pommes type Golden
- 1 tête d'ail
- Huile d'olive (pour arroser)
- Sel
- Poivre

components:
- Marinade moutarde-miel

directions:
- Préchauffer le four à 160 °C.
- Préparer la *Marinade moutarde-miel* — voir composant.
- Badigeonner les travers de porc avec la marinade à l'aide d'un pinceau puis réserver au frais pendant au moins 30 minutes.
- Nettoyer les pommes, retirer le trognon puis les couper en quartiers.
- Couper la tête d'ail en deux dans l'épaisseur.
- Disposer la viande, les quartiers de pommes et l'ail dans un plat allant au four.
- Arroser d'un filet d'huile d'olive puis enfourner pour environ 1 h 30.
- Retirer les pommes à mi-cuisson pour éviter qu'elles ne se défassent puis les remettre dans le plat 5 minutes avant la fin de la cuisson.
---

Travers de porc rôtis au four, laqués d'une marinade à la moutarde et au miel, accompagnés de quartiers de pommes fondants et parfumés à l'ail.

Pour 4 personnes

Temps de préparation : 20 minutes
Temps de cuisson : 1 h 30
Temps de marinade : 30 minutes
`,oS=`---
layout: recipe
title: "Velouté d'asperges"
image: veloute_asperges


tags:
- repas
- soupe
- asperges
- creme fraiche
- chaud
- bocuse
- oignon
- persil
- fécule
- beurre
- sel
- poivre

ingredients:
- 600 g d'asperges vertes
- 1 oignon moyen
- 1 petit bouquet de persil
- 1 cuillère à soupe de fécule
- 10 cl de crème fleurette
- 50 g de beurre
- Sel, poivre

directions:
- Eplucher soigneusement les asperges, les laver rapidement sous l'eau froide. Couper les pointes et le reste du blanc (qui doit être tendre) en lamelles. Eplucher l'oignon, laver le persil et l'attacher en bouquet
- Mettre à bouillir 1 litre d'eau salée ; dès qu'elle arrive à ébullition, y mettre les asperges, l'oignon et le persil. Laisser cuire environ 15 à 20 minutes
- Retirer le tout à l'aide d'une araignée (écumoire en fil étamé) et conserver l'eau de cuisson sur feu doux. Mettre la soupière à chauffer
- Délayer la fécule dans un bol avec un peu d'eau froide puis l'ajouter à l'eau de cuisson, remuer avec une cuillère en bois jusqu'à ce que l'ébullition reprenne
- Baisser la chaleur, ajouter la crème et le beurre, remuer pour lier intimement. Remettre les asperges uniquement. Laisser encore 3 à 4 minutes puis verser dans la soupière de service
- Servir bien chaud
---

Soupe chaude pour 4 personnes.

Temps de préparation : 15 minutes
Temps de cuisson : 25 à 30 minutes
`,aS=`---\r
layout: recipe\r
title: "Velouté de champignons de Paris au tahini"\r
image: veloute_de_champignons_de_paris_au_tahini\r
\r
tags:\r
- soupe\r
- veloute\r
- champignons\r
- tahini\r
- oignon\r
- pommes de terre\r
- ail\r
- bouillon\r
- huile d'olive\r
- huile de sesame\r
- sesame\r
- pain\r
- croutons\r
- repas\r
- casserole\r
\r
ingredients:\r
- 500 g de champignons de Paris\r
- 1 oignon moyen\r
- 1 petite pomme de terre\r
- 1 gousse d'ail\r
- 75 cl de bouillon de légumes\r
- 2 c. à soupe de tahini\r
- 2 c. à café d'huile d'olive\r
- 1 c. à café d'huile de sésame grillé\r
- Sel et poivre\r
- 4 tranches de pain rassis ou de campagne (pour les croûtons)\r
- 1 c. à soupe d'huile d'olive (pour les croûtons)\r
- Ail en poudre (pour les croûtons)\r
---\r
\r
Pour 4 personnes.\r
\r
Temps de préparation : 10 minutes  \r
Temps de cuisson : 25 minutes\r
\r
## Préparation\r
\r
- **Préparez les légumes** : nettoyez les champignons, coupez-les grossièrement. Pelez et coupez la pomme de terre en petits dés. Émincez l'oignon et l'ail. Dans une casserole, faites chauffer l'huile d'olive. Faites suer l'oignon et l'ail 3 minutes. Ajoutez les champignons émincés et les dés de pomme de terre. Faites revenir 5 minutes. Versez le bouillon chaud, couvrez et laissez mijoter 15 minutes à feu moyen. Les légumes doivent être tendres.\r
\r
- **Préparez les croûtons** : pendant la cuisson, coupez le pain en petits cubes. Faites-le dorer 5 minutes à la poêle avec l'huile d'olive et un peu d'ail en poudre, jusqu'à ce qu'ils soient bien croustillants.\r
\r
- **Mixez** : hors du feu, ajoutez le tahini au velouté. Mixez finement. Salez, poivrez.\r
\r
- **Servez** : versez le velouté chaud dans 4 bols, ajoutez un filet d'huile de sésame grillé par-dessus. Parsemez de croûtons juste avant de servir.\r
`,lS=`---\r
layout: recipe\r
title: "Velouté de potiron aux épices douces"\r
image: veloute_de_potiron\r
\r
\r
tags:\r
- soupe\r
- potiron\r
- végétarien\r
- automne\r
- mascarpone\r
- épices\r
- facile\r
- velouté\r
- entrée\r
- marmiton\r
\r
\r
ingredients:\r
- 800g de potiron\r
- 2 brins de persil\r
- 2 pistils de safran\r
- 250g de mascarpone\r
- 1 c. à café de baies roses\r
- 1 c. à café de graines de nigelle\r
- sel et poivre\r
\r
directions:\r
- Pelez et épépinez le potiron puis coupez-le en cubes.\r
- Mettez les pistils de safran à infuser dans une tasse de 5cl d'eau chaude.\r
- Pilez les baies roses au mortier.\r
- Effeuillez et hachez finement le persil.\r
- Plongez le potiron dans une marmite d'eau bouillante salée pendant 15-20 min ou jusqu'à ce qu'il soit bien tendre.\r
- Sortez-le avec une écumoire et placez-le dans le bol d'un mixeur.\r
- Mixez avec l'eau au safran, du sel, du poivre et en ajoutant juste assez d'eau de cuisson pour obtenir un velouté lisse et fluide mais assez dense.\r
- Servez dans 4 bols ou assiettes creuses. Déposez une quenelle de mascarpone au centre, parsemez de graines de nigelle, de persil, de baies roses et de graines de courge.\r
---\r
\r
Pour 4 personnes\r
\r
Temps de préparation: 10m\r
\r
Temps de cuisson: 15m\r
`,uS=`---
layout: recipe
title: "Velouté de patate douce, lentilles corail et œuf poché"
image: veloute_patate_douce_lentilles_corail

tags:
- repas
- soupe
- veloute
- chaud
- patate douce
- lentilles corail
- carotte
- oignon
- oeufs
- lait de coco
- curry
- persil
- pain
- croutons
- gourmand

ingredients:
- 400 g de patates douces
- 1 carotte
- 1 petit oignon
- Persil
- 4 œufs
- 10 cl de lait de coco
- 100 g de lentilles corail
- 100 g de pain rassis
- 1 cube de bouillon de légumes
- 2 c. à soupe d'huile d'olive
- 1 c. à soupe de vinaigre
- 1 c. à café de curry
---

Pour 4 personnes. Préparation : 30 min. Cuisson : 35 min.

## Préparation

- Pelez l'oignon et hachez-le finement. Épluchez les patates douces et la carotte, puis coupez le tout en cubes. Lavez les lentilles et égouttez-les. Lavez le persil et ciselez-le.
- Faites revenir l'oignon dans un faitout avec 1 cuillerée à soupe d'huile d'olive pendant quelques minutes, jusqu'à ce qu'il soit translucide. Ajoutez les patates douces, la carotte, les lentilles et le curry. Couvrez d'eau et émiettez dessus le cube de bouillon. Laissez cuire 30 minutes environ (il faut pouvoir planter facilement un couteau dans la patate douce).
- Préchauffez, pendant ce temps, le four à 180 °C.
- Coupez le pain en petits cubes, mélangez-les bien avec le reste d'huile d'olive dans un saladier et étalez-les sur une plaque couverte de papier cuisson. Enfournez pour 10 minutes, en remuant à mi-cuisson. Réservez.
- Mixez le velouté à l'aide d'un mixeur plongeant en ajoutant le lait de coco. Réservez au chaud.
- Faites bouillir un grand volume d'eau et ajoutez le vinaigre. Réduisez le feu. Cassez les œufs individuellement dans un petit ramequin avant de les plonger dans l'eau bouillante et de les laisser cuire 3 minutes. Sortez-les à l'aide d'une écumoire.
- Versez le velouté dans des bols. Déposez par-dessus les œufs pochés ainsi que quelques croûtons et parsemez de persil.
`,cS=`---
layout: recipe
title: "Velouté de potimarron au bleu et au bacon grillé"
image: veloute_potimarron_bleu_bacon

tags:
- repas
- soupe
- veloute
- potimarron
- bleu
- bacon
- creme
- echalotes
- persil
- beurre
- bouillon
- automne
- hiver
- chaud

ingredients:
- 6 tranches de poitrine fumée
- 1 petit potimarron Prince de Bretagne
- 3 échalotes traditionnelles Prince de Bretagne
- 6 brins de persil
- 40 cl de crème liquide
- 180 g de bleu d'Auvergne
- 75 g de beurre
- 1 cube de bouillon de légumes
- Sel et poivre
---

Pour 6 personnes. Temps de préparation : 20 min. Temps de cuisson : 35 min.

## Préparation

- Videz le potimarron et épluchez-le, puis découpez-le en morceaux. Épluchez les échalotes et émincez-les.
- Faites revenir à feu doux, dans une cocotte ou une grande casserole, les échalotes émincées avec le beurre. Ajoutez le potimarron et le cube de bouillon, puis couvrez d'eau à hauteur. Laissez cuire à feu moyen pendant 30 minutes.
- Faites griller, pendant ce temps, les tranches de poitrine fumée dans une poêle à feu vif et sans matière grasse. Réservez sur du papier absorbant.
- Prélevez 1 verre d'eau de cuisson du potimarron et réservez. Mixez le reste à l'aide d'un mixeur plongeant en ajoutant du sel, du poivre et la crème. Ajustez la consistance si besoin avec l'eau réservée.
- Servez le velouté dans des bols ou des assiettes creuses, puis parsemez de fromage émietté et de persil ciselé. Accompagnez les veloutés de bacon croustillant.
`,dS=`---
layout: recipe
title: "Vichyssoise"
image: vichyssoise


tags:
- repas
- soupe
- poireaux
- pommes de terre
- creme fraiche
- bocuse
- beurre
- eau
- thym
- persil
- ciboulette
- sel
- poivre

ingredients:
- 1 kg de poireaux
- 500 g de pommes de terre (bintje)
- 80 g de beurre
- 2 litres d'eau
- 1 brin de thym
- 1 brin de persil
- 3 dl de crème liquide
- 10 brins de ciboulette
- Sel
- Poivre

directions:
- Eplucher les poireaux, les ouvrir en croix, les laver soigneusement. Conserver uniquement la partie blanche et l'émincer
- Eplucher les pommes de terre, les laver, les couper en gros dés
- Faire fondre le beurre dans une grande casserole. Ajouter les poireaux émincés et les faire fondre à feu doux sans perdre couleur
- Ajouter les dés de pommes de terre dans la casserole. Mélanger bien
- Verser l'eau par-dessus, saler, poivrer et ajouter les brins de persil et de thym
- Porter à ébullition et laisser cuire à petits frémissements 35 minutes environ
- Egoutter poireaux et pommes de terre, retirer les brins de thym et de persil. Réserver un peu d'eau de cuisson
- Mettre les légumes dans le bol du mixeur, les réduire en purée
- Reverser cette purée dans la casserole avec une louche d'eau de cuisson et la crème
- Poser sur feu moyen et ramener à ébullition sans cesser de fouetter
- Laisser refroidir avant de mettre au réfrigérateur pour 2 heures
- Au moment de servir, rectifier l'assaisonnement en sel et en poivre
- Verser la vichyssoise dans des tasses à consommé et parsemer le dessus de ciboulette hachée
---

Soupe froide traditionnelle pour 6 personnes.

Temps de préparation : 30 minutes
Temps de cuisson : 50 minutes
Temps de réfrigération : 2 heures
`;/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */function Zv(e){return typeof e>"u"||e===null}function fS(e){return typeof e=="object"&&e!==null}function pS(e){return Array.isArray(e)?e:Zv(e)?[]:[e]}function hS(e,n){var t,r,i,s;if(n)for(s=Object.keys(n),t=0,r=s.length;t<r;t+=1)i=s[t],e[i]=n[i];return e}function mS(e,n){var t="",r;for(r=0;r<n;r+=1)t+=e;return t}function gS(e){return e===0&&Number.NEGATIVE_INFINITY===1/e}var vS=Zv,yS=fS,xS=pS,_S=mS,wS=gS,bS=hS,Oe={isNothing:vS,isObject:yS,toArray:xS,repeat:_S,isNegativeZero:wS,extend:bS};function Jv(e,n){var t="",r=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(t+='in "'+e.mark.name+'" '),t+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!n&&e.mark.snippet&&(t+=`

`+e.mark.snippet),r+" "+t):r}function Ts(e,n){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=n,this.message=Jv(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}Ts.prototype=Object.create(Error.prototype);Ts.prototype.constructor=Ts;Ts.prototype.toString=function(n){return this.name+": "+Jv(this,n)};var Xn=Ts;function su(e,n,t,r,i){var s="",o="",a=Math.floor(i/2)-1;return r-n>a&&(s=" ... ",n=r-a+s.length),t-r>a&&(o=" ...",t=r+a-o.length),{str:s+e.slice(n,t).replace(/\t/g,"→")+o,pos:r-n+s.length}}function ou(e,n){return Oe.repeat(" ",n-e.length)+e}function kS(e,n){if(n=Object.create(n||null),!e.buffer)return null;n.maxLength||(n.maxLength=79),typeof n.indent!="number"&&(n.indent=1),typeof n.linesBefore!="number"&&(n.linesBefore=3),typeof n.linesAfter!="number"&&(n.linesAfter=2);for(var t=/\r?\n|\r|\0/g,r=[0],i=[],s,o=-1;s=t.exec(e.buffer);)i.push(s.index),r.push(s.index+s[0].length),e.position<=s.index&&o<0&&(o=r.length-2);o<0&&(o=r.length-1);var a="",l,u,c=Math.min(e.line+n.linesAfter,i.length).toString().length,d=n.maxLength-(n.indent+c+3);for(l=1;l<=n.linesBefore&&!(o-l<0);l++)u=su(e.buffer,r[o-l],i[o-l],e.position-(r[o]-r[o-l]),d),a=Oe.repeat(" ",n.indent)+ou((e.line-l+1).toString(),c)+" | "+u.str+`
`+a;for(u=su(e.buffer,r[o],i[o],e.position,d),a+=Oe.repeat(" ",n.indent)+ou((e.line+1).toString(),c)+" | "+u.str+`
`,a+=Oe.repeat("-",n.indent+c+3+u.pos)+`^
`,l=1;l<=n.linesAfter&&!(o+l>=i.length);l++)u=su(e.buffer,r[o+l],i[o+l],e.position-(r[o]-r[o+l]),d),a+=Oe.repeat(" ",n.indent)+ou((e.line+l+1).toString(),c)+" | "+u.str+`
`;return a.replace(/\n$/,"")}var SS=kS,CS=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],PS=["scalar","sequence","mapping"];function jS(e){var n={};return e!==null&&Object.keys(e).forEach(function(t){e[t].forEach(function(r){n[String(r)]=t})}),n}function TS(e,n){if(n=n||{},Object.keys(n).forEach(function(t){if(CS.indexOf(t)===-1)throw new Xn('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=n,this.tag=e,this.kind=n.kind||null,this.resolve=n.resolve||function(){return!0},this.construct=n.construct||function(t){return t},this.instanceOf=n.instanceOf||null,this.predicate=n.predicate||null,this.represent=n.represent||null,this.representName=n.representName||null,this.defaultStyle=n.defaultStyle||null,this.multi=n.multi||!1,this.styleAliases=jS(n.styleAliases||null),PS.indexOf(this.kind)===-1)throw new Xn('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}var Fe=TS;function xh(e,n){var t=[];return e[n].forEach(function(r){var i=t.length;t.forEach(function(s,o){s.tag===r.tag&&s.kind===r.kind&&s.multi===r.multi&&(i=o)}),t[i]=r}),t}function zS(){var e={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},n,t;function r(i){i.multi?(e.multi[i.kind].push(i),e.multi.fallback.push(i)):e[i.kind][i.tag]=e.fallback[i.tag]=i}for(n=0,t=arguments.length;n<t;n+=1)arguments[n].forEach(r);return e}function Cc(e){return this.extend(e)}Cc.prototype.extend=function(n){var t=[],r=[];if(n instanceof Fe)r.push(n);else if(Array.isArray(n))r=r.concat(n);else if(n&&(Array.isArray(n.implicit)||Array.isArray(n.explicit)))n.implicit&&(t=t.concat(n.implicit)),n.explicit&&(r=r.concat(n.explicit));else throw new Xn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.forEach(function(s){if(!(s instanceof Fe))throw new Xn("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new Xn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new Xn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(s){if(!(s instanceof Fe))throw new Xn("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(Cc.prototype);return i.implicit=(this.implicit||[]).concat(t),i.explicit=(this.explicit||[]).concat(r),i.compiledImplicit=xh(i,"implicit"),i.compiledExplicit=xh(i,"explicit"),i.compiledTypeMap=zS(i.compiledImplicit,i.compiledExplicit),i};var ES=Cc,AS=new Fe("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return e!==null?e:""}}),MS=new Fe("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return e!==null?e:[]}}),RS=new Fe("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return e!==null?e:{}}}),NS=new ES({explicit:[AS,MS,RS]});function LS(e){if(e===null)return!0;var n=e.length;return n===1&&e==="~"||n===4&&(e==="null"||e==="Null"||e==="NULL")}function DS(){return null}function IS(e){return e===null}var FS=new Fe("tag:yaml.org,2002:null",{kind:"scalar",resolve:LS,construct:DS,predicate:IS,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function qS(e){if(e===null)return!1;var n=e.length;return n===4&&(e==="true"||e==="True"||e==="TRUE")||n===5&&(e==="false"||e==="False"||e==="FALSE")}function VS(e){return e==="true"||e==="True"||e==="TRUE"}function $S(e){return Object.prototype.toString.call(e)==="[object Boolean]"}var OS=new Fe("tag:yaml.org,2002:bool",{kind:"scalar",resolve:qS,construct:VS,predicate:$S,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function BS(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function US(e){return 48<=e&&e<=55}function HS(e){return 48<=e&&e<=57}function WS(e){if(e===null)return!1;var n=e.length,t=0,r=!1,i;if(!n)return!1;if(i=e[t],(i==="-"||i==="+")&&(i=e[++t]),i==="0"){if(t+1===n)return!0;if(i=e[++t],i==="b"){for(t++;t<n;t++)if(i=e[t],i!=="_"){if(i!=="0"&&i!=="1")return!1;r=!0}return r&&i!=="_"}if(i==="x"){for(t++;t<n;t++)if(i=e[t],i!=="_"){if(!BS(e.charCodeAt(t)))return!1;r=!0}return r&&i!=="_"}if(i==="o"){for(t++;t<n;t++)if(i=e[t],i!=="_"){if(!US(e.charCodeAt(t)))return!1;r=!0}return r&&i!=="_"}}if(i==="_")return!1;for(;t<n;t++)if(i=e[t],i!=="_"){if(!HS(e.charCodeAt(t)))return!1;r=!0}return!(!r||i==="_")}function KS(e){var n=e,t=1,r;if(n.indexOf("_")!==-1&&(n=n.replace(/_/g,"")),r=n[0],(r==="-"||r==="+")&&(r==="-"&&(t=-1),n=n.slice(1),r=n[0]),n==="0")return 0;if(r==="0"){if(n[1]==="b")return t*parseInt(n.slice(2),2);if(n[1]==="x")return t*parseInt(n.slice(2),16);if(n[1]==="o")return t*parseInt(n.slice(2),8)}return t*parseInt(n,10)}function YS(e){return Object.prototype.toString.call(e)==="[object Number]"&&e%1===0&&!Oe.isNegativeZero(e)}var GS=new Fe("tag:yaml.org,2002:int",{kind:"scalar",resolve:WS,construct:KS,predicate:YS,represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),XS=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function QS(e){return!(e===null||!XS.test(e)||e[e.length-1]==="_")}function ZS(e){var n,t;return n=e.replace(/_/g,"").toLowerCase(),t=n[0]==="-"?-1:1,"+-".indexOf(n[0])>=0&&(n=n.slice(1)),n===".inf"?t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:n===".nan"?NaN:t*parseFloat(n,10)}var JS=/^[-+]?[0-9]+e/;function eC(e,n){var t;if(isNaN(e))switch(n){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(n){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(n){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(Oe.isNegativeZero(e))return"-0.0";return t=e.toString(10),JS.test(t)?t.replace("e",".e"):t}function nC(e){return Object.prototype.toString.call(e)==="[object Number]"&&(e%1!==0||Oe.isNegativeZero(e))}var tC=new Fe("tag:yaml.org,2002:float",{kind:"scalar",resolve:QS,construct:ZS,predicate:nC,represent:eC,defaultStyle:"lowercase"}),rC=NS.extend({implicit:[FS,OS,GS,tC]}),iC=rC,ey=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ny=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function sC(e){return e===null?!1:ey.exec(e)!==null||ny.exec(e)!==null}function oC(e){var n,t,r,i,s,o,a,l=0,u=null,c,d,f;if(n=ey.exec(e),n===null&&(n=ny.exec(e)),n===null)throw new Error("Date resolve error");if(t=+n[1],r=+n[2]-1,i=+n[3],!n[4])return new Date(Date.UTC(t,r,i));if(s=+n[4],o=+n[5],a=+n[6],n[7]){for(l=n[7].slice(0,3);l.length<3;)l+="0";l=+l}return n[9]&&(c=+n[10],d=+(n[11]||0),u=(c*60+d)*6e4,n[9]==="-"&&(u=-u)),f=new Date(Date.UTC(t,r,i,s,o,a,l)),u&&f.setTime(f.getTime()-u),f}function aC(e){return e.toISOString()}var lC=new Fe("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:sC,construct:oC,instanceOf:Date,represent:aC});function uC(e){return e==="<<"||e===null}var cC=new Fe("tag:yaml.org,2002:merge",{kind:"scalar",resolve:uC}),Gd=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function dC(e){if(e===null)return!1;var n,t,r=0,i=e.length,s=Gd;for(t=0;t<i;t++)if(n=s.indexOf(e.charAt(t)),!(n>64)){if(n<0)return!1;r+=6}return r%8===0}function fC(e){var n,t,r=e.replace(/[\r\n=]/g,""),i=r.length,s=Gd,o=0,a=[];for(n=0;n<i;n++)n%4===0&&n&&(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)),o=o<<6|s.indexOf(r.charAt(n));return t=i%4*6,t===0?(a.push(o>>16&255),a.push(o>>8&255),a.push(o&255)):t===18?(a.push(o>>10&255),a.push(o>>2&255)):t===12&&a.push(o>>4&255),new Uint8Array(a)}function pC(e){var n="",t=0,r,i,s=e.length,o=Gd;for(r=0;r<s;r++)r%3===0&&r&&(n+=o[t>>18&63],n+=o[t>>12&63],n+=o[t>>6&63],n+=o[t&63]),t=(t<<8)+e[r];return i=s%3,i===0?(n+=o[t>>18&63],n+=o[t>>12&63],n+=o[t>>6&63],n+=o[t&63]):i===2?(n+=o[t>>10&63],n+=o[t>>4&63],n+=o[t<<2&63],n+=o[64]):i===1&&(n+=o[t>>2&63],n+=o[t<<4&63],n+=o[64],n+=o[64]),n}function hC(e){return Object.prototype.toString.call(e)==="[object Uint8Array]"}var mC=new Fe("tag:yaml.org,2002:binary",{kind:"scalar",resolve:dC,construct:fC,predicate:hC,represent:pC}),gC=Object.prototype.hasOwnProperty,vC=Object.prototype.toString;function yC(e){if(e===null)return!0;var n=[],t,r,i,s,o,a=e;for(t=0,r=a.length;t<r;t+=1){if(i=a[t],o=!1,vC.call(i)!=="[object Object]")return!1;for(s in i)if(gC.call(i,s))if(!o)o=!0;else return!1;if(!o)return!1;if(n.indexOf(s)===-1)n.push(s);else return!1}return!0}function xC(e){return e!==null?e:[]}var _C=new Fe("tag:yaml.org,2002:omap",{kind:"sequence",resolve:yC,construct:xC}),wC=Object.prototype.toString;function bC(e){if(e===null)return!0;var n,t,r,i,s,o=e;for(s=new Array(o.length),n=0,t=o.length;n<t;n+=1){if(r=o[n],wC.call(r)!=="[object Object]"||(i=Object.keys(r),i.length!==1))return!1;s[n]=[i[0],r[i[0]]]}return!0}function kC(e){if(e===null)return[];var n,t,r,i,s,o=e;for(s=new Array(o.length),n=0,t=o.length;n<t;n+=1)r=o[n],i=Object.keys(r),s[n]=[i[0],r[i[0]]];return s}var SC=new Fe("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:bC,construct:kC}),CC=Object.prototype.hasOwnProperty;function PC(e){if(e===null)return!0;var n,t=e;for(n in t)if(CC.call(t,n)&&t[n]!==null)return!1;return!0}function jC(e){return e!==null?e:{}}var TC=new Fe("tag:yaml.org,2002:set",{kind:"mapping",resolve:PC,construct:jC}),zC=iC.extend({implicit:[lC,cC],explicit:[mC,_C,SC,TC]}),Dt=Object.prototype.hasOwnProperty,za=1,ty=2,ry=3,Ea=4,au=1,EC=2,_h=3,AC=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,MC=/[\x85\u2028\u2029]/,RC=/[,\[\]\{\}]/,iy=/^(?:!|!!|![a-z\-]+!)$/i,sy=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function wh(e){return Object.prototype.toString.call(e)}function $n(e){return e===10||e===13}function sr(e){return e===9||e===32}function Qe(e){return e===9||e===32||e===10||e===13}function qr(e){return e===44||e===91||e===93||e===123||e===125}function NC(e){var n;return 48<=e&&e<=57?e-48:(n=e|32,97<=n&&n<=102?n-97+10:-1)}function LC(e){return e===120?2:e===117?4:e===85?8:0}function DC(e){return 48<=e&&e<=57?e-48:-1}function bh(e){return e===48?"\0":e===97?"\x07":e===98?"\b":e===116||e===9?"	":e===110?`
`:e===118?"\v":e===102?"\f":e===114?"\r":e===101?"\x1B":e===32?" ":e===34?'"':e===47?"/":e===92?"\\":e===78?"":e===95?" ":e===76?"\u2028":e===80?"\u2029":""}function IC(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function oy(e,n,t){n==="__proto__"?Object.defineProperty(e,n,{configurable:!0,enumerable:!0,writable:!0,value:t}):e[n]=t}var ay=new Array(256),ly=new Array(256);for(var Cr=0;Cr<256;Cr++)ay[Cr]=bh(Cr)?1:0,ly[Cr]=bh(Cr);function FC(e,n){this.input=e,this.filename=n.filename||null,this.schema=n.schema||zC,this.onWarning=n.onWarning||null,this.legacy=n.legacy||!1,this.json=n.json||!1,this.listener=n.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function uy(e,n){var t={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return t.snippet=SS(t),new Xn(n,t)}function W(e,n){throw uy(e,n)}function Aa(e,n){e.onWarning&&e.onWarning.call(null,uy(e,n))}var kh={YAML:function(n,t,r){var i,s,o;n.version!==null&&W(n,"duplication of %YAML directive"),r.length!==1&&W(n,"YAML directive accepts exactly one argument"),i=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),i===null&&W(n,"ill-formed argument of the YAML directive"),s=parseInt(i[1],10),o=parseInt(i[2],10),s!==1&&W(n,"unacceptable YAML version of the document"),n.version=r[0],n.checkLineBreaks=o<2,o!==1&&o!==2&&Aa(n,"unsupported YAML version of the document")},TAG:function(n,t,r){var i,s;r.length!==2&&W(n,"TAG directive accepts exactly two arguments"),i=r[0],s=r[1],iy.test(i)||W(n,"ill-formed tag handle (first argument) of the TAG directive"),Dt.call(n.tagMap,i)&&W(n,'there is a previously declared suffix for "'+i+'" tag handle'),sy.test(s)||W(n,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{W(n,"tag prefix is malformed: "+s)}n.tagMap[i]=s}};function Rt(e,n,t,r){var i,s,o,a;if(n<t){if(a=e.input.slice(n,t),r)for(i=0,s=a.length;i<s;i+=1)o=a.charCodeAt(i),o===9||32<=o&&o<=1114111||W(e,"expected valid JSON character");else AC.test(a)&&W(e,"the stream contains non-printable characters");e.result+=a}}function Sh(e,n,t,r){var i,s,o,a;for(Oe.isObject(t)||W(e,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(t),o=0,a=i.length;o<a;o+=1)s=i[o],Dt.call(n,s)||(oy(n,s,t[s]),r[s]=!0)}function Vr(e,n,t,r,i,s,o,a,l){var u,c;if(Array.isArray(i))for(i=Array.prototype.slice.call(i),u=0,c=i.length;u<c;u+=1)Array.isArray(i[u])&&W(e,"nested arrays are not supported inside keys"),typeof i=="object"&&wh(i[u])==="[object Object]"&&(i[u]="[object Object]");if(typeof i=="object"&&wh(i)==="[object Object]"&&(i="[object Object]"),i=String(i),n===null&&(n={}),r==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(u=0,c=s.length;u<c;u+=1)Sh(e,n,s[u],t);else Sh(e,n,s,t);else!e.json&&!Dt.call(t,i)&&Dt.call(n,i)&&(e.line=o||e.line,e.lineStart=a||e.lineStart,e.position=l||e.position,W(e,"duplicated mapping key")),oy(n,i,s),delete t[i];return n}function Xd(e){var n;n=e.input.charCodeAt(e.position),n===10?e.position++:n===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):W(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function we(e,n,t){for(var r=0,i=e.input.charCodeAt(e.position);i!==0;){for(;sr(i);)i===9&&e.firstTabInLine===-1&&(e.firstTabInLine=e.position),i=e.input.charCodeAt(++e.position);if(n&&i===35)do i=e.input.charCodeAt(++e.position);while(i!==10&&i!==13&&i!==0);if($n(i))for(Xd(e),i=e.input.charCodeAt(e.position),r++,e.lineIndent=0;i===32;)e.lineIndent++,i=e.input.charCodeAt(++e.position);else break}return t!==-1&&r!==0&&e.lineIndent<t&&Aa(e,"deficient indentation"),r}function xl(e){var n=e.position,t;return t=e.input.charCodeAt(n),!!((t===45||t===46)&&t===e.input.charCodeAt(n+1)&&t===e.input.charCodeAt(n+2)&&(n+=3,t=e.input.charCodeAt(n),t===0||Qe(t)))}function Qd(e,n){n===1?e.result+=" ":n>1&&(e.result+=Oe.repeat(`
`,n-1))}function qC(e,n,t){var r,i,s,o,a,l,u,c,d=e.kind,f=e.result,p;if(p=e.input.charCodeAt(e.position),Qe(p)||qr(p)||p===35||p===38||p===42||p===33||p===124||p===62||p===39||p===34||p===37||p===64||p===96||(p===63||p===45)&&(i=e.input.charCodeAt(e.position+1),Qe(i)||t&&qr(i)))return!1;for(e.kind="scalar",e.result="",s=o=e.position,a=!1;p!==0;){if(p===58){if(i=e.input.charCodeAt(e.position+1),Qe(i)||t&&qr(i))break}else if(p===35){if(r=e.input.charCodeAt(e.position-1),Qe(r))break}else{if(e.position===e.lineStart&&xl(e)||t&&qr(p))break;if($n(p))if(l=e.line,u=e.lineStart,c=e.lineIndent,we(e,!1,-1),e.lineIndent>=n){a=!0,p=e.input.charCodeAt(e.position);continue}else{e.position=o,e.line=l,e.lineStart=u,e.lineIndent=c;break}}a&&(Rt(e,s,o,!1),Qd(e,e.line-l),s=o=e.position,a=!1),sr(p)||(o=e.position+1),p=e.input.charCodeAt(++e.position)}return Rt(e,s,o,!1),e.result?!0:(e.kind=d,e.result=f,!1)}function VC(e,n){var t,r,i;if(t=e.input.charCodeAt(e.position),t!==39)return!1;for(e.kind="scalar",e.result="",e.position++,r=i=e.position;(t=e.input.charCodeAt(e.position))!==0;)if(t===39)if(Rt(e,r,e.position,!0),t=e.input.charCodeAt(++e.position),t===39)r=e.position,e.position++,i=e.position;else return!0;else $n(t)?(Rt(e,r,i,!0),Qd(e,we(e,!1,n)),r=i=e.position):e.position===e.lineStart&&xl(e)?W(e,"unexpected end of the document within a single quoted scalar"):(e.position++,i=e.position);W(e,"unexpected end of the stream within a single quoted scalar")}function $C(e,n){var t,r,i,s,o,a;if(a=e.input.charCodeAt(e.position),a!==34)return!1;for(e.kind="scalar",e.result="",e.position++,t=r=e.position;(a=e.input.charCodeAt(e.position))!==0;){if(a===34)return Rt(e,t,e.position,!0),e.position++,!0;if(a===92){if(Rt(e,t,e.position,!0),a=e.input.charCodeAt(++e.position),$n(a))we(e,!1,n);else if(a<256&&ay[a])e.result+=ly[a],e.position++;else if((o=LC(a))>0){for(i=o,s=0;i>0;i--)a=e.input.charCodeAt(++e.position),(o=NC(a))>=0?s=(s<<4)+o:W(e,"expected hexadecimal character");e.result+=IC(s),e.position++}else W(e,"unknown escape sequence");t=r=e.position}else $n(a)?(Rt(e,t,r,!0),Qd(e,we(e,!1,n)),t=r=e.position):e.position===e.lineStart&&xl(e)?W(e,"unexpected end of the document within a double quoted scalar"):(e.position++,r=e.position)}W(e,"unexpected end of the stream within a double quoted scalar")}function OC(e,n){var t=!0,r,i,s,o=e.tag,a,l=e.anchor,u,c,d,f,p,v=Object.create(null),g,_,h,m;if(m=e.input.charCodeAt(e.position),m===91)c=93,p=!1,a=[];else if(m===123)c=125,p=!0,a={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=a),m=e.input.charCodeAt(++e.position);m!==0;){if(we(e,!0,n),m=e.input.charCodeAt(e.position),m===c)return e.position++,e.tag=o,e.anchor=l,e.kind=p?"mapping":"sequence",e.result=a,!0;t?m===44&&W(e,"expected the node content, but found ','"):W(e,"missed comma between flow collection entries"),_=g=h=null,d=f=!1,m===63&&(u=e.input.charCodeAt(e.position+1),Qe(u)&&(d=f=!0,e.position++,we(e,!0,n))),r=e.line,i=e.lineStart,s=e.position,ui(e,n,za,!1,!0),_=e.tag,g=e.result,we(e,!0,n),m=e.input.charCodeAt(e.position),(f||e.line===r)&&m===58&&(d=!0,m=e.input.charCodeAt(++e.position),we(e,!0,n),ui(e,n,za,!1,!0),h=e.result),p?Vr(e,a,v,_,g,h,r,i,s):d?a.push(Vr(e,null,v,_,g,h,r,i,s)):a.push(g),we(e,!0,n),m=e.input.charCodeAt(e.position),m===44?(t=!0,m=e.input.charCodeAt(++e.position)):t=!1}W(e,"unexpected end of the stream within a flow collection")}function BC(e,n){var t,r,i=au,s=!1,o=!1,a=n,l=0,u=!1,c,d;if(d=e.input.charCodeAt(e.position),d===124)r=!1;else if(d===62)r=!0;else return!1;for(e.kind="scalar",e.result="";d!==0;)if(d=e.input.charCodeAt(++e.position),d===43||d===45)au===i?i=d===43?_h:EC:W(e,"repeat of a chomping mode identifier");else if((c=DC(d))>=0)c===0?W(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):o?W(e,"repeat of an indentation width identifier"):(a=n+c-1,o=!0);else break;if(sr(d)){do d=e.input.charCodeAt(++e.position);while(sr(d));if(d===35)do d=e.input.charCodeAt(++e.position);while(!$n(d)&&d!==0)}for(;d!==0;){for(Xd(e),e.lineIndent=0,d=e.input.charCodeAt(e.position);(!o||e.lineIndent<a)&&d===32;)e.lineIndent++,d=e.input.charCodeAt(++e.position);if(!o&&e.lineIndent>a&&(a=e.lineIndent),$n(d)){l++;continue}if(e.lineIndent<a){i===_h?e.result+=Oe.repeat(`
`,s?1+l:l):i===au&&s&&(e.result+=`
`);break}for(r?sr(d)?(u=!0,e.result+=Oe.repeat(`
`,s?1+l:l)):u?(u=!1,e.result+=Oe.repeat(`
`,l+1)):l===0?s&&(e.result+=" "):e.result+=Oe.repeat(`
`,l):e.result+=Oe.repeat(`
`,s?1+l:l),s=!0,o=!0,l=0,t=e.position;!$n(d)&&d!==0;)d=e.input.charCodeAt(++e.position);Rt(e,t,e.position,!1)}return!0}function Ch(e,n){var t,r=e.tag,i=e.anchor,s=[],o,a=!1,l;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=s),l=e.input.charCodeAt(e.position);l!==0&&(e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,W(e,"tab characters must not be used in indentation")),!(l!==45||(o=e.input.charCodeAt(e.position+1),!Qe(o))));){if(a=!0,e.position++,we(e,!0,-1)&&e.lineIndent<=n){s.push(null),l=e.input.charCodeAt(e.position);continue}if(t=e.line,ui(e,n,ry,!1,!0),s.push(e.result),we(e,!0,-1),l=e.input.charCodeAt(e.position),(e.line===t||e.lineIndent>n)&&l!==0)W(e,"bad indentation of a sequence entry");else if(e.lineIndent<n)break}return a?(e.tag=r,e.anchor=i,e.kind="sequence",e.result=s,!0):!1}function UC(e,n,t){var r,i,s,o,a,l,u=e.tag,c=e.anchor,d={},f=Object.create(null),p=null,v=null,g=null,_=!1,h=!1,m;if(e.firstTabInLine!==-1)return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=d),m=e.input.charCodeAt(e.position);m!==0;){if(!_&&e.firstTabInLine!==-1&&(e.position=e.firstTabInLine,W(e,"tab characters must not be used in indentation")),r=e.input.charCodeAt(e.position+1),s=e.line,(m===63||m===58)&&Qe(r))m===63?(_&&(Vr(e,d,f,p,v,null,o,a,l),p=v=g=null),h=!0,_=!0,i=!0):_?(_=!1,i=!0):W(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,m=r;else{if(o=e.line,a=e.lineStart,l=e.position,!ui(e,t,ty,!1,!0))break;if(e.line===s){for(m=e.input.charCodeAt(e.position);sr(m);)m=e.input.charCodeAt(++e.position);if(m===58)m=e.input.charCodeAt(++e.position),Qe(m)||W(e,"a whitespace character is expected after the key-value separator within a block mapping"),_&&(Vr(e,d,f,p,v,null,o,a,l),p=v=g=null),h=!0,_=!1,i=!1,p=e.tag,v=e.result;else if(h)W(e,"can not read an implicit mapping pair; a colon is missed");else return e.tag=u,e.anchor=c,!0}else if(h)W(e,"can not read a block mapping entry; a multiline key may not be an implicit key");else return e.tag=u,e.anchor=c,!0}if((e.line===s||e.lineIndent>n)&&(_&&(o=e.line,a=e.lineStart,l=e.position),ui(e,n,Ea,!0,i)&&(_?v=e.result:g=e.result),_||(Vr(e,d,f,p,v,g,o,a,l),p=v=g=null),we(e,!0,-1),m=e.input.charCodeAt(e.position)),(e.line===s||e.lineIndent>n)&&m!==0)W(e,"bad indentation of a mapping entry");else if(e.lineIndent<n)break}return _&&Vr(e,d,f,p,v,null,o,a,l),h&&(e.tag=u,e.anchor=c,e.kind="mapping",e.result=d),h}function HC(e){var n,t=!1,r=!1,i,s,o;if(o=e.input.charCodeAt(e.position),o!==33)return!1;if(e.tag!==null&&W(e,"duplication of a tag property"),o=e.input.charCodeAt(++e.position),o===60?(t=!0,o=e.input.charCodeAt(++e.position)):o===33?(r=!0,i="!!",o=e.input.charCodeAt(++e.position)):i="!",n=e.position,t){do o=e.input.charCodeAt(++e.position);while(o!==0&&o!==62);e.position<e.length?(s=e.input.slice(n,e.position),o=e.input.charCodeAt(++e.position)):W(e,"unexpected end of the stream within a verbatim tag")}else{for(;o!==0&&!Qe(o);)o===33&&(r?W(e,"tag suffix cannot contain exclamation marks"):(i=e.input.slice(n-1,e.position+1),iy.test(i)||W(e,"named tag handle cannot contain such characters"),r=!0,n=e.position+1)),o=e.input.charCodeAt(++e.position);s=e.input.slice(n,e.position),RC.test(s)&&W(e,"tag suffix cannot contain flow indicator characters")}s&&!sy.test(s)&&W(e,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{W(e,"tag name is malformed: "+s)}return t?e.tag=s:Dt.call(e.tagMap,i)?e.tag=e.tagMap[i]+s:i==="!"?e.tag="!"+s:i==="!!"?e.tag="tag:yaml.org,2002:"+s:W(e,'undeclared tag handle "'+i+'"'),!0}function WC(e){var n,t;if(t=e.input.charCodeAt(e.position),t!==38)return!1;for(e.anchor!==null&&W(e,"duplication of an anchor property"),t=e.input.charCodeAt(++e.position),n=e.position;t!==0&&!Qe(t)&&!qr(t);)t=e.input.charCodeAt(++e.position);return e.position===n&&W(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(n,e.position),!0}function KC(e){var n,t,r;if(r=e.input.charCodeAt(e.position),r!==42)return!1;for(r=e.input.charCodeAt(++e.position),n=e.position;r!==0&&!Qe(r)&&!qr(r);)r=e.input.charCodeAt(++e.position);return e.position===n&&W(e,"name of an alias node must contain at least one character"),t=e.input.slice(n,e.position),Dt.call(e.anchorMap,t)||W(e,'unidentified alias "'+t+'"'),e.result=e.anchorMap[t],we(e,!0,-1),!0}function ui(e,n,t,r,i){var s,o,a,l=1,u=!1,c=!1,d,f,p,v,g,_;if(e.listener!==null&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,s=o=a=Ea===t||ry===t,r&&we(e,!0,-1)&&(u=!0,e.lineIndent>n?l=1:e.lineIndent===n?l=0:e.lineIndent<n&&(l=-1)),l===1)for(;HC(e)||WC(e);)we(e,!0,-1)?(u=!0,a=s,e.lineIndent>n?l=1:e.lineIndent===n?l=0:e.lineIndent<n&&(l=-1)):a=!1;if(a&&(a=u||i),(l===1||Ea===t)&&(za===t||ty===t?g=n:g=n+1,_=e.position-e.lineStart,l===1?a&&(Ch(e,_)||UC(e,_,g))||OC(e,g)?c=!0:(o&&BC(e,g)||VC(e,g)||$C(e,g)?c=!0:KC(e)?(c=!0,(e.tag!==null||e.anchor!==null)&&W(e,"alias node should not have any properties")):qC(e,g,za===t)&&(c=!0,e.tag===null&&(e.tag="?")),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):l===0&&(c=a&&Ch(e,_))),e.tag===null)e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);else if(e.tag==="?"){for(e.result!==null&&e.kind!=="scalar"&&W(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),d=0,f=e.implicitTypes.length;d<f;d+=1)if(v=e.implicitTypes[d],v.resolve(e.result)){e.result=v.construct(e.result),e.tag=v.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else if(e.tag!=="!"){if(Dt.call(e.typeMap[e.kind||"fallback"],e.tag))v=e.typeMap[e.kind||"fallback"][e.tag];else for(v=null,p=e.typeMap.multi[e.kind||"fallback"],d=0,f=p.length;d<f;d+=1)if(e.tag.slice(0,p[d].tag.length)===p[d].tag){v=p[d];break}v||W(e,"unknown tag !<"+e.tag+">"),e.result!==null&&v.kind!==e.kind&&W(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+v.kind+'", not "'+e.kind+'"'),v.resolve(e.result,e.tag)?(e.result=v.construct(e.result,e.tag),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):W(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return e.listener!==null&&e.listener("close",e),e.tag!==null||e.anchor!==null||c}function YC(e){var n=e.position,t,r,i,s=!1,o;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);(o=e.input.charCodeAt(e.position))!==0&&(we(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||o!==37));){for(s=!0,o=e.input.charCodeAt(++e.position),t=e.position;o!==0&&!Qe(o);)o=e.input.charCodeAt(++e.position);for(r=e.input.slice(t,e.position),i=[],r.length<1&&W(e,"directive name must not be less than one character in length");o!==0;){for(;sr(o);)o=e.input.charCodeAt(++e.position);if(o===35){do o=e.input.charCodeAt(++e.position);while(o!==0&&!$n(o));break}if($n(o))break;for(t=e.position;o!==0&&!Qe(o);)o=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}o!==0&&Xd(e),Dt.call(kh,r)?kh[r](e,r,i):Aa(e,'unknown document directive "'+r+'"')}if(we(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,we(e,!0,-1)):s&&W(e,"directives end mark is expected"),ui(e,e.lineIndent-1,Ea,!1,!0),we(e,!0,-1),e.checkLineBreaks&&MC.test(e.input.slice(n,e.position))&&Aa(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&xl(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,we(e,!0,-1));return}if(e.position<e.length-1)W(e,"end of the stream or a document separator is expected");else return}function GC(e,n){e=String(e),n=n||{},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var t=new FC(e,n),r=e.indexOf("\0");for(r!==-1&&(t.position=r,W(t,"null byte is not allowed in input")),t.input+="\0";t.input.charCodeAt(t.position)===32;)t.lineIndent+=1,t.position+=1;for(;t.position<t.length-1;)YC(t);return t.documents}function XC(e,n){var t=GC(e,n);if(t.length!==0){if(t.length===1)return t[0];throw new Xn("expected a single document in the stream, but found more")}}var QC=XC,ZC={load:QC},cy=ZC.load;function dy(e){return e.split("/").pop().replace(/\.md$/,"")}function lu(e){if(typeof e=="string")return e;if(e!==null&&typeof e=="object"){const n=Object.entries(e);return n.length===1?`${n[0][0]}: ${n[0][1]}`:JSON.stringify(e)}return String(e??"")}function fy(e){const n=e.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);if(!n)return{data:{},content:e};try{return{data:cy(n[1])??{},content:n[2]}}catch{return{data:{},content:e}}}function py(e,n){const{data:t,content:r}=fy(n);return{slug:e,title:String(t.title??""),image:String(t.image??e),tags:(t.tags??[]).map(lu),ingredients:(t.ingredients??[]).map(lu),directions:t.directions?(t.directions??[]).map(lu):void 0,components:t.components,content:r}}function JC(e,n){return py(e,n)}function eP(e){const n=cy(e);return Array.isArray(n)?n.map(t=>{const r=t;return{id:String(r.id??""),ingredient:!!(r.ingredient??!0)}}):[]}function nP(e){const{data:n}=fy(e),t=n.categories;return Array.isArray(t)?t.map(r=>({id:String(r.id??""),label:String(r.label??""),description:String(r.description??""),tags:r.tags??[],mode:r.mode==="other"?"other":void 0})):[]}const tP=Object.assign({"../../../_recipes/ tofu_meatball_with_mushroom_ankake_sauce.md":L2,"../../../_recipes/aiguillettes_de_poulet_au_miel_et_au_cidre.md":D2,"../../../_recipes/bavette_sauce_au_vin.md":I2,"../../../_recipes/beignets_italiens_ricotta.md":F2,"../../../_recipes/blanquette_de_veau.md":q2,"../../../_recipes/bouillon_emilia.md":V2,"../../../_recipes/buche_framboise_mascarpone.md":$2,"../../../_recipes/champignons_en_salade.md":O2,"../../../_recipes/chili_con_carne.md":B2,"../../../_recipes/chouquettes.md":U2,"../../../_recipes/coquilles_saint_jacques_gratinees.md":H2,"../../../_recipes/creme_brulee.md":W2,"../../../_recipes/entremet_framboises_mascarpone_kirsch.md":K2,"../../../_recipes/faux_fillet_sauce_poivre.md":Y2,"../../../_recipes/filet_de_poulet_creme_champignons.md":G2,"../../../_recipes/filet_mignon_sauce_chasseur.md":X2,"../../../_recipes/gateau_de_riz.md":Q2,"../../../_recipes/gateau_marbre.md":Z2,"../../../_recipes/gnocchi_maison_sauce_tomate.md":J2,"../../../_recipes/gratin_patate_douce_boeuf_feta.md":ek,"../../../_recipes/gratin_peches_creme_amandes.md":nk,"../../../_recipes/gratin_penne_champignons_bouillon.md":tk,"../../../_recipes/gratinee_lyonnaise.md":rk,"../../../_recipes/hijiki.md":ik,"../../../_recipes/karaage.md":sk,"../../../_recipes/kinpira_gobo.md":ok,"../../../_recipes/lapin_mijote_pommes_cidre.md":ak,"../../../_recipes/lasagnes.md":lk,"../../../_recipes/limoncello.md":uk,"../../../_recipes/limoncello_tiramisu.md":ck,"../../../_recipes/linguines_girolles_tomate.md":dk,"../../../_recipes/linguines_ricotta_pecorino_et_guanciale.md":fk,"../../../_recipes/magret_de_canard_clementines_corse_puree_de_butternut.md":pk,"../../../_recipes/maquereaux_marines.md":hk,"../../../_recipes/meringue_aux_amandes.md":mk,"../../../_recipes/minestrone.md":gk,"../../../_recipes/moelleux_au_chocolat.md":vk,"../../../_recipes/moelleux_poire_frangipane.md":yk,"../../../_recipes/oeuf_en_croute_de_pain_au_fromage.md":xk,"../../../_recipes/okonomiyaki.md":_k,"../../../_recipes/pappardelles_champignons_bleu_comte_poulet.md":wk,"../../../_recipes/pates_courge_ail_sauge.md":bk,"../../../_recipes/pates_sauce_tomate.md":kk,"../../../_recipes/pave_agneau_girolles_beurre_estragon.md":Sk,"../../../_recipes/pomme_de_terre_farcie_aux_rillettes_de_thon.md":Ck,"../../../_recipes/potage_au_concombre.md":Pk,"../../../_recipes/potage_de_chou-fleur.md":jk,"../../../_recipes/poulet_curry.md":Tk,"../../../_recipes/poulet_yakitori.md":zk,"../../../_recipes/pounchkis.md":Ek,"../../../_recipes/punch.md":Ak,"../../../_recipes/quatre_quart_emilia.md":Mk,"../../../_recipes/ramen_maison.md":Rk,"../../../_recipes/raviolis_sestu.md":Nk,"../../../_recipes/ribs_sauce_orange.md":Lk,"../../../_recipes/risotto_aux_champignons_et_aux_chataignes.md":Dk,"../../../_recipes/riz_au_lait_framboises.md":Ik,"../../../_recipes/saint_jacques_facon_chaudree.md":Fk,"../../../_recipes/salade_chou_rouge.md":qk,"../../../_recipes/saumon_laque_au_gingembre_marron_choux_de_bruxelles.md":Vk,"../../../_recipes/saute_de_porc_aux_abricots_sauce_soja_citron_vert.md":$k,"../../../_recipes/soupe_a_loignon.md":Ok,"../../../_recipes/soupe_ardennaise.md":Bk,"../../../_recipes/soupe_au_chou.md":Uk,"../../../_recipes/soupe_de_moules.md":Hk,"../../../_recipes/soupe_de_poisson_au_saumon.md":Wk,"../../../_recipes/soupe_nimoise.md":Kk,"../../../_recipes/soupe_poireau_pommes_de_terres.md":Yk,"../../../_recipes/soupe_savoyarde.md":Gk,"../../../_recipes/spaghettis_aux_girolles_sautees.md":Xk,"../../../_recipes/spaghettonis_a_la_creme_de_roquette_et_de_basilic.md":Qk,"../../../_recipes/tagliatelles_aux_gambas_flambes.md":Zk,"../../../_recipes/tarte_amandine_aux_poires.md":Jk,"../../../_recipes/tartinable_chevre_chorizo.md":eS,"../../../_recipes/test.md":nS,"../../../_recipes/tiramisu_a_l_orange.md":tS,"../../../_recipes/tiramisu_aux_framboises.md":rS,"../../../_recipes/tiramisu_classique.md":iS,"../../../_recipes/travers_de_porc_moutarde_miel_pommes.md":sS,"../../../_recipes/veloute_asperges.md":oS,"../../../_recipes/veloute_de_champignons_de_paris_au_tahini.md":aS,"../../../_recipes/veloute_de_potiron.md":lS,"../../../_recipes/veloute_patate_douce_lentilles_corail.md":uS,"../../../_recipes/veloute_potimarron_bleu_bacon.md":cS,"../../../_recipes/vichyssoise.md":dS}),Hs=Object.entries(tP).map(([e,n])=>py(dy(e),n)),rP=`---
layout: null
categories:
  - id: "Perso"
    label: "Perso"
    description: "Recettes perso."
    tags:
    - perso

  - id: "condiments"
    label: "Sauces & condiments"
    description: "Sauces, condiments et préparations à part réutilisables."
    tags:
      - condiment

  - id: "starters"
    label: "Entrées"
    description: "Recettes d'entrées."
    tags:
      - entree

  - id: "pates"
    label: "Pâtes"
    description: "Recettes de pates."
    tags:
      - pates

  - id: "japan"
    label: "Japon & Asie"
    description: "Recettes japonaises ou inspirées du Japon."
    tags:
      - japon
      - asiatique

  - id: "main_dishes"
    label: "Plats principaux"
    description: "Plats principaux pour le déjeuner ou le dîner."
    tags:
      - plat
      - plat principal
      - repas

  - id: "soups"
    label: "Soupes & veloutés"
    description: "Toutes les soupes, potages et veloutés."
    tags:
      - soupe
      - potage
      - veloute


  - id: "desserts"
    label: "Desserts"
    description: "Gâteaux, crèmes, entremets et autres douceurs."
    tags:
      - dessert
      - gateau
      - tiramisu
      - tarte

  - id: "drinks"
    label: "Boissons"
    description: "Recettes de boissons."
    tags:
      - boisson


  - id: "bases"
    label: "Bases & composants"
    description: "Bouillons, sauces et préparations de base."
    tags: []

  - id: "others"
    label: "Autres"
    description: "Recettes qui ne rentrent dans aucune catégorie ci-dessus."
    mode: "other"
    tags: []
---

Ce fichier définit les catégories utilisées sur la page d'accueil.

- Modifiez librement l'ordre des entrées dans \`categories:\` : cet ordre sera
  utilisé tel quel pour l'affichage.
- Ajoutez ou retirez des tags dans chaque catégorie en utilisant uniquement des
  tags canoniques présents dans \`_data/recipe_tags.yml\`.
- La catégorie avec \`id: "others"\` et \`mode: "other"\` sert à regrouper, côté
  interface, les recettes qui n'ont aucun tag présent dans les autres
  catégories ; sa liste \`tags:\` reste normalement vide.
`,iP=Object.assign({"../../../home_categories.md":rP}),sP=Object.values(iP)[0]??"",ns=nP(sP),oP="/recettes-cuisine/".replace(/\/$/,"");function aP({recipe:e}){const n=`${oP}/images/cards/${e.image}.webp`;return w.jsxs(at,{to:`/recette/${e.slug}`,className:"group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 border border-orange-100",children:[w.jsx("div",{className:"aspect-video bg-orange-100 overflow-hidden",children:w.jsx("img",{src:n,alt:e.title,loading:"lazy",className:"w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",onError:t=>{t.currentTarget.style.display="none"}})}),w.jsx("div",{className:"p-3",children:w.jsx("h3",{className:"font-medium text-sm text-orange-950 leading-tight line-clamp-2",children:e.title})})]})}function lP({label:e,recipes:n,cols:t}){return n.length===0?null:w.jsxs("section",{className:"mb-8",children:[w.jsx("h3",{className:"px-6 text-primary uppercase font-semibold mb-2 text-lg md:text-xl",children:e}),w.jsx("div",{className:"grid px-6 gap-4 md:gap-6 grid-cols-2",style:{"--cols":t},children:n.map(r=>w.jsx(aP,{recipe:r},r.slug))})]})}const hy=[2,3,4,5],uP=5;function my(){const[e]=Yd(),n=parseInt(e.get("cols")??"",10);return hy.includes(n)?n:uP}function cP(){const[e,n]=Yd(),t=my();function r(i){const s=new URLSearchParams(e);s.set("cols",String(i)),n(s,{replace:!0})}return w.jsxs("div",{className:"hidden md:flex items-center gap-2 ml-auto",children:[w.jsx("span",{className:"text-xs text-orange-700/60 select-none",children:"Colonnes"}),w.jsx("div",{className:"inline-flex rounded-lg border border-primary/30 bg-white/70 backdrop-blur p-0.5",children:hy.map(i=>w.jsx("button",{type:"button","aria-pressed":t===i,"aria-label":`Afficher ${i} colonnes`,onClick:()=>r(i),className:`px-3 py-1 text-sm rounded-md transition ${t===i?"bg-primary text-white shadow-sm":"text-red-900/70 hover:bg-primary/10"}`,children:i},i))})]})}function Ph(e){return(e||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim()}function dP(e,n){if(!e)return!0;let t=0,r=0;for(;t<e.length&&r<n.length;)e[t]===n[r]&&t++,r++;return t===e.length}function fP(e,n){const t=Ph(n);return t?e.filter(r=>{const i=Ph(r.title);return i.includes(t)||dP(t,i)}):e}function pP(e){const[n,t]=S.useState(""),r=fP(e,n),i=S.useCallback(()=>t(""),[]);return{query:n,setQuery:t,filtered:r,clear:i}}function hP(e,n){const t=n.filter(s=>s.mode!=="other"),r=n.find(s=>s.mode==="other"),i=new Map(n.map(s=>[s.id,[]]));for(const s of e){const o=new Set(s.tags),a=t.find(u=>u.tags.some(c=>o.has(c))),l=(a==null?void 0:a.id)??(r==null?void 0:r.id);l&&i.get(l).push(s)}return i}function mP(){const e=my(),{query:n,setQuery:t,filtered:r,clear:i}=pP(Hs),s=S.useRef(null),o=hP(r,ns);return S.useEffect(()=>{function a(l){var u,c;(l.key==="f"||l.key==="F")&&(l.ctrlKey||l.metaKey)&&!l.altKey&&!l.shiftKey&&(l.preventDefault(),(u=s.current)==null||u.focus(),(c=s.current)==null||c.select())}return document.addEventListener("keydown",a),()=>document.removeEventListener("keydown",a)},[]),w.jsxs("div",{className:"content w-full h-full overflow-y-auto bg-orange-50 pb-24 md:pb-6",children:[w.jsx("div",{className:"px-6 pt-6",children:w.jsxs("div",{className:"w-full rounded-2xl bg-gradient-to-r from-red-200 to-orange-100 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4",children:[w.jsxs("div",{children:[w.jsx("h2",{className:"font-gelica text-2xl md:text-3xl text-primary",children:"Pas d'idée ? Essayez la recherche avancée"}),w.jsx("p",{className:"text-sm text-red-900/80",children:"Filtrez par ingrédients disponibles, tags, et explorez visuellement le catalogue."})]}),w.jsxs(at,{to:"/recherche",className:"inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:scale-105 hover:rotate-1 transition",children:[w.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-5",children:w.jsx("path",{fillRule:"evenodd",d:"M10.5 3.75a6.75 6.75 0 1 0 4.2 12.06l3.245 3.245a.75.75 0 1 0 1.06-1.06l-3.245-3.245A6.75 6.75 0 0 0 10.5 3.75ZM5.25 10.5a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z",clipRule:"evenodd"})}),"Recherche avancée"]})]})}),w.jsxs("div",{className:"px-6 mt-4",children:[w.jsxs("div",{className:"relative max-w-xl",children:[w.jsx("input",{ref:s,id:"home-search",type:"search",inputMode:"search",autoComplete:"off",placeholder:"Rechercher une recette…",value:n,onChange:a=>t(a.target.value),className:"w-full rounded-xl border border-red-200/60 bg-white/80 backdrop-blur px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"}),n&&w.jsx("button",{type:"button",onClick:i,"aria-label":"Effacer la recherche",className:"absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-primary",children:"✕"})]}),n&&w.jsxs("p",{className:"text-sm text-orange-700 mt-1",children:[r.length," résultat",r.length!==1?"s":""]})]}),w.jsx("div",{className:"px-6 mt-4 flex items-center",children:w.jsx(cP,{})}),w.jsx("div",{id:"recipes-by-category",className:"mt-4",children:ns.map(a=>{const l=o.get(a.id)??[];return w.jsx(lP,{label:a.label,recipes:l,cols:e},a.id)})})]})}const gP="/recettes-cuisine/".replace(/\/$/,""),vP=()=>w.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-6 md:size-8",children:w.jsx("path",{fillRule:"evenodd",d:"M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z",clipRule:"evenodd"})}),yP=()=>w.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-6",children:w.jsx("path",{fillRule:"evenodd",d:"M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z",clipRule:"evenodd"})});function xP({recipe:e,onZoom:n}){const t=Us(),r=`${gP}/images/hero/${e.image}.webp`;function i(){window.history.length>1?t(-1):t("/")}return w.jsxs("div",{className:"recipe-image-panel relative aspect-video md:aspect-auto md:h-screen md:overflow-hidden",style:{viewTransitionName:"vt-hero"},children:[w.jsx("img",{src:r,alt:e.title,className:"view w-full h-full",fetchPriority:"high",decoding:"async",style:{objectFit:"cover",objectPosition:"center"}}),w.jsx("button",{type:"button",onClick:i,className:"fixed top-4 left-4 z-30 bg-white rounded-full p-3 md:p-4 shadow border border-gray-200 hover:bg-gray-50 transition","aria-label":"Retour",children:w.jsx(vP,{})}),n&&w.jsx("button",{type:"button",onClick:n,className:"md:hidden absolute top-4 right-4 z-10 bg-white rounded-full p-3 shadow border border-gray-200 hover:bg-gray-50 transition",title:"Agrandir l'image","aria-label":"Agrandir l'image",children:w.jsx(yP,{})})]})}function Zd(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let wr=Zd();function gy(e){wr=e}const vy=/[&<>"']/,_P=new RegExp(vy.source,"g"),yy=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,wP=new RegExp(yy.source,"g"),bP={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},jh=e=>bP[e];function rn(e,n){if(n){if(vy.test(e))return e.replace(_P,jh)}else if(yy.test(e))return e.replace(wP,jh);return e}const kP=/(^|[^\[])\^/g;function ie(e,n){let t=typeof e=="string"?e:e.source;n=n||"";const r={replace:(i,s)=>{let o=typeof s=="string"?s:s.source;return o=o.replace(kP,"$1"),t=t.replace(i,o),r},getRegex:()=>new RegExp(t,n)};return r}function Th(e){try{e=encodeURI(e).replace(/%25/g,"%")}catch{return null}return e}const ts={exec:()=>null};function zh(e,n){const t=e.replace(/\|/g,(s,o,a)=>{let l=!1,u=o;for(;--u>=0&&a[u]==="\\";)l=!l;return l?"|":" |"}),r=t.split(/ \|/);let i=0;if(r[0].trim()||r.shift(),r.length>0&&!r[r.length-1].trim()&&r.pop(),n)if(r.length>n)r.splice(n);else for(;r.length<n;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(/\\\|/g,"|");return r}function zi(e,n,t){const r=e.length;if(r===0)return"";let i=0;for(;i<r&&e.charAt(r-i-1)===n;)i++;return e.slice(0,r-i)}function SP(e,n){if(e.indexOf(n[1])===-1)return-1;let t=0;for(let r=0;r<e.length;r++)if(e[r]==="\\")r++;else if(e[r]===n[0])t++;else if(e[r]===n[1]&&(t--,t<0))return r;return-1}function Eh(e,n,t,r){const i=n.href,s=n.title?rn(n.title):null,o=e[1].replace(/\\([\[\]])/g,"$1");if(e[0].charAt(0)!=="!"){r.state.inLink=!0;const a={type:"link",raw:t,href:i,title:s,text:o,tokens:r.inlineTokens(o)};return r.state.inLink=!1,a}return{type:"image",raw:t,href:i,title:s,text:rn(o)}}function CP(e,n){const t=e.match(/^(\s+)(?:```)/);if(t===null)return n;const r=t[1];return n.split(`
`).map(i=>{const s=i.match(/^\s+/);if(s===null)return i;const[o]=s;return o.length>=r.length?i.slice(r.length):i}).join(`
`)}class Ma{constructor(n){re(this,"options");re(this,"rules");re(this,"lexer");this.options=n||wr}space(n){const t=this.rules.block.newline.exec(n);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(n){const t=this.rules.block.code.exec(n);if(t){const r=t[0].replace(/^(?: {1,4}| {0,3}\t)/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?r:zi(r,`
`)}}}fences(n){const t=this.rules.block.fences.exec(n);if(t){const r=t[0],i=CP(r,t[3]||"");return{type:"code",raw:r,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(n){const t=this.rules.block.heading.exec(n);if(t){let r=t[2].trim();if(/#$/.test(r)){const i=zi(r,"#");(this.options.pedantic||!i||/ $/.test(i))&&(r=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(n){const t=this.rules.block.hr.exec(n);if(t)return{type:"hr",raw:zi(t[0],`
`)}}blockquote(n){const t=this.rules.block.blockquote.exec(n);if(t){let r=zi(t[0],`
`).split(`
`),i="",s="";const o=[];for(;r.length>0;){let a=!1;const l=[];let u;for(u=0;u<r.length;u++)if(/^ {0,3}>/.test(r[u]))l.push(r[u]),a=!0;else if(!a)l.push(r[u]);else break;r=r.slice(u);const c=l.join(`
`),d=c.replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,`
    $1`).replace(/^ {0,3}>[ \t]?/gm,"");i=i?`${i}
${c}`:c,s=s?`${s}
${d}`:d;const f=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(d,o,!0),this.lexer.state.top=f,r.length===0)break;const p=o[o.length-1];if((p==null?void 0:p.type)==="code")break;if((p==null?void 0:p.type)==="blockquote"){const v=p,g=v.raw+`
`+r.join(`
`),_=this.blockquote(g);o[o.length-1]=_,i=i.substring(0,i.length-v.raw.length)+_.raw,s=s.substring(0,s.length-v.text.length)+_.text;break}else if((p==null?void 0:p.type)==="list"){const v=p,g=v.raw+`
`+r.join(`
`),_=this.list(g);o[o.length-1]=_,i=i.substring(0,i.length-p.raw.length)+_.raw,s=s.substring(0,s.length-v.raw.length)+_.raw,r=g.substring(o[o.length-1].raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:o,text:s}}}list(n){let t=this.rules.block.list.exec(n);if(t){let r=t[1].trim();const i=r.length>1,s={type:"list",raw:"",ordered:i,start:i?+r.slice(0,-1):"",loose:!1,items:[]};r=i?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=i?r:"[*+-]");const o=new RegExp(`^( {0,3}${r})((?:[	 ][^\\n]*)?(?:\\n|$))`);let a=!1;for(;n;){let l=!1,u="",c="";if(!(t=o.exec(n))||this.rules.block.hr.test(n))break;u=t[0],n=n.substring(u.length);let d=t[2].split(`
`,1)[0].replace(/^\t+/,h=>" ".repeat(3*h.length)),f=n.split(`
`,1)[0],p=!d.trim(),v=0;if(this.options.pedantic?(v=2,c=d.trimStart()):p?v=t[1].length+1:(v=t[2].search(/[^ ]/),v=v>4?1:v,c=d.slice(v),v+=t[1].length),p&&/^[ \t]*$/.test(f)&&(u+=f+`
`,n=n.substring(f.length+1),l=!0),!l){const h=new RegExp(`^ {0,${Math.min(3,v-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),m=new RegExp(`^ {0,${Math.min(3,v-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),y=new RegExp(`^ {0,${Math.min(3,v-1)}}(?:\`\`\`|~~~)`),x=new RegExp(`^ {0,${Math.min(3,v-1)}}#`),k=new RegExp(`^ {0,${Math.min(3,v-1)}}<(?:[a-z].*>|!--)`,"i");for(;n;){const C=n.split(`
`,1)[0];let T;if(f=C,this.options.pedantic?(f=f.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  "),T=f):T=f.replace(/\t/g,"    "),y.test(f)||x.test(f)||k.test(f)||h.test(f)||m.test(f))break;if(T.search(/[^ ]/)>=v||!f.trim())c+=`
`+T.slice(v);else{if(p||d.replace(/\t/g,"    ").search(/[^ ]/)>=4||y.test(d)||x.test(d)||m.test(d))break;c+=`
`+f}!p&&!f.trim()&&(p=!0),u+=C+`
`,n=n.substring(C.length+1),d=T.slice(v)}}s.loose||(a?s.loose=!0:/\n[ \t]*\n[ \t]*$/.test(u)&&(a=!0));let g=null,_;this.options.gfm&&(g=/^\[[ xX]\] /.exec(c),g&&(_=g[0]!=="[ ] ",c=c.replace(/^\[[ xX]\] +/,""))),s.items.push({type:"list_item",raw:u,task:!!g,checked:_,loose:!1,text:c,tokens:[]}),s.raw+=u}s.items[s.items.length-1].raw=s.items[s.items.length-1].raw.trimEnd(),s.items[s.items.length-1].text=s.items[s.items.length-1].text.trimEnd(),s.raw=s.raw.trimEnd();for(let l=0;l<s.items.length;l++)if(this.lexer.state.top=!1,s.items[l].tokens=this.lexer.blockTokens(s.items[l].text,[]),!s.loose){const u=s.items[l].tokens.filter(d=>d.type==="space"),c=u.length>0&&u.some(d=>/\n.*\n/.test(d.raw));s.loose=c}if(s.loose)for(let l=0;l<s.items.length;l++)s.items[l].loose=!0;return s}}html(n){const t=this.rules.block.html.exec(n);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(n){const t=this.rules.block.def.exec(n);if(t){const r=t[1].toLowerCase().replace(/\s+/g," "),i=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:r,raw:t[0],href:i,title:s}}}table(n){const t=this.rules.block.table.exec(n);if(!t||!/[:|]/.test(t[2]))return;const r=zh(t[1]),i=t[2].replace(/^\||\| *$/g,"").split("|"),s=t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split(`
`):[],o={type:"table",raw:t[0],header:[],align:[],rows:[]};if(r.length===i.length){for(const a of i)/^ *-+: *$/.test(a)?o.align.push("right"):/^ *:-+: *$/.test(a)?o.align.push("center"):/^ *:-+ *$/.test(a)?o.align.push("left"):o.align.push(null);for(let a=0;a<r.length;a++)o.header.push({text:r[a],tokens:this.lexer.inline(r[a]),header:!0,align:o.align[a]});for(const a of s)o.rows.push(zh(a,o.header.length).map((l,u)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:o.align[u]})));return o}}lheading(n){const t=this.rules.block.lheading.exec(n);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(n){const t=this.rules.block.paragraph.exec(n);if(t){const r=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:r,tokens:this.lexer.inline(r)}}}text(n){const t=this.rules.block.text.exec(n);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(n){const t=this.rules.inline.escape.exec(n);if(t)return{type:"escape",raw:t[0],text:rn(t[1])}}tag(n){const t=this.rules.inline.tag.exec(n);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(n){const t=this.rules.inline.link.exec(n);if(t){const r=t[2].trim();if(!this.options.pedantic&&/^</.test(r)){if(!/>$/.test(r))return;const o=zi(r.slice(0,-1),"\\");if((r.length-o.length)%2===0)return}else{const o=SP(t[2],"()");if(o>-1){const l=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,l).trim(),t[3]=""}}let i=t[2],s="";if(this.options.pedantic){const o=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);o&&(i=o[1],s=o[3])}else s=t[3]?t[3].slice(1,-1):"";return i=i.trim(),/^</.test(i)&&(this.options.pedantic&&!/>$/.test(r)?i=i.slice(1):i=i.slice(1,-1)),Eh(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer)}}reflink(n,t){let r;if((r=this.rules.inline.reflink.exec(n))||(r=this.rules.inline.nolink.exec(n))){const i=(r[2]||r[1]).replace(/\s+/g," "),s=t[i.toLowerCase()];if(!s){const o=r[0].charAt(0);return{type:"text",raw:o,text:o}}return Eh(r,s,r[0],this.lexer)}}emStrong(n,t,r=""){let i=this.rules.inline.emStrongLDelim.exec(n);if(!i||i[3]&&r.match(/[\p{L}\p{N}]/u))return;if(!(i[1]||i[2]||"")||!r||this.rules.inline.punctuation.exec(r)){const o=[...i[0]].length-1;let a,l,u=o,c=0;const d=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(d.lastIndex=0,t=t.slice(-1*n.length+o);(i=d.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a)continue;if(l=[...a].length,i[3]||i[4]){u+=l;continue}else if((i[5]||i[6])&&o%3&&!((o+l)%3)){c+=l;continue}if(u-=l,u>0)continue;l=Math.min(l,l+u+c);const f=[...i[0]][0].length,p=n.slice(0,o+i.index+f+l);if(Math.min(o,l)%2){const g=p.slice(1,-1);return{type:"em",raw:p,text:g,tokens:this.lexer.inlineTokens(g)}}const v=p.slice(2,-2);return{type:"strong",raw:p,text:v,tokens:this.lexer.inlineTokens(v)}}}}codespan(n){const t=this.rules.inline.code.exec(n);if(t){let r=t[2].replace(/\n/g," ");const i=/[^ ]/.test(r),s=/^ /.test(r)&&/ $/.test(r);return i&&s&&(r=r.substring(1,r.length-1)),r=rn(r,!0),{type:"codespan",raw:t[0],text:r}}}br(n){const t=this.rules.inline.br.exec(n);if(t)return{type:"br",raw:t[0]}}del(n){const t=this.rules.inline.del.exec(n);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(n){const t=this.rules.inline.autolink.exec(n);if(t){let r,i;return t[2]==="@"?(r=rn(t[1]),i="mailto:"+r):(r=rn(t[1]),i=r),{type:"link",raw:t[0],text:r,href:i,tokens:[{type:"text",raw:r,text:r}]}}}url(n){var r;let t;if(t=this.rules.inline.url.exec(n)){let i,s;if(t[2]==="@")i=rn(t[0]),s="mailto:"+i;else{let o;do o=t[0],t[0]=((r=this.rules.inline._backpedal.exec(t[0]))==null?void 0:r[0])??"";while(o!==t[0]);i=rn(t[0]),t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:i,href:s,tokens:[{type:"text",raw:i,text:i}]}}}inlineText(n){const t=this.rules.inline.text.exec(n);if(t){let r;return this.lexer.state.inRawBlock?r=t[0]:r=rn(t[0]),{type:"text",raw:t[0],text:r}}}}const PP=/^(?:[ \t]*(?:\n|$))+/,jP=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,TP=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ws=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,zP=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,xy=/(?:[*+-]|\d{1,9}[.)])/,_y=ie(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,xy).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),Jd=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,EP=/^[^\n]+/,ef=/(?!\s*\])(?:\\.|[^\[\]\\])+/,AP=ie(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",ef).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),MP=ie(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,xy).getRegex(),_l="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",nf=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,RP=ie("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",nf).replace("tag",_l).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),wy=ie(Jd).replace("hr",Ws).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_l).getRegex(),NP=ie(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",wy).getRegex(),tf={blockquote:NP,code:jP,def:AP,fences:TP,heading:zP,hr:Ws,html:RP,lheading:_y,list:MP,newline:PP,paragraph:wy,table:ts,text:EP},Ah=ie("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ws).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_l).getRegex(),LP={...tf,table:Ah,paragraph:ie(Jd).replace("hr",Ws).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Ah).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_l).getRegex()},DP={...tf,html:ie(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",nf).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ts,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ie(Jd).replace("hr",Ws).replace("heading",` *#{1,6} *[^
]`).replace("lheading",_y).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},by=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,IP=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ky=/^( {2,}|\\)\n(?!\s*$)/,FP=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Ks="\\p{P}\\p{S}",qP=ie(/^((?![*_])[\spunctuation])/,"u").replace(/punctuation/g,Ks).getRegex(),VP=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,$P=ie(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,"u").replace(/punct/g,Ks).getRegex(),OP=ie("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])","gu").replace(/punct/g,Ks).getRegex(),BP=ie("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])","gu").replace(/punct/g,Ks).getRegex(),UP=ie(/\\([punct])/,"gu").replace(/punct/g,Ks).getRegex(),HP=ie(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),WP=ie(nf).replace("(?:-->|$)","-->").getRegex(),KP=ie("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",WP).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ra=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,YP=ie(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",Ra).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Sy=ie(/^!?\[(label)\]\[(ref)\]/).replace("label",Ra).replace("ref",ef).getRegex(),Cy=ie(/^!?\[(ref)\](?:\[\])?/).replace("ref",ef).getRegex(),GP=ie("reflink|nolink(?!\\()","g").replace("reflink",Sy).replace("nolink",Cy).getRegex(),rf={_backpedal:ts,anyPunctuation:UP,autolink:HP,blockSkip:VP,br:ky,code:IP,del:ts,emStrongLDelim:$P,emStrongRDelimAst:OP,emStrongRDelimUnd:BP,escape:by,link:YP,nolink:Cy,punctuation:qP,reflink:Sy,reflinkSearch:GP,tag:KP,text:FP,url:ts},XP={...rf,link:ie(/^!?\[(label)\]\((.*?)\)/).replace("label",Ra).getRegex(),reflink:ie(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ra).getRegex()},Pc={...rf,escape:ie(by).replace("])","~|])").getRegex(),url:ie(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},QP={...Pc,br:ie(ky).replace("{2,}","*").getRegex(),text:ie(Pc.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},So={normal:tf,gfm:LP,pedantic:DP},Ei={normal:rf,gfm:Pc,breaks:QP,pedantic:XP};class yn{constructor(n){re(this,"tokens");re(this,"options");re(this,"state");re(this,"tokenizer");re(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=n||wr,this.options.tokenizer=this.options.tokenizer||new Ma,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={block:So.normal,inline:Ei.normal};this.options.pedantic?(t.block=So.pedantic,t.inline=Ei.pedantic):this.options.gfm&&(t.block=So.gfm,this.options.breaks?t.inline=Ei.breaks:t.inline=Ei.gfm),this.tokenizer.rules=t}static get rules(){return{block:So,inline:Ei}}static lex(n,t){return new yn(t).lex(n)}static lexInline(n,t){return new yn(t).inlineTokens(n)}lex(n){n=n.replace(/\r\n|\r/g,`
`),this.blockTokens(n,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){const r=this.inlineQueue[t];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(n,t=[],r=!1){this.options.pedantic&&(n=n.replace(/\t/g,"    ").replace(/^ +$/gm,""));let i,s,o;for(;n;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(a=>(i=a.call({lexer:this},n,t))?(n=n.substring(i.raw.length),t.push(i),!0):!1))){if(i=this.tokenizer.space(n)){n=n.substring(i.raw.length),i.raw.length===1&&t.length>0?t[t.length-1].raw+=`
`:t.push(i);continue}if(i=this.tokenizer.code(n)){n=n.substring(i.raw.length),s=t[t.length-1],s&&(s.type==="paragraph"||s.type==="text")?(s.raw+=`
`+i.raw,s.text+=`
`+i.text,this.inlineQueue[this.inlineQueue.length-1].src=s.text):t.push(i);continue}if(i=this.tokenizer.fences(n)){n=n.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.heading(n)){n=n.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.hr(n)){n=n.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.blockquote(n)){n=n.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.list(n)){n=n.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.html(n)){n=n.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.def(n)){n=n.substring(i.raw.length),s=t[t.length-1],s&&(s.type==="paragraph"||s.type==="text")?(s.raw+=`
`+i.raw,s.text+=`
`+i.raw,this.inlineQueue[this.inlineQueue.length-1].src=s.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title});continue}if(i=this.tokenizer.table(n)){n=n.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.lheading(n)){n=n.substring(i.raw.length),t.push(i);continue}if(o=n,this.options.extensions&&this.options.extensions.startBlock){let a=1/0;const l=n.slice(1);let u;this.options.extensions.startBlock.forEach(c=>{u=c.call({lexer:this},l),typeof u=="number"&&u>=0&&(a=Math.min(a,u))}),a<1/0&&a>=0&&(o=n.substring(0,a+1))}if(this.state.top&&(i=this.tokenizer.paragraph(o))){s=t[t.length-1],r&&(s==null?void 0:s.type)==="paragraph"?(s.raw+=`
`+i.raw,s.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=s.text):t.push(i),r=o.length!==n.length,n=n.substring(i.raw.length);continue}if(i=this.tokenizer.text(n)){n=n.substring(i.raw.length),s=t[t.length-1],s&&s.type==="text"?(s.raw+=`
`+i.raw,s.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=s.text):t.push(i);continue}if(n){const a="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,t}inline(n,t=[]){return this.inlineQueue.push({src:n,tokens:t}),t}inlineTokens(n,t=[]){let r,i,s,o=n,a,l,u;if(this.tokens.links){const c=Object.keys(this.tokens.links);if(c.length>0)for(;(a=this.tokenizer.rules.inline.reflinkSearch.exec(o))!=null;)c.includes(a[0].slice(a[0].lastIndexOf("[")+1,-1))&&(o=o.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+o.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(a=this.tokenizer.rules.inline.blockSkip.exec(o))!=null;)o=o.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+o.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(a=this.tokenizer.rules.inline.anyPunctuation.exec(o))!=null;)o=o.slice(0,a.index)+"++"+o.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;n;)if(l||(u=""),l=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(c=>(r=c.call({lexer:this},n,t))?(n=n.substring(r.raw.length),t.push(r),!0):!1))){if(r=this.tokenizer.escape(n)){n=n.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.tag(n)){n=n.substring(r.raw.length),i=t[t.length-1],i&&r.type==="text"&&i.type==="text"?(i.raw+=r.raw,i.text+=r.text):t.push(r);continue}if(r=this.tokenizer.link(n)){n=n.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.reflink(n,this.tokens.links)){n=n.substring(r.raw.length),i=t[t.length-1],i&&r.type==="text"&&i.type==="text"?(i.raw+=r.raw,i.text+=r.text):t.push(r);continue}if(r=this.tokenizer.emStrong(n,o,u)){n=n.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.codespan(n)){n=n.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.br(n)){n=n.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.del(n)){n=n.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.autolink(n)){n=n.substring(r.raw.length),t.push(r);continue}if(!this.state.inLink&&(r=this.tokenizer.url(n))){n=n.substring(r.raw.length),t.push(r);continue}if(s=n,this.options.extensions&&this.options.extensions.startInline){let c=1/0;const d=n.slice(1);let f;this.options.extensions.startInline.forEach(p=>{f=p.call({lexer:this},d),typeof f=="number"&&f>=0&&(c=Math.min(c,f))}),c<1/0&&c>=0&&(s=n.substring(0,c+1))}if(r=this.tokenizer.inlineText(s)){n=n.substring(r.raw.length),r.raw.slice(-1)!=="_"&&(u=r.raw.slice(-1)),l=!0,i=t[t.length-1],i&&i.type==="text"?(i.raw+=r.raw,i.text+=r.text):t.push(r);continue}if(n){const c="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return t}}class Na{constructor(n){re(this,"options");re(this,"parser");this.options=n||wr}space(n){return""}code({text:n,lang:t,escaped:r}){var o;const i=(o=(t||"").match(/^\S*/))==null?void 0:o[0],s=n.replace(/\n$/,"")+`
`;return i?'<pre><code class="language-'+rn(i)+'">'+(r?s:rn(s,!0))+`</code></pre>
`:"<pre><code>"+(r?s:rn(s,!0))+`</code></pre>
`}blockquote({tokens:n}){return`<blockquote>
${this.parser.parse(n)}</blockquote>
`}html({text:n}){return n}heading({tokens:n,depth:t}){return`<h${t}>${this.parser.parseInline(n)}</h${t}>
`}hr(n){return`<hr>
`}list(n){const t=n.ordered,r=n.start;let i="";for(let a=0;a<n.items.length;a++){const l=n.items[a];i+=this.listitem(l)}const s=t?"ol":"ul",o=t&&r!==1?' start="'+r+'"':"";return"<"+s+o+`>
`+i+"</"+s+`>
`}listitem(n){let t="";if(n.task){const r=this.checkbox({checked:!!n.checked});n.loose?n.tokens.length>0&&n.tokens[0].type==="paragraph"?(n.tokens[0].text=r+" "+n.tokens[0].text,n.tokens[0].tokens&&n.tokens[0].tokens.length>0&&n.tokens[0].tokens[0].type==="text"&&(n.tokens[0].tokens[0].text=r+" "+n.tokens[0].tokens[0].text)):n.tokens.unshift({type:"text",raw:r+" ",text:r+" "}):t+=r+" "}return t+=this.parser.parse(n.tokens,!!n.loose),`<li>${t}</li>
`}checkbox({checked:n}){return"<input "+(n?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:n}){return`<p>${this.parser.parseInline(n)}</p>
`}table(n){let t="",r="";for(let s=0;s<n.header.length;s++)r+=this.tablecell(n.header[s]);t+=this.tablerow({text:r});let i="";for(let s=0;s<n.rows.length;s++){const o=n.rows[s];r="";for(let a=0;a<o.length;a++)r+=this.tablecell(o[a]);i+=this.tablerow({text:r})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+i+`</table>
`}tablerow({text:n}){return`<tr>
${n}</tr>
`}tablecell(n){const t=this.parser.parseInline(n.tokens),r=n.header?"th":"td";return(n.align?`<${r} align="${n.align}">`:`<${r}>`)+t+`</${r}>
`}strong({tokens:n}){return`<strong>${this.parser.parseInline(n)}</strong>`}em({tokens:n}){return`<em>${this.parser.parseInline(n)}</em>`}codespan({text:n}){return`<code>${n}</code>`}br(n){return"<br>"}del({tokens:n}){return`<del>${this.parser.parseInline(n)}</del>`}link({href:n,title:t,tokens:r}){const i=this.parser.parseInline(r),s=Th(n);if(s===null)return i;n=s;let o='<a href="'+n+'"';return t&&(o+=' title="'+t+'"'),o+=">"+i+"</a>",o}image({href:n,title:t,text:r}){const i=Th(n);if(i===null)return r;n=i;let s=`<img src="${n}" alt="${r}"`;return t&&(s+=` title="${t}"`),s+=">",s}text(n){return"tokens"in n&&n.tokens?this.parser.parseInline(n.tokens):n.text}}class sf{strong({text:n}){return n}em({text:n}){return n}codespan({text:n}){return n}del({text:n}){return n}html({text:n}){return n}text({text:n}){return n}link({text:n}){return""+n}image({text:n}){return""+n}br(){return""}}class xn{constructor(n){re(this,"options");re(this,"renderer");re(this,"textRenderer");this.options=n||wr,this.options.renderer=this.options.renderer||new Na,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new sf}static parse(n,t){return new xn(t).parse(n)}static parseInline(n,t){return new xn(t).parseInline(n)}parse(n,t=!0){let r="";for(let i=0;i<n.length;i++){const s=n[i];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[s.type]){const a=s,l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(a.type)){r+=l||"";continue}}const o=s;switch(o.type){case"space":{r+=this.renderer.space(o);continue}case"hr":{r+=this.renderer.hr(o);continue}case"heading":{r+=this.renderer.heading(o);continue}case"code":{r+=this.renderer.code(o);continue}case"table":{r+=this.renderer.table(o);continue}case"blockquote":{r+=this.renderer.blockquote(o);continue}case"list":{r+=this.renderer.list(o);continue}case"html":{r+=this.renderer.html(o);continue}case"paragraph":{r+=this.renderer.paragraph(o);continue}case"text":{let a=o,l=this.renderer.text(a);for(;i+1<n.length&&n[i+1].type==="text";)a=n[++i],l+=`
`+this.renderer.text(a);t?r+=this.renderer.paragraph({type:"paragraph",raw:l,text:l,tokens:[{type:"text",raw:l,text:l}]}):r+=l;continue}default:{const a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}parseInline(n,t){t=t||this.renderer;let r="";for(let i=0;i<n.length;i++){const s=n[i];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[s.type]){const a=this.options.extensions.renderers[s.type].call({parser:this},s);if(a!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){r+=a||"";continue}}const o=s;switch(o.type){case"escape":{r+=t.text(o);break}case"html":{r+=t.html(o);break}case"link":{r+=t.link(o);break}case"image":{r+=t.image(o);break}case"strong":{r+=t.strong(o);break}case"em":{r+=t.em(o);break}case"codespan":{r+=t.codespan(o);break}case"br":{r+=t.br(o);break}case"del":{r+=t.del(o);break}case"text":{r+=t.text(o);break}default:{const a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}}class rs{constructor(n){re(this,"options");re(this,"block");this.options=n||wr}preprocess(n){return n}postprocess(n){return n}processAllTokens(n){return n}provideLexer(){return this.block?yn.lex:yn.lexInline}provideParser(){return this.block?xn.parse:xn.parseInline}}re(rs,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));class ZP{constructor(...n){re(this,"defaults",Zd());re(this,"options",this.setOptions);re(this,"parse",this.parseMarkdown(!0));re(this,"parseInline",this.parseMarkdown(!1));re(this,"Parser",xn);re(this,"Renderer",Na);re(this,"TextRenderer",sf);re(this,"Lexer",yn);re(this,"Tokenizer",Ma);re(this,"Hooks",rs);this.use(...n)}walkTokens(n,t){var i,s;let r=[];for(const o of n)switch(r=r.concat(t.call(this,o)),o.type){case"table":{const a=o;for(const l of a.header)r=r.concat(this.walkTokens(l.tokens,t));for(const l of a.rows)for(const u of l)r=r.concat(this.walkTokens(u.tokens,t));break}case"list":{const a=o;r=r.concat(this.walkTokens(a.items,t));break}default:{const a=o;(s=(i=this.defaults.extensions)==null?void 0:i.childTokens)!=null&&s[a.type]?this.defaults.extensions.childTokens[a.type].forEach(l=>{const u=a[l].flat(1/0);r=r.concat(this.walkTokens(u,t))}):a.tokens&&(r=r.concat(this.walkTokens(a.tokens,t)))}}return r}use(...n){const t=this.defaults.extensions||{renderers:{},childTokens:{}};return n.forEach(r=>{const i={...r};if(i.async=this.defaults.async||i.async||!1,r.extensions&&(r.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){const o=t.renderers[s.name];o?t.renderers[s.name]=function(...a){let l=s.renderer.apply(this,a);return l===!1&&(l=o.apply(this,a)),l}:t.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const o=t[s.level];o?o.unshift(s.tokenizer):t[s.level]=[s.tokenizer],s.start&&(s.level==="block"?t.startBlock?t.startBlock.push(s.start):t.startBlock=[s.start]:s.level==="inline"&&(t.startInline?t.startInline.push(s.start):t.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(t.childTokens[s.name]=s.childTokens)}),i.extensions=t),r.renderer){const s=this.defaults.renderer||new Na(this.defaults);for(const o in r.renderer){if(!(o in s))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;const a=o,l=r.renderer[a],u=s[a];s[a]=(...c)=>{let d=l.apply(s,c);return d===!1&&(d=u.apply(s,c)),d||""}}i.renderer=s}if(r.tokenizer){const s=this.defaults.tokenizer||new Ma(this.defaults);for(const o in r.tokenizer){if(!(o in s))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;const a=o,l=r.tokenizer[a],u=s[a];s[a]=(...c)=>{let d=l.apply(s,c);return d===!1&&(d=u.apply(s,c)),d}}i.tokenizer=s}if(r.hooks){const s=this.defaults.hooks||new rs;for(const o in r.hooks){if(!(o in s))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;const a=o,l=r.hooks[a],u=s[a];rs.passThroughHooks.has(o)?s[a]=c=>{if(this.defaults.async)return Promise.resolve(l.call(s,c)).then(f=>u.call(s,f));const d=l.call(s,c);return u.call(s,d)}:s[a]=(...c)=>{let d=l.apply(s,c);return d===!1&&(d=u.apply(s,c)),d}}i.hooks=s}if(r.walkTokens){const s=this.defaults.walkTokens,o=r.walkTokens;i.walkTokens=function(a){let l=[];return l.push(o.call(this,a)),s&&(l=l.concat(s.call(this,a))),l}}this.defaults={...this.defaults,...i}}),this}setOptions(n){return this.defaults={...this.defaults,...n},this}lexer(n,t){return yn.lex(n,t??this.defaults)}parser(n,t){return xn.parse(n,t??this.defaults)}parseMarkdown(n){return(r,i)=>{const s={...i},o={...this.defaults,...s},a=this.onError(!!o.silent,!!o.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof r>"u"||r===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof r!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(r)+", string expected"));o.hooks&&(o.hooks.options=o,o.hooks.block=n);const l=o.hooks?o.hooks.provideLexer():n?yn.lex:yn.lexInline,u=o.hooks?o.hooks.provideParser():n?xn.parse:xn.parseInline;if(o.async)return Promise.resolve(o.hooks?o.hooks.preprocess(r):r).then(c=>l(c,o)).then(c=>o.hooks?o.hooks.processAllTokens(c):c).then(c=>o.walkTokens?Promise.all(this.walkTokens(c,o.walkTokens)).then(()=>c):c).then(c=>u(c,o)).then(c=>o.hooks?o.hooks.postprocess(c):c).catch(a);try{o.hooks&&(r=o.hooks.preprocess(r));let c=l(r,o);o.hooks&&(c=o.hooks.processAllTokens(c)),o.walkTokens&&this.walkTokens(c,o.walkTokens);let d=u(c,o);return o.hooks&&(d=o.hooks.postprocess(d)),d}catch(c){return a(c)}}}onError(n,t){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,n){const i="<p>An error occurred:</p><pre>"+rn(r.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(r);throw r}}}const hr=new ZP;function ee(e,n){return hr.parse(e,n)}ee.options=ee.setOptions=function(e){return hr.setOptions(e),ee.defaults=hr.defaults,gy(ee.defaults),ee};ee.getDefaults=Zd;ee.defaults=wr;ee.use=function(...e){return hr.use(...e),ee.defaults=hr.defaults,gy(ee.defaults),ee};ee.walkTokens=function(e,n){return hr.walkTokens(e,n)};ee.parseInline=hr.parseInline;ee.Parser=xn;ee.parser=xn.parse;ee.Renderer=Na;ee.TextRenderer=sf;ee.Lexer=yn;ee.lexer=yn.lex;ee.Tokenizer=Ma;ee.Hooks=rs;ee.parse=ee;ee.options;ee.setOptions;ee.use;ee.walkTokens;ee.parseInline;xn.parse;yn.lex;ee.setOptions({breaks:!1});function Py({ingredients:e}){const[n,t]=S.useState(new Set);function r(i){t(s=>{const o=new Set(s);return o.has(i)?o.delete(i):o.add(i),o})}return w.jsxs("div",{children:[w.jsx("h2",{className:"uppercase text-primary font-semibold mb-2",children:"Ingrédients"}),w.jsx("ul",{className:"flex flex-col gap-2 mb-8",itemProp:"ingredients",children:e.map((i,s)=>w.jsxs("li",{itemProp:"recipeIngredient",className:`flex items-start gap-3 text-lg leading-loose cursor-pointer${n.has(s)?" row-checked":""}`,onClick:()=>r(s),children:[w.jsx("span",{className:"row-check-bubble mt-1.5","aria-hidden":"true"}),w.jsx("span",{dangerouslySetInnerHTML:{__html:ee.parseInline(i)}})]},s))})]})}const JP="/recettes-cuisine/".replace(/\/$/,""),ej="text-left text-lg leading-loose [&>*]:mb-6 [&_h2]:text-base [&_h2]:uppercase [&_h2]:text-primary [&_h2]:font-semibold [&_h2]:mb-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-3 [&_a]:underline [&_a]:decoration-[3px] [&_a]:decoration-primary [&_a]:underline-offset-2";function nj(e){return e.replace(/\(\.\.\/images\//g,`(${JP}/images/`)}function tj(e){return e.replace(/\.webp(\?|#|$)/i,".full.webp$1")}const jy=new ee.Renderer;jy.image=({href:e,text:n})=>{const t=n!=null&&n.trim()?`<figcaption>${n.trim()}</figcaption>`:"";return`<figure class="recipe-inline-image"><img src="${e}" alt="${n??""}" loading="lazy">${t}</figure>`};function rj({src:e,alt:n,onClose:t}){return S.useEffect(()=>{const r=i=>{i.key==="Escape"&&t()};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[t]),w.jsxs("div",{className:"fixed inset-0 z-[10001] flex items-center justify-center bg-black/85 transition-opacity duration-300",onClick:r=>{r.target===r.currentTarget&&t()},children:[w.jsx("button",{onClick:t,className:"absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none","aria-label":"Fermer",children:"×"}),w.jsx("img",{src:e,alt:n,className:"max-w-[92vw] max-h-[92vh] object-contain rounded-lg shadow-2xl"})]})}function Ty({content:e,className:n}){const t=ee.parse(nj(e),{renderer:jy}),r=S.useRef(null),[i,s]=S.useState(null);return S.useEffect(()=>{const o=r.current;if(!o)return;const a=Array.from(o.querySelectorAll("ul li"));a.forEach(u=>{const c=()=>u.classList.toggle("row-checked");u.style.cursor="pointer",u.addEventListener("click",c),u._rcHandler=c});const l=Array.from(o.querySelectorAll("figure.recipe-inline-image"));return l.forEach(u=>{const c=u.querySelector("img");if(!c)return;const d=()=>s({src:tj(c.src),alt:c.alt});u.addEventListener("click",d),u._imgHandler=d}),()=>{a.forEach(u=>{const c=u._rcHandler;c&&u.removeEventListener("click",c)}),l.forEach(u=>{const c=u._imgHandler;c&&u.removeEventListener("click",c)})}},[t]),w.jsxs(w.Fragment,{children:[w.jsx("div",{ref:r,itemProp:"recipeInstructions",className:n??ej,dangerouslySetInnerHTML:{__html:t}}),i&&w.jsx(rj,{...i,onClose:()=>s(null)})]})}function zy({directions:e}){const[n,t]=S.useState(new Set);function r(i){t(s=>{const o=new Set(s);return o.has(i)?o.delete(i):o.add(i),o})}return w.jsxs("div",{children:[w.jsx("h2",{className:"uppercase text-primary font-semibold mb-2",children:"Préparation"}),w.jsx("ul",{className:"flex flex-col gap-3 mb-8",itemProp:"recipeInstructions",children:e.map((i,s)=>w.jsxs("li",{className:`flex gap-3 items-start text-lg leading-loose cursor-pointer${n.has(s)?" row-checked":""}`,onClick:()=>r(s),children:[w.jsx("span",{className:"row-check-bubble mt-1.5","aria-hidden":"true"}),w.jsx("span",{dangerouslySetInnerHTML:{__html:ee.parseInline(i)}})]},s))})]})}const ij=`---\r
layout: recipe\r
title:  "Sauce ankake aux champignons"\r
image: ankake_sauce\r
\r
tags:\r
- japon\r
- voyage\r
- sauce\r
- shimeji\r
- gingembre\r
- dashi\r
- sauce soja claire\r
- sauce soja\r
- mirin\r
- sake\r
- fecule de pomme de terre\r
- eau\r
- assaisonnement\r
- condiment\r
- ankake\r
- champignons\r
\r
ingredients:\r
- 10g de shimeji\r
- 3g de gingembre\r
- 50ml de dashi\r
\r
directions:\r
- Séparer les shimeji à la main dans le sens de la longueur, râper le gingembre.\r
- Mélanger le dashi, la sauce soja claire, le mirin et le saké dans une poêle.\r
- Lorsque le mélange commence à bouillir, ajouter les shimeji, puis éventuellement de la viande.\r
- Couvrir et laisser mijoter jusqu'à ce que les shimeji soient cuits.\r
- Mélanger la fécule de pomme de terre et l'eau, puis l’ajouter progressivement en remuant constamment jusqu'à ce que la sauce épaississe.\r
\r
components:\r
- Dashi\r
---\r
\r
Quantité pour 1 personne (boulette de tofu).\r
`,sj=`---\r
layout: recipe\r
title:  "Sauce aromatique pour Karaage"\r
image: aromatic_karaage\r
\r
tags:\r
- japon\r
- voyage\r
- sauce\r
- sauce soja\r
- sauce soja foncee\r
- vinaigre\r
- mirin\r
- dashi\r
- prune salee\r
- radis\r
- pousses de radis\r
- shiso\r
- assaisonnement\r
- condiment\r
\r
ingredients:\r
- 1 c. à café de vinaigre\r
- 1 c. à café de sauce soja foncée\r
- 3/2 c. à café de mirin\r
- 1 c. à café de dashi\r
- 1 c. à café de prune salée\r
- 10g de radis (râpé)\r
- 2g de pousses de radis (coupées en trois)\r
- Une feuille de shiso\r
\r
directions:\r
- mélanger les ingrédients\r
\r
components:\r
- Dashi\r
\r
---\r
\r
Suffisant pour la recette de Karaage pour 1 personne\r
`,oj=`---
layout: recipe
title: "Char siu (porc doré au chalumeau)"
image: char_siu_porc_chalumeau

tags:
- composant
- porc
- poitrine de porc
- char siu
- viande
- cuiseur a riz
- chalumeau
- japon
- voyage
- sake
- sauce soja
- sucre
- ail
- mayonnaise
- assaisonnement
- sucre-sale

ingredients:
- 160 g de poitrine de porc en bloc
- 2 c. à s. de sucre
- 2 c. à s. de saké
- 2 c. à s. de sauce soja
- 2,5 g de mayonnaise
- 2 g d'ail frais

directions:
- Râper l'ail à l'avance.
- Dans le cuiseur à riz, mélanger le sucre, le saké, la sauce soja, la mayonnaise et l'ail.
- Piquer abondamment le bloc de poitrine à la fourchette et le déposer dans le cuiseur, côté gras en bas. Si le bloc est gros, le couper en deux pour une cuisson homogène.
- Lancer le mode cuisson normale du cuiseur à riz.
- Retourner la viande à mi-cuisson pour que les saveurs imprègnent uniformément.
- Une fois le char siu cuit, faire dorer la surface au chalumeau puis couper en morceaux.

---

Porc poitrine cuit au cuiseur à riz (saké, soja, sucre, ail, mayonnaise) puis doré au chalumeau. Composant pour ramen ou autres plats.
`,aj=`---\r
layout: recipe\r
title:  "Dashi"\r
image: dashi\r
\r
tags:\r
- japon\r
- voyage\r
- bouillon\r
- dashi\r
- konbu\r
- bonite\r
- niban\r
- base\r
- fond\r
- algue\r
\r
ingredients:\r
- 1L d'eau filtrée\r
- 10g de Konbu, algue séchée (~1% du poids de l'eau)\r
- 20g de Katsuo bushi, flocons de bonite séchée (~2% du poids de l'eau)\r
\r
directions:\r
- Faire tremper le kombu dans l'eau froide et laisser reposer un moment (au moins 30min)\r
- Chauffer l'eau avec le konbu à feu doux et porter à frémissement. Mais ne pas faire bouillir !\r
- Retirer le kombu de l'eau puis retirer du feu\r
- Ajouter les flocons de bonite à l'eau chauffée et attendre qu'ils coulent.\r
- Filtrer les flocons de bonite (avec un tamis), mais ne pas les presser. Procéder très lentement pour que le Dashi reste bien clair.\r
---\r
\r
Pour environ 800-900ml.\r
\r
C'est la base de beaucoup de plats japonais, fondamental pour beaucoup de choses.\r
\r
Si vous voulez faire du **Niban dashi, le second dashi**, mélanger le konbu et les flocons de bonite du premier dashi dans 1/3 de la quantité d'eau et faire bouillir environ 15 minutes. Puis filtrer.\r
`,lj=`---
layout: recipe
title: "Marinade gingembre-soja"
image: marinade_gingembre_soja

tags:
- condiment
- marinade
- gingembre
- sauce soja
- miel
- citron vert
- ail
- asiatique
- sucre-sale
- fait maison

ingredients:
- 6 tiges de cébette
- 2 gousses d'ail
- 10 g de gingembre frais
- 1 c. à soupe bombée de miel liquide
- 1/2 citron vert (jus)
- 8 cl de sauce soja
- 2 c. à soupe d'huile de sésame grillé
- Poivre
---

Marinade asiatique sucrée-salée au gingembre et à la sauce soja, idéale pour laquer du saumon, du poulet ou des aubergines avant cuisson au four.

## Préparation

- Éplucher, dégermer et hacher l'ail.
- Peler et hacher le gingembre.
- Ciseler les tiges et le vert des cébettes.
- Dans un bol, mélanger le jus de citron vert, la sauce soja, l'huile de sésame, le miel, les cébettes, le gingembre et l'ail.
- Poivrer.
- Verser sur la viande ou le poisson et laisser reposer au frais au moins 1 heure.
`,uj=`---
layout: recipe
title: "Marinade moutarde-miel"
image: marinade_moutarde_miel

tags:
- condiment
- marinade
- moutarde
- miel
- sucre-sale
- fait maison

ingredients:
- 3 c. à soupe de moutarde
- 2 c. à soupe de miel
- 1 c. à soupe d'huile d'olive
---

Marinade simple à la moutarde et au miel, parfaite pour laquer des travers de porc, du poulet rôti ou un magret.

## Préparation

- Verser le miel, la moutarde et l'huile d'olive dans un bol.
- Bien mélanger jusqu'à obtenir une marinade homogène.
- Badigeonner la viande au pinceau et laisser reposer au frais 30 minutes minimum.
`,cj=`---
layout: recipe
title: "Marinade cuite pour poisson"
image: marinade_poisson

tags:
- condiment
- marinade
- vin blanc
- vinaigre
- carotte
- oignon
- thym
- laurier
- poisson
- bocuse
- fait maison

ingredients:
- 2 parts de vin blanc sec (pour 1 part de vinaigre)
- 1 part de vinaigre
- 1 carotte moyenne
- 1 gros oignon
- 1 brindille de thym
- 1 feuille de laurier
- Sel
- Poivre du moulin
---

Marinade cuite classique pour pochage de poisson au four (maquereaux, sardines). Refroidie, elle parfume aussi des courts-bouillons rapides.

## Préparation

- Mélanger deux parts de vin blanc sec et une part de vinaigre dans une casserole.
- Couper la carotte et l'oignon en rondelles minces.
- Ajouter les légumes, le thym et le laurier à la marinade.
- Saler et poivrer.
- Faire cuire à frémissements pendant 20 minutes.
- Verser bouillante sur le poisson à mariner ou à pocher.
`,dj=`---
layout: recipe
title: "Marinade au vinaigre, ail et laurier"
image: marinade_vinaigre_ail_laurier

tags:
- condiment
- marinade
- vinaigre
- ail
- laurier
- bocuse
- fait maison

ingredients:
- 2 dl de vinaigre
- 1 gousse d'ail (par couche de légume)
- 1 feuille de laurier (en fragments, par couche)
- Sel fin
- Poivre du moulin
---

Marinade froide à base de vinaigre bouilli, ail et laurier — pour attendrir et conserver des légumes crus taillés en julienne (chou rouge, carottes, navets, betterave).

## Préparation

- Faire bouillir le vinaigre dans une casserole, puis laisser refroidir.
- Disposer les légumes en julienne par couches successives dans une terrine.
- Entre chaque couche, saupoudrer d'un peu de sel fin, ajouter une gousse d'ail, du poivre frais moulu et un fragment de feuille de laurier.
- Verser le vinaigre refroidi jusqu'à couvrir entièrement les légumes.
- Laisser mariner 2 jours au frais.
- Égoutter et assaisonner d'huile au moment de servir.
`,fj=`---\r
layout: recipe\r
title:  "Vinaigrette miso"\r
image: vinaigrette_miso\r
\r
tags:\r
- japon\r
- voyage\r
- entree\r
- sesame\r
- sauce soja\r
- sauce soja foncee\r
- vinaigre\r
- mirin\r
- miso blanc\r
- vinaigrette\r
- sauce\r
- assaisonnement\r
- condiment\r
\r
ingredients:\r
- 1 c. à café de sésame\r
- 1 c. à café de sauce soja foncée\r
- 1 c. à café de vinaigre\r
- 1 c. à café de mirin\r
- 1 c. à café de miso blanc\r
\r
directions:\r
- mélanger les ingrédients\r
---\r
\r
Pour 5 c. à café de sauce, ce qui est suffisant pour la salade Hijiki pour 1 personne.\r
\r
Pour salades (e.g. Hijiki), 5 c. à café de vinaigrette miso.\r
`,pj=`---

layout: recipe
title: "Pâtes fraîches / à raviolis"
image: pates_fraiches_raviolis

tags:
- farine
- oeufs
- pates
- base
- facile
- sestu
- perso

ingredients:
- 100 g de farine
- 1 œuf
- 20 g d'huile d'olive

directions:
- Mélanger la farine, l'œuf et l'huile d'olive.
- Pétrir la pâte jusqu'à obtenir une boule assez sèche mais légèrement humide.
- Ajouter un peu d'eau tiède salée si la pâte est trop sèche.
- Malaxer jusqu'à ce que la pâte perde un peu d'humidité.
- Ajuster la consistance si besoin.
- Filmer la pâte.
- Mettre au réfrigérateur pendant 1 heure.

---

Pâte fraîche pour raviolis. Repos 1 h au frais.
`,hj=`---\r
\r
layout: recipe\r
title: "Rillettes de thon"\r
image: rillettes_de_thon\r
\r
tags:\r
- composant\r
- thon\r
- poisson\r
- fromage frais\r
- citron\r
- facile\r
\r
ingredients:\r
- 1 boîte de thon au naturel\r
- 100 g de fromage frais\r
- ½ citron (jus)\r
\r
---\r
\r
Composant pour les pommes de terre farcies ou à tartiner sur du pain.\r
\r
## Préparation\r
\r
- Égoutter le thon et l'émietter à la fourchette.\r
- Incorporer le thon au fromage frais et bien mélanger.\r
- Verser le jus de citron. Saler et poivrer.\r
`,mj=`---
layout: recipe
title: "Sauce au foie gras"
image: sauce_au_foie_gras

tags:
- condiment
- sauce
- sestu
- foie gras
- bouillon de volaille
- creme

ingredients:
- 150 g de foie gras
- 150 ml de bouillon de volaille
- 450 ml de crème fraîche
---

## Préparation

- Couper le foie gras en petits dés.
- Faire chauffer le bouillon de volaille dans une casserole. Y ajouter les dés de foie gras et fouetter à feu moyen.
- Une fois le foie gras bien fondu, terminer au blender ou au mixeur plongeant pour éliminer tous les morceaux.
- Ajouter la crème fraîche et laisser réduire à feu doux jusqu'à obtenir une sauce onctueuse.
- Servir bien chaud.
`,gj=`---
layout: recipe
title: "Sauce au poivre"
image: sauce_au_poivre

tags:
- condiment
- sauce
- boeuf
- echalotes
- poivre vert
- cognac
- creme
- fond de veau
- beurre

ingredients:
- 2 échalotes
- 2 c. à soupe de poivre vert
- 3 c. à soupe de cognac
- 20 cl de fond de veau
- 15 cl de crème liquide
- 20 g de beurre
---

## Préparation

- Pelez et ciselez les échalotes. Faites-les revenir 5 minutes avec le beurre à feu moyen.
- Ajoutez le poivre vert et poursuivez la cuisson 3 minutes, puis incorporez le cognac.
- Lorsque le cognac est évaporé, versez le fond de veau et salez légèrement. Laissez frémir puis incorporez la crème.
- Poursuivez la cuisson jusqu'à ce que la sauce épaississe et nappe la cuillère.
`,vj=`---
layout: recipe
title: "Sauce au vin rouge"
image: sauce_au_vin_rouge

tags:
- condiment
- sauce
- viande
- vin rouge
- fond de veau
- echalotes
- carotte
- laurier
- concentre de tomate
- beurre

ingredients:
- 2 carottes fines
- 2 échalotes
- 1 petit oignon rouge
- 1 feuille de laurier
- 50 g de beurre
- 25 cl de vin rouge
- 15 cl de fond de veau
- 1 c. à soupe de concentré de tomate
- 2 pincées de piment de Cayenne
- Sel et poivre
---

## Préparation

- Peler les carottes, l'oignon et les échalotes, les hacher grossièrement.
- Faire rissoler le tout 5 minutes à feu vif dans une casserole avec 20 g de beurre.
- Incorporer le vin, laisser réduire de moitié puis ajouter le concentré de tomate, le fond de veau, le piment, le laurier, du sel et du poivre. Laisser mijoter une dizaine de minutes.
- Ajouter le beurre restant en fouettant. Rectifier l'assaisonnement.
`,yj=`---
layout: recipe
title: "Sauce bolognaise"
image: sauce_bolognaise

tags:
- condiment
- sauce
- pates
- viande
- boeuf
- viande de boeuf hachee
- tomates
- pulpe de tomate
- herbes aromatiques
- ail
- oignon
- classique
- fait maison

ingredients:
- 2 c. à soupe d'huile d'olive
- 1 gousse d'ail hachée
- 1 oignon émincé
- 300 g de viande de bœuf hachée
- 800 g de pulpe de tomate (ou 500 g de tomates fraîches)
- 1 c. à soupe d'herbes aromatiques (origan, thym, basilic)
- 2 morceaux de sucre
- Sel
- Poivre du moulin
---

Sauce tomate à la viande, classique italienne. Base des lasagnes, des spaghettis bolognaise, et de bien d'autres pâtes au four.

## Préparation

- Couper l'oignon et l'ail en petits morceaux. Les faire revenir à feu doux dans une casserole avec une cuillère à soupe d'huile d'olive, jusqu'à ce que les oignons deviennent translucides.
- Augmenter le feu 1 à 2 minutes pour exhaler les saveurs, puis baisser le feu pour éviter que les oignons ne brûlent.
- Ajouter la pulpe de tomate, saler, poivrer, ajouter les herbes aromatiques. Laisser mijoter à feu doux 20 minutes.
- Ajouter les 2 morceaux de sucre pour adoucir la sauce. Mixer ou non selon les préférences.
- Pendant ce temps, faire chauffer le reste d'huile d'olive dans une poêle et faire revenir la viande de bœuf hachée à feu moyen 3 à 5 minutes. Saler et poivrer.
- Dégraisser la viande à l'écumoire, puis la mélanger à la sauce tomate.
`,xj=`---\r
layout: recipe\r
title:  Sauce caramel\r
image: sauce_caramel\r
\r
tags:\r
- sucre\r
- eau\r
- sauce\r
- caramel\r
- dessert\r
- assaisonnement\r
- condiment\r
\r
ingredients:\r
- 100 gr sucre\r
- 1/2 verre d'eau\r
\r
directions:\r
- Faites fondre le sucre dans une poêle et portez à caramélisation\r
- Déglacez avec un demi verre d'eau \r
- Mélangez jusqu'à retrouver une sauce homogène\r
\r
---\r
`,_j=`---
layout: recipe
title: "Sauce chasseur"
image: sauce_chasseur

tags:
- condiment
- sauce
- champignons
- echalotes
- vin blanc
- fond de veau
- concentre de tomate
- thym
- laurier
- beurre
- farine
- chasseur
- classique

ingredients:
- 250 g de champignons de Paris
- 2 échalotes
- 2 brins de thym
- 1 feuille de laurier
- 10 g de beurre
- 1 c. à soupe d'huile
- 1 c. à soupe de farine
- 10 cl de vin blanc sec
- 15 cl de fond de veau
- 2 c. à soupe de concentré de tomate
- Sel et poivre
---

Sauce chasseur classique aux champignons et vin blanc, parfaite pour accompagner viandes rôties et filets mignons.

## Préparation

- Émincer les champignons.
- Peler et hacher les échalotes, les faire suer 3 minutes dans une casserole avec le beurre et l'huile.
- Ajouter les champignons, poursuivre la cuisson 5 minutes à feu vif en remuant.
- Saupoudrer de farine, mélanger puis incorporer le vin blanc et laisser réduire 3 minutes en remuant.
- Verser le fond de veau, ajouter le concentré de tomate, le laurier, le thym, du sel et du poivre.
- Laisser cuire une dizaine de minutes sans couvrir.
- Pour une sauce onctueuse : ajouter une noisette de beurre froid en fouettant vivement avant de servir, pour la rendre brillante et veloutée.
`,wj=`---
layout: recipe
title: "Sauce à l'orange"
image: sauce_orange

tags:
- condiment
- sauce
- orange
- agrumes
- ail
- echalotes
- sucre-sale
- fait maison

ingredients:
- 3 oranges
- 1 échalote
- 2 gousses d'ail
- 20 cl de fond de veau
- 3 c. à soupe de sauce soja
- 2 c. à soupe de sucre roux
- 2 c. à soupe de vinaigre balsamique
- 1 c. à soupe de paprika fumé
- Sel
---

Sauce sucrée-salée à l'orange, idéale pour laquer des travers de porc, un magret ou des cuisses de poulet rôties.

## Préparation

- Peler et hacher l'échalote et les gousses d'ail.
- Zester 2 oranges, presser les 3 oranges.
- Fouetter le jus et le zeste des oranges avec l'ail, l'échalote, le fond de veau, la sauce soja, le sucre et le vinaigre balsamique.
- Porter à frémissements et laisser réduire environ 10 minutes.
- Ajouter le paprika fumé, saler à convenance.

**Astuce :** pour atténuer l'amertume des zestes, les faire blanchir quelques secondes avant de les incorporer.
`,bj=`---\r
layout: recipe\r
title:  "Sauce teriyaki"\r
image: sauce_teriyaki\r
\r
tags:\r
- japon\r
- voyage\r
- soja\r
- sauce soja foncee\r
- teriyaki\r
- sauce\r
- mirin\r
- assaisonnement\r
- condiment\r
\r
\r
ingredients:\r
- 1/2tsp dark soy sauce\r
- 3/2tsp mirin\r
\r
directions:\r
- mix.\r
---\r
\r
Pour 2 cuillères à soupe.\r
`,kj=`---\r
layout: recipe\r
title:  Sauce teriyaki pour nouilles sautées    \r
image: sauce_teriyaki\r
\r
tags:\r
- japon\r
- marinade\r
- sake\r
- sauce soja claire\r
- sauce soja foncee\r
- sauce soja\r
- sucre\r
- teriyaki\r
- sauce\r
- assaisonnement\r
- condiment\r
\r
\r
ingredients:\r
- 100g de sucre\r
- 4 càS de sauce soja claire\r
- 2 càS de saké\r
- 1 càC de sauce soja foncée\r
\r
\r
directions:\r
- Dans une petite casserole, faites fondre à feu doux le sucre dans la souce soja claire en remuant.\r
- Laisser frémir 5 minutes pour épaissir.\r
- Ajouter le saké, la sauce soja foncée et laisser refroidir.\r
\r
---\r
\r
Pour 12 cl.\r
\r
Cette sauce sert souvent de marinade: on badigeonne la viande avant de la griller.\r
\r
Utilisez-la aussi pour tremper les nouilles ou pour arroser les nouilles en bouillon.\r
\r
Elle conserve plusieurs semaines au réfrigirateur.\r
`,Sj=`---\r
layout: recipe\r
title:  "Sauce Yakitori"\r
image: sauce_yakitori\r
\r
tags:\r
- japon\r
- yakitori\r
- sauce\r
- soja\r
- sucre\r
- eau\r
- miel\r
- gingembre\r
\r
ingredients:\r
- 4 cas de sucre\r
- 12 cas de sauce soja\r
- 100g de gingembre\r
- 4 cas d'eau\r
- miel (à part)\r
\r
directions:\r
- mix.\r
\r
---\r
\r
`,Cj=`---
layout: recipe
title: "Vinaigrette à la moutarde"
image: vinaigrette_moutarde

tags:
- condiment
- vinaigrette
- sauce
- moutarde
- huile d'arachide
- vinaigre de vin
- bocuse
- fait maison

ingredients:
- 2 c. à soupe d'huile d'arachide
- 1 c. à soupe de vinaigre de vin
- 1 c. à café de moutarde
- Sel
- Poivre du moulin
---

Vinaigrette de base à la moutarde, pour assaisonner crudités, salades de champignons, salades vertes ou légumes vapeur.

## Préparation

- Mélanger la moutarde avec le sel et le poivre dans un bol.
- Ajouter le vinaigre, puis fouetter en versant l'huile en filet pour émulsionner.
- Verser sur la salade au moment de servir et remuer.
`,Pj=Object.assign({"../../../_components/ankake_sauce.md":ij,"../../../_components/aromatic_sauce_for_karaage.md":sj,"../../../_components/char_siu_porc_dore_au_chalumeau.md":oj,"../../../_components/dashi.md":aj,"../../../_components/marinade_gingembre_soja.md":lj,"../../../_components/marinade_moutarde_miel.md":uj,"../../../_components/marinade_poisson.md":cj,"../../../_components/marinade_vinaigre_ail_laurier.md":dj,"../../../_components/miso_dressing.md":fj,"../../../_components/pates_fraiches_raviolis.md":pj,"../../../_components/rillettes_de_thon.md":hj,"../../../_components/sauce_au_foie_gras.md":mj,"../../../_components/sauce_au_poivre.md":gj,"../../../_components/sauce_au_vin_rouge.md":vj,"../../../_components/sauce_bolognaise.md":yj,"../../../_components/sauce_caramel.md":xj,"../../../_components/sauce_chasseur.md":_j,"../../../_components/sauce_orange.md":wj,"../../../_components/sauce_teriyaki.md":bj,"../../../_components/sauce_teriyaki_maison.md":kj,"../../../_components/sauce_yakitori.md":Sj,"../../../_components/vinaigrette_moutarde.md":Cj}),of=Object.entries(Pj).map(([e,n])=>JC(dy(e),n)),or=new Map;for(const e of[...Hs,...of])for(const n of e.tags){const t=String(n).trim();t&&or.set(t,(or.get(t)??0)+1)}const uu=or.size?Math.max(...or.values()):1;function Pr(e,n,t){return e+(n-e)*t}function Mh(e,n,t){return"#"+[e,n,t].map(r=>Math.round(r).toString(16).padStart(2,"0")).join("")}function cu(e){const n=parseInt(e.slice(1),16);return[n>>16&255,n>>8&255,n&255]}function jj(e){const n=uu*.4,[t,r,i]=cu("#F53200"),[s,o,a]=cu("#f97316"),[l,u,c]=cu("#22c55e");if(e<=n){const f=n?e/n:0;return Mh(Pr(t,s,f),Pr(r,o,f),Pr(i,a,f))}const d=uu===n?1:(e-n)/(uu-n);return Mh(Pr(s,l,d),Pr(o,u,d),Pr(a,c,d))}function Tj({tags:e}){const n=[...e].sort((t,r)=>{const i=or.get(String(t).trim())??0,s=or.get(String(r).trim())??0;return s!==i?s-i:String(t).localeCompare(String(r),"fr",{sensitivity:"base"})});return w.jsx("div",{className:"flex flex-wrap gap-2",children:n.map(t=>{const r=String(t).trim(),i=or.get(r)??0,s=jj(i);return w.jsxs("span",{className:"tag-sugg relative inline-block",children:[w.jsx(at,{to:`/recherche?tags=${encodeURIComponent(r)}`,className:"sugg-pill px-3 py-1 rounded-full border-2 border-white text-sm text-white transition",style:{background:s,boxShadow:"0 6px 14px rgba(0,0,0,0.10)"},children:r}),w.jsx("span",{className:"count-tip absolute -top-2 -right-2 rounded-full text-white border-2 border-white text-[11px] leading-none px-1.5 py-0.5",style:{background:s,boxShadow:"0 6px 12px rgba(0,0,0,0.12)"},title:`${i} occurrence${i!==1?"s":""}`,children:i})]},r)})})}const Ey="/recettes-cuisine/".replace(/\/$/,"");function Ay(e){return of.find(n=>n.title===e)}function zj({componentTitles:e}){const n=e.map(t=>Ay(t)).filter(t=>t!==void 0);return n.length===0?null:w.jsxs("div",{className:"mb-8",children:[w.jsx("h2",{className:"uppercase text-primary font-semibold mb-2",children:"Composants"}),w.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6",children:n.map(t=>w.jsxs(at,{to:`/recette/${t.slug}`,className:"recipe relative md:hover:scale-105 md:hover:rotate-1 transition",children:[w.jsx("img",{src:`${Ey}/images/cards/${t.image}.webp`,alt:t.title,className:"aspect-video w-full rounded-xl bg-gray-100 mb-1 object-cover",loading:"lazy"}),w.jsx("h3",{className:"font-semibold leading-tight",children:t.title})]},t.slug))})]})}function Ej({componentTitles:e}){const n=e.map(t=>Ay(t)).filter(t=>t!==void 0);return n.length===0?null:w.jsxs("div",{className:"components flex flex-col gap-12",children:[w.jsxs("p",{className:"text-orange-700/80 text-sm",children:["↓ C'est une ",w.jsx("strong",{className:"text-primary",children:"recette à composants"}),". ↓"]}),n.map(t=>w.jsxs("div",{children:[t.image&&w.jsx("div",{className:"component-image aspect-video w-full bg-cover bg-center mb-4 overflow-hidden rounded-xl",children:w.jsx("img",{src:`${Ey}/images/cards/${t.image}.webp`,alt:t.title,className:"w-full h-full object-cover",loading:"lazy"})}),w.jsx("h4",{className:"font-gelica text-3xl mb-6 mt-4",children:t.title}),w.jsx(Py,{ingredients:t.ingredients}),t.directions?w.jsx(zy,{directions:t.directions}):t.content.trim()?w.jsx(Ty,{content:t.content}):null]},t.slug))]})}const af=S.createContext({});function lf(e){const n=S.useRef(null);return n.current===null&&(n.current=e()),n.current}const wl=S.createContext(null),uf=S.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"});class Aj extends S.Component{getSnapshotBeforeUpdate(n){const t=this.props.childRef.current;if(t&&n.isPresent&&!this.props.isPresent){const r=this.props.sizeRef.current;r.height=t.offsetHeight||0,r.width=t.offsetWidth||0,r.top=t.offsetTop,r.left=t.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function Mj({children:e,isPresent:n}){const t=S.useId(),r=S.useRef(null),i=S.useRef({width:0,height:0,top:0,left:0}),{nonce:s}=S.useContext(uf);return S.useInsertionEffect(()=>{const{width:o,height:a,top:l,left:u}=i.current;if(n||!r.current||!o||!a)return;r.current.dataset.motionPopId=t;const c=document.createElement("style");return s&&(c.nonce=s),document.head.appendChild(c),c.sheet&&c.sheet.insertRule(`
          [data-motion-pop-id="${t}"] {
            position: absolute !important;
            width: ${o}px !important;
            height: ${a}px !important;
            top: ${l}px !important;
            left: ${u}px !important;
          }
        `),()=>{document.head.removeChild(c)}},[n]),w.jsx(Aj,{isPresent:n,childRef:r,sizeRef:i,children:S.cloneElement(e,{ref:r})})}const Rj=({children:e,initial:n,isPresent:t,onExitComplete:r,custom:i,presenceAffectsLayout:s,mode:o})=>{const a=lf(Nj),l=S.useId(),u=S.useCallback(d=>{a.set(d,!0);for(const f of a.values())if(!f)return;r&&r()},[a,r]),c=S.useMemo(()=>({id:l,initial:n,isPresent:t,custom:i,onExitComplete:u,register:d=>(a.set(d,!1),()=>a.delete(d))}),s?[Math.random(),u]:[t,u]);return S.useMemo(()=>{a.forEach((d,f)=>a.set(f,!1))},[t]),S.useEffect(()=>{!t&&!a.size&&r&&r()},[t]),o==="popLayout"&&(e=w.jsx(Mj,{isPresent:t,children:e})),w.jsx(wl.Provider,{value:c,children:e})};function Nj(){return new Map}function My(e=!0){const n=S.useContext(wl);if(n===null)return[!0,null];const{isPresent:t,onExitComplete:r,register:i}=n,s=S.useId();S.useEffect(()=>{e&&i(s)},[e]);const o=S.useCallback(()=>e&&r&&r(s),[s,r,e]);return!t&&r?[!1,o]:[!0]}const Co=e=>e.key||"";function Rh(e){const n=[];return S.Children.forEach(e,t=>{S.isValidElement(t)&&n.push(t)}),n}const cf=typeof window<"u",Ry=cf?S.useLayoutEffect:S.useEffect,Lj=({children:e,custom:n,initial:t=!0,onExitComplete:r,presenceAffectsLayout:i=!0,mode:s="sync",propagate:o=!1})=>{const[a,l]=My(o),u=S.useMemo(()=>Rh(e),[e]),c=o&&!a?[]:u.map(Co),d=S.useRef(!0),f=S.useRef(u),p=lf(()=>new Map),[v,g]=S.useState(u),[_,h]=S.useState(u);Ry(()=>{d.current=!1,f.current=u;for(let x=0;x<_.length;x++){const k=Co(_[x]);c.includes(k)?p.delete(k):p.get(k)!==!0&&p.set(k,!1)}},[_,c.length,c.join("-")]);const m=[];if(u!==v){let x=[...u];for(let k=0;k<_.length;k++){const C=_[k],T=Co(C);c.includes(T)||(x.splice(k,0,C),m.push(C))}s==="wait"&&m.length&&(x=m),h(Rh(x)),g(u);return}const{forceRender:y}=S.useContext(af);return w.jsx(w.Fragment,{children:_.map(x=>{const k=Co(x),C=o&&!a?!1:u===_||c.includes(k),T=()=>{if(p.has(k))p.set(k,!0);else return;let j=!0;p.forEach(F=>{F||(j=!1)}),j&&(y==null||y(),h(f.current),o&&(l==null||l()),r&&r())};return w.jsx(Rj,{isPresent:C,initial:!d.current||t?void 0:!1,custom:C?void 0:n,presenceAffectsLayout:i,mode:s,onExitComplete:C?void 0:T,children:x},k)})})},an=e=>e;let Ny=an;function df(e){let n;return()=>(n===void 0&&(n=e()),n)}const ci=(e,n,t)=>{const r=n-e;return r===0?1:(t-e)/r},nt=e=>e*1e3,tt=e=>e/1e3,Dj={useManualTiming:!1};function Ij(e){let n=new Set,t=new Set,r=!1,i=!1;const s=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(u){s.has(u)&&(l.schedule(u),e()),u(o)}const l={schedule:(u,c=!1,d=!1)=>{const p=d&&r?n:t;return c&&s.add(u),p.has(u)||p.add(u),u},cancel:u=>{t.delete(u),s.delete(u)},process:u=>{if(o=u,r){i=!0;return}r=!0,[n,t]=[t,n],n.forEach(a),n.clear(),r=!1,i&&(i=!1,l.process(u))}};return l}const Po=["read","resolveKeyframes","update","preRender","render","postRender"],Fj=40;function Ly(e,n){let t=!1,r=!0;const i={delta:0,timestamp:0,isProcessing:!1},s=()=>t=!0,o=Po.reduce((h,m)=>(h[m]=Ij(s),h),{}),{read:a,resolveKeyframes:l,update:u,preRender:c,render:d,postRender:f}=o,p=()=>{const h=performance.now();t=!1,i.delta=r?1e3/60:Math.max(Math.min(h-i.timestamp,Fj),1),i.timestamp=h,i.isProcessing=!0,a.process(i),l.process(i),u.process(i),c.process(i),d.process(i),f.process(i),i.isProcessing=!1,t&&n&&(r=!1,e(p))},v=()=>{t=!0,r=!0,i.isProcessing||e(p)};return{schedule:Po.reduce((h,m)=>{const y=o[m];return h[m]=(x,k=!1,C=!1)=>(t||v(),y.schedule(x,k,C)),h},{}),cancel:h=>{for(let m=0;m<Po.length;m++)o[Po[m]].cancel(h)},state:i,steps:o}}const{schedule:ue,cancel:It,state:Te,steps:du}=Ly(typeof requestAnimationFrame<"u"?requestAnimationFrame:an,!0),Dy=S.createContext({strict:!1}),Nh={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]},di={};for(const e in Nh)di[e]={isEnabled:n=>Nh[e].some(t=>!!n[t])};function qj(e){for(const n in e)di[n]={...di[n],...e[n]}}const Vj=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","ignoreStrict","viewport"]);function La(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Vj.has(e)}let Iy=e=>!La(e);function $j(e){e&&(Iy=n=>n.startsWith("on")?!La(n):e(n))}try{$j(require("@emotion/is-prop-valid").default)}catch{}function Oj(e,n,t){const r={};for(const i in e)i==="values"&&typeof e.values=="object"||(Iy(i)||t===!0&&La(i)||!n&&!La(i)||e.draggable&&i.startsWith("onDrag"))&&(r[i]=e[i]);return r}function Bj(e){if(typeof Proxy>"u")return e;const n=new Map,t=(...r)=>e(...r);return new Proxy(t,{get:(r,i)=>i==="create"?e:(n.has(i)||n.set(i,e(i)),n.get(i))})}const bl=S.createContext({});function zs(e){return typeof e=="string"||Array.isArray(e)}function kl(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}const ff=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],pf=["initial",...ff];function Sl(e){return kl(e.animate)||pf.some(n=>zs(e[n]))}function Fy(e){return!!(Sl(e)||e.variants)}function Uj(e,n){if(Sl(e)){const{initial:t,animate:r}=e;return{initial:t===!1||zs(t)?t:void 0,animate:zs(r)?r:void 0}}return e.inherit!==!1?n:{}}function Hj(e){const{initial:n,animate:t}=Uj(e,S.useContext(bl));return S.useMemo(()=>({initial:n,animate:t}),[Lh(n),Lh(t)])}function Lh(e){return Array.isArray(e)?e.join(" "):e}const Wj=Symbol.for("motionComponentSymbol");function $r(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function Kj(e,n,t){return S.useCallback(r=>{r&&e.onMount&&e.onMount(r),n&&(r?n.mount(r):n.unmount()),t&&(typeof t=="function"?t(r):$r(t)&&(t.current=r))},[n])}const hf=e=>e.replace(/([a-z])([A-Z])/gu,"$1-$2").toLowerCase(),Yj="framerAppearId",qy="data-"+hf(Yj),{schedule:mf}=Ly(queueMicrotask,!1),Vy=S.createContext({});function Gj(e,n,t,r,i){var s,o;const{visualElement:a}=S.useContext(bl),l=S.useContext(Dy),u=S.useContext(wl),c=S.useContext(uf).reducedMotion,d=S.useRef(null);r=r||l.renderer,!d.current&&r&&(d.current=r(e,{visualState:n,parent:a,props:t,presenceContext:u,blockInitialAnimation:u?u.initial===!1:!1,reducedMotionConfig:c}));const f=d.current,p=S.useContext(Vy);f&&!f.projection&&i&&(f.type==="html"||f.type==="svg")&&Xj(d.current,t,i,p);const v=S.useRef(!1);S.useInsertionEffect(()=>{f&&v.current&&f.update(t,u)});const g=t[qy],_=S.useRef(!!g&&!(!((s=window.MotionHandoffIsComplete)===null||s===void 0)&&s.call(window,g))&&((o=window.MotionHasOptimisedAnimation)===null||o===void 0?void 0:o.call(window,g)));return Ry(()=>{f&&(v.current=!0,window.MotionIsMounted=!0,f.updateFeatures(),mf.render(f.render),_.current&&f.animationState&&f.animationState.animateChanges())}),S.useEffect(()=>{f&&(!_.current&&f.animationState&&f.animationState.animateChanges(),_.current&&(queueMicrotask(()=>{var h;(h=window.MotionHandoffMarkAsComplete)===null||h===void 0||h.call(window,g)}),_.current=!1))}),f}function Xj(e,n,t,r){const{layoutId:i,layout:s,drag:o,dragConstraints:a,layoutScroll:l,layoutRoot:u}=n;e.projection=new t(e.latestValues,n["data-framer-portal-id"]?void 0:$y(e.parent)),e.projection.setOptions({layoutId:i,layout:s,alwaysMeasureLayout:!!o||a&&$r(a),visualElement:e,animationType:typeof s=="string"?s:"both",initialPromotionConfig:r,layoutScroll:l,layoutRoot:u})}function $y(e){if(e)return e.options.allowProjection!==!1?e.projection:$y(e.parent)}function Qj({preloadedFeatures:e,createVisualElement:n,useRender:t,useVisualState:r,Component:i}){var s,o;e&&qj(e);function a(u,c){let d;const f={...S.useContext(uf),...u,layoutId:Zj(u)},{isStatic:p}=f,v=Hj(u),g=r(u,p);if(!p&&cf){Jj();const _=eT(f);d=_.MeasureLayout,v.visualElement=Gj(i,g,f,n,_.ProjectionNode)}return w.jsxs(bl.Provider,{value:v,children:[d&&v.visualElement?w.jsx(d,{visualElement:v.visualElement,...f}):null,t(i,u,Kj(g,v.visualElement,c),g,p,v.visualElement)]})}a.displayName=`motion.${typeof i=="string"?i:`create(${(o=(s=i.displayName)!==null&&s!==void 0?s:i.name)!==null&&o!==void 0?o:""})`}`;const l=S.forwardRef(a);return l[Wj]=i,l}function Zj({layoutId:e}){const n=S.useContext(af).id;return n&&e!==void 0?n+"-"+e:e}function Jj(e,n){S.useContext(Dy).strict}function eT(e){const{drag:n,layout:t}=di;if(!n&&!t)return{};const r={...n,...t};return{MeasureLayout:n!=null&&n.isEnabled(e)||t!=null&&t.isEnabled(e)?r.MeasureLayout:void 0,ProjectionNode:r.ProjectionNode}}const nT=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function gf(e){return typeof e!="string"||e.includes("-")?!1:!!(nT.indexOf(e)>-1||/[A-Z]/u.test(e))}function Dh(e){const n=[{},{}];return e==null||e.values.forEach((t,r)=>{n[0][r]=t.get(),n[1][r]=t.getVelocity()}),n}function vf(e,n,t,r){if(typeof n=="function"){const[i,s]=Dh(r);n=n(t!==void 0?t:e.custom,i,s)}if(typeof n=="string"&&(n=e.variants&&e.variants[n]),typeof n=="function"){const[i,s]=Dh(r);n=n(t!==void 0?t:e.custom,i,s)}return n}const jc=e=>Array.isArray(e),tT=e=>!!(e&&typeof e=="object"&&e.mix&&e.toValue),rT=e=>jc(e)?e[e.length-1]||0:e,Ie=e=>!!(e&&e.getVelocity);function Yo(e){const n=Ie(e)?e.get():e;return tT(n)?n.toValue():n}function iT({scrapeMotionValuesFromProps:e,createRenderState:n,onUpdate:t},r,i,s){const o={latestValues:sT(r,i,s,e),renderState:n()};return t&&(o.onMount=a=>t({props:r,current:a,...o}),o.onUpdate=a=>t(a)),o}const Oy=e=>(n,t)=>{const r=S.useContext(bl),i=S.useContext(wl),s=()=>iT(e,n,r,i);return t?s():lf(s)};function sT(e,n,t,r){const i={},s=r(e,{});for(const f in s)i[f]=Yo(s[f]);let{initial:o,animate:a}=e;const l=Sl(e),u=Fy(e);n&&u&&!l&&e.inherit!==!1&&(o===void 0&&(o=n.initial),a===void 0&&(a=n.animate));let c=t?t.initial===!1:!1;c=c||o===!1;const d=c?a:o;if(d&&typeof d!="boolean"&&!kl(d)){const f=Array.isArray(d)?d:[d];for(let p=0;p<f.length;p++){const v=vf(e,f[p]);if(v){const{transitionEnd:g,transition:_,...h}=v;for(const m in h){let y=h[m];if(Array.isArray(y)){const x=c?y.length-1:0;y=y[x]}y!==null&&(i[m]=y)}for(const m in g)i[m]=g[m]}}}return i}const xi=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],br=new Set(xi),By=e=>n=>typeof n=="string"&&n.startsWith(e),Uy=By("--"),oT=By("var(--"),yf=e=>oT(e)?aT.test(e.split("/*")[0].trim()):!1,aT=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,Hy=(e,n)=>n&&typeof e=="number"?n.transform(e):e,lt=(e,n,t)=>t>n?n:t<e?e:t,_i={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},Es={..._i,transform:e=>lt(0,1,e)},jo={..._i,default:1},Ys=e=>({test:n=>typeof n=="string"&&n.endsWith(e)&&n.split(" ").length===1,parse:parseFloat,transform:n=>`${n}${e}`}),mt=Ys("deg"),On=Ys("%"),Y=Ys("px"),lT=Ys("vh"),uT=Ys("vw"),Ih={...On,parse:e=>On.parse(e)/100,transform:e=>On.transform(e*100)},cT={borderWidth:Y,borderTopWidth:Y,borderRightWidth:Y,borderBottomWidth:Y,borderLeftWidth:Y,borderRadius:Y,radius:Y,borderTopLeftRadius:Y,borderTopRightRadius:Y,borderBottomRightRadius:Y,borderBottomLeftRadius:Y,width:Y,maxWidth:Y,height:Y,maxHeight:Y,top:Y,right:Y,bottom:Y,left:Y,padding:Y,paddingTop:Y,paddingRight:Y,paddingBottom:Y,paddingLeft:Y,margin:Y,marginTop:Y,marginRight:Y,marginBottom:Y,marginLeft:Y,backgroundPositionX:Y,backgroundPositionY:Y},dT={rotate:mt,rotateX:mt,rotateY:mt,rotateZ:mt,scale:jo,scaleX:jo,scaleY:jo,scaleZ:jo,skew:mt,skewX:mt,skewY:mt,distance:Y,translateX:Y,translateY:Y,translateZ:Y,x:Y,y:Y,z:Y,perspective:Y,transformPerspective:Y,opacity:Es,originX:Ih,originY:Ih,originZ:Y},Fh={..._i,transform:Math.round},xf={...cT,...dT,zIndex:Fh,size:Y,fillOpacity:Es,strokeOpacity:Es,numOctaves:Fh},fT={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},pT=xi.length;function hT(e,n,t){let r="",i=!0;for(let s=0;s<pT;s++){const o=xi[s],a=e[o];if(a===void 0)continue;let l=!0;if(typeof a=="number"?l=a===(o.startsWith("scale")?1:0):l=parseFloat(a)===0,!l||t){const u=Hy(a,xf[o]);if(!l){i=!1;const c=fT[o]||o;r+=`${c}(${u}) `}t&&(n[o]=u)}}return r=r.trim(),t?r=t(n,i?"":r):i&&(r="none"),r}function _f(e,n,t){const{style:r,vars:i,transformOrigin:s}=e;let o=!1,a=!1;for(const l in n){const u=n[l];if(br.has(l)){o=!0;continue}else if(Uy(l)){i[l]=u;continue}else{const c=Hy(u,xf[l]);l.startsWith("origin")?(a=!0,s[l]=c):r[l]=c}}if(n.transform||(o||t?r.transform=hT(n,e.transform,t):r.transform&&(r.transform="none")),a){const{originX:l="50%",originY:u="50%",originZ:c=0}=s;r.transformOrigin=`${l} ${u} ${c}`}}const mT={offset:"stroke-dashoffset",array:"stroke-dasharray"},gT={offset:"strokeDashoffset",array:"strokeDasharray"};function vT(e,n,t=1,r=0,i=!0){e.pathLength=1;const s=i?mT:gT;e[s.offset]=Y.transform(-r);const o=Y.transform(n),a=Y.transform(t);e[s.array]=`${o} ${a}`}function qh(e,n,t){return typeof e=="string"?e:Y.transform(n+t*e)}function yT(e,n,t){const r=qh(n,e.x,e.width),i=qh(t,e.y,e.height);return`${r} ${i}`}function wf(e,{attrX:n,attrY:t,attrScale:r,originX:i,originY:s,pathLength:o,pathSpacing:a=1,pathOffset:l=0,...u},c,d){if(_f(e,u,d),c){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:f,style:p,dimensions:v}=e;f.transform&&(v&&(p.transform=f.transform),delete f.transform),v&&(i!==void 0||s!==void 0||p.transform)&&(p.transformOrigin=yT(v,i!==void 0?i:.5,s!==void 0?s:.5)),n!==void 0&&(f.x=n),t!==void 0&&(f.y=t),r!==void 0&&(f.scale=r),o!==void 0&&vT(f,o,a,l,!1)}const bf=()=>({style:{},transform:{},transformOrigin:{},vars:{}}),Wy=()=>({...bf(),attrs:{}}),kf=e=>typeof e=="string"&&e.toLowerCase()==="svg";function Ky(e,{style:n,vars:t},r,i){Object.assign(e.style,n,i&&i.getProjectionStyles(r));for(const s in t)e.style.setProperty(s,t[s])}const Yy=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]);function Gy(e,n,t,r){Ky(e,n,void 0,r);for(const i in n.attrs)e.setAttribute(Yy.has(i)?i:hf(i),n.attrs[i])}const Da={};function xT(e){Object.assign(Da,e)}function Xy(e,{layout:n,layoutId:t}){return br.has(e)||e.startsWith("origin")||(n||t!==void 0)&&(!!Da[e]||e==="opacity")}function Sf(e,n,t){var r;const{style:i}=e,s={};for(const o in i)(Ie(i[o])||n.style&&Ie(n.style[o])||Xy(o,e)||((r=t==null?void 0:t.getValue(o))===null||r===void 0?void 0:r.liveStyle)!==void 0)&&(s[o]=i[o]);return s}function Qy(e,n,t){const r=Sf(e,n,t);for(const i in e)if(Ie(e[i])||Ie(n[i])){const s=xi.indexOf(i)!==-1?"attr"+i.charAt(0).toUpperCase()+i.substring(1):i;r[s]=e[i]}return r}function _T(e,n){try{n.dimensions=typeof e.getBBox=="function"?e.getBBox():e.getBoundingClientRect()}catch{n.dimensions={x:0,y:0,width:0,height:0}}}const Vh=["x","y","width","height","cx","cy","r"],wT={useVisualState:Oy({scrapeMotionValuesFromProps:Qy,createRenderState:Wy,onUpdate:({props:e,prevProps:n,current:t,renderState:r,latestValues:i})=>{if(!t)return;let s=!!e.drag;if(!s){for(const a in i)if(br.has(a)){s=!0;break}}if(!s)return;let o=!n;if(n)for(let a=0;a<Vh.length;a++){const l=Vh[a];e[l]!==n[l]&&(o=!0)}o&&ue.read(()=>{_T(t,r),ue.render(()=>{wf(r,i,kf(t.tagName),e.transformTemplate),Gy(t,r)})})}})},bT={useVisualState:Oy({scrapeMotionValuesFromProps:Sf,createRenderState:bf})};function Zy(e,n,t){for(const r in n)!Ie(n[r])&&!Xy(r,t)&&(e[r]=n[r])}function kT({transformTemplate:e},n){return S.useMemo(()=>{const t=bf();return _f(t,n,e),Object.assign({},t.vars,t.style)},[n])}function ST(e,n){const t=e.style||{},r={};return Zy(r,t,e),Object.assign(r,kT(e,n)),r}function CT(e,n){const t={},r=ST(e,n);return e.drag&&e.dragListener!==!1&&(t.draggable=!1,r.userSelect=r.WebkitUserSelect=r.WebkitTouchCallout="none",r.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(t.tabIndex=0),t.style=r,t}function PT(e,n,t,r){const i=S.useMemo(()=>{const s=Wy();return wf(s,n,kf(r),e.transformTemplate),{...s.attrs,style:{...s.style}}},[n]);if(e.style){const s={};Zy(s,e.style,e),i.style={...s,...i.style}}return i}function jT(e=!1){return(t,r,i,{latestValues:s},o)=>{const l=(gf(t)?PT:CT)(r,s,o,t),u=Oj(r,typeof t=="string",e),c=t!==S.Fragment?{...u,...l,ref:i}:{},{children:d}=r,f=S.useMemo(()=>Ie(d)?d.get():d,[d]);return S.createElement(t,{...c,children:f})}}function TT(e,n){return function(r,{forwardMotionProps:i}={forwardMotionProps:!1}){const o={...gf(r)?wT:bT,preloadedFeatures:e,useRender:jT(i),createVisualElement:n,Component:r};return Qj(o)}}function Jy(e,n){if(!Array.isArray(n))return!1;const t=n.length;if(t!==e.length)return!1;for(let r=0;r<t;r++)if(n[r]!==e[r])return!1;return!0}function Cl(e,n,t){const r=e.getProps();return vf(r,n,t!==void 0?t:r.custom,e)}const zT=df(()=>window.ScrollTimeline!==void 0);class ET{constructor(n){this.stop=()=>this.runAll("stop"),this.animations=n.filter(Boolean)}get finished(){return Promise.all(this.animations.map(n=>"finished"in n?n.finished:n))}getAll(n){return this.animations[0][n]}setAll(n,t){for(let r=0;r<this.animations.length;r++)this.animations[r][n]=t}attachTimeline(n,t){const r=this.animations.map(i=>{if(zT()&&i.attachTimeline)return i.attachTimeline(n);if(typeof t=="function")return t(i)});return()=>{r.forEach((i,s)=>{i&&i(),this.animations[s].stop()})}}get time(){return this.getAll("time")}set time(n){this.setAll("time",n)}get speed(){return this.getAll("speed")}set speed(n){this.setAll("speed",n)}get startTime(){return this.getAll("startTime")}get duration(){let n=0;for(let t=0;t<this.animations.length;t++)n=Math.max(n,this.animations[t].duration);return n}runAll(n){this.animations.forEach(t=>t[n]())}flatten(){this.runAll("flatten")}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}class AT extends ET{then(n,t){return Promise.all(this.animations).then(n).catch(t)}}function Cf(e,n){return e?e[n]||e.default||e:void 0}const Tc=2e4;function e1(e){let n=0;const t=50;let r=e.next(n);for(;!r.done&&n<Tc;)n+=t,r=e.next(n);return n>=Tc?1/0:n}function Pf(e){return typeof e=="function"}function $h(e,n){e.timeline=n,e.onfinish=null}const jf=e=>Array.isArray(e)&&typeof e[0]=="number",MT={linearEasing:void 0};function RT(e,n){const t=df(e);return()=>{var r;return(r=MT[n])!==null&&r!==void 0?r:t()}}const Ia=RT(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),n1=(e,n,t=10)=>{let r="";const i=Math.max(Math.round(n/t),2);for(let s=0;s<i;s++)r+=e(ci(0,i-1,s))+", ";return`linear(${r.substring(0,r.length-2)})`};function t1(e){return!!(typeof e=="function"&&Ia()||!e||typeof e=="string"&&(e in zc||Ia())||jf(e)||Array.isArray(e)&&e.every(t1))}const Vi=([e,n,t,r])=>`cubic-bezier(${e}, ${n}, ${t}, ${r})`,zc={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Vi([0,.65,.55,1]),circOut:Vi([.55,0,1,.45]),backIn:Vi([.31,.01,.66,-.59]),backOut:Vi([.33,1.53,.69,.99])};function r1(e,n){if(e)return typeof e=="function"&&Ia()?n1(e,n):jf(e)?Vi(e):Array.isArray(e)?e.map(t=>r1(t,n)||zc.easeOut):zc[e]}const Sn={x:!1,y:!1};function i1(){return Sn.x||Sn.y}function NT(e,n,t){var r;if(e instanceof Element)return[e];if(typeof e=="string"){let i=document;const s=(r=void 0)!==null&&r!==void 0?r:i.querySelectorAll(e);return s?Array.from(s):[]}return Array.from(e)}function s1(e,n){const t=NT(e),r=new AbortController,i={passive:!0,...n,signal:r.signal};return[t,i,()=>r.abort()]}function Oh(e){return n=>{n.pointerType==="touch"||i1()||e(n)}}function LT(e,n,t={}){const[r,i,s]=s1(e,t),o=Oh(a=>{const{target:l}=a,u=n(a);if(typeof u!="function"||!l)return;const c=Oh(d=>{u(d),l.removeEventListener("pointerleave",c)});l.addEventListener("pointerleave",c,i)});return r.forEach(a=>{a.addEventListener("pointerenter",o,i)}),s}const o1=(e,n)=>n?e===n?!0:o1(e,n.parentElement):!1,Tf=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,DT=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function IT(e){return DT.has(e.tagName)||e.tabIndex!==-1}const $i=new WeakSet;function Bh(e){return n=>{n.key==="Enter"&&e(n)}}function fu(e,n){e.dispatchEvent(new PointerEvent("pointer"+n,{isPrimary:!0,bubbles:!0}))}const FT=(e,n)=>{const t=e.currentTarget;if(!t)return;const r=Bh(()=>{if($i.has(t))return;fu(t,"down");const i=Bh(()=>{fu(t,"up")}),s=()=>fu(t,"cancel");t.addEventListener("keyup",i,n),t.addEventListener("blur",s,n)});t.addEventListener("keydown",r,n),t.addEventListener("blur",()=>t.removeEventListener("keydown",r),n)};function Uh(e){return Tf(e)&&!i1()}function qT(e,n,t={}){const[r,i,s]=s1(e,t),o=a=>{const l=a.currentTarget;if(!Uh(a)||$i.has(l))return;$i.add(l);const u=n(a),c=(p,v)=>{window.removeEventListener("pointerup",d),window.removeEventListener("pointercancel",f),!(!Uh(p)||!$i.has(l))&&($i.delete(l),typeof u=="function"&&u(p,{success:v}))},d=p=>{c(p,t.useGlobalTarget||o1(l,p.target))},f=p=>{c(p,!1)};window.addEventListener("pointerup",d,i),window.addEventListener("pointercancel",f,i)};return r.forEach(a=>{!IT(a)&&a.getAttribute("tabindex")===null&&(a.tabIndex=0),(t.useGlobalTarget?window:a).addEventListener("pointerdown",o,i),a.addEventListener("focus",u=>FT(u,i),i)}),s}function VT(e){return e==="x"||e==="y"?Sn[e]?null:(Sn[e]=!0,()=>{Sn[e]=!1}):Sn.x||Sn.y?null:(Sn.x=Sn.y=!0,()=>{Sn.x=Sn.y=!1})}const a1=new Set(["width","height","top","left","right","bottom",...xi]);let Go;function $T(){Go=void 0}const Bn={now:()=>(Go===void 0&&Bn.set(Te.isProcessing||Dj.useManualTiming?Te.timestamp:performance.now()),Go),set:e=>{Go=e,queueMicrotask($T)}};function zf(e,n){e.indexOf(n)===-1&&e.push(n)}function Ef(e,n){const t=e.indexOf(n);t>-1&&e.splice(t,1)}class Af{constructor(){this.subscriptions=[]}add(n){return zf(this.subscriptions,n),()=>Ef(this.subscriptions,n)}notify(n,t,r){const i=this.subscriptions.length;if(i)if(i===1)this.subscriptions[0](n,t,r);else for(let s=0;s<i;s++){const o=this.subscriptions[s];o&&o(n,t,r)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}function l1(e,n){return n?e*(1e3/n):0}const Hh=30,OT=e=>!isNaN(parseFloat(e));class BT{constructor(n,t={}){this.version="11.18.2",this.canTrackVelocity=null,this.events={},this.updateAndNotify=(r,i=!0)=>{const s=Bn.now();this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(r),this.current!==this.prev&&this.events.change&&this.events.change.notify(this.current),i&&this.events.renderRequest&&this.events.renderRequest.notify(this.current)},this.hasAnimated=!1,this.setCurrent(n),this.owner=t.owner}setCurrent(n){this.current=n,this.updatedAt=Bn.now(),this.canTrackVelocity===null&&n!==void 0&&(this.canTrackVelocity=OT(this.current))}setPrevFrameValue(n=this.current){this.prevFrameValue=n,this.prevUpdatedAt=this.updatedAt}onChange(n){return this.on("change",n)}on(n,t){this.events[n]||(this.events[n]=new Af);const r=this.events[n].add(t);return n==="change"?()=>{r(),ue.read(()=>{this.events.change.getSize()||this.stop()})}:r}clearListeners(){for(const n in this.events)this.events[n].clear()}attach(n,t){this.passiveEffect=n,this.stopPassiveEffect=t}set(n,t=!0){!t||!this.passiveEffect?this.updateAndNotify(n,t):this.passiveEffect(n,this.updateAndNotify)}setWithVelocity(n,t,r){this.set(t),this.prev=void 0,this.prevFrameValue=n,this.prevUpdatedAt=this.updatedAt-r}jump(n,t=!0){this.updateAndNotify(n),this.prev=n,this.prevUpdatedAt=this.prevFrameValue=void 0,t&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const n=Bn.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||n-this.updatedAt>Hh)return 0;const t=Math.min(this.updatedAt-this.prevUpdatedAt,Hh);return l1(parseFloat(this.current)-parseFloat(this.prevFrameValue),t)}start(n){return this.stop(),new Promise(t=>{this.hasAnimated=!0,this.animation=n(t),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function As(e,n){return new BT(e,n)}function UT(e,n,t){e.hasValue(n)?e.getValue(n).set(t):e.addValue(n,As(t))}function HT(e,n){const t=Cl(e,n);let{transitionEnd:r={},transition:i={},...s}=t||{};s={...s,...r};for(const o in s){const a=rT(s[o]);UT(e,o,a)}}function WT(e){return!!(Ie(e)&&e.add)}function Ec(e,n){const t=e.getValue("willChange");if(WT(t))return t.add(n)}function u1(e){return e.props[qy]}const c1=(e,n,t)=>(((1-3*t+3*n)*e+(3*t-6*n))*e+3*n)*e,KT=1e-7,YT=12;function GT(e,n,t,r,i){let s,o,a=0;do o=n+(t-n)/2,s=c1(o,r,i)-e,s>0?t=o:n=o;while(Math.abs(s)>KT&&++a<YT);return o}function Gs(e,n,t,r){if(e===n&&t===r)return an;const i=s=>GT(s,0,1,e,t);return s=>s===0||s===1?s:c1(i(s),n,r)}const d1=e=>n=>n<=.5?e(2*n)/2:(2-e(2*(1-n)))/2,f1=e=>n=>1-e(1-n),p1=Gs(.33,1.53,.69,.99),Mf=f1(p1),h1=d1(Mf),m1=e=>(e*=2)<1?.5*Mf(e):.5*(2-Math.pow(2,-10*(e-1))),Rf=e=>1-Math.sin(Math.acos(e)),g1=f1(Rf),v1=d1(Rf),y1=e=>/^0[^.\s]+$/u.test(e);function XT(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||y1(e):!0}const is=e=>Math.round(e*1e5)/1e5,Nf=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function QT(e){return e==null}const ZT=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,Lf=(e,n)=>t=>!!(typeof t=="string"&&ZT.test(t)&&t.startsWith(e)||n&&!QT(t)&&Object.prototype.hasOwnProperty.call(t,n)),x1=(e,n,t)=>r=>{if(typeof r!="string")return r;const[i,s,o,a]=r.match(Nf);return{[e]:parseFloat(i),[n]:parseFloat(s),[t]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},JT=e=>lt(0,255,e),pu={..._i,transform:e=>Math.round(JT(e))},nr={test:Lf("rgb","red"),parse:x1("red","green","blue"),transform:({red:e,green:n,blue:t,alpha:r=1})=>"rgba("+pu.transform(e)+", "+pu.transform(n)+", "+pu.transform(t)+", "+is(Es.transform(r))+")"};function ez(e){let n="",t="",r="",i="";return e.length>5?(n=e.substring(1,3),t=e.substring(3,5),r=e.substring(5,7),i=e.substring(7,9)):(n=e.substring(1,2),t=e.substring(2,3),r=e.substring(3,4),i=e.substring(4,5),n+=n,t+=t,r+=r,i+=i),{red:parseInt(n,16),green:parseInt(t,16),blue:parseInt(r,16),alpha:i?parseInt(i,16)/255:1}}const Ac={test:Lf("#"),parse:ez,transform:nr.transform},Or={test:Lf("hsl","hue"),parse:x1("hue","saturation","lightness"),transform:({hue:e,saturation:n,lightness:t,alpha:r=1})=>"hsla("+Math.round(e)+", "+On.transform(is(n))+", "+On.transform(is(t))+", "+is(Es.transform(r))+")"},Le={test:e=>nr.test(e)||Ac.test(e)||Or.test(e),parse:e=>nr.test(e)?nr.parse(e):Or.test(e)?Or.parse(e):Ac.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?nr.transform(e):Or.transform(e)},nz=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function tz(e){var n,t;return isNaN(e)&&typeof e=="string"&&(((n=e.match(Nf))===null||n===void 0?void 0:n.length)||0)+(((t=e.match(nz))===null||t===void 0?void 0:t.length)||0)>0}const _1="number",w1="color",rz="var",iz="var(",Wh="${}",sz=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function Ms(e){const n=e.toString(),t=[],r={color:[],number:[],var:[]},i=[];let s=0;const a=n.replace(sz,l=>(Le.test(l)?(r.color.push(s),i.push(w1),t.push(Le.parse(l))):l.startsWith(iz)?(r.var.push(s),i.push(rz),t.push(l)):(r.number.push(s),i.push(_1),t.push(parseFloat(l))),++s,Wh)).split(Wh);return{values:t,split:a,indexes:r,types:i}}function b1(e){return Ms(e).values}function k1(e){const{split:n,types:t}=Ms(e),r=n.length;return i=>{let s="";for(let o=0;o<r;o++)if(s+=n[o],i[o]!==void 0){const a=t[o];a===_1?s+=is(i[o]):a===w1?s+=Le.transform(i[o]):s+=i[o]}return s}}const oz=e=>typeof e=="number"?0:e;function az(e){const n=b1(e);return k1(e)(n.map(oz))}const Ft={test:tz,parse:b1,createTransformer:k1,getAnimatableNone:az},lz=new Set(["brightness","contrast","saturate","opacity"]);function uz(e){const[n,t]=e.slice(0,-1).split("(");if(n==="drop-shadow")return e;const[r]=t.match(Nf)||[];if(!r)return e;const i=t.replace(r,"");let s=lz.has(n)?1:0;return r!==t&&(s*=100),n+"("+s+i+")"}const cz=/\b([a-z-]*)\(.*?\)/gu,Mc={...Ft,getAnimatableNone:e=>{const n=e.match(cz);return n?n.map(uz).join(" "):e}},dz={...xf,color:Le,backgroundColor:Le,outlineColor:Le,fill:Le,stroke:Le,borderColor:Le,borderTopColor:Le,borderRightColor:Le,borderBottomColor:Le,borderLeftColor:Le,filter:Mc,WebkitFilter:Mc},Df=e=>dz[e];function S1(e,n){let t=Df(e);return t!==Mc&&(t=Ft),t.getAnimatableNone?t.getAnimatableNone(n):void 0}const fz=new Set(["auto","none","0"]);function pz(e,n,t){let r=0,i;for(;r<e.length&&!i;){const s=e[r];typeof s=="string"&&!fz.has(s)&&Ms(s).values.length&&(i=e[r]),r++}if(i&&t)for(const s of n)e[s]=S1(t,i)}const Kh=e=>e===_i||e===Y,Yh=(e,n)=>parseFloat(e.split(", ")[n]),Gh=(e,n)=>(t,{transform:r})=>{if(r==="none"||!r)return 0;const i=r.match(/^matrix3d\((.+)\)$/u);if(i)return Yh(i[1],n);{const s=r.match(/^matrix\((.+)\)$/u);return s?Yh(s[1],e):0}},hz=new Set(["x","y","z"]),mz=xi.filter(e=>!hz.has(e));function gz(e){const n=[];return mz.forEach(t=>{const r=e.getValue(t);r!==void 0&&(n.push([t,r.get()]),r.set(t.startsWith("scale")?1:0))}),n}const fi={width:({x:e},{paddingLeft:n="0",paddingRight:t="0"})=>e.max-e.min-parseFloat(n)-parseFloat(t),height:({y:e},{paddingTop:n="0",paddingBottom:t="0"})=>e.max-e.min-parseFloat(n)-parseFloat(t),top:(e,{top:n})=>parseFloat(n),left:(e,{left:n})=>parseFloat(n),bottom:({y:e},{top:n})=>parseFloat(n)+(e.max-e.min),right:({x:e},{left:n})=>parseFloat(n)+(e.max-e.min),x:Gh(4,13),y:Gh(5,14)};fi.translateX=fi.x;fi.translateY=fi.y;const ar=new Set;let Rc=!1,Nc=!1;function C1(){if(Nc){const e=Array.from(ar).filter(r=>r.needsMeasurement),n=new Set(e.map(r=>r.element)),t=new Map;n.forEach(r=>{const i=gz(r);i.length&&(t.set(r,i),r.render())}),e.forEach(r=>r.measureInitialState()),n.forEach(r=>{r.render();const i=t.get(r);i&&i.forEach(([s,o])=>{var a;(a=r.getValue(s))===null||a===void 0||a.set(o)})}),e.forEach(r=>r.measureEndState()),e.forEach(r=>{r.suspendedScrollY!==void 0&&window.scrollTo(0,r.suspendedScrollY)})}Nc=!1,Rc=!1,ar.forEach(e=>e.complete()),ar.clear()}function P1(){ar.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(Nc=!0)})}function vz(){P1(),C1()}class If{constructor(n,t,r,i,s,o=!1){this.isComplete=!1,this.isAsync=!1,this.needsMeasurement=!1,this.isScheduled=!1,this.unresolvedKeyframes=[...n],this.onComplete=t,this.name=r,this.motionValue=i,this.element=s,this.isAsync=o}scheduleResolve(){this.isScheduled=!0,this.isAsync?(ar.add(this),Rc||(Rc=!0,ue.read(P1),ue.resolveKeyframes(C1))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:n,name:t,element:r,motionValue:i}=this;for(let s=0;s<n.length;s++)if(n[s]===null)if(s===0){const o=i==null?void 0:i.get(),a=n[n.length-1];if(o!==void 0)n[0]=o;else if(r&&t){const l=r.readValue(t,a);l!=null&&(n[0]=l)}n[0]===void 0&&(n[0]=a),i&&o===void 0&&i.set(n[0])}else n[s]=n[s-1]}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(){this.isComplete=!0,this.onComplete(this.unresolvedKeyframes,this.finalKeyframe),ar.delete(this)}cancel(){this.isComplete||(this.isScheduled=!1,ar.delete(this))}resume(){this.isComplete||this.scheduleResolve()}}const j1=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),yz=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function xz(e){const n=yz.exec(e);if(!n)return[,];const[,t,r,i]=n;return[`--${t??r}`,i]}function T1(e,n,t=1){const[r,i]=xz(e);if(!r)return;const s=window.getComputedStyle(n).getPropertyValue(r);if(s){const o=s.trim();return j1(o)?parseFloat(o):o}return yf(i)?T1(i,n,t+1):i}const z1=e=>n=>n.test(e),_z={test:e=>e==="auto",parse:e=>e},E1=[_i,Y,On,mt,uT,lT,_z],Xh=e=>E1.find(z1(e));class A1 extends If{constructor(n,t,r,i,s){super(n,t,r,i,s,!0)}readKeyframes(){const{unresolvedKeyframes:n,element:t,name:r}=this;if(!t||!t.current)return;super.readKeyframes();for(let l=0;l<n.length;l++){let u=n[l];if(typeof u=="string"&&(u=u.trim(),yf(u))){const c=T1(u,t.current);c!==void 0&&(n[l]=c),l===n.length-1&&(this.finalKeyframe=u)}}if(this.resolveNoneKeyframes(),!a1.has(r)||n.length!==2)return;const[i,s]=n,o=Xh(i),a=Xh(s);if(o!==a)if(Kh(o)&&Kh(a))for(let l=0;l<n.length;l++){const u=n[l];typeof u=="string"&&(n[l]=parseFloat(u))}else this.needsMeasurement=!0}resolveNoneKeyframes(){const{unresolvedKeyframes:n,name:t}=this,r=[];for(let i=0;i<n.length;i++)XT(n[i])&&r.push(i);r.length&&pz(n,r,t)}measureInitialState(){const{element:n,unresolvedKeyframes:t,name:r}=this;if(!n||!n.current)return;r==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=fi[r](n.measureViewportBox(),window.getComputedStyle(n.current)),t[0]=this.measuredOrigin;const i=t[t.length-1];i!==void 0&&n.getValue(r,i).jump(i,!1)}measureEndState(){var n;const{element:t,name:r,unresolvedKeyframes:i}=this;if(!t||!t.current)return;const s=t.getValue(r);s&&s.jump(this.measuredOrigin,!1);const o=i.length-1,a=i[o];i[o]=fi[r](t.measureViewportBox(),window.getComputedStyle(t.current)),a!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=a),!((n=this.removedTransforms)===null||n===void 0)&&n.length&&this.removedTransforms.forEach(([l,u])=>{t.getValue(l).set(u)}),this.resolveNoneKeyframes()}}const Qh=(e,n)=>n==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&(Ft.test(e)||e==="0")&&!e.startsWith("url("));function wz(e){const n=e[0];if(e.length===1)return!0;for(let t=0;t<e.length;t++)if(e[t]!==n)return!0}function bz(e,n,t,r){const i=e[0];if(i===null)return!1;if(n==="display"||n==="visibility")return!0;const s=e[e.length-1],o=Qh(i,n),a=Qh(s,n);return!o||!a?!1:wz(e)||(t==="spring"||Pf(t))&&r}const kz=e=>e!==null;function Pl(e,{repeat:n,repeatType:t="loop"},r){const i=e.filter(kz),s=n&&t!=="loop"&&n%2===1?0:i.length-1;return!s||r===void 0?i[s]:r}const Sz=40;class M1{constructor({autoplay:n=!0,delay:t=0,type:r="keyframes",repeat:i=0,repeatDelay:s=0,repeatType:o="loop",...a}){this.isStopped=!1,this.hasAttemptedResolve=!1,this.createdAt=Bn.now(),this.options={autoplay:n,delay:t,type:r,repeat:i,repeatDelay:s,repeatType:o,...a},this.updateFinishedPromise()}calcStartTime(){return this.resolvedAt?this.resolvedAt-this.createdAt>Sz?this.resolvedAt:this.createdAt:this.createdAt}get resolved(){return!this._resolved&&!this.hasAttemptedResolve&&vz(),this._resolved}onKeyframesResolved(n,t){this.resolvedAt=Bn.now(),this.hasAttemptedResolve=!0;const{name:r,type:i,velocity:s,delay:o,onComplete:a,onUpdate:l,isGenerator:u}=this.options;if(!u&&!bz(n,r,i,s))if(o)this.options.duration=0;else{l&&l(Pl(n,this.options,t)),a&&a(),this.resolveFinishedPromise();return}const c=this.initPlayback(n,t);c!==!1&&(this._resolved={keyframes:n,finalKeyframe:t,...c},this.onPostResolved())}onPostResolved(){}then(n,t){return this.currentFinishedPromise.then(n,t)}flatten(){this.options.type="keyframes",this.options.ease="linear"}updateFinishedPromise(){this.currentFinishedPromise=new Promise(n=>{this.resolveFinishedPromise=n})}}const fe=(e,n,t)=>e+(n-e)*t;function hu(e,n,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?e+(n-e)*6*t:t<1/2?n:t<2/3?e+(n-e)*(2/3-t)*6:e}function Cz({hue:e,saturation:n,lightness:t,alpha:r}){e/=360,n/=100,t/=100;let i=0,s=0,o=0;if(!n)i=s=o=t;else{const a=t<.5?t*(1+n):t+n-t*n,l=2*t-a;i=hu(l,a,e+1/3),s=hu(l,a,e),o=hu(l,a,e-1/3)}return{red:Math.round(i*255),green:Math.round(s*255),blue:Math.round(o*255),alpha:r}}function Fa(e,n){return t=>t>0?n:e}const mu=(e,n,t)=>{const r=e*e,i=t*(n*n-r)+r;return i<0?0:Math.sqrt(i)},Pz=[Ac,nr,Or],jz=e=>Pz.find(n=>n.test(e));function Zh(e){const n=jz(e);if(!n)return!1;let t=n.parse(e);return n===Or&&(t=Cz(t)),t}const Jh=(e,n)=>{const t=Zh(e),r=Zh(n);if(!t||!r)return Fa(e,n);const i={...t};return s=>(i.red=mu(t.red,r.red,s),i.green=mu(t.green,r.green,s),i.blue=mu(t.blue,r.blue,s),i.alpha=fe(t.alpha,r.alpha,s),nr.transform(i))},Tz=(e,n)=>t=>n(e(t)),Xs=(...e)=>e.reduce(Tz),Lc=new Set(["none","hidden"]);function zz(e,n){return Lc.has(e)?t=>t<=0?e:n:t=>t>=1?n:e}function Ez(e,n){return t=>fe(e,n,t)}function Ff(e){return typeof e=="number"?Ez:typeof e=="string"?yf(e)?Fa:Le.test(e)?Jh:Rz:Array.isArray(e)?R1:typeof e=="object"?Le.test(e)?Jh:Az:Fa}function R1(e,n){const t=[...e],r=t.length,i=e.map((s,o)=>Ff(s)(s,n[o]));return s=>{for(let o=0;o<r;o++)t[o]=i[o](s);return t}}function Az(e,n){const t={...e,...n},r={};for(const i in t)e[i]!==void 0&&n[i]!==void 0&&(r[i]=Ff(e[i])(e[i],n[i]));return i=>{for(const s in r)t[s]=r[s](i);return t}}function Mz(e,n){var t;const r=[],i={color:0,var:0,number:0};for(let s=0;s<n.values.length;s++){const o=n.types[s],a=e.indexes[o][i[o]],l=(t=e.values[a])!==null&&t!==void 0?t:0;r[s]=l,i[o]++}return r}const Rz=(e,n)=>{const t=Ft.createTransformer(n),r=Ms(e),i=Ms(n);return r.indexes.var.length===i.indexes.var.length&&r.indexes.color.length===i.indexes.color.length&&r.indexes.number.length>=i.indexes.number.length?Lc.has(e)&&!i.values.length||Lc.has(n)&&!r.values.length?zz(e,n):Xs(R1(Mz(r,i),i.values),t):Fa(e,n)};function N1(e,n,t){return typeof e=="number"&&typeof n=="number"&&typeof t=="number"?fe(e,n,t):Ff(e)(e,n)}const Nz=5;function L1(e,n,t){const r=Math.max(n-Nz,0);return l1(t-e(r),n-r)}const me={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1},gu=.001;function Lz({duration:e=me.duration,bounce:n=me.bounce,velocity:t=me.velocity,mass:r=me.mass}){let i,s,o=1-n;o=lt(me.minDamping,me.maxDamping,o),e=lt(me.minDuration,me.maxDuration,tt(e)),o<1?(i=u=>{const c=u*o,d=c*e,f=c-t,p=Dc(u,o),v=Math.exp(-d);return gu-f/p*v},s=u=>{const d=u*o*e,f=d*t+t,p=Math.pow(o,2)*Math.pow(u,2)*e,v=Math.exp(-d),g=Dc(Math.pow(u,2),o);return(-i(u)+gu>0?-1:1)*((f-p)*v)/g}):(i=u=>{const c=Math.exp(-u*e),d=(u-t)*e+1;return-gu+c*d},s=u=>{const c=Math.exp(-u*e),d=(t-u)*(e*e);return c*d});const a=5/e,l=Iz(i,s,a);if(e=nt(e),isNaN(l))return{stiffness:me.stiffness,damping:me.damping,duration:e};{const u=Math.pow(l,2)*r;return{stiffness:u,damping:o*2*Math.sqrt(r*u),duration:e}}}const Dz=12;function Iz(e,n,t){let r=t;for(let i=1;i<Dz;i++)r=r-e(r)/n(r);return r}function Dc(e,n){return e*Math.sqrt(1-n*n)}const Fz=["duration","bounce"],qz=["stiffness","damping","mass"];function em(e,n){return n.some(t=>e[t]!==void 0)}function Vz(e){let n={velocity:me.velocity,stiffness:me.stiffness,damping:me.damping,mass:me.mass,isResolvedFromDuration:!1,...e};if(!em(e,qz)&&em(e,Fz))if(e.visualDuration){const t=e.visualDuration,r=2*Math.PI/(t*1.2),i=r*r,s=2*lt(.05,1,1-(e.bounce||0))*Math.sqrt(i);n={...n,mass:me.mass,stiffness:i,damping:s}}else{const t=Lz(e);n={...n,...t,mass:me.mass},n.isResolvedFromDuration=!0}return n}function D1(e=me.visualDuration,n=me.bounce){const t=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:n}:e;let{restSpeed:r,restDelta:i}=t;const s=t.keyframes[0],o=t.keyframes[t.keyframes.length-1],a={done:!1,value:s},{stiffness:l,damping:u,mass:c,duration:d,velocity:f,isResolvedFromDuration:p}=Vz({...t,velocity:-tt(t.velocity||0)}),v=f||0,g=u/(2*Math.sqrt(l*c)),_=o-s,h=tt(Math.sqrt(l/c)),m=Math.abs(_)<5;r||(r=m?me.restSpeed.granular:me.restSpeed.default),i||(i=m?me.restDelta.granular:me.restDelta.default);let y;if(g<1){const k=Dc(h,g);y=C=>{const T=Math.exp(-g*h*C);return o-T*((v+g*h*_)/k*Math.sin(k*C)+_*Math.cos(k*C))}}else if(g===1)y=k=>o-Math.exp(-h*k)*(_+(v+h*_)*k);else{const k=h*Math.sqrt(g*g-1);y=C=>{const T=Math.exp(-g*h*C),j=Math.min(k*C,300);return o-T*((v+g*h*_)*Math.sinh(j)+k*_*Math.cosh(j))/k}}const x={calculatedDuration:p&&d||null,next:k=>{const C=y(k);if(p)a.done=k>=d;else{let T=0;g<1&&(T=k===0?nt(v):L1(y,k,C));const j=Math.abs(T)<=r,F=Math.abs(o-C)<=i;a.done=j&&F}return a.value=a.done?o:C,a},toString:()=>{const k=Math.min(e1(x),Tc),C=n1(T=>x.next(k*T).value,k,30);return k+"ms "+C}};return x}function nm({keyframes:e,velocity:n=0,power:t=.8,timeConstant:r=325,bounceDamping:i=10,bounceStiffness:s=500,modifyTarget:o,min:a,max:l,restDelta:u=.5,restSpeed:c}){const d=e[0],f={done:!1,value:d},p=j=>a!==void 0&&j<a||l!==void 0&&j>l,v=j=>a===void 0?l:l===void 0||Math.abs(a-j)<Math.abs(l-j)?a:l;let g=t*n;const _=d+g,h=o===void 0?_:o(_);h!==_&&(g=h-d);const m=j=>-g*Math.exp(-j/r),y=j=>h+m(j),x=j=>{const F=m(j),I=y(j);f.done=Math.abs(F)<=u,f.value=f.done?h:I};let k,C;const T=j=>{p(f.value)&&(k=j,C=D1({keyframes:[f.value,v(f.value)],velocity:L1(y,j,f.value),damping:i,stiffness:s,restDelta:u,restSpeed:c}))};return T(0),{calculatedDuration:null,next:j=>{let F=!1;return!C&&k===void 0&&(F=!0,x(j),T(j)),k!==void 0&&j>=k?C.next(j-k):(!F&&x(j),f)}}}const $z=Gs(.42,0,1,1),Oz=Gs(0,0,.58,1),I1=Gs(.42,0,.58,1),Bz=e=>Array.isArray(e)&&typeof e[0]!="number",Uz={linear:an,easeIn:$z,easeInOut:I1,easeOut:Oz,circIn:Rf,circInOut:v1,circOut:g1,backIn:Mf,backInOut:h1,backOut:p1,anticipate:m1},tm=e=>{if(jf(e)){Ny(e.length===4);const[n,t,r,i]=e;return Gs(n,t,r,i)}else if(typeof e=="string")return Uz[e];return e};function Hz(e,n,t){const r=[],i=t||N1,s=e.length-1;for(let o=0;o<s;o++){let a=i(e[o],e[o+1]);if(n){const l=Array.isArray(n)?n[o]||an:n;a=Xs(l,a)}r.push(a)}return r}function Wz(e,n,{clamp:t=!0,ease:r,mixer:i}={}){const s=e.length;if(Ny(s===n.length),s===1)return()=>n[0];if(s===2&&n[0]===n[1])return()=>n[1];const o=e[0]===e[1];e[0]>e[s-1]&&(e=[...e].reverse(),n=[...n].reverse());const a=Hz(n,r,i),l=a.length,u=c=>{if(o&&c<e[0])return n[0];let d=0;if(l>1)for(;d<e.length-2&&!(c<e[d+1]);d++);const f=ci(e[d],e[d+1],c);return a[d](f)};return t?c=>u(lt(e[0],e[s-1],c)):u}function Kz(e,n){const t=e[e.length-1];for(let r=1;r<=n;r++){const i=ci(0,n,r);e.push(fe(t,1,i))}}function Yz(e){const n=[0];return Kz(n,e.length-1),n}function Gz(e,n){return e.map(t=>t*n)}function Xz(e,n){return e.map(()=>n||I1).splice(0,e.length-1)}function qa({duration:e=300,keyframes:n,times:t,ease:r="easeInOut"}){const i=Bz(r)?r.map(tm):tm(r),s={done:!1,value:n[0]},o=Gz(t&&t.length===n.length?t:Yz(n),e),a=Wz(o,n,{ease:Array.isArray(i)?i:Xz(n,i)});return{calculatedDuration:e,next:l=>(s.value=a(l),s.done=l>=e,s)}}const Qz=e=>{const n=({timestamp:t})=>e(t);return{start:()=>ue.update(n,!0),stop:()=>It(n),now:()=>Te.isProcessing?Te.timestamp:Bn.now()}},Zz={decay:nm,inertia:nm,tween:qa,keyframes:qa,spring:D1},Jz=e=>e/100;class qf extends M1{constructor(n){super(n),this.holdTime=null,this.cancelTime=null,this.currentTime=0,this.playbackSpeed=1,this.pendingPlayState="running",this.startTime=null,this.state="idle",this.stop=()=>{if(this.resolver.cancel(),this.isStopped=!0,this.state==="idle")return;this.teardown();const{onStop:l}=this.options;l&&l()};const{name:t,motionValue:r,element:i,keyframes:s}=this.options,o=(i==null?void 0:i.KeyframeResolver)||If,a=(l,u)=>this.onKeyframesResolved(l,u);this.resolver=new o(s,a,t,r,i),this.resolver.scheduleResolve()}flatten(){super.flatten(),this._resolved&&Object.assign(this._resolved,this.initPlayback(this._resolved.keyframes))}initPlayback(n){const{type:t="keyframes",repeat:r=0,repeatDelay:i=0,repeatType:s,velocity:o=0}=this.options,a=Pf(t)?t:Zz[t]||qa;let l,u;a!==qa&&typeof n[0]!="number"&&(l=Xs(Jz,N1(n[0],n[1])),n=[0,100]);const c=a({...this.options,keyframes:n});s==="mirror"&&(u=a({...this.options,keyframes:[...n].reverse(),velocity:-o})),c.calculatedDuration===null&&(c.calculatedDuration=e1(c));const{calculatedDuration:d}=c,f=d+i,p=f*(r+1)-i;return{generator:c,mirroredGenerator:u,mapPercentToKeyframes:l,calculatedDuration:d,resolvedDuration:f,totalDuration:p}}onPostResolved(){const{autoplay:n=!0}=this.options;this.play(),this.pendingPlayState==="paused"||!n?this.pause():this.state=this.pendingPlayState}tick(n,t=!1){const{resolved:r}=this;if(!r){const{keyframes:j}=this.options;return{done:!0,value:j[j.length-1]}}const{finalKeyframe:i,generator:s,mirroredGenerator:o,mapPercentToKeyframes:a,keyframes:l,calculatedDuration:u,totalDuration:c,resolvedDuration:d}=r;if(this.startTime===null)return s.next(0);const{delay:f,repeat:p,repeatType:v,repeatDelay:g,onUpdate:_}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,n):this.speed<0&&(this.startTime=Math.min(n-c/this.speed,this.startTime)),t?this.currentTime=n:this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=Math.round(n-this.startTime)*this.speed;const h=this.currentTime-f*(this.speed>=0?1:-1),m=this.speed>=0?h<0:h>c;this.currentTime=Math.max(h,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=c);let y=this.currentTime,x=s;if(p){const j=Math.min(this.currentTime,c)/d;let F=Math.floor(j),I=j%1;!I&&j>=1&&(I=1),I===1&&F--,F=Math.min(F,p+1),!!(F%2)&&(v==="reverse"?(I=1-I,g&&(I-=g/d)):v==="mirror"&&(x=o)),y=lt(0,1,I)*d}const k=m?{done:!1,value:l[0]}:x.next(y);a&&(k.value=a(k.value));let{done:C}=k;!m&&u!==null&&(C=this.speed>=0?this.currentTime>=c:this.currentTime<=0);const T=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&C);return T&&i!==void 0&&(k.value=Pl(l,this.options,i)),_&&_(k.value),T&&this.finish(),k}get duration(){const{resolved:n}=this;return n?tt(n.calculatedDuration):0}get time(){return tt(this.currentTime)}set time(n){n=nt(n),this.currentTime=n,this.holdTime!==null||this.speed===0?this.holdTime=n:this.driver&&(this.startTime=this.driver.now()-n/this.speed)}get speed(){return this.playbackSpeed}set speed(n){const t=this.playbackSpeed!==n;this.playbackSpeed=n,t&&(this.time=tt(this.currentTime))}play(){if(this.resolver.isScheduled||this.resolver.resume(),!this._resolved){this.pendingPlayState="running";return}if(this.isStopped)return;const{driver:n=Qz,onPlay:t,startTime:r}=this.options;this.driver||(this.driver=n(s=>this.tick(s))),t&&t();const i=this.driver.now();this.holdTime!==null?this.startTime=i-this.holdTime:this.startTime?this.state==="finished"&&(this.startTime=i):this.startTime=r??this.calcStartTime(),this.state==="finished"&&this.updateFinishedPromise(),this.cancelTime=this.startTime,this.holdTime=null,this.state="running",this.driver.start()}pause(){var n;if(!this._resolved){this.pendingPlayState="paused";return}this.state="paused",this.holdTime=(n=this.currentTime)!==null&&n!==void 0?n:0}complete(){this.state!=="running"&&this.play(),this.pendingPlayState=this.state="finished",this.holdTime=null}finish(){this.teardown(),this.state="finished";const{onComplete:n}=this.options;n&&n()}cancel(){this.cancelTime!==null&&this.tick(this.cancelTime),this.teardown(),this.updateFinishedPromise()}teardown(){this.state="idle",this.stopDriver(),this.resolveFinishedPromise(),this.updateFinishedPromise(),this.startTime=this.cancelTime=null,this.resolver.cancel()}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(n){return this.startTime=0,this.tick(n,!0)}}const e3=new Set(["opacity","clipPath","filter","transform"]);function n3(e,n,t,{delay:r=0,duration:i=300,repeat:s=0,repeatType:o="loop",ease:a="easeInOut",times:l}={}){const u={[n]:t};l&&(u.offset=l);const c=r1(a,i);return Array.isArray(c)&&(u.easing=c),e.animate(u,{delay:r,duration:i,easing:Array.isArray(c)?"linear":c,fill:"both",iterations:s+1,direction:o==="reverse"?"alternate":"normal"})}const t3=df(()=>Object.hasOwnProperty.call(Element.prototype,"animate")),Va=10,r3=2e4;function i3(e){return Pf(e.type)||e.type==="spring"||!t1(e.ease)}function s3(e,n){const t=new qf({...n,keyframes:e,repeat:0,delay:0,isGenerator:!0});let r={done:!1,value:e[0]};const i=[];let s=0;for(;!r.done&&s<r3;)r=t.sample(s),i.push(r.value),s+=Va;return{times:void 0,keyframes:i,duration:s-Va,ease:"linear"}}const F1={anticipate:m1,backInOut:h1,circInOut:v1};function o3(e){return e in F1}class rm extends M1{constructor(n){super(n);const{name:t,motionValue:r,element:i,keyframes:s}=this.options;this.resolver=new A1(s,(o,a)=>this.onKeyframesResolved(o,a),t,r,i),this.resolver.scheduleResolve()}initPlayback(n,t){let{duration:r=300,times:i,ease:s,type:o,motionValue:a,name:l,startTime:u}=this.options;if(!a.owner||!a.owner.current)return!1;if(typeof s=="string"&&Ia()&&o3(s)&&(s=F1[s]),i3(this.options)){const{onComplete:d,onUpdate:f,motionValue:p,element:v,...g}=this.options,_=s3(n,g);n=_.keyframes,n.length===1&&(n[1]=n[0]),r=_.duration,i=_.times,s=_.ease,o="keyframes"}const c=n3(a.owner.current,l,n,{...this.options,duration:r,times:i,ease:s});return c.startTime=u??this.calcStartTime(),this.pendingTimeline?($h(c,this.pendingTimeline),this.pendingTimeline=void 0):c.onfinish=()=>{const{onComplete:d}=this.options;a.set(Pl(n,this.options,t)),d&&d(),this.cancel(),this.resolveFinishedPromise()},{animation:c,duration:r,times:i,type:o,ease:s,keyframes:n}}get duration(){const{resolved:n}=this;if(!n)return 0;const{duration:t}=n;return tt(t)}get time(){const{resolved:n}=this;if(!n)return 0;const{animation:t}=n;return tt(t.currentTime||0)}set time(n){const{resolved:t}=this;if(!t)return;const{animation:r}=t;r.currentTime=nt(n)}get speed(){const{resolved:n}=this;if(!n)return 1;const{animation:t}=n;return t.playbackRate}set speed(n){const{resolved:t}=this;if(!t)return;const{animation:r}=t;r.playbackRate=n}get state(){const{resolved:n}=this;if(!n)return"idle";const{animation:t}=n;return t.playState}get startTime(){const{resolved:n}=this;if(!n)return null;const{animation:t}=n;return t.startTime}attachTimeline(n){if(!this._resolved)this.pendingTimeline=n;else{const{resolved:t}=this;if(!t)return an;const{animation:r}=t;$h(r,n)}return an}play(){if(this.isStopped)return;const{resolved:n}=this;if(!n)return;const{animation:t}=n;t.playState==="finished"&&this.updateFinishedPromise(),t.play()}pause(){const{resolved:n}=this;if(!n)return;const{animation:t}=n;t.pause()}stop(){if(this.resolver.cancel(),this.isStopped=!0,this.state==="idle")return;this.resolveFinishedPromise(),this.updateFinishedPromise();const{resolved:n}=this;if(!n)return;const{animation:t,keyframes:r,duration:i,type:s,ease:o,times:a}=n;if(t.playState==="idle"||t.playState==="finished")return;if(this.time){const{motionValue:u,onUpdate:c,onComplete:d,element:f,...p}=this.options,v=new qf({...p,keyframes:r,duration:i,type:s,ease:o,times:a,isGenerator:!0}),g=nt(this.time);u.setWithVelocity(v.sample(g-Va).value,v.sample(g).value,Va)}const{onStop:l}=this.options;l&&l(),this.cancel()}complete(){const{resolved:n}=this;n&&n.animation.finish()}cancel(){const{resolved:n}=this;n&&n.animation.cancel()}static supports(n){const{motionValue:t,name:r,repeatDelay:i,repeatType:s,damping:o,type:a}=n;if(!t||!t.owner||!(t.owner.current instanceof HTMLElement))return!1;const{onUpdate:l,transformTemplate:u}=t.owner.getProps();return t3()&&r&&e3.has(r)&&!l&&!u&&!i&&s!=="mirror"&&o!==0&&a!=="inertia"}}const a3={type:"spring",stiffness:500,damping:25,restSpeed:10},l3=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),u3={type:"keyframes",duration:.8},c3={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},d3=(e,{keyframes:n})=>n.length>2?u3:br.has(e)?e.startsWith("scale")?l3(n[1]):a3:c3;function f3({when:e,delay:n,delayChildren:t,staggerChildren:r,staggerDirection:i,repeat:s,repeatType:o,repeatDelay:a,from:l,elapsed:u,...c}){return!!Object.keys(c).length}const Vf=(e,n,t,r={},i,s)=>o=>{const a=Cf(r,e)||{},l=a.delay||r.delay||0;let{elapsed:u=0}=r;u=u-nt(l);let c={keyframes:Array.isArray(t)?t:[null,t],ease:"easeOut",velocity:n.getVelocity(),...a,delay:-u,onUpdate:f=>{n.set(f),a.onUpdate&&a.onUpdate(f)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:e,motionValue:n,element:s?void 0:i};f3(a)||(c={...c,...d3(e,c)}),c.duration&&(c.duration=nt(c.duration)),c.repeatDelay&&(c.repeatDelay=nt(c.repeatDelay)),c.from!==void 0&&(c.keyframes[0]=c.from);let d=!1;if((c.type===!1||c.duration===0&&!c.repeatDelay)&&(c.duration=0,c.delay===0&&(d=!0)),d&&!s&&n.get()!==void 0){const f=Pl(c.keyframes,a);if(f!==void 0)return ue.update(()=>{c.onUpdate(f),c.onComplete()}),new AT([])}return!s&&rm.supports(c)?new rm(c):new qf(c)};function p3({protectedKeys:e,needsAnimating:n},t){const r=e.hasOwnProperty(t)&&n[t]!==!0;return n[t]=!1,r}function q1(e,n,{delay:t=0,transitionOverride:r,type:i}={}){var s;let{transition:o=e.getDefaultTransition(),transitionEnd:a,...l}=n;r&&(o=r);const u=[],c=i&&e.animationState&&e.animationState.getState()[i];for(const d in l){const f=e.getValue(d,(s=e.latestValues[d])!==null&&s!==void 0?s:null),p=l[d];if(p===void 0||c&&p3(c,d))continue;const v={delay:t,...Cf(o||{},d)};let g=!1;if(window.MotionHandoffAnimation){const h=u1(e);if(h){const m=window.MotionHandoffAnimation(h,d,ue);m!==null&&(v.startTime=m,g=!0)}}Ec(e,d),f.start(Vf(d,f,p,e.shouldReduceMotion&&a1.has(d)?{type:!1}:v,e,g));const _=f.animation;_&&u.push(_)}return a&&Promise.all(u).then(()=>{ue.update(()=>{a&&HT(e,a)})}),u}function Ic(e,n,t={}){var r;const i=Cl(e,n,t.type==="exit"?(r=e.presenceContext)===null||r===void 0?void 0:r.custom:void 0);let{transition:s=e.getDefaultTransition()||{}}=i||{};t.transitionOverride&&(s=t.transitionOverride);const o=i?()=>Promise.all(q1(e,i,t)):()=>Promise.resolve(),a=e.variantChildren&&e.variantChildren.size?(u=0)=>{const{delayChildren:c=0,staggerChildren:d,staggerDirection:f}=s;return h3(e,n,c+u,d,f,t)}:()=>Promise.resolve(),{when:l}=s;if(l){const[u,c]=l==="beforeChildren"?[o,a]:[a,o];return u().then(()=>c())}else return Promise.all([o(),a(t.delay)])}function h3(e,n,t=0,r=0,i=1,s){const o=[],a=(e.variantChildren.size-1)*r,l=i===1?(u=0)=>u*r:(u=0)=>a-u*r;return Array.from(e.variantChildren).sort(m3).forEach((u,c)=>{u.notify("AnimationStart",n),o.push(Ic(u,n,{...s,delay:t+l(c)}).then(()=>u.notify("AnimationComplete",n)))}),Promise.all(o)}function m3(e,n){return e.sortNodePosition(n)}function g3(e,n,t={}){e.notify("AnimationStart",n);let r;if(Array.isArray(n)){const i=n.map(s=>Ic(e,s,t));r=Promise.all(i)}else if(typeof n=="string")r=Ic(e,n,t);else{const i=typeof n=="function"?Cl(e,n,t.custom):n;r=Promise.all(q1(e,i,t))}return r.then(()=>{e.notify("AnimationComplete",n)})}const v3=pf.length;function V1(e){if(!e)return;if(!e.isControllingVariants){const t=e.parent?V1(e.parent)||{}:{};return e.props.initial!==void 0&&(t.initial=e.props.initial),t}const n={};for(let t=0;t<v3;t++){const r=pf[t],i=e.props[r];(zs(i)||i===!1)&&(n[r]=i)}return n}const y3=[...ff].reverse(),x3=ff.length;function _3(e){return n=>Promise.all(n.map(({animation:t,options:r})=>g3(e,t,r)))}function w3(e){let n=_3(e),t=im(),r=!0;const i=l=>(u,c)=>{var d;const f=Cl(e,c,l==="exit"?(d=e.presenceContext)===null||d===void 0?void 0:d.custom:void 0);if(f){const{transition:p,transitionEnd:v,...g}=f;u={...u,...g,...v}}return u};function s(l){n=l(e)}function o(l){const{props:u}=e,c=V1(e.parent)||{},d=[],f=new Set;let p={},v=1/0;for(let _=0;_<x3;_++){const h=y3[_],m=t[h],y=u[h]!==void 0?u[h]:c[h],x=zs(y),k=h===l?m.isActive:null;k===!1&&(v=_);let C=y===c[h]&&y!==u[h]&&x;if(C&&r&&e.manuallyAnimateOnMount&&(C=!1),m.protectedKeys={...p},!m.isActive&&k===null||!y&&!m.prevProp||kl(y)||typeof y=="boolean")continue;const T=b3(m.prevProp,y);let j=T||h===l&&m.isActive&&!C&&x||_>v&&x,F=!1;const I=Array.isArray(y)?y:[y];let O=I.reduce(i(h),{});k===!1&&(O={});const{prevResolvedValues:$={}}=m,q={...$,...O},P=N=>{j=!0,f.has(N)&&(F=!0,f.delete(N)),m.needsAnimating[N]=!0;const z=e.getValue(N);z&&(z.liveStyle=!1)};for(const N in q){const z=O[N],M=$[N];if(p.hasOwnProperty(N))continue;let R=!1;jc(z)&&jc(M)?R=!Jy(z,M):R=z!==M,R?z!=null?P(N):f.add(N):z!==void 0&&f.has(N)?P(N):m.protectedKeys[N]=!0}m.prevProp=y,m.prevResolvedValues=O,m.isActive&&(p={...p,...O}),r&&e.blockInitialAnimation&&(j=!1),j&&(!(C&&T)||F)&&d.push(...I.map(N=>({animation:N,options:{type:h}})))}if(f.size){const _={};f.forEach(h=>{const m=e.getBaseTarget(h),y=e.getValue(h);y&&(y.liveStyle=!0),_[h]=m??null}),d.push({animation:_})}let g=!!d.length;return r&&(u.initial===!1||u.initial===u.animate)&&!e.manuallyAnimateOnMount&&(g=!1),r=!1,g?n(d):Promise.resolve()}function a(l,u){var c;if(t[l].isActive===u)return Promise.resolve();(c=e.variantChildren)===null||c===void 0||c.forEach(f=>{var p;return(p=f.animationState)===null||p===void 0?void 0:p.setActive(l,u)}),t[l].isActive=u;const d=o(l);for(const f in t)t[f].protectedKeys={};return d}return{animateChanges:o,setActive:a,setAnimateFunction:s,getState:()=>t,reset:()=>{t=im(),r=!0}}}function b3(e,n){return typeof n=="string"?n!==e:Array.isArray(n)?!Jy(n,e):!1}function Kt(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function im(){return{animate:Kt(!0),whileInView:Kt(),whileHover:Kt(),whileTap:Kt(),whileDrag:Kt(),whileFocus:Kt(),exit:Kt()}}class Bt{constructor(n){this.isMounted=!1,this.node=n}update(){}}class k3 extends Bt{constructor(n){super(n),n.animationState||(n.animationState=w3(n))}updateAnimationControlsSubscription(){const{animate:n}=this.node.getProps();kl(n)&&(this.unmountControls=n.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:n}=this.node.getProps(),{animate:t}=this.node.prevProps||{};n!==t&&this.updateAnimationControlsSubscription()}unmount(){var n;this.node.animationState.reset(),(n=this.unmountControls)===null||n===void 0||n.call(this)}}let S3=0;class C3 extends Bt{constructor(){super(...arguments),this.id=S3++}update(){if(!this.node.presenceContext)return;const{isPresent:n,onExitComplete:t}=this.node.presenceContext,{isPresent:r}=this.node.prevPresenceContext||{};if(!this.node.animationState||n===r)return;const i=this.node.animationState.setActive("exit",!n);t&&!n&&i.then(()=>t(this.id))}mount(){const{register:n}=this.node.presenceContext||{};n&&(this.unmount=n(this.id))}unmount(){}}const P3={animation:{Feature:k3},exit:{Feature:C3}};function Rs(e,n,t,r={passive:!0}){return e.addEventListener(n,t,r),()=>e.removeEventListener(n,t)}function Qs(e){return{point:{x:e.pageX,y:e.pageY}}}const j3=e=>n=>Tf(n)&&e(n,Qs(n));function ss(e,n,t,r){return Rs(e,n,j3(t),r)}const sm=(e,n)=>Math.abs(e-n);function T3(e,n){const t=sm(e.x,n.x),r=sm(e.y,n.y);return Math.sqrt(t**2+r**2)}class $1{constructor(n,t,{transformPagePoint:r,contextWindow:i,dragSnapToOrigin:s=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const d=yu(this.lastMoveEventInfo,this.history),f=this.startEvent!==null,p=T3(d.offset,{x:0,y:0})>=3;if(!f&&!p)return;const{point:v}=d,{timestamp:g}=Te;this.history.push({...v,timestamp:g});const{onStart:_,onMove:h}=this.handlers;f||(_&&_(this.lastMoveEvent,d),this.startEvent=this.lastMoveEvent),h&&h(this.lastMoveEvent,d)},this.handlePointerMove=(d,f)=>{this.lastMoveEvent=d,this.lastMoveEventInfo=vu(f,this.transformPagePoint),ue.update(this.updatePoint,!0)},this.handlePointerUp=(d,f)=>{this.end();const{onEnd:p,onSessionEnd:v,resumeAnimation:g}=this.handlers;if(this.dragSnapToOrigin&&g&&g(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const _=yu(d.type==="pointercancel"?this.lastMoveEventInfo:vu(f,this.transformPagePoint),this.history);this.startEvent&&p&&p(d,_),v&&v(d,_)},!Tf(n))return;this.dragSnapToOrigin=s,this.handlers=t,this.transformPagePoint=r,this.contextWindow=i||window;const o=Qs(n),a=vu(o,this.transformPagePoint),{point:l}=a,{timestamp:u}=Te;this.history=[{...l,timestamp:u}];const{onSessionStart:c}=t;c&&c(n,yu(a,this.history)),this.removeListeners=Xs(ss(this.contextWindow,"pointermove",this.handlePointerMove),ss(this.contextWindow,"pointerup",this.handlePointerUp),ss(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(n){this.handlers=n}end(){this.removeListeners&&this.removeListeners(),It(this.updatePoint)}}function vu(e,n){return n?{point:n(e.point)}:e}function om(e,n){return{x:e.x-n.x,y:e.y-n.y}}function yu({point:e},n){return{point:e,delta:om(e,O1(n)),offset:om(e,z3(n)),velocity:E3(n,.1)}}function z3(e){return e[0]}function O1(e){return e[e.length-1]}function E3(e,n){if(e.length<2)return{x:0,y:0};let t=e.length-1,r=null;const i=O1(e);for(;t>=0&&(r=e[t],!(i.timestamp-r.timestamp>nt(n)));)t--;if(!r)return{x:0,y:0};const s=tt(i.timestamp-r.timestamp);if(s===0)return{x:0,y:0};const o={x:(i.x-r.x)/s,y:(i.y-r.y)/s};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}const B1=1e-4,A3=1-B1,M3=1+B1,U1=.01,R3=0-U1,N3=0+U1;function un(e){return e.max-e.min}function L3(e,n,t){return Math.abs(e-n)<=t}function am(e,n,t,r=.5){e.origin=r,e.originPoint=fe(n.min,n.max,e.origin),e.scale=un(t)/un(n),e.translate=fe(t.min,t.max,e.origin)-e.originPoint,(e.scale>=A3&&e.scale<=M3||isNaN(e.scale))&&(e.scale=1),(e.translate>=R3&&e.translate<=N3||isNaN(e.translate))&&(e.translate=0)}function os(e,n,t,r){am(e.x,n.x,t.x,r?r.originX:void 0),am(e.y,n.y,t.y,r?r.originY:void 0)}function lm(e,n,t){e.min=t.min+n.min,e.max=e.min+un(n)}function D3(e,n,t){lm(e.x,n.x,t.x),lm(e.y,n.y,t.y)}function um(e,n,t){e.min=n.min-t.min,e.max=e.min+un(n)}function as(e,n,t){um(e.x,n.x,t.x),um(e.y,n.y,t.y)}function I3(e,{min:n,max:t},r){return n!==void 0&&e<n?e=r?fe(n,e,r.min):Math.max(e,n):t!==void 0&&e>t&&(e=r?fe(t,e,r.max):Math.min(e,t)),e}function cm(e,n,t){return{min:n!==void 0?e.min+n:void 0,max:t!==void 0?e.max+t-(e.max-e.min):void 0}}function F3(e,{top:n,left:t,bottom:r,right:i}){return{x:cm(e.x,t,i),y:cm(e.y,n,r)}}function dm(e,n){let t=n.min-e.min,r=n.max-e.max;return n.max-n.min<e.max-e.min&&([t,r]=[r,t]),{min:t,max:r}}function q3(e,n){return{x:dm(e.x,n.x),y:dm(e.y,n.y)}}function V3(e,n){let t=.5;const r=un(e),i=un(n);return i>r?t=ci(n.min,n.max-r,e.min):r>i&&(t=ci(e.min,e.max-i,n.min)),lt(0,1,t)}function $3(e,n){const t={};return n.min!==void 0&&(t.min=n.min-e.min),n.max!==void 0&&(t.max=n.max-e.min),t}const Fc=.35;function O3(e=Fc){return e===!1?e=0:e===!0&&(e=Fc),{x:fm(e,"left","right"),y:fm(e,"top","bottom")}}function fm(e,n,t){return{min:pm(e,n),max:pm(e,t)}}function pm(e,n){return typeof e=="number"?e:e[n]||0}const hm=()=>({translate:0,scale:1,origin:0,originPoint:0}),Br=()=>({x:hm(),y:hm()}),mm=()=>({min:0,max:0}),ye=()=>({x:mm(),y:mm()});function hn(e){return[e("x"),e("y")]}function H1({top:e,left:n,right:t,bottom:r}){return{x:{min:n,max:t},y:{min:e,max:r}}}function B3({x:e,y:n}){return{top:n.min,right:e.max,bottom:n.max,left:e.min}}function U3(e,n){if(!n)return e;const t=n({x:e.left,y:e.top}),r=n({x:e.right,y:e.bottom});return{top:t.y,left:t.x,bottom:r.y,right:r.x}}function xu(e){return e===void 0||e===1}function qc({scale:e,scaleX:n,scaleY:t}){return!xu(e)||!xu(n)||!xu(t)}function Xt(e){return qc(e)||W1(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function W1(e){return gm(e.x)||gm(e.y)}function gm(e){return e&&e!=="0%"}function $a(e,n,t){const r=e-t,i=n*r;return t+i}function vm(e,n,t,r,i){return i!==void 0&&(e=$a(e,i,r)),$a(e,t,r)+n}function Vc(e,n=0,t=1,r,i){e.min=vm(e.min,n,t,r,i),e.max=vm(e.max,n,t,r,i)}function K1(e,{x:n,y:t}){Vc(e.x,n.translate,n.scale,n.originPoint),Vc(e.y,t.translate,t.scale,t.originPoint)}const ym=.999999999999,xm=1.0000000000001;function H3(e,n,t,r=!1){const i=t.length;if(!i)return;n.x=n.y=1;let s,o;for(let a=0;a<i;a++){s=t[a],o=s.projectionDelta;const{visualElement:l}=s.options;l&&l.props.style&&l.props.style.display==="contents"||(r&&s.options.layoutScroll&&s.scroll&&s!==s.root&&Hr(e,{x:-s.scroll.offset.x,y:-s.scroll.offset.y}),o&&(n.x*=o.x.scale,n.y*=o.y.scale,K1(e,o)),r&&Xt(s.latestValues)&&Hr(e,s.latestValues))}n.x<xm&&n.x>ym&&(n.x=1),n.y<xm&&n.y>ym&&(n.y=1)}function Ur(e,n){e.min=e.min+n,e.max=e.max+n}function _m(e,n,t,r,i=.5){const s=fe(e.min,e.max,i);Vc(e,n,t,s,r)}function Hr(e,n){_m(e.x,n.x,n.scaleX,n.scale,n.originX),_m(e.y,n.y,n.scaleY,n.scale,n.originY)}function Y1(e,n){return H1(U3(e.getBoundingClientRect(),n))}function W3(e,n,t){const r=Y1(e,t),{scroll:i}=n;return i&&(Ur(r.x,i.offset.x),Ur(r.y,i.offset.y)),r}const G1=({current:e})=>e?e.ownerDocument.defaultView:null,K3=new WeakMap;class Y3{constructor(n){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=ye(),this.visualElement=n}start(n,{snapToCursor:t=!1}={}){const{presenceContext:r}=this.visualElement;if(r&&r.isPresent===!1)return;const i=c=>{const{dragSnapToOrigin:d}=this.getProps();d?this.pauseAnimation():this.stopAnimation(),t&&this.snapToCursor(Qs(c).point)},s=(c,d)=>{const{drag:f,dragPropagation:p,onDragStart:v}=this.getProps();if(f&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=VT(f),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),hn(_=>{let h=this.getAxisMotionValue(_).get()||0;if(On.test(h)){const{projection:m}=this.visualElement;if(m&&m.layout){const y=m.layout.layoutBox[_];y&&(h=un(y)*(parseFloat(h)/100))}}this.originPoint[_]=h}),v&&ue.postRender(()=>v(c,d)),Ec(this.visualElement,"transform");const{animationState:g}=this.visualElement;g&&g.setActive("whileDrag",!0)},o=(c,d)=>{const{dragPropagation:f,dragDirectionLock:p,onDirectionLock:v,onDrag:g}=this.getProps();if(!f&&!this.openDragLock)return;const{offset:_}=d;if(p&&this.currentDirection===null){this.currentDirection=G3(_),this.currentDirection!==null&&v&&v(this.currentDirection);return}this.updateAxis("x",d.point,_),this.updateAxis("y",d.point,_),this.visualElement.render(),g&&g(c,d)},a=(c,d)=>this.stop(c,d),l=()=>hn(c=>{var d;return this.getAnimationState(c)==="paused"&&((d=this.getAxisMotionValue(c).animation)===null||d===void 0?void 0:d.play())}),{dragSnapToOrigin:u}=this.getProps();this.panSession=new $1(n,{onSessionStart:i,onStart:s,onMove:o,onSessionEnd:a,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:u,contextWindow:G1(this.visualElement)})}stop(n,t){const r=this.isDragging;if(this.cancel(),!r)return;const{velocity:i}=t;this.startAnimation(i);const{onDragEnd:s}=this.getProps();s&&ue.postRender(()=>s(n,t))}cancel(){this.isDragging=!1;const{projection:n,animationState:t}=this.visualElement;n&&(n.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:r}=this.getProps();!r&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),t&&t.setActive("whileDrag",!1)}updateAxis(n,t,r){const{drag:i}=this.getProps();if(!r||!To(n,i,this.currentDirection))return;const s=this.getAxisMotionValue(n);let o=this.originPoint[n]+r[n];this.constraints&&this.constraints[n]&&(o=I3(o,this.constraints[n],this.elastic[n])),s.set(o)}resolveConstraints(){var n;const{dragConstraints:t,dragElastic:r}=this.getProps(),i=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(n=this.visualElement.projection)===null||n===void 0?void 0:n.layout,s=this.constraints;t&&$r(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&i?this.constraints=F3(i.layoutBox,t):this.constraints=!1,this.elastic=O3(r),s!==this.constraints&&i&&this.constraints&&!this.hasMutatedConstraints&&hn(o=>{this.constraints!==!1&&this.getAxisMotionValue(o)&&(this.constraints[o]=$3(i.layoutBox[o],this.constraints[o]))})}resolveRefConstraints(){const{dragConstraints:n,onMeasureDragConstraints:t}=this.getProps();if(!n||!$r(n))return!1;const r=n.current,{projection:i}=this.visualElement;if(!i||!i.layout)return!1;const s=W3(r,i.root,this.visualElement.getTransformPagePoint());let o=q3(i.layout.layoutBox,s);if(t){const a=t(B3(o));this.hasMutatedConstraints=!!a,a&&(o=H1(a))}return o}startAnimation(n){const{drag:t,dragMomentum:r,dragElastic:i,dragTransition:s,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),l=this.constraints||{},u=hn(c=>{if(!To(c,t,this.currentDirection))return;let d=l&&l[c]||{};o&&(d={min:0,max:0});const f=i?200:1e6,p=i?40:1e7,v={type:"inertia",velocity:r?n[c]:0,bounceStiffness:f,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...s,...d};return this.startAxisValueAnimation(c,v)});return Promise.all(u).then(a)}startAxisValueAnimation(n,t){const r=this.getAxisMotionValue(n);return Ec(this.visualElement,n),r.start(Vf(n,r,0,t,this.visualElement,!1))}stopAnimation(){hn(n=>this.getAxisMotionValue(n).stop())}pauseAnimation(){hn(n=>{var t;return(t=this.getAxisMotionValue(n).animation)===null||t===void 0?void 0:t.pause()})}getAnimationState(n){var t;return(t=this.getAxisMotionValue(n).animation)===null||t===void 0?void 0:t.state}getAxisMotionValue(n){const t=`_drag${n.toUpperCase()}`,r=this.visualElement.getProps(),i=r[t];return i||this.visualElement.getValue(n,(r.initial?r.initial[n]:void 0)||0)}snapToCursor(n){hn(t=>{const{drag:r}=this.getProps();if(!To(t,r,this.currentDirection))return;const{projection:i}=this.visualElement,s=this.getAxisMotionValue(t);if(i&&i.layout){const{min:o,max:a}=i.layout.layoutBox[t];s.set(n[t]-fe(o,a,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:n,dragConstraints:t}=this.getProps(),{projection:r}=this.visualElement;if(!$r(t)||!r||!this.constraints)return;this.stopAnimation();const i={x:0,y:0};hn(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const l=a.get();i[o]=V3({min:l,max:l},this.constraints[o])}});const{transformTemplate:s}=this.visualElement.getProps();this.visualElement.current.style.transform=s?s({},""):"none",r.root&&r.root.updateScroll(),r.updateLayout(),this.resolveConstraints(),hn(o=>{if(!To(o,n,null))return;const a=this.getAxisMotionValue(o),{min:l,max:u}=this.constraints[o];a.set(fe(l,u,i[o]))})}addListeners(){if(!this.visualElement.current)return;K3.set(this.visualElement,this);const n=this.visualElement.current,t=ss(n,"pointerdown",l=>{const{drag:u,dragListener:c=!0}=this.getProps();u&&c&&this.start(l)}),r=()=>{const{dragConstraints:l}=this.getProps();$r(l)&&l.current&&(this.constraints=this.resolveRefConstraints())},{projection:i}=this.visualElement,s=i.addEventListener("measure",r);i&&!i.layout&&(i.root&&i.root.updateScroll(),i.updateLayout()),ue.read(r);const o=Rs(window,"resize",()=>this.scalePositionWithinConstraints()),a=i.addEventListener("didUpdate",({delta:l,hasLayoutChanged:u})=>{this.isDragging&&u&&(hn(c=>{const d=this.getAxisMotionValue(c);d&&(this.originPoint[c]+=l[c].translate,d.set(d.get()+l[c].translate))}),this.visualElement.render())});return()=>{o(),t(),s(),a&&a()}}getProps(){const n=this.visualElement.getProps(),{drag:t=!1,dragDirectionLock:r=!1,dragPropagation:i=!1,dragConstraints:s=!1,dragElastic:o=Fc,dragMomentum:a=!0}=n;return{...n,drag:t,dragDirectionLock:r,dragPropagation:i,dragConstraints:s,dragElastic:o,dragMomentum:a}}}function To(e,n,t){return(n===!0||n===e)&&(t===null||t===e)}function G3(e,n=10){let t=null;return Math.abs(e.y)>n?t="y":Math.abs(e.x)>n&&(t="x"),t}class X3 extends Bt{constructor(n){super(n),this.removeGroupControls=an,this.removeListeners=an,this.controls=new Y3(n)}mount(){const{dragControls:n}=this.node.getProps();n&&(this.removeGroupControls=n.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||an}unmount(){this.removeGroupControls(),this.removeListeners()}}const wm=e=>(n,t)=>{e&&ue.postRender(()=>e(n,t))};class Q3 extends Bt{constructor(){super(...arguments),this.removePointerDownListener=an}onPointerDown(n){this.session=new $1(n,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:G1(this.node)})}createPanHandlers(){const{onPanSessionStart:n,onPanStart:t,onPan:r,onPanEnd:i}=this.node.getProps();return{onSessionStart:wm(n),onStart:wm(t),onMove:r,onEnd:(s,o)=>{delete this.session,i&&ue.postRender(()=>i(s,o))}}}mount(){this.removePointerDownListener=ss(this.node.current,"pointerdown",n=>this.onPointerDown(n))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const Xo={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function bm(e,n){return n.max===n.min?0:e/(n.max-n.min)*100}const Ai={correct:(e,n)=>{if(!n.target)return e;if(typeof e=="string")if(Y.test(e))e=parseFloat(e);else return e;const t=bm(e,n.target.x),r=bm(e,n.target.y);return`${t}% ${r}%`}},Z3={correct:(e,{treeScale:n,projectionDelta:t})=>{const r=e,i=Ft.parse(e);if(i.length>5)return r;const s=Ft.createTransformer(e),o=typeof i[0]!="number"?1:0,a=t.x.scale*n.x,l=t.y.scale*n.y;i[0+o]/=a,i[1+o]/=l;const u=fe(a,l,.5);return typeof i[2+o]=="number"&&(i[2+o]/=u),typeof i[3+o]=="number"&&(i[3+o]/=u),s(i)}};class J3 extends S.Component{componentDidMount(){const{visualElement:n,layoutGroup:t,switchLayoutGroup:r,layoutId:i}=this.props,{projection:s}=n;xT(eE),s&&(t.group&&t.group.add(s),r&&r.register&&i&&r.register(s),s.root.didUpdate(),s.addEventListener("animationComplete",()=>{this.safeToRemove()}),s.setOptions({...s.options,onExitComplete:()=>this.safeToRemove()})),Xo.hasEverUpdated=!0}getSnapshotBeforeUpdate(n){const{layoutDependency:t,visualElement:r,drag:i,isPresent:s}=this.props,o=r.projection;return o&&(o.isPresent=s,i||n.layoutDependency!==t||t===void 0?o.willUpdate():this.safeToRemove(),n.isPresent!==s&&(s?o.promote():o.relegate()||ue.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:n}=this.props.visualElement;n&&(n.root.didUpdate(),mf.postRender(()=>{!n.currentAnimation&&n.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:n,layoutGroup:t,switchLayoutGroup:r}=this.props,{projection:i}=n;i&&(i.scheduleCheckAfterUnmount(),t&&t.group&&t.group.remove(i),r&&r.deregister&&r.deregister(i))}safeToRemove(){const{safeToRemove:n}=this.props;n&&n()}render(){return null}}function X1(e){const[n,t]=My(),r=S.useContext(af);return w.jsx(J3,{...e,layoutGroup:r,switchLayoutGroup:S.useContext(Vy),isPresent:n,safeToRemove:t})}const eE={borderRadius:{...Ai,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:Ai,borderTopRightRadius:Ai,borderBottomLeftRadius:Ai,borderBottomRightRadius:Ai,boxShadow:Z3};function nE(e,n,t){const r=Ie(e)?e:As(e);return r.start(Vf("",r,n,t)),r.animation}function tE(e){return e instanceof SVGElement&&e.tagName!=="svg"}const rE=(e,n)=>e.depth-n.depth;class iE{constructor(){this.children=[],this.isDirty=!1}add(n){zf(this.children,n),this.isDirty=!0}remove(n){Ef(this.children,n),this.isDirty=!0}forEach(n){this.isDirty&&this.children.sort(rE),this.isDirty=!1,this.children.forEach(n)}}function sE(e,n){const t=Bn.now(),r=({timestamp:i})=>{const s=i-t;s>=n&&(It(r),e(s-n))};return ue.read(r,!0),()=>It(r)}const Q1=["TopLeft","TopRight","BottomLeft","BottomRight"],oE=Q1.length,km=e=>typeof e=="string"?parseFloat(e):e,Sm=e=>typeof e=="number"||Y.test(e);function aE(e,n,t,r,i,s){i?(e.opacity=fe(0,t.opacity!==void 0?t.opacity:1,lE(r)),e.opacityExit=fe(n.opacity!==void 0?n.opacity:1,0,uE(r))):s&&(e.opacity=fe(n.opacity!==void 0?n.opacity:1,t.opacity!==void 0?t.opacity:1,r));for(let o=0;o<oE;o++){const a=`border${Q1[o]}Radius`;let l=Cm(n,a),u=Cm(t,a);if(l===void 0&&u===void 0)continue;l||(l=0),u||(u=0),l===0||u===0||Sm(l)===Sm(u)?(e[a]=Math.max(fe(km(l),km(u),r),0),(On.test(u)||On.test(l))&&(e[a]+="%")):e[a]=u}(n.rotate||t.rotate)&&(e.rotate=fe(n.rotate||0,t.rotate||0,r))}function Cm(e,n){return e[n]!==void 0?e[n]:e.borderRadius}const lE=Z1(0,.5,g1),uE=Z1(.5,.95,an);function Z1(e,n,t){return r=>r<e?0:r>n?1:t(ci(e,n,r))}function Pm(e,n){e.min=n.min,e.max=n.max}function pn(e,n){Pm(e.x,n.x),Pm(e.y,n.y)}function jm(e,n){e.translate=n.translate,e.scale=n.scale,e.originPoint=n.originPoint,e.origin=n.origin}function Tm(e,n,t,r,i){return e-=n,e=$a(e,1/t,r),i!==void 0&&(e=$a(e,1/i,r)),e}function cE(e,n=0,t=1,r=.5,i,s=e,o=e){if(On.test(n)&&(n=parseFloat(n),n=fe(o.min,o.max,n/100)-o.min),typeof n!="number")return;let a=fe(s.min,s.max,r);e===s&&(a-=n),e.min=Tm(e.min,n,t,a,i),e.max=Tm(e.max,n,t,a,i)}function zm(e,n,[t,r,i],s,o){cE(e,n[t],n[r],n[i],n.scale,s,o)}const dE=["x","scaleX","originX"],fE=["y","scaleY","originY"];function Em(e,n,t,r){zm(e.x,n,dE,t?t.x:void 0,r?r.x:void 0),zm(e.y,n,fE,t?t.y:void 0,r?r.y:void 0)}function Am(e){return e.translate===0&&e.scale===1}function J1(e){return Am(e.x)&&Am(e.y)}function Mm(e,n){return e.min===n.min&&e.max===n.max}function pE(e,n){return Mm(e.x,n.x)&&Mm(e.y,n.y)}function Rm(e,n){return Math.round(e.min)===Math.round(n.min)&&Math.round(e.max)===Math.round(n.max)}function ex(e,n){return Rm(e.x,n.x)&&Rm(e.y,n.y)}function Nm(e){return un(e.x)/un(e.y)}function Lm(e,n){return e.translate===n.translate&&e.scale===n.scale&&e.originPoint===n.originPoint}class hE{constructor(){this.members=[]}add(n){zf(this.members,n),n.scheduleRender()}remove(n){if(Ef(this.members,n),n===this.prevLead&&(this.prevLead=void 0),n===this.lead){const t=this.members[this.members.length-1];t&&this.promote(t)}}relegate(n){const t=this.members.findIndex(i=>n===i);if(t===0)return!1;let r;for(let i=t;i>=0;i--){const s=this.members[i];if(s.isPresent!==!1){r=s;break}}return r?(this.promote(r),!0):!1}promote(n,t){const r=this.lead;if(n!==r&&(this.prevLead=r,this.lead=n,n.show(),r)){r.instance&&r.scheduleRender(),n.scheduleRender(),n.resumeFrom=r,t&&(n.resumeFrom.preserveOpacity=!0),r.snapshot&&(n.snapshot=r.snapshot,n.snapshot.latestValues=r.animationValues||r.latestValues),n.root&&n.root.isUpdating&&(n.isLayoutDirty=!0);const{crossfade:i}=n.options;i===!1&&r.hide()}}exitAnimationComplete(){this.members.forEach(n=>{const{options:t,resumingFrom:r}=n;t.onExitComplete&&t.onExitComplete(),r&&r.options.onExitComplete&&r.options.onExitComplete()})}scheduleRender(){this.members.forEach(n=>{n.instance&&n.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function mE(e,n,t){let r="";const i=e.x.translate/n.x,s=e.y.translate/n.y,o=(t==null?void 0:t.z)||0;if((i||s||o)&&(r=`translate3d(${i}px, ${s}px, ${o}px) `),(n.x!==1||n.y!==1)&&(r+=`scale(${1/n.x}, ${1/n.y}) `),t){const{transformPerspective:u,rotate:c,rotateX:d,rotateY:f,skewX:p,skewY:v}=t;u&&(r=`perspective(${u}px) ${r}`),c&&(r+=`rotate(${c}deg) `),d&&(r+=`rotateX(${d}deg) `),f&&(r+=`rotateY(${f}deg) `),p&&(r+=`skewX(${p}deg) `),v&&(r+=`skewY(${v}deg) `)}const a=e.x.scale*n.x,l=e.y.scale*n.y;return(a!==1||l!==1)&&(r+=`scale(${a}, ${l})`),r||"none"}const Qt={type:"projectionFrame",totalNodes:0,resolvedTargetDeltas:0,recalculatedProjection:0},Oi=typeof window<"u"&&window.MotionDebug!==void 0,_u=["","X","Y","Z"],gE={visibility:"hidden"},Dm=1e3;let vE=0;function wu(e,n,t,r){const{latestValues:i}=n;i[e]&&(t[e]=i[e],n.setStaticValue(e,0),r&&(r[e]=0))}function nx(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:n}=e.options;if(!n)return;const t=u1(n);if(window.MotionHasOptimisedAnimation(t,"transform")){const{layout:i,layoutId:s}=e.options;window.MotionCancelOptimisedAnimation(t,"transform",ue,!(i||s))}const{parent:r}=e;r&&!r.hasCheckedOptimisedAppear&&nx(r)}function tx({attachResizeListener:e,defaultParent:n,measureScroll:t,checkIsScrollRoot:r,resetTransform:i}){return class{constructor(o={},a=n==null?void 0:n()){this.id=vE++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,Oi&&(Qt.totalNodes=Qt.resolvedTargetDeltas=Qt.recalculatedProjection=0),this.nodes.forEach(_E),this.nodes.forEach(CE),this.nodes.forEach(PE),this.nodes.forEach(wE),Oi&&window.MotionDebug.record(Qt)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let l=0;l<this.path.length;l++)this.path[l].shouldResetTransform=!0;this.root===this&&(this.nodes=new iE)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new Af),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const l=this.eventHandlers.get(o);l&&l.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o,a=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=tE(o),this.instance=o;const{layoutId:l,layout:u,visualElement:c}=this.options;if(c&&!c.current&&c.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),a&&(u||l)&&(this.isLayoutDirty=!0),e){let d;const f=()=>this.root.updateBlockedByResize=!1;e(o,()=>{this.root.updateBlockedByResize=!0,d&&d(),d=sE(f,250),Xo.hasAnimatedSinceResize&&(Xo.hasAnimatedSinceResize=!1,this.nodes.forEach(Fm))})}l&&this.root.registerSharedNode(l,this),this.options.animate!==!1&&c&&(l||u)&&this.addEventListener("didUpdate",({delta:d,hasLayoutChanged:f,hasRelativeTargetChanged:p,layout:v})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||c.getDefaultTransition()||AE,{onLayoutAnimationStart:_,onLayoutAnimationComplete:h}=c.getProps(),m=!this.targetLayout||!ex(this.targetLayout,v)||p,y=!f&&p;if(this.options.layoutRoot||this.resumeFrom&&this.resumeFrom.instance||y||f&&(m||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(d,y);const x={...Cf(g,"layout"),onPlay:_,onComplete:h};(c.shouldReduceMotion||this.options.layoutRoot)&&(x.delay=0,x.type=!1),this.startAnimation(x)}else f||Fm(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=v})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,It(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(jE),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&nx(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let c=0;c<this.path.length;c++){const d=this.path[c];d.shouldResetTransform=!0,d.updateScroll("snapshot"),d.options.layoutRoot&&d.willUpdate(!1)}const{layoutId:a,layout:l}=this.options;if(a===void 0&&!l)return;const u=this.getTransformTemplate();this.prevTransformTemplateValue=u?u(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(Im);return}this.isUpdating||this.nodes.forEach(kE),this.isUpdating=!1,this.nodes.forEach(SE),this.nodes.forEach(yE),this.nodes.forEach(xE),this.clearAllSnapshots();const a=Bn.now();Te.delta=lt(0,1e3/60,a-Te.timestamp),Te.timestamp=a,Te.isProcessing=!0,du.update.process(Te),du.preRender.process(Te),du.render.process(Te),Te.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,mf.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(bE),this.sharedNodes.forEach(TE)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,ue.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){ue.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure())}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let l=0;l<this.path.length;l++)this.path[l].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutCorrected=ye(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a){const l=r(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:l,offset:t(this.instance),wasRoot:this.scroll?this.scroll.isRoot:l}}}resetTransform(){if(!i)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!J1(this.projectionDelta),l=this.getTransformTemplate(),u=l?l(this.latestValues,""):void 0,c=u!==this.prevTransformTemplateValue;o&&(a||Xt(this.latestValues)||c)&&(i(this.instance,u),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let l=this.removeElementScroll(a);return o&&(l=this.removeTransform(l)),ME(l),{animationId:this.root.animationId,measuredBox:a,layoutBox:l,latestValues:{},source:this.id}}measurePageBox(){var o;const{visualElement:a}=this.options;if(!a)return ye();const l=a.measureViewportBox();if(!(((o=this.scroll)===null||o===void 0?void 0:o.wasRoot)||this.path.some(RE))){const{scroll:c}=this.root;c&&(Ur(l.x,c.offset.x),Ur(l.y,c.offset.y))}return l}removeElementScroll(o){var a;const l=ye();if(pn(l,o),!((a=this.scroll)===null||a===void 0)&&a.wasRoot)return l;for(let u=0;u<this.path.length;u++){const c=this.path[u],{scroll:d,options:f}=c;c!==this.root&&d&&f.layoutScroll&&(d.wasRoot&&pn(l,o),Ur(l.x,d.offset.x),Ur(l.y,d.offset.y))}return l}applyTransform(o,a=!1){const l=ye();pn(l,o);for(let u=0;u<this.path.length;u++){const c=this.path[u];!a&&c.options.layoutScroll&&c.scroll&&c!==c.root&&Hr(l,{x:-c.scroll.offset.x,y:-c.scroll.offset.y}),Xt(c.latestValues)&&Hr(l,c.latestValues)}return Xt(this.latestValues)&&Hr(l,this.latestValues),l}removeTransform(o){const a=ye();pn(a,o);for(let l=0;l<this.path.length;l++){const u=this.path[l];if(!u.instance||!Xt(u.latestValues))continue;qc(u.latestValues)&&u.updateSnapshot();const c=ye(),d=u.measurePageBox();pn(c,d),Em(a,u.latestValues,u.snapshot?u.snapshot.layoutBox:void 0,c)}return Xt(this.latestValues)&&Em(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==Te.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){var a;const l=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=l.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=l.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=l.isSharedProjectionDirty);const u=!!this.resumingFrom||this!==l;if(!(o||u&&this.isSharedProjectionDirty||this.isProjectionDirty||!((a=this.parent)===null||a===void 0)&&a.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:d,layoutId:f}=this.options;if(!(!this.layout||!(d||f))){if(this.resolvedRelativeTargetAt=Te.timestamp,!this.targetDelta&&!this.relativeTarget){const p=this.getClosestProjectingParent();p&&p.layout&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=ye(),this.relativeTargetOrigin=ye(),as(this.relativeTargetOrigin,this.layout.layoutBox,p.layout.layoutBox),pn(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)){if(this.target||(this.target=ye(),this.targetWithTransforms=ye()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),D3(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):pn(this.target,this.layout.layoutBox),K1(this.target,this.targetDelta)):pn(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget){this.attemptToResolveRelativeTarget=!1;const p=this.getClosestProjectingParent();p&&!!p.resumingFrom==!!this.resumingFrom&&!p.options.layoutScroll&&p.target&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=ye(),this.relativeTargetOrigin=ye(),as(this.relativeTargetOrigin,this.target,p.target),pn(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}Oi&&Qt.resolvedTargetDeltas++}}}getClosestProjectingParent(){if(!(!this.parent||qc(this.parent.latestValues)||W1(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var o;const a=this.getLead(),l=!!this.resumingFrom||this!==a;let u=!0;if((this.isProjectionDirty||!((o=this.parent)===null||o===void 0)&&o.isProjectionDirty)&&(u=!1),l&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(u=!1),this.resolvedRelativeTargetAt===Te.timestamp&&(u=!1),u)return;const{layout:c,layoutId:d}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(c||d))return;pn(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,p=this.treeScale.y;H3(this.layoutCorrected,this.treeScale,this.path,l),a.layout&&!a.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(a.target=a.layout.layoutBox,a.targetWithTransforms=ye());const{target:v}=a;if(!v){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(jm(this.prevProjectionDelta.x,this.projectionDelta.x),jm(this.prevProjectionDelta.y,this.projectionDelta.y)),os(this.projectionDelta,this.layoutCorrected,v,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==p||!Lm(this.projectionDelta.x,this.prevProjectionDelta.x)||!Lm(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",v)),Oi&&Qt.recalculatedProjection++}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){var a;if((a=this.options.visualElement)===null||a===void 0||a.scheduleRender(),o){const l=this.getStack();l&&l.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=Br(),this.projectionDelta=Br(),this.projectionDeltaWithTransform=Br()}setAnimationOrigin(o,a=!1){const l=this.snapshot,u=l?l.latestValues:{},c={...this.latestValues},d=Br();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const f=ye(),p=l?l.source:void 0,v=this.layout?this.layout.source:void 0,g=p!==v,_=this.getStack(),h=!_||_.members.length<=1,m=!!(g&&!h&&this.options.crossfade===!0&&!this.path.some(EE));this.animationProgress=0;let y;this.mixTargetDelta=x=>{const k=x/1e3;qm(d.x,o.x,k),qm(d.y,o.y,k),this.setTargetDelta(d),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(as(f,this.layout.layoutBox,this.relativeParent.layout.layoutBox),zE(this.relativeTarget,this.relativeTargetOrigin,f,k),y&&pE(this.relativeTarget,y)&&(this.isProjectionDirty=!1),y||(y=ye()),pn(y,this.relativeTarget)),g&&(this.animationValues=c,aE(c,u,this.latestValues,k,m,h)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=k},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(It(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=ue.update(()=>{Xo.hasAnimatedSinceResize=!0,this.currentAnimation=nE(0,Dm,{...o,onUpdate:a=>{this.mixTargetDelta(a),o.onUpdate&&o.onUpdate(a)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(Dm),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:l,layout:u,latestValues:c}=o;if(!(!a||!l||!u)){if(this!==o&&this.layout&&u&&rx(this.options.animationType,this.layout.layoutBox,u.layoutBox)){l=this.target||ye();const d=un(this.layout.layoutBox.x);l.x.min=o.target.x.min,l.x.max=l.x.min+d;const f=un(this.layout.layoutBox.y);l.y.min=o.target.y.min,l.y.max=l.y.min+f}pn(a,l),Hr(a,c),os(this.projectionDeltaWithTransform,this.layoutCorrected,a,c)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new hE),this.sharedNodes.get(o).add(a);const u=a.options.initialPromotionConfig;a.promote({transition:u?u.transition:void 0,preserveFollowOpacity:u&&u.shouldPreserveFollowOpacity?u.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){var o;const{layoutId:a}=this.options;return a?((o=this.getStack())===null||o===void 0?void 0:o.lead)||this:this}getPrevLead(){var o;const{layoutId:a}=this.options;return a?(o=this.getStack())===null||o===void 0?void 0:o.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:l}={}){const u=this.getStack();u&&u.promote(this,l),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:l}=o;if((l.z||l.rotate||l.rotateX||l.rotateY||l.rotateZ||l.skewX||l.skewY)&&(a=!0),!a)return;const u={};l.z&&wu("z",o,u,this.animationValues);for(let c=0;c<_u.length;c++)wu(`rotate${_u[c]}`,o,u,this.animationValues),wu(`skew${_u[c]}`,o,u,this.animationValues);o.render();for(const c in u)o.setStaticValue(c,u[c]),this.animationValues&&(this.animationValues[c]=u[c]);o.scheduleRender()}getProjectionStyles(o){var a,l;if(!this.instance||this.isSVG)return;if(!this.isVisible)return gE;const u={visibility:""},c=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,u.opacity="",u.pointerEvents=Yo(o==null?void 0:o.pointerEvents)||"",u.transform=c?c(this.latestValues,""):"none",u;const d=this.getLead();if(!this.projectionDelta||!this.layout||!d.target){const g={};return this.options.layoutId&&(g.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,g.pointerEvents=Yo(o==null?void 0:o.pointerEvents)||""),this.hasProjected&&!Xt(this.latestValues)&&(g.transform=c?c({},""):"none",this.hasProjected=!1),g}const f=d.animationValues||d.latestValues;this.applyTransformsToTarget(),u.transform=mE(this.projectionDeltaWithTransform,this.treeScale,f),c&&(u.transform=c(f,u.transform));const{x:p,y:v}=this.projectionDelta;u.transformOrigin=`${p.origin*100}% ${v.origin*100}% 0`,d.animationValues?u.opacity=d===this?(l=(a=f.opacity)!==null&&a!==void 0?a:this.latestValues.opacity)!==null&&l!==void 0?l:1:this.preserveOpacity?this.latestValues.opacity:f.opacityExit:u.opacity=d===this?f.opacity!==void 0?f.opacity:"":f.opacityExit!==void 0?f.opacityExit:0;for(const g in Da){if(f[g]===void 0)continue;const{correct:_,applyTo:h}=Da[g],m=u.transform==="none"?f[g]:_(f[g],d);if(h){const y=h.length;for(let x=0;x<y;x++)u[h[x]]=m}else u[g]=m}return this.options.layoutId&&(u.pointerEvents=d===this?Yo(o==null?void 0:o.pointerEvents)||"":"none"),u}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>{var a;return(a=o.currentAnimation)===null||a===void 0?void 0:a.stop()}),this.root.nodes.forEach(Im),this.root.sharedNodes.clear()}}}function yE(e){e.updateLayout()}function xE(e){var n;const t=((n=e.resumeFrom)===null||n===void 0?void 0:n.snapshot)||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners("didUpdate")){const{layoutBox:r,measuredBox:i}=e.layout,{animationType:s}=e.options,o=t.source!==e.layout.source;s==="size"?hn(d=>{const f=o?t.measuredBox[d]:t.layoutBox[d],p=un(f);f.min=r[d].min,f.max=f.min+p}):rx(s,t.layoutBox,r)&&hn(d=>{const f=o?t.measuredBox[d]:t.layoutBox[d],p=un(r[d]);f.max=f.min+p,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[d].max=e.relativeTarget[d].min+p)});const a=Br();os(a,r,t.layoutBox);const l=Br();o?os(l,e.applyTransform(i,!0),t.measuredBox):os(l,r,t.layoutBox);const u=!J1(a);let c=!1;if(!e.resumeFrom){const d=e.getClosestProjectingParent();if(d&&!d.resumeFrom){const{snapshot:f,layout:p}=d;if(f&&p){const v=ye();as(v,t.layoutBox,f.layoutBox);const g=ye();as(g,r,p.layoutBox),ex(v,g)||(c=!0),d.options.layoutRoot&&(e.relativeTarget=g,e.relativeTargetOrigin=v,e.relativeParent=d)}}}e.notifyListeners("didUpdate",{layout:r,snapshot:t,delta:l,layoutDelta:a,hasLayoutChanged:u,hasRelativeTargetChanged:c})}else if(e.isLead()){const{onExitComplete:r}=e.options;r&&r()}e.options.transition=void 0}function _E(e){Oi&&Qt.totalNodes++,e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function wE(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function bE(e){e.clearSnapshot()}function Im(e){e.clearMeasurements()}function kE(e){e.isLayoutDirty=!1}function SE(e){const{visualElement:n}=e.options;n&&n.getProps().onBeforeLayoutMeasure&&n.notify("BeforeLayoutMeasure"),e.resetTransform()}function Fm(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function CE(e){e.resolveTargetDelta()}function PE(e){e.calcProjection()}function jE(e){e.resetSkewAndRotation()}function TE(e){e.removeLeadSnapshot()}function qm(e,n,t){e.translate=fe(n.translate,0,t),e.scale=fe(n.scale,1,t),e.origin=n.origin,e.originPoint=n.originPoint}function Vm(e,n,t,r){e.min=fe(n.min,t.min,r),e.max=fe(n.max,t.max,r)}function zE(e,n,t,r){Vm(e.x,n.x,t.x,r),Vm(e.y,n.y,t.y,r)}function EE(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const AE={duration:.45,ease:[.4,0,.1,1]},$m=e=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),Om=$m("applewebkit/")&&!$m("chrome/")?Math.round:an;function Bm(e){e.min=Om(e.min),e.max=Om(e.max)}function ME(e){Bm(e.x),Bm(e.y)}function rx(e,n,t){return e==="position"||e==="preserve-aspect"&&!L3(Nm(n),Nm(t),.2)}function RE(e){var n;return e!==e.root&&((n=e.scroll)===null||n===void 0?void 0:n.wasRoot)}const NE=tx({attachResizeListener:(e,n)=>Rs(e,"resize",n),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),bu={current:void 0},ix=tx({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!bu.current){const e=new NE({});e.mount(window),e.setOptions({layoutScroll:!0}),bu.current=e}return bu.current},resetTransform:(e,n)=>{e.style.transform=n!==void 0?n:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),LE={pan:{Feature:Q3},drag:{Feature:X3,ProjectionNode:ix,MeasureLayout:X1}};function Um(e,n,t){const{props:r}=e;e.animationState&&r.whileHover&&e.animationState.setActive("whileHover",t==="Start");const i="onHover"+t,s=r[i];s&&ue.postRender(()=>s(n,Qs(n)))}class DE extends Bt{mount(){const{current:n}=this.node;n&&(this.unmount=LT(n,t=>(Um(this.node,t,"Start"),r=>Um(this.node,r,"End"))))}unmount(){}}class IE extends Bt{constructor(){super(...arguments),this.isActive=!1}onFocus(){let n=!1;try{n=this.node.current.matches(":focus-visible")}catch{n=!0}!n||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Xs(Rs(this.node.current,"focus",()=>this.onFocus()),Rs(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function Hm(e,n,t){const{props:r}=e;e.animationState&&r.whileTap&&e.animationState.setActive("whileTap",t==="Start");const i="onTap"+(t==="End"?"":t),s=r[i];s&&ue.postRender(()=>s(n,Qs(n)))}class FE extends Bt{mount(){const{current:n}=this.node;n&&(this.unmount=qT(n,t=>(Hm(this.node,t,"Start"),(r,{success:i})=>Hm(this.node,r,i?"End":"Cancel")),{useGlobalTarget:this.node.props.globalTapTarget}))}unmount(){}}const $c=new WeakMap,ku=new WeakMap,qE=e=>{const n=$c.get(e.target);n&&n(e)},VE=e=>{e.forEach(qE)};function $E({root:e,...n}){const t=e||document;ku.has(t)||ku.set(t,{});const r=ku.get(t),i=JSON.stringify(n);return r[i]||(r[i]=new IntersectionObserver(VE,{root:e,...n})),r[i]}function OE(e,n,t){const r=$E(n);return $c.set(e,t),r.observe(e),()=>{$c.delete(e),r.unobserve(e)}}const BE={some:0,all:1};class UE extends Bt{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.unmount();const{viewport:n={}}=this.node.getProps(),{root:t,margin:r,amount:i="some",once:s}=n,o={root:t?t.current:void 0,rootMargin:r,threshold:typeof i=="number"?i:BE[i]},a=l=>{const{isIntersecting:u}=l;if(this.isInView===u||(this.isInView=u,s&&!u&&this.hasEnteredView))return;u&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",u);const{onViewportEnter:c,onViewportLeave:d}=this.node.getProps(),f=u?c:d;f&&f(l)};return OE(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:n,prevProps:t}=this.node;["amount","margin","root"].some(HE(n,t))&&this.startObserver()}unmount(){}}function HE({viewport:e={}},{viewport:n={}}={}){return t=>e[t]!==n[t]}const WE={inView:{Feature:UE},tap:{Feature:FE},focus:{Feature:IE},hover:{Feature:DE}},KE={layout:{ProjectionNode:ix,MeasureLayout:X1}},Oc={current:null},sx={current:!1};function YE(){if(sx.current=!0,!!cf)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),n=()=>Oc.current=e.matches;e.addListener(n),n()}else Oc.current=!1}const GE=[...E1,Le,Ft],XE=e=>GE.find(z1(e)),Wm=new WeakMap;function QE(e,n,t){for(const r in n){const i=n[r],s=t[r];if(Ie(i))e.addValue(r,i);else if(Ie(s))e.addValue(r,As(i,{owner:e}));else if(s!==i)if(e.hasValue(r)){const o=e.getValue(r);o.liveStyle===!0?o.jump(i):o.hasAnimated||o.set(i)}else{const o=e.getStaticValue(r);e.addValue(r,As(o!==void 0?o:i,{owner:e}))}}for(const r in t)n[r]===void 0&&e.removeValue(r);return n}const Km=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];class ZE{scrapeMotionValuesFromProps(n,t,r){return{}}constructor({parent:n,props:t,presenceContext:r,reducedMotionConfig:i,blockInitialAnimation:s,visualState:o},a={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.values=new Map,this.KeyframeResolver=If,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const p=Bn.now();this.renderScheduledAt<p&&(this.renderScheduledAt=p,ue.render(this.render,!1,!0))};const{latestValues:l,renderState:u,onUpdate:c}=o;this.onUpdate=c,this.latestValues=l,this.baseTarget={...l},this.initialValues=t.initial?{...l}:{},this.renderState=u,this.parent=n,this.props=t,this.presenceContext=r,this.depth=n?n.depth+1:0,this.reducedMotionConfig=i,this.options=a,this.blockInitialAnimation=!!s,this.isControllingVariants=Sl(t),this.isVariantNode=Fy(t),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(n&&n.current);const{willChange:d,...f}=this.scrapeMotionValuesFromProps(t,{},this);for(const p in f){const v=f[p];l[p]!==void 0&&Ie(v)&&v.set(l[p],!1)}}mount(n){this.current=n,Wm.set(n,this),this.projection&&!this.projection.instance&&this.projection.mount(n),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((t,r)=>this.bindToMotionValue(r,t)),sx.current||YE(),this.shouldReduceMotion=this.reducedMotionConfig==="never"?!1:this.reducedMotionConfig==="always"?!0:Oc.current,this.parent&&this.parent.children.add(this),this.update(this.props,this.presenceContext)}unmount(){Wm.delete(this.current),this.projection&&this.projection.unmount(),It(this.notifyUpdate),It(this.render),this.valueSubscriptions.forEach(n=>n()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent&&this.parent.children.delete(this);for(const n in this.events)this.events[n].clear();for(const n in this.features){const t=this.features[n];t&&(t.unmount(),t.isMounted=!1)}this.current=null}bindToMotionValue(n,t){this.valueSubscriptions.has(n)&&this.valueSubscriptions.get(n)();const r=br.has(n),i=t.on("change",a=>{this.latestValues[n]=a,this.props.onUpdate&&ue.preRender(this.notifyUpdate),r&&this.projection&&(this.projection.isTransformDirty=!0)}),s=t.on("renderRequest",this.scheduleRender);let o;window.MotionCheckAppearSync&&(o=window.MotionCheckAppearSync(this,n,t)),this.valueSubscriptions.set(n,()=>{i(),s(),o&&o(),t.owner&&t.stop()})}sortNodePosition(n){return!this.current||!this.sortInstanceNodePosition||this.type!==n.type?0:this.sortInstanceNodePosition(this.current,n.current)}updateFeatures(){let n="animation";for(n in di){const t=di[n];if(!t)continue;const{isEnabled:r,Feature:i}=t;if(!this.features[n]&&i&&r(this.props)&&(this.features[n]=new i(this)),this.features[n]){const s=this.features[n];s.isMounted?s.update():(s.mount(),s.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):ye()}getStaticValue(n){return this.latestValues[n]}setStaticValue(n,t){this.latestValues[n]=t}update(n,t){(n.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=n,this.prevPresenceContext=this.presenceContext,this.presenceContext=t;for(let r=0;r<Km.length;r++){const i=Km[r];this.propEventSubscriptions[i]&&(this.propEventSubscriptions[i](),delete this.propEventSubscriptions[i]);const s="on"+i,o=n[s];o&&(this.propEventSubscriptions[i]=this.on(i,o))}this.prevMotionValues=QE(this,this.scrapeMotionValuesFromProps(n,this.prevProps,this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue(),this.onUpdate&&this.onUpdate(this)}getProps(){return this.props}getVariant(n){return this.props.variants?this.props.variants[n]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(n){const t=this.getClosestVariantNode();if(t)return t.variantChildren&&t.variantChildren.add(n),()=>t.variantChildren.delete(n)}addValue(n,t){const r=this.values.get(n);t!==r&&(r&&this.removeValue(n),this.bindToMotionValue(n,t),this.values.set(n,t),this.latestValues[n]=t.get())}removeValue(n){this.values.delete(n);const t=this.valueSubscriptions.get(n);t&&(t(),this.valueSubscriptions.delete(n)),delete this.latestValues[n],this.removeValueFromRenderState(n,this.renderState)}hasValue(n){return this.values.has(n)}getValue(n,t){if(this.props.values&&this.props.values[n])return this.props.values[n];let r=this.values.get(n);return r===void 0&&t!==void 0&&(r=As(t===null?void 0:t,{owner:this}),this.addValue(n,r)),r}readValue(n,t){var r;let i=this.latestValues[n]!==void 0||!this.current?this.latestValues[n]:(r=this.getBaseTargetFromProps(this.props,n))!==null&&r!==void 0?r:this.readValueFromInstance(this.current,n,this.options);return i!=null&&(typeof i=="string"&&(j1(i)||y1(i))?i=parseFloat(i):!XE(i)&&Ft.test(t)&&(i=S1(n,t)),this.setBaseTarget(n,Ie(i)?i.get():i)),Ie(i)?i.get():i}setBaseTarget(n,t){this.baseTarget[n]=t}getBaseTarget(n){var t;const{initial:r}=this.props;let i;if(typeof r=="string"||typeof r=="object"){const o=vf(this.props,r,(t=this.presenceContext)===null||t===void 0?void 0:t.custom);o&&(i=o[n])}if(r&&i!==void 0)return i;const s=this.getBaseTargetFromProps(this.props,n);return s!==void 0&&!Ie(s)?s:this.initialValues[n]!==void 0&&i===void 0?void 0:this.baseTarget[n]}on(n,t){return this.events[n]||(this.events[n]=new Af),this.events[n].add(t)}notify(n,...t){this.events[n]&&this.events[n].notify(...t)}}class ox extends ZE{constructor(){super(...arguments),this.KeyframeResolver=A1}sortInstanceNodePosition(n,t){return n.compareDocumentPosition(t)&2?1:-1}getBaseTargetFromProps(n,t){return n.style?n.style[t]:void 0}removeValueFromRenderState(n,{vars:t,style:r}){delete t[n],delete r[n]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:n}=this.props;Ie(n)&&(this.childSubscription=n.on("change",t=>{this.current&&(this.current.textContent=`${t}`)}))}}function JE(e){return window.getComputedStyle(e)}class e5 extends ox{constructor(){super(...arguments),this.type="html",this.renderInstance=Ky}readValueFromInstance(n,t){if(br.has(t)){const r=Df(t);return r&&r.default||0}else{const r=JE(n),i=(Uy(t)?r.getPropertyValue(t):r[t])||0;return typeof i=="string"?i.trim():i}}measureInstanceViewportBox(n,{transformPagePoint:t}){return Y1(n,t)}build(n,t,r){_f(n,t,r.transformTemplate)}scrapeMotionValuesFromProps(n,t,r){return Sf(n,t,r)}}class n5 extends ox{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=ye}getBaseTargetFromProps(n,t){return n[t]}readValueFromInstance(n,t){if(br.has(t)){const r=Df(t);return r&&r.default||0}return t=Yy.has(t)?t:hf(t),n.getAttribute(t)}scrapeMotionValuesFromProps(n,t,r){return Qy(n,t,r)}build(n,t,r){wf(n,t,this.isSVGTag,r.transformTemplate)}renderInstance(n,t,r,i){Gy(n,t,r,i)}mount(n){this.isSVGTag=kf(n.tagName),super.mount(n)}}const t5=(e,n)=>gf(e)?new n5(n):new e5(n,{allowProjection:e!==S.Fragment}),r5=TT({...P3,...WE,...LE,...KE},t5),i5=Bj(r5);function s5({src:e,alt:n,onClose:t}){return S.useEffect(()=>{if(!e)return;function r(i){i.key==="Escape"&&t()}return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[e,t]),w.jsx(Lj,{children:e&&w.jsxs(i5.div,{className:"fixed inset-0 z-[10001] flex items-center justify-center bg-black/85",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},onClick:t,role:"dialog","aria-modal":"true","aria-label":"Image en plein écran",children:[w.jsx("img",{src:e,alt:n??"",className:"max-w-full max-h-full w-auto h-auto object-contain select-none",draggable:!1,onClick:r=>r.stopPropagation()}),w.jsx("button",{type:"button",onClick:t,className:"absolute top-4 right-4 z-[10002] inline-flex items-center justify-center rounded-full p-3 shadow border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50","aria-label":"Fermer",children:w.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-6",children:w.jsx("path",{fillRule:"evenodd",d:"M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z",clipRule:"evenodd"})})})]})})}const o5="/recettes-cuisine/".replace(/\/$/,"");function Ym(e){const n=e.flatMap(t=>t.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"").split(/\W+/).filter(r=>r.length>2));return new Set(n)}function a5(e,n){const t=new Set(n.tags),r=Ym(e.ingredients),i=Ym(n.ingredients);let s=0;for(const o of e.tags)t.has(o)&&(s+=2);for(const o of r)i.has(o)&&(s+=1);return s}function l5({recipe:e}){const n=Hs.filter(t=>t.slug!==e.slug).map(t=>({recipe:t,score:a5(e,t)})).filter(t=>t.score>0).sort((t,r)=>r.score-t.score||t.recipe.title.localeCompare(r.recipe.title)).slice(0,6).map(t=>t.recipe);return n.length===0?null:w.jsxs("div",{className:"mt-8",children:[w.jsx("h2",{className:"uppercase text-primary font-semibold mb-4",children:"Suggestions"}),w.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6",children:n.map(t=>w.jsxs(at,{to:`/recette/${t.slug}`,className:"recipe relative md:hover:scale-105 md:hover:rotate-1 transition",children:[w.jsx("img",{src:`${o5}/images/cards/${t.image}.webp`,alt:t.title,className:"aspect-video w-full rounded-xl bg-gray-100 mb-1 object-cover",loading:"lazy"}),w.jsx("h3",{className:"font-semibold leading-tight",children:t.title})]},t.slug))})]})}const u5="/recettes-cuisine/".replace(/\/$/,""),Gm="DSestu - Recettes de cuisine",c5="Recettes de cuisine maison",d5=`${u5}/assets/social.png`;function ht(e,n,t){let r=document.querySelector(e);if(!r){r=document.createElement("meta");const[i,s]=e.replace("[","").replace("]","").replace('"',"").replace('"',"").split("=");r.setAttribute(i.trim(),s.trim().replace(/"/g,"")),document.head.appendChild(r)}r.setAttribute(n,t)}function f5({title:e,description:n,image:t,url:r}){S.useEffect(()=>{const i=e?`${e} – Recettes`:Gm,s=n||c5,o=t||d5,a=r||window.location.href;return document.title=i,ht('meta[property="og:title"]',"content",i),ht('meta[property="og:description"]',"content",s),ht('meta[property="og:image"]',"content",o),ht('meta[property="og:url"]',"content",a),ht('meta[name="twitter:title"]',"content",i),ht('meta[name="twitter:description"]',"content",s),ht('meta[name="twitter:image"]',"content",o),ht('meta[property="twitter:url"]',"content",a),()=>{document.title=Gm}},[e,n,t,r])}const Xm="/recettes-cuisine/".replace(/\/$/,"");function p5(){const{slug:e}=Qb(),[n,t]=S.useState(null),r=Hs.find(a=>a.slug===e);if(!r)return w.jsxs("div",{className:"p-8 flex flex-col gap-4",children:[w.jsxs("p",{className:"text-orange-700",children:["Recette « ",e," » introuvable."]}),w.jsx(at,{to:"/",className:"text-primary underline",children:"← Retour à l'accueil"})]});const i=`${Xm}/images/full/${r.image}.webp`,s=`${Xm}/images/hero/${r.image}.webp`;f5({title:r.title,image:s});const o=r.tags.map(a=>encodeURIComponent(a)).join(",");return w.jsxs(w.Fragment,{children:[w.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 w-full md:overflow-x-hidden md:h-screen md:overflow-hidden",itemScope:!0,itemType:"http://schema.org/Recipe",children:[w.jsx(xP,{recipe:r,onZoom:()=>t(i)}),w.jsxs("article",{className:"post-content bg-orange-50 p-8 md:p-12 flex flex-col gap-12 h-full md:overflow-y-scroll md:overflow-x-hidden mb-24",style:{viewTransitionName:"vt-content"},children:[w.jsxs("header",{className:"flex flex-col gap-6 md:pt-16",children:[w.jsx("h1",{className:"recipe-title font-gelica text-primary text-left text-5xl lg:text-7xl font-bold",itemProp:"name",children:r.title}),w.jsx(Tj,{tags:r.tags}),w.jsx("div",{children:w.jsxs(at,{to:`/recherche?tags=${o}&viz=0&inf=1&autoScroll=1&open=tags`,className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white shadow-sm hover:opacity-90 transition border-2 border-white",children:[w.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"w-5 h-5",children:w.jsx("path",{fillRule:"evenodd",d:"M10.5 3.75a6.75 6.75 0 1 0 4.42 11.94l3.195 3.196a.75.75 0 1 0 1.06-1.06L15.98 14.63A6.75 6.75 0 0 0 10.5 3.75m-5.25 6.75a5.25 5.25 0 1 1 10.5 0a5.25 5.25 0 0 1-10.5 0",clipRule:"evenodd"})}),w.jsx("span",{children:w.jsx("strong",{children:"Recherches similaires"})})]})}),r.directions&&r.content.trim()&&w.jsx("div",{className:"text-left text-lg leading-loose [&>*]:mb-6 [&_a]:underline [&_a]:decoration-[3px] [&_a]:decoration-primary [&_a]:underline-offset-2",itemProp:"description",dangerouslySetInnerHTML:{__html:r.content}})]}),r.components&&w.jsx(zj,{componentTitles:r.components}),r.ingredients.length>0&&w.jsx(Py,{ingredients:r.ingredients}),r.directions?w.jsx(zy,{directions:r.directions}):w.jsx(Ty,{content:r.content}),r.components&&w.jsx(Ej,{componentTitles:r.components}),w.jsx(l5,{recipe:r})]})]}),w.jsx(s5,{src:n,alt:r.title,onClose:()=>t(null)})]})}const h5=`# Canonical recipe/component tags (easy-to-type: ASCII, e.g. oeufs not œufs, creme not crème).\r
# Each entry: id = canonical tag string; ingredient = true if physical ingredient (buy/use in dish), false for dish type/style/method.\r
# When adding a tag: if a similar tag exists (accent, plural, typo), use it; else append here with ingredient set appropriately.\r
- id: ail\r
  ingredient: true\r
- id: alcool\r
  ingredient: false\r
- id: algue\r
  ingredient: true\r
- id: algue hijiki\r
  ingredient: true\r
- id: algue sechee\r
  ingredient: true\r
- id: amandes\r
  ingredient: true\r
- id: amaretto\r
  ingredient: true\r
- id: ankake\r
  ingredient: true\r
- id: aonori\r
  ingredient: true\r
- id: aperitif\r
  ingredient: false\r
- id: asiatique\r
  ingredient: false\r
- id: asperges\r
  ingredient: true\r
- id: assaisonnement\r
  ingredient: false\r
- id: automne\r
  ingredient: false\r
- id: base\r
  ingredient: false\r
- id: basilic\r
  ingredient: true\r
- id: beignets\r
  ingredient: false\r
- id: beurre\r
  ingredient: false\r
- id: biscuits cuillere\r
  ingredient: true\r
- id: blanc d'oeuf\r
  ingredient: false\r
- id: bocuse\r
  ingredient: false\r
- id: boeuf\r
  ingredient: true\r
- id: boisson\r
  ingredient: false\r
- id: bonite\r
  ingredient: true\r
- id: bouillon\r
  ingredient: false\r
- id: bouillon blanc\r
  ingredient: true\r
- id: boulettes\r
  ingredient: false\r
- id: bouquet garni\r
  ingredient: true\r
- id: cacao\r
  ingredient: true\r
- id: cidre\r
  ingredient: true\r
- id: cafe\r
  ingredient: true\r
- id: caramel\r
  ingredient: true\r
- id: carotte\r
  ingredient: true\r
- id: carottes\r
  ingredient: true\r
- id: casserole\r
  ingredient: false\r
- id: cassonade\r
  ingredient: true\r
- id: cerfeuil\r
  ingredient: true\r
- id: chalumeau\r
  ingredient: false\r
- id: champignons\r
  ingredient: true\r
- id: chataigne\r
  ingredient: true\r
- id: chapelure\r
  ingredient: true\r
- id: char siu\r
  ingredient: true\r
- id: chaud\r
  ingredient: false\r
- id: chocolat\r
  ingredient: true\r
- id: chorizo\r
  ingredient: true\r
- id: chou\r
  ingredient: true\r
- id: chou-fleur\r
  ingredient: true\r
- id: choux de bruxelles\r
  ingredient: true\r
- id: chevre\r
  ingredient: true\r
- id: ciboulette\r
  ingredient: true\r
- id: citron\r
  ingredient: true\r
- id: classique\r
  ingredient: false\r
- id: clou de girofle\r
  ingredient: true\r
- id: clous de girofle\r
  ingredient: true\r
- id: cocktail\r
  ingredient: false\r
- id: composant\r
  ingredient: false\r
- id: concombre\r
  ingredient: true\r
- id: condiment\r
  ingredient: false\r
- id: confiture\r
  ingredient: true\r
- id: couennes\r
  ingredient: true\r
- id: crevettes\r
  ingredient: true\r
- id: croutons\r
  ingredient: true\r
- id: creme\r
  ingredient: true\r
- id: creme fraiche\r
  ingredient: true\r
- id: cuiseur a riz\r
  ingredient: false\r
- id: cuisse de poulet\r
  ingredient: true\r
- id: curry\r
  ingredient: true\r
- id: celeri\r
  ingredient: true\r
- id: dashi\r
  ingredient: true\r
- id: dessert\r
  ingredient: false\r
- id: eau\r
  ingredient: false\r
- id: edamame\r
  ingredient: true\r
- id: emilia\r
  ingredient: false\r
- id: emmental\r
  ingredient: true\r
- id: endives\r
  ingredient: true\r
- id: entree\r
  ingredient: false\r
- id: facile\r
  ingredient: false\r
- id: fait maison\r
  ingredient: false\r
- id: farine\r
  ingredient: true\r
- id: farine a gateau\r
  ingredient: true\r
- id: farine a pain\r
  ingredient: true\r
- id: fenouil\r
  ingredient: true\r
- id: flocons de tempura\r
  ingredient: true\r
- id: fond\r
  ingredient: false\r
- id: fond chinois\r
  ingredient: true\r
- id: fondant\r
  ingredient: false\r
- id: four\r
  ingredient: false\r
- id: frais\r
  ingredient: false\r
- id: framboises\r
  ingredient: true\r
- id: frit\r
  ingredient: false\r
- id: friture\r
  ingredient: false\r
- id: froid\r
  ingredient: false\r
- id: fromage\r
  ingredient: true\r
- id: fromage frais\r
  ingredient: true\r
- id: fruits\r
  ingredient: true\r
- id: feves de soja vertes\r
  ingredient: true\r
- id: fecule\r
  ingredient: true\r
- id: fecule de pomme de terre\r
  ingredient: true\r
- id: gingembre\r
  ingredient: true\r
- id: gingembre rouge\r
  ingredient: true\r
- id: gourmand\r
  ingredient: false\r
- id: gratin\r
  ingredient: false\r
- id: gruyere\r
  ingredient: true\r
- id: gateau\r
  ingredient: false\r
- id: haricots verts\r
  ingredient: true\r
- id: herbes aromatiques\r
  ingredient: true\r
- id: hiver\r
  ingredient: false\r
- id: huile\r
  ingredient: true\r
- id: huile d'arachide\r
  ingredient: true\r
- id: huile d'olive\r
  ingredient: true\r
- id: huile de friture\r
  ingredient: true\r
- id: huile de sesame\r
  ingredient: true\r
- id: japon\r
  ingredient: false\r
- id: jaunes d'oeufs\r
  ingredient: false\r
- id: jus d'ananas\r
  ingredient: true\r
- id: jus d'orange\r
  ingredient: true\r
- id: jus de banane\r
  ingredient: true\r
- id: jus de citron vert\r
  ingredient: true\r
- id: jus de goyave\r
  ingredient: true\r
- id: konbu\r
  ingredient: true\r
- id: lait\r
  ingredient: true\r
- id: lard\r
  ingredient: true\r
- id: lardons\r
  ingredient: true\r
- id: laurier\r
  ingredient: true\r
- id: lentilles corail\r
  ingredient: true\r
- id: levure\r
  ingredient: true\r
- id: levure de boulanger deshydratee\r
  ingredient: true\r
- id: limoncello\r
  ingredient: true\r
- id: legumes\r
  ingredient: true\r
- id: madere\r
  ingredient: true\r
- id: maquereau\r
  ingredient: true\r
- id: marbre\r
  ingredient: false\r
- id: margarine\r
  ingredient: true\r
- id: marinade\r
  ingredient: false\r
- id: marmiton\r
  ingredient: false\r
- id: marrons\r
  ingredient: true\r
- id: marsala\r
  ingredient: true\r
- id: mascarpone\r
  ingredient: true\r
- id: mayonnaise\r
  ingredient: true\r
- id: mediterranee\r
  ingredient: false\r
- id: miel\r
  ingredient: true\r
- id: mirin\r
  ingredient: true\r
- id: miso\r
  ingredient: true\r
- id: miso blanc\r
  ingredient: true\r
- id: moules\r
  ingredient: true\r
- id: moutarde\r
  ingredient: true\r
- id: muscade\r
  ingredient: true\r
- id: navets\r
  ingredient: true\r
- id: niban\r
  ingredient: true\r
- id: noix\r
  ingredient: true\r
- id: noix de muscade\r
  ingredient: true\r
- id: nouilles\r
  ingredient: true\r
- id: oignon\r
  ingredient: true\r
- id: oignons\r
  ingredient: true\r
- id: orge\r
  ingredient: true\r
- id: orge perle\r
  ingredient: true\r
- id: pain\r
  ingredient: true\r
- id: parmesan\r
  ingredient: true\r
- id: persil\r
  ingredient: true\r
- id: piment d'espelette\r
  ingredient: true\r
- id: pistaches\r
  ingredient: true\r
- id: pistaches natures\r
  ingredient: true\r
- id: plat\r
  ingredient: false\r
- id: plat principal\r
  ingredient: false\r
- id: poire\r
  ingredient: true\r
- id: poireau\r
  ingredient: true\r
- id: poireau japonais\r
  ingredient: true\r
- id: poireaux\r
  ingredient: true\r
- id: poisson\r
  ingredient: true\r
- id: poitrine de porc\r
  ingredient: true\r
- id: poivre\r
  ingredient: false\r
- id: pommes de terre\r
  ingredient: true\r
- id: porc\r
  ingredient: true\r
- id: porto\r
  ingredient: true\r
- id: potiron\r
  ingredient: true\r
- id: poulet\r
  ingredient: true\r
- id: pousses de radis\r
  ingredient: true\r
- id: pousses de soja\r
  ingredient: true\r
- id: poele\r
  ingredient: false\r
- id: prune salee\r
  ingredient: true\r
- id: pulpe de tomate\r
  ingredient: true\r
- id: punch\r
  ingredient: false\r
- id: pate levee\r
  ingredient: true\r
- id: pates\r
  ingredient: true\r
- id: pates fraiches\r
  ingredient: true\r
- id: quatre-quarts\r
  ingredient: false\r
- id: racine de bardane\r
  ingredient: true\r
- id: racine de lotus\r
  ingredient: true\r
- id: radis\r
  ingredient: true\r
- id: ramen\r
  ingredient: false\r
- id: rapide\r
  ingredient: false\r
- id: repas\r
  ingredient: false\r
- id: rhum\r
  ingredient: true\r
- id: ricotta\r
  ingredient: true\r
- id: riz\r
  ingredient: true\r
- id: risotto\r
  ingredient: false\r
- id: safran\r
  ingredient: true\r
- id: saindoux\r
  ingredient: true\r
- id: sake\r
  ingredient: true\r
- id: salade\r
  ingredient: false\r
- id: sauce\r
  ingredient: false\r
- id: sauce huitre\r
  ingredient: true\r
- id: sauce okonomiyaki\r
  ingredient: true\r
- id: sauce soja\r
  ingredient: true\r
- id: sauce soja claire\r
  ingredient: true\r
- id: sauce soja foncee\r
  ingredient: true\r
- id: sauce teriyaki\r
  ingredient: true\r
- id: saucisse de morteau\r
  ingredient: true\r
- id: saumon\r
  ingredient: true\r
- id: saute\r
  ingredient: false\r
- id: sel\r
  ingredient: false\r
- id: sestu\r
  ingredient: false\r
- id: shimeji\r
  ingredient: true\r
- id: shiso\r
  ingredient: true\r
- id: soja\r
  ingredient: true\r
- id: soupe\r
  ingredient: false\r
- id: speculoos\r
  ingredient: true\r
- id: sucre\r
  ingredient: true\r
- id: sucre de canne\r
  ingredient: true\r
- id: sucre en poudre\r
  ingredient: true\r
- id: sucre semoule\r
  ingredient: true\r
- id: sucre vanille\r
  ingredient: true\r
- id: sucre-sale\r
  ingredient: false\r
- id: sesame\r
  ingredient: true\r
- id: tartinade\r
  ingredient: false\r
- id: tahini\r
  ingredient: true\r
- id: teriyaki\r
  ingredient: true\r
- id: thon\r
  ingredient: true\r
- id: thym\r
  ingredient: true\r
- id: tiramisu\r
  ingredient: false\r
- id: tofu\r
  ingredient: true\r
- id: tomate cerise\r
  ingredient: true\r
- id: tomates\r
  ingredient: true\r
- id: tomates fraiches\r
  ingredient: true\r
- id: traditionnel\r
  ingredient: false\r
- id: vanille\r
  ingredient: true\r
- id: vanille liquide\r
  ingredient: true\r
- id: vapeur\r
  ingredient: false\r
- id: veloute\r
  ingredient: false\r
- id: viande\r
  ingredient: false\r
- id: viande de boeuf hachee\r
  ingredient: true\r
- id: vin blanc\r
  ingredient: true\r
- id: vinaigre\r
  ingredient: false\r
- id: vinaigre de vin\r
  ingredient: true\r
- id: vinaigrette\r
  ingredient: true\r
- id: voyage\r
  ingredient: false\r
- id: vegetarien\r
  ingredient: false\r
- id: yakitori\r
  ingredient: false\r
- id: yaourt\r
  ingredient: true\r
- id: echalotes\r
  ingredient: true\r
- id: epeautre\r
  ingredient: true\r
- id: ete\r
  ingredient: false\r
- id: oeufs\r
  ingredient: true\r
- id: saint-jacques\r
  ingredient: true\r
- id: canard\r
  ingredient: true\r
- id: clementine\r
  ingredient: true\r
- id: agrumes\r
  ingredient: true\r
- id: abricot\r
  ingredient: true\r
- id: coriandre\r
  ingredient: true\r
- id: noisettes\r
  ingredient: true\r
- id: biere\r
  ingredient: true\r
- id: butternut\r
  ingredient: true\r
- id: puree\r
  ingredient: true\r
- id: guanciale\r
  ingredient: true\r
- id: pecorino\r
  ingredient: true\r
- id: roquette\r
  ingredient: true\r
- id: brousse de brebis\r
  ingredient: true\r
- id: orange\r
  ingredient: true\r
- id: cointreau\r
  ingredient: true\r
- id: patate douce\r
  ingredient: true\r
- id: lait de coco\r
  ingredient: true\r
- id: girolles\r
  ingredient: true\r
- id: linguines\r
  ingredient: true\r
- id: lentilles vertes\r
  ingredient: true\r
- id: tomme de savoie\r
  ingredient: true\r
- id: cantal\r
  ingredient: true\r
- id: fromage blanc\r
  ingredient: true\r
- id: pappardelles\r
  ingredient: true\r
- id: bleu\r
  ingredient: true\r
- id: comte\r
  ingredient: true\r
- id: potimarron\r
  ingredient: true\r
- id: bacon\r
  ingredient: true\r
- id: agneau\r
  ingredient: true\r
- id: estragon\r
  ingredient: true\r
- id: sauge\r
  ingredient: true\r
- id: pancetta\r
  ingredient: true\r
- id: epinards\r
  ingredient: true\r
- id: penne\r
  ingredient: true\r
- id: frangipane\r
  ingredient: false\r
- id: poudre d'amande\r
  ingredient: true\r
- id: amandes effilees\r
  ingredient: true\r
- id: levure chimique\r
  ingredient: true\r
- id: tarte\r
  ingredient: false\r
- id: fumet de poisson\r
  ingredient: true\r
- id: bechamel\r
  ingredient: false\r
- id: feta\r
  ingredient: true\r
- id: mozzarella\r
  ingredient: true\r
- id: origan\r
  ingredient: true\r
- id: concentre de tomate\r
  ingredient: true\r
- id: gelatine\r
  ingredient: true\r
- id: biscuits secs\r
  ingredient: true\r
- id: peche\r
  ingredient: true\r
- id: maizena\r
  ingredient: true\r
- id: citron vert\r
  ingredient: true\r
- id: gnocchi\r
  ingredient: false\r
- id: pomme de terre\r
  ingredient: true\r
- id: coulis de tomate\r
  ingredient: true\r
- id: foie gras\r
  ingredient: true\r
- id: bouillon de volaille\r
  ingredient: true\r
- id: buche\r
  ingredient: false\r
- id: sucre glace\r
  ingredient: true\r
- id: genoise\r
  ingredient: false\r
- id: entremet\r
  ingredient: false\r
- id: kirsch\r
  ingredient: true\r
- id: perso\r
  ingredient: false\r
- id: fond de veau\r
  ingredient: true\r
- id: chasseur\r
  ingredient: false\r
- id: lapin\r
  ingredient: true\r
- id: pomme\r
  ingredient: true\r
- id: romarin\r
  ingredient: true\r
- id: calvados\r
  ingredient: true\r
- id: bavette\r
  ingredient: true\r
- id: vin rouge\r
  ingredient: true\r
- id: piment de cayenne\r
  ingredient: true\r
- id: haricots rouges
  ingredient: true
- id: veau
  ingredient: true
- id: poivre vert
  ingredient: true
- id: cognac
  ingredient: true
- id: sauce worcestershire
  ingredient: true
`,m5=Object.assign({"../../../_data/recipe_tags.yml":h5}),g5=Object.values(m5)[0]??"",Qm=eP(g5),ax=new Set(["de","du","des","la","le","les","et","ou","au","aux","en","sur","avec","sans","un","une","vos","mes","ses","nos","ces","ce","cette","pour","par","dans","g","gramme","grammes","kg","mg","ml","cl","l","litre","litres","cuillere","cuilleres","cac","cas","tasse","verre","pincee","tranche","tranches","gros","grosses","grandes","grand","petit","petite","petites","petits","noix","poignee","morceaux","morceau","environ","semi","epaisse","fraiche","fin","fins","fine","fines","bio","frais","fraichement","seche","sec","secs"]);function lx(e){return String(e).toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"").replace(/œ/g,"oe").replace(/[^a-z0-9\-\s']/g," ").replace(/\s+/g," ").trim()}function ls(e){return(e||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim()}function v5(e,n){if(!e)return!0;let t=0,r=0;for(;t<e.length&&r<n.length;)e[t]===n[r]&&t++,r++;return t===e.length}function ux(e){const n=e;return n.endsWith("es")&&n.length>4?n.slice(0,-2):n.endsWith("s")&&n.length>3||n.endsWith("x")&&n.length>3?n.slice(0,-1):n}function y5(e){if(!e)return[];const n=lx(String(e)).replace(/\d+[\w\s/.,-]*/g," ").split(/\s+/).map(t=>ux(t)).filter(t=>t.length>2&&!ax.has(t));return Array.from(new Set(n))}function Bi(e,n,t){if(n.size===0)return{matched:0,missing:0,included:!0};const r=new Set(e.tags.map(o=>String(o).trim()));let i=0,s=0;for(const o of n)r.has(o)?i++:s++;return{matched:i,missing:s,included:s<=t}}function x5(e,n){const t=ls(n);return t?e.filter(r=>{const i=ls(r.title);return i.includes(t)||v5(t,i)}):e}function Mi(e){const n=e.tags.map(r=>ux(lx(r))).filter(r=>r.length>2&&!ax.has(r)),t=e.ingredients.flatMap(r=>y5(r));return Array.from(new Set([...n,...t]))}function _5(e,n,t){const{linkMode:r="auto",weightMode:i="uniform",maxRecipes:s=60,maxIngredients:o=60,hideTopIngredients:a=0,showTokens:l=!0,showRecipes:u=!0,showComponents:c=!0,selectedTags:d=new Set,makeUrl:f=q=>`/recette/${q}`}=t,p=Math.max(1,n.length),v=new Map;for(const q of n)for(const P of new Set(Mi(q)))v.set(P,(v.get(P)||0)+1);const g=Array.from(v.entries()).sort((q,P)=>P[1]-q[1]),_=new Set;let h=0;for(const[q]of g){if(h<a){h++;continue}if(_.size>=o)break;_.add(q)}const m=[],y=[],x=new Map,k=new Map;let C=0;if(l)for(const q of _)x.set(q,C),m.push({id:C++,label:q,type:"tag"});const j=e.filter(q=>q.itemType==="component"?c:u).slice(0,s);for(const q of j)k.set(q.title,C),m.push({id:C++,label:q.title,type:q.itemType==="component"?"component":"recipe",url:f(q.slug)});const F=r==="recipe-token"||r==="auto"&&(u||c),I=r==="token-token"||r==="auto"&&!(u||c),O=r==="recipe-recipe";if(F)for(const q of j){const P=k.get(q.title);for(const L of new Set(Mi(q))){if(!_.has(L)||!l)continue;const E=v.get(L)||1,N=Math.log(1+p/E);let z=1;i==="idf"?z=N:i==="freq"?z=E:i==="select"&&(z=d.has(L)?2:1),y.push({source:P,target:x.get(L),weightRaw:z})}}else if(I&&l){const q=new Map;for(const P of n){const L=Array.from(new Set(Mi(P).filter(E=>_.has(E))));for(let E=0;E<L.length;E++)for(let N=E+1;N<L.length;N++){const z=L[E]<L[N]?L[E]:L[N],M=L[E]<L[N]?L[N]:L[E],R=`${z}||${M}`;q.set(R,(q.get(R)||0)+1)}}for(const[P,L]of q){const[E,N]=P.split("||");if(!x.has(E)||!x.has(N))continue;const z=v.get(E)||1,M=v.get(N)||1,R=Math.log(1+p/z),U=Math.log(1+p/M);let K=L;i==="idf"&&(K=L*(R+U)/2),y.push({source:x.get(E),target:x.get(N),weightRaw:K})}}else if(O)for(let q=0;q<j.length;q++)for(let P=q+1;P<j.length;P++){const L=j[q],E=j[P],N=new Set(Mi(L)),z=new Set(Mi(E));let M=0;for(const R of N)z.has(R)&&M++;M>0&&y.push({source:k.get(L.title),target:k.get(E.title),weightRaw:M})}const $=new Set;for(const q of y)$.add(q.source),$.add(q.target);return{nodes:m.filter(q=>$.has(q.id)),links:y.filter(q=>$.has(q.source)&&$.has(q.target))}}function Qo(e,n){return e==null||n==null?NaN:e<n?-1:e>n?1:e>=n?0:NaN}function w5(e,n){return e==null||n==null?NaN:n<e?-1:n>e?1:n>=e?0:NaN}function cx(e){let n,t,r;e.length!==2?(n=Qo,t=(a,l)=>Qo(e(a),l),r=(a,l)=>e(a)-l):(n=e===Qo||e===w5?e:b5,t=e,r=e);function i(a,l,u=0,c=a.length){if(u<c){if(n(l,l)!==0)return c;do{const d=u+c>>>1;t(a[d],l)<0?u=d+1:c=d}while(u<c)}return u}function s(a,l,u=0,c=a.length){if(u<c){if(n(l,l)!==0)return c;do{const d=u+c>>>1;t(a[d],l)<=0?u=d+1:c=d}while(u<c)}return u}function o(a,l,u=0,c=a.length){const d=i(a,l,u,c-1);return d>u&&r(a[d-1],l)>-r(a[d],l)?d-1:d}return{left:i,center:o,right:s}}function b5(){return 0}function k5(e){return e===null?NaN:+e}const S5=cx(Qo),C5=S5.right;cx(k5).center;function P5(e,n){let t,r;if(n===void 0)for(const i of e)i!=null&&(t===void 0?i>=i&&(t=r=i):(t>i&&(t=i),r<i&&(r=i)));else{let i=-1;for(let s of e)(s=n(s,++i,e))!=null&&(t===void 0?s>=s&&(t=r=s):(t>s&&(t=s),r<s&&(r=s)))}return[t,r]}const j5=Math.sqrt(50),T5=Math.sqrt(10),z5=Math.sqrt(2);function Oa(e,n,t){const r=(n-e)/Math.max(0,t),i=Math.floor(Math.log10(r)),s=r/Math.pow(10,i),o=s>=j5?10:s>=T5?5:s>=z5?2:1;let a,l,u;return i<0?(u=Math.pow(10,-i)/o,a=Math.round(e*u),l=Math.round(n*u),a/u<e&&++a,l/u>n&&--l,u=-u):(u=Math.pow(10,i)*o,a=Math.round(e/u),l=Math.round(n/u),a*u<e&&++a,l*u>n&&--l),l<a&&.5<=t&&t<2?Oa(e,n,t*2):[a,l,u]}function E5(e,n,t){if(n=+n,e=+e,t=+t,!(t>0))return[];if(e===n)return[e];const r=n<e,[i,s,o]=r?Oa(n,e,t):Oa(e,n,t);if(!(s>=i))return[];const a=s-i+1,l=new Array(a);if(r)if(o<0)for(let u=0;u<a;++u)l[u]=(s-u)/-o;else for(let u=0;u<a;++u)l[u]=(s-u)*o;else if(o<0)for(let u=0;u<a;++u)l[u]=(i+u)/-o;else for(let u=0;u<a;++u)l[u]=(i+u)*o;return l}function Bc(e,n,t){return n=+n,e=+e,t=+t,Oa(e,n,t)[2]}function A5(e,n,t){n=+n,e=+e,t=+t;const r=n<e,i=r?Bc(n,e,t):Bc(e,n,t);return(r?-1:1)*(i<0?1/-i:i)}var M5={value:()=>{}};function Zs(){for(var e=0,n=arguments.length,t={},r;e<n;++e){if(!(r=arguments[e]+"")||r in t||/[\s.]/.test(r))throw new Error("illegal type: "+r);t[r]=[]}return new Zo(t)}function Zo(e){this._=e}function R5(e,n){return e.trim().split(/^|\s+/).map(function(t){var r="",i=t.indexOf(".");if(i>=0&&(r=t.slice(i+1),t=t.slice(0,i)),t&&!n.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:r}})}Zo.prototype=Zs.prototype={constructor:Zo,on:function(e,n){var t=this._,r=R5(e+"",t),i,s=-1,o=r.length;if(arguments.length<2){for(;++s<o;)if((i=(e=r[s]).type)&&(i=N5(t[i],e.name)))return i;return}if(n!=null&&typeof n!="function")throw new Error("invalid callback: "+n);for(;++s<o;)if(i=(e=r[s]).type)t[i]=Zm(t[i],e.name,n);else if(n==null)for(i in t)t[i]=Zm(t[i],e.name,null);return this},copy:function(){var e={},n=this._;for(var t in n)e[t]=n[t].slice();return new Zo(e)},call:function(e,n){if((i=arguments.length-2)>0)for(var t=new Array(i),r=0,i,s;r<i;++r)t[r]=arguments[r+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(s=this._[e],r=0,i=s.length;r<i;++r)s[r].value.apply(n,t)},apply:function(e,n,t){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var r=this._[e],i=0,s=r.length;i<s;++i)r[i].value.apply(n,t)}};function N5(e,n){for(var t=0,r=e.length,i;t<r;++t)if((i=e[t]).name===n)return i.value}function Zm(e,n,t){for(var r=0,i=e.length;r<i;++r)if(e[r].name===n){e[r]=M5,e=e.slice(0,r).concat(e.slice(r+1));break}return t!=null&&e.push({name:n,value:t}),e}var Uc="http://www.w3.org/1999/xhtml";const Jm={svg:"http://www.w3.org/2000/svg",xhtml:Uc,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function jl(e){var n=e+="",t=n.indexOf(":");return t>=0&&(n=e.slice(0,t))!=="xmlns"&&(e=e.slice(t+1)),Jm.hasOwnProperty(n)?{space:Jm[n],local:e}:e}function L5(e){return function(){var n=this.ownerDocument,t=this.namespaceURI;return t===Uc&&n.documentElement.namespaceURI===Uc?n.createElement(e):n.createElementNS(t,e)}}function D5(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function dx(e){var n=jl(e);return(n.local?D5:L5)(n)}function I5(){}function $f(e){return e==null?I5:function(){return this.querySelector(e)}}function F5(e){typeof e!="function"&&(e=$f(e));for(var n=this._groups,t=n.length,r=new Array(t),i=0;i<t;++i)for(var s=n[i],o=s.length,a=r[i]=new Array(o),l,u,c=0;c<o;++c)(l=s[c])&&(u=e.call(l,l.__data__,c,s))&&("__data__"in l&&(u.__data__=l.__data__),a[c]=u);return new cn(r,this._parents)}function q5(e){return e==null?[]:Array.isArray(e)?e:Array.from(e)}function V5(){return[]}function fx(e){return e==null?V5:function(){return this.querySelectorAll(e)}}function $5(e){return function(){return q5(e.apply(this,arguments))}}function O5(e){typeof e=="function"?e=$5(e):e=fx(e);for(var n=this._groups,t=n.length,r=[],i=[],s=0;s<t;++s)for(var o=n[s],a=o.length,l,u=0;u<a;++u)(l=o[u])&&(r.push(e.call(l,l.__data__,u,o)),i.push(l));return new cn(r,i)}function px(e){return function(){return this.matches(e)}}function hx(e){return function(n){return n.matches(e)}}var B5=Array.prototype.find;function U5(e){return function(){return B5.call(this.children,e)}}function H5(){return this.firstElementChild}function W5(e){return this.select(e==null?H5:U5(typeof e=="function"?e:hx(e)))}var K5=Array.prototype.filter;function Y5(){return Array.from(this.children)}function G5(e){return function(){return K5.call(this.children,e)}}function X5(e){return this.selectAll(e==null?Y5:G5(typeof e=="function"?e:hx(e)))}function Q5(e){typeof e!="function"&&(e=px(e));for(var n=this._groups,t=n.length,r=new Array(t),i=0;i<t;++i)for(var s=n[i],o=s.length,a=r[i]=[],l,u=0;u<o;++u)(l=s[u])&&e.call(l,l.__data__,u,s)&&a.push(l);return new cn(r,this._parents)}function mx(e){return new Array(e.length)}function Z5(){return new cn(this._enter||this._groups.map(mx),this._parents)}function Ba(e,n){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=n}Ba.prototype={constructor:Ba,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,n){return this._parent.insertBefore(e,n)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};function J5(e){return function(){return e}}function eA(e,n,t,r,i,s){for(var o=0,a,l=n.length,u=s.length;o<u;++o)(a=n[o])?(a.__data__=s[o],r[o]=a):t[o]=new Ba(e,s[o]);for(;o<l;++o)(a=n[o])&&(i[o]=a)}function nA(e,n,t,r,i,s,o){var a,l,u=new Map,c=n.length,d=s.length,f=new Array(c),p;for(a=0;a<c;++a)(l=n[a])&&(f[a]=p=o.call(l,l.__data__,a,n)+"",u.has(p)?i[a]=l:u.set(p,l));for(a=0;a<d;++a)p=o.call(e,s[a],a,s)+"",(l=u.get(p))?(r[a]=l,l.__data__=s[a],u.delete(p)):t[a]=new Ba(e,s[a]);for(a=0;a<c;++a)(l=n[a])&&u.get(f[a])===l&&(i[a]=l)}function tA(e){return e.__data__}function rA(e,n){if(!arguments.length)return Array.from(this,tA);var t=n?nA:eA,r=this._parents,i=this._groups;typeof e!="function"&&(e=J5(e));for(var s=i.length,o=new Array(s),a=new Array(s),l=new Array(s),u=0;u<s;++u){var c=r[u],d=i[u],f=d.length,p=iA(e.call(c,c&&c.__data__,u,r)),v=p.length,g=a[u]=new Array(v),_=o[u]=new Array(v),h=l[u]=new Array(f);t(c,d,g,_,h,p,n);for(var m=0,y=0,x,k;m<v;++m)if(x=g[m]){for(m>=y&&(y=m+1);!(k=_[y])&&++y<v;);x._next=k||null}}return o=new cn(o,r),o._enter=a,o._exit=l,o}function iA(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function sA(){return new cn(this._exit||this._groups.map(mx),this._parents)}function oA(e,n,t){var r=this.enter(),i=this,s=this.exit();return typeof e=="function"?(r=e(r),r&&(r=r.selection())):r=r.append(e+""),n!=null&&(i=n(i),i&&(i=i.selection())),t==null?s.remove():t(s),r&&i?r.merge(i).order():i}function aA(e){for(var n=e.selection?e.selection():e,t=this._groups,r=n._groups,i=t.length,s=r.length,o=Math.min(i,s),a=new Array(i),l=0;l<o;++l)for(var u=t[l],c=r[l],d=u.length,f=a[l]=new Array(d),p,v=0;v<d;++v)(p=u[v]||c[v])&&(f[v]=p);for(;l<i;++l)a[l]=t[l];return new cn(a,this._parents)}function lA(){for(var e=this._groups,n=-1,t=e.length;++n<t;)for(var r=e[n],i=r.length-1,s=r[i],o;--i>=0;)(o=r[i])&&(s&&o.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(o,s),s=o);return this}function uA(e){e||(e=cA);function n(d,f){return d&&f?e(d.__data__,f.__data__):!d-!f}for(var t=this._groups,r=t.length,i=new Array(r),s=0;s<r;++s){for(var o=t[s],a=o.length,l=i[s]=new Array(a),u,c=0;c<a;++c)(u=o[c])&&(l[c]=u);l.sort(n)}return new cn(i,this._parents).order()}function cA(e,n){return e<n?-1:e>n?1:e>=n?0:NaN}function dA(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this}function fA(){return Array.from(this)}function pA(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],i=0,s=r.length;i<s;++i){var o=r[i];if(o)return o}return null}function hA(){let e=0;for(const n of this)++e;return e}function mA(){return!this.node()}function gA(e){for(var n=this._groups,t=0,r=n.length;t<r;++t)for(var i=n[t],s=0,o=i.length,a;s<o;++s)(a=i[s])&&e.call(a,a.__data__,s,i);return this}function vA(e){return function(){this.removeAttribute(e)}}function yA(e){return function(){this.removeAttributeNS(e.space,e.local)}}function xA(e,n){return function(){this.setAttribute(e,n)}}function _A(e,n){return function(){this.setAttributeNS(e.space,e.local,n)}}function wA(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttribute(e):this.setAttribute(e,t)}}function bA(e,n){return function(){var t=n.apply(this,arguments);t==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,t)}}function kA(e,n){var t=jl(e);if(arguments.length<2){var r=this.node();return t.local?r.getAttributeNS(t.space,t.local):r.getAttribute(t)}return this.each((n==null?t.local?yA:vA:typeof n=="function"?t.local?bA:wA:t.local?_A:xA)(t,n))}function gx(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function SA(e){return function(){this.style.removeProperty(e)}}function CA(e,n,t){return function(){this.style.setProperty(e,n,t)}}function PA(e,n,t){return function(){var r=n.apply(this,arguments);r==null?this.style.removeProperty(e):this.style.setProperty(e,r,t)}}function jA(e,n,t){return arguments.length>1?this.each((n==null?SA:typeof n=="function"?PA:CA)(e,n,t??"")):pi(this.node(),e)}function pi(e,n){return e.style.getPropertyValue(n)||gx(e).getComputedStyle(e,null).getPropertyValue(n)}function TA(e){return function(){delete this[e]}}function zA(e,n){return function(){this[e]=n}}function EA(e,n){return function(){var t=n.apply(this,arguments);t==null?delete this[e]:this[e]=t}}function AA(e,n){return arguments.length>1?this.each((n==null?TA:typeof n=="function"?EA:zA)(e,n)):this.node()[e]}function vx(e){return e.trim().split(/^|\s+/)}function Of(e){return e.classList||new yx(e)}function yx(e){this._node=e,this._names=vx(e.getAttribute("class")||"")}yx.prototype={add:function(e){var n=this._names.indexOf(e);n<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var n=this._names.indexOf(e);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};function xx(e,n){for(var t=Of(e),r=-1,i=n.length;++r<i;)t.add(n[r])}function _x(e,n){for(var t=Of(e),r=-1,i=n.length;++r<i;)t.remove(n[r])}function MA(e){return function(){xx(this,e)}}function RA(e){return function(){_x(this,e)}}function NA(e,n){return function(){(n.apply(this,arguments)?xx:_x)(this,e)}}function LA(e,n){var t=vx(e+"");if(arguments.length<2){for(var r=Of(this.node()),i=-1,s=t.length;++i<s;)if(!r.contains(t[i]))return!1;return!0}return this.each((typeof n=="function"?NA:n?MA:RA)(t,n))}function DA(){this.textContent=""}function IA(e){return function(){this.textContent=e}}function FA(e){return function(){var n=e.apply(this,arguments);this.textContent=n??""}}function qA(e){return arguments.length?this.each(e==null?DA:(typeof e=="function"?FA:IA)(e)):this.node().textContent}function VA(){this.innerHTML=""}function $A(e){return function(){this.innerHTML=e}}function OA(e){return function(){var n=e.apply(this,arguments);this.innerHTML=n??""}}function BA(e){return arguments.length?this.each(e==null?VA:(typeof e=="function"?OA:$A)(e)):this.node().innerHTML}function UA(){this.nextSibling&&this.parentNode.appendChild(this)}function HA(){return this.each(UA)}function WA(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function KA(){return this.each(WA)}function YA(e){var n=typeof e=="function"?e:dx(e);return this.select(function(){return this.appendChild(n.apply(this,arguments))})}function GA(){return null}function XA(e,n){var t=typeof e=="function"?e:dx(e),r=n==null?GA:typeof n=="function"?n:$f(n);return this.select(function(){return this.insertBefore(t.apply(this,arguments),r.apply(this,arguments)||null)})}function QA(){var e=this.parentNode;e&&e.removeChild(this)}function ZA(){return this.each(QA)}function JA(){var e=this.cloneNode(!1),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function eM(){var e=this.cloneNode(!0),n=this.parentNode;return n?n.insertBefore(e,this.nextSibling):e}function nM(e){return this.select(e?eM:JA)}function tM(e){return arguments.length?this.property("__data__",e):this.node().__data__}function rM(e){return function(n){e.call(this,n,this.__data__)}}function iM(e){return e.trim().split(/^|\s+/).map(function(n){var t="",r=n.indexOf(".");return r>=0&&(t=n.slice(r+1),n=n.slice(0,r)),{type:n,name:t}})}function sM(e){return function(){var n=this.__on;if(n){for(var t=0,r=-1,i=n.length,s;t<i;++t)s=n[t],(!e.type||s.type===e.type)&&s.name===e.name?this.removeEventListener(s.type,s.listener,s.options):n[++r]=s;++r?n.length=r:delete this.__on}}}function oM(e,n,t){return function(){var r=this.__on,i,s=rM(n);if(r){for(var o=0,a=r.length;o<a;++o)if((i=r[o]).type===e.type&&i.name===e.name){this.removeEventListener(i.type,i.listener,i.options),this.addEventListener(i.type,i.listener=s,i.options=t),i.value=n;return}}this.addEventListener(e.type,s,t),i={type:e.type,name:e.name,value:n,listener:s,options:t},r?r.push(i):this.__on=[i]}}function aM(e,n,t){var r=iM(e+""),i,s=r.length,o;if(arguments.length<2){var a=this.node().__on;if(a){for(var l=0,u=a.length,c;l<u;++l)for(i=0,c=a[l];i<s;++i)if((o=r[i]).type===c.type&&o.name===c.name)return c.value}return}for(a=n?oM:sM,i=0;i<s;++i)this.each(a(r[i],n,t));return this}function wx(e,n,t){var r=gx(e),i=r.CustomEvent;typeof i=="function"?i=new i(n,t):(i=r.document.createEvent("Event"),t?(i.initEvent(n,t.bubbles,t.cancelable),i.detail=t.detail):i.initEvent(n,!1,!1)),e.dispatchEvent(i)}function lM(e,n){return function(){return wx(this,e,n)}}function uM(e,n){return function(){return wx(this,e,n.apply(this,arguments))}}function cM(e,n){return this.each((typeof n=="function"?uM:lM)(e,n))}function*dM(){for(var e=this._groups,n=0,t=e.length;n<t;++n)for(var r=e[n],i=0,s=r.length,o;i<s;++i)(o=r[i])&&(yield o)}var bx=[null];function cn(e,n){this._groups=e,this._parents=n}function Js(){return new cn([[document.documentElement]],bx)}function fM(){return this}cn.prototype=Js.prototype={constructor:cn,select:F5,selectAll:O5,selectChild:W5,selectChildren:X5,filter:Q5,data:rA,enter:Z5,exit:sA,join:oA,merge:aA,selection:fM,order:lA,sort:uA,call:dA,nodes:fA,node:pA,size:hA,empty:mA,each:gA,attr:kA,style:jA,property:AA,classed:LA,text:qA,html:BA,raise:HA,lower:KA,append:YA,insert:XA,remove:ZA,clone:nM,datum:tM,on:aM,dispatch:cM,[Symbol.iterator]:dM};function Fn(e){return typeof e=="string"?new cn([[document.querySelector(e)]],[document.documentElement]):new cn([[e]],bx)}function pM(e){let n;for(;n=e.sourceEvent;)e=n;return e}function Yn(e,n){if(e=pM(e),n===void 0&&(n=e.currentTarget),n){var t=n.ownerSVGElement||n;if(t.createSVGPoint){var r=t.createSVGPoint();return r.x=e.clientX,r.y=e.clientY,r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}if(n.getBoundingClientRect){var i=n.getBoundingClientRect();return[e.clientX-i.left-n.clientLeft,e.clientY-i.top-n.clientTop]}}return[e.pageX,e.pageY]}const hM={passive:!1},Ns={capture:!0,passive:!1};function Su(e){e.stopImmediatePropagation()}function Jr(e){e.preventDefault(),e.stopImmediatePropagation()}function kx(e){var n=e.document.documentElement,t=Fn(e).on("dragstart.drag",Jr,Ns);"onselectstart"in n?t.on("selectstart.drag",Jr,Ns):(n.__noselect=n.style.MozUserSelect,n.style.MozUserSelect="none")}function Sx(e,n){var t=e.document.documentElement,r=Fn(e).on("dragstart.drag",null);n&&(r.on("click.drag",Jr,Ns),setTimeout(function(){r.on("click.drag",null)},0)),"onselectstart"in t?r.on("selectstart.drag",null):(t.style.MozUserSelect=t.__noselect,delete t.__noselect)}const zo=e=>()=>e;function Hc(e,{sourceEvent:n,subject:t,target:r,identifier:i,active:s,x:o,y:a,dx:l,dy:u,dispatch:c}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:n,enumerable:!0,configurable:!0},subject:{value:t,enumerable:!0,configurable:!0},target:{value:r,enumerable:!0,configurable:!0},identifier:{value:i,enumerable:!0,configurable:!0},active:{value:s,enumerable:!0,configurable:!0},x:{value:o,enumerable:!0,configurable:!0},y:{value:a,enumerable:!0,configurable:!0},dx:{value:l,enumerable:!0,configurable:!0},dy:{value:u,enumerable:!0,configurable:!0},_:{value:c}})}Hc.prototype.on=function(){var e=this._.on.apply(this._,arguments);return e===this._?this:e};function mM(e){return!e.ctrlKey&&!e.button}function gM(){return this.parentNode}function vM(e,n){return n??{x:e.x,y:e.y}}function yM(){return navigator.maxTouchPoints||"ontouchstart"in this}function xM(){var e=mM,n=gM,t=vM,r=yM,i={},s=Zs("start","drag","end"),o=0,a,l,u,c,d=0;function f(x){x.on("mousedown.drag",p).filter(r).on("touchstart.drag",_).on("touchmove.drag",h,hM).on("touchend.drag touchcancel.drag",m).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function p(x,k){if(!(c||!e.call(this,x,k))){var C=y(this,n.call(this,x,k),x,k,"mouse");C&&(Fn(x.view).on("mousemove.drag",v,Ns).on("mouseup.drag",g,Ns),kx(x.view),Su(x),u=!1,a=x.clientX,l=x.clientY,C("start",x))}}function v(x){if(Jr(x),!u){var k=x.clientX-a,C=x.clientY-l;u=k*k+C*C>d}i.mouse("drag",x)}function g(x){Fn(x.view).on("mousemove.drag mouseup.drag",null),Sx(x.view,u),Jr(x),i.mouse("end",x)}function _(x,k){if(e.call(this,x,k)){var C=x.changedTouches,T=n.call(this,x,k),j=C.length,F,I;for(F=0;F<j;++F)(I=y(this,T,x,k,C[F].identifier,C[F]))&&(Su(x),I("start",x,C[F]))}}function h(x){var k=x.changedTouches,C=k.length,T,j;for(T=0;T<C;++T)(j=i[k[T].identifier])&&(Jr(x),j("drag",x,k[T]))}function m(x){var k=x.changedTouches,C=k.length,T,j;for(c&&clearTimeout(c),c=setTimeout(function(){c=null},500),T=0;T<C;++T)(j=i[k[T].identifier])&&(Su(x),j("end",x,k[T]))}function y(x,k,C,T,j,F){var I=s.copy(),O=Yn(F||C,k),$,q,P;if((P=t.call(x,new Hc("beforestart",{sourceEvent:C,target:f,identifier:j,active:o,x:O[0],y:O[1],dx:0,dy:0,dispatch:I}),T))!=null)return $=P.x-O[0]||0,q=P.y-O[1]||0,function L(E,N,z){var M=O,R;switch(E){case"start":i[j]=L,R=o++;break;case"end":delete i[j],--o;case"drag":O=Yn(z||N,k),R=o;break}I.call(E,x,new Hc(E,{sourceEvent:N,subject:P,target:f,identifier:j,active:R,x:O[0]+$,y:O[1]+q,dx:O[0]-M[0],dy:O[1]-M[1],dispatch:I}),T)}}return f.filter=function(x){return arguments.length?(e=typeof x=="function"?x:zo(!!x),f):e},f.container=function(x){return arguments.length?(n=typeof x=="function"?x:zo(x),f):n},f.subject=function(x){return arguments.length?(t=typeof x=="function"?x:zo(x),f):t},f.touchable=function(x){return arguments.length?(r=typeof x=="function"?x:zo(!!x),f):r},f.on=function(){var x=s.on.apply(s,arguments);return x===s?f:x},f.clickDistance=function(x){return arguments.length?(d=(x=+x)*x,f):Math.sqrt(d)},f}function Bf(e,n,t){e.prototype=n.prototype=t,t.constructor=e}function Cx(e,n){var t=Object.create(e.prototype);for(var r in n)t[r]=n[r];return t}function eo(){}var Ls=.7,Ua=1/Ls,ei="\\s*([+-]?\\d+)\\s*",Ds="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",Un="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",_M=/^#([0-9a-f]{3,8})$/,wM=new RegExp(`^rgb\\(${ei},${ei},${ei}\\)$`),bM=new RegExp(`^rgb\\(${Un},${Un},${Un}\\)$`),kM=new RegExp(`^rgba\\(${ei},${ei},${ei},${Ds}\\)$`),SM=new RegExp(`^rgba\\(${Un},${Un},${Un},${Ds}\\)$`),CM=new RegExp(`^hsl\\(${Ds},${Un},${Un}\\)$`),PM=new RegExp(`^hsla\\(${Ds},${Un},${Un},${Ds}\\)$`),eg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Bf(eo,mr,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:ng,formatHex:ng,formatHex8:jM,formatHsl:TM,formatRgb:tg,toString:tg});function ng(){return this.rgb().formatHex()}function jM(){return this.rgb().formatHex8()}function TM(){return Px(this).formatHsl()}function tg(){return this.rgb().formatRgb()}function mr(e){var n,t;return e=(e+"").trim().toLowerCase(),(n=_M.exec(e))?(t=n[1].length,n=parseInt(n[1],16),t===6?rg(n):t===3?new Ze(n>>8&15|n>>4&240,n>>4&15|n&240,(n&15)<<4|n&15,1):t===8?Eo(n>>24&255,n>>16&255,n>>8&255,(n&255)/255):t===4?Eo(n>>12&15|n>>8&240,n>>8&15|n>>4&240,n>>4&15|n&240,((n&15)<<4|n&15)/255):null):(n=wM.exec(e))?new Ze(n[1],n[2],n[3],1):(n=bM.exec(e))?new Ze(n[1]*255/100,n[2]*255/100,n[3]*255/100,1):(n=kM.exec(e))?Eo(n[1],n[2],n[3],n[4]):(n=SM.exec(e))?Eo(n[1]*255/100,n[2]*255/100,n[3]*255/100,n[4]):(n=CM.exec(e))?og(n[1],n[2]/100,n[3]/100,1):(n=PM.exec(e))?og(n[1],n[2]/100,n[3]/100,n[4]):eg.hasOwnProperty(e)?rg(eg[e]):e==="transparent"?new Ze(NaN,NaN,NaN,0):null}function rg(e){return new Ze(e>>16&255,e>>8&255,e&255,1)}function Eo(e,n,t,r){return r<=0&&(e=n=t=NaN),new Ze(e,n,t,r)}function zM(e){return e instanceof eo||(e=mr(e)),e?(e=e.rgb(),new Ze(e.r,e.g,e.b,e.opacity)):new Ze}function Wc(e,n,t,r){return arguments.length===1?zM(e):new Ze(e,n,t,r??1)}function Ze(e,n,t,r){this.r=+e,this.g=+n,this.b=+t,this.opacity=+r}Bf(Ze,Wc,Cx(eo,{brighter(e){return e=e==null?Ua:Math.pow(Ua,e),new Ze(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=e==null?Ls:Math.pow(Ls,e),new Ze(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new Ze(lr(this.r),lr(this.g),lr(this.b),Ha(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:ig,formatHex:ig,formatHex8:EM,formatRgb:sg,toString:sg}));function ig(){return`#${tr(this.r)}${tr(this.g)}${tr(this.b)}`}function EM(){return`#${tr(this.r)}${tr(this.g)}${tr(this.b)}${tr((isNaN(this.opacity)?1:this.opacity)*255)}`}function sg(){const e=Ha(this.opacity);return`${e===1?"rgb(":"rgba("}${lr(this.r)}, ${lr(this.g)}, ${lr(this.b)}${e===1?")":`, ${e})`}`}function Ha(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function lr(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function tr(e){return e=lr(e),(e<16?"0":"")+e.toString(16)}function og(e,n,t,r){return r<=0?e=n=t=NaN:t<=0||t>=1?e=n=NaN:n<=0&&(e=NaN),new zn(e,n,t,r)}function Px(e){if(e instanceof zn)return new zn(e.h,e.s,e.l,e.opacity);if(e instanceof eo||(e=mr(e)),!e)return new zn;if(e instanceof zn)return e;e=e.rgb();var n=e.r/255,t=e.g/255,r=e.b/255,i=Math.min(n,t,r),s=Math.max(n,t,r),o=NaN,a=s-i,l=(s+i)/2;return a?(n===s?o=(t-r)/a+(t<r)*6:t===s?o=(r-n)/a+2:o=(n-t)/a+4,a/=l<.5?s+i:2-s-i,o*=60):a=l>0&&l<1?0:o,new zn(o,a,l,e.opacity)}function AM(e,n,t,r){return arguments.length===1?Px(e):new zn(e,n,t,r??1)}function zn(e,n,t,r){this.h=+e,this.s=+n,this.l=+t,this.opacity=+r}Bf(zn,AM,Cx(eo,{brighter(e){return e=e==null?Ua:Math.pow(Ua,e),new zn(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?Ls:Math.pow(Ls,e),new zn(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+(this.h<0)*360,n=isNaN(e)||isNaN(this.s)?0:this.s,t=this.l,r=t+(t<.5?t:1-t)*n,i=2*t-r;return new Ze(Cu(e>=240?e-240:e+120,i,r),Cu(e,i,r),Cu(e<120?e+240:e-120,i,r),this.opacity)},clamp(){return new zn(ag(this.h),Ao(this.s),Ao(this.l),Ha(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=Ha(this.opacity);return`${e===1?"hsl(":"hsla("}${ag(this.h)}, ${Ao(this.s)*100}%, ${Ao(this.l)*100}%${e===1?")":`, ${e})`}`}}));function ag(e){return e=(e||0)%360,e<0?e+360:e}function Ao(e){return Math.max(0,Math.min(1,e||0))}function Cu(e,n,t){return(e<60?n+(t-n)*e/60:e<180?t:e<240?n+(t-n)*(240-e)/60:n)*255}const Uf=e=>()=>e;function MM(e,n){return function(t){return e+t*n}}function RM(e,n,t){return e=Math.pow(e,t),n=Math.pow(n,t)-e,t=1/t,function(r){return Math.pow(e+r*n,t)}}function NM(e){return(e=+e)==1?jx:function(n,t){return t-n?RM(n,t,e):Uf(isNaN(n)?t:n)}}function jx(e,n){var t=n-e;return t?MM(e,t):Uf(isNaN(e)?n:e)}const Wa=function e(n){var t=NM(n);function r(i,s){var o=t((i=Wc(i)).r,(s=Wc(s)).r),a=t(i.g,s.g),l=t(i.b,s.b),u=jx(i.opacity,s.opacity);return function(c){return i.r=o(c),i.g=a(c),i.b=l(c),i.opacity=u(c),i+""}}return r.gamma=e,r}(1);function LM(e,n){n||(n=[]);var t=e?Math.min(n.length,e.length):0,r=n.slice(),i;return function(s){for(i=0;i<t;++i)r[i]=e[i]*(1-s)+n[i]*s;return r}}function DM(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function IM(e,n){var t=n?n.length:0,r=e?Math.min(t,e.length):0,i=new Array(r),s=new Array(t),o;for(o=0;o<r;++o)i[o]=Hf(e[o],n[o]);for(;o<t;++o)s[o]=n[o];return function(a){for(o=0;o<r;++o)s[o]=i[o](a);return s}}function FM(e,n){var t=new Date;return e=+e,n=+n,function(r){return t.setTime(e*(1-r)+n*r),t}}function Tn(e,n){return e=+e,n=+n,function(t){return e*(1-t)+n*t}}function qM(e,n){var t={},r={},i;(e===null||typeof e!="object")&&(e={}),(n===null||typeof n!="object")&&(n={});for(i in n)i in e?t[i]=Hf(e[i],n[i]):r[i]=n[i];return function(s){for(i in t)r[i]=t[i](s);return r}}var Kc=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Pu=new RegExp(Kc.source,"g");function VM(e){return function(){return e}}function $M(e){return function(n){return e(n)+""}}function Tx(e,n){var t=Kc.lastIndex=Pu.lastIndex=0,r,i,s,o=-1,a=[],l=[];for(e=e+"",n=n+"";(r=Kc.exec(e))&&(i=Pu.exec(n));)(s=i.index)>t&&(s=n.slice(t,s),a[o]?a[o]+=s:a[++o]=s),(r=r[0])===(i=i[0])?a[o]?a[o]+=i:a[++o]=i:(a[++o]=null,l.push({i:o,x:Tn(r,i)})),t=Pu.lastIndex;return t<n.length&&(s=n.slice(t),a[o]?a[o]+=s:a[++o]=s),a.length<2?l[0]?$M(l[0].x):VM(n):(n=l.length,function(u){for(var c=0,d;c<n;++c)a[(d=l[c]).i]=d.x(u);return a.join("")})}function Hf(e,n){var t=typeof n,r;return n==null||t==="boolean"?Uf(n):(t==="number"?Tn:t==="string"?(r=mr(n))?(n=r,Wa):Tx:n instanceof mr?Wa:n instanceof Date?FM:DM(n)?LM:Array.isArray(n)?IM:typeof n.valueOf!="function"&&typeof n.toString!="function"||isNaN(n)?qM:Tn)(e,n)}function OM(e,n){return e=+e,n=+n,function(t){return Math.round(e*(1-t)+n*t)}}var lg=180/Math.PI,Yc={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function zx(e,n,t,r,i,s){var o,a,l;return(o=Math.sqrt(e*e+n*n))&&(e/=o,n/=o),(l=e*t+n*r)&&(t-=e*l,r-=n*l),(a=Math.sqrt(t*t+r*r))&&(t/=a,r/=a,l/=a),e*r<n*t&&(e=-e,n=-n,l=-l,o=-o),{translateX:i,translateY:s,rotate:Math.atan2(n,e)*lg,skewX:Math.atan(l)*lg,scaleX:o,scaleY:a}}var Mo;function BM(e){const n=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(e+"");return n.isIdentity?Yc:zx(n.a,n.b,n.c,n.d,n.e,n.f)}function UM(e){return e==null||(Mo||(Mo=document.createElementNS("http://www.w3.org/2000/svg","g")),Mo.setAttribute("transform",e),!(e=Mo.transform.baseVal.consolidate()))?Yc:(e=e.matrix,zx(e.a,e.b,e.c,e.d,e.e,e.f))}function Ex(e,n,t,r){function i(u){return u.length?u.pop()+" ":""}function s(u,c,d,f,p,v){if(u!==d||c!==f){var g=p.push("translate(",null,n,null,t);v.push({i:g-4,x:Tn(u,d)},{i:g-2,x:Tn(c,f)})}else(d||f)&&p.push("translate("+d+n+f+t)}function o(u,c,d,f){u!==c?(u-c>180?c+=360:c-u>180&&(u+=360),f.push({i:d.push(i(d)+"rotate(",null,r)-2,x:Tn(u,c)})):c&&d.push(i(d)+"rotate("+c+r)}function a(u,c,d,f){u!==c?f.push({i:d.push(i(d)+"skewX(",null,r)-2,x:Tn(u,c)}):c&&d.push(i(d)+"skewX("+c+r)}function l(u,c,d,f,p,v){if(u!==d||c!==f){var g=p.push(i(p)+"scale(",null,",",null,")");v.push({i:g-4,x:Tn(u,d)},{i:g-2,x:Tn(c,f)})}else(d!==1||f!==1)&&p.push(i(p)+"scale("+d+","+f+")")}return function(u,c){var d=[],f=[];return u=e(u),c=e(c),s(u.translateX,u.translateY,c.translateX,c.translateY,d,f),o(u.rotate,c.rotate,d,f),a(u.skewX,c.skewX,d,f),l(u.scaleX,u.scaleY,c.scaleX,c.scaleY,d,f),u=c=null,function(p){for(var v=-1,g=f.length,_;++v<g;)d[(_=f[v]).i]=_.x(p);return d.join("")}}}var HM=Ex(BM,"px, ","px)","deg)"),WM=Ex(UM,", ",")",")"),KM=1e-12;function ug(e){return((e=Math.exp(e))+1/e)/2}function YM(e){return((e=Math.exp(e))-1/e)/2}function GM(e){return((e=Math.exp(2*e))-1)/(e+1)}const XM=function e(n,t,r){function i(s,o){var a=s[0],l=s[1],u=s[2],c=o[0],d=o[1],f=o[2],p=c-a,v=d-l,g=p*p+v*v,_,h;if(g<KM)h=Math.log(f/u)/n,_=function(T){return[a+T*p,l+T*v,u*Math.exp(n*T*h)]};else{var m=Math.sqrt(g),y=(f*f-u*u+r*g)/(2*u*t*m),x=(f*f-u*u-r*g)/(2*f*t*m),k=Math.log(Math.sqrt(y*y+1)-y),C=Math.log(Math.sqrt(x*x+1)-x);h=(C-k)/n,_=function(T){var j=T*h,F=ug(k),I=u/(t*m)*(F*GM(n*j+k)-YM(k));return[a+I*p,l+I*v,u*F/ug(n*j+k)]}}return _.duration=h*1e3*n/Math.SQRT2,_}return i.rho=function(s){var o=Math.max(.001,+s),a=o*o,l=a*a;return e(o,a,l)},i}(Math.SQRT2,2,4);var hi=0,Ui=0,Ri=0,Ax=1e3,Ka,Hi,Ya=0,gr=0,Tl=0,Is=typeof performance=="object"&&performance.now?performance:Date,Mx=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(e){setTimeout(e,17)};function Wf(){return gr||(Mx(QM),gr=Is.now()+Tl)}function QM(){gr=0}function Ga(){this._call=this._time=this._next=null}Ga.prototype=Kf.prototype={constructor:Ga,restart:function(e,n,t){if(typeof e!="function")throw new TypeError("callback is not a function");t=(t==null?Wf():+t)+(n==null?0:+n),!this._next&&Hi!==this&&(Hi?Hi._next=this:Ka=this,Hi=this),this._call=e,this._time=t,Gc()},stop:function(){this._call&&(this._call=null,this._time=1/0,Gc())}};function Kf(e,n,t){var r=new Ga;return r.restart(e,n,t),r}function ZM(){Wf(),++hi;for(var e=Ka,n;e;)(n=gr-e._time)>=0&&e._call.call(void 0,n),e=e._next;--hi}function cg(){gr=(Ya=Is.now())+Tl,hi=Ui=0;try{ZM()}finally{hi=0,eR(),gr=0}}function JM(){var e=Is.now(),n=e-Ya;n>Ax&&(Tl-=n,Ya=e)}function eR(){for(var e,n=Ka,t,r=1/0;n;)n._call?(r>n._time&&(r=n._time),e=n,n=n._next):(t=n._next,n._next=null,n=e?e._next=t:Ka=t);Hi=e,Gc(r)}function Gc(e){if(!hi){Ui&&(Ui=clearTimeout(Ui));var n=e-gr;n>24?(e<1/0&&(Ui=setTimeout(cg,e-Is.now()-Tl)),Ri&&(Ri=clearInterval(Ri))):(Ri||(Ya=Is.now(),Ri=setInterval(JM,Ax)),hi=1,Mx(cg))}}function dg(e,n,t){var r=new Ga;return n=n==null?0:+n,r.restart(i=>{r.stop(),e(i+n)},n,t),r}var nR=Zs("start","end","cancel","interrupt"),tR=[],Rx=0,fg=1,Xc=2,Jo=3,pg=4,Qc=5,ea=6;function zl(e,n,t,r,i,s){var o=e.__transition;if(!o)e.__transition={};else if(t in o)return;rR(e,t,{name:n,index:r,group:i,on:nR,tween:tR,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:Rx})}function Yf(e,n){var t=Nn(e,n);if(t.state>Rx)throw new Error("too late; already scheduled");return t}function Hn(e,n){var t=Nn(e,n);if(t.state>Jo)throw new Error("too late; already running");return t}function Nn(e,n){var t=e.__transition;if(!t||!(t=t[n]))throw new Error("transition not found");return t}function rR(e,n,t){var r=e.__transition,i;r[n]=t,t.timer=Kf(s,0,t.time);function s(u){t.state=fg,t.timer.restart(o,t.delay,t.time),t.delay<=u&&o(u-t.delay)}function o(u){var c,d,f,p;if(t.state!==fg)return l();for(c in r)if(p=r[c],p.name===t.name){if(p.state===Jo)return dg(o);p.state===pg?(p.state=ea,p.timer.stop(),p.on.call("interrupt",e,e.__data__,p.index,p.group),delete r[c]):+c<n&&(p.state=ea,p.timer.stop(),p.on.call("cancel",e,e.__data__,p.index,p.group),delete r[c])}if(dg(function(){t.state===Jo&&(t.state=pg,t.timer.restart(a,t.delay,t.time),a(u))}),t.state=Xc,t.on.call("start",e,e.__data__,t.index,t.group),t.state===Xc){for(t.state=Jo,i=new Array(f=t.tween.length),c=0,d=-1;c<f;++c)(p=t.tween[c].value.call(e,e.__data__,t.index,t.group))&&(i[++d]=p);i.length=d+1}}function a(u){for(var c=u<t.duration?t.ease.call(null,u/t.duration):(t.timer.restart(l),t.state=Qc,1),d=-1,f=i.length;++d<f;)i[d].call(e,c);t.state===Qc&&(t.on.call("end",e,e.__data__,t.index,t.group),l())}function l(){t.state=ea,t.timer.stop(),delete r[n];for(var u in r)return;delete e.__transition}}function na(e,n){var t=e.__transition,r,i,s=!0,o;if(t){n=n==null?null:n+"";for(o in t){if((r=t[o]).name!==n){s=!1;continue}i=r.state>Xc&&r.state<Qc,r.state=ea,r.timer.stop(),r.on.call(i?"interrupt":"cancel",e,e.__data__,r.index,r.group),delete t[o]}s&&delete e.__transition}}function iR(e){return this.each(function(){na(this,e)})}function sR(e,n){var t,r;return function(){var i=Hn(this,e),s=i.tween;if(s!==t){r=t=s;for(var o=0,a=r.length;o<a;++o)if(r[o].name===n){r=r.slice(),r.splice(o,1);break}}i.tween=r}}function oR(e,n,t){var r,i;if(typeof t!="function")throw new Error;return function(){var s=Hn(this,e),o=s.tween;if(o!==r){i=(r=o).slice();for(var a={name:n,value:t},l=0,u=i.length;l<u;++l)if(i[l].name===n){i[l]=a;break}l===u&&i.push(a)}s.tween=i}}function aR(e,n){var t=this._id;if(e+="",arguments.length<2){for(var r=Nn(this.node(),t).tween,i=0,s=r.length,o;i<s;++i)if((o=r[i]).name===e)return o.value;return null}return this.each((n==null?sR:oR)(t,e,n))}function Gf(e,n,t){var r=e._id;return e.each(function(){var i=Hn(this,r);(i.value||(i.value={}))[n]=t.apply(this,arguments)}),function(i){return Nn(i,r).value[n]}}function Nx(e,n){var t;return(typeof n=="number"?Tn:n instanceof mr?Wa:(t=mr(n))?(n=t,Wa):Tx)(e,n)}function lR(e){return function(){this.removeAttribute(e)}}function uR(e){return function(){this.removeAttributeNS(e.space,e.local)}}function cR(e,n,t){var r,i=t+"",s;return function(){var o=this.getAttribute(e);return o===i?null:o===r?s:s=n(r=o,t)}}function dR(e,n,t){var r,i=t+"",s;return function(){var o=this.getAttributeNS(e.space,e.local);return o===i?null:o===r?s:s=n(r=o,t)}}function fR(e,n,t){var r,i,s;return function(){var o,a=t(this),l;return a==null?void this.removeAttribute(e):(o=this.getAttribute(e),l=a+"",o===l?null:o===r&&l===i?s:(i=l,s=n(r=o,a)))}}function pR(e,n,t){var r,i,s;return function(){var o,a=t(this),l;return a==null?void this.removeAttributeNS(e.space,e.local):(o=this.getAttributeNS(e.space,e.local),l=a+"",o===l?null:o===r&&l===i?s:(i=l,s=n(r=o,a)))}}function hR(e,n){var t=jl(e),r=t==="transform"?WM:Nx;return this.attrTween(e,typeof n=="function"?(t.local?pR:fR)(t,r,Gf(this,"attr."+e,n)):n==null?(t.local?uR:lR)(t):(t.local?dR:cR)(t,r,n))}function mR(e,n){return function(t){this.setAttribute(e,n.call(this,t))}}function gR(e,n){return function(t){this.setAttributeNS(e.space,e.local,n.call(this,t))}}function vR(e,n){var t,r;function i(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&gR(e,s)),t}return i._value=n,i}function yR(e,n){var t,r;function i(){var s=n.apply(this,arguments);return s!==r&&(t=(r=s)&&mR(e,s)),t}return i._value=n,i}function xR(e,n){var t="attr."+e;if(arguments.length<2)return(t=this.tween(t))&&t._value;if(n==null)return this.tween(t,null);if(typeof n!="function")throw new Error;var r=jl(e);return this.tween(t,(r.local?vR:yR)(r,n))}function _R(e,n){return function(){Yf(this,e).delay=+n.apply(this,arguments)}}function wR(e,n){return n=+n,function(){Yf(this,e).delay=n}}function bR(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?_R:wR)(n,e)):Nn(this.node(),n).delay}function kR(e,n){return function(){Hn(this,e).duration=+n.apply(this,arguments)}}function SR(e,n){return n=+n,function(){Hn(this,e).duration=n}}function CR(e){var n=this._id;return arguments.length?this.each((typeof e=="function"?kR:SR)(n,e)):Nn(this.node(),n).duration}function PR(e,n){if(typeof n!="function")throw new Error;return function(){Hn(this,e).ease=n}}function jR(e){var n=this._id;return arguments.length?this.each(PR(n,e)):Nn(this.node(),n).ease}function TR(e,n){return function(){var t=n.apply(this,arguments);if(typeof t!="function")throw new Error;Hn(this,e).ease=t}}function zR(e){if(typeof e!="function")throw new Error;return this.each(TR(this._id,e))}function ER(e){typeof e!="function"&&(e=px(e));for(var n=this._groups,t=n.length,r=new Array(t),i=0;i<t;++i)for(var s=n[i],o=s.length,a=r[i]=[],l,u=0;u<o;++u)(l=s[u])&&e.call(l,l.__data__,u,s)&&a.push(l);return new ut(r,this._parents,this._name,this._id)}function AR(e){if(e._id!==this._id)throw new Error;for(var n=this._groups,t=e._groups,r=n.length,i=t.length,s=Math.min(r,i),o=new Array(r),a=0;a<s;++a)for(var l=n[a],u=t[a],c=l.length,d=o[a]=new Array(c),f,p=0;p<c;++p)(f=l[p]||u[p])&&(d[p]=f);for(;a<r;++a)o[a]=n[a];return new ut(o,this._parents,this._name,this._id)}function MR(e){return(e+"").trim().split(/^|\s+/).every(function(n){var t=n.indexOf(".");return t>=0&&(n=n.slice(0,t)),!n||n==="start"})}function RR(e,n,t){var r,i,s=MR(n)?Yf:Hn;return function(){var o=s(this,e),a=o.on;a!==r&&(i=(r=a).copy()).on(n,t),o.on=i}}function NR(e,n){var t=this._id;return arguments.length<2?Nn(this.node(),t).on.on(e):this.each(RR(t,e,n))}function LR(e){return function(){var n=this.parentNode;for(var t in this.__transition)if(+t!==e)return;n&&n.removeChild(this)}}function DR(){return this.on("end.remove",LR(this._id))}function IR(e){var n=this._name,t=this._id;typeof e!="function"&&(e=$f(e));for(var r=this._groups,i=r.length,s=new Array(i),o=0;o<i;++o)for(var a=r[o],l=a.length,u=s[o]=new Array(l),c,d,f=0;f<l;++f)(c=a[f])&&(d=e.call(c,c.__data__,f,a))&&("__data__"in c&&(d.__data__=c.__data__),u[f]=d,zl(u[f],n,t,f,u,Nn(c,t)));return new ut(s,this._parents,n,t)}function FR(e){var n=this._name,t=this._id;typeof e!="function"&&(e=fx(e));for(var r=this._groups,i=r.length,s=[],o=[],a=0;a<i;++a)for(var l=r[a],u=l.length,c,d=0;d<u;++d)if(c=l[d]){for(var f=e.call(c,c.__data__,d,l),p,v=Nn(c,t),g=0,_=f.length;g<_;++g)(p=f[g])&&zl(p,n,t,g,f,v);s.push(f),o.push(c)}return new ut(s,o,n,t)}var qR=Js.prototype.constructor;function VR(){return new qR(this._groups,this._parents)}function $R(e,n){var t,r,i;return function(){var s=pi(this,e),o=(this.style.removeProperty(e),pi(this,e));return s===o?null:s===t&&o===r?i:i=n(t=s,r=o)}}function Lx(e){return function(){this.style.removeProperty(e)}}function OR(e,n,t){var r,i=t+"",s;return function(){var o=pi(this,e);return o===i?null:o===r?s:s=n(r=o,t)}}function BR(e,n,t){var r,i,s;return function(){var o=pi(this,e),a=t(this),l=a+"";return a==null&&(l=a=(this.style.removeProperty(e),pi(this,e))),o===l?null:o===r&&l===i?s:(i=l,s=n(r=o,a))}}function UR(e,n){var t,r,i,s="style."+n,o="end."+s,a;return function(){var l=Hn(this,e),u=l.on,c=l.value[s]==null?a||(a=Lx(n)):void 0;(u!==t||i!==c)&&(r=(t=u).copy()).on(o,i=c),l.on=r}}function HR(e,n,t){var r=(e+="")=="transform"?HM:Nx;return n==null?this.styleTween(e,$R(e,r)).on("end.style."+e,Lx(e)):typeof n=="function"?this.styleTween(e,BR(e,r,Gf(this,"style."+e,n))).each(UR(this._id,e)):this.styleTween(e,OR(e,r,n),t).on("end.style."+e,null)}function WR(e,n,t){return function(r){this.style.setProperty(e,n.call(this,r),t)}}function KR(e,n,t){var r,i;function s(){var o=n.apply(this,arguments);return o!==i&&(r=(i=o)&&WR(e,o,t)),r}return s._value=n,s}function YR(e,n,t){var r="style."+(e+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(n==null)return this.tween(r,null);if(typeof n!="function")throw new Error;return this.tween(r,KR(e,n,t??""))}function GR(e){return function(){this.textContent=e}}function XR(e){return function(){var n=e(this);this.textContent=n??""}}function QR(e){return this.tween("text",typeof e=="function"?XR(Gf(this,"text",e)):GR(e==null?"":e+""))}function ZR(e){return function(n){this.textContent=e.call(this,n)}}function JR(e){var n,t;function r(){var i=e.apply(this,arguments);return i!==t&&(n=(t=i)&&ZR(i)),n}return r._value=e,r}function eN(e){var n="text";if(arguments.length<1)return(n=this.tween(n))&&n._value;if(e==null)return this.tween(n,null);if(typeof e!="function")throw new Error;return this.tween(n,JR(e))}function nN(){for(var e=this._name,n=this._id,t=Dx(),r=this._groups,i=r.length,s=0;s<i;++s)for(var o=r[s],a=o.length,l,u=0;u<a;++u)if(l=o[u]){var c=Nn(l,n);zl(l,e,t,u,o,{time:c.time+c.delay+c.duration,delay:0,duration:c.duration,ease:c.ease})}return new ut(r,this._parents,e,t)}function tN(){var e,n,t=this,r=t._id,i=t.size();return new Promise(function(s,o){var a={value:o},l={value:function(){--i===0&&s()}};t.each(function(){var u=Hn(this,r),c=u.on;c!==e&&(n=(e=c).copy(),n._.cancel.push(a),n._.interrupt.push(a),n._.end.push(l)),u.on=n}),i===0&&s()})}var rN=0;function ut(e,n,t,r){this._groups=e,this._parents=n,this._name=t,this._id=r}function Dx(){return++rN}var Wn=Js.prototype;ut.prototype={constructor:ut,select:IR,selectAll:FR,selectChild:Wn.selectChild,selectChildren:Wn.selectChildren,filter:ER,merge:AR,selection:VR,transition:nN,call:Wn.call,nodes:Wn.nodes,node:Wn.node,size:Wn.size,empty:Wn.empty,each:Wn.each,on:NR,attr:hR,attrTween:xR,style:HR,styleTween:YR,text:QR,textTween:eN,remove:DR,tween:aR,delay:bR,duration:CR,ease:jR,easeVarying:zR,end:tN,[Symbol.iterator]:Wn[Symbol.iterator]};function iN(e){return((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2}var sN={time:null,delay:0,duration:250,ease:iN};function oN(e,n){for(var t;!(t=e.__transition)||!(t=t[n]);)if(!(e=e.parentNode))throw new Error(`transition ${n} not found`);return t}function aN(e){var n,t;e instanceof ut?(n=e._id,e=e._name):(n=Dx(),(t=sN).time=Wf(),e=e==null?null:e+"");for(var r=this._groups,i=r.length,s=0;s<i;++s)for(var o=r[s],a=o.length,l,u=0;u<a;++u)(l=o[u])&&zl(l,e,n,u,o,t||oN(l,n));return new ut(r,this._parents,e,n)}Js.prototype.interrupt=iR;Js.prototype.transition=aN;function hg(e,n){var t,r=1;e==null&&(e=0),n==null&&(n=0);function i(){var s,o=t.length,a,l=0,u=0;for(s=0;s<o;++s)a=t[s],l+=a.x,u+=a.y;for(l=(l/o-e)*r,u=(u/o-n)*r,s=0;s<o;++s)a=t[s],a.x-=l,a.y-=u}return i.initialize=function(s){t=s},i.x=function(s){return arguments.length?(e=+s,i):e},i.y=function(s){return arguments.length?(n=+s,i):n},i.strength=function(s){return arguments.length?(r=+s,i):r},i}function lN(e){const n=+this._x.call(null,e),t=+this._y.call(null,e);return Ix(this.cover(n,t),n,t,e)}function Ix(e,n,t,r){if(isNaN(n)||isNaN(t))return e;var i,s=e._root,o={data:r},a=e._x0,l=e._y0,u=e._x1,c=e._y1,d,f,p,v,g,_,h,m;if(!s)return e._root=o,e;for(;s.length;)if((g=n>=(d=(a+u)/2))?a=d:u=d,(_=t>=(f=(l+c)/2))?l=f:c=f,i=s,!(s=s[h=_<<1|g]))return i[h]=o,e;if(p=+e._x.call(null,s.data),v=+e._y.call(null,s.data),n===p&&t===v)return o.next=s,i?i[h]=o:e._root=o,e;do i=i?i[h]=new Array(4):e._root=new Array(4),(g=n>=(d=(a+u)/2))?a=d:u=d,(_=t>=(f=(l+c)/2))?l=f:c=f;while((h=_<<1|g)===(m=(v>=f)<<1|p>=d));return i[m]=s,i[h]=o,e}function uN(e){var n,t,r=e.length,i,s,o=new Array(r),a=new Array(r),l=1/0,u=1/0,c=-1/0,d=-1/0;for(t=0;t<r;++t)isNaN(i=+this._x.call(null,n=e[t]))||isNaN(s=+this._y.call(null,n))||(o[t]=i,a[t]=s,i<l&&(l=i),i>c&&(c=i),s<u&&(u=s),s>d&&(d=s));if(l>c||u>d)return this;for(this.cover(l,u).cover(c,d),t=0;t<r;++t)Ix(this,o[t],a[t],e[t]);return this}function cN(e,n){if(isNaN(e=+e)||isNaN(n=+n))return this;var t=this._x0,r=this._y0,i=this._x1,s=this._y1;if(isNaN(t))i=(t=Math.floor(e))+1,s=(r=Math.floor(n))+1;else{for(var o=i-t||1,a=this._root,l,u;t>e||e>=i||r>n||n>=s;)switch(u=(n<r)<<1|e<t,l=new Array(4),l[u]=a,a=l,o*=2,u){case 0:i=t+o,s=r+o;break;case 1:t=i-o,s=r+o;break;case 2:i=t+o,r=s-o;break;case 3:t=i-o,r=s-o;break}this._root&&this._root.length&&(this._root=a)}return this._x0=t,this._y0=r,this._x1=i,this._y1=s,this}function dN(){var e=[];return this.visit(function(n){if(!n.length)do e.push(n.data);while(n=n.next)}),e}function fN(e){return arguments.length?this.cover(+e[0][0],+e[0][1]).cover(+e[1][0],+e[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function Be(e,n,t,r,i){this.node=e,this.x0=n,this.y0=t,this.x1=r,this.y1=i}function pN(e,n,t){var r,i=this._x0,s=this._y0,o,a,l,u,c=this._x1,d=this._y1,f=[],p=this._root,v,g;for(p&&f.push(new Be(p,i,s,c,d)),t==null?t=1/0:(i=e-t,s=n-t,c=e+t,d=n+t,t*=t);v=f.pop();)if(!(!(p=v.node)||(o=v.x0)>c||(a=v.y0)>d||(l=v.x1)<i||(u=v.y1)<s))if(p.length){var _=(o+l)/2,h=(a+u)/2;f.push(new Be(p[3],_,h,l,u),new Be(p[2],o,h,_,u),new Be(p[1],_,a,l,h),new Be(p[0],o,a,_,h)),(g=(n>=h)<<1|e>=_)&&(v=f[f.length-1],f[f.length-1]=f[f.length-1-g],f[f.length-1-g]=v)}else{var m=e-+this._x.call(null,p.data),y=n-+this._y.call(null,p.data),x=m*m+y*y;if(x<t){var k=Math.sqrt(t=x);i=e-k,s=n-k,c=e+k,d=n+k,r=p.data}}return r}function hN(e){if(isNaN(c=+this._x.call(null,e))||isNaN(d=+this._y.call(null,e)))return this;var n,t=this._root,r,i,s,o=this._x0,a=this._y0,l=this._x1,u=this._y1,c,d,f,p,v,g,_,h;if(!t)return this;if(t.length)for(;;){if((v=c>=(f=(o+l)/2))?o=f:l=f,(g=d>=(p=(a+u)/2))?a=p:u=p,n=t,!(t=t[_=g<<1|v]))return this;if(!t.length)break;(n[_+1&3]||n[_+2&3]||n[_+3&3])&&(r=n,h=_)}for(;t.data!==e;)if(i=t,!(t=t.next))return this;return(s=t.next)&&delete t.next,i?(s?i.next=s:delete i.next,this):n?(s?n[_]=s:delete n[_],(t=n[0]||n[1]||n[2]||n[3])&&t===(n[3]||n[2]||n[1]||n[0])&&!t.length&&(r?r[h]=t:this._root=t),this):(this._root=s,this)}function mN(e){for(var n=0,t=e.length;n<t;++n)this.remove(e[n]);return this}function gN(){return this._root}function vN(){var e=0;return this.visit(function(n){if(!n.length)do++e;while(n=n.next)}),e}function yN(e){var n=[],t,r=this._root,i,s,o,a,l;for(r&&n.push(new Be(r,this._x0,this._y0,this._x1,this._y1));t=n.pop();)if(!e(r=t.node,s=t.x0,o=t.y0,a=t.x1,l=t.y1)&&r.length){var u=(s+a)/2,c=(o+l)/2;(i=r[3])&&n.push(new Be(i,u,c,a,l)),(i=r[2])&&n.push(new Be(i,s,c,u,l)),(i=r[1])&&n.push(new Be(i,u,o,a,c)),(i=r[0])&&n.push(new Be(i,s,o,u,c))}return this}function xN(e){var n=[],t=[],r;for(this._root&&n.push(new Be(this._root,this._x0,this._y0,this._x1,this._y1));r=n.pop();){var i=r.node;if(i.length){var s,o=r.x0,a=r.y0,l=r.x1,u=r.y1,c=(o+l)/2,d=(a+u)/2;(s=i[0])&&n.push(new Be(s,o,a,c,d)),(s=i[1])&&n.push(new Be(s,c,a,l,d)),(s=i[2])&&n.push(new Be(s,o,d,c,u)),(s=i[3])&&n.push(new Be(s,c,d,l,u))}t.push(r)}for(;r=t.pop();)e(r.node,r.x0,r.y0,r.x1,r.y1);return this}function _N(e){return e[0]}function wN(e){return arguments.length?(this._x=e,this):this._x}function bN(e){return e[1]}function kN(e){return arguments.length?(this._y=e,this):this._y}function Xf(e,n,t){var r=new Qf(n??_N,t??bN,NaN,NaN,NaN,NaN);return e==null?r:r.addAll(e)}function Qf(e,n,t,r,i,s){this._x=e,this._y=n,this._x0=t,this._y0=r,this._x1=i,this._y1=s,this._root=void 0}function mg(e){for(var n={data:e.data},t=n;e=e.next;)t=t.next={data:e.data};return n}var Ke=Xf.prototype=Qf.prototype;Ke.copy=function(){var e=new Qf(this._x,this._y,this._x0,this._y0,this._x1,this._y1),n=this._root,t,r;if(!n)return e;if(!n.length)return e._root=mg(n),e;for(t=[{source:n,target:e._root=new Array(4)}];n=t.pop();)for(var i=0;i<4;++i)(r=n.source[i])&&(r.length?t.push({source:r,target:n.target[i]=new Array(4)}):n.target[i]=mg(r));return e};Ke.add=lN;Ke.addAll=uN;Ke.cover=cN;Ke.data=dN;Ke.extent=fN;Ke.find=pN;Ke.remove=hN;Ke.removeAll=mN;Ke.root=gN;Ke.size=vN;Ke.visit=yN;Ke.visitAfter=xN;Ke.x=wN;Ke.y=kN;function En(e){return function(){return e}}function kt(e){return(e()-.5)*1e-6}function SN(e){return e.x+e.vx}function CN(e){return e.y+e.vy}function PN(e){var n,t,r,i=1,s=1;typeof e!="function"&&(e=En(e==null?1:+e));function o(){for(var u,c=n.length,d,f,p,v,g,_,h=0;h<s;++h)for(d=Xf(n,SN,CN).visitAfter(a),u=0;u<c;++u)f=n[u],g=t[f.index],_=g*g,p=f.x+f.vx,v=f.y+f.vy,d.visit(m);function m(y,x,k,C,T){var j=y.data,F=y.r,I=g+F;if(j){if(j.index>f.index){var O=p-j.x-j.vx,$=v-j.y-j.vy,q=O*O+$*$;q<I*I&&(O===0&&(O=kt(r),q+=O*O),$===0&&($=kt(r),q+=$*$),q=(I-(q=Math.sqrt(q)))/q*i,f.vx+=(O*=q)*(I=(F*=F)/(_+F)),f.vy+=($*=q)*I,j.vx-=O*(I=1-I),j.vy-=$*I)}return}return x>p+I||C<p-I||k>v+I||T<v-I}}function a(u){if(u.data)return u.r=t[u.data.index];for(var c=u.r=0;c<4;++c)u[c]&&u[c].r>u.r&&(u.r=u[c].r)}function l(){if(n){var u,c=n.length,d;for(t=new Array(c),u=0;u<c;++u)d=n[u],t[d.index]=+e(d,u,n)}}return o.initialize=function(u,c){n=u,r=c,l()},o.iterations=function(u){return arguments.length?(s=+u,o):s},o.strength=function(u){return arguments.length?(i=+u,o):i},o.radius=function(u){return arguments.length?(e=typeof u=="function"?u:En(+u),l(),o):e},o}function jN(e){return e.index}function gg(e,n){var t=e.get(n);if(!t)throw new Error("node not found: "+n);return t}function TN(e){var n=jN,t=d,r,i=En(30),s,o,a,l,u,c=1;e==null&&(e=[]);function d(_){return 1/Math.min(a[_.source.index],a[_.target.index])}function f(_){for(var h=0,m=e.length;h<c;++h)for(var y=0,x,k,C,T,j,F,I;y<m;++y)x=e[y],k=x.source,C=x.target,T=C.x+C.vx-k.x-k.vx||kt(u),j=C.y+C.vy-k.y-k.vy||kt(u),F=Math.sqrt(T*T+j*j),F=(F-s[y])/F*_*r[y],T*=F,j*=F,C.vx-=T*(I=l[y]),C.vy-=j*I,k.vx+=T*(I=1-I),k.vy+=j*I}function p(){if(o){var _,h=o.length,m=e.length,y=new Map(o.map((k,C)=>[n(k,C,o),k])),x;for(_=0,a=new Array(h);_<m;++_)x=e[_],x.index=_,typeof x.source!="object"&&(x.source=gg(y,x.source)),typeof x.target!="object"&&(x.target=gg(y,x.target)),a[x.source.index]=(a[x.source.index]||0)+1,a[x.target.index]=(a[x.target.index]||0)+1;for(_=0,l=new Array(m);_<m;++_)x=e[_],l[_]=a[x.source.index]/(a[x.source.index]+a[x.target.index]);r=new Array(m),v(),s=new Array(m),g()}}function v(){if(o)for(var _=0,h=e.length;_<h;++_)r[_]=+t(e[_],_,e)}function g(){if(o)for(var _=0,h=e.length;_<h;++_)s[_]=+i(e[_],_,e)}return f.initialize=function(_,h){o=_,u=h,p()},f.links=function(_){return arguments.length?(e=_,p(),f):e},f.id=function(_){return arguments.length?(n=_,f):n},f.iterations=function(_){return arguments.length?(c=+_,f):c},f.strength=function(_){return arguments.length?(t=typeof _=="function"?_:En(+_),v(),f):t},f.distance=function(_){return arguments.length?(i=typeof _=="function"?_:En(+_),g(),f):i},f}const zN=1664525,EN=1013904223,vg=4294967296;function AN(){let e=1;return()=>(e=(zN*e+EN)%vg)/vg}function MN(e){return e.x}function RN(e){return e.y}var NN=10,LN=Math.PI*(3-Math.sqrt(5));function DN(e){var n,t=1,r=.001,i=1-Math.pow(r,1/300),s=0,o=.6,a=new Map,l=Kf(d),u=Zs("tick","end"),c=AN();e==null&&(e=[]);function d(){f(),u.call("tick",n),t<r&&(l.stop(),u.call("end",n))}function f(g){var _,h=e.length,m;g===void 0&&(g=1);for(var y=0;y<g;++y)for(t+=(s-t)*i,a.forEach(function(x){x(t)}),_=0;_<h;++_)m=e[_],m.fx==null?m.x+=m.vx*=o:(m.x=m.fx,m.vx=0),m.fy==null?m.y+=m.vy*=o:(m.y=m.fy,m.vy=0);return n}function p(){for(var g=0,_=e.length,h;g<_;++g){if(h=e[g],h.index=g,h.fx!=null&&(h.x=h.fx),h.fy!=null&&(h.y=h.fy),isNaN(h.x)||isNaN(h.y)){var m=NN*Math.sqrt(.5+g),y=g*LN;h.x=m*Math.cos(y),h.y=m*Math.sin(y)}(isNaN(h.vx)||isNaN(h.vy))&&(h.vx=h.vy=0)}}function v(g){return g.initialize&&g.initialize(e,c),g}return p(),n={tick:f,restart:function(){return l.restart(d),n},stop:function(){return l.stop(),n},nodes:function(g){return arguments.length?(e=g,p(),a.forEach(v),n):e},alpha:function(g){return arguments.length?(t=+g,n):t},alphaMin:function(g){return arguments.length?(r=+g,n):r},alphaDecay:function(g){return arguments.length?(i=+g,n):+i},alphaTarget:function(g){return arguments.length?(s=+g,n):s},velocityDecay:function(g){return arguments.length?(o=1-g,n):1-o},randomSource:function(g){return arguments.length?(c=g,a.forEach(v),n):c},force:function(g,_){return arguments.length>1?(_==null?a.delete(g):a.set(g,v(_)),n):a.get(g)},find:function(g,_,h){var m=0,y=e.length,x,k,C,T,j;for(h==null?h=1/0:h*=h,m=0;m<y;++m)T=e[m],x=g-T.x,k=_-T.y,C=x*x+k*k,C<h&&(j=T,h=C);return j},on:function(g,_){return arguments.length>1?(u.on(g,_),n):u.on(g)}}}function Ro(){var e,n,t,r,i=En(-30),s,o=1,a=1/0,l=.81;function u(p){var v,g=e.length,_=Xf(e,MN,RN).visitAfter(d);for(r=p,v=0;v<g;++v)n=e[v],_.visit(f)}function c(){if(e){var p,v=e.length,g;for(s=new Array(v),p=0;p<v;++p)g=e[p],s[g.index]=+i(g,p,e)}}function d(p){var v=0,g,_,h=0,m,y,x;if(p.length){for(m=y=x=0;x<4;++x)(g=p[x])&&(_=Math.abs(g.value))&&(v+=g.value,h+=_,m+=_*g.x,y+=_*g.y);p.x=m/h,p.y=y/h}else{g=p,g.x=g.data.x,g.y=g.data.y;do v+=s[g.data.index];while(g=g.next)}p.value=v}function f(p,v,g,_){if(!p.value)return!0;var h=p.x-n.x,m=p.y-n.y,y=_-v,x=h*h+m*m;if(y*y/l<x)return x<a&&(h===0&&(h=kt(t),x+=h*h),m===0&&(m=kt(t),x+=m*m),x<o&&(x=Math.sqrt(o*x)),n.vx+=h*p.value*r/x,n.vy+=m*p.value*r/x),!0;if(p.length||x>=a)return;(p.data!==n||p.next)&&(h===0&&(h=kt(t),x+=h*h),m===0&&(m=kt(t),x+=m*m),x<o&&(x=Math.sqrt(o*x)));do p.data!==n&&(y=s[p.data.index]*r/x,n.vx+=h*y,n.vy+=m*y);while(p=p.next)}return u.initialize=function(p,v){e=p,t=v,c()},u.strength=function(p){return arguments.length?(i=typeof p=="function"?p:En(+p),c(),u):i},u.distanceMin=function(p){return arguments.length?(o=p*p,u):Math.sqrt(o)},u.distanceMax=function(p){return arguments.length?(a=p*p,u):Math.sqrt(a)},u.theta=function(p){return arguments.length?(l=p*p,u):Math.sqrt(l)},u}function IN(e,n,t){var r,i=En(.1),s,o;typeof e!="function"&&(e=En(+e)),n==null&&(n=0),t==null&&(t=0);function a(u){for(var c=0,d=r.length;c<d;++c){var f=r[c],p=f.x-n||1e-6,v=f.y-t||1e-6,g=Math.sqrt(p*p+v*v),_=(o[c]-g)*s[c]*u/g;f.vx+=p*_,f.vy+=v*_}}function l(){if(r){var u,c=r.length;for(s=new Array(c),o=new Array(c),u=0;u<c;++u)o[u]=+e(r[u],u,r),s[u]=isNaN(o[u])?0:+i(r[u],u,r)}}return a.initialize=function(u){r=u,l()},a.strength=function(u){return arguments.length?(i=typeof u=="function"?u:En(+u),l(),a):i},a.radius=function(u){return arguments.length?(e=typeof u=="function"?u:En(+u),l(),a):e},a.x=function(u){return arguments.length?(n=+u,a):n},a.y=function(u){return arguments.length?(t=+u,a):t},a}function FN(e){return Math.abs(e=Math.round(e))>=1e21?e.toLocaleString("en").replace(/,/g,""):e.toString(10)}function Xa(e,n){if(!isFinite(e)||e===0)return null;var t=(e=n?e.toExponential(n-1):e.toExponential()).indexOf("e"),r=e.slice(0,t);return[r.length>1?r[0]+r.slice(2):r,+e.slice(t+1)]}function mi(e){return e=Xa(Math.abs(e)),e?e[1]:NaN}function qN(e,n){return function(t,r){for(var i=t.length,s=[],o=0,a=e[0],l=0;i>0&&a>0&&(l+a+1>r&&(a=Math.max(1,r-l)),s.push(t.substring(i-=a,i+a)),!((l+=a+1)>r));)a=e[o=(o+1)%e.length];return s.reverse().join(n)}}function VN(e){return function(n){return n.replace(/[0-9]/g,function(t){return e[+t]})}}var $N=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function Qa(e){if(!(n=$N.exec(e)))throw new Error("invalid format: "+e);var n;return new Zf({fill:n[1],align:n[2],sign:n[3],symbol:n[4],zero:n[5],width:n[6],comma:n[7],precision:n[8]&&n[8].slice(1),trim:n[9],type:n[10]})}Qa.prototype=Zf.prototype;function Zf(e){this.fill=e.fill===void 0?" ":e.fill+"",this.align=e.align===void 0?">":e.align+"",this.sign=e.sign===void 0?"-":e.sign+"",this.symbol=e.symbol===void 0?"":e.symbol+"",this.zero=!!e.zero,this.width=e.width===void 0?void 0:+e.width,this.comma=!!e.comma,this.precision=e.precision===void 0?void 0:+e.precision,this.trim=!!e.trim,this.type=e.type===void 0?"":e.type+""}Zf.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(this.width===void 0?"":Math.max(1,this.width|0))+(this.comma?",":"")+(this.precision===void 0?"":"."+Math.max(0,this.precision|0))+(this.trim?"~":"")+this.type};function ON(e){e:for(var n=e.length,t=1,r=-1,i;t<n;++t)switch(e[t]){case".":r=i=t;break;case"0":r===0&&(r=t),i=t;break;default:if(!+e[t])break e;r>0&&(r=0);break}return r>0?e.slice(0,r)+e.slice(i+1):e}var Za;function BN(e,n){var t=Xa(e,n);if(!t)return Za=void 0,e.toPrecision(n);var r=t[0],i=t[1],s=i-(Za=Math.max(-8,Math.min(8,Math.floor(i/3)))*3)+1,o=r.length;return s===o?r:s>o?r+new Array(s-o+1).join("0"):s>0?r.slice(0,s)+"."+r.slice(s):"0."+new Array(1-s).join("0")+Xa(e,Math.max(0,n+s-1))[0]}function yg(e,n){var t=Xa(e,n);if(!t)return e+"";var r=t[0],i=t[1];return i<0?"0."+new Array(-i).join("0")+r:r.length>i+1?r.slice(0,i+1)+"."+r.slice(i+1):r+new Array(i-r.length+2).join("0")}const xg={"%":(e,n)=>(e*100).toFixed(n),b:e=>Math.round(e).toString(2),c:e=>e+"",d:FN,e:(e,n)=>e.toExponential(n),f:(e,n)=>e.toFixed(n),g:(e,n)=>e.toPrecision(n),o:e=>Math.round(e).toString(8),p:(e,n)=>yg(e*100,n),r:yg,s:BN,X:e=>Math.round(e).toString(16).toUpperCase(),x:e=>Math.round(e).toString(16)};function _g(e){return e}var wg=Array.prototype.map,bg=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function UN(e){var n=e.grouping===void 0||e.thousands===void 0?_g:qN(wg.call(e.grouping,Number),e.thousands+""),t=e.currency===void 0?"":e.currency[0]+"",r=e.currency===void 0?"":e.currency[1]+"",i=e.decimal===void 0?".":e.decimal+"",s=e.numerals===void 0?_g:VN(wg.call(e.numerals,String)),o=e.percent===void 0?"%":e.percent+"",a=e.minus===void 0?"−":e.minus+"",l=e.nan===void 0?"NaN":e.nan+"";function u(d,f){d=Qa(d);var p=d.fill,v=d.align,g=d.sign,_=d.symbol,h=d.zero,m=d.width,y=d.comma,x=d.precision,k=d.trim,C=d.type;C==="n"?(y=!0,C="g"):xg[C]||(x===void 0&&(x=12),k=!0,C="g"),(h||p==="0"&&v==="=")&&(h=!0,p="0",v="=");var T=(f&&f.prefix!==void 0?f.prefix:"")+(_==="$"?t:_==="#"&&/[boxX]/.test(C)?"0"+C.toLowerCase():""),j=(_==="$"?r:/[%p]/.test(C)?o:"")+(f&&f.suffix!==void 0?f.suffix:""),F=xg[C],I=/[defgprs%]/.test(C);x=x===void 0?6:/[gprs]/.test(C)?Math.max(1,Math.min(21,x)):Math.max(0,Math.min(20,x));function O($){var q=T,P=j,L,E,N;if(C==="c")P=F($)+P,$="";else{$=+$;var z=$<0||1/$<0;if($=isNaN($)?l:F(Math.abs($),x),k&&($=ON($)),z&&+$==0&&g!=="+"&&(z=!1),q=(z?g==="("?g:a:g==="-"||g==="("?"":g)+q,P=(C==="s"&&!isNaN($)&&Za!==void 0?bg[8+Za/3]:"")+P+(z&&g==="("?")":""),I){for(L=-1,E=$.length;++L<E;)if(N=$.charCodeAt(L),48>N||N>57){P=(N===46?i+$.slice(L+1):$.slice(L))+P,$=$.slice(0,L);break}}}y&&!h&&($=n($,1/0));var M=q.length+$.length+P.length,R=M<m?new Array(m-M+1).join(p):"";switch(y&&h&&($=n(R+$,R.length?m-P.length:1/0),R=""),v){case"<":$=q+$+P+R;break;case"=":$=q+R+$+P;break;case"^":$=R.slice(0,M=R.length>>1)+q+$+P+R.slice(M);break;default:$=R+q+$+P;break}return s($)}return O.toString=function(){return d+""},O}function c(d,f){var p=Math.max(-8,Math.min(8,Math.floor(mi(f)/3)))*3,v=Math.pow(10,-p),g=u((d=Qa(d),d.type="f",d),{suffix:bg[8+p/3]});return function(_){return g(v*_)}}return{format:u,formatPrefix:c}}var No,Fx,qx;HN({thousands:",",grouping:[3],currency:["$",""]});function HN(e){return No=UN(e),Fx=No.format,qx=No.formatPrefix,No}function WN(e){return Math.max(0,-mi(Math.abs(e)))}function KN(e,n){return Math.max(0,Math.max(-8,Math.min(8,Math.floor(mi(n)/3)))*3-mi(Math.abs(e)))}function YN(e,n){return e=Math.abs(e),n=Math.abs(n)-e,Math.max(0,mi(n)-mi(e))+1}function GN(e,n){switch(arguments.length){case 0:break;case 1:this.range(e);break;default:this.range(n).domain(e);break}return this}function XN(e){return function(){return e}}function QN(e){return+e}var kg=[0,1];function Wr(e){return e}function Zc(e,n){return(n-=e=+e)?function(t){return(t-e)/n}:XN(isNaN(n)?NaN:.5)}function ZN(e,n){var t;return e>n&&(t=e,e=n,n=t),function(r){return Math.max(e,Math.min(n,r))}}function JN(e,n,t){var r=e[0],i=e[1],s=n[0],o=n[1];return i<r?(r=Zc(i,r),s=t(o,s)):(r=Zc(r,i),s=t(s,o)),function(a){return s(r(a))}}function eL(e,n,t){var r=Math.min(e.length,n.length)-1,i=new Array(r),s=new Array(r),o=-1;for(e[r]<e[0]&&(e=e.slice().reverse(),n=n.slice().reverse());++o<r;)i[o]=Zc(e[o],e[o+1]),s[o]=t(n[o],n[o+1]);return function(a){var l=C5(e,a,1,r)-1;return s[l](i[l](a))}}function nL(e,n){return n.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown())}function tL(){var e=kg,n=kg,t=Hf,r,i,s,o=Wr,a,l,u;function c(){var f=Math.min(e.length,n.length);return o!==Wr&&(o=ZN(e[0],e[f-1])),a=f>2?eL:JN,l=u=null,d}function d(f){return f==null||isNaN(f=+f)?s:(l||(l=a(e.map(r),n,t)))(r(o(f)))}return d.invert=function(f){return o(i((u||(u=a(n,e.map(r),Tn)))(f)))},d.domain=function(f){return arguments.length?(e=Array.from(f,QN),c()):e.slice()},d.range=function(f){return arguments.length?(n=Array.from(f),c()):n.slice()},d.rangeRound=function(f){return n=Array.from(f),t=OM,c()},d.clamp=function(f){return arguments.length?(o=f?!0:Wr,c()):o!==Wr},d.interpolate=function(f){return arguments.length?(t=f,c()):t},d.unknown=function(f){return arguments.length?(s=f,d):s},function(f,p){return r=f,i=p,c()}}function rL(){return tL()(Wr,Wr)}function iL(e,n,t,r){var i=A5(e,n,t),s;switch(r=Qa(r??",f"),r.type){case"s":{var o=Math.max(Math.abs(e),Math.abs(n));return r.precision==null&&!isNaN(s=KN(i,o))&&(r.precision=s),qx(r,o)}case"":case"e":case"g":case"p":case"r":{r.precision==null&&!isNaN(s=YN(i,Math.max(Math.abs(e),Math.abs(n))))&&(r.precision=s-(r.type==="e"));break}case"f":case"%":{r.precision==null&&!isNaN(s=WN(i))&&(r.precision=s-(r.type==="%")*2);break}}return Fx(r)}function sL(e){var n=e.domain;return e.ticks=function(t){var r=n();return E5(r[0],r[r.length-1],t??10)},e.tickFormat=function(t,r){var i=n();return iL(i[0],i[i.length-1],t??10,r)},e.nice=function(t){t==null&&(t=10);var r=n(),i=0,s=r.length-1,o=r[i],a=r[s],l,u,c=10;for(a<o&&(u=o,o=a,a=u,u=i,i=s,s=u);c-- >0;){if(u=Bc(o,a,t),u===l)return r[i]=o,r[s]=a,n(r);if(u>0)o=Math.floor(o/u)*u,a=Math.ceil(a/u)*u;else if(u<0)o=Math.ceil(o*u)/u,a=Math.floor(a*u)/u;else break;l=u}return e},e}function ta(){var e=rL();return e.copy=function(){return nL(e,ta())},GN.apply(e,arguments),sL(e)}const Lo=e=>()=>e;function oL(e,{sourceEvent:n,target:t,transform:r,dispatch:i}){Object.defineProperties(this,{type:{value:e,enumerable:!0,configurable:!0},sourceEvent:{value:n,enumerable:!0,configurable:!0},target:{value:t,enumerable:!0,configurable:!0},transform:{value:r,enumerable:!0,configurable:!0},_:{value:i}})}function Jn(e,n,t){this.k=e,this.x=n,this.y=t}Jn.prototype={constructor:Jn,scale:function(e){return e===1?this:new Jn(this.k*e,this.x,this.y)},translate:function(e,n){return e===0&n===0?this:new Jn(this.k,this.x+this.k*e,this.y+this.k*n)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var Vx=new Jn(1,0,0);Jn.prototype;function ju(e){e.stopImmediatePropagation()}function Ni(e){e.preventDefault(),e.stopImmediatePropagation()}function aL(e){return(!e.ctrlKey||e.type==="wheel")&&!e.button}function lL(){var e=this;return e instanceof SVGElement?(e=e.ownerSVGElement||e,e.hasAttribute("viewBox")?(e=e.viewBox.baseVal,[[e.x,e.y],[e.x+e.width,e.y+e.height]]):[[0,0],[e.width.baseVal.value,e.height.baseVal.value]]):[[0,0],[e.clientWidth,e.clientHeight]]}function Sg(){return this.__zoom||Vx}function uL(e){return-e.deltaY*(e.deltaMode===1?.05:e.deltaMode?1:.002)*(e.ctrlKey?10:1)}function cL(){return navigator.maxTouchPoints||"ontouchstart"in this}function dL(e,n,t){var r=e.invertX(n[0][0])-t[0][0],i=e.invertX(n[1][0])-t[1][0],s=e.invertY(n[0][1])-t[0][1],o=e.invertY(n[1][1])-t[1][1];return e.translate(i>r?(r+i)/2:Math.min(0,r)||Math.max(0,i),o>s?(s+o)/2:Math.min(0,s)||Math.max(0,o))}function fL(){var e=aL,n=lL,t=dL,r=uL,i=cL,s=[0,1/0],o=[[-1/0,-1/0],[1/0,1/0]],a=250,l=XM,u=Zs("start","zoom","end"),c,d,f,p=500,v=150,g=0,_=10;function h(P){P.property("__zoom",Sg).on("wheel.zoom",j,{passive:!1}).on("mousedown.zoom",F).on("dblclick.zoom",I).filter(i).on("touchstart.zoom",O).on("touchmove.zoom",$).on("touchend.zoom touchcancel.zoom",q).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}h.transform=function(P,L,E,N){var z=P.selection?P.selection():P;z.property("__zoom",Sg),P!==z?k(P,L,E,N):z.interrupt().each(function(){C(this,arguments).event(N).start().zoom(null,typeof L=="function"?L.apply(this,arguments):L).end()})},h.scaleBy=function(P,L,E,N){h.scaleTo(P,function(){var z=this.__zoom.k,M=typeof L=="function"?L.apply(this,arguments):L;return z*M},E,N)},h.scaleTo=function(P,L,E,N){h.transform(P,function(){var z=n.apply(this,arguments),M=this.__zoom,R=E==null?x(z):typeof E=="function"?E.apply(this,arguments):E,U=M.invert(R),K=typeof L=="function"?L.apply(this,arguments):L;return t(y(m(M,K),R,U),z,o)},E,N)},h.translateBy=function(P,L,E,N){h.transform(P,function(){return t(this.__zoom.translate(typeof L=="function"?L.apply(this,arguments):L,typeof E=="function"?E.apply(this,arguments):E),n.apply(this,arguments),o)},null,N)},h.translateTo=function(P,L,E,N,z){h.transform(P,function(){var M=n.apply(this,arguments),R=this.__zoom,U=N==null?x(M):typeof N=="function"?N.apply(this,arguments):N;return t(Vx.translate(U[0],U[1]).scale(R.k).translate(typeof L=="function"?-L.apply(this,arguments):-L,typeof E=="function"?-E.apply(this,arguments):-E),M,o)},N,z)};function m(P,L){return L=Math.max(s[0],Math.min(s[1],L)),L===P.k?P:new Jn(L,P.x,P.y)}function y(P,L,E){var N=L[0]-E[0]*P.k,z=L[1]-E[1]*P.k;return N===P.x&&z===P.y?P:new Jn(P.k,N,z)}function x(P){return[(+P[0][0]+ +P[1][0])/2,(+P[0][1]+ +P[1][1])/2]}function k(P,L,E,N){P.on("start.zoom",function(){C(this,arguments).event(N).start()}).on("interrupt.zoom end.zoom",function(){C(this,arguments).event(N).end()}).tween("zoom",function(){var z=this,M=arguments,R=C(z,M).event(N),U=n.apply(z,M),K=E==null?x(U):typeof E=="function"?E.apply(z,M):E,be=Math.max(U[1][0]-U[0][0],U[1][1]-U[0][1]),Z=z.__zoom,oe=typeof L=="function"?L.apply(z,M):L,Q=l(Z.invert(K).concat(be/Z.k),oe.invert(K).concat(be/oe.k));return function(te){if(te===1)te=oe;else{var Ae=Q(te),Ye=be/Ae[2];te=new Jn(Ye,K[0]-Ae[0]*Ye,K[1]-Ae[1]*Ye)}R.zoom(null,te)}})}function C(P,L,E){return!E&&P.__zooming||new T(P,L)}function T(P,L){this.that=P,this.args=L,this.active=0,this.sourceEvent=null,this.extent=n.apply(P,L),this.taps=0}T.prototype={event:function(P){return P&&(this.sourceEvent=P),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(P,L){return this.mouse&&P!=="mouse"&&(this.mouse[1]=L.invert(this.mouse[0])),this.touch0&&P!=="touch"&&(this.touch0[1]=L.invert(this.touch0[0])),this.touch1&&P!=="touch"&&(this.touch1[1]=L.invert(this.touch1[0])),this.that.__zoom=L,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(P){var L=Fn(this.that).datum();u.call(P,this.that,new oL(P,{sourceEvent:this.sourceEvent,target:h,transform:this.that.__zoom,dispatch:u}),L)}};function j(P,...L){if(!e.apply(this,arguments))return;var E=C(this,L).event(P),N=this.__zoom,z=Math.max(s[0],Math.min(s[1],N.k*Math.pow(2,r.apply(this,arguments)))),M=Yn(P);if(E.wheel)(E.mouse[0][0]!==M[0]||E.mouse[0][1]!==M[1])&&(E.mouse[1]=N.invert(E.mouse[0]=M)),clearTimeout(E.wheel);else{if(N.k===z)return;E.mouse=[M,N.invert(M)],na(this),E.start()}Ni(P),E.wheel=setTimeout(R,v),E.zoom("mouse",t(y(m(N,z),E.mouse[0],E.mouse[1]),E.extent,o));function R(){E.wheel=null,E.end()}}function F(P,...L){if(f||!e.apply(this,arguments))return;var E=P.currentTarget,N=C(this,L,!0).event(P),z=Fn(P.view).on("mousemove.zoom",K,!0).on("mouseup.zoom",be,!0),M=Yn(P,E),R=P.clientX,U=P.clientY;kx(P.view),ju(P),N.mouse=[M,this.__zoom.invert(M)],na(this),N.start();function K(Z){if(Ni(Z),!N.moved){var oe=Z.clientX-R,Q=Z.clientY-U;N.moved=oe*oe+Q*Q>g}N.event(Z).zoom("mouse",t(y(N.that.__zoom,N.mouse[0]=Yn(Z,E),N.mouse[1]),N.extent,o))}function be(Z){z.on("mousemove.zoom mouseup.zoom",null),Sx(Z.view,N.moved),Ni(Z),N.event(Z).end()}}function I(P,...L){if(e.apply(this,arguments)){var E=this.__zoom,N=Yn(P.changedTouches?P.changedTouches[0]:P,this),z=E.invert(N),M=E.k*(P.shiftKey?.5:2),R=t(y(m(E,M),N,z),n.apply(this,L),o);Ni(P),a>0?Fn(this).transition().duration(a).call(k,R,N,P):Fn(this).call(h.transform,R,N,P)}}function O(P,...L){if(e.apply(this,arguments)){var E=P.touches,N=E.length,z=C(this,L,P.changedTouches.length===N).event(P),M,R,U,K;for(ju(P),R=0;R<N;++R)U=E[R],K=Yn(U,this),K=[K,this.__zoom.invert(K),U.identifier],z.touch0?!z.touch1&&z.touch0[2]!==K[2]&&(z.touch1=K,z.taps=0):(z.touch0=K,M=!0,z.taps=1+!!c);c&&(c=clearTimeout(c)),M&&(z.taps<2&&(d=K[0],c=setTimeout(function(){c=null},p)),na(this),z.start())}}function $(P,...L){if(this.__zooming){var E=C(this,L).event(P),N=P.changedTouches,z=N.length,M,R,U,K;for(Ni(P),M=0;M<z;++M)R=N[M],U=Yn(R,this),E.touch0&&E.touch0[2]===R.identifier?E.touch0[0]=U:E.touch1&&E.touch1[2]===R.identifier&&(E.touch1[0]=U);if(R=E.that.__zoom,E.touch1){var be=E.touch0[0],Z=E.touch0[1],oe=E.touch1[0],Q=E.touch1[1],te=(te=oe[0]-be[0])*te+(te=oe[1]-be[1])*te,Ae=(Ae=Q[0]-Z[0])*Ae+(Ae=Q[1]-Z[1])*Ae;R=m(R,Math.sqrt(te/Ae)),U=[(be[0]+oe[0])/2,(be[1]+oe[1])/2],K=[(Z[0]+Q[0])/2,(Z[1]+Q[1])/2]}else if(E.touch0)U=E.touch0[0],K=E.touch0[1];else return;E.zoom("touch",t(y(R,U,K),E.extent,o))}}function q(P,...L){if(this.__zooming){var E=C(this,L).event(P),N=P.changedTouches,z=N.length,M,R;for(ju(P),f&&clearTimeout(f),f=setTimeout(function(){f=null},p),M=0;M<z;++M)R=N[M],E.touch0&&E.touch0[2]===R.identifier?delete E.touch0:E.touch1&&E.touch1[2]===R.identifier&&delete E.touch1;if(E.touch1&&!E.touch0&&(E.touch0=E.touch1,delete E.touch1),E.touch0)E.touch0[1]=this.__zoom.invert(E.touch0[0]);else if(E.end(),E.taps===2&&(R=Yn(R,this),Math.hypot(d[0]-R[0],d[1]-R[1])<_)){var U=Fn(this).on("dblclick.zoom");U&&U.apply(this,arguments)}}}return h.wheelDelta=function(P){return arguments.length?(r=typeof P=="function"?P:Lo(+P),h):r},h.filter=function(P){return arguments.length?(e=typeof P=="function"?P:Lo(!!P),h):e},h.touchable=function(P){return arguments.length?(i=typeof P=="function"?P:Lo(!!P),h):i},h.extent=function(P){return arguments.length?(n=typeof P=="function"?P:Lo([[+P[0][0],+P[0][1]],[+P[1][0],+P[1][1]]]),h):n},h.scaleExtent=function(P){return arguments.length?(s[0]=+P[0],s[1]=+P[1],h):[s[0],s[1]]},h.translateExtent=function(P){return arguments.length?(o[0][0]=+P[0][0],o[1][0]=+P[1][0],o[0][1]=+P[0][1],o[1][1]=+P[1][1],h):[[o[0][0],o[0][1]],[o[1][0],o[1][1]]]},h.constrain=function(P){return arguments.length?(t=P,h):t},h.duration=function(P){return arguments.length?(a=+P,h):a},h.interpolate=function(P){return arguments.length?(l=P,h):l},h.on=function(){var P=u.on.apply(u,arguments);return P===u?h:P},h.clickDistance=function(P){return arguments.length?(g=(P=+P)*P,h):Math.sqrt(g)},h.tapDistance=function(P){return arguments.length?(_=+P,h):_},h}const pL=e=>e.type==="recipe"?"#f97316":e.type==="component"?"#F53200":"#22c55e";function hL({nodes:e,links:n,selectedTags:t,onTagClick:r,onRecipeNavigate:i,layoutMode:s="force",weightMode:o="uniform",linkMode:a="auto",weightingEnabled:l=!1,impact:u=1}){const c=S.useRef(null),d=S.useRef(null),f=S.useRef(r),p=S.useRef(i);return S.useEffect(()=>{f.current=r},[r]),S.useEffect(()=>{p.current=i},[i]),S.useEffect(()=>{if(!d.current||!c.current)return;const v=c.current,g=d.current;function _(){const b=v.getBoundingClientRect();return{w:Math.max(320,Math.floor(b.width)),h:Math.max(320,Math.floor(b.height))}}let{w:h,h:m}=_();const y=Fn(g);y.selectAll("*").remove(),y.attr("viewBox",`0 0 ${h} ${m}`).attr("preserveAspectRatio","xMidYMid meet");const x=y.append("g"),k=fL().scaleExtent([.3,3]).on("zoom",b=>{x.attr("transform",b.transform)});y.call(k);const C=new Set;for(const b of n)C.add(b.source),C.add(b.target);const T=e.filter(b=>C.has(b.id)),j=n.filter(b=>C.has(b.source)&&C.has(b.target)).map(b=>({...b})),F=P5(j,b=>b.weightRaw),I=ta().domain(F[0]===F[1]?[0,1]:F).range([0,1]);j.forEach(b=>{b.weight=I(b.weightRaw)});const O=new Map(T.map(b=>[b.id,b])),$=o==="select",q=l&&o!=="uniform",E=(a==="token-token"||a==="auto"&&!e.some(b=>b.type!=="tag")||a==="recipe-recipe")&&l&&o!=="uniform",N=ta().domain([0,1]).range([1,4+6*u]),z=ta().domain([0,.5,1]).range(["#93c5fd","#6366f1","#7e22ce"]),M=new Map;if($&&t.size>0)for(const b of j){const A=Ne(b.source),V=Ne(b.target),H=O.get(A),G=O.get(V);(H==null?void 0:H.type)==="tag"&&t.has(H.label)&&(M.set(V,(M.get(V)||0)+1),M.set(A,(M.get(A)||0)+1)),(G==null?void 0:G.type)==="tag"&&t.has(G.label)&&(M.set(A,(M.get(A)||0)+1),M.set(V,(M.get(V)||0)+1))}function R(b){if($&&t.size>0){const A=M.get(b.id)||0;if(A>0)return(b.type==="recipe"?7:5)+Math.min(6,1+Math.log2(1+A))}return b.type==="recipe"?7:5}const U=new Map;if($)for(const b of j){const A=Ne(b.source),V=Ne(b.target),H=O.get(A),G=O.get(V);(H==null?void 0:H.type)==="tag"&&U.set(A,(U.get(A)||0)+1),(G==null?void 0:G.type)==="tag"&&U.set(V,(U.get(V)||0)+1)}function K(b){const A=Ne(b.source),V=Ne(b.target);if($&&t.size>0){const H=O.get(A),G=O.get(V);if((H==null?void 0:H.type)==="tag"&&t.has(H.label)||(G==null?void 0:G.type)==="tag"&&t.has(G.label))return"#F53200"}return E&&b.baseColor?b.baseColor:"rgba(148,163,184,0.55)"}j.forEach(b=>{const A=Ne(b.source),V=Ne(b.target);if($){const H=O.get(A),G=O.get(V);let Ve=(H==null?void 0:H.type)==="tag"?U.get(A)||0:(G==null?void 0:G.type)==="tag"&&U.get(V)||0,ft=1;for(const Wt of U.values())Wt>ft&&(ft=Wt);b.baseColor=z(Math.max(0,Math.min(1,Ve/ft)))}else E?b.baseColor=z(b.weight??0):b.baseColor=null});const be=24,Z=80,oe=TN(j).id(b=>b.id).distance(b=>q?Z-(Z-be)*(b.weight??0)*u:Z).strength(b=>q?.2+.6*(b.weight??0)*u:.4),Q=DN(T).force("link",oe).force("charge",Ro().strength(-80)).force("center",hg(h/2,m/2)).force("collide",PN(18));if(s==="radial"){const b=A=>A.type==="recipe"||A.type==="component"?Math.min(h,m)/3:Math.min(h,m)/2;Q.force("radial",IN(b,h/2,m/2).strength(.3))}else if(s==="circle"){const b=Math.min(h,m)/2.4,A=h/2,V=m/2;T.forEach((H,G)=>{const Ve=2*Math.PI*G/T.length;H.fx=A+b*Math.cos(Ve),H.fy=V+b*Math.sin(Ve)}),Q.force("charge",Ro().strength(-10))}else if(s==="rings"){const b=h/2,A=m/2,V={token:[],recipe:[],component:[]};T.forEach(G=>V[G.type==="component"?"component":G.type==="recipe"?"recipe":"token"].push(G));const H=(G,Ve)=>G.forEach((ft,Wt)=>{const so=2*Math.PI*Wt/Math.max(1,G.length);ft.fx=b+Ve*Math.cos(so),ft.fy=A+Ve*Math.sin(so)});H(V.token,Math.min(h,m)*.42),H(V.component,Math.min(h,m)*.3),H(V.recipe,Math.min(h,m)*.18),Q.force("charge",Ro().strength(-10))}else if(s==="spiral"){const b=h/2,A=m/2;T.forEach((V,H)=>{const G=.35*H,Ve=10+6*G;V.fx=b+Ve*Math.cos(G),V.fy=A+Ve*Math.sin(G)}),Q.force("charge",Ro().strength(-8))}const Ae=x.append("g").attr("class","link-layer").selectAll("line").data(j).enter().append("line").attr("stroke",b=>K(b)).attr("stroke-width",b=>{if(!l||o==="uniform"||o==="select"&&t.size===0)return 1;if(o==="select"&&t.size>0){const A=Ne(b.source),V=Ne(b.target),H=O.get(A),G=O.get(V),Ve=(H==null?void 0:H.type)==="tag"&&t.has(H.label),ft=(G==null?void 0:G.type)==="tag"&&t.has(G.label);if(Ve||ft){const Wt=Ve?H:G,so=j.reduce(($x,Jf)=>{const Ox=Ne(Jf.source),Bx=Ne(Jf.target);return $x+(Ox===Wt.id||Bx===Wt.id?1:0)},0);return 3+Math.min(1,Math.log2(1+so)/2)}return 1}return N(b.weight??0)}),Ye=new Map;j.forEach(b=>{const A=Ne(b.source),V=Ne(b.target);Ye.has(A)||Ye.set(A,new Set),Ye.has(V)||Ye.set(V,new Set),Ye.get(A).add(V),Ye.get(V).add(A)});const Ut=x.append("g").selectAll("g").data(T).enter().append("g").call(xM().on("start",(b,A)=>{b.active||Q.alphaTarget(.3).restart(),A.fx=A.x,A.fy=A.y}).on("drag",(b,A)=>{A.fx=b.x,A.fy=b.y}).on("end",(b,A)=>{b.active||Q.alphaTarget(0),A.fx=null,A.fy=null}));let Ht=document.getElementById("d3-viz-tooltip");Ht||(Ht=document.createElement("div"),Ht.id="d3-viz-tooltip",Ht.style.cssText="position:fixed;display:none;background:#111;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;pointer-events:none;z-index:9999",document.body.appendChild(Ht));function no(b,A){const V=document.getElementById("d3-viz-tooltip");V&&(V.textContent=`${A.label} · ${A.type}`,V.style.left=b.clientX+16+"px",V.style.top=b.clientY-16+"px",V.style.display="block")}function kr(){const b=document.getElementById("d3-viz-tooltip");b&&(b.style.display="none")}const to=Ut.append("circle").attr("r",b=>R(b)).attr("fill",b=>pL(b)).attr("stroke","#111").attr("stroke-width",.6).style("cursor","pointer").on("click",(b,A)=>{kr(),A.type==="tag"?f.current(A.label):(A.type==="recipe"||A.type==="component")&&A.url&&p.current(A.url)}).on("mouseover",function(b,A){El(A),no(b,A)}).on("mousemove",function(b,A){no(b,A)}).on("mouseout",function(){Al(),kr()}),ro=Ut.append("text").text(b=>b.label).attr("x",10).attr("y",3).attr("font-size",10).attr("fill","#111").attr("paint-order","stroke").attr("stroke","#ffffff").attr("stroke-width",2).attr("stroke-opacity",.9).style("pointer-events","none");Ut.selectAll("text").raise();function El(b){const A=new Set([b.id]),V=Ye.get(b.id);if(V)for(const H of V)A.add(H);to.transition().duration(120).attr("r",H=>A.has(H.id)?R(H)+(H.id===b.id?2:1):Math.max(3,R(H)-1)).attr("opacity",H=>A.has(H.id)?1:.25),ro.transition().duration(120).attr("opacity",H=>A.has(H.id)?1:.25),Ae.transition().duration(120).attr("opacity",H=>{const G=Ne(H.source),Ve=Ne(H.target);return G===b.id||Ve===b.id?.9:.15}).attr("stroke",H=>K(H))}function Al(){to.transition().duration(120).attr("r",b=>R(b)).attr("opacity",1),ro.transition().duration(120).attr("opacity",1),Ae.transition().duration(120).attr("opacity",1).attr("stroke",b=>K(b))}Q.on("tick",()=>{Ae.attr("x1",b=>b.source.x).attr("y1",b=>b.source.y).attr("x2",b=>b.target.x).attr("y2",b=>b.target.y),Ut.attr("transform",b=>`translate(${b.x},${b.y})`)});function io(){const b=_();h=b.w,m=b.h,y.attr("viewBox",`0 0 ${h} ${m}`),Q.force("center",hg(h/2,m/2)),Q.alpha(.3).restart()}return window.addEventListener("resize",io),()=>{Q.stop(),window.removeEventListener("resize",io);const b=document.getElementById("d3-viz-tooltip");b&&b.remove()}},[e,n,t,s,o,a,l,u]),w.jsx("div",{ref:c,className:"w-full h-full",children:w.jsx("svg",{ref:d,className:"w-full h-full"})})}function Ne(e){return typeof e=="object"?e.id:e}const mL="/recettes-cuisine/".replace(/\/$/,"");function Jc(e,n,t){const r=Array.from(n).filter(s=>t.has(s));if(r.length===0)return 0;const i=new Set(e.tags);return r.filter(s=>i.has(s)).length/r.length}function gL(){const[e,n]=Yd(),t=Us(),[r,i]=S.useState(()=>{const b=e.get("tags");return b?new Set(b.split(",").map(A=>A.trim()).filter(Boolean)):new Set}),[s,o]=S.useState(()=>Number(e.get("mt")??0)),[a,l]=S.useState(()=>e.get("inf")==="1"),[u,c]=S.useState(()=>e.get("mode")==="what_i_have"?"what_i_have":"tag"),[d,f]=S.useState(()=>e.get("q")??""),[p,v]=S.useState(()=>{const b=e.get("cat");return b?new Set(b.split(",").filter(Boolean)):new Set}),[g,_]=S.useState(()=>e.get("components")!=="0"),[h,m]=S.useState(""),[y,x]=S.useState(!1),[k,C]=S.useState(()=>e.get("viz")==="1"),[T,j]=S.useState(()=>e.get("layout")??"force"),[F,I]=S.useState(()=>e.get("links")??"auto"),[O,$]=S.useState(()=>e.get("edge")??"uniform"),[q,P]=S.useState(()=>Number(e.get("impact")??1)),[L,E]=S.useState(()=>Number(e.get("mr")??60)),[N]=S.useState(()=>Number(e.get("mi")??60)),[z,M]=S.useState(()=>e.get("st")!=="0"),[R,U]=S.useState(()=>e.get("sr")!=="0"),[K,be]=S.useState(()=>e.get("sc")!=="0"),Z=S.useRef(null);S.useEffect(()=>{if(e.get("autoScroll")==="1"&&Z.current){const b=Z.current;setTimeout(()=>b.scrollIntoView({behavior:"smooth"}),300)}},[]),S.useEffect(()=>{const b={};r.size&&(b.tags=Array.from(r).join(",")),d&&(b.q=d),s>0&&(b.mt=String(s)),a&&(b.inf="1"),u!=="tag"&&(b.mode=u),p.size&&(b.cat=Array.from(p).join(",")),g||(b.components="0"),k&&(b.viz="1"),T!=="force"&&(b.layout=T),F!=="auto"&&(b.links=F),O!=="uniform"&&(b.edge=O),q!==1&&(b.impact=String(q)),L!==60&&(b.mr=String(L)),N!==60&&(b.mi=String(N)),z||(b.st="0"),R||(b.sr="0"),K||(b.sc="0"),n(b,{replace:!0})},[r,s,a,u,d,p,g,k,T,F,O,q,L,N,z,R,K,n]);const oe=S.useMemo(()=>[...Hs.map(b=>({...b,itemType:"recipe"})),...of.map(b=>({...b,itemType:"component"}))],[]),Q=S.useMemo(()=>new Set(Qm.filter(b=>b.ingredient).map(b=>b.id)),[]),te=S.useMemo(()=>{let b=g?oe:oe.filter(A=>A.itemType==="recipe");return d.trim()&&(b=x5(b,d)),p.size>0&&(b=b.filter(A=>ns.some(V=>p.has(V.id)&&A.tags.some(H=>V.tags.includes(H))))),r.size>0&&u==="tag"&&!a&&(b=b.filter(A=>Bi(A,r,s).included)),r.size>0&&(b=[...b].sort((A,V)=>{if(u==="what_i_have"){const H=Jc(A,r,Q),G=Jc(V,r,Q);if(G!==H)return G-H}else{const H=Bi(A,r,999),G=Bi(V,r,999);if(G.matched!==H.matched)return G.matched-H.matched}return A.title.localeCompare(V.title,"fr")})),b},[oe,r,s,a,u,d,p,g,Q]),Ae=S.useMemo(()=>{const b=new Map;for(const A of te)for(const V of A.tags)r.has(V)||b.set(V,(b.get(V)||0)+1);return Array.from(b.entries()).sort((A,V)=>V[1]-A[1]).slice(0,20)},[te,r]),Ye=S.useMemo(()=>{if(!h.trim())return[];const b=ls(h);return Qm.filter(A=>!r.has(A.id)&&ls(A.id).includes(b)).slice(0,10)},[h,r]),Ut=S.useMemo(()=>{if(r.size===0)return[];const b=new Set(te.map(A=>A.slug));return oe.filter(A=>!b.has(A.slug)).map(A=>({recipe:A,score:Bi(A,r,999).matched})).filter(A=>A.score>0).sort((A,V)=>V.score!==A.score?V.score-A.score:A.recipe.title.localeCompare(V.recipe.title,"fr")).slice(0,6).map(A=>A.recipe)},[oe,te,r]),{graphNodes:Ht,graphLinks:no}=S.useMemo(()=>{if(!k)return{graphNodes:[],graphLinks:[]};const{nodes:b,links:A}=_5(te,oe,{linkMode:F,weightMode:O,maxRecipes:L,maxIngredients:N,hideTopIngredients:0,showTokens:z,showRecipes:R,showComponents:K,selectedTags:r,makeUrl:V=>`/recette/${V}`});return{graphNodes:b,graphLinks:A}},[k,te,oe,F,O,L,N,z,R,K,r]);function kr(b){const A=b.trim();A&&(i(V=>new Set([...V,A])),m(""),x(!1))}function to(b){i(A=>{const V=new Set(A);return V.delete(b),V})}function ro(){i(new Set)}function El(b){v(A=>{const V=new Set(A);return V.has(b)?V.delete(b):V.add(b),V})}const Al=S.useCallback(b=>{i(A=>{const V=new Set(A);return V.has(b)?V.delete(b):V.add(b),V})},[]),io=S.useCallback(b=>{t(b)},[t]);return w.jsxs("div",{className:"min-h-screen bg-orange-50 flex flex-col md:flex-row",children:[w.jsxs("aside",{className:"w-full md:w-72 lg:w-80 flex-shrink-0 bg-white border-r border-orange-100 p-4 flex flex-col gap-4 overflow-y-auto md:h-screen md:sticky md:top-0 pb-24 md:pb-4",children:[w.jsx("h1",{className:"font-gelica text-primary text-2xl font-bold pt-2",children:"Recherche"}),w.jsxs("div",{children:[w.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5",children:"Nom de la recette"}),w.jsxs("div",{className:"relative",children:[w.jsx("input",{type:"text",value:d,onChange:b=>f(b.target.value),placeholder:"Rechercher…",className:"w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"}),d&&w.jsx("button",{onClick:()=>f(""),className:"absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm",children:"✕"})]})]}),ns.length>0&&w.jsxs("div",{children:[w.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2",children:"Catégories"}),w.jsx("div",{className:"flex flex-wrap gap-1.5",children:ns.filter(b=>!b.mode).map(b=>w.jsx("button",{onClick:()=>El(b.id),className:`px-2.5 py-1 rounded-full text-xs font-medium border transition ${p.has(b.id)?"bg-primary text-white border-primary":"bg-white text-gray-600 border-gray-200 hover:border-primary/50"}`,children:b.label},b.id))})]}),w.jsxs("div",{children:[w.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2",children:"Mode"}),w.jsxs("div",{className:"flex gap-2 mb-3",children:[w.jsx("button",{onClick:()=>c("tag"),className:`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${u==="tag"?"bg-primary text-white border-primary":"bg-white text-gray-600 border-gray-200"}`,children:"Tags"}),w.jsx("button",{onClick:()=>c("what_i_have"),className:`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${u==="what_i_have"?"bg-primary text-white border-primary":"bg-white text-gray-600 border-gray-200"}`,children:"J'ai ces ingrédients"})]}),u==="tag"&&w.jsxs("div",{className:"flex items-center gap-2",children:[w.jsx("span",{className:"text-xs text-gray-500",children:"Tolérance"}),w.jsx("button",{onClick:()=>l(b=>!b),className:`px-2 py-0.5 rounded-full text-xs font-mono font-bold border transition ${a?"bg-orange-100 text-orange-700 border-orange-300":"bg-gray-50 text-gray-600 border-gray-200"}`,children:a?"∞":s}),!a&&w.jsx("input",{type:"range",min:0,max:5,step:1,value:s,onChange:b=>o(Number(b.target.value)),className:"flex-1 accent-primary"})]})]}),w.jsxs("div",{children:[w.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5",children:u==="what_i_have"?"Ingrédients que j'ai":"Filtrer par tags"}),w.jsxs("div",{className:"relative",children:[w.jsx("input",{type:"text",value:h,onChange:b=>{m(b.target.value),x(!0)},onFocus:()=>x(!0),onBlur:()=>setTimeout(()=>x(!1),150),onKeyDown:b=>{b.key==="Enter"&&h.trim()&&(kr(ls(h.trim())),b.preventDefault()),b.key==="Escape"&&x(!1)},placeholder:"Ajouter un tag…",className:"w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"}),y&&Ye.length>0&&w.jsx("div",{className:"absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto",children:Ye.map(b=>w.jsx("button",{onMouseDown:()=>kr(b.id),className:"w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50",children:b.id},b.id))})]}),r.size>0&&w.jsxs("div",{className:"mt-2 flex flex-wrap gap-1.5",children:[w.jsx("button",{onClick:ro,className:"px-2 py-0.5 rounded-full text-xs text-gray-500 border border-gray-200 hover:bg-gray-50",children:"Tout effacer"}),Array.from(r).map(b=>w.jsxs("span",{className:"inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-white rounded-full text-xs",children:[b,w.jsx("button",{onClick:()=>to(b),className:"hover:opacity-70 leading-none",children:"✕"})]},b))]})]}),Ae.length>0&&w.jsxs("div",{children:[w.jsx("p",{className:"text-xs text-gray-400 mb-1.5",children:"Suggestions"}),w.jsx("div",{className:"flex flex-wrap gap-1.5",children:Ae.map(([b,A])=>w.jsxs("button",{onClick:()=>kr(b),className:"px-2.5 py-1 rounded-full text-xs bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition",children:[b,w.jsx("span",{className:"ml-1 text-[10px] text-orange-400 font-mono",children:A})]},b))})]}),w.jsxs("label",{className:"flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none",children:[w.jsx("input",{type:"checkbox",checked:g,onChange:b=>_(b.target.checked),className:"rounded accent-primary"}),"Inclure les composants"]})]}),w.jsxs("main",{className:"flex-1 p-4 md:p-6 flex flex-col gap-6 min-h-screen",children:[w.jsxs("div",{ref:Z,className:"flex items-center justify-between pt-2",children:[w.jsxs("p",{className:"text-sm text-gray-500",children:[w.jsx("span",{className:"font-semibold text-gray-800",children:te.length})," ","recette",te.length!==1?"s":""]}),w.jsx("button",{onClick:()=>C(b=>!b),className:`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${k?"bg-primary text-white border-primary":"bg-white text-gray-600 border-gray-200 hover:border-primary/50"}`,children:k?"✕ Fermer la visualisation":"⬡ Visualisation"})]}),k&&w.jsxs("div",{className:"bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3",children:[w.jsxs("div",{className:"flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600",children:[w.jsxs("label",{className:"flex items-center gap-1",children:["Layout:",w.jsx("select",{value:T,onChange:b=>j(b.target.value),className:"ml-1 border border-gray-200 rounded px-1.5 py-0.5",children:["force","radial","circle","rings","spiral"].map(b=>w.jsx("option",{value:b,children:b},b))})]}),w.jsxs("label",{className:"flex items-center gap-1",children:["Liens:",w.jsx("select",{value:F,onChange:b=>I(b.target.value),className:"ml-1 border border-gray-200 rounded px-1.5 py-0.5",children:["auto","recipe-token","token-token","recipe-recipe"].map(b=>w.jsx("option",{value:b,children:b},b))})]}),w.jsxs("label",{className:"flex items-center gap-1",children:["Poids:",w.jsx("select",{value:O,onChange:b=>$(b.target.value),className:"ml-1 border border-gray-200 rounded px-1.5 py-0.5",children:["uniform","idf","freq","select"].map(b=>w.jsx("option",{value:b,children:b},b))})]}),w.jsxs("label",{className:"flex items-center gap-1.5 cursor-pointer",children:[w.jsx("input",{type:"checkbox",checked:z,onChange:b=>M(b.target.checked),className:"accent-green-500"}),w.jsx("span",{className:"text-green-600 font-medium",children:"Ingrédients"})]}),w.jsxs("label",{className:"flex items-center gap-1.5 cursor-pointer",children:[w.jsx("input",{type:"checkbox",checked:R,onChange:b=>U(b.target.checked),className:"accent-orange-500"}),w.jsx("span",{className:"text-orange-500 font-medium",children:"Recettes"})]}),w.jsxs("label",{className:"flex items-center gap-1.5 cursor-pointer",children:[w.jsx("input",{type:"checkbox",checked:K,onChange:b=>be(b.target.checked)}),w.jsx("span",{className:"text-red-600 font-medium",children:"Composants"})]}),w.jsxs("label",{className:"flex items-center gap-1",children:[w.jsx("span",{className:"text-gray-400",children:"Max recettes:"}),w.jsx("input",{type:"range",min:10,max:150,step:5,value:L,onChange:b=>E(Number(b.target.value)),className:"w-20 accent-primary ml-1"}),w.jsx("span",{className:"font-mono text-gray-500 w-7 tabular-nums",children:L})]}),w.jsxs("label",{className:"flex items-center gap-1",children:[w.jsx("span",{className:"text-gray-400",children:"Impact:"}),w.jsx("input",{type:"range",min:0,max:3,step:.1,value:q,onChange:b=>P(Number(b.target.value)),className:"w-16 accent-primary ml-1"})]})]}),w.jsx("div",{className:"aspect-video w-full bg-gray-50 rounded-lg overflow-hidden",children:w.jsx(hL,{nodes:Ht,links:no,selectedTags:r,onTagClick:Al,onRecipeNavigate:io,layoutMode:T,linkMode:F,weightMode:O,weightingEnabled:O!=="uniform",impact:q})}),w.jsxs("div",{className:"flex gap-4 text-xs text-gray-400",children:[w.jsxs("span",{className:"flex items-center gap-1.5",children:[w.jsx("span",{className:"w-2.5 h-2.5 rounded-full bg-green-500 inline-block flex-shrink-0"}),"Ingrédients"]}),w.jsxs("span",{className:"flex items-center gap-1.5",children:[w.jsx("span",{className:"w-2.5 h-2.5 rounded-full bg-orange-400 inline-block flex-shrink-0"}),"Recettes"]}),w.jsxs("span",{className:"flex items-center gap-1.5",children:[w.jsx("span",{className:"w-2.5 h-2.5 rounded-full bg-[#F53200] inline-block flex-shrink-0"}),"Composants"]})]})]}),te.length>0?w.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3",children:te.map((b,A)=>w.jsx(Cg,{recipe:b,selectedTags:r,mode:u,ingredientTagIds:Q,eager:A<8},b.slug))}):w.jsxs("div",{className:"text-center py-16 text-gray-400",children:[w.jsx("p",{className:"text-base",children:"Aucune recette trouvée"}),w.jsx("p",{className:"text-sm mt-1",children:r.size>0&&u==="tag"&&!a?"Essayez d'augmenter la tolérance ou de réduire les filtres.":"Essayez de modifier vos critères de recherche."})]}),Ut.length>0&&w.jsxs("section",{children:[w.jsx("h2",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3",children:"Recettes proches"}),w.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3",children:Ut.map(b=>w.jsx(Cg,{recipe:b,selectedTags:r,mode:u,ingredientTagIds:Q,eager:!1},b.slug))})]})]})]})}function Cg({recipe:e,selectedTags:n,mode:t,ingredientTagIds:r,eager:i}){const{matched:s,missing:o}=n.size>0?Bi(e,n,999):{matched:0,missing:0},a=s+o,l=a>0?s/a:1,u=t==="what_i_have"&&n.size>0?Jc(e,n,r):null,c=l>=1?"#22c55e":l>=.5?"#f97316":"#F53200";return w.jsxs(at,{to:`/recette/${e.slug}`,className:"group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow",children:[w.jsxs("div",{className:"relative aspect-video overflow-hidden",children:[w.jsx("img",{src:`${mL}/images/cards/${e.image}.webp`,alt:e.title,className:"w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",loading:i?"eager":"lazy"}),n.size>0&&w.jsx("span",{className:"absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-white text-xs font-bold shadow ring-2 ring-white",style:{background:c},children:u!==null?`${Math.round(u*100)}%`:`${s}/${a}`})]}),w.jsx("div",{className:"p-2 pb-3",children:w.jsx("p",{className:"text-xs font-semibold text-gray-800 leading-tight line-clamp-2",children:e.title})})]})}class vL extends S.Component{constructor(){super(...arguments);re(this,"state",{error:null})}static getDerivedStateFromError(t){return{error:t}}render(){return this.state.error?w.jsxs("div",{style:{padding:24,fontFamily:"monospace",color:"red"},children:[w.jsx("h2",{children:"Render error"}),w.jsx("pre",{children:String(this.state.error)}),w.jsx("pre",{children:this.state.error.stack})]}):this.props.children}}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/recettes-cuisine/serviceworker.js")});const yL=document.getElementById("root");qv(yL).render(w.jsx(S.StrictMode,{children:w.jsx(vL,{children:w.jsx(k2,{children:w.jsx(h2,{children:w.jsxs(qi,{element:w.jsx(N2,{}),children:[w.jsx(qi,{index:!0,element:w.jsx(mP,{})}),w.jsx(qi,{path:"recette/:slug",element:w.jsx(p5,{})}),w.jsx(qi,{path:"recherche",element:w.jsx(gL,{})})]})})})})}));
