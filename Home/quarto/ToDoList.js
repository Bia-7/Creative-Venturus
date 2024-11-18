// ToDoList.js
document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    // Elementos do DOM
    const elementos = {
        tarefaInput: document.getElementById('tarefaInput'),
        prioridadeSelect: document.getElementById('prioridade'),
        categoriaSelect: document.getElementById('categoria'),
        dataVencimentoInput: document.getElementById('dataVencimento'),
        adicionarBtn: document.getElementById('adicionarBtn'),
        listaTarefas: document.getElementById('listaTarefas'),
        pesquisarInput: document.getElementById('pesquisar'),
        filtrarPrioridadeSelect: document.getElementById('filtrarPrioridade'),
        filtrarCategoriaSelect: document.getElementById('filtrarCategoria'),
        imprimirBtn: document.getElementById('imprimirBtn'),
        limparListaBtn: document.getElementById('limparListaBtn'),
        exportarBtn: document.getElementById('exportarBtn')
    };

    // Funções principais
    function adicionarTarefa() {
        const texto = elementos.tarefaInput.value.trim();
        const prioridade = elementos.prioridadeSelect.value;
        const categoria = elementos.categoriaSelect.value;
        const dataVencimento = elementos.dataVencimentoInput.value;

        if (texto) {
            const tarefa = {
                id: Date.now(),
                texto: texto,
                completa: false,
                prioridade: prioridade,
                categoria: categoria,
                dataVencimento: dataVencimento,
                dataCriacao: new Date().toISOString()
            };

            tarefas.push(tarefa);
            salvarTarefas();
            atualizarLista();
            elementos.tarefaInput.value = '';
            elementos.prioridadeSelect.value = 'baixa';
            elementos.categoriaSelect.value = 'pessoal';
            elementos.dataVencimentoInput.value = '';
        }
    }

    function concluirTarefa(id) {
        id = Number(id);
        const tarefa = tarefas.find(t => t.id === id);
        if (tarefa) {
            tarefa.completa = !tarefa.completa;
            salvarTarefas();
            atualizarLista();
        }
    }

    function excluirTarefa(id) {
        id = Number(id);
        tarefas = tarefas.filter(t => t.id !== id);
        salvarTarefas();
        atualizarLista();
    }

    function salvarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    function atualizarLista() {
        const tarefasFiltradas = filtrarTarefas();
        elementos.listaTarefas.innerHTML = '';

        tarefasFiltradas.forEach(tarefa => {
            const li = document.createElement('li');
            li.className = `prioridade-${tarefa.prioridade}`;
            if (tarefa.completa) {
                li.classList.add('completa');
            }

            const botaoConcluir = document.createElement('button');
            botaoConcluir.className = 'concluir';
            botaoConcluir.setAttribute('data-id', tarefa.id);
            botaoConcluir.textContent = 'Concluir';

            if (tarefa.completa) {
                botaoConcluir.classList.add('button-concluido');
            }

            const botaoExcluir = document.createElement('button');
            botaoExcluir.className = 'excluir';
            botaoExcluir.setAttribute('data-id', tarefa.id);
            botaoExcluir.textContent = 'Excluir';

            li.innerHTML = `
                <span class="texto">${tarefa.texto}</span>
                <span class="categoria">${tarefa.categoria}</span>
                <span class="data-vencimento">${tarefa.dataVencimento}</span>
            `;
            li.appendChild(botaoConcluir);
            li.appendChild(botaoExcluir);

            elementos.listaTarefas.appendChild(li);
        });

        atualizarEstatisticas();
    }

    function filtrarTarefas() {
        const textoPesquisa = elementos.pesquisarInput.value.trim().toLowerCase();
        const prioridadeFiltro = elementos.filtrarPrioridadeSelect.value;
        const categoriaFiltro = elementos.filtrarCategoriaSelect.value;

        return tarefas.filter(tarefa => {
            const texto = tarefa.texto.toLowerCase();
            const prioridade = tarefa.prioridade;
            const categoria = tarefa.categoria;

            return (
                texto.includes(textoPesquisa) &&
                (prioridadeFiltro === 'todas' || prioridade === prioridadeFiltro) &&
                (categoriaFiltro === 'todas' || categoria === categoriaFiltro)
            );
        });
    }

    function atualizarEstatisticas() {
        const totalTarefas = tarefas.length;
        const tarefasConcluidas = tarefas.filter(t => t.completa).length;
        const tarefasPendentes = totalTarefas - tarefasConcluidas;

        document.getElementById('totalTarefas').textContent = totalTarefas;
        document.getElementById('tarefasConcluidas').textContent = tarefasConcluidas;
        document.getElementById('tarefasPendentes').textContent = tarefasPendentes;
    }

    function limparLista() {
        tarefas = [];
        salvarTarefas();
        atualizarLista();
    }

    function exportarLista() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tarefas));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "tarefas.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // Eventos
    elementos.adicionarBtn.addEventListener('click', adicionarTarefa);
    elementos.listaTarefas.addEventListener('click', function(event) {
        if (event.target.classList.contains('concluir')) {
            const id = event.target.getAttribute('data-id');
            concluirTarefa(id);
        } else if (event.target.classList.contains('excluir')) {
            const id = event.target.getAttribute('data-id');
            excluirTarefa(id);
        }
    });
    elementos.pesquisarInput.addEventListener('input', atualizarLista);
    elementos.filtrarPrioridadeSelect.addEventListener('change', atualizarLista);
    elementos.filtrarCategoriaSelect.addEventListener('change', atualizarLista);
    elementos.limparListaBtn.addEventListener('click', limparLista);
    elementos.exportarBtn.addEventListener('click', exportarLista);
    elementos.imprimirBtn.addEventListener('click', () => {
        
        window.print()});

    // Inicialização
    atualizarLista();
});