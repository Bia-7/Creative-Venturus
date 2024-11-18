document.addEventListener("DOMContentLoaded", function() {
    // Seleciona o botão e a lista de melhorias
    const botao = document.getElementById("botao");
    const lista = document.getElementById("lista");

    // Adiciona o evento de clique no botão
    botao.addEventListener("click", function() {
        // Verifica se a lista está oculta e alterna entre mostrar e esconder
        if (lista.style.display === "none") {
            lista.style.display = "block"; // Mostra a lista
            botao.textContent = "Mostrar menos"; // Muda o texto do botão
        } else {
            lista.style.display = "none"; // Oculta a lista
            botao.textContent = "Mostrar mais"; // Muda o texto do botão
        }
    });
});