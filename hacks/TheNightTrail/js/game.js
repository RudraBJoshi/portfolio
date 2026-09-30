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
  waterPumpEventFired: false,
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
  return TOTAL_CAPACITY + (state.character ? state.character.capacityBonus : 0);
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

function renderSatchelVisual() {
  const container = document.getElementById("satchel-visual");
  if (!container) return;
  container.innerHTML = "";

  const perSatchel = outfitCapacity() / NUM_SATCHELS;
  const chunks = SUPPLY_ITEMS
    .map((item) => ({ id: item.id, label: item.name, amount: (state.inventory[item.id] || 0) * item.weight }))
    .filter((c) => c.amount > 0.001);

  let chunkIndex = 0;
  let chunkRemaining = chunks.length ? chunks[0].amount : 0;

  for (let s = 0; s < NUM_SATCHELS; s++) {
    const satchelDiv = document.createElement("div");
    satchelDiv.className = "satchel";

    const bar = document.createElement("div");
    bar.className = "satchel-bar";

    let remainingInSatchel = perSatchel;
    while (remainingInSatchel > 0.001 && chunkIndex < chunks.length) {
      const take = Math.min(remainingInSatchel, chunkRemaining);
      const seg = document.createElement("div");
      seg.className = `satchel-seg satchel-seg-${chunks[chunkIndex].id}`;
      seg.style.height = `${(take / perSatchel) * 100}%`;
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
    label.textContent = `Satchel ${s + 1}`;

    satchelDiv.appendChild(bar);
    satchelDiv.appendChild(label);
    container.appendChild(satchelDiv);
  }
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

  document.getElementById("trail-log").innerHTML = "";
  document.getElementById("screen-trail").classList.add("active");
  showScreen("screen-trail");
  document.getElementById("stats-leader").textContent = `Suresh's Family — seen through ${state.character.name}'s eyes (${state.character.difficulty})`;
  state.log("August, 1947. Mirpur Khas is behind you now. Four satchels, packed light — one each. Dr. Suresh, his mother Dadi, and his twins Amil and Nisha set out on foot under starlight, east toward the Thar and whatever waits on the other side of the new border.", "milestone");
  renderStats();
}

function renderStats() {
  document.getElementById("stats-list").innerHTML = `
    <li><span>Day</span><span>${state.day}</span></li>
    <li><span>Miles</span><span>${Math.floor(state.miles)} / ${TOTAL_MILES}</span></li>
    <li><span>Pace</span><span>${PACE_LEVELS[state.pace].label}</span></li>
    <li><span>Rations</span><span>${RATION_LEVELS[state.ration].label}</span></li>
    <li><span>Food</span><span>${Math.floor(state.inventory.food)} lbs</span></li>
    <li><span>Water</span><span>${state.inventory.water} jars</span></li>
    <li><span>Medicine</span><span>${state.inventory.medicine}</span></li>
    <li><span>Parts</span><span>${state.inventory.parts}</span></li>
    <li><span>Lantern Oil</span><span>${state.inventory.lantern}</span></li>
    ${state.party.map((m) => `<li><span>${m.name}${m.role ? ` — ${m.role}` : ""}</span><span>${m.health > 0 ? m.health + "%" : "lost"}</span></li>`).join("")}
  `;
  updateMapMarker();
  updateRestAvailability();
}

function atUmerkot() {
  const here = LANDMARKS[state.landmarkIndex];
  return !!here && here.name === REST_LANDMARK_NAME;
}

function updateRestAvailability() {
  const restBtn = document.getElementById("action-rest");
  restBtn.disabled = !atUmerkot() || state.restBlocked;
  restBtn.title = state.restBlocked
    ? "There's no safe rest left here. Time to move on."
    : atUmerkot()
      ? "Rashid Uncle will take you in for the day."
      : "Only safe to rest at Rashid Uncle's house, in Umerkot.";
}

function showEventModal(event) {
  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-body").textContent = event.body;
  const choicesEl = document.getElementById("event-choices");
  choicesEl.innerHTML = "";

  event.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.textContent = choice.label;
    const meetsRequirement = !choice.requires || Object.entries(choice.requires).every(([key, amt]) => state.inventory[key] >= amt);
    btn.disabled = !meetsRequirement;
    btn.addEventListener("click", () => {
      choice.apply(state);
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

function updateMapMarker() {
  const marker = document.getElementById("map-marker");
  if (!marker) return;
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

function travelDay() {
  if (state.over) return;

  const alive = state.party.filter((m) => m.health > 0);
  if (alive.length === 0) return endGame(false, "The family did not make it through the night.");

  const rationInfo = RATION_LEVELS[state.ration];
  const foodNeeded = rationInfo.foodPerPerson * alive.length;
  if (state.inventory.food >= foodNeeded) {
    state.inventory.food -= foodNeeded;
  } else {
    state.inventory.food = 0;
    state.damagePartyHealth(8, { illness: true });
    state.log("Supplies run short. The family goes hungry.", "bad");
  }

  const waterNeeded = rationInfo.waterPerPerson * alive.length;
  if (state.inventory.water >= waterNeeded) {
    state.inventory.water -= waterNeeded;
  } else {
    state.inventory.water = 0;
    state.damagePartyHealth(8, { illness: true });
    state.log("The jars run dry. The family goes thirsty under the desert sun.", "bad");
  }

  state.damagePartyHealth(-rationInfo.healthDelta);

  const paceInfo = PACE_LEVELS[state.pace];
  state.miles += paceInfo.milesPerDay;
  state.damagePartyHealth(-paceInfo.healthDelta);

  state.day += 1;

  const crossed = LANDMARKS.find((l, i) => i > state.landmarkIndex && l.miles <= state.miles);
  if (crossed) {
    state.landmarkIndex = LANDMARKS.indexOf(crossed);
    if (crossed.name === BORDER_LANDMARK_NAME) {
      state.log(`You reach ${crossed.name}. Sindh ends here. Ahead lies India, and an uncertain new home.`, "milestone");
    } else {
      state.log(`You reach ${crossed.name}.`, "milestone");
    }
  }

  if (state.miles >= TOTAL_MILES) {
    return endGame(true, `After ${state.day} days on the road, the family reaches Jodhpur. Sindh is behind you now, but you arrived together.`);
  }

  if (state.party.every((m) => m.health <= 0)) {
    return endGame(false, "The family did not make it to Jodhpur.");
  }

  renderStats();

  if (!state.waterPumpEventFired && state.miles >= WATER_PUMP_MILE) {
    state.waterPumpEventFired = true;
    triggerWaterPumpEvent();
    return;
  }

  if (Math.random() < 0.4) {
    triggerRandomEvent();
  } else {
    state.log(currentLandmarkLabel());
  }
}

function triggerRandomEvent() {
  const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
  showEventModal(event);
}

function endGame(won, message) {
  state.over = true;
  document.getElementById("end-title").textContent = won ? "A New Home" : "The Journey Ends Here";
  document.getElementById("end-body").textContent = message;
  document.getElementById("end-roster").innerHTML = state.party.map((m) => {
    const status = m.health > 0 ? "Survived" : "Did not survive";
    const cls = m.health > 0 ? "good" : "bad";
    return `<li><span>${m.name}${m.role ? ` — ${m.role}` : ""}</span><span class="${cls}">${status}</span></li>`;
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
  state.waterPumpEventFired = false;
  state.over = false;
}

let introIndex = 0;

function renderIntroSlide() {
  const slide = INTRO_SLIDES[introIndex];
  document.getElementById("intro-heading").textContent = slide.heading;
  document.getElementById("intro-body").textContent = slide.body;
  document.getElementById("intro-progress").textContent = `${introIndex + 1} / ${INTRO_SLIDES.length}`;
  document.getElementById("intro-back").disabled = introIndex === 0;
  document.getElementById("intro-next").textContent = introIndex === INTRO_SLIDES.length - 1 ? "Begin the Journey" : "Continue";
}

document.getElementById("btn-start").addEventListener("click", () => {
  introIndex = 0;
  renderIntroSlide();
  showScreen("screen-intro");
});

document.getElementById("intro-back").addEventListener("click", () => {
  if (introIndex === 0) return;
  introIndex -= 1;
  renderIntroSlide();
});

document.getElementById("intro-next").addEventListener("click", () => {
  if (introIndex < INTRO_SLIDES.length - 1) {
    introIndex += 1;
    renderIntroSlide();
  } else {
    renderCharacters();
    showScreen("screen-setup");
  }
});

document.getElementById("btn-to-outfit").addEventListener("click", () => {
  renderOutfit();
  showScreen("screen-outfit");
});

document.getElementById("btn-depart").addEventListener("click", depart);

document.getElementById("action-continue").addEventListener("click", travelDay);

document.getElementById("action-rest").addEventListener("click", () => {
  if (!atUmerkot() || state.restBlocked) return;
  if (Math.random() < REST_DANGER_CHANCE) {
    triggerNishaDangerEvent();
    return;
  }
  state.damagePartyHealth(-10);
  state.day += 1;
  state.log("Rashid Uncle takes you in for the day. The family rests behind his walls, regaining strength.", "good");
  renderStats();
});

document.getElementById("action-ration").addEventListener("click", () => {
  const keys = Object.keys(RATION_LEVELS);
  const next = keys[(keys.indexOf(state.ration) + 1) % keys.length];
  state.ration = next;
  state.log(`Rations set to ${RATION_LEVELS[next].label}.`);
  renderStats();
});

document.getElementById("action-pace").addEventListener("click", () => {
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
