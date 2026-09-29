const state = {
  leaderName: "",
  occupation: null,
  money: 0,
  inventory: { food: 0, ammo: 0, medicine: 0, parts: 0, lantern: 0 },
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

  damagePartyHealth(amount) {
    for (const member of this.party) {
      if (member.health <= 0) continue;
      member.health = Math.max(0, Math.min(100, member.health - amount));
      if (member.health === 0) this.log(`${member.name} did not survive the night.`, "bad");
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
    card.innerHTML = `<h4>${occ.name}</h4><p>${occ.desc}</p><p>Starting cash: $${occ.money}</p>`;
    card.addEventListener("click", () => {
      state.occupation = occ;
      state.money = occ.money;
      list.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      document.getElementById("btn-to-outfit").disabled = false;
    });
    list.appendChild(card);
  });
}

function renderOutfit() {
  document.getElementById("outfit-money").textContent = state.money.toFixed(2);
  const list = document.getElementById("outfit-list");
  list.innerHTML = "";
  SUPPLY_ITEMS.forEach((item) => {
    if (state.inventory[item.id] === undefined) state.inventory[item.id] = 0;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${item.name}</h4>
      <p>$${item.price.toFixed(2)} / ${item.unit}</p>
      <div class="qty-row">
        <button type="button" data-action="minus">-</button>
        <span data-qty>${state.inventory[item.id]}</span>
        <button type="button" data-action="plus">+</button>
      </div>`;
    const qtySpan = card.querySelector("[data-qty]");
    card.querySelector('[data-action="plus"]').addEventListener("click", () => {
      if (state.money >= item.price) {
        state.money -= item.price;
        state.inventory[item.id] += 1;
        qtySpan.textContent = state.inventory[item.id];
        document.getElementById("outfit-money").textContent = state.money.toFixed(2);
      }
    });
    card.querySelector('[data-action="minus"]').addEventListener("click", () => {
      if (state.inventory[item.id] > 0) {
        state.money += item.price;
        state.inventory[item.id] -= 1;
        qtySpan.textContent = state.inventory[item.id];
        document.getElementById("outfit-money").textContent = state.money.toFixed(2);
      }
    });
    list.appendChild(card);
  });
}

function depart() {
  state.party = [
    { name: state.leaderName || "Leader", health: 100 },
    { name: "Traveler 2", health: 100 },
    { name: "Traveler 3", health: 100 },
  ];
  state.day = 1;
  state.miles = 0;
  state.landmarkIndex = 0;
  state.over = false;

  document.getElementById("trail-log").innerHTML = "";
  document.getElementById("screen-trail").classList.add("active");
  showScreen("screen-trail");
  document.getElementById("stats-leader").textContent = `${state.leaderName}'s Party`;
  state.log(`Night falls over ${LANDMARKS[0].name}. The wagon rolls out under starlight.`, "milestone");
  renderStats();
}

function renderStats() {
  document.getElementById("stats-list").innerHTML = `
    <li><span>Day</span><span>${state.day}</span></li>
    <li><span>Miles</span><span>${Math.floor(state.miles)} / ${TOTAL_MILES}</span></li>
    <li><span>Pace</span><span>${PACE_LEVELS[state.pace].label}</span></li>
    <li><span>Rations</span><span>${RATION_LEVELS[state.ration].label}</span></li>
    <li><span>Food</span><span>${Math.floor(state.inventory.food)} lbs</span></li>
    <li><span>Ammo</span><span>${state.inventory.ammo}</span></li>
    <li><span>Medicine</span><span>${state.inventory.medicine}</span></li>
    <li><span>Parts</span><span>${state.inventory.parts}</span></li>
    <li><span>Lantern Oil</span><span>${state.inventory.lantern}</span></li>
    ${state.party.map((m) => `<li><span>${m.name}</span><span>${m.health > 0 ? m.health + "%" : "lost"}</span></li>`).join("")}
  `;
}

function currentLandmarkLabel() {
  const upcoming = LANDMARKS.find((l) => l.miles > state.miles);
  return upcoming ? `${upcoming.miles - Math.floor(state.miles)} mi to ${upcoming.name}` : "Approaching the end of the trail";
}

function travelDay() {
  if (state.over) return;

  const alive = state.party.filter((m) => m.health > 0);
  if (alive.length === 0) return endGame(false, "The party did not make it through the night.");

  const rationInfo = RATION_LEVELS[state.ration];
  const foodNeeded = rationInfo.foodPerPerson * alive.length;
  if (state.inventory.food >= foodNeeded) {
    state.inventory.food -= foodNeeded;
  } else {
    state.inventory.food = 0;
    state.damagePartyHealth(8);
    state.log("Supplies run short. The party goes hungry.", "bad");
  }
  state.damagePartyHealth(-rationInfo.healthDelta);

  const paceInfo = PACE_LEVELS[state.pace];
  state.miles += paceInfo.milesPerDay;
  state.damagePartyHealth(-paceInfo.healthDelta);

  state.day += 1;

  const crossed = LANDMARKS.find((l, i) => i > state.landmarkIndex && l.miles <= state.miles);
  if (crossed) {
    state.landmarkIndex = LANDMARKS.indexOf(crossed);
    state.log(`You reach ${crossed.name}.`, "milestone");
  }

  if (state.miles >= TOTAL_MILES) {
    return endGame(true, `The party arrives safely after ${state.day} days on the trail.`);
  }

  if (state.party.every((m) => m.health <= 0)) {
    return endGame(false, "No one is left to continue the journey.");
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
      if (state.party.every((m) => m.health <= 0)) endGame(false, "No one is left to continue the journey.");
    });
    choicesEl.appendChild(btn);
  });

  showScreen("screen-event");
}

function endGame(won, message) {
  state.over = true;
  document.getElementById("end-title").textContent = won ? "You Made It" : "The Trail Ends Here";
  document.getElementById("end-body").textContent = message;
  showScreen("screen-end");
}

function resetState() {
  state.leaderName = "";
  state.occupation = null;
  state.money = 0;
  state.inventory = { food: 0, ammo: 0, medicine: 0, parts: 0, lantern: 0 };
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

document.getElementById("input-name").addEventListener("input", (e) => {
  state.leaderName = e.target.value;
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
  state.log("The party rests through the day, regaining strength.", "good");
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
  document.getElementById("input-name").value = "";
  showScreen("screen-title");
});
