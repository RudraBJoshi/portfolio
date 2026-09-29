const OCCUPATIONS = [
  { id: "farmer",   name: "Farmer",       money: 500,  desc: "Land and livestock left behind. Little cash saved." },
  { id: "trader",   name: "Cloth Trader", money: 900,  desc: "A shop in Mirpur Khas, sold in haste. Modest savings." },
  { id: "teacher",  name: "Schoolteacher",money: 650,  desc: "Respected in town, but teachers were never rich." },
];

const SUPPLY_ITEMS = [
  { id: "food",    name: "Food",        unit: "lbs",     price: 0.20 },
  { id: "water",   name: "Water",       unit: "jars",    price: 0.35 },
  { id: "medicine",name: "Medicine",    unit: "kits",    price: 5.00 },
  { id: "parts",   name: "Repair Cloth",unit: "sets",    price: 8.00 },
  { id: "lantern", name: "Lantern Oil", unit: "flasks",  price: 1.50 },
];

const LANDMARKS = [
  { name: "Mirpur Khas", miles: 0 },
  { name: "Umerkot",     miles: 25 },
  { name: "Khokhrapar",  miles: 95 },
  { name: "Munabao — the border", miles: 100 },
  { name: "Barmer",      miles: 165 },
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
      { label: "Keep your distance and move on", apply: (s) => { s.damagePartyHealth(8); s.log("The illness spreads before you can outrun it.", "bad"); } },
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
      { label: "Draw water and thank them", apply: (s) => { const w = 4 + Math.floor(Math.random() * 6); const f = 5 + Math.floor(Math.random() * 10); s.inventory.water += w; s.inventory.food += f; s.log(`They fill your jars and share what food they can spare. +${w} water, +${f} lbs food.`, "good"); } },
      { label: "Take only what you need and move on quickly", apply: (s) => { const w = 2; s.inventory.water += w; s.log(`You draw a little water and keep moving. +${w} water.`, "good"); } },
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
];

const RATION_LEVELS = {
  filling: { label: "Filling", foodPerPerson: 3, healthDelta: 1 },
  meager:  { label: "Meager",  foodPerPerson: 2, healthDelta: 0 },
  bare:    { label: "Bare Bones", foodPerPerson: 1, healthDelta: -2 },
};

const PACE_LEVELS = {
  slow:    { label: "Slow",    milesPerDay: 8,  healthDelta: 1 },
  steady:  { label: "Steady",  milesPerDay: 14, healthDelta: 0 },
  grueling:{ label: "Grueling",milesPerDay: 22, healthDelta: -2 },
};

const BORDER_LANDMARK_NAME = "Munabao — the border";

const MAP_WAYPOINTS = [
  { miles: 0,   x: 0.252, y: 0.418 },
  { miles: 25,  x: 0.294, y: 0.400 },
  { miles: TOTAL_MILES, x: 0.388, y: 0.356 },
];
