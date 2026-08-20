---
layout: default
title: Projects
search_exclude: true
permalink: /search/
---

<style>
  .projects-header {
    margin: 2rem 0 1.5rem;
  }
  .projects-header h1 {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 700;
    margin-bottom: .4rem;
  }
  .projects-header p {
    opacity: .7;
    font-size: .95rem;
  }

  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    margin-bottom: 1.8rem;
  }
  .filter-btn {
    padding: .3rem .85rem;
    border-radius: 20px;
    border: 1px solid rgba(0,255,65,.3);
    background: transparent;
    color: inherit;
    font-size: .82rem;
    cursor: pointer;
    transition: background .18s, border-color .18s;
  }
  .filter-btn.active, .filter-btn:hover {
    background: rgba(0,255,65,.2);
    border-color: rgba(0,255,65,.6);
  }

  .proj-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.3rem;
    margin-bottom: 3rem;
  }
  .proj-card {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 14px;
    padding: 1.4rem 1.5rem;
    display: flex;
    flex-direction: column;
    transition: transform .2s, border-color .2s, box-shadow .2s;
  }
  .proj-card:hover {
    transform: translateY(-5px);
    border-color: rgba(0,255,65,.45);
    box-shadow: 0 10px 28px rgba(0,0,0,.35);
  }
  .proj-card[data-hidden="true"] { display: none; }

  .proj-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: .6rem;
  }
  .proj-icon {
    font-size: 1.6rem;
    line-height: 1;
  }
  .proj-status {
    font-size: .7rem;
    padding: .15rem .55rem;
    border-radius: 20px;
    font-weight: 600;
    letter-spacing: .04em;
  }
  .proj-status.live    { background: rgba(80,200,120,.15); color: #50c878; border: 1px solid rgba(80,200,120,.3); }
  .proj-status.wip     { background: rgba(247,192,67,.12); color: #f7c043; border: 1px solid rgba(247,192,67,.3); }
  .proj-status.archive { background: rgba(160,160,160,.1); color: #aaa;    border: 1px solid rgba(160,160,160,.25); }

  .proj-card h3 {
    font-size: 1.05rem;
    margin: 0 0 .45rem;
    color: #00ff41;
  }
  .proj-card p {
    font-size: .85rem;
    opacity: .78;
    margin: 0 0 1rem;
    line-height: 1.55;
    flex: 1;
  }
  .proj-tags {
    display: flex;
    flex-wrap: wrap;
    gap: .3rem;
    margin-bottom: 1rem;
  }
  .proj-tag {
    background: rgba(0,255,65,.13);
    border-radius: 4px;
    padding: .12rem .45rem;
    font-size: .72rem;
    opacity: .85;
  }
  .proj-links {
    display: flex;
    gap: .6rem;
    margin-top: auto;
  }
  .proj-link {
    font-size: .8rem;
    padding: .3rem .8rem;
    border-radius: 6px;
    border: 1px solid rgba(0,255,65,.3);
    background: rgba(0,255,65,.07);
    color: inherit;
    text-decoration: none;
    transition: background .18s;
  }
  .proj-link:hover {
    background: rgba(0,255,65,.2);
    text-decoration: none;
    color: inherit;
  }
  .proj-link.primary {
    background: rgba(0,255,65,.18);
    border-color: rgba(0,255,65,.5);
  }
  .proj-link.primary:hover { background: rgba(0,255,65,.32); }
</style>

<div class="projects-header">
  <h1>My Projects</h1>
  <p>A collection of things I've built — ML models, simulations, games, and web tools.</p>
</div>

<div class="filter-row">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="ml">ML / AI</button>
  <button class="filter-btn" data-filter="web">Web</button>
  <button class="filter-btn" data-filter="game">Games</button>
  <button class="filter-btn" data-filter="science">Science</button>
</div>

<div class="proj-grid">

  <div class="proj-card" data-tags="ml,web">
    <div class="proj-card-top">
      <span class="proj-icon">🚢</span>
      <span class="proj-status live">Live</span>
    </div>
    <h3>Titanic Survival Predictor</h3>
    <p>Interactive ML model that predicts Titanic survival probability based on passenger data. Built with a styled UI and live inference.</p>
    <div class="proj-tags">
      <span class="proj-tag">Python</span>
      <span class="proj-tag">ML</span>
      <span class="proj-tag">JavaScript</span>
    </div>
    <div class="proj-links">
      <a class="proj-link primary" href="/portfolio/titanic">View</a>
    </div>
  </div>

  <div class="proj-card" data-tags="game,web">
    <div class="proj-card-top">
      <span class="proj-icon">🌐</span>
      <span class="proj-status live">Live</span>
    </div>
    <h3>NetMaster — Packet Quest</h3>
    <p>Networking-themed browser game where you route packets through the OSI model. Tracks score and teaches network concepts interactively.</p>
    <div class="proj-tags">
      <span class="proj-tag">JavaScript</span>
      <span class="proj-tag">Game Design</span>
      <span class="proj-tag">Networking</span>
    </div>
    <div class="proj-links">
      <a class="proj-link primary" href="/portfolio/netmaster">Play</a>
    </div>
  </div>

  <div class="proj-card" data-tags="ml">
    <div class="proj-card-top">
      <span class="proj-icon">🔢</span>
      <span class="proj-status live">Live</span>
    </div>
    <h3>Digit Recognition CNN</h3>
    <p>Convolutional Neural Network trained on MNIST to classify handwritten digits. Includes a canvas-based draw-and-predict interface. <em style="opacity:.6">(Backend offline)</em></p>
    <div class="proj-tags">
      <span class="proj-tag">Python</span>
      <span class="proj-tag">CNN</span>
      <span class="proj-tag">Deep Learning</span>
    </div>
    <div class="proj-links">
      <a class="proj-link primary" href="/portfolio/digitrecog/">View</a>
    </div>
  </div>

  <div class="proj-card" data-tags="science">
    <div class="proj-card-top">
      <span class="proj-icon">⚛️</span>
      <span class="proj-status archive">Research</span>
    </div>
    <h3>Particle Transport Simulation</h3>
    <p>Monte Carlo simulation of radiation shielding using OpenMC. Models neutron/photon transport through material configurations.</p>
    <div class="proj-tags">
      <span class="proj-tag">OpenMC</span>
      <span class="proj-tag">Python</span>
      <span class="proj-tag">Physics</span>
      <span class="proj-tag">Monte Carlo</span>
    </div>
    <div class="proj-links"></div>
  </div>

  <div class="proj-card" data-tags="web,science">
    <div class="proj-card-top">
      <span class="proj-icon">🖥️</span>
      <span class="proj-status live">Live</span>
    </div>
    <h3>OCSworkspace (My OS)</h3>
    <p>A custom cloud workspace / OS environment built on top of KASM. Configured for development with personal tooling and settings.</p>
    <div class="proj-tags">
      <span class="proj-tag">KASM</span>
      <span class="proj-tag">Linux</span>
      <span class="proj-tag">OS Hardening</span>
      <span class="proj-tag">Cloud</span>
    </div>
    <div class="proj-links">
      <a class="proj-link primary" href="/portfolio/ocsworkspace">View</a>
    </div>
  </div>

  <div class="proj-card" data-tags="web">
    <div class="proj-card-top">
      <span class="proj-icon">💻</span>
      <span class="proj-status live">Live</span>
    </div>
    <h3>Pseudocode Runner</h3>
    <p>Browser-based AP CSP pseudocode editor and interpreter. Supports full syntax, robot tilemap simulation, local storage, and a CodeMirror editor with custom highlighting.</p>
    <div class="proj-tags">
      <span class="proj-tag">JavaScript</span>
      <span class="proj-tag">Interpreter</span>
      <span class="proj-tag">AP CSP</span>
    </div>
    <div class="proj-links">
      <a class="proj-link primary" href="/portfolio/pseudocode-runner/">Open</a>
    </div>
  </div>

  <div class="proj-card" data-tags="web">
    <div class="proj-card-top">
      <span class="proj-icon">🌐</span>
      <span class="proj-status live">Live</span>
    </div>
    <h3>Personal Portfolio Site</h3>
    <p>This site — built with Jekyll and GitHub Pages. Custom layouts, dark theming, and interactive JS throughout.</p>
    <div class="proj-tags">
      <span class="proj-tag">Jekyll</span>
      <span class="proj-tag">GitHub Pages</span>
      <span class="proj-tag">HTML/CSS/JS</span>
    </div>
    <div class="proj-links">
      <a class="proj-link primary" href="https://github.com/RudraBJoshi/student" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>

</div>

<script>
(function () {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.proj-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(card => {
        const tags = card.dataset.tags.split(',');
        card.dataset.hidden = (f !== 'all' && !tags.includes(f)) ? 'true' : 'false';
      });
    });
  });
})();
</script>
