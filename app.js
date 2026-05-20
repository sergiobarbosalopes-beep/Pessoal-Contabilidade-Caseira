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
            <span class="badge ${badgeClass}">${p.status}</span>
            <span style="margin-left:auto;font-weight:700;">${p.amount}</span>
          </li>
        `;
      })
      .join("");
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
      yearPrev.addEventListener("click", async () => {
        selectedYear--;
        updateYearDisplay();
        renderMonthGrid();
        await loadRubricasFromSupabase();
        renderRubricas();
      });
    }
    if (yearNext) {
      yearNext.addEventListener("click", async () => {
        selectedYear++;
        updateYearDisplay();
        renderMonthGrid();
        await loadRubricasFromSupabase();
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

      // Update column highlight after render
      setTimeout(updateColumnHighlight, 50);
    }

    // ── Column Highlight Overlay ────────────────────────
    function updateColumnHighlight() {
      // Remove existing overlay
      const existingOverlay = document.getElementById("columnHighlightOverlay");
      if (existingOverlay) existingOverlay.remove();

      // Find the active month tile
      const activeTile = monthGrid.querySelector(".month-tile.active");
      if (!activeTile) return;

      // Find the first and last rubrica blocks
      const rubricaBlocks = document.querySelectorAll(".rubrica-block");
      if (rubricaBlocks.length === 0) return;

      const firstRubrica = rubricaBlocks[0];
      const lastRubrica = rubricaBlocks[rubricaBlocks.length - 1];
      
      // Find the last visible element
      // Check if last rubrica has visible (non-collapsed) expenses
      const lastExpensesStack = lastRubrica.querySelector(".rubrica-expenses-stack");
      const isCollapsed = lastExpensesStack && lastExpensesStack.classList.contains("collapsed");
      
      let lastElement;
      if (isCollapsed || !lastExpensesStack) {
        // Use the totals row or rubrica row if collapsed or no expenses
        const totalsRow = lastRubrica.querySelector(".rubrica-totals-row");
        lastElement = totalsRow || lastRubrica.querySelector(".rubrica-row") || lastRubrica;
      } else {
        // Use the last expense grid if expanded
        const lastExpenseGrids = lastRubrica.querySelectorAll(".rubrica-expense-grid");
        lastElement = lastExpenseGrids.length > 0 
          ? lastExpenseGrids[lastExpenseGrids.length - 1] 
          : lastRubrica;
      }

      // Get positions relative to the content section
      const contentSection = monthGrid.closest(".content-section");
      if (!contentSection) return;

      const sectionRect = contentSection.getBoundingClientRect();
      const tileRect = activeTile.getBoundingClientRect();
      const firstRubricaRect = firstRubrica.getBoundingClientRect();
      const lastRect = lastElement.getBoundingClientRect();

      // Calculate overlay dimensions - start from first rubrica, end at last element
      const overlayTop = firstRubricaRect.top - sectionRect.top;
      const overlayHeight = lastRect.bottom - firstRubricaRect.top + 10;
      const overlayLeft = tileRect.left - sectionRect.left;
      const overlayWidth = tileRect.width;

      // Create overlay element
      const overlay = document.createElement("div");
      overlay.id = "columnHighlightOverlay";
      overlay.style.cssText = `
        position: absolute;
        top: ${overlayTop}px;
        left: ${overlayLeft}px;
        width: ${overlayWidth + 8}px;
        height: ${overlayHeight}px;
        background: linear-gradient(180deg, 
          rgba(15,118,110,.10) 0%, 
          rgba(15,118,110,.08) 50%,
          rgba(15,118,110,.06) 100%);
        pointer-events: none;
        z-index: 0;
        border-radius: 12px;
        margin-left: -4px;
        transition: height 0.5s ease-out, top 0.3s ease-out;
      `;

      contentSection.style.position = "relative";
      contentSection.appendChild(overlay);
    }

    // ── Resize handler for column highlight ─────────────
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateColumnHighlight, 100);
    });

    updateYearDisplay();
    renderMonthGrid();

    // ── Supabase Configuration ──────────────────────────
    const SUPABASE_URL = "https://uooovgxrexpstrtfktst.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb292Z3hyZXhwc3RydGZrdHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTkxMjYsImV4cCI6MjA5NDc5NTEyNn0.4zYL75OJAI3Lxzofh9f0fIJ26S5EwHnUKGQuYQcf9mY";

    // Supabase API helper functions
    async function supabaseSelect(table, query = "") {
      const url = `${SUPABASE_URL}/rest/v1/${table}${query ? "?" + query : ""}`;
      const response = await fetch(url, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (!response.ok) throw new Error(`Supabase error: ${response.statusText}`);
      return response.json();
    }

    async function supabaseInsert(table, data) {
      const url = `${SUPABASE_URL}/rest/v1/${table}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Supabase insert error: ${err}`);
      }
      return response.json();
    }

    async function supabaseUpdate(table, match, data) {
      const params = Object.entries(match).map(([k, v]) => `${k}=eq.${v}`).join("&");
      const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Supabase update error: ${err}`);
      }
      return response.json();
    }

    async function supabaseDelete(table, match) {
      const params = Object.entries(match).map(([k, v]) => `${k}=eq.${v}`).join("&");
      const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Supabase delete error: ${err}`);
      }
      return true;
    }

    // ── Dynamic Rubricas ────────────────────────────────
    const rubricasDynamic = document.getElementById("rubricasDynamic");
    const addRubricaBtn = document.getElementById("addRubricaBtn");

    // Rubricas data structure: { id: { name: string, expenses: [{ id, name, values[12] }] } }
    let dynamicRubricas = {};
    let openRubricaMenuId = null;
    let openExpenseMenuId = null;

    // Load rubricas from Supabase for current year (all months)
    async function loadRubricasFromSupabase() {
      try {
        // Load rubricas for current month (to get the list)
        const query = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&order=rubrica_seq.asc`;
        const rubricas = await supabaseSelect("cgd_rubrica", query);
        
        // Load ALL expenses for the entire year (all months)
        const expensesQuery = `ano=eq.${selectedYear}&order=rubrica_id.asc,despesa_id.asc`;
        const allExpenses = await supabaseSelect("cgd_despesa", expensesQuery);
        
        // Load ALL notes for the entire year (only those with nota text)
        const notasQuery = `ano=eq.${selectedYear}&nota=neq.&order=rubrica_id.asc,despesa_id.asc`;
        const allNotas = await supabaseSelect("cgd_despesa_notas", notasQuery);
        
        // Build a map of which expenses have notes per month
        const notasMap = {};
        allNotas.forEach(n => {
          if (n.nota && n.nota.trim() !== "") {
            const key = `${n.rubrica_id}_${n.despesa_id}`;
            if (!notasMap[key]) notasMap[key] = {};
            notasMap[key][n.mes - 1] = true; // mes is 1-indexed
          }
        });
        
        // Convert to local format
        dynamicRubricas = {};
        rubricas.forEach(r => {
          const id = `r_${r.rubrica_id}`;
          dynamicRubricas[id] = {
            dbId: r.rubrica_id,
            name: r.rubrica_desc || "Sem nome",
            collapsed: false,
            seq: r.rubrica_seq,
            tipo: r.rubrica_tipo || "Despesa",
            expenses: []
          };
        });

        // Group expenses by rubrica_id and despesa_id to build values array
        const expenseMap = {};
        allExpenses.forEach(e => {
          const key = `${e.rubrica_id}_${e.despesa_id}`;
          if (!expenseMap[key]) {
            expenseMap[key] = {
              rubrica_id: e.rubrica_id,
              despesa_id: e.despesa_id,
              despesa_desc: e.despesa_desc,
              despesa_seq: e.despesa_seq,
              totalizador: e.totalizador,
              values: Array(12).fill(0),
              hasNotes: notasMap[key] || {}
            };
          }
          // Set value for the specific month (mes is 1-indexed)
          expenseMap[key].values[e.mes - 1] = e.valor || 0;
          // Use the seq from current month if available
          if (e.mes === selectedMonth + 1) {
            expenseMap[key].despesa_seq = e.despesa_seq;
            expenseMap[key].totalizador = e.totalizador;
          }
        });

        // Add expenses to rubricas
        Object.values(expenseMap).forEach(e => {
          const rubricaId = `r_${e.rubrica_id}`;
          if (dynamicRubricas[rubricaId]) {
            dynamicRubricas[rubricaId].expenses.push({
              id: `e_${e.despesa_id}`,
              dbId: e.despesa_id,
              name: e.despesa_desc || "Sem nome",
              values: e.values,
              seq: e.despesa_seq || 1,
              includeInTotal: e.totalizador !== false,
              hasNotes: e.hasNotes,
              history: {}
            });
          }
        });

        // Sort expenses by seq
        Object.values(dynamicRubricas).forEach(rubrica => {
          rubrica.expenses.sort((a, b) => (a.seq || 0) - (b.seq || 0));
        });

        // Load collapsed state from localStorage
        const savedExpenses = localStorage.getItem("cgdDynamicExpenses_" + selectedYear);
        if (savedExpenses) {
          try {
            const expensesData = JSON.parse(savedExpenses);
            Object.keys(dynamicRubricas).forEach(rubricaId => {
              if (expensesData[rubricaId]) {
                dynamicRubricas[rubricaId].collapsed = expensesData[rubricaId].collapsed || false;
              }
            });
          } catch(e) {
            console.warn("Error loading expenses data", e);
          }
        }

        renderRubricas();
      } catch (e) {
        console.error("Error loading rubricas from Supabase:", e);
        // Fallback to localStorage
        loadRubricasFromLocalStorage();
      }
    }

    // Fallback: Load rubricas from localStorage
    function loadRubricasFromLocalStorage() {
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
      renderRubricas();
    }

    // Get next rubrica_id from Supabase
    async function getNextRubricaId() {
      try {
        const query = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&select=rubrica_id&order=rubrica_id.desc&limit=1`;
        const result = await supabaseSelect("cgd_rubrica", query);
        return result.length > 0 ? result[0].rubrica_id + 1 : 1;
      } catch (e) {
        console.error("Error getting next rubrica_id:", e);
        return Date.now();
      }
    }

    // Get next rubrica_seq from Supabase
    async function getNextRubricaSeq() {
      try {
        const query = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&select=rubrica_seq&order=rubrica_seq.desc&limit=1`;
        const result = await supabaseSelect("cgd_rubrica", query);
        return result.length > 0 ? result[0].rubrica_seq + 1 : 1;
      } catch (e) {
        console.error("Error getting next rubrica_seq:", e);
        return 1;
      }
    }

    // Get next rubrica_seq for a specific year/month
    async function getNextRubricaSeqForMonth(ano, mes) {
      try {
        const query = `ano=eq.${ano}&mes=eq.${mes}&select=rubrica_seq&order=rubrica_seq.desc&limit=1`;
        const result = await supabaseSelect("cgd_rubrica", query);
        return result.length > 0 ? result[0].rubrica_seq + 1 : 1;
      } catch (e) {
        console.error("Error getting next rubrica_seq for month:", e);
        return 1;
      }
    }

    // Create rubrica in Supabase
    async function createRubricaInSupabase(name, tipo = "Despesa") {
      const rubricaId = await getNextRubricaId();
      const rubricaSeq = await getNextRubricaSeq();
      
      const data = {
        ano: selectedYear,
        mes: selectedMonth + 1,
        rubrica_id: rubricaId,
        rubrica_desc: name,
        rubrica_seq: rubricaSeq,
        rubrica_tipo: tipo
      };

      await supabaseInsert("cgd_rubrica", data);
      return { rubricaId, rubricaSeq };
    }

    // Update rubrica sequence in Supabase
    async function updateRubricaSeqInSupabase(rubricaId, newSeq) {
      const dbId = typeof rubricaId === "string" && rubricaId.startsWith("r_") 
        ? parseInt(rubricaId.replace("r_", "")) 
        : rubricaId;
      
      await supabaseUpdate("cgd_rubrica", 
        { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: dbId },
        { rubrica_seq: newSeq }
      );
    }

    // Update rubrica name in Supabase
    async function updateRubricaNameInSupabase(rubricaId, newName) {
      const dbId = typeof rubricaId === "string" && rubricaId.startsWith("r_") 
        ? parseInt(rubricaId.replace("r_", "")) 
        : rubricaId;
      
      await supabaseUpdate("cgd_rubrica", 
        { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: dbId },
        { rubrica_desc: newName }
      );
    }

    // Delete rubrica from Supabase
    async function deleteRubricaFromSupabase(rubricaId) {
      const dbId = typeof rubricaId === "string" && rubricaId.startsWith("r_") 
        ? parseInt(rubricaId.replace("r_", "")) 
        : rubricaId;
      
      // First delete all notas for this rubrica in current month
      const notasQuery = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&rubrica_id=eq.${dbId}&select=despesa_id,contador_id`;
      const notas = await supabaseSelect("cgd_despesa_notas", notasQuery);
      for (const nota of notas) {
        await supabaseDelete("cgd_despesa_notas", 
          { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: dbId, despesa_id: nota.despesa_id, contador_id: nota.contador_id }
        );
      }
      
      // Then delete all despesas for this rubrica in current month
      const despesasQuery = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&rubrica_id=eq.${dbId}&select=despesa_id`;
      const despesas = await supabaseSelect("cgd_despesa", despesasQuery);
      for (const despesa of despesas) {
        await supabaseDelete("cgd_despesa", 
          { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: dbId, despesa_id: despesa.despesa_id }
        );
      }
      
      // Then delete the rubrica
      await supabaseDelete("cgd_rubrica", 
        { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: dbId }
      );
    }

    // Delete rubrica from all months in Supabase (including all despesas and notas)
    async function deleteRubricaFromAllMonths(rubricaId) {
      const dbId = typeof rubricaId === "string" && rubricaId.startsWith("r_") 
        ? parseInt(rubricaId.replace("r_", "")) 
        : rubricaId;
      
      // Find all months where this rubrica exists
      const rubricaQuery = `ano=eq.${selectedYear}&rubrica_id=eq.${dbId}&select=mes`;
      const rubricaMonths = await supabaseSelect("cgd_rubrica", rubricaQuery);
      
      // Delete all notas for this rubrica in all months
      const notasQuery = `ano=eq.${selectedYear}&rubrica_id=eq.${dbId}&select=mes,despesa_id,contador_id`;
      const allNotas = await supabaseSelect("cgd_despesa_notas", notasQuery);
      for (const nota of allNotas) {
        await supabaseDelete("cgd_despesa_notas", 
          { ano: selectedYear, mes: nota.mes, rubrica_id: dbId, despesa_id: nota.despesa_id, contador_id: nota.contador_id }
        );
      }
      
      // Delete all despesas for this rubrica in all months
      const despesasQuery = `ano=eq.${selectedYear}&rubrica_id=eq.${dbId}&select=mes,despesa_id`;
      const allDespesas = await supabaseSelect("cgd_despesa", despesasQuery);
      for (const despesa of allDespesas) {
        await supabaseDelete("cgd_despesa", 
          { ano: selectedYear, mes: despesa.mes, rubrica_id: dbId, despesa_id: despesa.despesa_id }
        );
      }
      
      // Delete rubrica from each month
      for (const row of rubricaMonths) {
        await supabaseDelete("cgd_rubrica", 
          { ano: selectedYear, mes: row.mes, rubrica_id: dbId }
        );
      }
    }

    // ── Despesa Supabase Functions ──────────────────────
    
    // Get next despesa_id from Supabase for a rubrica
    async function getNextDespesaId(rubricaDbId) {
      try {
        const query = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&rubrica_id=eq.${rubricaDbId}&select=despesa_id&order=despesa_id.desc&limit=1`;
        const result = await supabaseSelect("cgd_despesa", query);
        return result.length > 0 ? result[0].despesa_id + 1 : 1;
      } catch (e) {
        console.error("Error getting next despesa_id:", e);
        return Date.now();
      }
    }

    // Get next despesa_seq from Supabase for a rubrica
    async function getNextDespesaSeq(rubricaDbId) {
      try {
        const query = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&rubrica_id=eq.${rubricaDbId}&select=despesa_seq&order=despesa_seq.desc&limit=1`;
        const result = await supabaseSelect("cgd_despesa", query);
        return result.length > 0 ? result[0].despesa_seq + 1 : 1;
      } catch (e) {
        console.error("Error getting next despesa_seq:", e);
        return 1;
      }
    }

    // Get next despesa_seq for a specific year/month/rubrica
    async function getNextDespesaSeqForMonth(ano, mes, rubricaDbId) {
      try {
        const query = `ano=eq.${ano}&mes=eq.${mes}&rubrica_id=eq.${rubricaDbId}&select=despesa_seq&order=despesa_seq.desc&limit=1`;
        const result = await supabaseSelect("cgd_despesa", query);
        return result.length > 0 ? result[0].despesa_seq + 1 : 1;
      } catch (e) {
        console.error("Error getting next despesa_seq for month:", e);
        return 1;
      }
    }

    // Create despesa in Supabase
    async function createDespesaInSupabase(rubricaDbId, name, valor = 0, totalizador = true) {
      const despesaId = await getNextDespesaId(rubricaDbId);
      const despesaSeq = await getNextDespesaSeq(rubricaDbId);
      
      const data = {
        ano: selectedYear,
        mes: selectedMonth + 1,
        rubrica_id: rubricaDbId,
        despesa_id: despesaId,
        despesa_desc: name,
        despesa_seq: despesaSeq,
        totalizador: totalizador,
        valor: valor
      };

      await supabaseInsert("cgd_despesa", data);
      return { despesaId, despesaSeq };
    }

    // Update despesa value in Supabase
    async function updateDespesaValueInSupabase(rubricaDbId, despesaDbId, valor) {
      await supabaseUpdate("cgd_despesa", 
        { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: rubricaDbId, despesa_id: despesaDbId },
        { valor: valor }
      );
    }

    // Update despesa value in Supabase for a specific month
    async function updateDespesaValueInSupabaseForMonth(rubricaDbId, despesaDbId, monthIdx, valor) {
      await supabaseUpdate("cgd_despesa", 
        { ano: selectedYear, mes: monthIdx + 1, rubrica_id: rubricaDbId, despesa_id: despesaDbId },
        { valor: valor }
      );
    }

    // Update despesa totalizador in Supabase
    async function updateDespesaTotalizadorInSupabase(rubricaDbId, despesaDbId, totalizador) {
      await supabaseUpdate("cgd_despesa", 
        { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: rubricaDbId, despesa_id: despesaDbId },
        { totalizador: totalizador }
      );
    }

    // Update despesa name in Supabase
    async function updateDespesaNameInSupabase(rubricaDbId, despesaDbId, newName) {
      await supabaseUpdate("cgd_despesa", 
        { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: rubricaDbId, despesa_id: despesaDbId },
        { despesa_desc: newName }
      );
    }

    // Update despesa sequence in Supabase
    async function updateDespesaSeqInSupabase(rubricaDbId, despesaDbId, newSeq) {
      await supabaseUpdate("cgd_despesa", 
        { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: rubricaDbId, despesa_id: despesaDbId },
        { despesa_seq: newSeq }
      );
    }

    // Delete despesa from Supabase
    async function deleteDespesaFromSupabase(rubricaDbId, despesaDbId) {
      // First delete all notas for this despesa
      await deleteDespesaNotasInSupabase(rubricaDbId, despesaDbId);
      
      // Then delete the despesa
      await supabaseDelete("cgd_despesa", 
        { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: rubricaDbId, despesa_id: despesaDbId }
      );
    }

    // Delete despesa from all months in Supabase
    async function deleteDespesaFromAllMonths(rubricaDbId, despesaDbId) {
      // Find all months where this despesa exists
      const query = `ano=eq.${selectedYear}&rubrica_id=eq.${rubricaDbId}&despesa_id=eq.${despesaDbId}&select=mes`;
      const despesaMonths = await supabaseSelect("cgd_despesa", query);
      
      // Delete all notas for this despesa in all months
      const notasQuery = `ano=eq.${selectedYear}&rubrica_id=eq.${rubricaDbId}&despesa_id=eq.${despesaDbId}&select=mes,contador_id`;
      const allNotas = await supabaseSelect("cgd_despesa_notas", notasQuery);
      for (const nota of allNotas) {
        await supabaseDelete("cgd_despesa_notas", 
          { ano: selectedYear, mes: nota.mes, rubrica_id: rubricaDbId, despesa_id: despesaDbId, contador_id: nota.contador_id }
        );
      }
      
      // Delete despesa from each month
      for (const row of despesaMonths) {
        await supabaseDelete("cgd_despesa", 
          { ano: selectedYear, mes: row.mes, rubrica_id: rubricaDbId, despesa_id: despesaDbId }
        );
      }
    }

    // Update all despesa sequences for a rubrica in Supabase
    async function updateAllDespesaSeqsInSupabase(rubricaId) {
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica || !rubrica.expenses) return;
      
      const rubricaDbId = rubrica.dbId || parseInt(rubricaId.replace("r_", ""));
      
      for (let i = 0; i < rubrica.expenses.length; i++) {
        const expense = rubrica.expenses[i];
        const newSeq = i + 1;
        if (expense.seq !== newSeq) {
          expense.seq = newSeq;
          const despesaDbId = expense.dbId || parseInt(expense.id.replace("e_", ""));
          try {
            await updateDespesaSeqInSupabase(rubricaDbId, despesaDbId, newSeq);
          } catch (e) {
            console.error("Error updating despesa seq:", e);
          }
        }
      }
    }

    // ── Despesa Notas Supabase Functions ───────────────────
    
    // Get next contador_id for despesa notas
    async function getNextContadorId(rubricaDbId, despesaDbId) {
      try {
        const query = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&rubrica_id=eq.${rubricaDbId}&despesa_id=eq.${despesaDbId}&select=contador_id&order=contador_id.desc&limit=1`;
        const result = await supabaseSelect("cgd_despesa_notas", query);
        return result.length > 0 ? result[0].contador_id + 1 : 1;
      } catch (e) {
        console.error("Error getting next contador_id:", e);
        return 1;
      }
    }

    // Create despesa nota in Supabase
    async function createDespesaNotaInSupabase(rubricaDbId, despesaDbId, valor, nota) {
      const contadorId = await getNextContadorId(rubricaDbId, despesaDbId);
      
      const data = {
        ano: selectedYear,
        mes: selectedMonth + 1,
        rubrica_id: rubricaDbId,
        despesa_id: despesaDbId,
        contador_id: contadorId,
        valor: valor,
        nota: nota
      };

      await supabaseInsert("cgd_despesa_notas", data);
      return contadorId;
    }

    // Delete all despesa notas for a specific despesa in current month
    async function deleteDespesaNotasInSupabase(rubricaDbId, despesaDbId) {
      // Find all notas for this despesa
      const query = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&rubrica_id=eq.${rubricaDbId}&despesa_id=eq.${despesaDbId}&select=contador_id`;
      const notas = await supabaseSelect("cgd_despesa_notas", query);
      
      // Delete each nota
      for (const nota of notas) {
        await supabaseDelete("cgd_despesa_notas", 
          { ano: selectedYear, mes: selectedMonth + 1, rubrica_id: rubricaDbId, despesa_id: despesaDbId, contador_id: nota.contador_id }
        );
      }
    }

    // Initial load from Supabase
    loadRubricasFromSupabase();

    function saveRubricas() {
      // Save expenses to localStorage (rubricas are in Supabase)
      const expensesData = {};
      Object.entries(dynamicRubricas).forEach(([id, rubrica]) => {
        expensesData[id] = {
          expenses: rubrica.expenses || [],
          collapsed: rubrica.collapsed || false
        };
      });
      localStorage.setItem("cgdDynamicExpenses_" + selectedYear, JSON.stringify(expensesData));
    }

    function generateId() {
      return "r_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    }

    function generateExpenseId() {
      return "e_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    }

    // Event handler functions - declared here to be reused and properly removed
    function onRubricaMenuBtnClick(e) {
      const menuBtn = e.target.closest('.rubrica-menu-btn');
      if (menuBtn) {
        e.stopPropagation();
        const id = menuBtn.dataset.rubricaMenu;
        toggleRubricaMenu(id);
      }
    }

    function onRubricaMenuItemClick(e) {
      const item = e.target.closest('.rubrica-menu-item');
      if (item) {
        e.stopPropagation();
        const action = item.dataset.rubricaAction;
        const id = item.dataset.rubricaId;
        if (!id) return;
        if (action === "rename") {
          openRubricaMenuId = null;
          openRenameRubricaModal(id);
        } else if (action === "add-expense") {
          openRubricaMenuId = null;
          openExpenseModal(id);
        } else if (action === "move-up") {
          openRubricaMenuId = null;
          moveRubricaUp(id);
        } else if (action === "move-down") {
          openRubricaMenuId = null;
          moveRubricaDown(id);
        } else if (action === "delete") {
          openRubricaMenuId = null;
          openDeleteModal(id);
        }
      }
    }

    function onRubricaToggleClick(e) {
      const btn = e.target.closest('.rubrica-toggle-btn');
      if (btn) {
        e.stopPropagation();
        const id = btn.dataset.toggleExpenses;
        toggleRubricaExpenses(id);
      }
    }

    function closeAllExpenseMenus() {
      document.querySelectorAll('.expense-menu-dropdown.open').forEach((el) => {
        el.classList.remove('open');
      });
      openExpenseMenuId = null;
    }

    function onExpenseMenuBtnClick(e) {
      const menuBtn = e.target.closest('.expense-menu-btn');
      if (menuBtn) {
        e.stopPropagation();
        const menuId = menuBtn.getAttribute('data-expense-menu');
        const dropdown = rubricasDynamic.querySelector(`.expense-menu-dropdown[data-expense-menu-dropdown="${menuId}"]`);
        if (dropdown) {
          const isOpen = dropdown.classList.contains('open');
          closeAllExpenseMenus();
          if (!isOpen) {
            dropdown.classList.add('open');
            openExpenseMenuId = menuId;
          }
        }
      }
    }

    function onExpenseMenuItemClick(e) {
      const actionBtn = e.target.closest('.expense-menu-item');
      if (actionBtn) {
        e.stopPropagation();
        const action = actionBtn.getAttribute('data-expense-action');
        const rubricaId = actionBtn.getAttribute('data-rubrica-id');
        const expenseId = actionBtn.getAttribute('data-expense-id');
        if (action === 'rename') {
          openRenameExpenseModal(rubricaId, expenseId);
        } else if (action === 'move-up') {
          moveExpenseUp(rubricaId, expenseId);
        } else if (action === 'move-down') {
          moveExpenseDown(rubricaId, expenseId);
        } else if (action === 'delete') {
          openDeleteExpenseModal(rubricaId, expenseId);
        }
        closeAllExpenseMenus();
      }
    }

    function onGlobalMenuClose(e) {
      const isClickOnRubricaMenu = e.target.closest('.rubrica-menu-btn') || e.target.closest('.rubrica-menu-dropdown');
      const isClickOnExpenseMenu = e.target.closest('.expense-menu-btn') || e.target.closest('.expense-menu-dropdown');
      if (!isClickOnRubricaMenu && !isClickOnExpenseMenu) {
        closeAllExpenseMenus();
        closeRubricaMenu();
      }
    }

    function onMenuEscape(e) {
      if (e.key === 'Escape') closeAllExpenseMenus();
    }

    function renderRubricas() {
      if (!rubricasDynamic) return;
      
      const entries = Object.entries(dynamicRubricas);
      rubricasDynamic.innerHTML = entries.map(([id, rubrica], index) => {
        const canMoveUp = index > 0;
        const canMoveDown = index < entries.length - 1;
        const isCollapsed = !!rubrica.collapsed;
        const expenses = Array.isArray(rubrica.expenses) ? rubrica.expenses : [];
        
        // Calculate totals per month (only expenses with includeInTotal !== false)
        const monthlyTotals = Array.from({ length: 12 }, (_, monthIdx) => {
          return expenses
            .filter(exp => exp.includeInTotal !== false)
            .reduce((sum, exp) => sum + (parseFloat(exp.values?.[monthIdx]) || 0), 0);
        });
        
        // Generate totals row HTML
        const totalsRowHtml = expenses.length > 0 ? `
          <div class="rubrica-totals-row">
            <div class="rubrica-totals-grid">
              ${Array.from({ length: 12 }, (_, monthIdx) => {
                const total = monthlyTotals[monthIdx];
                const displayTotal = total.toFixed(2);
                const isActive = monthIdx === selectedMonth;
                return `
                  <div class="expense-input-tile total-tile ${isActive ? "is-active" : ""}">
                    <span class="total-value">${displayTotal}</span>
                    <span class="expense-currency">€</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        ` : "";
        
        const expensesHtml = expenses.length
          ? `<div class="rubrica-expenses-stack ${isCollapsed ? "collapsed" : ""}">${expenses
              .map((expense, expenseIndex) => {
                const canMoveExpenseUp = expenseIndex > 0;
                const canMoveExpenseDown = expenseIndex < expenses.length - 1;
                const tilesHtml = Array.from({ length: 12 }, (_, monthIdx) => {
                  const value = parseFloat(expense.values?.[monthIdx]) || 0;
                  const displayValue = value > 0 ? value.toFixed(2) : "";
                  const isEditable = monthIdx === selectedMonth;
                  // Check if this month has notes with text (from DB)
                  const hasNote = expense.hasNotes?.[monthIdx] === true;
                  return `
                    <div class="expense-input-tile ${isEditable ? "is-editable is-clickable" : "is-locked"}">
                      ${hasNote ? '<span class="note-indicator"></span>' : ''}
                      <input
                        type="text"
                        class="expense-input ${isEditable ? "editable" : "locked"}"
                        data-expense-input="true"
                        data-rubrica-id="${id}"
                        data-expense-id="${expense.id}"
                        data-month="${monthIdx}"
                        value="${displayValue}"
                        placeholder="0.00"
                        readonly
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
                        <button class="expense-menu-btn" data-expense-menu="${id}::${expense.id}" aria-label="Ações da despesa">⋯</button>
                        <div class="expense-menu-dropdown" data-expense-menu-dropdown="${id}::${expense.id}">
                          <button class="expense-menu-item" data-expense-action="rename" data-rubrica-id="${id}" data-expense-id="${expense.id}"><span class="menu-icon edit">✎</span><span>Renomear despesa</span></button>
                          <button class="expense-menu-item" data-expense-action="move-up" data-rubrica-id="${id}" data-expense-id="${expense.id}" ${!canMoveExpenseUp ? "disabled" : ""}><span class="menu-icon up">▲</span><span>Mover para cima</span></button>
                          <button class="expense-menu-item" data-expense-action="move-down" data-rubrica-id="${id}" data-expense-id="${expense.id}" ${!canMoveExpenseDown ? "disabled" : ""}><span class="menu-icon down">▼</span><span>Mover para baixo</span></button>
                          <button class="expense-menu-item danger" data-expense-action="delete" data-rubrica-id="${id}" data-expense-id="${expense.id}"><span class="menu-icon delete">×</span><span>Eliminar despesa</span></button>
                        </div>
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
                  <button class="rubrica-toggle-btn" data-toggle-expenses="${id}" aria-label="${isCollapsed ? "Expandir despesas" : "Colapsar despesas"}">${isCollapsed ? "⮞" : "⮟"}</button>
                  <button class="rubrica-menu-btn" data-rubrica-menu="${id}" aria-label="Ações da rubrica">⋯</button>
                  <div class="rubrica-menu-dropdown ${openRubricaMenuId === id ? "open" : ""}" data-rubrica-menu-dropdown="${id}">
                    <button class="rubrica-menu-item" data-rubrica-action="rename" data-rubrica-id="${id}"><span class="menu-icon edit">✎</span><span>Renomear rubrica</span></button>
                    <button class="rubrica-menu-item" data-rubrica-action="add-expense" data-rubrica-id="${id}"><span class="menu-icon add">＋</span><span>Adicionar despesa</span></button>
                    <button class="rubrica-menu-item" data-rubrica-action="move-up" data-rubrica-id="${id}" ${!canMoveUp ? "disabled" : ""}><span class="menu-icon up">▲</span><span>Mover para cima</span></button>
                    <button class="rubrica-menu-item" data-rubrica-action="move-down" data-rubrica-id="${id}" ${!canMoveDown ? "disabled" : ""}><span class="menu-icon down">▼</span><span>Mover para baixo</span></button>
                    <button class="rubrica-menu-item danger" data-rubrica-action="delete" data-rubrica-id="${id}"><span class="menu-icon delete">×</span><span>Eliminar rubrica</span></button>
                  </div>
                </div>
              </div>
              ${totalsRowHtml}
            </div>
            ${expensesHtml}
          </div>
        `;
      }).join("");

      // Add event listeners for rubrica action menu toggle
      rubricasDynamic.removeEventListener('click', onRubricaMenuBtnClick);
      rubricasDynamic.addEventListener('click', onRubricaMenuBtnClick);
      rubricasDynamic.removeEventListener('click', onRubricaMenuItemClick);
      rubricasDynamic.addEventListener('click', onRubricaMenuItemClick);
      rubricasDynamic.removeEventListener('click', onRubricaToggleClick);
      rubricasDynamic.addEventListener('click', onRubricaToggleClick);

      // Add expense menu listeners
      rubricasDynamic.removeEventListener('click', onExpenseMenuBtnClick);
      rubricasDynamic.addEventListener('click', onExpenseMenuBtnClick);
      rubricasDynamic.removeEventListener('click', onExpenseMenuItemClick);
      rubricasDynamic.addEventListener('click', onExpenseMenuItemClick);

      // Global menu close handlers
      document.removeEventListener('click', onGlobalMenuClose);
      document.addEventListener('click', onGlobalMenuClose);
      document.removeEventListener('keydown', onMenuEscape);
      document.addEventListener('keydown', onMenuEscape);

      // Add click handlers for editable expense tiles to open value modal
      rubricasDynamic.querySelectorAll(".expense-input-tile.is-clickable").forEach(tile => {
        tile.addEventListener("click", () => {
          const input = tile.querySelector("input[data-expense-input='true']");
          if (!input) return;
          
          const rubricaId = input.dataset.rubricaId;
          const expenseId = input.dataset.expenseId;
          const monthIdx = parseInt(input.dataset.month, 10);
          
          // Get expense name for title
          const rubrica = dynamicRubricas[rubricaId];
          if (!rubrica) return;
          const expense = rubrica.expenses.find(e => e.id === expenseId);
          if (!expense) return;
          
          openValueModal(rubricaId, expenseId, monthIdx, expense.name);
        });
      });

      // Update column highlight after rubricas render
      setTimeout(updateColumnHighlight, 50);
    }

    // Update all rubrica sequences in Supabase after reorder
    async function updateAllRubricaSeqsInSupabase() {
      const entries = Object.entries(dynamicRubricas);
      for (let i = 0; i < entries.length; i++) {
        const [id, rubrica] = entries[i];
        const newSeq = i + 1;
        if (rubrica.seq !== newSeq) {
          rubrica.seq = newSeq;
          try {
            await updateRubricaSeqInSupabase(rubrica.dbId || id, newSeq);
          } catch (e) {
            console.error("Error updating rubrica seq:", e);
          }
        }
      }
    }

    function moveRubricaUp(id) {
      const entries = Object.entries(dynamicRubricas);
      const idx = entries.findIndex(([k]) => k === id);
      if (idx > 0) {
        const rubrica = dynamicRubricas[id];
        const wasExpanded = !rubrica.collapsed;

        // Step 1: Collapse with animation
        const stackElement = document.querySelector(`.rubrica-block[data-id='${id}'] .rubrica-expenses-stack`);
        const toggleBtn = document.querySelector(`.rubrica-toggle-btn[data-toggle-expenses='${id}']`);
        
        if (stackElement && wasExpanded) {
          stackElement.classList.add('collapsed');
          if (toggleBtn) toggleBtn.textContent = '⮞';
        }

        // Step 2: Wait for collapse animation, then animate movement
        const collapseDelay = wasExpanded ? 650 : 0;
        
        setTimeout(() => {
          const blocks = document.querySelectorAll('.rubrica-block');
          const current = blocks[idx];
          const prev = blocks[idx - 1];
          
          if (current && prev) {
            const currentHeight = current.offsetHeight;
            const prevHeight = prev.offsetHeight;

            current.classList.add('moving');
            prev.classList.add('moving');
            current.style.height = currentHeight + 'px';
            prev.style.height = prevHeight + 'px';
            
            current.style.transform = 'translateY(-100%)';
            prev.style.transform = 'translateY(100%)';
            
            // Step 3: After movement, swap and render
            setTimeout(() => {
              current.classList.remove('moving');
              prev.classList.remove('moving');
              current.style.transform = '';
              prev.style.transform = '';
              current.style.height = '';
              prev.style.height = '';
              
              [entries[idx - 1], entries[idx]] = [entries[idx], entries[idx - 1]];
              dynamicRubricas = Object.fromEntries(entries);
              
              // Keep collapsed state for render
              if (wasExpanded) {
                rubrica.collapsed = true;
              }
              
              saveRubricas();
              updateAllRubricaSeqsInSupabase();
              renderRubricas();
              
              // Step 4: After render, expand with animation
              if (wasExpanded) {
                setTimeout(() => {
                  rubrica.collapsed = false;
                  const newStackElement = document.querySelector(`.rubrica-block[data-id='${id}'] .rubrica-expenses-stack`);
                  const newToggleBtn = document.querySelector(`.rubrica-toggle-btn[data-toggle-expenses='${id}']`);
                  if (newStackElement) {
                    newStackElement.classList.remove('collapsed');
                  }
                  if (newToggleBtn) newToggleBtn.textContent = '⮟';
                  saveRubricas();
                  // Update column highlight during expansion animation
                  setTimeout(updateColumnHighlight, 100);
                  setTimeout(updateColumnHighlight, 300);
                  setTimeout(updateColumnHighlight, 500);
                  setTimeout(updateColumnHighlight, 700);
                }, 50);
              } else {
                setTimeout(updateColumnHighlight, 50);
              }
            }, 420);
          } else {
            [entries[idx - 1], entries[idx]] = [entries[idx], entries[idx - 1]];
            dynamicRubricas = Object.fromEntries(entries);
            saveRubricas();
            updateAllRubricaSeqsInSupabase();
            if (wasExpanded) {
              rubrica.collapsed = false;
            }
            renderRubricas();
          }
        }, collapseDelay);
      }
    }

    function moveRubricaDown(id) {
      const entries = Object.entries(dynamicRubricas);
      const idx = entries.findIndex(([k]) => k === id);
      if (idx < entries.length - 1) {
        const rubrica = dynamicRubricas[id];
        const wasExpanded = !rubrica.collapsed;

        // Step 1: Collapse with animation
        const stackElement = document.querySelector(`.rubrica-block[data-id='${id}'] .rubrica-expenses-stack`);
        const toggleBtn = document.querySelector(`.rubrica-toggle-btn[data-toggle-expenses='${id}']`);
        
        if (stackElement && wasExpanded) {
          stackElement.classList.add('collapsed');
          if (toggleBtn) toggleBtn.textContent = '⮞';
        }

        // Step 2: Wait for collapse animation, then animate movement
        const collapseDelay = wasExpanded ? 650 : 0;
        
        setTimeout(() => {
          const blocks = document.querySelectorAll('.rubrica-block');
          const current = blocks[idx];
          const next = blocks[idx + 1];
          
          if (current && next) {
            const currentHeight = current.offsetHeight;
            const nextHeight = next.offsetHeight;

            current.classList.add('moving');
            next.classList.add('moving');
            current.style.height = currentHeight + 'px';
            next.style.height = nextHeight + 'px';
            
            current.style.transform = 'translateY(100%)';
            next.style.transform = 'translateY(-100%)';
            
            // Step 3: After movement, swap and render
            setTimeout(() => {
              current.classList.remove('moving');
              next.classList.remove('moving');
              current.style.transform = '';
              next.style.transform = '';
              current.style.height = '';
              next.style.height = '';
              
              [entries[idx], entries[idx + 1]] = [entries[idx + 1], entries[idx]];
              dynamicRubricas = Object.fromEntries(entries);
              
              // Keep collapsed state for render
              if (wasExpanded) {
                rubrica.collapsed = true;
              }
              
              saveRubricas();
              updateAllRubricaSeqsInSupabase();
              renderRubricas();
              
              // Step 4: After render, expand with animation
              if (wasExpanded) {
                setTimeout(() => {
                  rubrica.collapsed = false;
                  const newStackElement = document.querySelector(`.rubrica-block[data-id='${id}'] .rubrica-expenses-stack`);
                  const newToggleBtn = document.querySelector(`.rubrica-toggle-btn[data-toggle-expenses='${id}']`);
                  if (newStackElement) {
                    newStackElement.classList.remove('collapsed');
                  }
                  if (newToggleBtn) newToggleBtn.textContent = '⮟';
                  saveRubricas();
                  // Update column highlight during expansion animation
                  setTimeout(updateColumnHighlight, 100);
                  setTimeout(updateColumnHighlight, 300);
                  setTimeout(updateColumnHighlight, 500);
                  setTimeout(updateColumnHighlight, 700);
                }, 50);
              } else {
                setTimeout(updateColumnHighlight, 50);
              }
            }, 420);
          } else {
            [entries[idx], entries[idx + 1]] = [entries[idx + 1], entries[idx]];
            dynamicRubricas = Object.fromEntries(entries);
            saveRubricas();
            updateAllRubricaSeqsInSupabase();
            if (wasExpanded) {
              rubrica.collapsed = false;
            }
            renderRubricas();
          }
        }, collapseDelay);
      }
    }

    function moveExpenseUp(rubricaId, expenseId) {
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica || !Array.isArray(rubrica.expenses)) return;

      const idx = rubrica.expenses.findIndex((e) => e.id === expenseId);
      if (idx > 0) {
        const rows = document.querySelectorAll(`.rubrica-block[data-id='${rubricaId}'] .rubrica-expense-row`);
        const current = rows[idx];
        const prev = rows[idx - 1];
        if (current && prev) {
          const currentHeight = current.offsetHeight;
          const prevHeight = prev.offsetHeight;

          current.classList.add('moving');
          prev.classList.add('moving');
          current.style.height = currentHeight + 'px';
          prev.style.height = prevHeight + 'px';
          
          current.style.transform = 'translateY(-100%)';
          prev.style.transform = 'translateY(100%)';
          
          setTimeout(() => {
            current.classList.remove('moving');
            prev.classList.remove('moving');
            current.style.transform = '';
            prev.style.transform = '';
            current.style.height = '';
            prev.style.height = '';
            
            [rubrica.expenses[idx - 1], rubrica.expenses[idx]] = [rubrica.expenses[idx], rubrica.expenses[idx - 1]];
            saveRubricas();
            updateAllDespesaSeqsInSupabase(rubricaId); // Update Supabase
            renderRubricas();
          }, 420);
        } else {
          [rubrica.expenses[idx - 1], rubrica.expenses[idx]] = [rubrica.expenses[idx], rubrica.expenses[idx - 1]];
          saveRubricas();
          updateAllDespesaSeqsInSupabase(rubricaId); // Update Supabase
          renderRubricas();
        }
      }
    }

    function moveExpenseDown(rubricaId, expenseId) {
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica || !Array.isArray(rubrica.expenses)) return;

      const idx = rubrica.expenses.findIndex((e) => e.id === expenseId);
      if (idx !== -1 && idx < rubrica.expenses.length - 1) {
        const rows = document.querySelectorAll(`.rubrica-block[data-id='${rubricaId}'] .rubrica-expense-row`);
        const current = rows[idx];
        const next = rows[idx + 1];
        if (current && next) {
          const currentHeight = current.offsetHeight;
          const nextHeight = next.offsetHeight;

          current.classList.add('moving');
          next.classList.add('moving');
          current.style.height = currentHeight + 'px';
          next.style.height = nextHeight + 'px';
          
          current.style.transform = 'translateY(100%)';
          next.style.transform = 'translateY(-100%)';
          
          setTimeout(() => {
            current.classList.remove('moving');
            next.classList.remove('moving');
            current.style.transform = '';
            next.style.transform = '';
            current.style.height = '';
            next.style.height = '';
            
            [rubrica.expenses[idx], rubrica.expenses[idx + 1]] = [rubrica.expenses[idx + 1], rubrica.expenses[idx]];
            saveRubricas();
            updateAllDespesaSeqsInSupabase(rubricaId); // Update Supabase
            renderRubricas();
          }, 420);
        } else {
          [rubrica.expenses[idx], rubrica.expenses[idx + 1]] = [rubrica.expenses[idx + 1], rubrica.expenses[idx]];
          saveRubricas();
          updateAllDespesaSeqsInSupabase(rubricaId); // Update Supabase
          renderRubricas();
        }
      }
    }

    function toggleRubricaExpenses(id) {
      const rubrica = dynamicRubricas[id];
      if (!rubrica) return;

      const stackElement = document.querySelector(`.rubrica-block[data-id='${id}'] .rubrica-expenses-stack`);
      const toggleBtn = document.querySelector(`.rubrica-toggle-btn[data-toggle-expenses='${id}']`);

      rubrica.collapsed = !rubrica.collapsed;
      saveRubricas();

      if (stackElement) {
        if (rubrica.collapsed) {
          // Collapsing - add class and update button immediately
          stackElement.classList.add('collapsed');
          if (toggleBtn) toggleBtn.textContent = '⮞';
        } else {
          // Expanding - remove class to trigger animation, then update button
          stackElement.classList.remove('collapsed');
          if (toggleBtn) toggleBtn.textContent = '⮟';
        }
        // Update column highlight during animation
        // Use multiple updates to follow the animation
        setTimeout(updateColumnHighlight, 100);
        setTimeout(updateColumnHighlight, 300);
        setTimeout(updateColumnHighlight, 500);
        setTimeout(updateColumnHighlight, 700);
      } else {
        renderRubricas();
      }
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
    const rubricaAllMonths = document.getElementById("rubricaAllMonths");
    const deleteModalOverlay = document.getElementById("deleteModalOverlay");
    const deleteModalClose = document.getElementById("deleteModalClose");
    const deleteModalCancel = document.getElementById("deleteModalCancel");
    const deleteModalConfirm = document.getElementById("deleteModalConfirm");
    const deleteRubricaAllMonths = document.getElementById("deleteRubricaAllMonths");
    const deleteExpenseModalOverlay = document.getElementById("deleteExpenseModalOverlay");
    const deleteExpenseModalClose = document.getElementById("deleteExpenseModalClose");
    const deleteExpenseModalCancel = document.getElementById("deleteExpenseModalCancel");
    const deleteExpenseModalConfirm = document.getElementById("deleteExpenseModalConfirm");
    const deleteExpenseAllMonths = document.getElementById("deleteExpenseAllMonths");
    const expenseModalOverlay = document.getElementById("expenseModalOverlay");
    const expenseModalClose = document.getElementById("expenseModalClose");
    const expenseModalCancel = document.getElementById("expenseModalCancel");
    const expenseModalConfirm = document.getElementById("expenseModalConfirm");
    const expenseNameInput = document.getElementById("expenseNameInput");
    const expenseAllMonths = document.getElementById("expenseAllMonths");
    // Value edit modal elements
    const valueModalOverlay = document.getElementById("valueModalOverlay");
    const valueModalClose = document.getElementById("valueModalClose");
    const valueModalCancel = document.getElementById("valueModalCancel");
    const valueModalConfirm = document.getElementById("valueModalConfirm");
    const valueModalTitle = document.getElementById("valueModalTitle");
    const valueCurrentInput = document.getElementById("valueCurrentInput");
    const valueAddInput = document.getElementById("valueAddInput");
    const valueSubtractInput = document.getElementById("valueSubtractInput");
    const valueNoteRow = document.getElementById("valueNoteRow");
    const valueNoteInput = document.getElementById("valueNoteInput");
    const valueHistory = document.getElementById("valueHistory");
    const valueHistoryList = document.getElementById("valueHistoryList");
    const valueHistoryClear = document.getElementById("valueHistoryClear");
    const valueIncludeInTotal = document.getElementById("valueIncludeInTotal");
    // Rename rubrica modal elements
    const renameRubricaModalOverlay = document.getElementById("renameRubricaModalOverlay");
    const renameRubricaModalClose = document.getElementById("renameRubricaModalClose");
    const renameRubricaModalCancel = document.getElementById("renameRubricaModalCancel");
    const renameRubricaModalConfirm = document.getElementById("renameRubricaModalConfirm");
    const renameRubricaInput = document.getElementById("renameRubricaInput");
    // Rename expense modal elements
    const renameExpenseModalOverlay = document.getElementById("renameExpenseModalOverlay");
    const renameExpenseModalClose = document.getElementById("renameExpenseModalClose");
    const renameExpenseModalCancel = document.getElementById("renameExpenseModalCancel");
    const renameExpenseModalConfirm = document.getElementById("renameExpenseModalConfirm");
    const renameExpenseInput = document.getElementById("renameExpenseInput");
    let pendingDeleteId = null;
    let pendingExpenseRubricaId = null;
    let pendingDeleteExpense = null;
    let pendingValueEdit = null; // { rubricaId, expenseId, monthIdx, originalValue }
    let pendingRenameRubricaId = null;
    let pendingRenameExpense = null; // { rubricaId, expenseId }

    function openModal() {
      if (modalOverlay) {
        modalOverlay.classList.add("active");
        if (rubricaNameInput) {
          rubricaNameInput.value = "";
          setTimeout(() => rubricaNameInput.focus(), 100);
        }
        if (rubricaAllMonths) {
          rubricaAllMonths.checked = true;
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
      
      // Get rubrica name to display
      const rubrica = dynamicRubricas[id];
      const deleteRubricaNameEl = document.getElementById("deleteRubricaName");
      if (deleteRubricaNameEl && rubrica) {
        deleteRubricaNameEl.textContent = rubrica.name;
      }
      
      if (deleteModalOverlay) {
        deleteModalOverlay.classList.add("active");
      }
      if (deleteRubricaAllMonths) {
        deleteRubricaAllMonths.checked = true;
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
      
      // Get expense name to display
      const rubrica = dynamicRubricas[rubricaId];
      const expense = rubrica?.expenses?.find(e => e.id === expenseId);
      const deleteExpenseNameEl = document.getElementById("deleteExpenseName");
      if (deleteExpenseNameEl && expense) {
        deleteExpenseNameEl.textContent = expense.name;
      }
      
      if (deleteExpenseModalOverlay) {
        deleteExpenseModalOverlay.classList.add("active");
      }
      if (deleteExpenseAllMonths) {
        deleteExpenseAllMonths.checked = true;
      }
    }

    function closeDeleteExpenseModal() {
      pendingDeleteExpense = null;
      if (deleteExpenseModalOverlay) {
        deleteExpenseModalOverlay.classList.remove("active");
      }
    }

    function openRenameRubricaModal(id) {
      const rubrica = dynamicRubricas[id];
      if (!rubrica) return;
      pendingRenameRubricaId = id;
      if (renameRubricaInput) {
        renameRubricaInput.value = rubrica.name;
      }
      if (renameRubricaModalOverlay) {
        renameRubricaModalOverlay.classList.add("active");
        setTimeout(() => {
          renameRubricaInput?.focus();
          renameRubricaInput?.select();
        }, 100);
      }
    }

    function closeRenameRubricaModal() {
      pendingRenameRubricaId = null;
      if (renameRubricaModalOverlay) {
        renameRubricaModalOverlay.classList.remove("active");
      }
    }

    function confirmRenameRubrica() {
      if (!pendingRenameRubricaId) return;
      const newName = renameRubricaInput?.value?.trim();
      if (!newName) {
        closeRenameRubricaModal();
        return;
      }
      const rubrica = dynamicRubricas[pendingRenameRubricaId];
      if (rubrica) {
        rubrica.name = newName;
        saveRubricas();
        renderRubricas();
      }
      closeRenameRubricaModal();
    }

    function openRenameExpenseModal(rubricaId, expenseId) {
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica) return;
      const expense = rubrica.expenses?.find(e => e.id === expenseId);
      if (!expense) return;
      pendingRenameExpense = { rubricaId, expenseId };
      if (renameExpenseInput) {
        renameExpenseInput.value = expense.name;
      }
      if (renameExpenseModalOverlay) {
        renameExpenseModalOverlay.classList.add("active");
        setTimeout(() => {
          renameExpenseInput?.focus();
          renameExpenseInput?.select();
        }, 100);
      }
    }

    function closeRenameExpenseModal() {
      pendingRenameExpense = null;
      if (renameExpenseModalOverlay) {
        renameExpenseModalOverlay.classList.remove("active");
      }
    }

    async function confirmRenameExpense() {
      if (!pendingRenameExpense) return;
      const { rubricaId, expenseId } = pendingRenameExpense;
      const newName = renameExpenseInput?.value?.trim();
      if (!newName) {
        closeRenameExpenseModal();
        return;
      }
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica) {
        closeRenameExpenseModal();
        return;
      }
      const expense = rubrica.expenses?.find(e => e.id === expenseId);
      if (expense) {
        expense.name = newName;
        
        // Update Supabase
        const rubricaDbId = rubrica.dbId || parseInt(rubricaId.replace("r_", ""));
        const despesaDbId = expense.dbId || parseInt(expenseId.replace("e_", ""));
        
        try {
          await updateDespesaNameInSupabase(rubricaDbId, despesaDbId, newName);
        } catch (e) {
          console.error("Error updating expense name in Supabase:", e);
        }
        
        saveRubricas();
        renderRubricas();
      }
      closeRenameExpenseModal();
    }

    function openExpenseModal(rubricaId) {
      pendingExpenseRubricaId = rubricaId;
      if (expenseModalOverlay) {
        expenseModalOverlay.classList.add("active");
      }
      if (expenseNameInput) {
        expenseNameInput.value = "";
        setTimeout(() => expenseNameInput.focus(), 100);
      }
      if (expenseAllMonths) {
        expenseAllMonths.checked = true;
      }
    }

    function closeExpenseModal() {
      pendingExpenseRubricaId = null;
      if (expenseModalOverlay) {
        expenseModalOverlay.classList.remove("active");
      }
    }

    function openValueModal(rubricaId, expenseId, monthIdx, expenseName) {
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica) return;
      const expense = rubrica.expenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      const currentValue = parseFloat(expense.values?.[monthIdx]) || 0;
      pendingValueEdit = { rubricaId, expenseId, monthIdx, originalValue: currentValue };
      
      // Set modal title with expense name
      if (valueModalTitle) {
        valueModalTitle.textContent = expenseName || "Editar Valor";
      }
      
      // Set current value
      if (valueCurrentInput) {
        valueCurrentInput.value = currentValue > 0 ? currentValue.toFixed(2) : "";
      }
      
      // Clear add/subtract inputs and note
      if (valueAddInput) valueAddInput.value = "";
      if (valueSubtractInput) valueSubtractInput.value = "";
      if (valueNoteInput) valueNoteInput.value = "";
      if (valueNoteRow) valueNoteRow.style.display = "none";
      
      // Set include in total toggle (default true if undefined)
      if (valueIncludeInTotal) {
        const includeInTotal = expense.includeInTotal !== undefined ? expense.includeInTotal : true;
        valueIncludeInTotal.checked = includeInTotal;
      }
      
      // Reset apply all months toggle (default off)
      const valueApplyAllMonths = document.getElementById("valueApplyAllMonths");
      if (valueApplyAllMonths) {
        valueApplyAllMonths.checked = false;
      }
      
      // Load history from Supabase
      const rubricaDbId = rubrica.dbId || parseInt(rubricaId.replace("r_", ""));
      const despesaDbId = expense.dbId || parseInt(expenseId.replace("e_", ""));
      loadAndRenderValueHistory(rubricaDbId, despesaDbId);
      
      // Show modal
      if (valueModalOverlay) {
        valueModalOverlay.classList.add("active");
        // Focus add input by default
        if (valueAddInput) {
          setTimeout(() => valueAddInput.focus(), 100);
        }
      }
    }
    
    // Function to show/hide note field based on add/subtract inputs
    function updateNoteFieldVisibility() {
      const addVal = parseFloat((valueAddInput?.value || "").replace(',', '.')) || 0;
      const subtractVal = parseFloat((valueSubtractInput?.value || "").replace(',', '.')) || 0;
      
      if (valueNoteRow) {
        if (addVal > 0 || subtractVal > 0) {
          valueNoteRow.style.display = "block";
        } else {
          valueNoteRow.style.display = "none";
        }
      }
    }
    
    // Add event listeners for add/subtract inputs to show/hide note field
    if (valueAddInput) {
      valueAddInput.addEventListener("input", updateNoteFieldVisibility);
    }
    if (valueSubtractInput) {
      valueSubtractInput.addEventListener("input", updateNoteFieldVisibility);
    }
    
    // Load history from Supabase and render
    async function loadAndRenderValueHistory(rubricaDbId, despesaDbId) {
      if (!valueHistory || !valueHistoryList) return;
      
      try {
        const query = `ano=eq.${selectedYear}&mes=eq.${selectedMonth + 1}&rubrica_id=eq.${rubricaDbId}&despesa_id=eq.${despesaDbId}&order=contador_id.asc`;
        const notas = await supabaseSelect("cgd_despesa_notas", query);
        
        if (notas.length === 0) {
          valueHistory.classList.remove("has-entries");
          valueHistoryList.innerHTML = "";
          return;
        }
        
        valueHistory.classList.add("has-entries");
        valueHistoryList.innerHTML = notas.map((entry) => {
          const sign = entry.valor >= 0 ? "+" : "";
          const typeClass = entry.valor >= 0 ? "add" : "subtract";
          const noteText = entry.nota || "";
          return `
            <div class="value-history-entry ${typeClass}">
              <span class="entry-value">${sign}${parseFloat(entry.valor).toFixed(2)} €</span>
              <span class="entry-note-text">${noteText}</span>
            </div>
          `;
        }).join("");
      } catch (e) {
        console.error("Error loading despesa notas:", e);
        valueHistory.classList.remove("has-entries");
        valueHistoryList.innerHTML = "";
      }
    }
    
    async function clearValueHistory() {
      if (!pendingValueEdit) return;
      
      const { rubricaId, expenseId, monthIdx } = pendingValueEdit;
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica) return;
      const expense = rubrica.expenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      // Delete notas from Supabase
      const rubricaDbId = rubrica.dbId || parseInt(rubricaId.replace("r_", ""));
      const despesaDbId = expense.dbId || parseInt(expenseId.replace("e_", ""));
      
      try {
        await deleteDespesaNotasInSupabase(rubricaDbId, despesaDbId);
      } catch (e) {
        console.error("Error deleting despesa notas:", e);
      }
      
      // Clear history for this month
      if (expense.history) {
        expense.history[monthIdx] = [];
      }
      
      // Clear hasNotes for this month
      if (expense.hasNotes) {
        delete expense.hasNotes[monthIdx];
      }
      
      // Re-render from Supabase (will show empty)
      await loadAndRenderValueHistory(rubricaDbId, despesaDbId);
      saveRubricas();
      renderRubricas();
    }

    function closeValueModal() {
      pendingValueEdit = null;
      if (valueModalOverlay) {
        valueModalOverlay.classList.remove("active");
      }
    }

    async function confirmValueChange() {
      if (!pendingValueEdit) return;
      
      const { rubricaId, expenseId, monthIdx, originalValue } = pendingValueEdit;
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica) {
        closeValueModal();
        return;
      }
      const expense = rubrica.expenses.find(e => e.id === expenseId);
      if (!expense) {
        closeValueModal();
        return;
      }
      
      // Parse input values
      const currentVal = parseFloat((valueCurrentInput?.value || "").replace(',', '.')) || 0;
      const addVal = parseFloat((valueAddInput?.value || "").replace(',', '.')) || 0;
      const subtractVal = parseFloat((valueSubtractInput?.value || "").replace(',', '.')) || 0;
      const noteText = valueNoteInput?.value?.trim() || "";
      
      let newValue;
      const now = new Date().toISOString();
      
      // Initialize history array for this month if not exists
      if (!expense.history) expense.history = {};
      if (!expense.history[monthIdx]) expense.history[monthIdx] = [];
      
      // Get Supabase IDs
      const rubricaDbId = rubrica.dbId || parseInt(rubricaId.replace("r_", ""));
      const despesaDbId = expense.dbId || parseInt(expenseId.replace("e_", ""));
      
      // If current value was modified directly, use it and clear history
      if (Math.abs(currentVal - originalValue) > 0.001) {
        newValue = currentVal;
        // Clear history when value is set directly
        expense.history[monthIdx] = [];
        
        // Clear hasNotes for this month
        if (!expense.hasNotes) expense.hasNotes = {};
        delete expense.hasNotes[monthIdx];
        
        // Delete all notas from Supabase
        try {
          await deleteDespesaNotasInSupabase(rubricaDbId, despesaDbId);
        } catch (e) {
          console.error("Error deleting despesa notas:", e);
        }
      } else {
        // Otherwise apply add/subtract to original value
        newValue = originalValue;
        
        // Add to history and create notas in Supabase
        if (addVal > 0) {
          expense.history[monthIdx].push({ type: "add", value: addVal, date: now, note: noteText });
          newValue += addVal;
          
          // Update hasNotes if note has text
          if (noteText) {
            if (!expense.hasNotes) expense.hasNotes = {};
            expense.hasNotes[monthIdx] = true;
          }
          
          // Create nota in Supabase (only if noteText provided, otherwise empty string)
          try {
            await createDespesaNotaInSupabase(rubricaDbId, despesaDbId, addVal, noteText);
          } catch (e) {
            console.error("Error creating despesa nota:", e);
          }
        }
        if (subtractVal > 0) {
          expense.history[monthIdx].push({ type: "subtract", value: subtractVal, date: now, note: noteText });
          newValue -= subtractVal;
          
          // Update hasNotes if note has text
          if (noteText) {
            if (!expense.hasNotes) expense.hasNotes = {};
            expense.hasNotes[monthIdx] = true;
          }
          
          // Create nota in Supabase (negative value for subtraction)
          try {
            await createDespesaNotaInSupabase(rubricaDbId, despesaDbId, -subtractVal, noteText);
          } catch (e) {
            console.error("Error creating despesa nota:", e);
          }
        }
      }
      
      // Ensure non-negative
      newValue = Math.max(0, newValue);
      
      // Check if should apply to all months until end of year
      const applyAllMonths = document.getElementById("valueApplyAllMonths")?.checked ?? false;
      
      if (applyAllMonths) {
        // Apply to all months from current month until December (index 11)
        for (let m = monthIdx; m < 12; m++) {
          expense.values[m] = newValue;
          // Update Supabase for each month
          try {
            await updateDespesaValueInSupabaseForMonth(rubricaDbId, despesaDbId, m, newValue);
          } catch (e) {
            console.error(`Error updating expense for month ${m + 1}:`, e);
          }
        }
      } else {
        // Update only the current month
        expense.values[monthIdx] = newValue;
        // Update Supabase
        try {
          await updateDespesaValueInSupabase(rubricaDbId, despesaDbId, newValue);
        } catch (e) {
          console.error("Error updating expense in Supabase:", e);
        }
      }
      
      // Update include in total setting
      const newIncludeInTotal = valueIncludeInTotal?.checked ?? true;
      expense.includeInTotal = newIncludeInTotal;
      
      // Update totalizador in Supabase
      try {
        await updateDespesaTotalizadorInSupabase(rubricaDbId, despesaDbId, newIncludeInTotal);
      } catch (e) {
        console.error("Error updating totalizador in Supabase:", e);
      }
      
      saveRubricas();
      renderRubricas();
      closeValueModal();
    }

    async function confirmDeleteRubrica() {
      if (!pendingDeleteId) return;
      
      try {
        const deleteAllMonths = deleteRubricaAllMonths?.checked ?? true;
        
        if (deleteAllMonths) {
          await deleteRubricaFromAllMonths(pendingDeleteId);
        } else {
          await deleteRubricaFromSupabase(pendingDeleteId);
        }
      } catch (e) {
        console.error("Error deleting rubrica from Supabase:", e);
      }
      
      delete dynamicRubricas[pendingDeleteId];
      saveRubricas();
      renderRubricas();
      closeDeleteModal();
    }

    async function confirmDeleteExpense() {
      if (!pendingDeleteExpense) return;

      const { rubricaId, expenseId } = pendingDeleteExpense;
      const rubrica = dynamicRubricas[rubricaId];
      if (!rubrica || !Array.isArray(rubrica.expenses)) {
        closeDeleteExpenseModal();
        return;
      }

      const expense = rubrica.expenses.find(e => e.id === expenseId);
      const rubricaDbId = rubrica.dbId || parseInt(rubricaId.replace("r_", ""));
      const despesaDbId = expense?.dbId || parseInt(expenseId.replace("e_", ""));

      try {
        const deleteAllMonths = deleteExpenseAllMonths?.checked ?? true;
        
        if (deleteAllMonths) {
          await deleteDespesaFromAllMonths(rubricaDbId, despesaDbId);
        } else {
          await deleteDespesaFromSupabase(rubricaDbId, despesaDbId);
        }
      } catch (e) {
        console.error("Error deleting expense from Supabase:", e);
      }

      rubrica.expenses = rubrica.expenses.filter((expense) => expense.id !== expenseId);
      saveRubricas();
      renderRubricas();
      closeDeleteExpenseModal();
    }

    async function confirmAddRubrica() {
      const name = rubricaNameInput ? rubricaNameInput.value.trim() : "";
      if (name) {
        try {
          const createAllMonths = rubricaAllMonths?.checked ?? true;
          
          if (createAllMonths) {
            // Create for all 12 months
            // Get next rubricaId once - use same ID for all months
            const rubricaId = await getNextRubricaId();
            let currentMonthSeq = 1;
            
            // Create for all 12 months with same rubrica_id but individual seq per month
            for (let m = 1; m <= 12; m++) {
              const rubricaSeq = await getNextRubricaSeqForMonth(selectedYear, m);
              
              const data = {
                ano: selectedYear,
                mes: m,
                rubrica_id: rubricaId,
                rubrica_desc: name,
                rubrica_seq: rubricaSeq,
                rubrica_tipo: "Despesa"
              };
              await supabaseInsert("cgd_rubrica", data);
              
              // Save seq for current month to use in local state
              if (m === selectedMonth + 1) {
                currentMonthSeq = rubricaSeq;
              }
            }
            
            // Add to local state for current month
            const id = `r_${rubricaId}`;
            dynamicRubricas[id] = {
              dbId: rubricaId,
              name: name,
              collapsed: false,
              seq: currentMonthSeq,
              tipo: "Despesa",
              expenses: []
            };
          } else {
            // Create only for current month
            const { rubricaId, rubricaSeq } = await createRubricaInSupabase(name, "Despesa");
            
            // Add to local state
            const id = `r_${rubricaId}`;
            dynamicRubricas[id] = {
              dbId: rubricaId,
              name: name,
              collapsed: false,
              seq: rubricaSeq,
              tipo: "Despesa",
              expenses: []
            };
          }
          
          saveRubricas();
          renderRubricas();
          closeModal();
        } catch (e) {
          console.error("Error creating rubrica:", e);
          alert("Erro ao criar rubrica: " + e.message);
        }
      }
    }

    async function confirmAddExpense() {
      const expenseName = expenseNameInput ? expenseNameInput.value.trim() : "";
      if (!expenseName || !pendingExpenseRubricaId || !dynamicRubricas[pendingExpenseRubricaId]) return;

      const rubrica = dynamicRubricas[pendingExpenseRubricaId];
      const rubricaDbId = rubrica.dbId || parseInt(pendingExpenseRubricaId.replace("r_", ""));

      try {
        const createAllMonths = expenseAllMonths?.checked ?? true;
        
        if (createAllMonths) {
          // Find all months where this rubrica exists
          const rubricaQuery = `ano=eq.${selectedYear}&rubrica_id=eq.${rubricaDbId}&select=mes`;
          const rubricaMonths = await supabaseSelect("cgd_rubrica", rubricaQuery);
          const monthsWithRubrica = rubricaMonths.map(r => r.mes);
          
          if (monthsWithRubrica.length === 0) {
            alert("Rubrica não encontrada na base de dados.");
            return;
          }
          
          // Get next despesa_id once - use same ID for all months
          const despesaId = await getNextDespesaId(rubricaDbId);
          let currentMonthSeq = 1;
          
          // Create for all months where rubrica exists
          for (const m of monthsWithRubrica) {
            const despesaSeq = await getNextDespesaSeqForMonth(selectedYear, m, rubricaDbId);
            
            const data = {
              ano: selectedYear,
              mes: m,
              rubrica_id: rubricaDbId,
              despesa_id: despesaId,
              despesa_desc: expenseName,
              despesa_seq: despesaSeq,
              totalizador: true,
              valor: 0
            };
            await supabaseInsert("cgd_despesa", data);
            
            // Save seq for current month to use in local state
            if (m === selectedMonth + 1) {
              currentMonthSeq = despesaSeq;
            }
          }
          
          // Add to local state for current month
          if (!Array.isArray(rubrica.expenses)) {
            rubrica.expenses = [];
          }
          
          rubrica.expenses.push({
            id: `e_${despesaId}`,
            dbId: despesaId,
            name: expenseName,
            values: Array(12).fill(0),
            seq: currentMonthSeq,
            includeInTotal: true,
            history: {}
          });
        } else {
          // Create only for current month
          const { despesaId, despesaSeq } = await createDespesaInSupabase(rubricaDbId, expenseName, 0, true);

          if (!Array.isArray(rubrica.expenses)) {
            rubrica.expenses = [];
          }
          
          rubrica.expenses.push({
            id: `e_${despesaId}`,
            dbId: despesaId,
            name: expenseName,
            values: Array(12).fill(0),
            seq: despesaSeq,
            includeInTotal: true,
            history: {}
          });
        }
        
        saveRubricas();
        renderRubricas();
        closeExpenseModal();
      } catch (e) {
        console.error("Error creating expense:", e);
        alert("Erro ao criar despesa: " + e.message);
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
    // Value edit modal event listeners
    if (valueModalClose) valueModalClose.addEventListener("click", closeValueModal);
    if (valueModalCancel) valueModalCancel.addEventListener("click", closeValueModal);
    if (valueModalConfirm) valueModalConfirm.addEventListener("click", confirmValueChange);
    if (valueModalOverlay) {
      valueModalOverlay.addEventListener("click", (e) => {
        if (e.target === valueModalOverlay) closeValueModal();
      });
    }
    if (valueHistoryClear) {
      valueHistoryClear.addEventListener("click", clearValueHistory);
    }
    // Rename rubrica modal event listeners
    if (renameRubricaModalClose) renameRubricaModalClose.addEventListener("click", closeRenameRubricaModal);
    if (renameRubricaModalCancel) renameRubricaModalCancel.addEventListener("click", closeRenameRubricaModal);
    if (renameRubricaModalConfirm) renameRubricaModalConfirm.addEventListener("click", confirmRenameRubrica);
    if (renameRubricaModalOverlay) {
      renameRubricaModalOverlay.addEventListener("click", (e) => {
        if (e.target === renameRubricaModalOverlay) closeRenameRubricaModal();
      });
    }
    if (renameRubricaInput) {
      renameRubricaInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmRenameRubrica();
        if (e.key === "Escape") closeRenameRubricaModal();
      });
    }
    // Rename expense modal event listeners
    if (renameExpenseModalClose) renameExpenseModalClose.addEventListener("click", closeRenameExpenseModal);
    if (renameExpenseModalCancel) renameExpenseModalCancel.addEventListener("click", closeRenameExpenseModal);
    if (renameExpenseModalConfirm) renameExpenseModalConfirm.addEventListener("click", confirmRenameExpense);
    if (renameExpenseModalOverlay) {
      renameExpenseModalOverlay.addEventListener("click", (e) => {
        if (e.target === renameExpenseModalOverlay) closeRenameExpenseModal();
      });
    }
    if (renameExpenseInput) {
      renameExpenseInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmRenameExpense();
        if (e.key === "Escape") closeRenameExpenseModal();
      });
    }
    // Format value modal inputs on blur and allow Enter to confirm
    [valueCurrentInput, valueAddInput, valueSubtractInput].forEach(input => {
      if (input) {
        input.addEventListener("blur", () => {
          const val = parseFloat(input.value.replace(',', '.')) || 0;
          input.value = val > 0 ? val.toFixed(2) : "";
        });
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") confirmValueChange();
          if (e.key === "Escape") closeValueModal();
        });
      }
    });
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
        closeValueModal();
        closeRenameRubricaModal();
        closeRenameExpenseModal();
      }
    });

    if (addRubricaBtn) {
      addRubricaBtn.addEventListener("click", openModal);
    }

    renderRubricas();
  }
})();
