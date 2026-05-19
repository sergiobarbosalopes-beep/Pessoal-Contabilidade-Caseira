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

  // ── Year & Month Selector with Subrubricas (CGD page) ───────────
  const yearValue = document.getElementById("yearValue");
  const yearPrev = document.getElementById("yearPrev");
  const yearNext = document.getElementById("yearNext");
  const monthGrid = document.getElementById("monthGrid");

  if (monthGrid && yearValue) {
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

    let selectedYear = 2026;
    let selectedMonth = 4; // Maio (index 4)

    // Update year display
    function updateYearDisplay() {
      yearValue.textContent = selectedYear;
    }

    // Year navigation
    if (yearPrev) {
      yearPrev.addEventListener("click", () => {
        selectedYear--;
        updateYearDisplay();
        renderMonthGrid();
        loadRubricas();
        renderRubricas();
      });
    }
    if (yearNext) {
      yearNext.addEventListener("click", () => {
        selectedYear++;
        updateYearDisplay();
        renderMonthGrid();
        loadRubricas();
        renderRubricas();
      });
    }

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

      // Add click listeners to tiles
      monthGrid.querySelectorAll(".month-tile").forEach((tile) => {
        tile.addEventListener("click", () => {
          selectedMonth = parseInt(tile.dataset.month, 10);
          renderMonthGrid();
        });
      });
    }

    updateYearDisplay();
    renderMonthGrid();

    // ── Dynamic Rubricas ────────────────────────────────
    const rubricasDynamic = document.getElementById("rubricasDynamic");
    const addRubricaBtn = document.getElementById("addRubricaBtn");

    // Rubricas data structure: { id: { name: string, values: [12 months] } }
    let dynamicRubricas = {};

    // Load rubricas from localStorage for current year
    function loadRubricas() {
      const savedRubricas = localStorage.getItem("cgdDynamicRubricas_" + selectedYear);
      if (savedRubricas) {
        try {
          dynamicRubricas = JSON.parse(savedRubricas);
        } catch(e) { 
          console.warn("Error loading rubricas", e);
          dynamicRubricas = {};
        }
      } else {
        dynamicRubricas = {};
      }
    }

    // Initial load
    loadRubricas();

    function saveRubricas() {
      localStorage.setItem("cgdDynamicRubricas_" + selectedYear, JSON.stringify(dynamicRubricas));
    }

    function generateId() {
      return "r_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    }

    function renderRubricas() {
      if (!rubricasDynamic) return;
      
      rubricasDynamic.innerHTML = Object.entries(dynamicRubricas).map(([id, rubrica]) => {
        const inputsHtml = Array.from({ length: 12 }, (_, i) => `
          <div class="rubrica-month-input">
            <input type="number" data-rubrica-id="${id}" data-month="${i}" value="${rubrica.values[i] || ""}" placeholder="0" step="0.01">
          </div>
        `).join("");
        
        return `
          <div class="rubrica-row" data-id="${id}">
            <div class="rubrica-row-header">
              <h4>${rubrica.name}</h4>
              <div class="rubrica-row-actions">
                <button class="rubrica-delete-btn" data-delete="${id}" aria-label="Eliminar rubrica">×</button>
              </div>
            </div>
            <div class="rubrica-inputs-grid">
              ${inputsHtml}
            </div>
          </div>
        `;
      }).join("");

      // Add event listeners for inputs
      rubricasDynamic.querySelectorAll("input[data-rubrica-id]").forEach(input => {
        input.addEventListener("input", () => {
          const id = input.dataset.rubricaId;
          const monthIdx = parseInt(input.dataset.month, 10);
          const val = parseFloat(input.value) || 0;
          if (dynamicRubricas[id]) {
            dynamicRubricas[id].values[monthIdx] = val;
            saveRubricas();
          }
        });
      });

      // Add event listeners for delete buttons
      rubricasDynamic.querySelectorAll(".rubrica-delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.delete;
          openDeleteModal(id);
        });
      });
    }

    // ── Modal for adding rubrica ────────────────────────
    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");
    const modalCancel = document.getElementById("modalCancel");
    const modalConfirm = document.getElementById("modalConfirm");
    const rubricaNameInput = document.getElementById("rubricaNameInput");
    const deleteModalOverlay = document.getElementById("deleteModalOverlay");
    const deleteModalClose = document.getElementById("deleteModalClose");
    const deleteModalCancel = document.getElementById("deleteModalCancel");
    const deleteModalConfirm = document.getElementById("deleteModalConfirm");
    let pendingDeleteId = null;

    function openModal() {
      if (modalOverlay) {
        modalOverlay.classList.add("active");
        if (rubricaNameInput) {
          rubricaNameInput.value = "";
          rubricaNameInput.focus();
        }
      }
    }

    function closeModal() {
      if (modalOverlay) {
        modalOverlay.classList.remove("active");
      }
    }

    function openDeleteModal(id) {
      pendingDeleteId = id;
      if (deleteModalOverlay) {
        deleteModalOverlay.classList.add("active");
      }
    }

    function closeDeleteModal() {
      pendingDeleteId = null;
      if (deleteModalOverlay) {
        deleteModalOverlay.classList.remove("active");
      }
    }

    function confirmDeleteRubrica() {
      if (!pendingDeleteId) return;
      delete dynamicRubricas[pendingDeleteId];
      saveRubricas();
      renderRubricas();
      closeDeleteModal();
    }

    function confirmAddRubrica() {
      const name = rubricaNameInput ? rubricaNameInput.value.trim() : "";
      if (name) {
        const id = generateId();
        dynamicRubricas[id] = {
          name: name,
          values: Array(12).fill(0)
        };
        saveRubricas();
        renderRubricas();
        closeModal();
      }
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalCancel) modalCancel.addEventListener("click", closeModal);
    if (modalConfirm) modalConfirm.addEventListener("click", confirmAddRubrica);
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }
    if (deleteModalClose) deleteModalClose.addEventListener("click", closeDeleteModal);
    if (deleteModalCancel) deleteModalCancel.addEventListener("click", closeDeleteModal);
    if (deleteModalConfirm) deleteModalConfirm.addEventListener("click", confirmDeleteRubrica);
    if (deleteModalOverlay) {
      deleteModalOverlay.addEventListener("click", (e) => {
        if (e.target === deleteModalOverlay) closeDeleteModal();
      });
    }
    if (rubricaNameInput) {
      rubricaNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmAddRubrica();
        if (e.key === "Escape") closeModal();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
        closeDeleteModal();
      }
    });

    if (addRubricaBtn) {
      addRubricaBtn.addEventListener("click", openModal);
    }

    renderRubricas();
  }
})();
