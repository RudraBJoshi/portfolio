# The Night Trail

An Oregon Trail-inspired browser game. A family leaves Mirpur Khas in August 1947 and crosses the Thar Desert by night, following the historical Sindhi refugee route through Umerkot and the Khokhrapar–Munabao border crossing to Barmer and Jodhpur. Plain HTML/CSS/JS, no build step.

This is a fictionalized, respectful take on a real historical migration during the Partition of India — the focus is on the hardship and resilience of the journey itself (heat, water, illness, lost supplies), not violence.

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
- Family size is currently fixed at 3 in `depart()` in `game.js` — replace the placeholder names with a real party-setup screen if you want named/custom family members.
