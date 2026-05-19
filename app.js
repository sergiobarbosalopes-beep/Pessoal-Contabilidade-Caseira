// ═══════════════════════════════════════════════════════
// APP.JS — Contabilidade Caseira
// ═══════════════════════════════════════════════════════

(function () {
  "use strict";

  // ── Scroll progress bar ───────────────────────────────
  const scrollProgress = document.getElementById("scrollProgress");
  if (scrollProgress) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + "%";
    });
  }

  // ── Navbar scroll effect ──────────────────────────────
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    });
  }

  // ── Hamburger menu ────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      }
    });
  }

  // ── Active nav link ───────────────────────────────────
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(".navbar-links a").forEach((link) => {
      if (link.dataset.page === page) link.classList.add("active");
    });
  }

  // ── Reveal on scroll ──────────────────────────────────
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const revealOnScroll = () => {
      reveals.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) el.classList.add("active");
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
  }

  // ── Particles ─────────────────────────────────────────
  const particlesContainer = document.getElementById("particles");
  if (particlesContainer) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 6 + Math.random() * 8 + "s";
      p.style.animationDelay = Math.random() * 6 + "s";
      particlesContainer.appendChild(p);
    }
  }

  // ── Render KPIs ───────────────────────────────────────
  const kpiContainer = document.getElementById("kpiGrid");
  if (kpiContainer && window.dashboardMock) {
    kpiContainer.innerHTML = window.dashboardMock.kpis
      .map((k) => {
        const trendClass = k.trendUp ? "kpi-ok" : "kpi-danger";
        return `
          <div class="kpi ${trendClass}">
            <p>${k.title}</p>
            <strong>${k.value}</strong>
          </div>
        `;
      })
      .join("");
  }

  // ── Render Priorities ─────────────────────────────────
  const prioritiesList = document.getElementById("prioritiesList");
  if (prioritiesList && window.dashboardMock) {
    prioritiesList.innerHTML = window.dashboardMock.priorities
      .map((p, i) => {
        let posClass = "";
        if (i === 0) posClass = "gold";
        else if (i === 1) posClass = "silver";
        else if (i === 2) posClass = "bronze";
        const badgeClass = p.status === "on track" ? "badge-ok" : p.status === "focus" ? "badge-warn" : "badge-ok";
        return `
          <li>
            <span class="ranking-pos ${posClass}">${i + 1}</span>
            <span class="ranking-label">${p.label}</span>
            <span class="ranking-value">${p.amount}</span>
            <span class="badge ${badgeClass}">${p.status}</span>
          </li>
        `;
      })
      .join("");
  }

  // ── Tiles data ────────────────────────────────────────
  if (window.dashboardMock && window.dashboardMock.tiles) {
    const t = window.dashboardMock.tiles;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setVal("tileCgdSaldo", t.cgd.saldo);
    setVal("tileCgdMov", t.cgd.movimento);
    setVal("tileNbSaldo", t.novobanco.saldo);
    setVal("tileNbMov", t.novobanco.movimento);
    setVal("tileCfSaldo", t.coverflex.saldo);
    setVal("tileCfDisp", t.coverflex.disponivel);
    setVal("tileChDivida", t.credito.divida);
    setVal("tileChPrest", t.credito.prestacao);
    setVal("tileSolPoup", t.solares.poupanca);
    setVal("tileSolRet", t.solares.retorno);
  }

  // ── Charts ────────────────────────────────────────────
  if (typeof Chart !== "undefined" && window.dashboardMock) {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = "#547064";

    const budgetCtx = document.getElementById("budgetChart");
    if (budgetCtx) {
      new Chart(budgetCtx, {
        type: "line",
        data: {
          labels: window.dashboardMock.budgetByMonth.labels,
          datasets: [
            {
              label: "Planeado",
              data: window.dashboardMock.budgetByMonth.planned,
              borderColor: "#0f766e",
              backgroundColor: "rgba(15,118,110,0.12)",
              tension: 0.4,
              fill: true
            },
            {
              label: "Real",
              data: window.dashboardMock.budgetByMonth.actual,
              borderColor: "#f59e0b",
              backgroundColor: "rgba(245,158,11,0.1)",
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { usePointStyle: true } } }
        }
      });
    }

    const cashCtx = document.getElementById("cashChart");
    if (cashCtx) {
      new Chart(cashCtx, {
        type: "bar",
        data: {
          labels: window.dashboardMock.cashFlow.labels,
          datasets: [
            {
              label: "Cashflow líquido",
              data: window.dashboardMock.cashFlow.values,
              backgroundColor: [
                "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4",
                "#34d399", "#10b981", "#fbbf24", "#f59e0b"
              ],
              borderRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    const mixCtx = document.getElementById("mixChart");
    if (mixCtx) {
      new Chart(mixCtx, {
        type: "doughnut",
        data: {
          labels: window.dashboardMock.accountMix.labels,
          datasets: [
            {
              data: window.dashboardMock.accountMix.values,
              backgroundColor: ["#0f766e", "#0ea5e9", "#f59e0b", "#7c3aed"],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "62%",
          plugins: { legend: { position: "bottom" } }
        }
      });
    }
  }

  // ── Month Selector (CGD page) ─────────────────────────
  const monthGrid = document.getElementById("monthGrid");
  const monthLabel = document.getElementById("monthLabel");
  const monthPrev = document.getElementById("monthPrev");
  const monthNext = document.getElementById("monthNext");

  if (monthGrid && monthLabel && monthPrev && monthNext) {
    const months = [
      { short: "Jan", full: "Janeiro" },
      { short: "Fev", full: "Fevereiro" },
      { short: "Mar", full: "Março" },
      { short: "Abr", full: "Abril" },
      { short: "Mai", full: "Maio" },
      { short: "Jun", full: "Junho" },
      { short: "Jul", full: "Julho" },
      { short: "Ago", full: "Agosto" },
      { short: "Set", full: "Setembro" },
      { short: "Out", full: "Outubro" },
      { short: "Nov", full: "Novembro" },
      { short: "Dez", full: "Dezembro" }
    ];

    const currentYear = 2026;
    const currentMonthIndex = new Date().getMonth(); // 0-11 (May = 4 in real, but we mock May = 4)
    let selectedMonth = 4; // Maio (index 4)

    function renderMonthGrid() {
      monthGrid.innerHTML = months
        .map((m, i) => {
          let stateClass = "";
          if (i === selectedMonth) {
            stateClass = "active";
          } else if (i < selectedMonth) {
            stateClass = "past";
          } else {
            stateClass = "future";
          }
          return `
            <div class="month-tile ${stateClass}" data-month="${i}">
              <span>${m.short}</span>
              <strong>${i + 1}</strong>
            </div>
          `;
        })
        .join("");

      // Update label
      monthLabel.textContent = `${months[selectedMonth].full} ${currentYear}`;

      // Update button states
      monthPrev.disabled = selectedMonth === 0;
      monthNext.disabled = selectedMonth === 11;

      // Add click listeners to tiles
      monthGrid.querySelectorAll(".month-tile").forEach((tile) => {
        tile.addEventListener("click", () => {
          selectedMonth = parseInt(tile.dataset.month, 10);
          renderMonthGrid();
        });
      });
    }

    monthPrev.addEventListener("click", () => {
      if (selectedMonth > 0) {
        selectedMonth--;
        renderMonthGrid();
      }
    });

    monthNext.addEventListener("click", () => {
      if (selectedMonth < 11) {
        selectedMonth++;
        renderMonthGrid();
      }
    });

    renderMonthGrid();
  }
})();
