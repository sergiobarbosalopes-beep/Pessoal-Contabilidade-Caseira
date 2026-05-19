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
          renderRubricas();
        });
      });
    }

    updateYearDisplay();
    renderMonthGrid();

    // ── Dynamic Rubricas ────────────────────────────────
    const rubricasDynamic = document.getElementById("rubricasDynamic");
    const addRubricaBtn = document.getElementById("addRubricaBtn");

    // Rubricas data structure: { id: { name: string, expenses: [{ id, name, values[12] }] } }
    let dynamicRubricas = {};
    let openRubricaMenuId = null;

    // Load rubricas from localStorage for current year
    function loadRubricas() {
      const savedRubricas = localStorage.getItem("cgdDynamicRubricas_" + selectedYear);
      if (savedRubricas) {
        try {
          dynamicRubricas = JSON.parse(savedRubricas);
          Object.values(dynamicRubricas).forEach((rubrica) => {
            if (!Array.isArray(rubrica.expenses)) {
              rubrica.expenses = [];
            }
            if (typeof rubrica.collapsed !== "boolean") {
              rubrica.collapsed = false;
            }

            rubrica.expenses = rubrica.expenses.map((expense) => {
              if (typeof expense === "string") {
                return {
                  id: generateExpenseId(),
                  name: expense,
                  values: Array(12).fill(0)
                };
              }

              const values = Array.isArray(expense.values)
                ? Array.from({ length: 12 }, (_, i) => parseFloat(expense.values[i]) || 0)
                : Array(12).fill(0);

              return {
                id: expense.id || generateExpenseId(),
                name: (expense.name || "Despesa").toString(),
                values
              };
            });
          });
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

    function generateExpenseId() {
      return "e_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    }

    function renderRubricas() {
      if (!rubricasDynamic) return;
      
      const entries = Object.entries(dynamicRubricas);
      rubricasDynamic.innerHTML = entries.map(([id, rubrica], index) => {
        const canMoveUp = index > 0;
        const canMoveDown = index < entries.length - 1;
        const isCollapsed = !!rubrica.collapsed;
        const expenses = Array.isArray(rubrica.expenses) ? rubrica.expenses : [];
        const expensesHtml = expenses.length
          ? `<div class="rubrica-expenses-stack ${isCollapsed ? "collapsed" : ""}">${expenses
              .map((expense, expenseIndex) => {
                const canMoveExpenseUp = expenseIndex > 0;
                const canMoveExpenseDown = expenseIndex < expenses.length - 1;
                const tilesHtml = Array.from({ length: 12 }, (_, monthIdx) => {
                  const value = parseFloat(expense.values?.[monthIdx]) || 0;
                  const isEditable = monthIdx === selectedMonth;
                  return `
                    <div class="expense-input-tile">
                      <input
                        type="number"
                        data-expense-input="true"
                        data-rubrica-id="${id}"
                        data-expense-id="${expense.id}"
                        data-month="${monthIdx}"
                        value="${value || ""}"
                        placeholder="0"
                        step="0.01"
                        ${isEditable ? "" : "disabled"}
                      >
                      <span class="expense-currency">€</span>
                    </div>
                  `;
                }).join("");

                return `
                  <div class="rubrica-expense-row" data-expense-id="${expense.id}">
                    <div class="rubrica-expense-header">
                      <div class="rubrica-expense-name">${expense.name}</div>
                      <div class="rubrica-expense-actions">
                        <button class="expense-move-btn ${!canMoveExpenseUp ? 'disabled' : ''}" data-expense-move-up="${id}::${expense.id}" ${!canMoveExpenseUp ? 'disabled' : ''} aria-label="Mover despesa para cima">▲</button>
                        <button class="expense-move-btn ${!canMoveExpenseDown ? 'disabled' : ''}" data-expense-move-down="${id}::${expense.id}" ${!canMoveExpenseDown ? 'disabled' : ''} aria-label="Mover despesa para baixo">▼</button>
                        <button class="expense-delete-btn" data-expense-delete="${id}::${expense.id}" aria-label="Eliminar despesa">×</button>
                      </div>
                    </div>
                    <div class="rubrica-expense-grid">${tilesHtml}</div>
                  </div>
                `;
              })
              .join("")}</div>`
          : "";
        
        return `
          <div class="rubrica-block" data-id="${id}">
            <div class="rubrica-row">
              <div class="rubrica-row-header">
                <h4>${rubrica.name}</h4>
                <div class="rubrica-row-actions">
                  <button class="rubrica-toggle-btn" data-toggle-expenses="${id}" aria-label="${isCollapsed ? "Expandir despesas" : "Colapsar despesas"}">${isCollapsed ? "▸" : "▾"}</button>
                  <button class="rubrica-menu-btn" data-rubrica-menu="${id}" aria-label="Ações da rubrica">⋯</button>
                  <div class="rubrica-menu-dropdown ${openRubricaMenuId === id ? "open" : ""}" data-rubrica-menu-dropdown="${id}">
                    <button class="rubrica-menu-item" data-rubrica-action="add-expense" data-rubrica-id="${id}">Adicionar despesa</button>
                    <button class="rubrica-menu-item" data-rubrica-action="move-up" data-rubrica-id="${id}" ${!canMoveUp ? "disabled" : ""}>Mover para cima</button>
                    <button class="rubrica-menu-item" data-rubrica-action="move-down" data-rubrica-id="${id}" ${!canMoveDown ? "disabled" : ""}>Mover para baixo</button>
                    <button class="rubrica-menu-item danger" data-rubrica-action="delete" data-rubrica-id="${id}">Eliminar rubrica</button>
                  </div>
                </div>
              </div>
            </div>
            ${expensesHtml}
          </div>
        `;
      }).join("");

      // Add event listeners for rubrica action menu toggle
      rubricasDynamic.querySelectorAll(".rubrica-menu-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.dataset.rubricaMenu;
          toggleRubricaMenu(id);
        });
      });

      // Keep menu open while interacting inside
      rubricasDynamic.querySelectorAll(".rubrica-menu-dropdown").forEach(menu => {
        menu.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      });

      // Add event listeners for rubrica menu actions
      rubricasDynamic.querySelectorAll(".rubrica-menu-item").forEach(item => {
        item.addEventListener("click", () => {
          const action = item.dataset.rubricaAction;
          const id = item.dataset.rubricaId;

          if (!id) return;

          if (action === "add-expense") {
            openRubricaMenuId = null;
            openExpenseModal(id);
            return;
          }
          if (action === "move-up") {
            openRubricaMenuId = null;
            moveRubricaUp(id);
            return;
          }
          if (action === "move-down") {
            openRubricaMenuId = null;
            moveRubricaDown(id);
            return;
          }
          if (action === "delete") {
            openRubricaMenuId = null;
            openDeleteModal(id);
          }
        });
      });

      // Add event listeners for expand/collapse rubrica expenses
      rubricasDynamic.querySelectorAll(".rubrica-toggle-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.toggleExpenses;
          toggleRubricaExpenses(id);
        });
      });

      // Add event listeners for expense move up buttons
      rubricasDynamic.querySelectorAll(".expense-move-btn[data-expense-move-up]").forEach(btn => {
        btn.addEventListener("click", () => {
          const [rubricaId, expenseId] = (btn.dataset.expenseMoveUp || "::").split("::");
          moveExpenseUp(rubricaId, expenseId);
        });
      });

      // Add event listeners for expense move down buttons
      rubricasDynamic.querySelectorAll(".expense-move-btn[data-expense-move-down]").forEach(btn => {
        btn.addEventListener("click", () => {
          const [rubricaId, expenseId] = (btn.dataset.expenseMoveDown || "::").split("::");
          moveExpenseDown(rubricaId, expenseId);
        });
      });

      // Add event listeners for expense delete buttons
      rubricasDynamic.querySelectorAll(".expense-delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const [rubricaId, expenseId] = (btn.dataset.expenseDelete || "::").split("::");
          openDeleteExpenseModal(rubricaId, expenseId);
        });
      });

      // Add event listeners for expense monthly inputs
      rubricasDynamic.querySelectorAll("input[data-expense-input='true']").forEach(input => {
        input.addEventListener("input", () => {
          const rubricaId = input.dataset.rubricaId;
          const expenseId = input.dataset.expenseId;
          const monthIdx = parseInt(input.dataset.month, 10);
          const val = parseFloat(input.value) || 0;

          const rubrica = dynamicRubricas[rubricaId];
          if (!rubrica || !Array.isArray(rubrica.expenses)) return;

          const expense = rubrica.expenses.find((e) => e.id === expenseId);
          if (!expense) return;

          expense.values[monthIdx] = val;
          saveRubricas();
        });
      });

    }

    function moveRubricaUp(id) {
      const entries = Object.entries(dynamicRubricas);
      const idx = entries.findIndex(([k]) => k === id);
      if (idx > 0) {
        [entries[idx - 1], entries[idx]] = [entries[idx], entries[idx - 1]];
        dynamicRubricas = Object.fromEntries(entries);
        saveRubricas();
        renderRubricas();
      }
    }

    function moveRubricaDown(id) {
      const entries = Object.entries(dynamicRubricas);
      const idx = entries.findIndex(([k]) => k === id);
      if (idx < entries.length - 1) {
        [entries[idx], entries[idx + 1]] = [entries[idx + 1], entries[idx]];
        dynamicRubricas = Object.fromEntries(entries);
        saveRubricas();
        renderRubricas();
      }
    }

    function moveExpenseUp(rubricaId, expenseId) {
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica || !Array.isArray(rubrica.expenses)) return;

      const idx = rubrica.expenses.findIndex((e) => e.id === expenseId);
      if (idx > 0) {
        [rubrica.expenses[idx - 1], rubrica.expenses[idx]] = [rubrica.expenses[idx], rubrica.expenses[idx - 1]];
        saveRubricas();
        renderRubricas();
      }
    }

    function moveExpenseDown(rubricaId, expenseId) {
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica || !Array.isArray(rubrica.expenses)) return;

      const idx = rubrica.expenses.findIndex((e) => e.id === expenseId);
      if (idx !== -1 && idx < rubrica.expenses.length - 1) {
        [rubrica.expenses[idx], rubrica.expenses[idx + 1]] = [rubrica.expenses[idx + 1], rubrica.expenses[idx]];
        saveRubricas();
        renderRubricas();
      }
    }

    function toggleRubricaExpenses(id) {
      const rubrica = dynamicRubricas[id];
      if (!rubrica) return;
      rubrica.collapsed = !rubrica.collapsed;
      saveRubricas();
      renderRubricas();
    }

    function toggleRubricaMenu(id) {
      openRubricaMenuId = openRubricaMenuId === id ? null : id;
      renderRubricas();
    }

    function closeRubricaMenu() {
      if (openRubricaMenuId !== null) {
        openRubricaMenuId = null;
        renderRubricas();
      }
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
    const deleteExpenseModalOverlay = document.getElementById("deleteExpenseModalOverlay");
    const deleteExpenseModalClose = document.getElementById("deleteExpenseModalClose");
    const deleteExpenseModalCancel = document.getElementById("deleteExpenseModalCancel");
    const deleteExpenseModalConfirm = document.getElementById("deleteExpenseModalConfirm");
    const expenseModalOverlay = document.getElementById("expenseModalOverlay");
    const expenseModalClose = document.getElementById("expenseModalClose");
    const expenseModalCancel = document.getElementById("expenseModalCancel");
    const expenseModalConfirm = document.getElementById("expenseModalConfirm");
    const expenseNameInput = document.getElementById("expenseNameInput");
    let pendingDeleteId = null;
    let pendingExpenseRubricaId = null;
    let pendingDeleteExpense = null;

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

    function openDeleteExpenseModal(rubricaId, expenseId) {
      pendingDeleteExpense = { rubricaId, expenseId };
      if (deleteExpenseModalOverlay) {
        deleteExpenseModalOverlay.classList.add("active");
      }
    }

    function closeDeleteExpenseModal() {
      pendingDeleteExpense = null;
      if (deleteExpenseModalOverlay) {
        deleteExpenseModalOverlay.classList.remove("active");
      }
    }

    function openExpenseModal(rubricaId) {
      pendingExpenseRubricaId = rubricaId;
      if (expenseModalOverlay) {
        expenseModalOverlay.classList.add("active");
      }
      if (expenseNameInput) {
        expenseNameInput.value = "";
        expenseNameInput.focus();
      }
    }

    function closeExpenseModal() {
      pendingExpenseRubricaId = null;
      if (expenseModalOverlay) {
        expenseModalOverlay.classList.remove("active");
      }
    }

    function confirmDeleteRubrica() {
      if (!pendingDeleteId) return;
      delete dynamicRubricas[pendingDeleteId];
      saveRubricas();
      renderRubricas();
      closeDeleteModal();
    }

    function confirmDeleteExpense() {
      if (!pendingDeleteExpense) return;

      const { rubricaId, expenseId } = pendingDeleteExpense;
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica || !Array.isArray(rubrica.expenses)) {
        closeDeleteExpenseModal();
        return;
      }

      rubrica.expenses = rubrica.expenses.filter((expense) => expense.id !== expenseId);
      saveRubricas();
      renderRubricas();
      closeDeleteExpenseModal();
    }

    function confirmAddRubrica() {
      const name = rubricaNameInput ? rubricaNameInput.value.trim() : "";
      if (name) {
        const id = generateId();
        dynamicRubricas[id] = {
          name: name,
          collapsed: false,
          expenses: []
        };
        saveRubricas();
        renderRubricas();
        closeModal();
      }
    }

    function confirmAddExpense() {
      const expenseName = expenseNameInput ? expenseNameInput.value.trim() : "";
      if (!expenseName || !pendingExpenseRubricaId || !dynamicRubricas[pendingExpenseRubricaId]) return;

      if (!Array.isArray(dynamicRubricas[pendingExpenseRubricaId].expenses)) {
        dynamicRubricas[pendingExpenseRubricaId].expenses = [];
      }
      dynamicRubricas[pendingExpenseRubricaId].expenses.push({
        id: generateExpenseId(),
        name: expenseName,
        values: Array(12).fill(0)
      });
      saveRubricas();
      renderRubricas();
      closeExpenseModal();
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
    if (deleteExpenseModalClose) deleteExpenseModalClose.addEventListener("click", closeDeleteExpenseModal);
    if (deleteExpenseModalCancel) deleteExpenseModalCancel.addEventListener("click", closeDeleteExpenseModal);
    if (deleteExpenseModalConfirm) deleteExpenseModalConfirm.addEventListener("click", confirmDeleteExpense);
    if (deleteExpenseModalOverlay) {
      deleteExpenseModalOverlay.addEventListener("click", (e) => {
        if (e.target === deleteExpenseModalOverlay) closeDeleteExpenseModal();
      });
    }
    if (expenseModalClose) expenseModalClose.addEventListener("click", closeExpenseModal);
    if (expenseModalCancel) expenseModalCancel.addEventListener("click", closeExpenseModal);
    if (expenseModalConfirm) expenseModalConfirm.addEventListener("click", confirmAddExpense);
    if (expenseModalOverlay) {
      expenseModalOverlay.addEventListener("click", (e) => {
        if (e.target === expenseModalOverlay) closeExpenseModal();
      });
    }
    if (rubricaNameInput) {
      rubricaNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmAddRubrica();
        if (e.key === "Escape") closeModal();
      });
    }
    if (expenseNameInput) {
      expenseNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmAddExpense();
        if (e.key === "Escape") closeExpenseModal();
      });
    }
    document.addEventListener("click", closeRubricaMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeRubricaMenu();
        closeModal();
        closeDeleteModal();
        closeDeleteExpenseModal();
        closeExpenseModal();
      }
    });

    if (addRubricaBtn) {
      addRubricaBtn.addEventListener("click", openModal);
    }

    renderRubricas();
  }
})();
