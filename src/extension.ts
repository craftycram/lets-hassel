import * as vscode from 'vscode';
import { formatWithOptions } from 'util';
import { open } from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "lets-hassel-node-plugin" is now active!');


	let commandSetup = vscode.commands.registerCommand('extension.setupNode', async () => {
		let NEXT_TERM_ID = 1;


		// Showing alert
		vscode.window.showInformationMessage('Setting up');

		// Create terminal
		const terminal = vscode.window.createTerminal({
			name: `Terminal #${NEXT_TERM_ID++}`,
			hideFromUser: true
		} as any);

		terminal.sendText("mkdir src");
		terminal.sendText("touch src/index.js");

		const nvm_version = await vscode.window.showInputBox({prompt: "Which Node.js version should be used?", placeHolder: "e.g. 13"});
		if (String(nvm_version) === 'undefined') {
			vscode.window.showErrorMessage('Action canceled!');
			return;
		}

		const author = await vscode.window.showInputBox({prompt: "Please enter the authors name."});
		if (String(author) === 'undefined') {
			vscode.window.showErrorMessage('Action canceled!');
			return;
		}

		terminal.sendText("touch .nvmrc");
		terminal.sendText(`echo v${nvm_version} >> .nvmrc`);

		terminal.sendText('touch .gitignore');
		terminal.sendText('echo out >> .gitignore');
		terminal.sendText('echo node_modules >> .gitignore');
		terminal.sendText('echo .vscode-test/ >> .gitignore');
		terminal.sendText('echo *.vsix >> .gitignore');

		terminal.sendText("clear");
		terminal.show(true);
		terminal.sendText(`npm init -y; git init; npm i eslint --save-dev; npx eslint --init; jq '.main="src/index.js"' package.json > tmp.json && mv tmp.json package.json; jq '.version="0.0.0"' package.json > tmp.json && mv tmp.json package.json; jq '.author="${author}"' package.json > tmp.json && mv tmp.json package.json; jq '.scripts={"start": "node src","lint": "eslint src"}' package.json > tmp.json && mv tmp.json package.json;`);



		// HIER PAUSE EIMFÜGEN

		// terminal.sendText(`git init`);



		// await vscode.window.showErrorMessage('terminal up');
	});

	let commandInstallMacOS = vscode.commands.registerCommand('extension.installMacOS', async () => {
		let NEXT_TERM_ID = 1;

		// Showing alert
		vscode.window.showInformationMessage('Beginning install.');

		// Create terminal
		const terminal = vscode.window.createTerminal({
			name: `Terminal #${NEXT_TERM_ID++}`,
			hideFromUser: false
		} as any);

		terminal.sendText("brew install jq");
	
	});

	let commandInstallDebian = vscode.commands.registerCommand('extension.installDebian', async () => {
		let NEXT_TERM_ID = 1;

		// Showing alert
		vscode.window.showInformationMessage('Beginning install.');

		// Create terminal
		const terminal = vscode.window.createTerminal({
			name: `Terminal #${NEXT_TERM_ID++}`,
			hideFromUser: false
		} as any);

		terminal.sendText("sudo apt-get install jq");
	
	});

	context.subscriptions.push(commandSetup, commandInstallMacOS, commandInstallDebian);
}

export function deactivate() {}
