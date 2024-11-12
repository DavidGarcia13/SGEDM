// Função para salvar dados no localStorage com tempo de expiração
function saveTokenToLocalStorage(data, usuario, auser) {
    const now = new Date();
    const expirationTime = now.getTime() + 12 * 60 * 60 * 1000; // 12 horas em milissegundos

    const authData = {
        token: data.token,
        username: usuario,
        nome: auser.nome,
        id: data.idUser,
        expiration: expirationTime
    };
    localStorage.setItem('authData', JSON.stringify(authData));
}

// Função para recuperar o token do localStorage
function getTokenFromLocalStorage() {
    const authData = JSON.parse(localStorage.getItem('authData'));

    if (authData) {
        const now = new Date();

        // Verifica se o token ainda é válido (não expirou)
        if (now.getTime() < authData.expiration) {
            return authData.token;
        } else {
            localStorage.removeItem('authData');
            window.location.href = 'Template/Index.html'; //apago o Data e Volto para pagina de login
        }
    }else{
        window.location.href = '../Template/Index.html' //Volto para pagina de login
    }
    return null;
}
function getUserFromLocalStorage() {
    const authData = JSON.parse(localStorage.getItem('authData'));

    if (authData) {
        return authData.username;
    }
    return null;
}

function getIdNomeUser(opc) {
    const authData = JSON.parse(localStorage.getItem('authData'));

    if (authData) {
        if(opc == 1){
            return authData.nome;
        }else if(opc == 2){
            return authData.id;
        } 
    }
    return null;
}

 async function getToken(username, password) {
    const url = `${urlBackend()}/api/v1/auth`;
    
    const opcoes = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
        mode: 'cors',
    };

    try {
        const response = await fetch(url, opcoes);

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }
        
        
        const data = await response.json();
        console.log('Token:', data.token);
        const auser = await getVendedor(data.idUser, data.token)
        saveTokenToLocalStorage(data, username,auser)
        window.location.href = 'Template/Entregas/Entregas.html'; 
        
    } catch (e) {
        console.log('Deu erro: ' + e.message);
        throw e; // Relança o erro para ser tratado onde a função for chamada
    }
}

// Ação no clique do botão "Acessar"
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const token = await getToken(username, password);
        showAlert('Autenticação realizada com sucesso!');
        //alert('Autenticação realizada com sucesso!');
    } catch (e) {
        showAlert('Usuario ou senha invalidos.');
       
    }
});

async function GetEmpresas(id){
    let token = getTokenFromLocalStorage();
    
    if (!token){
        console.log('Não foi possivel obter o Token')
    }
    let url;
    if (!id) {
        url = `${urlBackend()}/api/v1/empresa/matriz`;
    } else {
        url = `${urlBackend()}/api/v1/empresa/${id}`;
    }
   
    const opcoes = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        mode: 'cors',
    };

    try {
        const response = await fetch(url, opcoes);

        if (response.ok) {
            const data = await response.json();

            if (!id) {
                if (data && Array.isArray(data)) {
                return data;
                } else {
                    console.log('Formato inesperado de resposta:', data);
                    return [];
                }
            }else{
                return data.idMatriz + '-'+ data.nome;
            }

        } else {
            throw new Error('Erro ao buscar empresas: ' + response.statusText);
        }
    } catch (error) {
        
        return [];
    }
}

async function getVendedor(id, token) {
    // Verifica se o token está presente
    if (!token) {
        console.log('Não foi possível obter o Token');
        return; // Sai da função, pois não há token
    }
  
    if (id) {
        // Define a URL usando let, já que vai ser modificada
        let url = `${urlBackend()}/api/v1/usuario/${id}`;
        const opcoes = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        };
    
        try {
            const response = await fetch(url, opcoes);
            if (response.ok) {
                const data = await response.json();
                return data; // Retorna os dados diretamente
            } else {
                console.error('Erro ao buscar Usuários:', response.statusText);
                throw new Error('Erro ao buscar Usuários: ' + response.statusText);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw new Error('Erro na requisição: ' + error.message);
        }
    } else {
        console.log('ID do usuário não fornecido.');
        return []; // Retorna um array vazio, pois o ID não foi passado
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


function voltarPrincipal(entidade) {
    const url = `${entidade}.html`;
    window.location.href = url;
}


//Function de configuração da URL
function urlBackend(){
    return 'https://dmsolucoes.tech'
}

//Function para remoção de todos autocomplete dos Inputs:
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.form-check input').forEach(input => {
        input.setAttribute('autocomplete', 'off');
    });
});

function showAlert(message) {
    // Verifica se o modal já existe; se existir, remove-o para evitar duplicação
    const existingModal = document.getElementById("alertModal");
    if (existingModal) {
        existingModal.remove();
    }

    // Cria o HTML do modal com a mensagem passada como parâmetro
    const modalHTML = `
        <div class="modal fade" id="alertModal" tabindex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="alertModalLabel">Atenção</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <div class="modal-body" id="alertMessage">
                                    ${message}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" id="closeAlertModal">OK</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Adiciona o modal ao corpo do documento
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Inicializa o modal e o exibe
    const alertModal = new bootstrap.Modal(document.getElementById("alertModal"));
    alertModal.show();

    // Adiciona um listener ao botão "OK" para fechar o modal
    document.getElementById("closeAlertModal").addEventListener("click", function () {
        alertModal.hide(); // Fecha o modal
    });
}

//-----------------------------------------------------Modal Usuario ----------------------------------------

function showUserModal(userName) {
    // Verifica se o modal já existe; se existir, remove-o para evitar duplicação
    const existingModal = document.getElementById("userModal");
    const usuario = getUserFromLocalStorage();

    if (existingModal) {
        existingModal.remove();
    }

    // Obtém o horário de login do Local Storage
    //const loginTime = localStorage.getItem('loginTime') || 'Horário de login indisponível';

    // Cria o HTML do modal com o conteúdo dinâmico
    const modalHTML = `
        <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userModalLabel">Informações do Usuário</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex align-items-center">
                            <i class="user-icon me-2">👤</i>
                            <div>
                                <strong id="modalUserName">${userName}</strong><br>
                                <small id="modalLoginTime">Login: ${usuario} </small>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="okButton" data-bs-dismiss="modal">Ok</button>
                        <button type="button" class="btn btn-danger" id="logoutButton">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Adiciona o modal ao corpo do documento
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Inicializa o modal e o exibe
    const userModal = new bootstrap.Modal(document.getElementById("userModal"));
    userModal.show();

    // Adiciona um listener ao botão "Logout" para realizar logout
    document.getElementById("logoutButton").addEventListener("click", function () {
        // Adicione aqui a lógica de logout
        showAlert("Até Mais");
        localStorage.clear();
        window.location.href = '../../index.html';
        userModal.hide(); // Fecha o modal
    });
}


// Evento para fazer logout
document.getElementById('logoutButton').onclick = function() {
    // Adicione a lógica de logout aqui
    alert("Usuário desconectado");
    document.getElementById('userModal').style.display = 'none';
};

