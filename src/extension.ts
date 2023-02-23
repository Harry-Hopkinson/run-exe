import * as vscode from "vscode";
import { fileURLToPath } from "url";

let terminal: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("run-exe.run", (fileUri: vscode.Uri) => {
      fileUri = fileUri || vscode.window.activeTextEditor?.document.uri;

      // Handle remote editors
      if (!fileUri || fileUri.scheme !== "file") {
        vscode.window.showErrorMessage(
          "Selected file is an invalid local file."
        );
        return;
      }

      const filePath = fileURLToPath(fileUri.toString());
      const isWindows = process.platform === "win32";

      terminal =
        terminal ||
        vscode.window.createTerminal({
          name: "exe Runner",
          shellPath: isWindows ? "C:\\Windows\\System32\\cmd.exe" : "/bin/bash",
          shellArgs: isWindows ? [] : ["-c"],
        });
      terminal.show();
      terminal.sendText(`${isWindows ? "" : "wine "}"${filePath}"`);

      vscode.window.onDidCloseTerminal((closedTerminal) => {
        if (closedTerminal === terminal) {
          terminal = undefined;
        }
      });
    })
  );
}
