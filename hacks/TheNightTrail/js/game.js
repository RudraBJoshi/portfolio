const state = {
  character: null,
  inventory: { food: 0, water: 0, medicine: 0, parts: 0, lantern: 0 },
  party: [],
  day: 1,
  miles: 0,
  pace: "steady",
  ration: "filling",
  landmarkIndex: 0,
  restBlocked: false,
  knifeEventFired: false,
  waterPumpEventFired: false,
  trainLootersEventFired: false,
  umerkotGiftGiven: false,
  umerkotRested: false,
  campRestOneFired: false,
  campRestTwoFired: false,
  peopleHelped: 0,
  over: false,

  log(message, cls) {
    const log = document.getElementById("trail-log");
    const p = document.createElement("p");
    p.textContent = message;
    if (cls) p.className = cls;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  },

  damagePartyHealth(amount, { illness = false } = {}) {
    const difficultyFactor = (amount > 0 && this.character) ? this.character.damageMultiplier : 1;
    for (const member of this.party) {
      if (member.health <= 0) continue;
      const variance = 0.7 + Math.random() * 0.6;
      const susceptFactor = illness ? member.susceptibility : 1;
      const change = Math.round(amount * variance * susceptFactor * difficultyFactor);
      member.health = Math.max(0, Math.min(100, member.health - change));
      if (member.health === 0) this.log(`${member.name} did not survive the journey.`, "bad");
    }
  },
};

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function renderCharacters() {
  const list = document.getElementById("occupation-list");
  list.innerHTML = "";
  CHARACTERS.forEach((char) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="face face-${char.id}" aria-hidden="true"></div>
      <h4>${char.name} <span class="difficulty-badge difficulty-${char.difficulty.toLowerCase().replace(/[^a-z]/g, "-")}">${char.difficulty}</span></h4>
      <p class="card-role">${char.role}</p>
      <p>${char.desc}</p>
      <p>${char.capacityBonus >= 0 ? "+" : ""}${char.capacityBonus} lbs carrying capacity</p>`;
    card.addEventListener("click", () => {
      state.character = char;
      list.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      document.getElementById("btn-to-outfit").disabled = false;
    });
    list.appendChild(card);
  });
}

function outfitCapacity() {
  const bonus = state.character ? state.character.capacityBonus : 0;
  const mortarPenalty = state.character && state.character.id === "nisha" ? KAZI_MORTAR_WEIGHT : 0;
  return TOTAL_CAPACITY + bonus - mortarPenalty;
}

function outfitUsed() {
  return SUPPLY_ITEMS.reduce((sum, item) => sum + (state.inventory[item.id] || 0) * item.weight, 0);
}

function renderOutfitHeader() {
  const cap = outfitCapacity();
  const used = outfitUsed();
  document.getElementById("outfit-used").textContent = used.toFixed(1);
  document.getElementById("outfit-total").textContent = cap;
  renderSatchelVisual();
}

const SATCHEL_BAR_MIN_HEIGHT = 18;

function renderSatchelVisual() {
  const container = document.getElementById("satchel-visual");
  if (!container) return;
  container.innerHTML = "";

  // Cap the tallest bar to a fraction of the viewport, not a flat pixel value,
  // so this visualization can't crowd out the actual packing controls below it
  // on shorter screens.
  const barMaxHeight = Math.max(60, Math.min(120, window.innerHeight * 0.14));

  const bonus = state.character ? state.character.capacityBonus : 0;
  const mortarPenalty = state.character && state.character.id === "nisha" ? KAZI_MORTAR_WEIGHT : 0;
  const bonusIndex = state.character ? state.character.satchelIndex : 0;
  const satchelCaps = SATCHEL_CAPACITIES.map((cap, i) => (i === bonusIndex ? cap + bonus - mortarPenalty : cap));
  const maxCap = Math.max(...satchelCaps);

  const chunks = SUPPLY_ITEMS
    .map((item) => ({ id: item.id, label: item.name, amount: (state.inventory[item.id] || 0) * item.weight }))
    .filter((c) => c.amount > 0.001);

  let chunkIndex = 0;
  let chunkRemaining = chunks.length ? chunks[0].amount : 0;

  satchelCaps.forEach((capacity, s) => {
    const satchelDiv = document.createElement("div");
    satchelDiv.className = "satchel";

    const bar = document.createElement("div");
    bar.className = "satchel-bar";
    bar.style.height = `${Math.max(SATCHEL_BAR_MIN_HEIGHT, Math.round((capacity / maxCap) * barMaxHeight))}px`;

    let remainingInSatchel = capacity;
    while (remainingInSatchel > 0.001 && chunkIndex < chunks.length) {
      const take = Math.min(remainingInSatchel, chunkRemaining);
      const seg = document.createElement("div");
      seg.className = `satchel-seg satchel-seg-${chunks[chunkIndex].id}`;
      seg.style.height = `${(take / capacity) * 100}%`;
      seg.title = chunks[chunkIndex].label;
      bar.appendChild(seg);

      remainingInSatchel -= take;
      chunkRemaining -= take;
      if (chunkRemaining <= 0.001) {
        chunkIndex += 1;
        chunkRemaining = chunkIndex < chunks.length ? chunks[chunkIndex].amount : 0;
      }
    }

    const label = document.createElement("div");
    label.className = "satchel-label";
    label.textContent = `Satchel ${s + 1} (${capacity} lbs)`;

    satchelDiv.appendChild(bar);
    satchelDiv.appendChild(label);
    const owner = CHARACTERS.find((c) => c.satchelIndex === s);
    if (owner) {
      const face = document.createElement("div");
      face.className = `face face-small face-${owner.id}`;
      face.title = `${owner.name} carries this satchel`;
      satchelDiv.appendChild(face);
    }
    container.appendChild(satchelDiv);
  });
}

function renderSatchelLegend() {
  const legend = document.getElementById("satchel-legend");
  if (!legend) return;
  legend.innerHTML = SUPPLY_ITEMS.map((item) => `
    <span class="legend-item"><span class="legend-swatch satchel-seg-${item.id}"></span>${item.name}</span>
  `).join("");
}

function renderOutfit() {
  renderOutfitHeader();
  renderSatchelLegend();
  const list = document.getElementById("outfit-list");
  list.innerHTML = "";
  SUPPLY_ITEMS.forEach((item) => {
    if (state.inventory[item.id] === undefined) state.inventory[item.id] = 0;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.weight} lbs / ${item.unit}</p>
      <div class="qty-row">
        <button type="button" data-delta="-10">−10</button>
        <button type="button" data-delta="-1">−1</button>
        <span data-qty>${state.inventory[item.id]}</span>
        <button type="button" data-delta="1">+1</button>
        <button type="button" data-delta="10">+10</button>
      </div>`;
    const qtySpan = card.querySelector("[data-qty]");
    card.querySelectorAll("[data-delta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = parseInt(btn.dataset.delta, 10);
        if (delta > 0) {
          const remaining = outfitCapacity() - outfitUsed();
          const roomFor = Math.floor(remaining / item.weight);
          const amount = Math.min(delta, roomFor);
          if (amount <= 0) return;
          state.inventory[item.id] += amount;
        } else {
          const amount = Math.min(-delta, state.inventory[item.id]);
          if (amount <= 0) return;
          state.inventory[item.id] -= amount;
        }
        qtySpan.textContent = state.inventory[item.id];
        renderOutfitHeader();
      });
    });
    list.appendChild(card);
  });
}

function depart() {
  state.party = PARTY_TEMPLATE.map((m) => ({ name: m.name, role: m.role, susceptibility: m.susceptibility, health: 100 }));
  state.day = 1;
  state.miles = 0;
  state.landmarkIndex = 0;
  state.over = false;

  // Dadi's nerfs, stacking on top of her damageMultiplier/capacityBonus: she
  // can't be pushed past a slow pace, no matter what the player picks.
  if (state.character && state.character.id === "dadi") {
    state.pace = "slow";
    state.inventory.food += DADI_STARTING_FOOD;
  }

  document.getElementById("trail-log").innerHTML = "";
  document.getElementById("screen-trail").classList.add("active");
  showScreen("screen-trail");
  document.getElementById("stats-leader").textContent = `Suresh's Family, seen through ${state.character.name}'s eyes (${state.character.difficulty})`;
  state.log("August, 1947. Mirpur Khas is behind you now. Four satchels, packed light, one each. Dr. Suresh, his mother Dadi, and his twins Amil and Nisha set out on foot under starlight, east toward the Thar and whatever waits on the other side of the new border.", "milestone");
  state.log(`Literary analysis: ${DEPARTURE_ANALYSIS}`, "analysis");
  renderStats();
}

function renderStats() {
  document.getElementById("stats-list").innerHTML = `
    <li><span>Day</span><span>${state.day}</span></li>
    <li><span>Miles</span><span>${Math.floor(state.miles)} / ${TOTAL_MILES}</span></li>
    <li><span>Pace</span><span>${PACE_LEVELS[state.pace].label}</span></li>
    <li><span>Rations</span><span>${RATION_LEVELS[state.ration].label}</span></li>
    <li><span>Food</span><span>${Math.floor(state.inventory.food)} lbs</span></li>
    <li><span>Water</span><span>${Math.floor(state.inventory.water)} jars</span></li>
    <li><span>Medicine</span><span>${state.inventory.medicine}</span></li>
    <li><span>Parts</span><span>${state.inventory.parts}</span></li>
    <li><span>Lantern Oil</span><span>${state.inventory.lantern}</span></li>
    ${state.party.map((m) => `<li><span>${m.name}${m.role ? `, ${m.role}` : ""}</span><span>${m.health > 0 ? m.health + "%" : "lost"}</span></li>`).join("")}
  `;
  updateMapMarker();
  updateRestAvailability();
  updateTrainAvailability();
  updatePaceAvailability();
}

function isAlive(name) {
  const member = state.party.find((m) => m.name === name);
  return !!member && member.health > 0;
}

function playedCharacterDied() {
  if (!state.character) return false;
  const member = state.party.find((m) => m.name === state.character.name);
  return !!member && member.health <= 0;
}

function playedCharacterDeathMessage() {
  return `${state.character.name} did not survive the journey. This is where their story ends, even though others in the family remain.`;
}

function atUmerkot() {
  const here = LANDMARKS[state.landmarkIndex];
  return !!here && here.name === REST_LANDMARK_NAME;
}

function updateRestAvailability() {
  const restBtn = document.getElementById("action-rest");
  restBtn.disabled = !atUmerkot() || state.restBlocked || state.umerkotRested;
  restBtn.title = state.restBlocked
    ? "There's no safe rest left here. Time to move on."
    : state.umerkotRested
      ? "You've already rested at Rashid Uncle's. Time to move on."
      : atUmerkot()
        ? "Rashid Uncle will take you in for the day. Costs a day's food and water."
        : "Only safe to rest at Rashid Uncle's house, in Umerkot.";
}

function atBorderCrossing() {
  const here = LANDMARKS[state.landmarkIndex];
  return !!here && TRAIN_LANDMARK_NAMES.includes(here.name);
}

function updateTrainAvailability() {
  const trainBtn = document.getElementById("action-train");
  trainBtn.disabled = !atBorderCrossing();
  trainBtn.title = atBorderCrossing()
    ? "A 50/50 gamble: win, and you skip straight to Jodhpur. Lose, and the journey ends here."
    : "Only an option at the border crossing itself, near Khokhrapar and Munabao.";
}

function playingAsDadi() {
  return !!state.character && state.character.id === "dadi";
}

function playingAsAmil() {
  return !!state.character && state.character.id === "amil";
}

function nishaLocked() {
  return isAlive("Nisha") && state.character && state.character.id === "nisha" && state.knifeEventFired;
}

function updatePaceAvailability() {
  const paceBtn = document.getElementById("action-pace");
  paceBtn.disabled = playingAsDadi();
  paceBtn.title = playingAsDadi() ? "Dadi cannot be pushed past a slow pace." : "";
}

function showEventModal(event) {
  document.getElementById("event-tag").textContent = event.tag || "";
  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-body").textContent = event.body;
  document.getElementById("event-analysis").textContent = event.analysis ? `Literary analysis: ${event.analysis}` : "";
  const choicesEl = document.getElementById("event-choices");
  choicesEl.innerHTML = "";

  event.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.textContent = choice.label;
    const meetsRequirement = !choice.requires || Object.entries(choice.requires).every(([key, amt]) => state.inventory[key] >= amt);
    const silenced = choice.social && nishaLocked();
    btn.disabled = !meetsRequirement || silenced;
    if (silenced) btn.title = "Nisha cannot bring herself to do this. Not since the knife.";
    btn.addEventListener("click", () => {
      choice.apply(state);
      if (state.over) return;
      if (playedCharacterDied()) return endGame(false, playedCharacterDeathMessage());
      showScreen("screen-trail");
      renderStats();
      if (state.party.every((m) => m.health <= 0)) endGame(false, "The family did not make it to Jodhpur.");
    });
    choicesEl.appendChild(btn);
  });

  showScreen("screen-event");
}

function triggerNishaDangerEvent() {
  showEventModal(NISHA_DANGER_EVENT);
}

function triggerWaterPumpEvent() {
  showEventModal(WATER_PUMP_EVENT);
}

function triggerKnifeEvent() {
  showEventModal(KNIFE_EVENT);
}

function trainLootersResolve(opening) {
  if (playedCharacterDied()) return endGame(false, playedCharacterDeathMessage());
  if (state.party.every((m) => m.health <= 0)) return endGame(false, "The family did not make it to Jodhpur.");
  state.miles = TOTAL_MILES;
  endGame(true, jodhpurEndingBody(opening));
}

function triggerTrainLootersEvent() {
  const dadiAlive = isAlive("Dadi");
  const event = {
    title: "The Last Train to Jodhpur",
    tag: "Breaking Point · Oppressive Action · 4 I's in Action",
        analysis: "Power here belongs to mobs. Individuals act violently, but groups give them the power to harm others, and each side has been taught to hate the other. Trains heading into Pakistan are attacked by Hindus, and trains heading into India by Muslims. The violence is interpersonal in its act and ideological in its cause.",
    body: dadiAlive
      ? "At Barmer, the family boards a crowded train bound for Jodhpur, Dadi so weak now that Suresh and Amil have to lift her onto the car. The train lurches into motion, and word moves down the line: looters have been working trains like this one, stripping refugee families of whatever they still carry."
      : "At Barmer, what's left of the family boards a crowded train bound for Jodhpur. The train lurches into motion, and word moves down the line: looters have been working trains like this one, stripping refugee families of whatever they still carry.",
    choices: [
      {
        label: "Keep watch and hold what's yours",
        apply: (s) => {
          s.damagePartyHealth(16);
          s.log("You stay alert through the night, trading off who sleeps. No one touches your satchels, but when the looters are turned away, it doesn't end quietly.", "bad");
          trainLootersResolve("Battered but holding together, the train carries what's left of the family into Jodhpur as the sun comes up.");
        },
      },
      {
        label: "Let them take what they want",
        apply: (s) => {
          const foodLost = Math.min(s.inventory.food, 5 + Math.floor(Math.random() * 10));
          const waterLost = Math.min(s.inventory.water, 1);
          s.inventory.food -= foodLost;
          s.inventory.water -= waterLost;
          let message = `You let the looters pass through the car and take what they will. ${foodLost} lbs of food and ${waterLost} jar of water are gone.`;
          if (Math.random() < 0.3) {
            s.damagePartyHealth(10);
            message += " It isn't enough for them, someone is shoved hard against the window before the car empties out.";
          } else {
            message += " No one is hurt.";
          }
          s.log(message, "bad");
          trainLootersResolve("Lighter than you left Barmer, but all together, the train carries the family into Jodhpur as the sun comes up.");
        },
      },
    ],
  };
  showEventModal(event);
}

function makeMarkerHead(member, sizeClass) {
  const head = document.createElement("div");
  head.className = `marker-head ${sizeClass} face-${member.name.toLowerCase()}${member.health <= 0 ? " dead" : ""}`;
  head.title = member.health <= 0 ? `${member.name} did not survive` : member.name;
  return head;
}

function renderMapMarkerHeads() {
  const marker = document.getElementById("map-marker");
  marker.innerHTML = "";
  const leader = state.party.find((m) => state.character && m.name === state.character.name);
  if (leader) marker.appendChild(makeMarkerHead(leader, "marker-lead"));
  const row = document.createElement("div");
  row.className = "marker-followers";
  state.party.filter((m) => m !== leader).forEach((m) => row.appendChild(makeMarkerHead(m, "marker-follower")));
  marker.appendChild(row);
}

function updateMapMarker() {
  const marker = document.getElementById("map-marker");
  if (!marker) return;
  renderMapMarkerHeads();
  const miles = Math.min(state.miles, TOTAL_MILES);
  let i = 0;
  while (i < MAP_WAYPOINTS.length - 2 && miles > MAP_WAYPOINTS[i + 1].miles) i++;
  const a = MAP_WAYPOINTS[i];
  const b = MAP_WAYPOINTS[i + 1];
  const t = b.miles === a.miles ? 0 : (miles - a.miles) / (b.miles - a.miles);
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  marker.style.left = `${x * 100}%`;
  marker.style.top = `${y * 100}%`;
}

function currentLandmarkLabel() {
  const upcoming = LANDMARKS.find((l) => l.miles > state.miles);
  return upcoming ? `${upcoming.miles - Math.floor(state.miles)} mi to ${upcoming.name}` : "Approaching the end of the trail";
}

function consumeDailySupplies() {
  const alive = state.party.filter((m) => m.health > 0);
  const rationInfo = RATION_LEVELS[state.ration];
  const foodNeeded = rationInfo.foodPerPerson * alive.length;
  if (state.inventory.food >= foodNeeded) {
    state.inventory.food -= foodNeeded;
  } else {
    state.inventory.food = 0;
    state.damagePartyHealth(11, { illness: true });
    state.log("Supplies run short. The family goes hungry.", "bad");
  }

  const waterNeeded = rationInfo.waterPerPerson * alive.length;
  if (state.inventory.water >= waterNeeded) {
    state.inventory.water -= waterNeeded;
  } else {
    state.inventory.water = 0;
    state.damagePartyHealth(11, { illness: true });
    state.log("The jars run dry. The family goes thirsty under the desert sun.", "bad");
  }
}

function travelDay() {
  if (state.over) return;

  const alive = state.party.filter((m) => m.health > 0);
  if (alive.length === 0) return endGame(false, "The family did not make it through the night.");
  if (playedCharacterDied()) return endGame(false, playedCharacterDeathMessage());

  consumeDailySupplies();

  const rationInfo = RATION_LEVELS[state.ration];
  state.damagePartyHealth(-rationInfo.healthDelta);

  const paceInfo = PACE_LEVELS[state.pace];
  state.miles += paceInfo.milesPerDay;
  const forcedSlowRecovery = playingAsDadi() && state.pace === "slow" ? 1 : 0;
  state.damagePartyHealth(-(paceInfo.healthDelta + forcedSlowRecovery));

  state.day += 1;

  const crossed = LANDMARKS.find((l, i) => i > state.landmarkIndex && l.miles <= state.miles);
  if (crossed) {
    state.landmarkIndex = LANDMARKS.indexOf(crossed);
    if (crossed.name === BORDER_LANDMARK_NAME) {
      state.log(`You reach ${crossed.name}. Sindh ends here. Ahead lies India, and an uncertain new home.`, "milestone");
    } else {
      state.log(`You reach ${crossed.name}.`, "milestone");
    }
    if (LANDMARK_ANALYSIS[crossed.name]) state.log(`Literary analysis: ${LANDMARK_ANALYSIS[crossed.name]}`, "analysis");
  }

  if (state.miles >= TOTAL_MILES) {
    return endGame(true, jodhpurEndingBody(`After ${state.day} days on the road, the family reaches Jodhpur.`));
  }

  if (playedCharacterDied()) {
    return endGame(false, playedCharacterDeathMessage());
  }

  if (state.party.every((m) => m.health <= 0)) {
    return endGame(false, "The family did not make it to Jodhpur.");
  }

  renderStats();

  if (!state.knifeEventFired && isAlive("Nisha") && state.miles >= KNIFE_EVENT_MILE) {
    state.knifeEventFired = true;
    triggerKnifeEvent();
    return;
  }

  if (!state.waterPumpEventFired && state.miles >= WATER_PUMP_MILE) {
    state.waterPumpEventFired = true;
    triggerWaterPumpEvent();
    return;
  }

  if (!state.trainLootersEventFired && state.miles >= TRAIN_LOOTERS_MILE) {
    state.trainLootersEventFired = true;
    triggerTrainLootersEvent();
    return;
  }

  if (!state.campRestOneFired && state.miles >= CAMP_REST_ONE_MILE) {
    state.campRestOneFired = true;
    state.damagePartyHealth(-CAMP_REST_HEAL);
    state.log("A farmer along the road waves the column into his barn for a few hours, no questions asked, no payment wanted. Small comfort, but it helps.", "good");
    renderStats();
    return;
  }

  if (!state.campRestTwoFired && state.miles >= CAMP_REST_TWO_MILE) {
    state.campRestTwoFired = true;
    state.damagePartyHealth(-CAMP_REST_HEAL);
    state.log("The column pauses at a dry riverbed as the sun climbs, resting in whatever shade the banks offer before the night's walk resumes.", "good");
    renderStats();
    return;
  }

  if (Math.random() < 0.6) {
    triggerRandomEvent();
  } else {
    state.log(currentLandmarkLabel());
  }
}

function pickWeightedRandomEvent() {
  const weights = RANDOM_EVENTS.map((e) => {
    let w = 1;
    // Stack on top of the existing nerfs (damageMultiplier/capacityBonus):
    // Dadi's weak satchel straps and Amil's weaker constitution should come
    // up more often, not just hit harder when they do, and they're frail
    // for the whole family's journey, not just when you're playing as them.
    if (e.id === "strapTear" && isAlive("Dadi")) {
      w *= playingAsDadi() ? DADI_STRAP_TEAR_WEIGHT : DADI_STRAP_TEAR_PARTY_WEIGHT;
    }
    if (e.id === "fever" && isAlive("Amil")) {
      w *= playingAsAmil() ? AMIL_FEVER_WEIGHT : AMIL_FEVER_PARTY_WEIGHT;
    }
    return w;
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < RANDOM_EVENTS.length; i++) {
    if (roll < weights[i]) return RANDOM_EVENTS[i];
    roll -= weights[i];
  }
  return RANDOM_EVENTS[RANDOM_EVENTS.length - 1];
}

function triggerRandomEvent() {
  showEventModal(pickWeightedRandomEvent());
}

function jodhpurEndingBody(opening) {
  return `${opening} Nisha's uncle is waiting with a flat already arranged, old and dusty, nothing like home, but theirs for now. Slowly, there is a routine again: school, cooking lentils, the small ordinary motions of a life. Nisha keeps her mother's jewelry close and finds something like healing in the kitchen, the way Kazi once taught her. She misses Mirpur Khas every day. She also, carefully, begins again. Millions of families made this same crossing, in both directions, that year, and the line drawn across their home still shapes the subcontinent today. In every new beginning like this one, something of what was lost is carried forward, and something of what was broken slowly, imperfectly, heals.`;
}

function endGame(won, message) {
  state.over = true;
  const citations = document.getElementById("end-citations");
  citations.innerHTML = "";
  const heading = document.createElement("h4");
  heading.textContent = "Citations";
  const list = document.createElement("ol");
  CITATIONS.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    list.appendChild(li);
  });
  citations.append(heading, list);
  document.getElementById("end-tag").textContent = won ? "Resistance & Revolution · Taking Action/Resistance/Healing · Revolution and Reflection · Mirror to Society" : "";
  document.getElementById("end-title").textContent = won ? "A New Home" : "The Journey Ends Here";
  document.getElementById("end-body").textContent = message;
  document.getElementById("end-helped").textContent = state.peopleHelped > 0
    ? `Along the way, you helped ${state.peopleHelped} ${state.peopleHelped === 1 ? "person" : "people"}.`
    : "You made this journey without stopping to help anyone else.";
  document.getElementById("end-roster").innerHTML = state.party.map((m) => {
    const status = m.health > 0 ? "Survived" : "Did not survive";
    const cls = m.health > 0 ? "good" : "bad";
    return `<li><span>${m.name}${m.role ? `, ${m.role}` : ""}</span><span class="${cls}">${status}</span></li>`;
  }).join("");
  showScreen("screen-end");
}

function resetState() {
  state.character = null;
  state.inventory = { food: 0, water: 0, medicine: 0, parts: 0, lantern: 0 };
  state.party = [];
  state.day = 1;
  state.miles = 0;
  state.pace = "steady";
  state.ration = "filling";
  state.landmarkIndex = 0;
  state.restBlocked = false;
  state.knifeEventFired = false;
  state.waterPumpEventFired = false;
  state.trainLootersEventFired = false;
  state.umerkotGiftGiven = false;
  state.umerkotRested = false;
  state.campRestOneFired = false;
  state.campRestTwoFired = false;
  state.peopleHelped = 0;
  state.over = false;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

const TUTORIAL_SEEN_COOKIE = "nighttrail_seen_tutorial";

// The same click-through slide screen drives the first-time tutorial, the
// pre-game intro, and the post-game historical epilogue, only the deck, the
// mode, and what happens after the last slide differ.
let slideIndex = 0;
let activeSlideDeck = INTRO_SLIDES;
let slideDeckMode = "intro"; // "tutorial" | "intro" | "epilogue"

function renderActiveSlide() {
  const slide = activeSlideDeck[slideIndex];
  document.getElementById("intro-tag").textContent = slide.tag || "";
  document.getElementById("intro-heading").textContent = slide.heading;
  document.getElementById("intro-diary").textContent = slide.date ? `Nisha’s Diary · ${slide.date}` : "";
  document.getElementById("intro-body").textContent = slide.body;
  document.getElementById("intro-analysis").textContent = slide.analysis ? `Literary analysis: ${slide.analysis}` : "";
  document.getElementById("intro-progress").textContent = `${slideIndex + 1} / ${activeSlideDeck.length}`;
  document.getElementById("intro-back").disabled = slideIndex === 0;
  const isLast = slideIndex === activeSlideDeck.length - 1;
  document.getElementById("intro-next").textContent = isLast
    ? (slideDeckMode === "intro" ? "Begin the Journey" : slideDeckMode === "tutorial" ? "Continue to the Story" : "Return to Start")
    : "Continue";
  document.getElementById("intro-skip-tutorial").style.display = slideDeckMode === "tutorial" ? "inline-block" : "none";
}

function enterIntroDeck() {
  activeSlideDeck = INTRO_SLIDES;
  slideDeckMode = "intro";
  slideIndex = 0;
  renderActiveSlide();
}

document.getElementById("btn-start").addEventListener("click", () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
  if (getCookie(TUTORIAL_SEEN_COOKIE)) {
    enterIntroDeck();
  } else {
    activeSlideDeck = TUTORIAL_SLIDES;
    slideDeckMode = "tutorial";
    slideIndex = 0;
    renderActiveSlide();
  }
  showScreen("screen-intro");
});

document.getElementById("intro-skip-tutorial").addEventListener("click", () => {
  setCookie(TUTORIAL_SEEN_COOKIE, "1", 365);
  enterIntroDeck();
});

document.getElementById("btn-epilogue").addEventListener("click", () => {
  activeSlideDeck = EPILOGUE_SLIDES;
  slideDeckMode = "epilogue";
  slideIndex = 0;
  renderActiveSlide();
  showScreen("screen-intro");
});

document.getElementById("intro-back").addEventListener("click", () => {
  if (slideIndex === 0) return;
  slideIndex -= 1;
  renderActiveSlide();
});

document.getElementById("intro-next").addEventListener("click", () => {
  if (slideIndex < activeSlideDeck.length - 1) {
    slideIndex += 1;
    renderActiveSlide();
  } else if (slideDeckMode === "tutorial") {
    setCookie(TUTORIAL_SEEN_COOKIE, "1", 365);
    enterIntroDeck();
  } else if (slideDeckMode === "intro") {
    renderCharacters();
    showScreen("screen-setup");
  } else {
    resetState();
    showScreen("screen-title");
  }
});

document.getElementById("btn-to-outfit").addEventListener("click", () => {
  renderOutfit();
  showScreen("screen-outfit");
});

document.getElementById("btn-depart").addEventListener("click", depart);

document.getElementById("action-continue").addEventListener("click", travelDay);

document.getElementById("action-rest").addEventListener("click", () => {
  if (!atUmerkot() || state.restBlocked || state.umerkotRested) return;
  if (isAlive("Nisha") && Math.random() < REST_DANGER_CHANCE) {
    triggerNishaDangerEvent();
    return;
  }
  consumeDailySupplies();
  state.umerkotRested = true;
  state.damagePartyHealth(-10);
  state.day += 1;
  updateRestAvailability();
  if (!state.umerkotGiftGiven) {
    state.umerkotGiftGiven = true;
    const f = 10 + Math.floor(Math.random() * 16);
    const w = 1 + Math.floor(Math.random() * 3);
    state.inventory.food += f;
    state.inventory.water += w;
    state.log(`Rashid Uncle takes you in for the day. The family rests behind his walls, regaining strength. Before you leave, he presses ${f} lbs of food and ${w} jars of water into your hands. "For the road," he says.`, "good");
  } else {
    state.log("Rashid Uncle takes you in for the day. The family rests behind his walls, regaining strength.", "good");
  }
  renderStats();
});

document.getElementById("action-train").addEventListener("click", () => {
  if (!atBorderCrossing()) return;
  showEventModal(TRAIN_EVENT);
});

document.getElementById("action-ration").addEventListener("click", () => {
  const keys = Object.keys(RATION_LEVELS);
  const next = keys[(keys.indexOf(state.ration) + 1) % keys.length];
  state.ration = next;
  state.log(`Rations set to ${RATION_LEVELS[next].label}.`);
  renderStats();
});

document.getElementById("action-pace").addEventListener("click", () => {
  if (playingAsDadi()) return;
  const keys = Object.keys(PACE_LEVELS);
  const next = keys[(keys.indexOf(state.pace) + 1) % keys.length];
  state.pace = next;
  state.log(`Pace set to ${PACE_LEVELS[next].label}.`);
  renderStats();
});

document.getElementById("btn-restart").addEventListener("click", () => {
  resetState();
  showScreen("screen-title");
});
