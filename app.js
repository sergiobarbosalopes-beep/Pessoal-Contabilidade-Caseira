function setupSidebar() {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const sidebar = document.querySelector("[data-sidebar]");

  if (!menuButton || !sidebar) {
    return;
  }

  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 900) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (!sidebar.contains(target) && !target.closest("[data-menu-toggle]")) {
      sidebar.classList.remove("open");
    }
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  if (!page) {
    return;
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });
}

function renderCards() {
  const container = document.querySelector("[data-cards]");
  if (!container || !window.dashboardMock) {
    return;
  }

  container.innerHTML = window.dashboardMock.cards
    .map((item) => {
      const deltaClass = item.trend === "down" ? "down" : "up";
      return `
        <article class="card">
          <h3>${item.title}</h3>
          <div class="value">${item.value}</div>
          <div class="delta ${deltaClass}">${item.delta}</div>
        </article>
      `;
    })
    .join("");
}

function renderPriorities() {
  const list = document.querySelector("[data-priorities]");
  if (!list || !window.dashboardMock) {
    return;
  }

  list.innerHTML = window.dashboardMock.priorities
    .map((p) => `<li><span>${p.label}</span><span>${p.amount} <span class="badge">${p.status}</span></span></li>`)
    .join("");
}

function createCharts() {
  if (typeof window.Chart === "undefined" || !window.dashboardMock) {
    return;
  }

  const budgetCtx = document.getElementById("budgetChart");
  if (budgetCtx) {
    new window.Chart(budgetCtx, {
      type: "line",
      data: {
        labels: window.dashboardMock.budgetByMonth.labels,
        datasets: [
          {
            label: "Planeado",
            data: window.dashboardMock.budgetByMonth.planned,
            borderColor: "#0f766e",
            backgroundColor: "rgba(15,118,110,0.14)",
            tension: 0.35,
            fill: true
          },
          {
            label: "Real",
            data: window.dashboardMock.budgetByMonth.actual,
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245,158,11,0.12)",
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { usePointStyle: true } }
        }
      }
    });
  }

  const cashCtx = document.getElementById("cashChart");
  if (cashCtx) {
    new window.Chart(cashCtx, {
      type: "bar",
      data: {
        labels: window.dashboardMock.cashFlow.labels,
        datasets: [
          {
            label: "Cashflow liquido",
            data: window.dashboardMock.cashFlow.values,
            backgroundColor: [
              "#14b8a6",
              "#2dd4bf",
              "#5eead4",
              "#99f6e4",
              "#34d399",
              "#10b981",
              "#fbbf24",
              "#f59e0b"
            ],
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  const mixCtx = document.getElementById("mixChart");
  if (mixCtx) {
    new window.Chart(mixCtx, {
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
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }
}

setupSidebar();
setActiveNav();
renderCards();
renderPriorities();
createCharts();
