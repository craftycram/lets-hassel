import * as vscode from "vscode";

const fs = require("fs-extra");
const path = require("path");
const url = require("url");
const mustache = require("mustache");

const workspaces = vscode.workspace.workspaceFolders;
const workspace_path = workspaces ? workspaces[0].uri.fsPath : undefined;
const extension_path = path.join(__dirname, "..", "..");
const templates_path = path.join(extension_path, "templates");

export default vscode.commands.registerCommand(
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