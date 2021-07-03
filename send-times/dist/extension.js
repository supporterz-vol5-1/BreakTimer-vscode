/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.send_time = void 0;
const vscode = __webpack_require__(1);
class send_time {
    constructor() {
        this.start_time = 0;
        this.end_time = 0;
        this.file_type = "";
        this.isCoding = false;
        this.breakTime = [];
        this.username = "";
        this.password = "";
    }
    init() {
        this.get_editor_event();
    }
    user_auth() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("please log in!");
            const usr = yield vscode.window.showInputBox({
                prompt: "please input username"
            });
            if (usr) {
                this.username = usr;
            }
            else {
                vscode.window.showWarningMessage("failed to get");
            }
            const pass = yield vscode.window.showInputBox({
                password: true,
                prompt: "please input password"
            });
            if (pass) {
                this.password = pass;
            }
            else {
                vscode.window.showWarningMessage("failed to get");
            }
            //console.log(this.username)
            //console.log(this.password)
            //ユーザー認証処理をする
        });
    }
    dispose() {
        this.disposable.dispose();
    }
    get_editor_event() {
        let subscription = [];
        vscode.window.onDidChangeTextEditorSelection(this.onChange, this, subscription);
        vscode.window.onDidChangeActiveTextEditor(this.onChange, this, subscription);
        vscode.workspace.onDidSaveTextDocument(this.checkBreak, this, subscription);
        //TODO: ファイルを閉じた時に時間をDBに送りたい
        //vscode.window.onDidChangeVisibleTextEditors(this.send_data, this, subscription)
        //console.log(vscode.window.visibleTextEditors)
        vscode.window.onDidChangeTextEditorSelection(this.send_data, this, subscription);
        this.disposable = vscode.Disposable.from(...subscription);
    }
    //送るデータ
    // 作業時間，フィアルの内容，ユーザー名
    send_data() {
    }
    onChange() {
        this.onEvent(false);
    }
    update_end_time() {
        this.end_time = Date.now();
    }
    checkBreak() {
        this.update_end_time();
        if (this.check_break_time(2)) {
            this.breakTime.push(this.get_elapsed_time());
            console.log(this.breakTime);
        }
        console.log("elapsed time", this.get_elapsed_time());
    }
    onEvent(isWrite) {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let doc = editor.document;
            if (doc) {
                let file = doc.fileName;
                if (!this.file_type) {
                    this.file_type = file.split("/").reverse()[0].split(".")[1];
                }
                //console.log(this.file_type)
                if (file && !this.isCoding) {
                    this.start_time = Date.now();
                    this.isCoding = true;
                }
                else if (this.isCoding) {
                    this.update_end_time();
                }
            }
        }
        //console.log("start time", this.start_time)
        //console.log("end time", this.end_time)
        //console.log("elapsed time", this.get_elapsed_time())
    }
    get_elapsed_time() {
        if (this.start_time >= this.end_time)
            return 0;
        //秒で返す
        return (this.end_time - this.start_time) / 1000;
    }
    check_break_time(interval) {
        if (this.get_elapsed_time() >= interval) {
            vscode.window.showInformationMessage("take a break");
            this.isCoding = false;
            return true;
        }
        else {
            return false;
        }
    }
}
exports.send_time = send_time;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __webpack_require__(1);
const send_time_1 = __webpack_require__(2);
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
    let disposable = vscode.commands.registerCommand('send-times.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World Vscode');
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(application);
    application.user_auth();
    application.init();
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