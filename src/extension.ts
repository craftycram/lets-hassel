import * as vscode from "vscode";
import { loremIpsum } from "lorem-ipsum";
import { EFAULT } from "constants";
import { resolve } from "dns";

const fs = require("fs-extra");
const path = require("path");
const url = require("url");
const git = require("simple-git/promise");
const npm = require("npm-programmatic");
const mustache = require("mustache");

let NEXT_TERM_ID = 1;

export function activate(context: vscode.ExtensionContext) {
	console.log(
		'Congratulations, your extension "lets-hassel-node-plugin" is now active!'
	);

	const workspaces = vscode.workspace.workspaceFolders;

	const workspace_path = workspaces ? workspaces[0].uri.fsPath : undefined;
	const extension_path = path.join(__dirname, "..");
	const templates_path = path.join(extension_path, "templates");

	let commandSetupNode = vscode.commands.registerCommand(
		"extension.setupNode",
		async () => {
			// make sure we really got a workspace
			if (workspace_path === undefined) {
				vscode.window.showErrorMessage(
					"You have not yet opened a folder!"
				);
				return;
			}

			const eslintconf: any = vscode.workspace
				.getConfiguration("Let'sHassel.node")
				.get("eslintconf");

			// show alert
			vscode.window.showInformationMessage("Setting up");

			// create src folder
			const src_dir = path.join(workspace_path, "src");
			if (!fs.existsSync(src_dir)) {
				fs.mkdirSync(src_dir);
			}

			// create empty index.js
			fs.closeSync(
				fs.openSync(path.join(workspace_path, "src", "index.js"), "w")
			);

			/*
			// npm init
			await npm.init();
			*/

			// ask for node version
			const nvm_version = await vscode.window.showInputBox({
				prompt: "Which Node.js version should be used?",
				placeHolder: "e.g. 13"
			});
			if (nvm_version === undefined) {
				vscode.window.showErrorMessage("Action canceled!");
				return;
			}

			// ask for author's name
			const author = await vscode.window.showInputBox({
				prompt: "Please enter the authors name."
			});
			if (author === undefined) {
				vscode.window.showErrorMessage("Action canceled!");
				return;
			}

			// create .nvmrc file
			fs.writeFileSync(
				path.join(workspace_path, ".nvmrc"),
				`v${nvm_version}`
			);

			// create README.md file
			fs.writeFileSync(
				path.join(workspace_path, "README.md"),
				`# ${path.basename(workspace_path)}`
			);

			// create CHANGELOG.md file
			fs.closeSync(fs.openSync(path.join(workspace_path, 'CHANGELOG.md'), "w"));

			// copy .gitignore template
			const cmd_templates = path.join(templates_path, "setupNode");
			fs.copySync(
				path.join(cmd_templates, "gitignore"),
				path.join(workspace_path, ".gitignore")
			);

			// create custom package.json (using the template file)
			const package_json = require(path.join(
				cmd_templates,
				"package.json"
			));

			// set project name and author
			Object.assign(package_json, {
				name: path.basename(workspace_path),
				author
			});

			// write it to the target file
			fs.writeFileSync(
				path.join(workspace_path, "package.json"),
				JSON.stringify(package_json, null, 4)
			);

			// init git repo
			await git(workspace_path).init();
			await git(workspace_path).add('./*');
			await git(workspace_path).commit('initial commit');

			// install eslint
			await npm.install(["eslint"], {
				cwd: workspace_path,
				saveDev: true
			});

			// show the generated index.js
			const uri = url.pathToFileURL(path.join(workspace_path, 'src/index.js'));
			const editor = await vscode.window.showTextDocument(
				vscode.Uri.parse(uri)
			);

			// jump right into the document
			const range = editor.document.lineAt(0).range;
			editor.selection = new vscode.Selection(range.end, range.end);

			// let the coding begin!
			vscode.window.showInformationMessage("Happy coding ...");

			// start eslint assistant
			vscode.window.showInformationMessage("configuring eslint…");
			const terminal = await vscode.window.createTerminal({
				name: `Terminal #${NEXT_TERM_ID++}`,
				hideFromUser: true
			} as any);

			if (eslintconf) {

				await npm.install(["eslint-config-airbnb-base", "eslint-plugin-import"], {
					cwd: workspace_path,
					saveDev: true
				});

				// copy .eslintrc template
				await fs.copySync(
					path.join(cmd_templates, "../generic/eslintrc-auto.json"),
					path.join(workspace_path, ".eslintrc.json")
				);

				await git(workspace_path).add('./*');
				await git(workspace_path).commit('installed & configured npm package eslint');

			} else {
				await terminal.sendText("npx eslint --init && git add . && git commit -m \"installed & configured npm package eslint\"");
				await terminal.show(true);
			}

			// jump right into the window, onde it is available
			const subscription = vscode.window.onDidChangeActiveTextEditor(
				() => {
					const editor = vscode.window.activeTextEditor;
					if (editor) {
						subscription.dispose();
					} else {
						vscode.window.showInformationMessage("Hmpf !!!");
					}
				}
			);
		}
	);

	let commandSetupElectron = vscode.commands.registerCommand(
		"extension.setupElectron",
		async () => {
			// make sure we really got a workspace
			if (workspace_path === undefined) {
				vscode.window.showErrorMessage(
					"You have not yet opened a folder!"
				);
				return;
			}

			const eslintconf: any = vscode.workspace
				.getConfiguration("Let'sHassel.node")
				.get("eslintconf");

			// show alert
			// vscode.window.showInformationMessage("Setting up");
			
			// setting up progess
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Setting up",
				cancellable: true
			}, async (progress, token) => {
				token.onCancellationRequested(() => {
					console.log("User canceled the long running operation");
				});
	
	
				// ask for node version
				const nvm_version = await vscode.window.showInputBox({
					prompt: "Which Node.js version should be used?",
					placeHolder: "e.g. 13"
				});
				if (nvm_version === undefined) {
					vscode.window.showErrorMessage("Action canceled!");
					return;
				}

				// ask for author's name
				const author = await vscode.window.showInputBox({
					prompt: "Please enter the authors name."
				});
				if (author === undefined) {
					vscode.window.showErrorMessage("Action canceled!");
					return;
				}

				// create src folder
				progress.report({ increment: 0, message: 'creating src folder' });
				const src_dir = path.join(workspace_path, "src");
				if (!fs.existsSync(src_dir)) {
					fs.mkdirSync(src_dir);
				}

				// create .nvmrc file
				progress.report({ increment: 5, message: 'creating node config' });
				fs.writeFileSync(
					path.join(workspace_path, ".nvmrc"),
					`v${nvm_version}`
				);

				// create README.md file
				progress.report({ increment: 5, message: 'creating readme' });
				fs.writeFileSync(
					path.join(workspace_path, "README.md"),
					`# ${path.basename(workspace_path)}`
				);

				// create CHANGELOG.md file
				progress.report({ increment: 5, message: 'creating changelog' });
				fs.closeSync(fs.openSync(path.join(workspace_path, 'CHANGELOG.md'), "w"));
				
				const cmd_templates = path.join(templates_path, "setupElectron");

				// copy main.js template
				progress.report({ increment: 5, message: 'copying main.js' });
				fs.copySync(
					path.join(cmd_templates, "main.js"),
					path.join(workspace_path, "src/main.js")
				);

				// copy index.html template
				progress.report({ increment: 5, message: 'copying index.html' });
				fs.copySync(
					path.join(cmd_templates, "index.html"),
					path.join(workspace_path, "src/index.html")
				);

				// copy .gitignore template
				progress.report({ increment: 5, message: 'copying .gitignore' });
				fs.copySync(
					path.join(cmd_templates, "gitignore"),
					path.join(workspace_path, ".gitignore")
				);

				// create custom package.json (using the template file)
				progress.report({ increment: 5, message: 'creating package.json' });
				const package_json = require(path.join(
					cmd_templates,
					"package.json"
				));

				// set project name and author
				progress.report({ increment: 5, message: 'assigning values' });
				Object.assign(package_json, {
					name: path.basename(workspace_path),
					author
				});

				// write it to the target file
				progress.report({ increment: 5, message: 'saving' });
				fs.writeFileSync(
					path.join(workspace_path, "package.json"),
					JSON.stringify(package_json, null, 4)
				);

				// installing electron
				progress.report({ increment: 5, message: 'installing electron… this might take a while' });
				await npm.install(["electron"], {
					cwd: workspace_path,
					saveDev: true
				});

				// init git repo
				progress.report({ increment: 40, message: 'initializing git local repository' });
				await git(workspace_path).init();
				await git(workspace_path).add('./*');
				await git(workspace_path).commit('initial commit');

				// install eslint
				progress.report({ increment: 5, message: 'installing eslint' });
				await npm.install(["eslint"], {
					cwd: workspace_path,
					saveDev: true
				});

				// start eslint assistant
				progress.report({ increment: 5, message: 'configuring eslint' });
				const terminal = await vscode.window.createTerminal({
					name: `Terminal #${NEXT_TERM_ID++}`,
					hideFromUser: true
				} as any);

				if (eslintconf) {

					await npm.install(["eslint-config-airbnb-base", "eslint-plugin-import"], {
						cwd: workspace_path,
						saveDev: true
					});

					// copy .eslintrc template
					await fs.copySync(
						path.join(cmd_templates, "../generic/eslintrc-auto.json"),
						path.join(workspace_path, ".eslintrc.json")
					);

					await git(workspace_path).add('./*');
					await git(workspace_path).commit('installed & configured npm package eslint');

				} else {
					await terminal.sendText("npx eslint --init && git add . && git commit -m \"installed & configured npm package eslint\"");
					await terminal.show(true);
				}

				// show the generated main.js
				progress.report({ increment: 5, message: 'opening editor' });
				const uri = url.pathToFileURL(path.join(workspace_path, 'src/main.js'));
				const editor = await vscode.window.showTextDocument(
					vscode.Uri.parse(uri)
				);

				// jump right into the document
				const range = editor.document.lineAt(0).range;
				editor.selection = new vscode.Selection(range.end, range.end);

				// let the coding begin!
				vscode.window.showInformationMessage("Happy coding ...");

				const terminalUser = await vscode.window.createTerminal({
					name: 'Electron x Let\'s Hassel',
					hideFromUser: false
				} as any);
				await terminalUser.sendText("npm start");
				await terminalUser.show(true);

				// jump right into the window, onde it is available
				const subscription = vscode.window.onDidChangeActiveTextEditor(
					() => {
						const editor = vscode.window.activeTextEditor;
						if (editor) {
							subscription.dispose();
						} else {
							vscode.window.showInformationMessage("Hmpf !!!");
						}
					}
				);
				});

				const p = new Promise(resolve => {
					resolve(null);
				});
	
				return p;
		}
	);

	let commandloremIpsumWord = vscode.commands.registerCommand(
		"extension.loremIpsumWord",
		async () => {
			const count = await vscode.window.showInputBox({
				prompt: "How many words should be generated?"
			});
			if (String(count) === "undefined") {
				vscode.window.showErrorMessage("Action canceled!");
				return;
			}

			if (vscode.window.activeTextEditor) {
				let editor = vscode.window.activeTextEditor;
				let document = editor.document;
				let selection = editor.selection;

				// 1) Get the configured glob pattern value for the current file
				const format: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.format");
				const paragraphLowerBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.minSentencePerParagraph");
				const paragraphUpperBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.maxSentencePerParagraph");
				const sentenceLowerBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.minWordsPerSentence");
				const sentenceUpperBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.maxWordsPerSentence");

				const text = loremIpsum({
					count: Number(count), // Number of "words", "sentences", or "paragraphs"
					format: format, // "plain" or "html"
					paragraphLowerBound: paragraphLowerBound, // Min. number of sentences per paragraph.
					paragraphUpperBound: paragraphUpperBound, // Max. number of sentences per paragarph.
					sentenceLowerBound: sentenceLowerBound, // Min. number of words per sentence.
					sentenceUpperBound: sentenceUpperBound, // Max. number of words per sentence.
					units: "words" // paragraph(s), "sentence(s)", or "word(s)"
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
		}
	);

	let commandloremIpsumSentence = vscode.commands.registerCommand(
		"extension.loremIpsumSentence",
		async () => {
			const count = await vscode.window.showInputBox({
				prompt: "How many sentences should be generated?"
			});
			if (String(count) === "undefined") {
				vscode.window.showErrorMessage("Action canceled!");
				return;
			}
			if (vscode.window.activeTextEditor) {
				let editor = vscode.window.activeTextEditor;
				let document = editor.document;
				let selection = editor.selection;

				// 1) Get the configured glob pattern value for the current file
				const format: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.format");
				const paragraphLowerBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.minSentencePerParagraph");
				const paragraphUpperBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.maxSentencePerParagraph");
				const sentenceLowerBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.minWordsPerSentence");
				const sentenceUpperBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.maxWordsPerSentence");

				const text = loremIpsum({
					count: Number(count), // Number of "words", "sentences", or "paragraphs"
					format: format, // "plain" or "html"
					paragraphLowerBound: paragraphLowerBound, // Min. number of sentences per paragraph.
					paragraphUpperBound: paragraphUpperBound, // Max. number of sentences per paragarph.
					sentenceLowerBound: sentenceLowerBound, // Min. number of words per sentence.
					sentenceUpperBound: sentenceUpperBound, // Max. number of words per sentence.
					units: "sentences" // paragraph(s), "sentence(s)", or "word(s)"
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
		}
	);

	let commandloremIpsumParagraph = vscode.commands.registerCommand(
		"extension.loremIpsumParagraph",
		async () => {
			const count = await vscode.window.showInputBox({
				prompt: "How many paragraphs should be generated?"
			});
			if (String(count) === "undefined") {
				vscode.window.showErrorMessage("Action canceled!");
				return;
			}

			if (vscode.window.activeTextEditor) {
				let editor = vscode.window.activeTextEditor;
				let document = editor.document;
				let selection = editor.selection;

				// 1) Get the configured glob pattern value for the current file
				const format: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.format");
				const paragraphLowerBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.minSentencePerParagraph");
				const paragraphUpperBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.maxSentencePerParagraph");
				const sentenceLowerBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.minWordsPerSentence");
				const sentenceUpperBound: any = vscode.workspace
					.getConfiguration("", document.uri)
					.get("Let'sHassel.loremIpsum.maxWordsPerSentence");

				const text = loremIpsum({
					count: Number(count), // Number of "words", "sentences", or "paragraphs"
					format: format, // "plain" or "html"
					paragraphLowerBound: paragraphLowerBound, // Min. number of sentences per paragraph.
					paragraphUpperBound: paragraphUpperBound, // Max. number of sentences per paragarph.
					sentenceLowerBound: sentenceLowerBound, // Min. number of words per sentence.
					sentenceUpperBound: sentenceUpperBound, // Max. number of words per sentence.
					units: "paragraphs" // paragraph(s), "sentence(s)", or "word(s)"
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
		}
	);

	let commandWssCreateFiles = vscode.commands.registerCommand(
		"extension.wssCreateFiles",
		async () => {
			// make sure we really got a workspace
			if (workspace_path === undefined) {
				vscode.window.showErrorMessage(
					"You have not yet opened a folder!"
				);
				return;
			}

			// get the configured glob pattern value for the current file
			const filename = vscode.workspace
				.getConfiguration()
				.get("Let'sHassel.wss.filename");
			const filenumber: any = vscode.workspace
				.getConfiguration()
				.get("Let'sHassel.wss.filenumber");
			const title = vscode.workspace
				.getConfiguration()
				.get("Let'sHassel.web.title");

			// template files
			const cmd_templates = path.join(templates_path, "wssCreateFiles");

			// create empty css file
			const style = `style${filenumber}.css`;
			fs.closeSync(fs.openSync(path.join(workspace_path, style), "w"));

			// create html from mustache template
			const html_template = fs.readFileSync(
				path.join(cmd_templates, "index.html"),
				"utf8"
			);

			// console.log(html_template);

			const html_out = mustache.render(html_template, {
				title,
				style,
				content: ""
			});

			// create html file
			const html = `${filename}${filenumber}.html`;
			fs.writeFileSync(path.join(workspace_path, html), html_out);

			// add relation info to css
			fs.writeFileSync(path.join(workspace_path, style), `/* related to ${html} */`);

			// increment filenumber
			await vscode.workspace
				.getConfiguration()
				.update(
					"Let'sHassel.wss.filenumber",
					filenumber + 1,
					vscode.ConfigurationTarget.Global
				);

			// show the generated html
			const uri = url.pathToFileURL(path.join(workspace_path, html));
			const editor = await vscode.window.showTextDocument(
				vscode.Uri.parse(uri)
			);

			// jump right into the document
			const range = editor.document.lineAt(8).range;
			editor.selection = new vscode.Selection(range.end, range.end);

			// let the coding begin!
			vscode.window.showInformationMessage("Happy coding ...");

			// jump right into the window, onde it is available
			const subscription = vscode.window.onDidChangeActiveTextEditor(
				() => {
					const editor = vscode.window.activeTextEditor;
					if (editor) {
						subscription.dispose();
					} else {
						vscode.window.showInformationMessage("Hmpf !!!");
					}
				}
			);
		}
	);

	let commandWebCreateFiles = vscode.commands.registerCommand(
		"extension.webCreateFiles",
		async () => {
			// make sure we really got a workspace
			if (workspace_path === undefined) {
				vscode.window.showErrorMessage(
					"You have not yet opened a folder!"
				);
				return;
			}

			const title = vscode.workspace
				.getConfiguration()
				.get("Let'sHassel.web.title");

			// template files
			const cmd_templates = path.join(templates_path, "webCreateFiles");

			// create empty css file
			const style = `style.css`;
			fs.closeSync(fs.openSync(path.join(workspace_path, style), "w"));

			// create html from mustache template
			const html_template = fs.readFileSync(
				path.join(cmd_templates, "index.html"),
				"utf8"
			);

			// console.log(html_template);

			const html_out = mustache.render(html_template, {
				title,
				style,
				content: ""
			});

			// create html file
			const html = `index.html`;
			fs.writeFileSync(path.join(workspace_path, html), html_out);

			// add relation info to css
			fs.writeFileSync(path.join(workspace_path, style), `/* related to ${html} */`);

			// show the generated html
			const uri = url.pathToFileURL(path.join(workspace_path, html));
			const editor = await vscode.window.showTextDocument(
				vscode.Uri.parse(uri)
			);

			// jump right into the document
			const range = editor.document.lineAt(8).range;
			editor.selection = new vscode.Selection(range.end, range.end);

			// let the coding begin!
			vscode.window.showInformationMessage("Happy coding ...");

			// jump right into the window, onde it is available
			const subscription = vscode.window.onDidChangeActiveTextEditor(
				() => {
					const editor = vscode.window.activeTextEditor;
					if (editor) {
						subscription.dispose();
					} else {
						vscode.window.showInformationMessage("Hmpf !!!");
					}
				}
			);
		}
	);

	let commandRaspiSetupSD = vscode.commands.registerCommand(
		"extension.setupRaspiSdCard",
		async () => {

			const workspaceCheck: any = vscode.workspace
				.getConfiguration("Let'sHassel.raspi")
				.get("workspacecheck");

			if (!workspaceCheck) {
				if (workspace_path === undefined) {
					vscode.window.showErrorMessage(
						"You have not yet opened a folder!"
					);
					return;

				} else if (vscode.workspace.name !== 'boot') {
					vscode.window.showErrorMessage(
						"Please open you're RaspberryPi boot drive folder for that feature to work!"
					);
					return;
				}
			}

			const ssid = await vscode.window.showInputBox({
				prompt: "What's your Wifi SSID (name)?"
			});
			if (String(ssid) === "undefined") {
				vscode.window.showErrorMessage("Action canceled!");
				return;
			}

			const pwd = await vscode.window.showInputBox({
				prompt: "What's your Wifi password?"
			});
			if (String(pwd) === "undefined") {
				vscode.window.showErrorMessage("Action canceled!");
				return;
			}

			const country: any = vscode.workspace
				.getConfiguration("Let'sHassel.raspi")
				.get("countrycode");

			const cmd_templates = path.join(templates_path, "raspi");

			// create ssh file
			fs.closeSync(fs.openSync(path.join(workspace_path, 'ssh'), "w"));

			// create wpa_supplicant from mustache template
			const wpa_supplicant = fs.readFileSync(
				path.join(cmd_templates, "wpa_supplicant.conf"),
				"utf8"
			);

			const wpa_supplicant_render = mustache.render(wpa_supplicant, {
				country,
				ssid,
				pwd
			});

			// create html file
			fs.writeFileSync(path.join(workspace_path, 'wpa_supplicant.conf'), wpa_supplicant_render);

			// done
			vscode.window.showInformationMessage("Files created. You can eject your sd card now.");
		}
	);

	context.subscriptions.push(
		commandSetupNode,
		commandSetupElectron,
		commandloremIpsumWord,
		commandloremIpsumSentence,
		commandloremIpsumParagraph,
		commandWssCreateFiles,
		commandWebCreateFiles,
		commandRaspiSetupSD
	);
}

export function deactivate() { }

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
