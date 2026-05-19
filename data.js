const dashboardMock = {
  cards: [
    { title: "Liquidez Atual", value: "2.31", delta: "+0.14 vs mes passado", trend: "up" },
    { title: "Taxa de Poupanca", value: "27%", delta: "+3.2pp no trimestre", trend: "up" },
    { title: "Divida Rendimento", value: "29%", delta: "-1.1pp em 60 dias", trend: "up" },
    { title: "Runway Financeiro", value: "18 meses", delta: "-2 meses", trend: "down" }
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
    { label: "Fundo de emergencia", amount: "EUR 9 200", status: "on track" },
    { label: "Amortizacao CH", amount: "EUR 3 150", status: "focus" },
    { label: "Upgrade paineis", amount: "EUR 1 900", status: "planned" },
    { label: "Ferias", amount: "EUR 2 400", status: "planned" }
  ]
};
