/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.send_time = void 0;
const vscode = __webpack_require__(2);
class send_time {
    constructor() {
        this.start_time = 0;
        this.end_time = 0;
        this.file_type = "";
        this.isCoding = false;
    }
    /*
    constructor(centext: vscode.ExtensionContext){
        this.context = context;
    }
    */
    init() {
        console.log('initialized!!');
        this.get_editor_event();
    }
    dispose() {
        this.disposable.dispose();
    }
    get_editor_event() {
        let subscription = [];
        vscode.window.onDidChangeTextEditorSelection(this.onChange, this, subscription);
        vscode.window.onDidChangeActiveTextEditor(this.onChange, this, subscription);
        vscode.workspace.onDidSaveTextDocument(this.onSave, this, subscription);
        this.disposable = vscode.Disposable.from(...subscription);
    }
    onChange() {
        this.onEvent(false);
    }
    onSave() {
        this.onEvent(true);
    }
    onEvent(isWrite) {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let doc = editor.document;
            if (doc) {
                let file = doc.fileName;
                // console.log(file.split("/").reverse()[0].split(".")[1])
                this.file_type = file.split("/").reverse()[0].split(".")[1];
                if (file && !this.isCoding) {
                    this.start_time = Date.now();
                    this.isCoding = true;
                }
                else if (this.isCoding) {
                    this.end_time = Date.now();
                }
            }
        }
        console.log("start time", this.start_time);
        console.log("end time", this.end_time);
    }
}
exports.send_time = send_time;


/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const send_time_1 = __webpack_require__(1);
var application;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    application = new send_time_1.send_time();
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "send-times" is now active!');
    //console.log(vscode.window.activeTextEditor)
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('send-times.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    //vscode.window.showInformationMessage('Hello World Vscode');
    // });
    context.subscriptions.push(application);
    application.init();
    // context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    application.dispose();
}
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map