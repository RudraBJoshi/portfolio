# The Night Trail

An Oregon Trail-inspired browser game, played as a night journey instead of a day one. Plain HTML/CSS/JS, no build step.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Structure

- `index.html` — screens: title, setup, outfitting, trail, event modal, end
- `css/style.css` — night-sky theme
- `js/data.js` — occupations, supply prices, landmarks, random events, ration/pace tables
- `js/game.js` — game state and screen logic

## Extending

- Add events to `RANDOM_EVENTS` in `data.js`; each needs a `title`, `body`, and `choices` array (each choice can have a `requires` inventory check and an `apply(state)` function).
- Add landmarks to `LANDMARKS` (sorted by `miles`).
- Add supplies to `SUPPLY_ITEMS`; they show up automatically on the outfitting screen.
- Party size is currently fixed at 3 in `depart()` in `game.js` — replace the placeholder traveler names with a real party-setup screen if you want named/custom party members.
