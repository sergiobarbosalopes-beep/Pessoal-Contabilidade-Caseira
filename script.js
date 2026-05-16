// Função para mostrar/esconder páginas
function showPage(pageId) {
    // Esconder todas as páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Mostrar a página selecionada
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Atualizar links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeLink = document.getElementById(`nav-${pageId}`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Scroll para o topo
    window.scrollTo(0, 0);
}

// Função para formatar valor monetário
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

// Dados de exemplo (será substituído por dados reais mais tarde)
const accountsData = {
    cgd: {
        name: 'CGD',
        balance: 0,
        color: '#059669',
        transactions: []
    },
    novobanco: {
        name: 'Novo Banco',
        balance: 0,
        color: '#dc2626',
        transactions: []
    }
};

// Função para atualizar saldos nas cards
function updateAccountBalances() {
    const cgdBalance = document.querySelector('.cgd-card .balance-amount');
    const novobancoBalance = document.querySelector('.novobanco-card .balance-amount');

    if (cgdBalance) {
        cgdBalance.textContent = formatCurrency(accountsData.cgd.balance);
    }
    if (novobancoBalance) {
        novobancoBalance.textContent = formatCurrency(accountsData.novobanco.balance);
    }

    // Atualizar saldos nas páginas das contas
    const cgdBalanceCard = document.querySelector('.cgd-balance .amount');
    const novobancoBalanceCard = document.querySelector('.novobanco-balance .amount');

    if (cgdBalanceCard) {
        cgdBalanceCard.textContent = formatCurrency(accountsData.cgd.balance);
    }
    if (novobancoBalanceCard) {
        novobancoBalanceCard.textContent = formatCurrency(accountsData.novobanco.balance);
    }

    // Atualizar resumo geral
    updateSummary();
}

// Função para atualizar o resumo geral
function updateSummary() {
    const totalBalance = accountsData.cgd.balance + accountsData.novobanco.balance;
    const summaryValue = document.querySelector('.summary-value:not(.income):not(.expense)');

    if (summaryValue) {
        summaryValue.textContent = formatCurrency(totalBalance);
    }
}

// Adicionar event listeners aos cards
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar saldos
    updateAccountBalances();

    // Prevenir comportamento padrão dos links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('onclick')) {
                e.preventDefault();
            }
        });
    });

    // Permitir navegação com teclas de atalho (opcional)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === '1') {
            e.preventDefault();
            showPage('home');
        } else if (e.ctrlKey && e.key === '2') {
            e.preventDefault();
            showPage('cgd');
        } else if (e.ctrlKey && e.key === '3') {
            e.preventDefault();
            showPage('novobanco');
        }
    });
});

// Exportar funções para uso global
window.showPage = showPage;
window.formatCurrency = formatCurrency;
window.updateAccountBalances = updateAccountBalances;
window.accountsData = accountsData;
