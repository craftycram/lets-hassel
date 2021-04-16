import * as vscode from "vscode";

const fs = require("fs-extra");
const path = require("path");
const url = require("url");
const git = require("simple-git/promise");
const npm = require("npm-programmatic");
const mustache = require('mustache');

const workspaces = vscode.workspace.workspaceFolders;
const workspace_path = workspaces ? workspaces[0].uri.fsPath : undefined;
const extension_path = path.join(__dirname, "..", "..");
const templates_path = path.join(extension_path, "templates");
const cmd_templates = path.join(templates_path, "firebaseDeploy");

export default vscode.commands.registerCommand(
  "extension.firebaseVueDeploy",
  async () => {
    // make sure we really got a workspace
    if (workspace_path === undefined) {
      vscode.window.showErrorMessage(
        "You have not yet opened a folder!"
      );
      return;
    }

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Setting up",
      cancellable: true
    }, async (progress, token) => {
      token.onCancellationRequested(() => {
        console.log("User canceled the long running operation");
      });

      const modulePath = await require('child_process').execSync('npm bin -g').toString().replace('bin', 'lib/node_modules');
      const globalModules = await require('child_process').execSync(`ls ${modulePath}`).toString().split('\n');
      if (!globalModules.includes('firebase-tools')) {
        vscode.window.showErrorMessage('Please install the firebase cli tools using: npm install -g firebase-tools');
      }

      vscode.window.showInformationMessage('Please create a new firebase project and copy it\'s id');
      await vscode.env.openExternal(vscode.Uri.parse('https://console.firebase.google.com/'));

      // ask for firebase id
      const firebaseId = await vscode.window.showInputBox({
        prompt: "What is the firebase project id?",
        placeHolder: "example-project"
      });
      if (firebaseId === undefined) {
        vscode.window.showErrorMessage("Please provide the project id. Action canceled!");
        return;
      }

      // create .github folder
      progress.report({
        increment: 5,
        message: 'creating .github folder'
      });
      const gh_dir = await path.join(workspace_path, ".github");
      if (!fs.existsSync(gh_dir)) {
        await fs.mkdirSync(gh_dir);
      }

      // copy firebase.json file
      progress.report({
        increment: 5,
        message: 'copying firebase.json'
      });
      await fs.copySync(
        path.join(cmd_templates, "firebase.json"),
        path.join(workspace_path, "firebase.json")
      );

      // copy deploy.yml file
      progress.report({
        increment: 5,
        message: 'copying deploy.yml'
      });
      await fs.copySync(
        path.join(cmd_templates, "deploy.yml"),
        path.join(workspace_path, ".github", "deploy.yml")
      );

      // create custom .firebaserc file (using the template file)
      progress.report({
        increment: 5,
        message: 'creating .firebaserc'
      });

      const firebaserc = await fs.readFileSync(
        path.join(cmd_templates, "firebaserc"),
        "utf8"
      );
      const firebaserc_render = await mustache.render(firebaserc, {
        firebaseId
      });
      await fs.writeFileSync(path.join(workspace_path, '.firebaserc'), firebaserc_render);

      // init git repo
      progress.report({
        increment: 40,
        message: 'initializing git local repository'
      });
      await git(workspace_path).init();
      await git(workspace_path).add('./*');
      await git(workspace_path).commit('added firebase support');

      const terminal = await vscode.window.createTerminal({
        name: 'Let\'s Hassel - Firebase Setup',
        hideFromUser: true,
      } as any);

      await vscode.window.showInformationMessage("Please login with Firebase after dismissing this notification. Then create a 'FIREBASE_HOSTING' secret in your repos GitHub settings providing that token.");
      terminal.sendText('firebase login:ci');
      terminal.show();
      
      // let the coding begin!
      vscode.window.showInformationMessage("To deploy just commit on branch master. Happy depoying...");

    });
    const p = new Promise(resolve => {
      resolve(null);
    });

    return p;

  }
);