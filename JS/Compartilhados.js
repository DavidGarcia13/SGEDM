window.onload = updateUserName; //Adiciono o nome do usuario na Tela
function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('dateTime').textContent = dateTimeString;
}

setInterval(updateDateTime, 1000); // Atualiza a cada segundo
updateDateTime(); // Chama na carga inicial
//Tratamento para o Sidebar
document.getElementById("menuToggle").onclick = function() {
    // Se o sidebar estiver escondido, expandimos
    if (document.body.classList.contains("sidebar-hidden")) {
        document.body.classList.remove("sidebar-hidden"); // Remove a classe que esconde a sidebar
        document.querySelector('.container-fluid').classList.add("sidebar-expanded"); // Adiciona a classe que empurra o conteúdo
    } else {
        document.body.classList.add("sidebar-hidden"); // Esconde a sidebar
        document.querySelector('.container-fluid').classList.remove("sidebar-expanded"); // Remove a classe que empurra o conteúdo
    }
};

document.querySelectorAll('.folder').forEach(function(folder) {
    folder.addEventListener('click', function() {
        // Fechar todos os submenus
        document.querySelectorAll('.sub-menu').forEach(function(submenu) {
            submenu.style.display = 'none';
        });

        // Alternar submenu atual
        var submenu = this.nextElementSibling;
        if (submenu && submenu.classList.contains('sub-menu')) {
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
        }
    });
});

function redirecionarParaEntidade(entidade) {
    const url = `${entidade}_Entidade.html`;
    window.location.href = url;
}

function updateUserName() {
    const userName = getIdNomeUser(1); // Função para pegar o nome do usuário
    const welcomeMessage = document.getElementById('welcome');
    welcomeMessage.innerHTML = `Seja bem-vindo: <a href="#" id="userLink">${userName}</a>`;
    
    // Evento para abrir o modal ao clicar no nome de usuário
    document.getElementById('userLink').onclick = function() {
        showUserModal(userName);
    };
}

function selecionarPrimeiraLinha(nometab) {
    const tabela = document.querySelector(`#${nometab}`);
    const primeiraLinha = tabela.querySelector('tr');
    
    if (primeiraLinha) {
        primeiraLinha.classList.add('selected');
    }
}