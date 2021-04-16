import * as vscode from "vscode";
import commandSetupNode from './commands/setupNode';
import commandSetupElectron from './commands/setupElectron';
import commandloremIpsumWord from './commands/loremIpsumWord';
import commandloremIpsumSentence from './commands/loremIpsumSentence';
import commandloremIpsumParagraph from './commands/loremIpsumParagraph';
import commandWssCreateFiles from './commands/wssCreateFiles';
import commandWebCreateFiles from './commands/webCreateFiles';
import commandRaspiSetupSD from './commands/setupRaspiSdCard';
import commandFirebaseVueDeploy from './commands/firebaseVueDeploy';

export function activate(context: vscode.ExtensionContext) {
	console.log(
		'Congratulations, your extension "lets-hassel-node-plugin" is now active!'
	);

	context.subscriptions.push(
		commandSetupNode,
		commandSetupElectron,
		commandloremIpsumWord,
		commandloremIpsumSentence,
		commandloremIpsumParagraph,
		commandWssCreateFiles,
		commandWebCreateFiles,
		commandRaspiSetupSD,
		commandFirebaseVueDeploy,
	);
}

export function deactivate() { }

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
