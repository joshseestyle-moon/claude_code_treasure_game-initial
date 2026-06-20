Deploy this project to GitHub and publish it live on GitHub Pages. Follow every step below in order.

---

## Step 1 — Install gh CLI if missing

Run:
```
which gh || (type -p curl >/dev/null || sudo apt install curl -y) && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null && sudo apt update && sudo apt install gh -y
```

Then check authentication:
```
gh auth status
```

If not authenticated, tell the user to run `! gh auth login` in the prompt and wait for them to confirm before continuing.

---

## Step 2 — Determine the repo name

Use the current folder name as the GitHub repository name. Run:
```
basename $(pwd)
```

Also get the GitHub username:
```
gh api user --jq .login
```

Save both for use in later steps.

---

## Step 3 — Initialize git if needed

Check if git is initialized:
```
git rev-parse --is-inside-work-tree 2>/dev/null || echo "not a git repo"
```

If it is not a git repo, run:
```
git init
git add .
git commit -m "Initial commit"
```

If it already is a git repo with uncommitted changes, commit them:
```
git add .
git commit -m "Prepare for deployment" --allow-empty
```

---

## Step 4 — Configure Vite base path for GitHub Pages

Edit `vite.config.ts`. Add a `base` field set to `'/<REPO_NAME>/'` inside `defineConfig`. For example, if the repo name is `my-app`, the config should include:
```ts
base: '/my-app/',
```

Place it at the top level of the `defineConfig({...})` object, before `plugins`.

---

## Step 5 — Install gh-pages and update package.json scripts

Run:
```
npm install --save-dev gh-pages
```

Then edit `package.json` to add these two scripts inside the `"scripts"` object:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

---

## Step 6 — Create the GitHub repository and push

Run:
```
gh repo create <REPO_NAME> --public --source=. --remote=origin --push
```

If the remote already exists, just push:
```
git push -u origin main
```

---

## Step 7 — Deploy to GitHub Pages

Run:
```
npm run deploy
```

This builds the project and pushes the `build/` output to the `gh-pages` branch.

---

## Step 8 — Enable GitHub Pages on the repository

Run:
```
gh api repos/<GITHUB_USERNAME>/<REPO_NAME>/pages \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  -f "source[branch]=gh-pages" \
  -f "source[path]=/"
```

If the Pages setting already exists, skip this step (the command will return a 409 error — that is fine).

---

## Step 9 — Report the live URL

The deployed URL will be:
```
https://<GITHUB_USERNAME>.github.io/<REPO_NAME>/
```

Tell the user this URL. Note that GitHub Pages can take 1–3 minutes to go live after the first deploy. They can also check the deployment status at:
```
https://github.com/<GITHUB_USERNAME>/<REPO_NAME>/actions
```
