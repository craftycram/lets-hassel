import * as vscode from "vscode";

const fs = require("fs-extra");
const path = require("path");
const mustache = require('mustache');

const workspaces = vscode.workspace.workspaceFolders;
const workspace_path = workspaces ? workspaces[0].uri.fsPath : undefined;
const extension_path = path.join(__dirname, "..");
const templates_path = path.join(extension_path, "templates");

export default vscode.commands.registerCommand(
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