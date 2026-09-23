# AGENTS.md — read this first every session

This repo belongs to a small team of coders (customer side and salon side). Every opencode session MUST read the project's source of truth first:

## 1. Read CONTEXT.md BEFORE doing anything
- `CONTEXT.md` holds the full project history, current status, decisions, and the session log. It is updated at the end of every session.
- Open `CONTEXT.md` and read it at the start of every session so you know what has been built, what state things are in, and what the next steps are.

## 2. Before every edit/push (MUST)
- Run `git status` to check for uncommitted local work first.
- Run `git pull --rebase origin main` before starting any edits.
- After finishing a session's edits, keep the repo tidy: if the user asks to save, commit with a clear message and `git push origin main`.
- On merge conflict: show both versions and ask the user which to keep.

## 3. How to run
- `npm install` once, then `npm run dev` for local development, `npm run build` to verify a production build.
- Customer app: `http://localhost:5173/#/`, salon owner: `#/salon`, admin: `#/admin`.