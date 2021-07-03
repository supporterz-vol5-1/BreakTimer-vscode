// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {send_time} from './send_time'
var application: send_time;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	application = new send_time();
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "send-times" is now active!');
	//console.log(vscode.window.activeTextEditor)
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand("send-times.login", function (){
			application.user_auth(false);
		})
	)
	context.subscriptions.push(
		vscode.commands.registerCommand("send-times.set_interval", function (){
			application.set_interval_time();
		})
	)
	context.subscriptions.push(application);
	application.user_auth(true);
	//application.set_interval_time();
	application.init();
}

// this method is called when your extension is deactivated
export function deactivate() {
	application.dispose()
}
