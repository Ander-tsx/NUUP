module.exports = [
"[project]/frontend/node_modules/sileo/dist/cc-B6peeNak.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "_",
    ()=>_extends,
    "a",
    ()=>_object_without_properties_loose
]);
function __insertCSS(code) {
    if (!code || typeof document == 'undefined') return;
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.type = 'text/css';
    head.appendChild(style);
    style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
function _extends() {
    _extends = Object.assign || function assign(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
;
}),
"[project]/frontend/node_modules/sileo/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster,
    "sileo",
    ()=>sileo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/sileo/dist/cc-B6peeNak.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
'use client';
function __insertCSS(code) {
    if (!code || typeof document == 'undefined') return;
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.type = 'text/css';
    head.appendChild(style);
    style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
;
;
;
;
__insertCSS(":root{--sileo-spring-easing:linear(\n\t\t0,\n\t\t0.002 0.6%,\n\t\t0.007 1.2%,\n\t\t0.015 1.8%,\n\t\t0.026 2.4%,\n\t\t0.041 3.1%,\n\t\t0.06 3.8%,\n\t\t0.108 5.3%,\n\t\t0.157 6.6%,\n\t\t0.214 8%,\n\t\t0.467 13.7%,\n\t\t0.577 16.3%,\n\t\t0.631 17.7%,\n\t\t0.682 19.1%,\n\t\t0.73 20.5%,\n\t\t0.771 21.8%,\n\t\t0.808 23.1%,\n\t\t0.844 24.5%,\n\t\t0.874 25.8%,\n\t\t0.903 27.2%,\n\t\t0.928 28.6%,\n\t\t0.952 30.1%,\n\t\t0.972 31.6%,\n\t\t0.988 33.1%,\n\t\t1.01 35.7%,\n\t\t1.025 38.5%,\n\t\t1.034 41.6%,\n\t\t1.038 45%,\n\t\t1.035 50.1%,\n\t\t1.012 64.2%,\n\t\t1.003 73%,\n\t\t0.999 83.7%,\n\t\t1\n\t);--sileo-duration:600ms;--sileo-height:40px;--sileo-width:350px;--sileo-state-success:oklch(0.723 0.219 142.136);--sileo-state-loading:oklch(0.556 0 0);--sileo-state-error:oklch(0.637 0.237 25.331);--sileo-state-warning:oklch(0.795 0.184 86.047);--sileo-state-info:oklch(0.685 0.169 237.323);--sileo-state-action:oklch(0.623 0.214 259.815)}[data-sileo-toast]{position:relative;cursor:pointer;pointer-events:auto;touch-action:none;border:0;background:0 0;padding:0;width:var(--sileo-width);height:var(--_h,var(--sileo-height));opacity:0;transform:translateZ(0) scale(.95);transform-origin:center;contain:layout style;overflow:visible}[data-sileo-toast][data-state=loading]{cursor:default}[data-sileo-toast][data-ready=true]{opacity:1;transform:translateZ(0) scale(1);transition:transform calc(var(--sileo-duration) * .66) var(--sileo-spring-easing),opacity calc(var(--sileo-duration) * .66) var(--sileo-spring-easing),margin-bottom calc(var(--sileo-duration) * .66) var(--sileo-spring-easing),margin-top calc(var(--sileo-duration) * .66) var(--sileo-spring-easing),height var(--sileo-duration) var(--sileo-spring-easing)}[data-sileo-viewport][data-position^=top] [data-sileo-toast]:not([data-ready=true]){transform:translateY(-6px) scale(.95)}[data-sileo-viewport][data-position^=bottom] [data-sileo-toast]:not([data-ready=true]){transform:translateY(6px) scale(.95)}[data-sileo-toast][data-ready=true][data-exiting=true]{opacity:0;pointer-events:none}[data-sileo-viewport][data-position^=top] [data-sileo-toast][data-ready=true][data-exiting=true]{transform:translateY(-6px) scale(.95)}[data-sileo-viewport][data-position^=bottom] [data-sileo-toast][data-ready=true][data-exiting=true]{transform:translateY(6px) scale(.95)}[data-sileo-canvas]{position:absolute;left:0;right:0;pointer-events:none;transform:translateZ(0);contain:layout style;overflow:visible}[data-sileo-canvas][data-edge=top]{bottom:0;transform:scaleY(-1) translateZ(0)}[data-sileo-canvas][data-edge=bottom]{top:0}[data-sileo-svg]{overflow:visible}[data-sileo-header]{position:absolute;z-index:20;display:flex;align-items:center;padding:.5rem;height:var(--sileo-height);overflow:hidden;left:var(--_px,0);transform:var(--_ht);max-width:var(--_pw)}[data-sileo-toast][data-ready=true] [data-sileo-header]{transition:transform var(--sileo-duration) var(--sileo-spring-easing),left var(--sileo-duration) var(--sileo-spring-easing),max-width var(--sileo-duration) var(--sileo-spring-easing)}[data-sileo-header][data-edge=top]{bottom:0}[data-sileo-header][data-edge=bottom]{top:0}[data-sileo-header-stack]{position:relative;display:inline-flex;align-items:center;height:100%}[data-sileo-header-inner]{display:flex;align-items:center;gap:.5rem;white-space:nowrap;opacity:1;filter:blur(0px);transform:translateZ(0)}[data-sileo-header-inner][data-layer=current]{position:relative;z-index:1;animation:sileo-header-enter var(--sileo-duration) var(--sileo-spring-easing) both}[data-sileo-header-inner][data-exiting=true],[data-sileo-header-inner][data-layer=current]:not(:only-child){will-change:opacity,filter}[data-sileo-header-inner][data-layer=prev]{position:absolute;left:0;top:0;z-index:0;pointer-events:none}[data-sileo-header-inner][data-exiting=true]{animation:sileo-header-exit calc(var(--sileo-duration) * .7) ease forwards}[data-sileo-badge]{display:flex;height:24px;width:24px;flex-shrink:0;align-items:center;justify-content:center;padding:2px;box-sizing:border-box;border-radius:9999px;color:var(--sileo-tone,currentColor);background-color:var(--sileo-tone-bg,transparent)}[data-sileo-title]{font-size:.825rem;line-height:1rem;font-weight:500;text-transform:capitalize;color:var(--sileo-tone,currentColor)}:is([data-sileo-badge],[data-sileo-title],[data-sileo-button])[data-state]{--_c:var(--sileo-state-success)}:is(\n[data-sileo-badge],[data-sileo-title],[data-sileo-button]\n)[data-state=loading]{--_c:var(--sileo-state-loading)}:is(\n[data-sileo-badge],[data-sileo-title],[data-sileo-button]\n)[data-state=error]{--_c:var(--sileo-state-error)}:is(\n[data-sileo-badge],[data-sileo-title],[data-sileo-button]\n)[data-state=warning]{--_c:var(--sileo-state-warning)}:is(\n[data-sileo-badge],[data-sileo-title],[data-sileo-button]\n)[data-state=info]{--_c:var(--sileo-state-info)}:is(\n[data-sileo-badge],[data-sileo-title],[data-sileo-button]\n)[data-state=action]{--_c:var(--sileo-state-action)}:is([data-sileo-badge],[data-sileo-title])[data-state]{--sileo-tone:var(--_c);--sileo-tone-bg:color-mix(in oklch, var(--_c) 20%, transparent)}[data-sileo-content]{position:absolute;left:0;z-index:10;width:100%;pointer-events:none;opacity:var(--_co, 0)}[data-sileo-content]:not([data-visible=true]){content-visibility:hidden}[data-sileo-toast][data-ready=true] [data-sileo-content]{transition:opacity calc(var(--sileo-duration) * .08) ease calc(var(--sileo-duration) * .04)}[data-sileo-content][data-edge=top]{top:0}[data-sileo-content][data-edge=bottom]{top:var(--sileo-height)}[data-sileo-content][data-visible=true]{pointer-events:auto}[data-sileo-toast][data-ready=true] [data-sileo-content][data-visible=true]{transition:opacity calc(var(--sileo-duration) * .6) ease calc(var(--sileo-duration) * .3)}[data-sileo-description]{width:100%;text-align:left;padding:1rem;font-size:.875rem;line-height:1.25rem;contain:layout style paint;content-visibility:auto}[data-sileo-button]{display:flex;align-items:center;justify-content:center;height:1.75rem;padding:0 .625rem;margin-top:.75rem;border-radius:9999px;border:0;font-size:.75rem;font-weight:500;cursor:pointer;color:var(--sileo-btn-color,currentColor);background-color:var(--sileo-btn-bg,transparent);transition:background-color 150ms ease}[data-sileo-button]:hover{background-color:var(--sileo-btn-bg-hover,transparent)}[data-sileo-button][data-state]{--sileo-btn-color:var(--_c);--sileo-btn-bg:color-mix(in oklch, var(--_c) 15%, transparent);--sileo-btn-bg-hover:color-mix(in oklch, var(--_c) 25%, transparent)}[data-sileo-icon=spin]{animation:sileo-spin 1s linear infinite}@keyframes sileo-spin{to{transform:rotate(360deg)}}@keyframes sileo-header-enter{from{opacity:0;filter:blur(6px)}to{opacity:1;filter:blur(0px)}}@keyframes sileo-header-exit{from{opacity:1;filter:blur(0px)}to{opacity:0;filter:blur(6px)}}[data-sileo-viewport]{position:fixed;z-index:50;display:flex;gap:.75rem;padding:.75rem;pointer-events:none;max-width:calc(100vw - 1.5rem);contain:layout style}[data-sileo-viewport][data-position^=top] [data-sileo-toast]:not([data-ready=true]){margin-bottom:calc(-1 * (var(--sileo-height) + .75rem))}[data-sileo-viewport][data-position^=bottom] [data-sileo-toast]:not([data-ready=true]){margin-top:calc(-1 * (var(--sileo-height) + .75rem))}[data-sileo-viewport][data-position^=top]{top:0;flex-direction:column-reverse}[data-sileo-viewport][data-position^=bottom]{bottom:0;flex-direction:column}[data-sileo-viewport][data-position$=left]{left:0;align-items:flex-start}[data-sileo-viewport][data-position$=right]{right:0;align-items:flex-end}[data-sileo-viewport][data-position$=center]{left:50%;transform:translateX(-50%);align-items:center}@media (prefers-reduced-motion:no-preference){[data-sileo-toast][data-ready=true]:hover,[data-sileo-toast][data-ready=true][data-exiting=true]{will-change:transform,opacity,height}}@media (prefers-reduced-motion:reduce){[data-sileo-viewport],[data-sileo-viewport] *,[data-sileo-viewport] ::after,[data-sileo-viewport] ::before{animation-duration:0s;animation-iteration-count:1;transition-duration:0s}}[data-sileo-viewport][data-theme=dark] [data-sileo-description]{color:rgba(0,0,0,.5)}[data-sileo-viewport][data-theme=light] [data-sileo-description]{color:rgba(255,255,255,.5)}");
/* --------------------------------- Layout --------------------------------- */ const HEIGHT = 40;
const WIDTH = 350;
const DEFAULT_ROUNDNESS = 16;
/* --------------------------------- Timing --------------------------------- */ const DURATION_MS = 600;
const DURATION_S = DURATION_MS / 1000;
const DEFAULT_TOAST_DURATION = 6000;
const EXIT_DURATION = DEFAULT_TOAST_DURATION * 0.1;
const AUTO_EXPAND_DELAY = DEFAULT_TOAST_DURATION * 0.025;
const AUTO_COLLAPSE_DELAY = DEFAULT_TOAST_DURATION - 2000;
const SPRING = {
    type: "spring",
    bounce: 0.25,
    duration: DURATION_S
};
/* --------------------------------- Render --------------------------------- */ const BLUR_RATIO = 0.5;
const PILL_PADDING = 10;
const MIN_EXPAND_RATIO = 2.25;
const SWAP_COLLAPSE_MS = 200;
const HEADER_EXIT_MS = DURATION_MS * 0.7;
const Icon = (_0)=>{
    let { title, children } = _0, props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(_0, [
        "title",
        "children"
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("svg", (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, props, {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("title", {
                children: title
            }),
            children
        ]
    }));
};
const ArrowRight = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(Icon, {
        title: "Arrow Right",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "M5 12h14"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "m12 5 7 7-7 7"
            })
        ]
    });
const LifeBuoy = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(Icon, {
        title: "Life Buoy",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "m4.93 4.93 4.24 4.24"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "m14.83 9.17 4.24-4.24"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "m14.83 14.83 4.24 4.24"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "m9.17 14.83-4.24 4.24"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("circle", {
                cx: "12",
                cy: "12",
                r: "4"
            })
        ]
    });
const LoaderCircle = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Icon, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({
        title: "Loader Circle"
    }, props, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
            d: "M21 12a9 9 0 1 1-6.219-8.56"
        })
    }));
const X = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(Icon, {
        title: "X",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "M18 6 6 18"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
                d: "m6 6 12 12"
            })
        ]
    });
const CircleAlert = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(Icon, {
        title: "Circle Alert",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("line", {
                x1: "12",
                x2: "12",
                y1: "8",
                y2: "12"
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("line", {
                x1: "12",
                x2: "12.01",
                y1: "16",
                y2: "16"
            })
        ]
    });
const Check = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Icon, {
        title: "Check",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("path", {
            d: "M20 6 9 17l-5-5"
        })
    });
/* ---------------------------------- Icons --------------------------------- */ const STATE_ICON = {
    success: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Check, {}),
    loading: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LoaderCircle, {
        "data-sileo-icon": "spin",
        "aria-hidden": "true"
    }),
    error: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(X, {}),
    warning: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(CircleAlert, {}),
    info: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LifeBuoy, {}),
    action: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ArrowRight, {})
};
/* ----------------------------- Memoised Defs ------------------------------ */ const GooeyDefs = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(function GooeyDefs({ filterId, blur }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("defs", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("filter", {
            id: filterId,
            x: "-20%",
            y: "-20%",
            width: "140%",
            height: "140%",
            colorInterpolationFilters: "sRGB",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("feGaussianBlur", {
                    in: "SourceGraphic",
                    stdDeviation: blur,
                    result: "blur"
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("feColorMatrix", {
                    in: "blur",
                    mode: "matrix",
                    values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10",
                    result: "goo"
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("feComposite", {
                    in: "SourceGraphic",
                    in2: "goo",
                    operator: "atop"
                })
            ]
        })
    });
});
/* ------------------------------- Component -------------------------------- */ const Sileo = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(function Sileo({ id, fill = "#FFFFFF", state = "success", title = state, description, position = "left", expand = "bottom", className, icon, styles, button, roundness, exiting = false, autoExpandDelayMs, autoCollapseDelayMs, canExpand, interruptKey, refreshKey, onMouseEnter, onMouseLeave, onDismiss }) {
    var _headerLayer_current_view_icon, _headerLayer_prev_view_icon;
    var _headerLayer_current_view_styles, _headerLayer_current_view_styles1, _headerLayer_prev_view_styles, _headerLayer_prev_view_styles1, _view_styles, _view_styles1;
    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            title,
            description,
            state,
            icon,
            styles,
            button,
            fill
        }), [
        title,
        description,
        state,
        icon,
        styles,
        button,
        fill
    ]);
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(next);
    const [applied, setApplied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(refreshKey);
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pillWidth, setPillWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [contentHeight, setContentHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const hasDesc = Boolean(view.description) || Boolean(view.button);
    const isLoading = view.state === "loading";
    const open = hasDesc && isExpanded && !isLoading;
    const allowExpand = isLoading ? false : canExpand != null ? canExpand : !interruptKey || interruptKey === id;
    const headerKey = `${view.state}-${view.title}`;
    const filterId = `sileo-gooey-${id}`;
    const resolvedRoundness = Math.max(0, roundness != null ? roundness : DEFAULT_ROUNDNESS);
    const blur = resolvedRoundness * BLUR_RATIO;
    const headerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const headerExitRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const autoExpandRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const autoCollapseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const swapTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastRefreshKeyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(refreshKey);
    const pendingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [headerLayer, setHeaderLayer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        current: {
            key: headerKey,
            view
        },
        prev: null
    });
    /* ------------------------------ Measurements ------------------------------ */ const innerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const headerPadRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pillRoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pillRafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const pillObservedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // biome-ignore lint/correctness/useExhaustiveDependencies: headerLayer.current.key is used to force a re-render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        const el = innerRef.current;
        const header = headerRef.current;
        if (!el || !header) return;
        if (headerPadRef.current === null) {
            const cs = getComputedStyle(header);
            headerPadRef.current = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        }
        const px = headerPadRef.current;
        const measure = ()=>{
            const w = el.scrollWidth + px + PILL_PADDING;
            if (w > PILL_PADDING) {
                setPillWidth((prev)=>prev === w ? prev : w);
            }
        };
        measure();
        if (!pillRoRef.current) {
            pillRoRef.current = new ResizeObserver(()=>{
                cancelAnimationFrame(pillRafRef.current);
                pillRafRef.current = requestAnimationFrame(()=>{
                    var _headerPadRef_current;
                    const inner = innerRef.current;
                    const pad = (_headerPadRef_current = headerPadRef.current) != null ? _headerPadRef_current : 0;
                    if (!inner) return;
                    const w = inner.scrollWidth + pad + PILL_PADDING;
                    if (w > PILL_PADDING) {
                        setPillWidth((prev)=>prev === w ? prev : w);
                    }
                });
            });
        }
        if (pillObservedRef.current !== el) {
            if (pillObservedRef.current) {
                pillRoRef.current.unobserve(pillObservedRef.current);
            }
            pillRoRef.current.observe(el);
            pillObservedRef.current = el;
        }
    }, [
        headerLayer.current.key
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            var _pillRoRef_current;
            cancelAnimationFrame(pillRafRef.current);
            (_pillRoRef_current = pillRoRef.current) == null ? void 0 : _pillRoRef_current.disconnect();
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        if (!hasDesc) {
            setContentHeight(0);
            return;
        }
        const el = contentRef.current;
        if (!el) return;
        const measure = ()=>{
            const h = el.scrollHeight;
            setContentHeight((prev)=>prev === h ? prev : h);
        };
        measure();
        let rafId = 0;
        const ro = new ResizeObserver(()=>{
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(measure);
        });
        ro.observe(el);
        return ()=>{
            cancelAnimationFrame(rafId);
            ro.disconnect();
        };
    }, [
        hasDesc
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const raf = requestAnimationFrame(()=>setReady(true));
        return ()=>cancelAnimationFrame(raf);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        setHeaderLayer((state)=>{
            if (state.current.key === headerKey) {
                if (state.current.view === view) return state;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, state, {
                    current: {
                        key: headerKey,
                        view
                    }
                });
            }
            return {
                prev: state.current,
                current: {
                    key: headerKey,
                    view
                }
            };
        });
    }, [
        headerKey,
        view
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!headerLayer.prev) return;
        if (headerExitRef.current) {
            clearTimeout(headerExitRef.current);
        }
        headerExitRef.current = window.setTimeout(()=>{
            headerExitRef.current = null;
            setHeaderLayer((state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, state, {
                    prev: null
                }));
        }, HEADER_EXIT_MS);
        return ()=>{
            if (headerExitRef.current) {
                clearTimeout(headerExitRef.current);
                headerExitRef.current = null;
            }
        };
    }, [
        headerLayer.prev
    ]);
    /* ----------------------------- Sync fill ---------------------------------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setView((prev)=>prev.fill === fill ? prev : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, prev, {
                fill
            }));
    }, [
        fill
    ]);
    /* ----------------------------- Refresh logic ------------------------------ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (refreshKey === undefined) {
            setView(next);
            setApplied(undefined);
            pendingRef.current = null;
            lastRefreshKeyRef.current = refreshKey;
            return;
        }
        if (lastRefreshKeyRef.current === refreshKey) return;
        lastRefreshKeyRef.current = refreshKey;
        if (swapTimerRef.current) {
            clearTimeout(swapTimerRef.current);
            swapTimerRef.current = null;
        }
        if (open) {
            pendingRef.current = {
                key: refreshKey,
                payload: next
            };
            setIsExpanded(false);
            swapTimerRef.current = window.setTimeout(()=>{
                swapTimerRef.current = null;
                const pending = pendingRef.current;
                if (!pending) return;
                setView(pending.payload);
                setApplied(pending.key);
                pendingRef.current = null;
            }, SWAP_COLLAPSE_MS);
        } else {
            pendingRef.current = null;
            setView(next);
            setApplied(refreshKey);
        }
    }, [
        open,
        refreshKey,
        next
    ]);
    /* ----------------------------- Auto expand/collapse ----------------------- */ // biome-ignore lint/correctness/useExhaustiveDependencies: applied is used to force a re-render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hasDesc) return;
        if (autoExpandRef.current) clearTimeout(autoExpandRef.current);
        if (autoCollapseRef.current) clearTimeout(autoCollapseRef.current);
        if (exiting || !allowExpand) {
            setIsExpanded(false);
            return;
        }
        if (autoExpandDelayMs == null && autoCollapseDelayMs == null) return;
        const expandDelay = autoExpandDelayMs != null ? autoExpandDelayMs : 0;
        const collapseDelay = autoCollapseDelayMs != null ? autoCollapseDelayMs : 0;
        if (expandDelay > 0) {
            autoExpandRef.current = window.setTimeout(()=>setIsExpanded(true), expandDelay);
        } else {
            setIsExpanded(true);
        }
        if (collapseDelay > 0) {
            autoCollapseRef.current = window.setTimeout(()=>setIsExpanded(false), collapseDelay);
        }
        return ()=>{
            if (autoExpandRef.current) clearTimeout(autoExpandRef.current);
            if (autoCollapseRef.current) clearTimeout(autoCollapseRef.current);
        };
    }, [
        autoCollapseDelayMs,
        autoExpandDelayMs,
        hasDesc,
        allowExpand,
        exiting,
        applied
    ]);
    /* ------------------------------ Derived values ---------------------------- */ const minExpanded = HEIGHT * MIN_EXPAND_RATIO;
    const rawExpanded = hasDesc ? Math.max(minExpanded, HEIGHT + contentHeight) : minExpanded;
    const frozenExpandedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(rawExpanded);
    if (open) {
        frozenExpandedRef.current = rawExpanded;
    }
    const expanded = open ? rawExpanded : frozenExpandedRef.current;
    const svgHeight = hasDesc ? Math.max(expanded, minExpanded) : HEIGHT;
    const expandedContent = Math.max(0, expanded - HEIGHT);
    const resolvedPillWidth = Math.max(pillWidth || HEIGHT, HEIGHT);
    const pillHeight = HEIGHT + blur * 3;
    const pillX = position === "right" ? WIDTH - resolvedPillWidth : position === "center" ? (WIDTH - resolvedPillWidth) / 2 : 0;
    /* ------------------------------- Memoised animate targets ----------------- */ const pillAnimate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            x: pillX,
            width: resolvedPillWidth,
            height: open ? pillHeight : HEIGHT
        }), [
        pillX,
        resolvedPillWidth,
        open,
        pillHeight
    ]);
    const bodyAnimate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            height: open ? expandedContent : 0,
            opacity: open ? 1 : 0
        }), [
        open,
        expandedContent
    ]);
    const bodyTransition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>open ? SPRING : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, SPRING, {
            bounce: 0
        }), [
        open
    ]);
    const pillTransition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>ready ? SPRING : {
            duration: 0
        }, [
        ready
    ]);
    const viewBox = `0 0 ${WIDTH} ${svgHeight}`;
    const canvasStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            filter: `url(#${filterId})`
        }), [
        filterId
    ]);
    /* ------------------------------- Inline styles ---------------------------- */ const rootStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            "--_h": `${open ? expanded : HEIGHT}px`,
            "--_pw": `${resolvedPillWidth}px`,
            "--_px": `${pillX}px`,
            "--_ht": `translateY(${open ? expand === "bottom" ? 3 : -3 : 0}px) scale(${open ? 0.9 : 1})`,
            "--_co": `${open ? 1 : 0}`
        }), [
        open,
        expanded,
        resolvedPillWidth,
        pillX,
        expand
    ]);
    /* -------------------------------- Handlers -------------------------------- */ const handleEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        onMouseEnter == null ? void 0 : onMouseEnter(e);
        if (hasDesc) setIsExpanded(true);
    }, [
        hasDesc,
        onMouseEnter
    ]);
    const handleLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        onMouseLeave == null ? void 0 : onMouseLeave(e);
        setIsExpanded(false);
    }, [
        onMouseLeave
    ]);
    const handleTransitionEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (e.propertyName !== "height" && e.propertyName !== "transform") return;
        if (open) return;
        const pending = pendingRef.current;
        if (!pending) return;
        if (swapTimerRef.current) {
            clearTimeout(swapTimerRef.current);
            swapTimerRef.current = null;
        }
        setView(pending.payload);
        setApplied(pending.key);
        pendingRef.current = null;
    }, [
        open
    ]);
    /* -------------------------------- Swipe ----------------------------------- */ const SWIPE_DISMISS = 30;
    const SWIPE_MAX = 20;
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pointerStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const onDismissRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onDismiss);
    onDismissRef.current = onDismiss;
    const swipeHandlersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    if (!swipeHandlersRef.current) {
        const handlers = {
            onMove: (e)=>{
                const el = buttonRef.current;
                if (pointerStartRef.current === null || !el) return;
                const dy = e.clientY - pointerStartRef.current;
                const sign = dy > 0 ? 1 : -1;
                const clamped = Math.min(Math.abs(dy), SWIPE_MAX) * sign;
                el.style.transform = `translateY(${clamped}px)`;
            },
            onUp: (e)=>{
                const el = buttonRef.current;
                if (pointerStartRef.current === null || !el) return;
                const dy = e.clientY - pointerStartRef.current;
                pointerStartRef.current = null;
                el.style.transform = "";
                el.removeEventListener("pointermove", handlers.onMove);
                el.removeEventListener("pointerup", handlers.onUp);
                if (Math.abs(dy) > SWIPE_DISMISS) {
                    onDismissRef.current == null ? void 0 : onDismissRef.current.call(onDismissRef);
                }
            }
        };
        swipeHandlersRef.current = handlers;
    }
    const handleButtonClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        var _view_button;
        e.preventDefault();
        e.stopPropagation();
        (_view_button = view.button) == null ? void 0 : _view_button.onClick();
    }, [
        view.button
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (exiting || !onDismiss) return;
        const target = e.target;
        if (target.closest("[data-sileo-button]")) return;
        pointerStartRef.current = e.clientY;
        e.currentTarget.setPointerCapture(e.pointerId);
        const el = buttonRef.current;
        const h = swipeHandlersRef.current;
        if (el && h) {
            el.addEventListener("pointermove", h.onMove, {
                passive: true
            });
            el.addEventListener("pointerup", h.onUp, {
                passive: true
            });
        }
    }, [
        exiting,
        onDismiss
    ]);
    /* --------------------------------- Render --------------------------------- */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("button", {
        ref: buttonRef,
        type: "button",
        "data-sileo-toast": true,
        "data-ready": ready,
        "data-expanded": open,
        "data-exiting": exiting,
        "data-edge": expand,
        "data-position": position,
        "data-state": view.state,
        className: className,
        style: rootStyle,
        onMouseEnter: handleEnter,
        onMouseLeave: handleLeave,
        onTransitionEnd: handleTransitionEnd,
        onPointerDown: handlePointerDown,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                "data-sileo-canvas": true,
                "data-edge": expand,
                style: canvasStyle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("svg", {
                    "data-sileo-svg": true,
                    width: WIDTH,
                    height: svgHeight,
                    viewBox: viewBox,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("title", {
                            children: "Sileo Notification"
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(GooeyDefs, {
                            filterId: filterId,
                            blur: blur
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].rect, {
                            "data-sileo-pill": true,
                            rx: resolvedRoundness,
                            ry: resolvedRoundness,
                            fill: view.fill,
                            initial: false,
                            animate: pillAnimate,
                            transition: pillTransition
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].rect, {
                            "data-sileo-body": true,
                            y: HEIGHT,
                            width: WIDTH,
                            rx: resolvedRoundness,
                            ry: resolvedRoundness,
                            fill: view.fill,
                            initial: false,
                            animate: bodyAnimate,
                            transition: bodyTransition
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                ref: headerRef,
                "data-sileo-header": true,
                "data-edge": expand,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                    "data-sileo-header-stack": true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                            ref: innerRef,
                            "data-sileo-header-inner": true,
                            "data-layer": "current",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                                    "data-sileo-badge": true,
                                    "data-state": headerLayer.current.view.state,
                                    className: (_headerLayer_current_view_styles = headerLayer.current.view.styles) == null ? void 0 : _headerLayer_current_view_styles.badge,
                                    children: (_headerLayer_current_view_icon = headerLayer.current.view.icon) != null ? _headerLayer_current_view_icon : STATE_ICON[headerLayer.current.view.state]
                                }),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                                    "data-sileo-title": true,
                                    "data-state": headerLayer.current.view.state,
                                    className: (_headerLayer_current_view_styles1 = headerLayer.current.view.styles) == null ? void 0 : _headerLayer_current_view_styles1.title,
                                    children: headerLayer.current.view.title
                                })
                            ]
                        }, headerLayer.current.key),
                        headerLayer.prev && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                            "data-sileo-header-inner": true,
                            "data-layer": "prev",
                            "data-exiting": "true",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                                    "data-sileo-badge": true,
                                    "data-state": headerLayer.prev.view.state,
                                    className: (_headerLayer_prev_view_styles = headerLayer.prev.view.styles) == null ? void 0 : _headerLayer_prev_view_styles.badge,
                                    children: (_headerLayer_prev_view_icon = headerLayer.prev.view.icon) != null ? _headerLayer_prev_view_icon : STATE_ICON[headerLayer.prev.view.state]
                                }),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                                    "data-sileo-title": true,
                                    "data-state": headerLayer.prev.view.state,
                                    className: (_headerLayer_prev_view_styles1 = headerLayer.prev.view.styles) == null ? void 0 : _headerLayer_prev_view_styles1.title,
                                    children: headerLayer.prev.view.title
                                })
                            ]
                        }, headerLayer.prev.key)
                    ]
                })
            }),
            hasDesc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                "data-sileo-content": true,
                "data-edge": expand,
                "data-visible": open,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                    ref: contentRef,
                    "data-sileo-description": true,
                    className: (_view_styles = view.styles) == null ? void 0 : _view_styles.description,
                    children: [
                        view.description,
                        view.button && // biome-ignore lint/a11y/useValidAnchor: cannot use button inside a button
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("a", {
                            href: "#",
                            type: "button",
                            "data-sileo-button": true,
                            "data-state": view.state,
                            className: (_view_styles1 = view.styles) == null ? void 0 : _view_styles1.button,
                            onClick: handleButtonClick,
                            children: view.button.title
                        })
                    ]
                })
            })
        ]
    });
});
const pillAlign = (pos)=>pos.includes("right") ? "right" : pos.includes("center") ? "center" : "left";
const expandDir = (pos)=>pos.startsWith("top") ? "bottom" : "top";
const store = {
    toasts: [],
    listeners: new Set(),
    position: "top-right",
    options: undefined,
    emit () {
        for (const fn of this.listeners)fn(this.toasts);
    },
    update (fn) {
        this.toasts = fn(this.toasts);
        this.emit();
    }
};
let idCounter = 0;
const generateId = ()=>`${++idCounter}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const timeoutKey = (t)=>`${t.id}:${t.instanceId}`;
/* ------------------------------- Toast API -------------------------------- */ const dismissToast = (id)=>{
    const item = store.toasts.find((t)=>t.id === id);
    if (!item || item.exiting) return;
    store.update((prev)=>prev.map((t)=>t.id === id ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, t, {
                exiting: true
            }) : t));
    setTimeout(()=>store.update((prev)=>prev.filter((t)=>t.id !== id)), EXIT_DURATION);
};
const resolveAutopilot = (opts, duration)=>{
    var _ref, _ref1;
    if (opts.autopilot === false || !duration || duration <= 0) return {};
    const cfg = typeof opts.autopilot === "object" ? opts.autopilot : undefined;
    const clamp = (v)=>Math.min(duration, Math.max(0, v));
    return {
        expandDelayMs: clamp((_ref = cfg == null ? void 0 : cfg.expand) != null ? _ref : AUTO_EXPAND_DELAY),
        collapseDelayMs: clamp((_ref1 = cfg == null ? void 0 : cfg.collapse) != null ? _ref1 : AUTO_COLLAPSE_DELAY)
    };
};
const mergeOptions = (options)=>{
    var _store_options;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, store.options, options, {
        styles: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, (_store_options = store.options) == null ? void 0 : _store_options.styles, options.styles)
    });
};
const buildSileoItem = (merged, id, fallbackPosition)=>{
    var _merged_duration, _ref, _merged_position;
    const duration = (_merged_duration = merged.duration) != null ? _merged_duration : DEFAULT_TOAST_DURATION;
    const auto = resolveAutopilot(merged, duration);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, merged, {
        id,
        instanceId: generateId(),
        position: (_ref = (_merged_position = merged.position) != null ? _merged_position : fallbackPosition) != null ? _ref : store.position,
        autoExpandDelayMs: auto.expandDelayMs,
        autoCollapseDelayMs: auto.collapseDelayMs
    });
};
const createToast = (options)=>{
    var _merged_id, _merged_duration;
    const live = store.toasts.filter((t)=>!t.exiting);
    const merged = mergeOptions(options);
    const id = (_merged_id = merged.id) != null ? _merged_id : "sileo-default";
    const prev = live.find((t)=>t.id === id);
    const item = buildSileoItem(merged, id, prev == null ? void 0 : prev.position);
    if (prev) {
        store.update((p)=>p.map((t)=>t.id === id ? item : t));
    } else {
        store.update((p)=>[
                ...p.filter((t)=>t.id !== id),
                item
            ]);
    }
    return {
        id,
        duration: (_merged_duration = merged.duration) != null ? _merged_duration : DEFAULT_TOAST_DURATION
    };
};
const updateToast = (id, options)=>{
    const existing = store.toasts.find((t)=>t.id === id);
    if (!existing) return;
    const item = buildSileoItem(mergeOptions(options), id, existing.position);
    store.update((prev)=>prev.map((t)=>t.id === id ? item : t));
};
const sileo = {
    show: (opts)=>createToast((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, opts, {
            state: opts.type
        })).id,
    success: (opts)=>createToast((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, opts, {
            state: "success"
        })).id,
    error: (opts)=>createToast((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, opts, {
            state: "error"
        })).id,
    warning: (opts)=>createToast((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, opts, {
            state: "warning"
        })).id,
    info: (opts)=>createToast((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, opts, {
            state: "info"
        })).id,
    action: (opts)=>createToast((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, opts, {
            state: "action"
        })).id,
    promise: (promise, opts)=>{
        const { id } = createToast((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, opts.loading, {
            state: "loading",
            duration: null,
            position: opts.position
        }));
        const p = typeof promise === "function" ? promise() : promise;
        p.then((data)=>{
            if (opts.action) {
                const actionOpts = typeof opts.action === "function" ? opts.action(data) : opts.action;
                updateToast(id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, actionOpts, {
                    state: "action",
                    id
                }));
            } else {
                const successOpts = typeof opts.success === "function" ? opts.success(data) : opts.success;
                updateToast(id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, successOpts, {
                    state: "success",
                    id
                }));
            }
        }).catch((err)=>{
            const errorOpts = typeof opts.error === "function" ? opts.error(err) : opts.error;
            updateToast(id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$sileo$2f$dist$2f$cc$2d$B6peeNak$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"])({}, errorOpts, {
                state: "error",
                id
            }));
        });
        return p;
    },
    dismiss: dismissToast,
    clear: (position)=>store.update((prev)=>position ? prev.filter((t)=>t.position !== position) : [])
};
/* ------------------------------ Toaster Component ------------------------- */ const THEME_FILLS = {
    light: "#1a1a1a",
    dark: "#f2f2f2"
};
function useResolvedTheme(theme) {
    const [resolved, setResolved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        if (theme === "light" || theme === "dark") return theme;
        if ("TURBOPACK compile-time truthy", 1) return "light";
        //TURBOPACK unreachable
        ;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (theme === "light" || theme === "dark") {
            setResolved(theme);
            return;
        }
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e)=>setResolved(e.matches ? "dark" : "light");
        setResolved(mq.matches ? "dark" : "light");
        mq.addEventListener("change", handler);
        return ()=>mq.removeEventListener("change", handler);
    }, [
        theme
    ]);
    return resolved;
}
function Toaster({ children, position = "top-right", offset, options, theme }) {
    const resolvedTheme = useResolvedTheme(theme);
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(store.toasts);
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])();
    const hoverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const timersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const listRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(toasts);
    const latestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const handlersCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        store.position = position;
        store.options = options;
    }, [
        position,
        options
    ]);
    const clearAllTimers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        for (const t of timersRef.current.values())clearTimeout(t);
        timersRef.current.clear();
    }, []);
    const schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((items)=>{
        if (hoverRef.current) return;
        for (const item of items){
            var _item_duration;
            if (item.exiting) continue;
            const key = timeoutKey(item);
            if (timersRef.current.has(key)) continue;
            if (item.duration === null) continue;
            const dur = (_item_duration = item.duration) != null ? _item_duration : DEFAULT_TOAST_DURATION;
            if (dur <= 0) continue;
            timersRef.current.set(key, window.setTimeout(()=>dismissToast(item.id), dur));
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const listener = (next)=>setToasts(next);
        store.listeners.add(listener);
        return ()=>{
            store.listeners.delete(listener);
            clearAllTimers();
        };
    }, [
        clearAllTimers
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        listRef.current = toasts;
        const toastKeys = new Set(toasts.map(timeoutKey));
        const toastIds = new Set(toasts.map((t)=>t.id));
        for (const [key, timer] of timersRef.current){
            if (!toastKeys.has(key)) {
                clearTimeout(timer);
                timersRef.current.delete(key);
            }
        }
        for (const id of handlersCache.current.keys()){
            if (!toastIds.has(id)) handlersCache.current.delete(id);
        }
        schedule(toasts);
    }, [
        toasts,
        schedule
    ]);
    const handleMouseEnterRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleMouseLeaveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    handleMouseEnterRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (hoverRef.current) return;
        hoverRef.current = true;
        clearAllTimers();
    }, [
        clearAllTimers
    ]);
    handleMouseLeaveRef.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!hoverRef.current) return;
        hoverRef.current = false;
        schedule(listRef.current);
    }, [
        schedule
    ]);
    const latest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        for(let i = toasts.length - 1; i >= 0; i--){
            if (!toasts[i].exiting) return toasts[i].id;
        }
        return undefined;
    }, [
        toasts
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        latestRef.current = latest;
        setActiveId(latest);
    }, [
        latest
    ]);
    const getHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((toastId)=>{
        let cached = handlersCache.current.get(toastId);
        if (cached) return cached;
        cached = {
            enter: (e)=>{
                setActiveId((prev)=>prev === toastId ? prev : toastId);
                handleMouseEnterRef.current == null ? void 0 : handleMouseEnterRef.current.call(handleMouseEnterRef, e);
            },
            leave: (e)=>{
                setActiveId((prev)=>prev === latestRef.current ? prev : latestRef.current);
                handleMouseLeaveRef.current == null ? void 0 : handleMouseLeaveRef.current.call(handleMouseLeaveRef, e);
            },
            dismiss: ()=>dismissToast(toastId)
        };
        handlersCache.current.set(toastId, cached);
        return cached;
    }, []);
    const getViewportStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((pos)=>{
        if (offset === undefined) return undefined;
        const o = typeof offset === "object" ? offset : {
            top: offset,
            right: offset,
            bottom: offset,
            left: offset
        };
        const s = {};
        const px = (v)=>typeof v === "number" ? `${v}px` : v;
        if (pos.startsWith("top") && o.top) s.top = px(o.top);
        if (pos.startsWith("bottom") && o.bottom) s.bottom = px(o.bottom);
        if (pos.endsWith("left") && o.left) s.left = px(o.left);
        if (pos.endsWith("right") && o.right) s.right = px(o.right);
        return s;
    }, [
        offset
    ]);
    const activePositions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const map = new Map();
        for (const t of toasts){
            var _t_position;
            const pos = (_t_position = t.position) != null ? _t_position : position;
            const arr = map.get(pos);
            if (arr) {
                arr.push(t);
            } else {
                map.set(pos, [
                    t
                ]);
            }
        }
        return map;
    }, [
        toasts,
        position
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            children,
            Array.from(activePositions, ([pos, items])=>{
                const pill = pillAlign(pos);
                const expand = expandDir(pos);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("section", {
                    "data-sileo-viewport": true,
                    "data-position": pos,
                    "data-theme": theme ? resolvedTheme : undefined,
                    "aria-live": "polite",
                    style: getViewportStyle(pos),
                    children: items.map((item)=>{
                        var _item_fill;
                        const h = getHandlers(item.id);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Sileo, {
                            id: item.id,
                            state: item.state,
                            title: item.title,
                            description: item.description,
                            position: pill,
                            expand: expand,
                            icon: item.icon,
                            fill: (_item_fill = item.fill) != null ? _item_fill : theme ? THEME_FILLS[resolvedTheme] : undefined,
                            styles: item.styles,
                            button: item.button,
                            roundness: item.roundness,
                            exiting: item.exiting,
                            autoExpandDelayMs: item.autoExpandDelayMs,
                            autoCollapseDelayMs: item.autoCollapseDelayMs,
                            refreshKey: item.instanceId,
                            canExpand: activeId === undefined || activeId === item.id,
                            onMouseEnter: h.enter,
                            onMouseLeave: h.leave,
                            onDismiss: h.dismiss
                        }, item.id);
                    })
                }, pos);
            })
        ]
    });
}
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/clamp.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clamp",
    ()=>clamp
]);
const clamp = (min, max, v)=>{
    if (v > max) return max;
    if (v < min) return min;
    return v;
};
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/format-error-message.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatErrorMessage",
    ()=>formatErrorMessage
]);
function formatErrorMessage(message, errorCode) {
    return errorCode ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}` : message;
}
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/errors.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "invariant",
    ()=>invariant,
    "warning",
    ()=>warning
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/format-error-message.mjs [app-ssr] (ecmascript)");
;
let warning = ()=>{};
let invariant = ()=>{};
if (typeof process !== "undefined" && ("TURBOPACK compile-time value", "development") !== "production") {
    warning = (check, message, errorCode)=>{
        if (!check && typeof console !== "undefined") {
            console.warn((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatErrorMessage"])(message, errorCode));
        }
    };
    invariant = (check, message, errorCode)=>{
        if (!check) {
            throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatErrorMessage"])(message, errorCode));
        }
    };
}
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/is-numerical-string.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isNumericalString",
    ()=>isNumericalString
]);
/**
 * Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
 */ const isNumericalString = (v)=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/noop.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "noop",
    ()=>noop
]);
/*#__NO_SIDE_EFFECTS__*/ const noop = (any)=>any;
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/global-config.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MotionGlobalConfig",
    ()=>MotionGlobalConfig
]);
const MotionGlobalConfig = {};
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/is-zero-value-string.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isZeroValueString",
    ()=>isZeroValueString
]);
/**
 * Check if the value is a zero value string like "0px" or "0%"
 */ const isZeroValueString = (v)=>/^0[^.\s]+$/u.test(v);
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/warn-once.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasWarned",
    ()=>hasWarned,
    "warnOnce",
    ()=>warnOnce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/format-error-message.mjs [app-ssr] (ecmascript)");
;
const warned = new Set();
function hasWarned(message) {
    return warned.has(message);
}
function warnOnce(condition, message, errorCode) {
    if (condition || warned.has(message)) return;
    console.warn((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatErrorMessage"])(message, errorCode));
    warned.add(message);
}
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/time-conversion.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "millisecondsToSeconds",
    ()=>millisecondsToSeconds,
    "secondsToMilliseconds",
    ()=>secondsToMilliseconds
]);
/**
 * Converts seconds to milliseconds
 *
 * @param seconds - Time in seconds.
 * @return milliseconds - Converted time in milliseconds.
 */ /*#__NO_SIDE_EFFECTS__*/ const secondsToMilliseconds = (seconds)=>seconds * 1000;
/*#__NO_SIDE_EFFECTS__*/ const millisecondsToSeconds = (milliseconds)=>milliseconds / 1000;
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/array.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addUniqueItem",
    ()=>addUniqueItem,
    "moveItem",
    ()=>moveItem,
    "removeItem",
    ()=>removeItem
]);
function addUniqueItem(arr, item) {
    if (arr.indexOf(item) === -1) arr.push(item);
}
function removeItem(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1) arr.splice(index, 1);
}
// Adapted from array-move
function moveItem([...arr], fromIndex, toIndex) {
    const startIndex = fromIndex < 0 ? arr.length + fromIndex : fromIndex;
    if (startIndex >= 0 && startIndex < arr.length) {
        const endIndex = toIndex < 0 ? arr.length + toIndex : toIndex;
        const [item] = arr.splice(fromIndex, 1);
        arr.splice(endIndex, 0, item);
    }
    return arr;
}
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/subscription-manager.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubscriptionManager",
    ()=>SubscriptionManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$array$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/array.mjs [app-ssr] (ecmascript)");
;
class SubscriptionManager {
    constructor(){
        this.subscriptions = [];
    }
    add(handler) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$array$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addUniqueItem"])(this.subscriptions, handler);
        return ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$array$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeItem"])(this.subscriptions, handler);
    }
    notify(a, b, c) {
        const numSubscriptions = this.subscriptions.length;
        if (!numSubscriptions) return;
        if (numSubscriptions === 1) {
            /**
             * If there's only a single handler we can just call it without invoking a loop.
             */ this.subscriptions[0](a, b, c);
        } else {
            for(let i = 0; i < numSubscriptions; i++){
                /**
                 * Check whether the handler exists before firing as it's possible
                 * the subscriptions were modified during this loop running.
                 */ const handler = this.subscriptions[i];
                handler && handler(a, b, c);
            }
        }
    }
    getSize() {
        return this.subscriptions.length;
    }
    clear() {
        this.subscriptions.length = 0;
    }
}
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/memo.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "memo",
    ()=>memo
]);
/*#__NO_SIDE_EFFECTS__*/ function memo(callback) {
    let result;
    return ()=>{
        if (result === undefined) result = callback();
        return result;
    };
}
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isBezierDefinition",
    ()=>isBezierDefinition
]);
const isBezierDefinition = (easing)=>Array.isArray(easing) && typeof easing[0] === "number";
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/velocity-per-second.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "velocityPerSecond",
    ()=>velocityPerSecond
]);
/*
  Convert velocity into velocity per second

  @param [number]: Unit per frame
  @param [number]: Frame duration in ms
*/ function velocityPerSecond(velocity, frameDuration) {
    return frameDuration ? velocity * (1000 / frameDuration) : 0;
}
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/pipe.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pipe",
    ()=>pipe
]);
/**
 * Pipe
 * Compose other transformers to run linearily
 * pipe(min(20), max(40))
 * @param  {...functions} transformers
 * @return {function}
 */ const combineFunctions = (a, b)=>(v)=>b(a(v));
const pipe = (...transformers)=>transformers.reduce(combineFunctions);
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cubicBezier",
    ()=>cubicBezier
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$noop$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/noop.mjs [app-ssr] (ecmascript)");
;
/*
  Bezier function generator
  This has been modified from Gaëtan Renaudeau's BezierEasing
  https://github.com/gre/bezier-easing/blob/master/src/index.js
  https://github.com/gre/bezier-easing/blob/master/LICENSE
  
  I've removed the newtonRaphsonIterate algo because in benchmarking it
  wasn't noticeably faster than binarySubdivision, indeed removing it
  usually improved times, depending on the curve.
  I also removed the lookup table, as for the added bundle size and loop we're
  only cutting ~4 or so subdivision iterations. I bumped the max iterations up
  to 12 to compensate and this still tended to be faster for no perceivable
  loss in accuracy.
  Usage
    const easeOut = cubicBezier(.17,.67,.83,.67);
    const x = easeOut(0.5); // returns 0.627...
*/ // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
const calcBezier = (t, a1, a2)=>(((1.0 - 3.0 * a2 + 3.0 * a1) * t + (3.0 * a2 - 6.0 * a1)) * t + 3.0 * a1) * t;
const subdivisionPrecision = 0.0000001;
const subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
    let currentX;
    let currentT;
    let i = 0;
    do {
        currentT = lowerBound + (upperBound - lowerBound) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - x;
        if (currentX > 0.0) {
            upperBound = currentT;
        } else {
            lowerBound = currentT;
        }
    }while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations)
    return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
    // If this is a linear gradient, return linear easing
    if (mX1 === mY1 && mX2 === mY2) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$noop$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
    const getTForX = (aX)=>binarySubdivide(aX, 0, 1, mX1, mX2);
    // If animation is at start/end, return t without easing
    return (t)=>t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/ease.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "easeIn",
    ()=>easeIn,
    "easeInOut",
    ()=>easeInOut,
    "easeOut",
    ()=>easeOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs [app-ssr] (ecmascript)");
;
const easeIn = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cubicBezier"])(0.42, 0, 1, 1);
const easeOut = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cubicBezier"])(0, 0, 0.58, 1);
const easeInOut = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cubicBezier"])(0.42, 0, 0.58, 1);
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/utils/is-easing-array.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isEasingArray",
    ()=>isEasingArray
]);
const isEasingArray = (ease)=>{
    return Array.isArray(ease) && typeof ease[0] !== "number";
};
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mirrorEasing",
    ()=>mirrorEasing
]);
// Accepts an easing function and returns a new one that outputs mirrored values for
// the second half of the animation. Turns easeIn into easeInOut.
const mirrorEasing = (easing)=>(p)=>p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reverseEasing",
    ()=>reverseEasing
]);
// Accepts an easing function and returns a new one that outputs reversed values.
// Turns easeIn into easeOut.
const reverseEasing = (easing)=>(p)=>1 - easing(1 - p);
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/back.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "backIn",
    ()=>backIn,
    "backInOut",
    ()=>backInOut,
    "backOut",
    ()=>backOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$mirror$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$reverse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs [app-ssr] (ecmascript)");
;
;
;
const backOut = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cubicBezier"])(0.33, 1.53, 0.69, 0.99);
const backIn = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$reverse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reverseEasing"])(backOut);
const backInOut = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$mirror$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mirrorEasing"])(backIn);
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/anticipate.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "anticipate",
    ()=>anticipate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/back.mjs [app-ssr] (ecmascript)");
;
const anticipate = (p)=>p >= 1 ? 1 : (p *= 2) < 1 ? 0.5 * (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["backIn"])(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/circ.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "circIn",
    ()=>circIn,
    "circInOut",
    ()=>circInOut,
    "circOut",
    ()=>circOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$mirror$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$reverse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs [app-ssr] (ecmascript)");
;
;
const circIn = (p)=>1 - Math.sin(Math.acos(p));
const circOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$reverse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reverseEasing"])(circIn);
const circInOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$mirror$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mirrorEasing"])(circIn);
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/easing/utils/map.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "easingDefinitionToFunction",
    ()=>easingDefinitionToFunction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$noop$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/noop.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$anticipate$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/anticipate.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/back.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$circ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/circ.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$ease$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/ease.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$utils$2f$is$2d$bezier$2d$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const easingLookup = {
    linear: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$noop$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"],
    easeIn: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$ease$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["easeIn"],
    easeInOut: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$ease$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["easeInOut"],
    easeOut: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$ease$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["easeOut"],
    circIn: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$circ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["circIn"],
    circInOut: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$circ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["circInOut"],
    circOut: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$circ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["circOut"],
    backIn: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["backIn"],
    backInOut: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["backInOut"],
    backOut: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["backOut"],
    anticipate: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$anticipate$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["anticipate"]
};
const isValidEasing = (easing)=>{
    return typeof easing === "string";
};
const easingDefinitionToFunction = (definition)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$utils$2f$is$2d$bezier$2d$definition$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBezierDefinition"])(definition)) {
        // If cubic bezier definition, create bezier curve
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`, "cubic-bezier-length");
        const [x1, y1, x2, y2] = definition;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cubicBezier"])(x1, y1, x2, y2);
    } else if (isValidEasing(definition)) {
        // Else lookup from table
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invariant"])(easingLookup[definition] !== undefined, `Invalid easing type '${definition}'`, "invalid-easing-type");
        return easingLookup[definition];
    }
    return definition;
};
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/progress.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "progress",
    ()=>progress
]);
/*
  Progress within given range

  Given a lower limit and an upper limit, we return the progress
  (expressed as a number 0-1) represented by the given value, and
  limit that progress to within 0-1.

  @param [number]: Lower limit
  @param [number]: Upper limit
  @param [number]: Value to find progress within given range
  @return [number]: Progress of value within range as expressed 0-1
*/ /*#__NO_SIDE_EFFECTS__*/ const progress = (from, to, value)=>{
    const toFromDifference = to - from;
    return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
;
}),
"[project]/frontend/node_modules/motion-utils/dist/es/is-object.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isObject",
    ()=>isObject
]);
function isObject(value) {
    return typeof value === "object" && value !== null;
}
;
}),
];

//# sourceMappingURL=0r9g_0uo5j7x._.js.map