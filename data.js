const dashboardMock = {
  kpis: [
    { title: "Liquidez Atual", value: "2.31", trend: "+0.14", trendUp: true },
    { title: "Taxa de Poupança", value: "27%", trend: "+3.2pp", trendUp: true },
    { title: "Dívida / Rendimento", value: "29%", trend: "-1.1pp", trendUp: true },
    { title: "Runway Financeiro", value: "18 meses", trend: "-2 meses", trendUp: false }
  ],
  budgetByMonth: {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    planned: [2100, 2150, 2200, 2180, 2250, 2300, 2380, 2400, 2420, 2480, 2520, 2550],
    actual: [2050, 2210, 2140, 2230, 2190, 2295, 2440, 2350, 2475, 2502, 2490, 2610]
  },
  cashFlow: {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"],
    values: [440, 380, 520, 490, 610, 530, 660, 590]
  },
  accountMix: {
    labels: ["CGD", "Novo Banco", "Coverflex", "Carteira"],
    values: [42, 31, 17, 10]
  },
  priorities: [
    { label: "Fundo de emergência", amount: "€ 9 200", status: "on track" },
    { label: "Amortização CH", amount: "€ 3 150", status: "focus" },
    { label: "Upgrade painéis", amount: "€ 1 900", status: "planned" },
    { label: "Férias", amount: "€ 2 400", status: "planned" }
  ],
  tiles: {
    cgd: { saldo: "12 450", movimento: "+320" },
    novobanco: { saldo: "8 720", movimento: "-180" },
    coverflex: { saldo: "1 850", disponivel: "420" },
    credito: { divida: "142 000", prestacao: "485" },
    solares: { poupanca: "1 240", retorno: "68%" }
  }
};
