# Publishing to the VS Code Marketplace

The extension is marketplace-ready (icon, manifest, README, LICENSE). What's left needs a
Microsoft/Azure account — these steps are done once.

## 1. Create the publisher
The `publisher` in `package.json` is **`axonate`** — that exact publisher ID must exist and be
yours.

1. Sign in at <https://marketplace.visualstudio.com/manage> with a Microsoft account.
2. **Create publisher** → ID `axonate`, display name `Axonate`. (If `axonate` is taken, pick a
   new ID and update `"publisher"` in `package.json` to match.)

## 2. Get a Personal Access Token (PAT)
1. Go to <https://dev.azure.com> (create an organization if prompted — name doesn't matter).
2. User settings → **Personal Access Tokens** → **New Token**.
3. Organization: **All accessible organizations**. Scopes: **Custom defined** →
   **Marketplace → Manage**. Create, copy the token.

## 3. Publish

### Manual (first time)
```bash
npm install
npm run package                     # builds axonate-0.1.0.vsix
npx vsce login axonate              # paste the PAT
npx vsce publish                    # or: vsce publish minor / patch to bump
```
Live in a few minutes at `https://marketplace.visualstudio.com/items?itemName=axonate.axonate`.

### Or upload the .vsix by hand
On the Manage page → your publisher → **New extension → Visual Studio Code** → upload the
`.vsix` from `npm run package`.

## 4. Automated releases (optional)
A workflow at `.github/workflows/publish.yml` publishes on every `v*` tag. Add the PAT as a repo
secret first:

```bash
gh secret set VSCE_PAT --repo Axonate/vscode      # paste the PAT
git tag v0.1.0 && git push origin v0.1.0          # triggers publish
```

## Updating later
Bump the version (`npm run package` reads `package.json`), then `vsce publish patch|minor|major`
or push a new `v*` tag. Each version must be unique.

## Open VSX (optional)
For Cursor / VSCodium / Gitpod users, also publish to <https://open-vsx.org>:
`npx ovsx publish -p <openvsx-token>`.
