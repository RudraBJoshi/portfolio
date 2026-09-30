const CHARACTERS = [
  {
    id: "suresh", name: "Suresh", role: "Father, the doctor", difficulty: "Easy",
    capacityBonus: 8, damageMultiplier: 0.7,
    desc: "Steady hands, calm under pressure. Years of treating the sick have hardened him against the worst the road can do. Lasts the longest.",
  },
  {
    id: "nisha", name: "Nisha", role: "Daughter", difficulty: "Medium",
    capacityBonus: 2, damageMultiplier: 1.0,
    desc: "Quiet and watchful, neither the strongest nor the frailest of the family. A balanced telling of the journey.",
  },
  {
    id: "amil", name: "Amil", role: "Son", difficulty: "Medium-Hard",
    capacityBonus: 0, damageMultiplier: 1.2,
    desc: "Restless and quick on his feet, but the road wears on him faster than it should. Weaker than Nisha, not as frail as Dadi.",
  },
  {
    id: "dadi", name: "Dadi", role: "Grandmother", difficulty: "Hard",
    capacityBonus: -6, damageMultiplier: 1.5,
    desc: "Her joints ache before the sun is even up, and she can't carry as much as the others. Every mile costs more. The hardest way to make this journey.",
  },
];

const INTRO_SLIDES = [
  {
    heading: "August 1947",
    body: "For nearly 200 years, the British ruled India. Now, after decades of struggle, that rule is finally ending.",
  },
  {
    heading: "A Line Is Drawn",
    body: "But independence comes with a price. Britain has decided to split the land in two: a new country called Pakistan for its Muslim-majority regions, and India for the rest.",
  },
  {
    heading: "Sir Cyril Radcliffe",
    body: "The border is drawn by a British lawyer who had never set foot in India before this year, working from maps in just a few weeks. It cuts through provinces, villages, and families almost overnight.",
  },
  {
    heading: "Mirpur Khas",
    body: "Mirpur Khas, in the province of Sindh, falls on the Pakistan side of the new line. For Suresh's Hindu family, the only home they have ever known now belongs to a different country.",
  },
  {
    heading: "The Largest Migration in History",
    body: "In the weeks around independence, an estimated 15 million people will cross the new border in both directions — Hindus and Sikhs moving toward India, Muslims moving toward Pakistan. Many will not survive the journey.",
  },
  {
    heading: "A Choice",
    body: "Suresh, the town's doctor, must decide: stay and hope the danger passes, or take his mother and his twin children across the Thar Desert toward safety in India.",
  },
  {
    heading: "Not by Train",
    body: "The railway would be faster. But trains have become a target for violence from every side, and word is spreading of trains that never reach their destination safely. Suresh won't risk it — the family will go on foot instead, joining a slower caravan of other families making the same journey out of Sindh.",
  },
  {
    heading: "This Is Their Story",
    body: "A short, fictionalized journey inspired by these events and by Veera Hiranandani's novel The Night Diary.",
  },
];

const SUPPLY_ITEMS = [
  { id: "food",    name: "Food",        unit: "lbs",    weight: 1 },
  { id: "water",   name: "Water",       unit: "jars",   weight: 2 },
  { id: "medicine",name: "Medicine",    unit: "kits",   weight: 1 },
  { id: "parts",   name: "Repair Cloth",unit: "sets",   weight: 0.5 },
  { id: "lantern", name: "Lantern Oil", unit: "flasks", weight: 1.5 },
];

const NUM_SATCHELS = 4;
const SATCHEL_CAPACITY = 20;
const TOTAL_CAPACITY = NUM_SATCHELS * SATCHEL_CAPACITY;

const PARTY_TEMPLATE = [
  { name: "Suresh", role: "father, the doctor", susceptibility: 1.0 },
  { name: "Dadi",   role: "grandmother",        susceptibility: 1.6 },
  { name: "Amil",   role: "son",                susceptibility: 1.3 },
  { name: "Nisha",  role: "daughter",           susceptibility: 1.0 },
];

const LANDMARKS = [
  { name: "Mirpur Khas", miles: 0 },
  { name: "Umerkot",     miles: 150 },
  { name: "Khokhrapar",  miles: 165 },
  { name: "Munabao — the border", miles: 170 },
  { name: "Barmer",      miles: 220 },
  { name: "Jodhpur",     miles: 300 },
];

const TOTAL_MILES = LANDMARKS[LANDMARKS.length - 1].miles;

const RANDOM_EVENTS = [
  {
    id: "heatstroke",
    title: "The Sun Turns Cruel",
    body: "Midday heat catches the column before shade can be found. Throats are dry and tempers short.",
    choices: [
      { label: "Share water from the jars", requires: { water: 2 }, apply: (s) => { s.inventory.water -= 2; s.log("The water holds everyone together a little longer.", "good"); } },
      { label: "Push on and ration what's left", apply: (s) => { s.damagePartyHealth(6); s.log("The heat takes its toll on the weakest among you.", "bad"); } },
    ],
  },
  {
    id: "strapTear",
    title: "A Satchel Strap Tears",
    body: "One of the satchels gives out crossing rough, rocky ground — its strap frayed thin from the weight of everything you own.",
    choices: [
      { label: "Mend it with repair cloth", requires: { parts: 1 }, apply: (s) => { s.inventory.parts -= 1; s.log("You mend the strap and keep moving.", "good"); } },
      { label: "Tie it off and go slow", apply: (s) => { s.pace = "slow"; s.log("The strap holds for now, but you walk slower, careful not to spill what's inside.", "bad"); } },
    ],
  },
  {
    id: "fever",
    title: "Sickness in the Column",
    body: "Word passes back through the column: a family further up the road has fallen ill overnight.",
    choices: [
      { label: "Share medicine", requires: { medicine: 1 }, apply: (s) => { s.inventory.medicine -= 1; s.log("The fever is caught early.", "good"); } },
      { label: "Keep your distance and move on", apply: (s) => { s.damagePartyHealth(8, { illness: true }); s.log("The illness spreads before you can outrun it.", "bad"); } },
    ],
  },
  {
    id: "dustStorm",
    title: "Dust Storm Over the Thar",
    body: "The wind rises and swallows the horizon in sand. The path forward disappears.",
    choices: [
      { label: "Burn lantern oil and press on carefully", requires: { lantern: 1 }, apply: (s) => { s.inventory.lantern -= 1; s.log("You keep the caravan together and find the road again.", "good"); } },
      { label: "Shelter until the storm passes", apply: (s) => { s.day += 1; s.log("A day lost waiting out the storm.", "bad"); } },
    ],
  },
  {
    id: "wellVillage",
    title: "A Village Well",
    body: "A village along the road opens its well to the passing families — neighbors helping strangers where they can, whatever the times.",
    choices: [
      { label: "Draw water and thank them", apply: (s) => { const w = 6 + Math.floor(Math.random() * 8); const f = 5 + Math.floor(Math.random() * 10); s.inventory.water += w; s.inventory.food += f; s.log(`They fill your jars and share what food they can spare. +${w} water, +${f} lbs food.`, "good"); } },
      { label: "Take only what you need and move on quickly", apply: (s) => { const w = 3; s.inventory.water += w; s.log(`You draw a little water and keep moving. +${w} water.`, "good"); } },
    ],
  },
  {
    id: "nightProwlers",
    title: "Prowlers at the Camp's Edge",
    body: "Shapes move beyond the firelight. Opportunists have been following caravans like this one, looking for unguarded packs.",
    choices: [
      { label: "Keep watch through the night", apply: (s) => { s.damagePartyHealth(4); s.log("Nothing is taken, but no one rests easy.", "bad"); } },
      { label: "Sleep in shifts and hope for the best", apply: (s) => { const lost = Math.min(s.inventory.food, 10 + Math.floor(Math.random() * 15)); s.inventory.food -= lost; s.log(`By morning, ${lost} lbs of food are missing from your packs.`, "bad"); } },
    ],
  },
  {
    id: "hostileCrowd",
    title: "A Crowd at the Crossroads",
    body: "Where the road narrows, a crowd has gathered, shouting at the families passing through. Fear moves down the line ahead of you like a current.",
    choices: [
      { label: "Suresh steps forward — he's tended half this district as its doctor", apply: (s) => { s.damagePartyHealth(3); s.log("A few in the crowd recognize him. Someone lowers their voice, and the line is waved through — shaken, but unhurt.", "good"); } },
      { label: "Keep your heads down and push through quickly", apply: (s) => { const lost = Math.min(s.inventory.food, 5 + Math.floor(Math.random() * 10)); s.inventory.food -= lost; s.damagePartyHealth(5); s.log(`You shoulder through the crowd. A hand grabs at a satchel before you break free — ${lost} lbs of food torn loose in the scramble.`, "bad"); } },
    ],
  },
  {
    id: "rain",
    title: "Rain Over the Desert",
    body: "Dark clouds break over the Thar — a rare desert rain drums against the satchels, and the dry ground drinks it in almost as fast as you can catch it.",
    choices: [
      { label: "Catch what you can in the jars", apply: (s) => { const w = 8 + Math.floor(Math.random() * 8); s.inventory.water += w; s.log(`You fill every jar you can before the clouds pass. +${w} water.`, "good"); } },
      { label: "Let the children rest under it a moment first", apply: (s) => { const w = 4 + Math.floor(Math.random() * 5); s.inventory.water += w; s.damagePartyHealth(-5); s.log(`A moment of relief in the rain, and a little water besides. +${w} water.`, "good"); } },
    ],
  },
  {
    id: "amilSpill",
    title: "Amil Spills the Water",
    body: "A jar slips from Amil's hands on the loose stones, and water darkens the sand before anyone can catch it. \"I'm sorry,\" he says, already scrambling after it.",
    choices: [
      { label: "Stop and salvage what you can", apply: (s) => { const lost = Math.min(s.inventory.water, 2 + Math.floor(Math.random() * 3)); s.inventory.water -= lost; s.pace = "slow"; s.log(`You save most of it, but the delay costs you — ${lost} jars are gone, and the family falls behind pace.`, "bad"); } },
      { label: "Let it go and keep moving", apply: (s) => { const lost = Math.min(s.inventory.water, 6 + Math.floor(Math.random() * 5)); s.inventory.water -= lost; s.log(`There's no time to mourn spilled water. ${lost} jars soak into the sand before you can stop them.`, "bad"); } },
    ],
  },
];

const RATION_LEVELS = {
  filling: { label: "Filling", foodPerPerson: 2,   waterPerPerson: 5, healthDelta: 1 },
  meager:  { label: "Meager",  foodPerPerson: 1.5, waterPerPerson: 4, healthDelta: 0 },
  bare:    { label: "Bare Bones", foodPerPerson: 1, waterPerPerson: 3, healthDelta: -2 },
};

const PACE_LEVELS = {
  slow:    { label: "Slow",    milesPerDay: 8,  healthDelta: 1 },
  steady:  { label: "Steady",  milesPerDay: 14, healthDelta: 0 },
  grueling:{ label: "Grueling",milesPerDay: 22, healthDelta: -2 },
};

const BORDER_LANDMARK_NAME = "Munabao — the border";
const REST_LANDMARK_NAME = "Umerkot";
const REST_DANGER_CHANCE = 0.3;

const NISHA_DANGER_EVENT = {
  title: "Nisha Is in Danger",
  body: "Nisha has slipped off to talk with a neighbor's family — Muslim friends of Rashid Uncle's. Word travels fast in a house this close to the road, and voices are rising outside.",
  choices: [
    {
      label: "Stay and wait it out",
      apply: (s) => {
        s.restBlocked = true;
        s.day += 1;
        s.damagePartyHealth(18);
        s.log("The night passes in fear rather than rest. Rashid Uncle calms the voices outside, but it costs the family dearly. There will be no more peace to find here.", "bad");
      },
    },
    {
      label: "Leave at once",
      apply: (s) => {
        s.restBlocked = true;
        s.log("You gather the satchels and slip out before the voices reach the door. No rest gained — but everyone is safe.", "good");
      },
    },
  ],
};

const WATER_PUMP_MILE = 75; // halfway between Mirpur Khas (0) and Umerkot (150)

const WATER_PUMP_EVENT = {
  title: "Fighting at the Water Pump",
  body: "A crowd has gathered around a village pump, and patience has run out. Voices turn to shoving, then worse, as families scramble for what water is left.",
  choices: [
    {
      label: "Push into the fight for water",
      apply: (s) => {
        const w = 6 + Math.floor(Math.random() * 6);
        s.damagePartyHealth(10);
        s.inventory.water += w;
        s.log(`You come away bruised, but with ${w} more jars of water than you had.`, "bad");
      },
    },
    {
      label: "Pull back and leave it",
      apply: (s) => {
        s.log("You pull the children back and keep walking. Whatever's left at that pump isn't worth the risk.", "good");
      },
    },
  ],
};

const TRAIN_LANDMARK_NAMES = ["Khokhrapar", "Munabao — the border"];

const TRAIN_EVENT = {
  title: "The Railway at the Border",
  body: "A train idles at the siding, bound across the line into India. It could carry you past the worst of this crossing in a single night — or it could be exactly the kind of train the radio warned about, back in Mirpur Khas. Half the trains get through. Half don't.",
  choices: [
    {
      label: "Risk the train",
      apply: (s) => {
        if (Math.random() < 0.5) {
          s.miles = TOTAL_MILES;
          endGame(true, "You gambled everything on the train, and it carried you clean across the border in the dark. By morning you are in Jodhpur — the rest of the journey never happened, and somehow, impossibly, you are whole.");
        } else {
          s.party.forEach((m) => { m.health = 0; });
          endGame(false, "The train never reaches the other side. What was left of the family's journey ends here, somewhere along the line, in the dark.");
        }
      },
    },
    {
      label: "Stay on foot",
      apply: (s) => {
        s.log("You watch the train pull away without you. The road continues, slower but sure, beneath your own feet.", "good");
      },
    },
  ],
};

// Pixel positions are keyed to the game's (pacing-adjusted) mile markers so the
// dot still lands on each landmark exactly when it's announced in the log, but
// Khokhrapar/Munabao/Barmer are placed along the Umerkot-to-Jodhpur line using
// their real relative distances (Umerkot->Khokhrapar ~70mi, ->Munabao ~75mi,
// ->Barmer ~140mi, ->Jodhpur ~275mi), not the rebalanced in-game mile gaps.
const MAP_WAYPOINTS = [
  { miles: 0,   x: 0.252, y: 0.418 }, // Mirpur Khas
  { miles: 150, x: 0.294, y: 0.400 }, // Umerkot
  { miles: 165, x: 0.318, y: 0.389 }, // Khokhrapar
  { miles: 170, x: 0.320, y: 0.388 }, // Munabao — the border
  { miles: 220, x: 0.342, y: 0.378 }, // Barmer
  { miles: TOTAL_MILES, x: 0.388, y: 0.356 }, // Jodhpur
];
