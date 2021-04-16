import * as vscode from "vscode";

const fs = require("fs-extra");
const path = require("path");
const url = require("url");
const git = require("simple-git/promise");
const npm = require("npm-programmatic");

const workspaces = vscode.workspace.workspaceFolders;
const workspace_path = workspaces ? workspaces[0].uri.fsPath : undefined;
const extension_path = path.join(__dirname, "..", "..");
const templates_path = path.join(extension_path, "templates");

export default vscode.commands.registerCommand(
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

        // create empty index.js
        progress.report({ increment: 5, message: 'creating index.js' });
        fs.closeSync(
          fs.openSync(path.join(workspace_path, "src", "index.js"), "w")
        );

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

        // copy .gitignore template
        progress.report({ increment: 5, message: 'copying .gitignore' });
        const cmd_templates = path.join(templates_path, "setupNode");
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
          name: 'Let\'s Hassel - Node Setup',
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

        // show the generated index.js
        progress.report({ increment: 10, message: 'opening editor' });
        const uri = url.pathToFileURL(path.join(workspace_path, 'src/index.js'));
        const editor = await vscode.window.showTextDocument(
          vscode.Uri.parse(uri)
        );

        // jump right into the document
        const range = editor.document.lineAt(0).range;
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

      });
      const p = new Promise(resolve => {
        resolve(null);
      });

      return p;

  }
);