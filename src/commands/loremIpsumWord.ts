import * as vscode from "vscode";
import { loremIpsum } from "lorem-ipsum";

const path = require("path");

const workspaces = vscode.workspace.workspaceFolders;
const workspace_path = workspaces ? workspaces[0].uri.fsPath : undefined;
const extension_path = path.join(__dirname, "..", "..");
const templates_path = path.join(extension_path, "templates");

export default vscode.commands.registerCommand(
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