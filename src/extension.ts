// vscode namespace 下为 VS Code 插件 API
import * as vscode from "vscode";
import SnipService from './SnipService';

export function activate(context: vscode.ExtensionContext) {
  const snipService = new SnipService();
  context.subscriptions.push(
    vscode.commands.registerCommand("Snipper.lookFor", async () => {

      const wantedSnip =  await vscode.window.showQuickPick(snipService.selection);

      if(!wantedSnip) return;

      const target = snipService.getResourceUrl(wantedSnip);
      const snip = await snipService.getSnip(target);

      const { document } = vscode.window.activeTextEditor;

      const {
        uri,
        isDirty,
        save,
        getText,
      } = document

      // save dirty file first.
      if (isDirty) {
        await save();
      }

      const before = getText();

      const next = before ? `${before}\n${snip}` : snip;

      await vscode.workspace.fs.writeFile(uri, next);

      vscode.window.showInformationMessage(snip);
    }),

    vscode.commands.registerCommand("Snipper.clearCache", async() => {
      snipService.clearCache();
      vscode.window.showInformationMessage("Clear Cache succeed");
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
