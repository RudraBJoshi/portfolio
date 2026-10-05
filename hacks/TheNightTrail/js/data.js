// Shown once, before INTRO_SLIDES, to first-time visitors only (gated by a
// cookie, see getCookie/setCookie in game.js). Pure mechanics, no study tags.
const TUTORIAL_SLIDES = [
  {
    heading: "Before You Begin",
    body: "The Night Trail is a short survival journey, not a puzzle with one right answer. Every choice costs something, the goal is getting your family through with as little lost as possible, not finding a way to lose nothing.",
  },
  {
    heading: "Choosing Who You Play",
    body: "On the next screen you'll pick one family member to see the journey through. That choice sets the run's difficulty, some characters take more damage from hardship than others, and a couple have their own extra struggles baked in. Whichever one you play, if they die, the journey ends, even if the rest of the family is still alive.",
  },
  {
    heading: "Packing the Satchels",
    body: "Before you set out, you'll pack four satchels with food, water, medicine, repair cloth, and lantern oil, all under a strict weight limit. There's no money and no restocking later, so what you leave behind, you leave behind for good.",
  },
  {
    heading: "Rations and Pace",
    body: "On the road, you can change how much your family eats and drinks, and how fast you travel. Richer rations and a slower pace cost more in supplies and time; moving fast and eating light gets you there sooner but wears everyone down. Running out of food or water outright hurts far worse than rationing carefully.",
  },
  {
    heading: "When Trouble Finds You",
    body: "Random events will interrupt the road, sickness, theft, storms, people who need help. Many choices are gated by what you packed: no medicine on hand means you can't always take the safer option. Choose carefully, this is a story about Partition, and not every hardship has a clean way out.",
  },
];

// satchelIndex ties each character's capacityBonus to the satchel they
// themselves carry (see SATCHEL_CAPACITIES below), not always Satchel 1, // so Dadi's penalty shrinks her own small bag, not Suresh's main pack.
const CHARACTERS = [
  {
    id: "suresh", name: "Suresh", role: "Father, the doctor", difficulty: "Easy",
    capacityBonus: 8, damageMultiplier: 1.0, satchelIndex: 0,
    desc: "Steady hands, calm under pressure. Years of treating the sick have hardened him against the worst the road can do. Lasts the longest.",
  },
  {
    id: "nisha", name: "Nisha", role: "Daughter", difficulty: "Medium",
    capacityBonus: 2, damageMultiplier: 1.15, satchelIndex: 2,
    desc: "Quiet and watchful, neither the strongest nor the frailest of the family. A balanced telling of the journey. She has packed Kazi's stone mortar, less room for supplies, but she knows how to use it to catch rain.",
  },
  {
    id: "amil", name: "Amil", role: "Son", difficulty: "Medium-Hard",
    capacityBonus: 0, damageMultiplier: 1.35, satchelIndex: 1,
    desc: "Restless and quick on his feet, but the road wears on him faster than it should. Weaker than Nisha, not as frail as Dadi.",
  },
  {
    id: "dadi", name: "Dadi", role: "Grandmother", difficulty: "Hard",
    capacityBonus: -6, damageMultiplier: 1.5, satchelIndex: 3,
    desc: "Her joints ache before the sun is even up, and she can't carry as much as the others. Every mile costs more. The hardest way to make this journey.",
  },
];

const INTRO_SLIDES = [
  {
    heading: "August 1947",
    date: "Mirpur Khas, August 1947",
    body: "For nearly two hundred years the British have ruled India. Now, after so many years of struggle, that rule is finally ending. Papa says it should feel like a celebration. Mostly it feels like something is about to break.",
  },
  {
    heading: "A Line Is Drawn",
    date: "Mirpur Khas, August 1947",
    tag: "Institutional Oppression · Expose the Problem · The System Exposed",
    body: "Independence comes with a price. The British have decided to split the land in two: Pakistan for the Muslim-majority regions, and India for the rest. Papa says governments made this decision, not the families who will have to live with it. The Indian Independence Act, passed by the British Parliament, directly caused the division into two countries (Britannica School, “Partition of India”; Congressional Research Service, IF13000).",
  },
  {
    heading: "An Idea Worth Killing For",
    date: "Mirpur Khas, August 1947",
    tag: "Ideological Oppression · The System Exposed",
    body: "Papa says the idea behind the line is simple: Hindus, Sikhs, and Muslims cannot safely share one country, so each needs a nation of its own with no room for the others. Our neighbours are turning into enemies. In the villages and poor districts along the new border, people are killing each other for what they are, not for anything they have done.",
  },
  {
    heading: "Sir Cyril Radcliffe",
    date: "Mirpur Khas, August 1947",
    body: "Papa read in the newspaper that the border was drawn by a British lawyer who had never set foot in India before this year. He worked from maps, in just a few weeks. The line cuts through provinces, villages, and families almost overnight. Nobody asked us.",
  },
  {
    heading: "Mirpur Khas",
    date: "Mirpur Khas, August 1947",
    body: "Mirpur Khas is in Sindh, and Sindh is now on the Pakistan side of the new line. This is the only home I have ever known, and now it belongs to a different country.",
  },
  {
    heading: "The Largest Migration in History",
    date: "Mirpur Khas, August 1947",
    body: "Papa says about 15 million people will cross the new border in both directions. Hindus and Sikhs are moving toward India, and Muslims toward Pakistan. Many will not survive the journey.",
  },
  {
    heading: "A Choice",
    date: "Mirpur Khas, August 1947",
    tag: "Breaking Point",
    body: "Papa has to decide: stay and hope the danger passes, or take Dadi, Amil, and me across the Thar Desert toward India. There is no choice that feels safe. Staying is a risk. Leaving home may be a bigger one.",
  },
  {
    heading: "Not by Train",
    date: "Mirpur Khas, August 1947",
    body: "The railway would be faster, but trains have become targets for violence from every side, and word is spreading about trains that never reach their destination. Papa won’t risk it. We will walk, joining a slow caravan of families leaving Sindh.",
  },
  {
    heading: "This Is Their Story",
    body: "This is a short, fictional story about one family’s journey, inspired by these events and by Veera Hiranandani’s novel The Night Diary. The journey that follows is seen through the eyes of the family member you choose.",
  },
];

// Reachable from the end screen ("What Came After"), not forced, the
// historical line doesn't close when the game does. Covers Partition's
// aftermath only; Partition itself is the main game, not repeated here.
const EPILOGUE_SLIDES = [
  {
    heading: "1947: The First War",
    date: "1947",
    tag: "Revolution and Reflection · Mirror to Society",
    body: "Only months after we crossed, India and Pakistan are at war over Kashmir, a princely state neither side will let go of (Britannica, “Kashmir”). The same two-nation idea that drew our line now draws soldiers to a mountain border. The violence of Partition did not end at the crossing. It became policy, then army, then war.",
  },
  {
    heading: "1965: The Second War",
    date: "1965",
    tag: "Revolution and Reflection · Mirror to Society",
    body: "Eighteen years later, the two countries are at war again, still over Kashmir and still over the same line. A ceasefire is brokered, and a peace agreement is signed in Tashkent (Britannica, “Tashkent Declaration”). It holds for a while, then it doesn’t. The idea that split a subcontinent into us and them has outlived the generation that walked through Partition.",
  },
  {
    heading: "1999: Kargil",
    date: "1999",
    tag: "Revolution and Reflection · Mirror to Society",
    body: "By 1999 both India and Pakistan possess nuclear weapons. That summer, fighting breaks out in the mountains above Kargil (Britannica, “Kargil War”). Ordinary soldiers, following orders, die over high, cold ground for a line drawn by people long dead. The ideology of 1947 is no longer even argued over. It has become simply how things are, worth any cost to defend.",
  },
  {
    heading: "2025: Operation Sindoor",
    date: "2025",
    tag: "Revolution and Reflection · Mirror to Society",
    body: "In April 2025, 26 civilians were killed in an attack on tourists in the Baisaran Valley near Pahalgam, Jammu and Kashmir (Al Jazeera, April 2025). India attributed the attack to terrorists, and in May it struck alleged terrorist targets inside Pakistan. The operation takes its name from sindoor, the red vermilion worn by married Hindu women, for the wives the attack suddenly widowed. Violence becomes retaliation becomes, again, a ceasefire within days. The pattern set in August 1947 repeats itself, smaller each time, never finished.",
  },
  {
    heading: "A Line That Hasn't Closed",
    date: "Years later",
    tag: "Revolution and Reflection · Mirror to Society",
    body: "More than seventy-five years after Partition, the border that sent us walking into the Thar Desert by night is still being fought over, still being crossed, still ending lives on both sides. The ideology that justified one line has justified every war since. This is one family’s story, fictional and small. In one form or another, it happened to millions, and the oppression Partition set in motion, ideological, institutional, interpersonal, and the quiet internalized kind, never fully closed the line it drew.",
  },
];

const CITATIONS = [
  "Encyclopaedia Britannica, School Edition. “Partition of India.” https://school.eb.com/levels/high/article/partition-of-India/640159",
  "Congressional Research Service. IF13000. https://www.congress.gov/crs-product/IF13000",
  "Encyclopaedia Britannica. “Kashmir.” https://www.britannica.com/place/Kashmir-region-Indian-subcontinent/The-Kashmir-problem",
  "Encyclopaedia Britannica. “Tashkent Declaration (1966).” https://www.britannica.com/event/Tashkent-Agreement",
  "Encyclopaedia Britannica. “Kargil War (1999).” https://www.britannica.com/event/Kargil-War",
  "Al Jazeera. “‘Act of war’: What happened in Kashmir attack that killed 26 tourists?” April 23, 2025. https://www.aljazeera.com/news/2025/4/23/act-of-war-what-happened-in-kashmir-attack-that-killed-26-tourists",
  "Hiranandani, Veera. The Night Diary.",
];

const SUPPLY_ITEMS = [
  { id: "food",    name: "Food",        unit: "lbs",    weight: 1 },
  { id: "water",   name: "Water",       unit: "jars",   weight: 2 },
  { id: "medicine",name: "Medicine",    unit: "kits",   weight: 1 },
  { id: "parts",   name: "Repair Cloth",unit: "sets",   weight: 0.5 },
  { id: "lantern", name: "Lantern Oil", unit: "flasks", weight: 1.5 },
];

// Uneven on purpose: Satchel 1 is the main adult-sized pack, Satchels 2-3 are
// the twins' bags, and Satchel 4 is what Dadi alone can manage.
const SATCHEL_CAPACITIES = [115, 50, 50, 15];
const TOTAL_CAPACITY = SATCHEL_CAPACITIES.reduce((sum, c) => sum + c, 0);

// Playing as Nisha, she carries Kazi's stone mortar in her own satchel, // less room for supplies, but it lets her catch extra water when it rains.
const KAZI_MORTAR_WEIGHT = 3;
const KAZI_MORTAR_RAIN_BONUS = 3;

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
  { name: "Munabao, the border", miles: 170 },
  { name: "Barmer",      miles: 220 },
  { name: "Jodhpur",     miles: 300 },
];

const TOTAL_MILES = LANDMARKS[LANDMARKS.length - 1].miles;

const HELP_REWARD_CHANCE = 0.15;

// Her forced slow pace takes about half again as many days as the others, so
// she starts with a little extra food on top of what she packs.
const DADI_STARTING_FOOD = 15;

// Character-specific event weighting, stacking on top of their stat nerfs
// (damageMultiplier/capacityBonus/susceptibility) rather than replacing them.
// Each has a "party" weight (applies whenever that member is alive, no matter
// who you're playing as, they're just frailer) and a steeper "played" weight
// for when you're specifically living through it as them.
const DADI_STRAP_TEAR_PARTY_WEIGHT = 2;
const DADI_STRAP_TEAR_WEIGHT = 5; // her satchel is far more likely to give out
const AMIL_FEVER_PARTY_WEIGHT = 2;
const AMIL_FEVER_WEIGHT = 5;      // he's far more likely to come down sick

const RANDOM_EVENTS = [
  {
    id: "heatstroke",
    title: "The Sun Turns Cruel",
    body: "Midday heat catches the column before shade can be found. Throats are dry and tempers short.",
    choices: [
      { label: "Share water from the jars", requires: { water: 3 }, apply: (s) => { s.inventory.water -= 3; s.log("The water holds everyone together a little longer.", "good"); } },
      { label: "Push on and ration what's left", apply: (s) => { s.damagePartyHealth(12); s.log("The heat takes its toll on the weakest among you.", "bad"); } },
    ],
  },
  {
    id: "strapTear",
    title: "A Satchel Strap Tears",
    body: "One of the satchels gives out crossing rough, rocky ground, its strap frayed thin from the weight of everything you own.",
    choices: [
      { label: "Mend it with repair cloth", requires: { parts: 3 }, apply: (s) => { s.inventory.parts -= 3; s.log("You mend the strap and keep moving.", "good"); } },
      { label: "Tie it off and go slow", apply: (s) => {
        s.pace = "slow";
        const foodLost = Math.min(s.inventory.food, 4 + Math.floor(Math.random() * 8));
        const waterLost = Math.min(s.inventory.water, 1);
        s.inventory.food -= foodLost;
        s.inventory.water -= waterLost;
        s.damagePartyHealth(10);
        s.log(`The strap gives out more than once before you make camp, ${foodLost} lbs of food and ${waterLost} jar of water spill loose along the way, and the extra strain wears on everyone.`, "bad");
      } },
    ],
  },
  {
    id: "fever",
    title: "Sickness in the Column",
    body: "Word passes back through the column: a family further up the road has fallen ill overnight.",
    choices: [
      { label: "Share medicine", requires: { medicine: 3 }, apply: (s) => { s.inventory.medicine -= 3; s.log("The fever is caught early.", "good"); } },
      { label: "Keep your distance and move on", apply: (s) => { s.damagePartyHealth(15, { illness: true }); s.log("The illness spreads before you can outrun it.", "bad"); } },
    ],
  },
  {
    id: "dustStorm",
    title: "Dust Storm Over the Thar",
    body: "The wind rises and swallows the horizon in sand. The path forward disappears.",
    choices: [
      { label: "Burn lantern oil and press on carefully", requires: { lantern: 3 }, apply: (s) => { s.inventory.lantern -= 3; s.log("You keep the caravan together and find the road again.", "good"); } },
      { label: "Shelter until the storm passes", apply: (s) => { s.day += 1; s.damagePartyHealth(6); s.log("A day lost waiting out the storm, and the dust gets into everything.", "bad"); } },
    ],
  },
  {
    id: "wellVillage",
    title: "A Village Well",
    body: "A village along the road opens its well to the passing families, neighbors helping strangers where they can, whatever the times.",
    choices: [
      { label: "Draw water and thank them", social: true, apply: (s) => { const w = 1 + Math.floor(Math.random() * 3); const f = 5 + Math.floor(Math.random() * 10); s.inventory.water += w; s.inventory.food += f; s.log(`They fill your jars and share what food they can spare. +${w} water, +${f} lbs food.`, "good"); } },
      { label: "Take only what you need and move on quickly", apply: (s) => { const w = 1; s.inventory.water += w; s.log(`You draw a little water and keep moving. +${w} water.`, "good"); } },
    ],
  },
  {
    id: "nightProwlers",
    title: "Prowlers at the Camp's Edge",
    body: "Shapes move beyond the firelight. Opportunists have been following caravans like this one, looking for unguarded packs.",
    choices: [
      { label: "Keep watch through the night", apply: (s) => { s.damagePartyHealth(12); s.log("Nothing is taken, but no one rests easy.", "bad"); } },
      { label: "Sleep in shifts and hope for the best", apply: (s) => { const lost = Math.min(s.inventory.food, 15 + Math.floor(Math.random() * 20)); s.inventory.food -= lost; s.damagePartyHealth(4); s.log(`By morning, ${lost} lbs of food are missing from your packs.`, "bad"); } },
    ],
  },
  {
    id: "hostileCrowd",
    title: "A Crowd at the Crossroads",
    tag: "Oppressive Action · 4 I's in Action",
    body: "Where the road narrows, a crowd has gathered, shouting at the families passing through. Fear moves down the line ahead of you like a current.",
    choices: [
      { label: "Suresh steps forward, he's tended half this district as its doctor", social: true, apply: (s) => { s.damagePartyHealth(7); s.log("A few in the crowd recognize him. Someone lowers their voice, and the line is waved through, shaken, but unhurt.", "good"); } },
      { label: "Keep your heads down and push through quickly", apply: (s) => { const lost = Math.min(s.inventory.food, 8 + Math.floor(Math.random() * 14)); s.inventory.food -= lost; s.damagePartyHealth(13); s.log(`You shoulder through the crowd. A hand grabs at a satchel before you break free, ${lost} lbs of food torn loose in the scramble.`, "bad"); } },
    ],
  },
  {
    id: "rain",
    title: "Rain Over the Desert",
    body: "Dark clouds break over the Thar, a rare desert rain drums against the satchels, and the dry ground drinks it in almost as fast as you can catch it.",
    choices: [
      { label: "Catch what you can in the jars", apply: (s) => {
        const usingMortar = s.character && s.character.id === "nisha";
        const w = 2 + Math.floor(Math.random() * 3) + (usingMortar ? KAZI_MORTAR_RAIN_BONUS : 0);
        s.inventory.water += w;
        s.log(usingMortar
          ? `Nisha sets Kazi's mortar out in the open and the rain fills it fast. +${w} water.`
          : `You fill every jar you can before the clouds pass. +${w} water.`, "good");
      } },
      { label: "Let the children rest under it a moment first", apply: (s) => { const w = 1 + Math.floor(Math.random() * 2); s.inventory.water += w; s.damagePartyHealth(-5); s.log(`A moment of relief in the rain, and a little water besides. +${w} water.`, "good"); } },
    ],
  },
  {
    id: "amilSpill",
    title: "Amil Spills the Water",
    body: "A jar slips from Amil's hands on the loose stones, and water darkens the sand before anyone can catch it. \"I'm sorry,\" he says, already scrambling after it.",
    choices: [
      { label: "Stop and salvage what you can", apply: (s) => { s.pace = "slow"; s.damagePartyHealth(7); s.log("You catch the jar before it's lost, but the delay costs you, the family falls behind pace, and the scramble over loose stone leaves everyone winded.", "bad"); } },
      { label: "Let it go and keep moving", apply: (s) => { const lost = Math.min(s.inventory.water, 1); s.inventory.water -= lost; s.damagePartyHealth(5); s.log("There's no time to mourn spilled water. The jar soaks into the sand before you can stop it.", "bad"); } },
    ],
  },
  {
    id: "waterPumpStranger",
    title: "The Man at the Water Pump",
        analysis: "Helping others resists an order that relies on division. Suresh gives water to a man too weak to help himself, whatever his religion, and asks nothing in return. The choice refuses the idea that some people do not deserve help.",
    body: "An old man sits slumped against the pump, too weak to work the handle himself. No one else has stopped.",
    choices: [
      {
        label: "Share water and help him up",
        requires: { water: 1 },
        social: true,
        apply: (s) => {
          s.inventory.water -= 1;
          s.peopleHelped += 1;
          if (Math.random() < HELP_REWARD_CHANCE) {
            const f = 3 + Math.floor(Math.random() * 5);
            s.inventory.food += f;
            s.log(`Suresh helps the man to his feet and shares water from your jars. Grateful, he presses ${f} lbs of food into your hands before you go.`, "good");
          } else {
            s.log("Suresh helps the man to his feet and shares water from your jars. He has nothing to give back but his thanks, and that has to be enough.", "good");
          }
        },
      },
      { label: "Keep walking", apply: (s) => { s.log("You keep walking. There are so many who need help, you cannot stop for all of them.", "bad"); } },
    ],
  },
  {
    id: "sickChildColumn",
    title: "A Sick Child in the Column",
    body: "A family nearby is desperate, their youngest has a fever, and they have no medicine left to bring it down.",
    choices: [
      {
        label: "Share medicine",
        requires: { medicine: 1 },
        social: true,
        apply: (s) => {
          s.inventory.medicine -= 1;
          s.peopleHelped += 1;
          if (Math.random() < HELP_REWARD_CHANCE) {
            const o = 2 + Math.floor(Math.random() * 3);
            s.inventory.lantern += o;
            s.log(`The fever breaks by morning. The father presses ${o} flasks of lantern oil on you, it's all he has to offer.`, "good");
          } else {
            s.log("The fever breaks by morning. The family has nothing to give back, only relief, and it will have to be enough.", "good");
          }
        },
      },
      { label: "You need what you have", apply: (s) => { s.log("You keep the medicine. Your own family may need it before this is over.", "bad"); } },
    ],
  },
  {
    id: "widowOnRoad",
    title: "A Widow on the Road",
    body: "A woman walks alone, carrying nothing but a small bundle. By the look of her, she hasn't eaten in days.",
    choices: [
      {
        label: "Give her some food",
        requires: { food: 5 },
        social: true,
        apply: (s) => {
          s.inventory.food -= 5;
          s.peopleHelped += 1;
          s.log("You share what food you can. She thanks you quietly and walks on alone. You expect nothing back, and get nothing back, and that's alright.", "good");
        },
      },
      { label: "You can't spare it", apply: (s) => { s.log("You have little enough for your own family. You walk on, and don't look back.", "bad"); } },
    ],
  },
];

// Water rate matches The Night Diary: a jar sipped carefully lasts a person
// about 2 weeks (1/14 per day), stretching further the harder it's rationed.
// Food stays at real dry-ration figures, ~0.6-1.5 lbs/person/day.
// Filling rations and a slow pace no longer heal for free (they used to stack
// to +2 health/day doing nothing, which quietly undid most of the difficulty
// tuning elsewhere), the best you can do by resting easy is hold steady.
const RATION_LEVELS = {
  filling: { label: "Filling", foodPerPerson: 1.5, waterPerPerson: 1 / 14, healthDelta: 0 },
  meager:  { label: "Meager",  foodPerPerson: 1,   waterPerPerson: 1 / 18, healthDelta: 0 },
  bare:    { label: "Bare Bones", foodPerPerson: 0.6, waterPerPerson: 1 / 25, healthDelta: -3 },
};

const PACE_LEVELS = {
  slow:    { label: "Slow",    milesPerDay: 8,  healthDelta: 0 },
  steady:  { label: "Steady",  milesPerDay: 14, healthDelta: 0 },
  grueling:{ label: "Grueling",milesPerDay: 22, healthDelta: -3 },
};

const BORDER_LANDMARK_NAME = "Munabao, the border";
const REST_LANDMARK_NAME = "Umerkot";
const REST_DANGER_CHANCE = 0.18;

const NISHA_DANGER_EVENT = {
  title: "Nisha Is in Danger",
  body: "Nisha has slipped off to talk with a neighbor's family, Muslim friends of Rashid Uncle's. Word travels fast in a house this close to the road, and voices are rising outside.",
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
        s.log("You gather the satchels and slip out before the voices reach the door. No rest gained, but everyone is safe.", "good");
      },
    },
  ],
};

const KNIFE_EVENT_MILE = 40;

// Deliberately a single choice, not two. Nisha is selectively mute in the
// book and cannot speak or resist in this moment, giving the player a real
// option here would undo the point. The "choice" is living through it.
//
// The lasting effect is the point, not just the one-time health hit: this
// permanently raises Nisha's susceptibility, so illness and fear hit her
// harder for the rest of the journey, the internalized belief that she's a
// burden doesn't go away once the knife does.
const KNIFE_EVENT_SUSCEPTIBILITY_INCREASE = 0.35;

const KNIFE_EVENT = {
  title: "A Knife in the Dark",
  tag: "Interpersonal Oppression · Breaking Point · Internalized Oppression · Trauma/Tension · 4 I's in Action",
  body: "Suresh has gone ahead to scout the road. A Muslim man steps out of the shadows, a knife shaking in his hand. His family was killed by Hindus, he says, voice raw with grief and rage, and now here is a Hindu girl in front of him, and that is reason enough. She opens her mouth. No sound comes. It hasn't, not really, since everything changed. She cannot run. She cannot speak. In this moment she is certain of only one thing: that she is a burden the family would be better off without.",
  choices: [
    {
      label: "Nisha cannot speak",
      apply: (s) => {
        s.damagePartyHealth(6);
        const nisha = s.party.find((m) => m.name === "Nisha");
        if (nisha) {
          nisha.susceptibility += KNIFE_EVENT_SUSCEPTIBILITY_INCREASE;
          nisha.role = "daughter, shaken, since the knife";
        }
        s.log("Suresh returns just in time, stepping between them. He speaks quietly of loss, his own, and the man's, until the knife finally lowers. The man leaves without a word. Nisha says nothing of it, then or for a long time after. Something in her stays flinched shut, and it doesn't open back up.", "bad");
      },
    },
  ],
        analysis: "Power and bias run through this attack. The attacker lost his family to violence, and his grief has hardened into a belief that every Hindu is a murderer, which gives him a reason to strike a girl who has done nothing. The book describes the cycle: “So a Hindu family kills a Muslim family, who kills a Hindu family, who kills a Muslim family. It would never end unless someone ended it. But who was going to do that?” (Hiranandani 171). Nisha has no power to speak or resist, so her fear turns inward: internalized oppression, where she begins to believe her family would be better off without her. Suresh later gives the attacker back his knife and topi, helping a man whose hatred is the source of the danger.",
};

// Two small, free camp rests along the way, not Rashid Uncle's, no gift, no
// risk, no extra day spent, just a modest breather to take the edge off a
// harder road. Each fires once, automatically, the first time you cross it.
// CAMP_REST_TWO_MILE sits 25 miles before TRAIN_LOOTERS_MILE (220, where the
// journey resolves at Barmer), more than even Grueling pace's 22mi/day, so
// it can't be skipped over in a single travel day no matter the pace chosen.
const CAMP_REST_ONE_MILE = 95;
const CAMP_REST_TWO_MILE = 195;
const CAMP_REST_HEAL = 5;

// Shown in the trail log as the family reaches each place, rather than on the
// intro slides, so the analysis sits alongside the journey it describes.
const DEPARTURE_ANALYSIS = "The power here sits with governments far away. The family’s home now belongs to another country because of a decision they never made, and Nisha’s grief over leaving her home and belongings shows what that power costs the people it touches.";
const LANDMARK_ANALYSIS = {
    "Umerkot": "Bias travels with people, not only with governments. At Amil’s school, the boys split by religion and chant against each other: “all the Hindu boys chanted on one side and the Muslim boys chanted on the other” (Hiranandani 32). Children learn to see the other side as the enemy, which is how an ideology that started at the top reaches every street.",
    "Munabao, the border": "Power here is institutional. The government’s line becomes a crossing where ordinary people carry the cost: “They left when the men came with fire to get all the Hindus and Sikhs out of the village” (Hiranandani 212). The bias is written into the decision itself, which sorts people by the religion of the majority in each new country.",
};

const WATER_PUMP_MILE = 75; // halfway between Mirpur Khas (0) and Umerkot (150)

const WATER_PUMP_EVENT = {
  title: "Fighting at the Water Pump",
  body: "A crowd has gathered around a village pump, and patience has run out. Voices turn to shoving, then worse, as families scramble for what water is left.",
  choices: [
    {
      label: "Push into the fight for water",
      apply: (s) => {
        const w = 1 + Math.floor(Math.random() * 3);
        s.damagePartyHealth(20);
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
        analysis: "When scarce water is divided, power goes to whoever pushes hardest. The fight at the pump shows how scarcity turns neighbours into rivals, and how a system that leaves families without safe water pushes people toward violence.",
};

const TRAIN_LANDMARK_NAMES = ["Khokhrapar", "Munabao, the border"];

// The canonical ending, not a gamble: once the family reaches Barmer, they
// board a train for the final leg into Jodhpur. Unlike TRAIN_EVENT above
// (an optional, invented risk at the border), this one always ends the
// journey, the book doesn't lose the family here, just costs them something
// on the way. See triggerTrainLootersEvent() in game.js.
const TRAIN_LOOTERS_MILE = 220; // Barmer

const TRAIN_EVENT = {
  title: "The Railway at the Border",
  body: "A train idles at the siding, bound across the line into India. It could carry you past the worst of this crossing in a single night, or it could be exactly the kind of train the radio warned about, back in Mirpur Khas. Half the trains get through. Half don't.",
  choices: [
    {
      label: "Risk the train",
      apply: (s) => {
        if (Math.random() < 0.5) {
          s.miles = TOTAL_MILES;
          endGame(true, jodhpurEndingBody("You gambled everything on the train, and it carried you clean across the border in the dark. By morning you are in Jodhpur, the rest of the journey never happened, and somehow, impossibly, you are whole."));
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
        analysis: "Power over the route belongs to whoever controls the train. Refugees had little protection, so every route was dangerous, and the risk falls hardest on families with no choice but to travel.",
};

// Positions are fractions of route.png, placed along its dotted route in
// proportion to each landmark's place in the journey.
const MAP_WAYPOINTS = [
  { miles: 0,   x: 0.210, y: 0.531 }, // Mirpur Khas
  { miles: 150, x: 0.304, y: 0.588 }, // Umerkot
  { miles: 165, x: 0.395, y: 0.456 }, // Khokhrapar
  { miles: 170, x: 0.404, y: 0.447 }, // Munabao, the border
  { miles: 220, x: 0.487, y: 0.391 }, // Barmer
  { miles: TOTAL_MILES, x: 0.663, y: 0.341 }, // Jodhpur
];
