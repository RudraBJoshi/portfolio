# The Night Trail

An Oregon Trail-inspired browser game, following Dr. Suresh, his mother Dadi, and his twin children Amil and Nisha as they leave Mirpur Khas in August 1947 and cross the Thar Desert by night — the historical Sindhi refugee route through Umerkot and the Khokhrapar–Munabao border crossing to Barmer and Jodhpur. Plain HTML/CSS/JS, no build step.

This is a fictionalized, respectful take on a real historical migration during the Partition of India, inspired in part by Veera Hiranandani's novel *The Night Diary*. The focus is on the hardship and resilience of the journey itself (heat, water, illness, lost supplies), not violence.

## Ethnic Studies frameworks applied

Two frameworks are deliberately applied throughout and labeled in-game (a gold badge on the relevant intro slide, random event, or ending — see `.study-tag` in `css/style.css`, and the `tag` field on events/slides in `data.js`/`game.js`): the **Four I's of Oppression** (Ideological, Institutional, Interpersonal, Internalized) and the **ESPSP** (Ethnic Studies Praxis Story Plot — Expose the Problem, Oppressive Action, Trauma/Tension, Taking Action/Resistance/Healing, Revolution and Reflection). Two earlier working terms, **Breaking Point** and **Resistance & Revolution**, are kept alongside the official labels rather than replaced, since both frameworks are meant to layer, not compete.

| In-game moment | Tag shown |
|---|---|
| Intro slide: "A Line Is Drawn" (Britain's decision to partition) | Institutional Oppression · Expose the Problem |
| Intro slide: "An Idea Worth Killing For" (the two-nation theory itself) | Ideological Oppression |
| Intro slide: "A Choice" (Suresh decides to flee) | Breaking Point |
| Random event: "A Crowd at the Crossroads" | Oppressive Action |
| Random event: "The Last Train to Jodhpur" (fires once, at Barmer) | Breaking Point · Oppressive Action |
| One-time event: "A Knife in the Dark" (a Muslim man attacks Nisha in revenge for his family's death) | Interpersonal Oppression · Breaking Point · Internalized Oppression · Trauma/Tension |
| Win ending | Resistance & Revolution · Taking Action/Resistance/Healing · Revolution and Reflection |

The knife event is also where Internalized Oppression becomes mechanical, not just narrative: it permanently raises Nisha's `susceptibility` (`KNIFE_EVENT_SUSCEPTIBILITY_INCREASE` in `data.js`), and if you're playing as her, every later event's socially-engaged choice (helping a stranger, talking a crowd down) is locked out for the rest of the game — see `nishaLocked()` and the `social: true` flag on choices in `game.js`. She isn't just written as unable to speak afterward; she mechanically can't.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Structure

- `index.html` — screens: title, setup, outfitting, trail, event modal, end
- `css/style.css` — night-sky theme
- `js/data.js` — playable characters/difficulty, supply weights, landmarks, random events, ration/pace tables, the family roster
- `js/game.js` — game state and screen logic

## Choosing a character (difficulty select)

The whole family always travels together — choosing a character on the setup screen picks whose eyes you see the journey through, and sets the run's difficulty via `CHARACTERS` in `data.js`: Suresh (Easy, `damageMultiplier` 0.7), Nisha (Medium, 1.0), Amil (Medium-Hard, 1.2), Dadi (Hard, 1.5). That multiplier scales every point of harmful damage the whole family takes (`damagePartyHealth` in `game.js`, only applied when `amount > 0` so it never weakens healing). Each character also has a `capacityBonus` (Suresh +8 lbs down to Dadi −6 lbs) added to the satchel weight budget.

## The packing mechanic

There's no money — outfitting is gated purely by weight. The 4 satchels hold uneven amounts, set by `SATCHEL_CAPACITIES` in `data.js` — `[135, 50, 50, 15]` lbs (Satchel 1 is the main adult-sized pack, 2-3 are the twins' bags, 4 is what Dadi alone can manage), summing to a `TOTAL_CAPACITY` of 250 lbs, plus the chosen character's `capacityBonus`. That bonus is applied to the satchel the played character actually carries — each entry in `CHARACTERS` has a `satchelIndex` (Suresh: 0, Amil: 1, Nisha: 2, Dadi: 3) — so picking Dadi shrinks her own small Satchel 4 rather than Suresh's main pack, and every character's buff/nerf is self-consistent the same way. Every supply item in `SUPPLY_ITEMS` has a `weight` in real pounds per unit (water and lantern oil are heavier per unit than food or repair cloth); the +1/+10 and −1/−10 buttons on the outfitting screen are capped by remaining weight, not budget, so packing is a real trade-off between food, water, medicine, repair cloth, and lantern oil. The packing visualization (`renderSatchelVisual` in `game.js`) fills each satchel in order and scales each bar's height to its real capacity, so Satchel 4 visibly looks like the small bag it is.

## Health and susceptibility

`PARTY_TEMPLATE` in `data.js` gives each family member a `susceptibility` multiplier (Dadi 1.6, Amil 1.3, Suresh and Nisha 1.0) — this stacks with the chosen character's difficulty multiplier above. `damagePartyHealth(amount, { illness })` in `game.js` applies a random per-person variance on every hit, and multiplies by `susceptibility` when `illness: true` is passed (currently: the fever event and food-shortage damage) — so sickness doesn't hit the whole family evenly, and members don't all decline or die on the same day.

Whichever character you're playing as is the one that matters: `playedCharacterDied()` in `game.js` checks specifically for that member (matched by name against `state.character`), and ends the game the moment they die — even if the rest of the family is still alive. If someone else dies, the journey continues; the game only ends outright when either the played character or the whole family is gone.

## Extending

- Add events to `RANDOM_EVENTS` in `data.js`; each needs a `title`, `body`, and `choices` array (each choice can have a `requires` inventory check and an `apply(state)` function — pass `{ illness: true }` to `damagePartyHealth` for disease-like harm so Dadi and Amil take it harder).
- Add landmarks to `LANDMARKS` (sorted by `miles`).
- Add supplies to `SUPPLY_ITEMS` with a `weight`; they show up automatically on the outfitting screen.
- The family roster is `PARTY_TEMPLATE` in `data.js` — edit names/susceptibility there rather than in `depart()`. Playable characters/difficulty live separately in `CHARACTERS`.
