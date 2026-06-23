<div align="center">

# Axonate for VS Code

### Chat with your team's [Axonate](https://github.com/Axonate/axonate) gateway — one key, every model.

![vscode](https://img.shields.io/badge/VS%20Code-1.85%2B-007ACC?logo=visualstudiocode&logoColor=white)
![license](https://img.shields.io/badge/license-MIT-green)

</div>

Send prompts (and code selections) to your shared Axonate gateway and stream the reply right in
the editor. Built for small teams sharing a few AI subscriptions instead of paying per seat.

## Features
- **Axonate: Ask** — prompt from the Command Palette.
- **Axonate: Ask about selection** — right-click selected code, ask about it (language-aware).
- Streamed replies in the Axonate output panel, with the chosen route shown (`[route: codex]`).
- `auto` routing, or pin a model. Per-user budget + trace apply on the gateway side.

## Settings
| Setting | Default | Description |
|---|---|---|
| `axonate.url` | `http://127.0.0.1:4100` | gateway base URL |
| `axonate.apiKey` | — | your virtual key (Bearer token) |
| `axonate.model` | `auto` | `auto` / `claude` / `codex` / `minimax` |

## Develop / run locally
```bash
npm install
npm run compile
# press F5 in VS Code to launch the Extension Development Host
```

## Package
```bash
npm run package        # produces axonate-0.1.0.vsix
code --install-extension axonate-0.1.0.vsix
```

Don't have a gateway yet? Set one up: [Axonate/axonate](https://github.com/Axonate/axonate) ·
Docs: [Axonate/docs](https://github.com/Axonate/docs).

## License
[MIT](LICENSE) © CloudDrove
