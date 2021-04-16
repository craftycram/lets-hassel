import * as vscode from "vscode";

const fs = require("fs-extra");
const path = require("path");
const url = require("url");

const workspaces = vscode.workspace.workspaceFolders;
const workspace_path = workspaces ? workspaces[0].uri.fsPath : undefined;
const extension_path = path.join(__dirname, "..");
const templates_path = path.join(extension_path, "templates");

export default vscode.commands.registerCommand(
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