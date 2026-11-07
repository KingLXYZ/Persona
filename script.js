
// ======================================
// PERSONA — Main JavaScript
// ======================================

// Atualiza automaticamente o ano do rodapé.

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Registra quando o documento foi carregado.

document.addEventListener("DOMContentLoaded", () => {
    console.log("PERSONA successfully initialized.");
});
