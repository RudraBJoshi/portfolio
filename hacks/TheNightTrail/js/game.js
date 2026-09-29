const state = {
  occupation: null,
  inventory: { food: 0, water: 0, medicine: 0, parts: 0, lantern: 0 },
  party: [],
  day: 1,
  miles: 0,
  pace: "steady",
  ration: "filling",
  landmarkIndex: 0,
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
    for (const member of this.party) {
      if (member.health <= 0) continue;
      const variance = 0.7 + Math.random() * 0.6;
      const susceptFactor = illness ? member.susceptibility : 1;
      const change = Math.round(amount * variance * susceptFactor);
      member.health = Math.max(0, Math.min(100, member.health - change));
      if (member.health === 0) this.log(`${member.name} did not survive the journey.`, "bad");
    }
  },
};

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function renderOccupations() {
  const list = document.getElementById("occupation-list");
  list.innerHTML = "";
  OCCUPATIONS.forEach((occ) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h4>${occ.name}</h4><p>${occ.desc}</p><p>+${occ.capacityBonus} satchel space</p>`;
    card.addEventListener("click", () => {
      state.occupation = occ;
      list.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      document.getElementById("btn-to-outfit").disabled = false;
    });
    list.appendChild(card);
  });
}

function outfitCapacity() {
  return TOTAL_CAPACITY + (state.occupation ? state.occupation.capacityBonus : 0);
}

function outfitUsed() {
  return SUPPLY_ITEMS.reduce((sum, item) => sum + (state.inventory[item.id] || 0) * item.weight, 0);
}

function renderOutfitHeader() {
  const cap = outfitCapacity();
  const used = outfitUsed();
  document.getElementById("outfit-used").textContent = used.toFixed(1);
  document.getElementById("outfit-total").textContent = cap;
}

function renderOutfit() {
  renderOutfitHeader();
  const list = document.getElementById("outfit-list");
  list.innerHTML = "";
  SUPPLY_ITEMS.forEach((item) => {
    if (state.inventory[item.id] === undefined) state.inventory[item.id] = 0;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.weight} space / ${item.unit}</p>
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
  state.party = PARTY_TEMPLATE.map((m) => ({ name: m.name, susceptibility: m.susceptibility, health: 100 }));
  state.day = 1;
  state.miles = 0;
  state.landmarkIndex = 0;
  state.over = false;

  document.getElementById("trail-log").innerHTML = "";
  document.getElementById("screen-trail").classList.add("active");
  showScreen("screen-trail");
  document.getElementById("stats-leader").textContent = "Suresh's Family";
  state.log("August, 1947. Mirpur Khas is behind you now. Four satchels, packed light — one each. Suresh, Dadi, Amil, and Nisha set out on foot under starlight, east toward the Thar and whatever waits on the other side of the new border.", "milestone");
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
    ${state.party.map((m) => `<li><span>${m.name}</span><span>${m.health > 0 ? m.health + "%" : "lost"}</span></li>`).join("")}
  `;
  updateMapMarker();
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

  if (Math.random() < 0.4) {
    triggerRandomEvent();
  } else {
    state.log(currentLandmarkLabel());
  }
}

function triggerRandomEvent() {
  const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
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

function endGame(won, message) {
  state.over = true;
  document.getElementById("end-title").textContent = won ? "A New Home" : "The Journey Ends Here";
  document.getElementById("end-body").textContent = message;
  showScreen("screen-end");
}

function resetState() {
  state.occupation = null;
  state.inventory = { food: 0, water: 0, medicine: 0, parts: 0, lantern: 0 };
  state.party = [];
  state.day = 1;
  state.miles = 0;
  state.pace = "steady";
  state.ration = "filling";
  state.landmarkIndex = 0;
  state.over = false;
}

document.getElementById("btn-start").addEventListener("click", () => {
  renderOccupations();
  showScreen("screen-setup");
});

document.getElementById("btn-to-outfit").addEventListener("click", () => {
  renderOutfit();
  showScreen("screen-outfit");
});

document.getElementById("btn-depart").addEventListener("click", depart);

document.getElementById("action-continue").addEventListener("click", travelDay);

document.getElementById("action-rest").addEventListener("click", () => {
  state.damagePartyHealth(-10);
  state.day += 1;
  state.log("The family rests through the day, regaining strength.", "good");
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
