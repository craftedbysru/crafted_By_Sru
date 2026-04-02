/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/inventory/[id]/route";
exports.ids = ["app/api/inventory/[id]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = import("pg");;

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Finventory%2F%5Bid%5D%2Froute&page=%2Fapi%2Finventory%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Finventory%2F%5Bid%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Finventory%2F%5Bid%5D%2Froute&page=%2Fapi%2Finventory%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Finventory%2F%5Bid%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_w136189_Downloads_crafted_by_sru_stable_src_app_api_inventory_id_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/inventory/[id]/route.ts */ \"(rsc)/./src/app/api/inventory/[id]/route.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([C_Users_w136189_Downloads_crafted_by_sru_stable_src_app_api_inventory_id_route_ts__WEBPACK_IMPORTED_MODULE_3__]);\nC_Users_w136189_Downloads_crafted_by_sru_stable_src_app_api_inventory_id_route_ts__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/inventory/[id]/route\",\n        pathname: \"/api/inventory/[id]\",\n        filename: \"route\",\n        bundlePath: \"app/api/inventory/[id]/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\w136189\\\\Downloads\\\\crafted-by-sru-stable\\\\src\\\\app\\\\api\\\\inventory\\\\[id]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_w136189_Downloads_crafted_by_sru_stable_src_app_api_inventory_id_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZpbnZlbnRvcnklMkYlNUJpZCU1RCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGaW52ZW50b3J5JTJGJTVCaWQlNUQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZpbnZlbnRvcnklMkYlNUJpZCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUN3MTM2MTg5JTVDRG93bmxvYWRzJTVDY3JhZnRlZC1ieS1zcnUtc3RhYmxlJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUN3MTM2MTg5JTVDRG93bmxvYWRzJTVDY3JhZnRlZC1ieS1zcnUtc3RhYmxlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM4QztBQUMzSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYscUMiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcdzEzNjE4OVxcXFxEb3dubG9hZHNcXFxcY3JhZnRlZC1ieS1zcnUtc3RhYmxlXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGludmVudG9yeVxcXFxbaWRdXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9pbnZlbnRvcnkvW2lkXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2ludmVudG9yeS9baWRdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9pbnZlbnRvcnkvW2lkXS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXHcxMzYxODlcXFxcRG93bmxvYWRzXFxcXGNyYWZ0ZWQtYnktc3J1LXN0YWJsZVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxpbnZlbnRvcnlcXFxcW2lkXVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Finventory%2F%5Bid%5D%2Froute&page=%2Fapi%2Finventory%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Finventory%2F%5Bid%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/inventory/[id]/route.ts":
/*!*********************************************!*\
  !*** ./src/app/api/inventory/[id]/route.ts ***!
  \*********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _services_inventoryService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/services/inventoryService */ \"(rsc)/./src/services/inventoryService.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_services_inventoryService__WEBPACK_IMPORTED_MODULE_1__]);\n_services_inventoryService__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nasync function GET(request, { params }) {\n    const { id } = await params;\n    const item = await _services_inventoryService__WEBPACK_IMPORTED_MODULE_1__.getProductById(id);\n    if (item) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(item);\n    return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(\"Not found\", {\n        status: 404\n    });\n}\nasync function PUT(request, { params }) {\n    const { id } = await params;\n    const body = await request.json();\n    await _services_inventoryService__WEBPACK_IMPORTED_MODULE_1__.updateProduct(id, body);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: true\n    });\n}\nasync function DELETE(request, { params }) {\n    const { id } = await params;\n    await _services_inventoryService__WEBPACK_IMPORTED_MODULE_1__.deleteProduct(id);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: true\n    });\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9pbnZlbnRvcnkvW2lkXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUEyQztBQUNxQjtBQUV6RCxlQUFlRSxJQUNwQkMsT0FBZ0IsRUFDaEIsRUFBRUMsTUFBTSxFQUF1QztJQUUvQyxNQUFNLEVBQUVDLEVBQUUsRUFBRSxHQUFHLE1BQU1EO0lBQ3JCLE1BQU1FLE9BQU8sTUFBTUwsc0VBQStCLENBQUNJO0lBQ25ELElBQUlDLE1BQU0sT0FBT04scURBQVlBLENBQUNRLElBQUksQ0FBQ0Y7SUFDbkMsT0FBTyxJQUFJTixxREFBWUEsQ0FBQyxhQUFhO1FBQUVTLFFBQVE7SUFBSTtBQUNyRDtBQUVPLGVBQWVDLElBQ3BCUCxPQUFnQixFQUNoQixFQUFFQyxNQUFNLEVBQXVDO0lBRS9DLE1BQU0sRUFBRUMsRUFBRSxFQUFFLEdBQUcsTUFBTUQ7SUFDckIsTUFBTU8sT0FBTyxNQUFNUixRQUFRSyxJQUFJO0lBQy9CLE1BQU1QLHFFQUE4QixDQUFDSSxJQUFJTTtJQUN6QyxPQUFPWCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1FBQUVLLFNBQVM7SUFBSztBQUMzQztBQUVPLGVBQWVDLE9BQ3BCWCxPQUFnQixFQUNoQixFQUFFQyxNQUFNLEVBQXVDO0lBRS9DLE1BQU0sRUFBRUMsRUFBRSxFQUFFLEdBQUcsTUFBTUQ7SUFDckIsTUFBTUgscUVBQThCLENBQUNJO0lBQ3JDLE9BQU9MLHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7UUFBRUssU0FBUztJQUFLO0FBQzNDIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHcxMzYxODlcXERvd25sb2Fkc1xcY3JhZnRlZC1ieS1zcnUtc3RhYmxlXFxzcmNcXGFwcFxcYXBpXFxpbnZlbnRvcnlcXFtpZF1cXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0ICogYXMgaW52ZW50b3J5U2VydmljZSBmcm9tIFwiQC9zZXJ2aWNlcy9pbnZlbnRvcnlTZXJ2aWNlXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoXG4gIHJlcXVlc3Q6IFJlcXVlc3QsXG4gIHsgcGFyYW1zIH06IHsgcGFyYW1zOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB9XG4pIHtcbiAgY29uc3QgeyBpZCB9ID0gYXdhaXQgcGFyYW1zO1xuICBjb25zdCBpdGVtID0gYXdhaXQgaW52ZW50b3J5U2VydmljZS5nZXRQcm9kdWN0QnlJZChpZCk7XG4gIGlmIChpdGVtKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oaXRlbSk7XG4gIHJldHVybiBuZXcgTmV4dFJlc3BvbnNlKFwiTm90IGZvdW5kXCIsIHsgc3RhdHVzOiA0MDQgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQVVQoXG4gIHJlcXVlc3Q6IFJlcXVlc3QsXG4gIHsgcGFyYW1zIH06IHsgcGFyYW1zOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB9XG4pIHtcbiAgY29uc3QgeyBpZCB9ID0gYXdhaXQgcGFyYW1zO1xuICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gIGF3YWl0IGludmVudG9yeVNlcnZpY2UudXBkYXRlUHJvZHVjdChpZCwgYm9keSk7XG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IHRydWUgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBERUxFVEUoXG4gIHJlcXVlc3Q6IFJlcXVlc3QsXG4gIHsgcGFyYW1zIH06IHsgcGFyYW1zOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB9XG4pIHtcbiAgY29uc3QgeyBpZCB9ID0gYXdhaXQgcGFyYW1zO1xuICBhd2FpdCBpbnZlbnRvcnlTZXJ2aWNlLmRlbGV0ZVByb2R1Y3QoaWQpO1xuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiB0cnVlIH0pO1xufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImludmVudG9yeVNlcnZpY2UiLCJHRVQiLCJyZXF1ZXN0IiwicGFyYW1zIiwiaWQiLCJpdGVtIiwiZ2V0UHJvZHVjdEJ5SWQiLCJqc29uIiwic3RhdHVzIiwiUFVUIiwiYm9keSIsInVwZGF0ZVByb2R1Y3QiLCJzdWNjZXNzIiwiREVMRVRFIiwiZGVsZXRlUHJvZHVjdCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/inventory/[id]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/adapter-pg */ \"(rsc)/./node_modules/@prisma/adapter-pg/dist/index.mjs\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pg */ \"pg\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([pg__WEBPACK_IMPORTED_MODULE_1__, _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_2__]);\n([pg__WEBPACK_IMPORTED_MODULE_1__, _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\nconst prismaClientSingleton = ()=>{\n    const pool = new pg__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Pool({\n        connectionString: process.env.DATABASE_URL\n    });\n    const adapter = new _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_2__.PrismaPg(pool);\n    return new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n        adapter\n    });\n};\nconst prisma = globalThis.prisma ?? prismaClientSingleton();\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\nif (true) globalThis.prisma = prisma;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUE2QztBQUNBO0FBQzFCO0FBRW5CLE1BQU1HLHdCQUF3QjtJQUM1QixNQUFNQyxPQUFPLElBQUlGLCtDQUFPLENBQUM7UUFBRUksa0JBQWtCQyxRQUFRQyxHQUFHLENBQUNDLFlBQVk7SUFBQztJQUN0RSxNQUFNQyxVQUFVLElBQUlULHdEQUFRQSxDQUFDRztJQUM3QixPQUFPLElBQUlKLHdEQUFZQSxDQUFDO1FBQUVVO0lBQVE7QUFDcEM7QUFNQSxNQUFNQyxTQUFTQyxXQUFXRCxNQUFNLElBQUlSO0FBRXBDLGlFQUFlUSxNQUFNQSxFQUFBO0FBRXJCLElBQUlKLElBQXFDLEVBQUVLLFdBQVdELE1BQU0sR0FBR0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcdzEzNjE4OVxcRG93bmxvYWRzXFxjcmFmdGVkLWJ5LXNydS1zdGFibGVcXHNyY1xcbGliXFxwcmlzbWEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5pbXBvcnQgeyBQcmlzbWFQZyB9IGZyb20gJ0BwcmlzbWEvYWRhcHRlci1wZydcbmltcG9ydCBwZyBmcm9tICdwZydcblxuY29uc3QgcHJpc21hQ2xpZW50U2luZ2xldG9uID0gKCkgPT4ge1xuICBjb25zdCBwb29sID0gbmV3IHBnLlBvb2woeyBjb25uZWN0aW9uU3RyaW5nOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwgfSlcbiAgY29uc3QgYWRhcHRlciA9IG5ldyBQcmlzbWFQZyhwb29sKVxuICByZXR1cm4gbmV3IFByaXNtYUNsaWVudCh7IGFkYXB0ZXIgfSBhcyBhbnkpXG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgdmFyIHByaXNtYTogdW5kZWZpbmVkIHwgUmV0dXJuVHlwZTx0eXBlb2YgcHJpc21hQ2xpZW50U2luZ2xldG9uPlxufVxuXG5jb25zdCBwcmlzbWEgPSBnbG9iYWxUaGlzLnByaXNtYSA/PyBwcmlzbWFDbGllbnRTaW5nbGV0b24oKVxuXG5leHBvcnQgZGVmYXVsdCBwcmlzbWFcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbFRoaXMucHJpc21hID0gcHJpc21hXG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiUHJpc21hUGciLCJwZyIsInByaXNtYUNsaWVudFNpbmdsZXRvbiIsInBvb2wiLCJQb29sIiwiY29ubmVjdGlvblN0cmluZyIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkwiLCJhZGFwdGVyIiwicHJpc21hIiwiZ2xvYmFsVGhpcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./src/services/inventoryService.ts":
/*!******************************************!*\
  !*** ./src/services/inventoryService.ts ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addProduct: () => (/* binding */ addProduct),\n/* harmony export */   deleteProduct: () => (/* binding */ deleteProduct),\n/* harmony export */   getInventory: () => (/* binding */ getInventory),\n/* harmony export */   getProductById: () => (/* binding */ getProductById),\n/* harmony export */   updateProduct: () => (/* binding */ updateProduct)\n/* harmony export */ });\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_prisma__WEBPACK_IMPORTED_MODULE_0__]);\n_lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst getInventory = async ()=>{\n    return await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__[\"default\"].product.findMany();\n};\nconst getProductById = async (id)=>{\n    return await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__[\"default\"].product.findUnique({\n        where: {\n            id\n        }\n    });\n};\nconst addProduct = async (product)=>{\n    return await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__[\"default\"].product.create({\n        data: product\n    });\n};\nconst updateProduct = async (id, updates)=>{\n    return await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__[\"default\"].product.update({\n        where: {\n            id\n        },\n        data: updates\n    });\n};\nconst deleteProduct = async (id)=>{\n    return await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__[\"default\"].product.delete({\n        where: {\n            id\n        }\n    });\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvc2VydmljZXMvaW52ZW50b3J5U2VydmljZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBa0M7QUFHM0IsTUFBTUMsZUFBZTtJQUMxQixPQUFPLE1BQU1ELG1EQUFNQSxDQUFDRSxPQUFPLENBQUNDLFFBQVE7QUFDdEMsRUFBRTtBQUVLLE1BQU1DLGlCQUFpQixPQUFPQztJQUNuQyxPQUFPLE1BQU1MLG1EQUFNQSxDQUFDRSxPQUFPLENBQUNJLFVBQVUsQ0FBQztRQUNyQ0MsT0FBTztZQUFFRjtRQUFHO0lBQ2Q7QUFDRixFQUFFO0FBRUssTUFBTUcsYUFBYSxPQUFPTjtJQUMvQixPQUFPLE1BQU1GLG1EQUFNQSxDQUFDRSxPQUFPLENBQUNPLE1BQU0sQ0FBQztRQUNqQ0MsTUFBTVI7SUFDUjtBQUNGLEVBQUU7QUFFSyxNQUFNUyxnQkFBZ0IsT0FBT04sSUFBWU87SUFDOUMsT0FBTyxNQUFNWixtREFBTUEsQ0FBQ0UsT0FBTyxDQUFDVyxNQUFNLENBQUM7UUFDakNOLE9BQU87WUFBRUY7UUFBRztRQUNaSyxNQUFNRTtJQUNSO0FBQ0YsRUFBRTtBQUVLLE1BQU1FLGdCQUFnQixPQUFPVDtJQUNsQyxPQUFPLE1BQU1MLG1EQUFNQSxDQUFDRSxPQUFPLENBQUNhLE1BQU0sQ0FBQztRQUNqQ1IsT0FBTztZQUFFRjtRQUFHO0lBQ2Q7QUFDRixFQUFFIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHcxMzYxODlcXERvd25sb2Fkc1xcY3JhZnRlZC1ieS1zcnUtc3RhYmxlXFxzcmNcXHNlcnZpY2VzXFxpbnZlbnRvcnlTZXJ2aWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwcmlzbWEgZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuaW1wb3J0IHsgUHJvZHVjdCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgY29uc3QgZ2V0SW52ZW50b3J5ID0gYXN5bmMgKCkgPT4ge1xuICByZXR1cm4gYXdhaXQgcHJpc21hLnByb2R1Y3QuZmluZE1hbnkoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRQcm9kdWN0QnlJZCA9IGFzeW5jIChpZDogc3RyaW5nKSA9PiB7XG4gIHJldHVybiBhd2FpdCBwcmlzbWEucHJvZHVjdC5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBpZCB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGFkZFByb2R1Y3QgPSBhc3luYyAocHJvZHVjdDogYW55KSA9PiB7XG4gIHJldHVybiBhd2FpdCBwcmlzbWEucHJvZHVjdC5jcmVhdGUoe1xuICAgIGRhdGE6IHByb2R1Y3RcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgdXBkYXRlUHJvZHVjdCA9IGFzeW5jIChpZDogc3RyaW5nLCB1cGRhdGVzOiBhbnkpID0+IHtcbiAgcmV0dXJuIGF3YWl0IHByaXNtYS5wcm9kdWN0LnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQgfSxcbiAgICBkYXRhOiB1cGRhdGVzXG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZVByb2R1Y3QgPSBhc3luYyAoaWQ6IHN0cmluZykgPT4ge1xuICByZXR1cm4gYXdhaXQgcHJpc21hLnByb2R1Y3QuZGVsZXRlKHtcbiAgICB3aGVyZTogeyBpZCB9XG4gIH0pO1xufTtcbiJdLCJuYW1lcyI6WyJwcmlzbWEiLCJnZXRJbnZlbnRvcnkiLCJwcm9kdWN0IiwiZmluZE1hbnkiLCJnZXRQcm9kdWN0QnlJZCIsImlkIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiYWRkUHJvZHVjdCIsImNyZWF0ZSIsImRhdGEiLCJ1cGRhdGVQcm9kdWN0IiwidXBkYXRlcyIsInVwZGF0ZSIsImRlbGV0ZVByb2R1Y3QiLCJkZWxldGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/services/inventoryService.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@prisma","vendor-chunks/postgres-array"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Finventory%2F%5Bid%5D%2Froute&page=%2Fapi%2Finventory%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Finventory%2F%5Bid%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();