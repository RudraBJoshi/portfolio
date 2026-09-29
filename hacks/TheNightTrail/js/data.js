const OCCUPATIONS = [
  { id: "guide",    name: "Night Guide",    money: 400, desc: "Knows the safe paths. Less starting cash." },
  { id: "farmer",   name: "Farmer",         money: 700, desc: "Steady and thrifty. Average cash." },
  { id: "merchant", name: "Merchant",       money: 1200, desc: "Deep pockets, less trail experience." },
];

const SUPPLY_ITEMS = [
  { id: "food",    name: "Food",        unit: "lbs",     price: 0.20 },
  { id: "ammo",    name: "Ammunition",  unit: "boxes",   price: 2.00 },
  { id: "medicine",name: "Medicine",    unit: "kits",    price: 5.00 },
  { id: "parts",   name: "Spare Parts", unit: "sets",    price: 8.00 },
  { id: "lantern", name: "Lantern Oil", unit: "flasks",  price: 1.50 },
];

const LANDMARKS = [
  { name: "Riverside Camp",   miles: 0 },
  { name: "Hollow Creek",     miles: 180 },
  { name: "Widow's Pass",     miles: 360 },
  { name: "Blackwood Forest", miles: 540 },
  { name: "Coldstone Ridge",  miles: 720 },
  { name: "Moonlit Crossing", miles: 900 },
  { name: "The Last Ferry",   miles: 1080 },
];

const TOTAL_MILES = LANDMARKS[LANDMARKS.length - 1].miles + 120;

const RANDOM_EVENTS = [
  {
    id: "wolves",
    title: "Wolves in the Dark",
    body: "Eyes catch your lantern light at the treeline. A pack is circling the wagon.",
    choices: [
      { label: "Fire a warning shot", requires: { ammo: 1 }, apply: (s) => { s.inventory.ammo -= 1; s.log("The shot scatters them. Ammo used.", "good"); } },
      { label: "Keep the fire high and wait", apply: (s) => { s.damagePartyHealth(4); s.log("A tense night. Everyone is shaken but alive.", "bad"); } },
    ],
  },
  {
    id: "brokenAxle",
    title: "Broken Axle",
    body: "A wheel splits on a hidden rut in the dark road.",
    choices: [
      { label: "Repair with spare parts", requires: { parts: 1 }, apply: (s) => { s.inventory.parts -= 1; s.log("You patch the axle and press on.", "good"); } },
      { label: "Lash it together and go slow", apply: (s) => { s.pace = "slow"; s.log("The wagon groans but holds, at a crawl.", "bad"); } },
    ],
  },
  {
    id: "fever",
    title: "Night Fever",
    body: "One of the party wakes shivering and pale before dawn.",
    choices: [
      { label: "Use medicine", requires: { medicine: 1 }, apply: (s) => { s.inventory.medicine -= 1; s.log("The fever breaks by morning.", "good"); } },
      { label: "Push through without it", apply: (s) => { s.damagePartyHealth(10); s.log("The fever lingers, weakening the party.", "bad"); } },
    ],
  },
  {
    id: "lostTrail",
    title: "Lost the Trail",
    body: "Clouds swallow the moon and the trail markers vanish.",
    choices: [
      { label: "Burn extra lantern oil to search", requires: { lantern: 1 }, apply: (s) => { s.inventory.lantern -= 1; s.log("You find the trail again before long.", "good"); } },
      { label: "Make camp until first light", apply: (s) => { s.day += 1; s.log("A day lost waiting for sunrise.", "bad"); } },
    ],
  },
  {
    id: "goodHunt",
    title: "A Quiet Clearing",
    body: "Moonlight opens over a meadow thick with game.",
    choices: [
      { label: "Hunt for food", apply: (s) => { const gained = 20 + Math.floor(Math.random() * 30); s.inventory.food += gained; s.log(`The hunt brings in ${gained} lbs of food.`, "good"); } },
      { label: "Keep moving, no time to spare", apply: (s) => { s.log("You press on through the clearing.", "good"); } },
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
