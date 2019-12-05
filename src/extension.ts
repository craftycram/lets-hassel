import * as vscode from 'vscode';
import {
	formatWithOptions,
	isError
} from 'util';
import {
	open,
	unwatchFile
} from 'fs';
import {
	pathToFileURL,
	fileURLToPath
} from 'url';
import {
	loremIpsum
} from "lorem-ipsum";

const fs = require('fs');

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

		const nvm_version = await vscode.window.showInputBox({
			prompt: "Which Node.js version should be used?",
			placeHolder: "e.g. 13"
		});
		if (String(nvm_version) === 'undefined') {
			vscode.window.showErrorMessage('Action canceled!');
			return;
		}

		const author = await vscode.window.showInputBox({
			prompt: "Please enter the authors name."
		});
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
			}	as any);

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
			}	as any);

		terminal.sendText("sudo apt-get install jq");

	});

	let commandloremIpsumWord = vscode.commands.registerCommand('extension.loremIpsumWord', async () => {

		const count = await vscode.window.showInputBox({
			prompt: "How many words should be generated?"
		});
		if (String(count) === 'undefined') {
			vscode.window.showErrorMessage('Action canceled!');
			return;
		}

		if (vscode.window.activeTextEditor) {

			let editor = vscode.window.activeTextEditor;
			let document = editor.document;
			let selection = editor.selection;

			// 1) Get the configured glob pattern value for the current file
			const format: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.format');
			const paragraphLowerBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.minSentencePerParagraph');
			const paragraphUpperBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.maxSentencePerParagraph');
			const sentenceLowerBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.minWordsPerSentence');
			const sentenceUpperBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.maxWordsPerSentence');

			const text = loremIpsum({
				count: Number(count), // Number of "words", "sentences", or "paragraphs"
				format: format, // "plain" or "html"
				paragraphLowerBound: paragraphLowerBound, // Min. number of sentences per paragraph.
				paragraphUpperBound: paragraphUpperBound, // Max. number of sentences per paragarph.
				sentenceLowerBound: sentenceLowerBound, // Min. number of words per sentence.
				sentenceUpperBound: sentenceUpperBound, // Max. number of words per sentence.
				units: "words", // paragraph(s), "sentence(s)", or "word(s)"
			});



			editor.edit(editBuilder => {
				if (editor.selection.isEmpty) {
					// the Position object gives you the line and character where the cursor is
					const position = editor.selection.active;
					editBuilder.insert(position, text);
				} else {
					editBuilder.replace(selection, text);
				}
			});
		}
	});

	let commandloremIpsumSentence = vscode.commands.registerCommand('extension.loremIpsumSentence', async () => {

		const count = await vscode.window.showInputBox({
			prompt: "How many sentences should be generated?"
		});
		if (String(count) === 'undefined') {
			vscode.window.showErrorMessage('Action canceled!');
			return;
		}
		if (vscode.window.activeTextEditor) {

			let editor = vscode.window.activeTextEditor;
			let document = editor.document;
			let selection = editor.selection;

			// 1) Get the configured glob pattern value for the current file
			const format: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.format');
			const paragraphLowerBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.minSentencePerParagraph');
			const paragraphUpperBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.maxSentencePerParagraph');
			const sentenceLowerBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.minWordsPerSentence');
			const sentenceUpperBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.maxWordsPerSentence');

			const text = loremIpsum({
				count: Number(count), // Number of "words", "sentences", or "paragraphs"
				format: format, // "plain" or "html"
				paragraphLowerBound: paragraphLowerBound, // Min. number of sentences per paragraph.
				paragraphUpperBound: paragraphUpperBound, // Max. number of sentences per paragarph.
				sentenceLowerBound: sentenceLowerBound, // Min. number of words per sentence.
				sentenceUpperBound: sentenceUpperBound, // Max. number of words per sentence.
				units: "sentences", // paragraph(s), "sentence(s)", or "word(s)"
			});



			editor.edit(editBuilder => {
				if (editor.selection.isEmpty) {
					// the Position object gives you the line and character where the cursor is
					const position = editor.selection.active;
					editBuilder.insert(position, text);
				} else {
					editBuilder.replace(selection, text);
				}
			});
		}

	});

	let commandloremIpsunParagraph = vscode.commands.registerCommand('extension.loremIpsunParagraph', async () => {

		const count = await vscode.window.showInputBox({
			prompt: "How many paragraphs should be generated?"
		});
		if (String(count) === 'undefined') {
			vscode.window.showErrorMessage('Action canceled!');
			return;
		}

		if (vscode.window.activeTextEditor) {

			let editor = vscode.window.activeTextEditor;
			let document = editor.document;
			let selection = editor.selection;

			// 1) Get the configured glob pattern value for the current file
			const format: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.format');
			const paragraphLowerBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.minSentencePerParagraph');
			const paragraphUpperBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.maxSentencePerParagraph');
			const sentenceLowerBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.minWordsPerSentence');
			const sentenceUpperBound: any = vscode.workspace.getConfiguration('', document.uri).get('Let\'sHassel.loremIpsum.maxWordsPerSentence');

			const text = loremIpsum({
				count: Number(count), // Number of "words", "sentences", or "paragraphs"
				format: format, // "plain" or "html"
				paragraphLowerBound: paragraphLowerBound, // Min. number of sentences per paragraph.
				paragraphUpperBound: paragraphUpperBound, // Max. number of sentences per paragarph.
				sentenceLowerBound: sentenceLowerBound, // Min. number of words per sentence.
				sentenceUpperBound: sentenceUpperBound, // Max. number of words per sentence.
				units: "paragraphs", // paragraph(s), "sentence(s)", or "word(s)"
			});



			editor.edit(editBuilder => {
				if (editor.selection.isEmpty) {
					// the Position object gives you the line and character where the cursor is
					const position = editor.selection.active;
					editBuilder.insert(position, text);
				} else {
					editBuilder.replace(selection, text);
				}
			});
		}

	});

	let commandWssCreateFiles = vscode.commands.registerCommand('extension.wssCreateFiles', async () => {

		// 1) Get the configured glob pattern value for the current file
		const filename: any = vscode.workspace.getConfiguration().get('Let\'sHassel.wss.filename');
		const filenumber: any = vscode.workspace.getConfiguration().get('Let\'sHassel.wss.filenumber');
		const title: any = vscode.workspace.getConfiguration().get('Let\'sHassel.wss.title');

		let NEXT_TERM_ID = 1;
		// Create terminal
		const terminal = await vscode.window.createTerminal({
				name: `Terminal #${NEXT_TERM_ID++}`,
				hideFromUser: false
			} as any);

		await terminal.sendText(`touch ${filename}${filenumber}.html`);
		await terminal.sendText(`touch style${filenumber}.css`);

		await terminal.sendText(`echo \"\<"'!'"doctype html\>\" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\<html\> \" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\<head\> \" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\<meta charset=\"utf-8\"\> \" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\<link rel=\"stylesheet\" href=\"style${filenumber}.css\"\> \" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\<title\>${title}\</title\> \" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\</head\> \" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\<body\> \" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\</body\> \" >> ${filename}${filenumber}.html`);
		await terminal.sendText(`echo \"\</html\> \" >> ${filename}${filenumber}.html`);

		await terminal.sendText(`echo \"/* related to: ${filename}${filenumber}.html */ \" >> style${filenumber}.css`);


		
		const workspace_path = vscode.workspace.workspaceFolders[0].uri;
		const html_file = `${workspace_path}/${filename}${filenumber}.html`;
		// const workspace_dir = vscode.workspace.fs.readDirectory(workspace_path);

		const newFilenumber = filenumber + 1;
		await vscode.workspace.getConfiguration().update('Let\'sHassel.wss.filenumber', newFilenumber, vscode.ConfigurationTarget.Global);
	
		// Only temporary
		await delay(1000);
		vscode.window.showTextDocument(vscode.Uri.parse(html_file));

		/*
		if (vscode.window.activeTextEditor) {

			let editor = vscode.window.activeTextEditor;
			let document = editor.document;
			let selection = editor.selection;
			let position = editor.selection.active;

			await position.with(9, 2);

		}
		*/

	});

	context.subscriptions.push(commandSetup, commandInstallMacOS, commandInstallDebian, commandloremIpsumWord, commandloremIpsumSentence, commandloremIpsunParagraph, commandWssCreateFiles);
}

export function deactivate() {}

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}