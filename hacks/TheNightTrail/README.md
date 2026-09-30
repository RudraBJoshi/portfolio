# The Night Trail

An Oregon Trail-inspired browser game, following Dr. Suresh, his mother Dadi, and his twin children Amil and Nisha as they leave Mirpur Khas in August 1947 and cross the Thar Desert by night — the historical Sindhi refugee route through Umerkot and the Khokhrapar–Munabao border crossing to Barmer and Jodhpur. Plain HTML/CSS/JS, no build step.

This is a fictionalized, respectful take on a real historical migration during the Partition of India, inspired in part by Veera Hiranandani's novel *The Night Diary*. The focus is on the hardship and resilience of the journey itself (heat, water, illness, lost supplies), not violence.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Structure

- `index.html` — screens: title, setup, outfitting, trail, event modal, end
- `css/style.css` — night-sky theme
- `js/data.js` — occupations, supply weights, landmarks, random events, ration/pace tables, the family roster
- `js/game.js` — game state and screen logic

## The packing mechanic

There's no money — outfitting is gated purely by weight. Each of the 4 satchels holds `SATCHEL_CAPACITY` (20 lbs), for `TOTAL_CAPACITY` of 80 lbs, plus a small `capacityBonus` from the chosen occupation. Every supply item in `SUPPLY_ITEMS` has a `weight` in real pounds per unit (water and lantern oil are heavier per unit than food or repair cloth); the +1/+10 and −1/−10 buttons on the outfitting screen are capped by remaining weight, not budget, so packing is a real trade-off between food, water, medicine, repair cloth, and lantern oil.

## Health and susceptibility

`PARTY_TEMPLATE` in `data.js` gives each family member a `susceptibility` multiplier (Dadi 1.6, Amil 1.3, Suresh and Nisha 1.0). `damagePartyHealth(amount, { illness })` in `game.js` applies a random per-person variance on every hit, and multiplies by `susceptibility` when `illness: true` is passed (currently: the fever event and food-shortage damage) — so sickness doesn't hit the whole family evenly, and members don't all decline or die on the same day.

## Extending

- Add events to `RANDOM_EVENTS` in `data.js`; each needs a `title`, `body`, and `choices` array (each choice can have a `requires` inventory check and an `apply(state)` function — pass `{ illness: true }` to `damagePartyHealth` for disease-like harm so Dadi and Amil take it harder).
- Add landmarks to `LANDMARKS` (sorted by `miles`).
- Add supplies to `SUPPLY_ITEMS` with a `weight`; they show up automatically on the outfitting screen.
- The family roster is `PARTY_TEMPLATE` in `data.js` — edit names/susceptibility there rather than in `depart()`.
