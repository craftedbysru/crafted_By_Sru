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
exports.id = "app/api/auth/signup/route";
exports.ids = ["app/api/auth/signup/route"];
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

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = import("pg");;

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fsignup%2Froute&page=%2Fapi%2Fauth%2Fsignup%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsignup%2Froute.ts&appDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fsignup%2Froute&page=%2Fapi%2Fauth%2Fsignup%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsignup%2Froute.ts&appDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_w136189_Downloads_crafted_by_sru_stable_src_app_api_auth_signup_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/signup/route.ts */ \"(rsc)/./src/app/api/auth/signup/route.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([C_Users_w136189_Downloads_crafted_by_sru_stable_src_app_api_auth_signup_route_ts__WEBPACK_IMPORTED_MODULE_3__]);\nC_Users_w136189_Downloads_crafted_by_sru_stable_src_app_api_auth_signup_route_ts__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/signup/route\",\n        pathname: \"/api/auth/signup\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/signup/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\w136189\\\\Downloads\\\\crafted-by-sru-stable\\\\src\\\\app\\\\api\\\\auth\\\\signup\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_w136189_Downloads_crafted_by_sru_stable_src_app_api_auth_signup_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGc2lnbnVwJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdXRoJTJGc2lnbnVwJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXV0aCUyRnNpZ251cCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUN3MTM2MTg5JTVDRG93bmxvYWRzJTVDY3JhZnRlZC1ieS1zcnUtc3RhYmxlJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUN3MTM2MTg5JTVDRG93bmxvYWRzJTVDY3JhZnRlZC1ieS1zcnUtc3RhYmxlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUMyQztBQUN4SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYscUMiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcdzEzNjE4OVxcXFxEb3dubG9hZHNcXFxcY3JhZnRlZC1ieS1zcnUtc3RhYmxlXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcc2lnbnVwXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL3NpZ251cC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvc2lnbnVwXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL3NpZ251cC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXHcxMzYxODlcXFxcRG93bmxvYWRzXFxcXGNyYWZ0ZWQtYnktc3J1LXN0YWJsZVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXHNpZ251cFxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fsignup%2Froute&page=%2Fapi%2Fauth%2Fsignup%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsignup%2Froute.ts&appDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "(rsc)/./src/app/api/auth/signup/route.ts":
/*!******************************************!*\
  !*** ./src/app/api/auth/signup/route.ts ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var _lib_email__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/email */ \"(rsc)/./src/lib/email.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_prisma__WEBPACK_IMPORTED_MODULE_1__]);\n_lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\nasync function POST(req) {\n    try {\n        const { name, email, password } = await req.json();\n        if (!name || !email || !password) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Missing required fields\"\n            }, {\n                status: 400\n            });\n        }\n        // Check if user already exists\n        const existingUser = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].user.findUnique({\n            where: {\n                email\n            }\n        });\n        if (existingUser) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"User with this email already exists\"\n            }, {\n                status: 400\n            });\n        }\n        // Hash the password\n        const hashedPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hash(password, 10);\n        // Create the user\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].user.create({\n            data: {\n                name,\n                email,\n                password: hashedPassword,\n                role: \"client\"\n            }\n        });\n        // Send the welcome email\n        await (0,_lib_email__WEBPACK_IMPORTED_MODULE_3__.sendWelcomeEmail)(email, name);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"User created successfully\",\n            user: {\n                id: user.id,\n                email: user.email,\n                name: user.name\n            }\n        }, {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"Signup error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL3NpZ251cC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUEyQztBQUNUO0FBQ0o7QUFDaUI7QUFFeEMsZUFBZUksS0FBS0MsR0FBWTtJQUNyQyxJQUFJO1FBQ0YsTUFBTSxFQUFFQyxJQUFJLEVBQUVDLEtBQUssRUFBRUMsUUFBUSxFQUFFLEdBQUcsTUFBTUgsSUFBSUksSUFBSTtRQUVoRCxJQUFJLENBQUNILFFBQVEsQ0FBQ0MsU0FBUyxDQUFDQyxVQUFVO1lBQ2hDLE9BQU9SLHFEQUFZQSxDQUFDUyxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQTBCLEdBQ25DO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSwrQkFBK0I7UUFDL0IsTUFBTUMsZUFBZSxNQUFNWCxtREFBTUEsQ0FBQ1ksSUFBSSxDQUFDQyxVQUFVLENBQUM7WUFDaERDLE9BQU87Z0JBQUVSO1lBQU07UUFDakI7UUFFQSxJQUFJSyxjQUFjO1lBQ2hCLE9BQU9aLHFEQUFZQSxDQUFDUyxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQXNDLEdBQy9DO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxvQkFBb0I7UUFDcEIsTUFBTUssaUJBQWlCLE1BQU1kLHFEQUFXLENBQUNNLFVBQVU7UUFFbkQsa0JBQWtCO1FBQ2xCLE1BQU1LLE9BQU8sTUFBTVosbURBQU1BLENBQUNZLElBQUksQ0FBQ0ssTUFBTSxDQUFDO1lBQ3BDQyxNQUFNO2dCQUNKYjtnQkFDQUM7Z0JBQ0FDLFVBQVVRO2dCQUNWSSxNQUFNO1lBQ1I7UUFDRjtRQUVBLHlCQUF5QjtRQUN6QixNQUFNakIsNERBQWdCQSxDQUFDSSxPQUFPRDtRQUU5QixPQUFPTixxREFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtZQUFFWSxTQUFTO1lBQTZCUixNQUFNO2dCQUFFUyxJQUFJVCxLQUFLUyxFQUFFO2dCQUFFZixPQUFPTSxLQUFLTixLQUFLO2dCQUFFRCxNQUFNTyxLQUFLUCxJQUFJO1lBQUM7UUFBRSxHQUNsRztZQUFFSyxRQUFRO1FBQUk7SUFFbEIsRUFBRSxPQUFPRCxPQUFZO1FBQ25CYSxRQUFRYixLQUFLLENBQUMsaUJBQWlCQTtRQUMvQixPQUFPVixxREFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQXdCLEdBQ2pDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHcxMzYxODlcXERvd25sb2Fkc1xcY3JhZnRlZC1ieS1zcnUtc3RhYmxlXFxzcmNcXGFwcFxcYXBpXFxhdXRoXFxzaWdudXBcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHByaXNtYSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XG5pbXBvcnQgYmNyeXB0IGZyb20gXCJiY3J5cHRqc1wiO1xuaW1wb3J0IHsgc2VuZFdlbGNvbWVFbWFpbCB9IGZyb20gXCJAL2xpYi9lbWFpbFwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IG5hbWUsIGVtYWlsLCBwYXNzd29yZCB9ID0gYXdhaXQgcmVxLmpzb24oKTtcblxuICAgIGlmICghbmFtZSB8fCAhZW1haWwgfHwgIXBhc3N3b3JkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiTWlzc2luZyByZXF1aXJlZCBmaWVsZHNcIiB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBhbHJlYWR5IGV4aXN0c1xuICAgIGNvbnN0IGV4aXN0aW5nVXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHsgZW1haWwgfSxcbiAgICB9KTtcblxuICAgIGlmIChleGlzdGluZ1VzZXIpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJVc2VyIHdpdGggdGhpcyBlbWFpbCBhbHJlYWR5IGV4aXN0c1wiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBIYXNoIHRoZSBwYXNzd29yZFxuICAgIGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgYmNyeXB0Lmhhc2gocGFzc3dvcmQsIDEwKTtcblxuICAgIC8vIENyZWF0ZSB0aGUgdXNlclxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBuYW1lLFxuICAgICAgICBlbWFpbCxcbiAgICAgICAgcGFzc3dvcmQ6IGhhc2hlZFBhc3N3b3JkLFxuICAgICAgICByb2xlOiBcImNsaWVudFwiLCAvLyBEZWZhdWx0IHJvbGUgZm9yIG5ldyBzaWdudXBzXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gU2VuZCB0aGUgd2VsY29tZSBlbWFpbFxuICAgIGF3YWl0IHNlbmRXZWxjb21lRW1haWwoZW1haWwsIG5hbWUpO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBtZXNzYWdlOiBcIlVzZXIgY3JlYXRlZCBzdWNjZXNzZnVsbHlcIiwgdXNlcjogeyBpZDogdXNlci5pZCwgZW1haWw6IHVzZXIuZW1haWwsIG5hbWU6IHVzZXIubmFtZSB9IH0sXG4gICAgICB7IHN0YXR1czogMjAxIH1cbiAgICApO1xuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgY29uc29sZS5lcnJvcihcIlNpZ251cCBlcnJvcjpcIiwgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IFwiSW50ZXJuYWwgc2VydmVyIGVycm9yXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJiY3J5cHQiLCJzZW5kV2VsY29tZUVtYWlsIiwiUE9TVCIsInJlcSIsIm5hbWUiLCJlbWFpbCIsInBhc3N3b3JkIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiZXhpc3RpbmdVc2VyIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImhhc2hlZFBhc3N3b3JkIiwiaGFzaCIsImNyZWF0ZSIsImRhdGEiLCJyb2xlIiwibWVzc2FnZSIsImlkIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/signup/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/email.ts":
/*!**************************!*\
  !*** ./src/lib/email.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   sendWelcomeEmail: () => (/* binding */ sendWelcomeEmail)\n/* harmony export */ });\n/**\n * A simple email utility for local development.\n * In a real production environment, you would use a service like SendGrid, Mailgun, or AWS SES.\n */ async function sendWelcomeEmail(email, name) {\n    // For local development, we'll just log the email content to the console.\n    // This simulates the email being sent.\n    console.log(\"-----------------------------------------\");\n    console.log(`[EMAIL SENT] To: ${email}`);\n    console.log(`Subject: Welcome to Crafted by Sru, ${name}!`);\n    console.log(\"Content:\");\n    console.log(`Hello ${name},`);\n    console.log(\"Thank you for joining Crafted by Sru. We're excited to have you as a member of our artisan community.\");\n    console.log(\"You can now browse our full catalog and manage your orders.\");\n    console.log(\"Happy shopping!\");\n    console.log(\"-----------------------------------------\");\n    // In a real implementation with Nodemailer:\n    /*\n  const transporter = nodemailer.createTransport({\n    host: process.env.EMAIL_SERVER_HOST,\n    port: process.env.EMAIL_SERVER_PORT,\n    auth: {\n      user: process.env.EMAIL_SERVER_USER,\n      pass: process.env.EMAIL_SERVER_PASSWORD,\n    },\n  });\n\n  await transporter.sendMail({\n    from: '\"Crafted by Sru\" <noreply@craftedbysru.com>',\n    to: email,\n    subject: `Welcome to Crafted by Sru, ${name}!`,\n    text: `Hello ${name}, welcome to our community!`,\n    html: `<b>Hello ${name}</b>, welcome to our community!`,\n  });\n  */ return true;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2VtYWlsLnRzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7O0NBR0MsR0FFTSxlQUFlQSxpQkFBaUJDLEtBQWEsRUFBRUMsSUFBWTtJQUNoRSwwRUFBMEU7SUFDMUUsdUNBQXVDO0lBRXZDQyxRQUFRQyxHQUFHLENBQUM7SUFDWkQsUUFBUUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEVBQUVILE9BQU87SUFDdkNFLFFBQVFDLEdBQUcsQ0FBQyxDQUFDLG9DQUFvQyxFQUFFRixLQUFLLENBQUMsQ0FBQztJQUMxREMsUUFBUUMsR0FBRyxDQUFDO0lBQ1pELFFBQVFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRUYsS0FBSyxDQUFDLENBQUM7SUFDNUJDLFFBQVFDLEdBQUcsQ0FBQztJQUNaRCxRQUFRQyxHQUFHLENBQUM7SUFDWkQsUUFBUUMsR0FBRyxDQUFDO0lBQ1pELFFBQVFDLEdBQUcsQ0FBQztJQUVaLDRDQUE0QztJQUM1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFpQkEsR0FFQSxPQUFPO0FBQ1QiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcdzEzNjE4OVxcRG93bmxvYWRzXFxjcmFmdGVkLWJ5LXNydS1zdGFibGVcXHNyY1xcbGliXFxlbWFpbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgc2ltcGxlIGVtYWlsIHV0aWxpdHkgZm9yIGxvY2FsIGRldmVsb3BtZW50LlxuICogSW4gYSByZWFsIHByb2R1Y3Rpb24gZW52aXJvbm1lbnQsIHlvdSB3b3VsZCB1c2UgYSBzZXJ2aWNlIGxpa2UgU2VuZEdyaWQsIE1haWxndW4sIG9yIEFXUyBTRVMuXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRXZWxjb21lRW1haWwoZW1haWw6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XG4gIC8vIEZvciBsb2NhbCBkZXZlbG9wbWVudCwgd2UnbGwganVzdCBsb2cgdGhlIGVtYWlsIGNvbnRlbnQgdG8gdGhlIGNvbnNvbGUuXG4gIC8vIFRoaXMgc2ltdWxhdGVzIHRoZSBlbWFpbCBiZWluZyBzZW50LlxuICBcbiAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgY29uc29sZS5sb2coYFtFTUFJTCBTRU5UXSBUbzogJHtlbWFpbH1gKTtcbiAgY29uc29sZS5sb2coYFN1YmplY3Q6IFdlbGNvbWUgdG8gQ3JhZnRlZCBieSBTcnUsICR7bmFtZX0hYCk7XG4gIGNvbnNvbGUubG9nKFwiQ29udGVudDpcIik7XG4gIGNvbnNvbGUubG9nKGBIZWxsbyAke25hbWV9LGApO1xuICBjb25zb2xlLmxvZyhcIlRoYW5rIHlvdSBmb3Igam9pbmluZyBDcmFmdGVkIGJ5IFNydS4gV2UncmUgZXhjaXRlZCB0byBoYXZlIHlvdSBhcyBhIG1lbWJlciBvZiBvdXIgYXJ0aXNhbiBjb21tdW5pdHkuXCIpO1xuICBjb25zb2xlLmxvZyhcIllvdSBjYW4gbm93IGJyb3dzZSBvdXIgZnVsbCBjYXRhbG9nIGFuZCBtYW5hZ2UgeW91ciBvcmRlcnMuXCIpO1xuICBjb25zb2xlLmxvZyhcIkhhcHB5IHNob3BwaW5nIVwiKTtcbiAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcblxuICAvLyBJbiBhIHJlYWwgaW1wbGVtZW50YXRpb24gd2l0aCBOb2RlbWFpbGVyOlxuICAvKlxuICBjb25zdCB0cmFuc3BvcnRlciA9IG5vZGVtYWlsZXIuY3JlYXRlVHJhbnNwb3J0KHtcbiAgICBob3N0OiBwcm9jZXNzLmVudi5FTUFJTF9TRVJWRVJfSE9TVCxcbiAgICBwb3J0OiBwcm9jZXNzLmVudi5FTUFJTF9TRVJWRVJfUE9SVCxcbiAgICBhdXRoOiB7XG4gICAgICB1c2VyOiBwcm9jZXNzLmVudi5FTUFJTF9TRVJWRVJfVVNFUixcbiAgICAgIHBhc3M6IHByb2Nlc3MuZW52LkVNQUlMX1NFUlZFUl9QQVNTV09SRCxcbiAgICB9LFxuICB9KTtcblxuICBhd2FpdCB0cmFuc3BvcnRlci5zZW5kTWFpbCh7XG4gICAgZnJvbTogJ1wiQ3JhZnRlZCBieSBTcnVcIiA8bm9yZXBseUBjcmFmdGVkYnlzcnUuY29tPicsXG4gICAgdG86IGVtYWlsLFxuICAgIHN1YmplY3Q6IGBXZWxjb21lIHRvIENyYWZ0ZWQgYnkgU3J1LCAke25hbWV9IWAsXG4gICAgdGV4dDogYEhlbGxvICR7bmFtZX0sIHdlbGNvbWUgdG8gb3VyIGNvbW11bml0eSFgLFxuICAgIGh0bWw6IGA8Yj5IZWxsbyAke25hbWV9PC9iPiwgd2VsY29tZSB0byBvdXIgY29tbXVuaXR5IWAsXG4gIH0pO1xuICAqL1xuXG4gIHJldHVybiB0cnVlO1xufVxuIl0sIm5hbWVzIjpbInNlbmRXZWxjb21lRW1haWwiLCJlbWFpbCIsIm5hbWUiLCJjb25zb2xlIiwibG9nIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/email.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/adapter-pg */ \"(rsc)/./node_modules/@prisma/adapter-pg/dist/index.mjs\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pg */ \"pg\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([pg__WEBPACK_IMPORTED_MODULE_1__, _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_2__]);\n([pg__WEBPACK_IMPORTED_MODULE_1__, _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\nconst prismaClientSingleton = ()=>{\n    const pool = new pg__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Pool({\n        connectionString: process.env.DATABASE_URL\n    });\n    const adapter = new _prisma_adapter_pg__WEBPACK_IMPORTED_MODULE_2__.PrismaPg(pool);\n    return new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n        adapter\n    });\n};\nconst prisma = globalThis.prisma ?? prismaClientSingleton();\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\nif (true) globalThis.prisma = prisma;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUE2QztBQUNBO0FBQzFCO0FBRW5CLE1BQU1HLHdCQUF3QjtJQUM1QixNQUFNQyxPQUFPLElBQUlGLCtDQUFPLENBQUM7UUFBRUksa0JBQWtCQyxRQUFRQyxHQUFHLENBQUNDLFlBQVk7SUFBQztJQUN0RSxNQUFNQyxVQUFVLElBQUlULHdEQUFRQSxDQUFDRztJQUM3QixPQUFPLElBQUlKLHdEQUFZQSxDQUFDO1FBQUVVO0lBQVE7QUFDcEM7QUFNQSxNQUFNQyxTQUFTQyxXQUFXRCxNQUFNLElBQUlSO0FBRXBDLGlFQUFlUSxNQUFNQSxFQUFBO0FBRXJCLElBQUlKLElBQXFDLEVBQUVLLFdBQVdELE1BQU0sR0FBR0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcdzEzNjE4OVxcRG93bmxvYWRzXFxjcmFmdGVkLWJ5LXNydS1zdGFibGVcXHNyY1xcbGliXFxwcmlzbWEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5pbXBvcnQgeyBQcmlzbWFQZyB9IGZyb20gJ0BwcmlzbWEvYWRhcHRlci1wZydcbmltcG9ydCBwZyBmcm9tICdwZydcblxuY29uc3QgcHJpc21hQ2xpZW50U2luZ2xldG9uID0gKCkgPT4ge1xuICBjb25zdCBwb29sID0gbmV3IHBnLlBvb2woeyBjb25uZWN0aW9uU3RyaW5nOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwgfSlcbiAgY29uc3QgYWRhcHRlciA9IG5ldyBQcmlzbWFQZyhwb29sKVxuICByZXR1cm4gbmV3IFByaXNtYUNsaWVudCh7IGFkYXB0ZXIgfSBhcyBhbnkpXG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgdmFyIHByaXNtYTogdW5kZWZpbmVkIHwgUmV0dXJuVHlwZTx0eXBlb2YgcHJpc21hQ2xpZW50U2luZ2xldG9uPlxufVxuXG5jb25zdCBwcmlzbWEgPSBnbG9iYWxUaGlzLnByaXNtYSA/PyBwcmlzbWFDbGllbnRTaW5nbGV0b24oKVxuXG5leHBvcnQgZGVmYXVsdCBwcmlzbWFcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbFRoaXMucHJpc21hID0gcHJpc21hXG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiUHJpc21hUGciLCJwZyIsInByaXNtYUNsaWVudFNpbmdsZXRvbiIsInBvb2wiLCJQb29sIiwiY29ubmVjdGlvblN0cmluZyIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkwiLCJhZGFwdGVyIiwicHJpc21hIiwiZ2xvYmFsVGhpcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/bcryptjs","vendor-chunks/@prisma","vendor-chunks/postgres-array"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fsignup%2Froute&page=%2Fapi%2Fauth%2Fsignup%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsignup%2Froute.ts&appDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cw136189%5CDownloads%5Ccrafted-by-sru-stable&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();