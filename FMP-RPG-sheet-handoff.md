# FMP RPG Character Sheet: Project Handoff

Paste or upload this file at the start of the new chat, together with the three project files (`index.html`, `style.css`, `script.js`) and `logo.png`. The new chat cannot see the old one or the code, so it needs them.

## About the user
- Only knows Raylib. Beginner at HTML, CSS and JavaScript. Uses Visual Studio Code with the Live Server extension.
- Wants to build a character sheet maker for **French Maid Planet (FMP)**, a tabletop RPG, so players can fill sheets in a browser, add a portrait image, print to PDF and save as PNG.
- A friend will host the site. It is a static site (no server, no database).

## Preferences to follow
- Never use em dashes.
- Give scripts as downloadable files, not pasted walls of code.
- For fixes, give small edits in the form "find this line, replace with this". Do not resend whole files.
- Ask before writing big code files.
- Discuss first when the user says "don't make changes yet".
- Give one step at a time. Explain briefly why something happens.
- Godot preference (inspector and signals over pure code) does not apply to this web project.

## What exists now
A single, finished **Amazons** character sheet, working and polished.

Project folder is named `FMP-RPG-sheet`:
- `index.html`: structure of the sheet.
- `style.css`: all styling, including print rules.
- `script.js`: behavior.
- `logo.png`: the FMP logo (transparent background, black and white).

### Features that work
- Text fields: name, species, branch, motivation, flaws.
- Six stats in a 3 by 2 block (Weapon/Rally, Evasion/Strength, Strategy/Willpower), with black connecting bars.
- 20 skill checkboxes, generated from a `SKILLS` array in `script.js`.
- Portrait box on the right: click to choose or drag and drop. Images are shrunk to 1000px max and painted on a white background so transparent PNGs do not turn black.
- Equipment and Items text areas, Adversity Tokens field.
- **Autosave** in the browser (`localStorage`, key `fmp-amazon-sheet`). Saves on every input.
- Toolbar buttons (all caps): **New Character**, **Print as PDF**, **Save as PNG**.
- Print fits on one letter page (`@page` letter, sheet zoomed to 0.92 in print).
- Logo is centered on the page, absolutely positioned near the top, not part of the grid.

### Removed on purpose
- Save to file and Load from file buttons (deleted at the user's request). Autosave is now the only way a character persists, plus the PNG.
- Decorative top frills (tried, then scrapped). `frill.png` is unused and can be deleted.

## Technical notes worth knowing
- **Fonts:** Oswald from Google Fonts. The user owns Flama Condensed but is not licensing it for web, so Oswald stays.
- **CSS variables** at the top of `style.css`: `--ink`, `--paper`, `--desk`, `--border`, `--font`, `--stat-h`, `--stat-gap`.
- **Layout:** `.sheet` is a CSS grid with areas `logo/title` on top and `left/right` below. `.left` is a flex column with `space-between` so identity, stats and skills spread out.
- **Every input inside `.sheet` has a unique `id`.** The collect and apply functions use those ids to save and restore, so new fields need an `id` and must live inside `.sheet`.
- **PNG export** uses html2canvas (loaded from cdnjs). It renders custom-styled controls badly, so the export code uses an `onclone` step to swap stat inputs for `.num-box` divs and checkboxes for `.fake-check` spans in the captured copy only. The `.exporting` class hides placeholders and the portrait hint.
- **PNG export only works over http, not file://.** The user must open the page with Live Server, or it shows "Could not create the PNG." This is not an issue once hosted.
- **Autosave is tied to the page address**, so `file:///` and `http://127.0.0.1:5500` do not share saved data.
- **Formatter caveat:** VS Code reformats code on save, for example `.stat input + input` can become `.stat input+input`. If a find and replace edit does not match, search for a shorter part of the line.
- Fixed earlier: white notches in the black bars (square corners on stat inputs, label backing removed, bar heights adjusted).

## What the user wants next
Expand into a **multi-sheet site**:
- `index.html` becomes a **home page** with the FMP logo and a choice of sheets: **Amazons, Maids, FMP, Civilians**.
- The current sheet moves to `amazons.html`. Each new sheet gets its own page (`maids.html`, `civilians.html`, and so on).
- Shared pieces (`style.css`, `script.js`, logo, fonts) stay shared where possible, so fixes to print and PNG export apply everywhere.
- Each sheet needs its own autosave key, so sheets do not overwrite each other.
- Ideas proposed: a "Back to home" button on each sheet (hidden in print and PNG), and card-style choices on the home page.

### Open questions and first steps
1. The user needs to provide the **blank paper sheets for Maids, FMP and Civilians** (like the Amazons one they started with). Look at how different each layout is before planning.
2. Decide how to share code: one shared `script.js` configured per page (for example, skills list and save key defined per page), versus separate scripts per sheet.
3. Discuss the plan with the user before writing any big files.
4. Later idea: bring back Save to file and Load from file, or a roster of several characters, if players need to keep more than one character per sheet type.
5. Check the logo licensing before the site goes public.
