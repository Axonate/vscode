import * as vscode from "vscode";
import * as http from "http";
import * as https from "https";
import { URL } from "url";

let output: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
  output = vscode.window.createOutputChannel("Axonate");
  context.subscriptions.push(
    output,
    vscode.commands.registerCommand("axonate.ask", () => ask()),
    vscode.commands.registerCommand("axonate.askSelection", () => askSelection())
  );
}

export function deactivate() {}

function config() {
  const c = vscode.workspace.getConfiguration("axonate");
  return {
    url: (c.get<string>("url") || "http://127.0.0.1:4100").replace(/\/$/, ""),
    key: c.get<string>("apiKey") || "",
    model: c.get<string>("model") || "auto",
  };
}

async function askSelection() {
  const editor = vscode.window.activeTextEditor;
  const selection = editor?.document.getText(editor.selection) || "";
  if (!selection) {
    vscode.window.showWarningMessage("Axonate: no text selected.");
    return;
  }
  const question = await vscode.window.showInputBox({
    prompt: "Ask Axonate about the selection",
    placeHolder: "e.g. explain this / find the bug / refactor",
  });
  if (question === undefined) return;
  const lang = editor?.document.languageId || "";
  run(`${question}\n\n\`\`\`${lang}\n${selection}\n\`\`\``);
}

async function ask() {
  const prompt = await vscode.window.showInputBox({
    prompt: "Ask Axonate",
    placeHolder: "Type a prompt…",
  });
  if (!prompt) return;
  run(prompt);
}

function run(prompt: string) {
  const { url, key, model } = config();
  if (!key) {
    vscode.window.showErrorMessage(
      "Axonate: set your API key in Settings (axonate.apiKey)."
    );
    return;
  }

  output.show(true);
  output.appendLine(`\n› ${prompt.split("\n")[0]}`);

  const target = new URL(`${url}/v1/chat/completions`);
  const body = JSON.stringify({
    model,
    messages: [{ role: "user", content: prompt }],
    stream: true,
  });
  const lib = target.protocol === "https:" ? https : http;
  const req = lib.request(
    target,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "Content-Length": Buffer.byteLength(body),
      },
    },
    (res) => {
      const route = res.headers["x-router-route"];
      if (route) output.appendLine(`[route: ${route}]`);
      if (res.statusCode && res.statusCode >= 400) {
        let err = "";
        res.on("data", (c) => (err += c));
        res.on("end", () =>
          output.appendLine(`Error ${res.statusCode}: ${err.slice(0, 500)}`)
        );
        return;
      }
      let buf = "";
      res.on("data", (chunk) => {
        buf += chunk.toString();
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const data = t.slice(5).trim();
          if (data === "[DONE]") {
            output.append("\n");
            return;
          }
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (delta) output.append(delta);
          } catch {
            /* ignore partial frames */
          }
        }
      });
      res.on("end", () => output.append("\n"));
    }
  );
  req.on("error", (e) =>
    output.appendLine(`Cannot reach gateway at ${url}: ${e.message}`)
  );
  req.write(body);
  req.end();
}
