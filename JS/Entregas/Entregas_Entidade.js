async function initializeForm() {
   
    // Pegar os elementos do DOM
    const vendedorInput = document.getElementById('vendedor');
    const dataInput = document.getElementById('data');
    const horaInput = document.getElementById('hora');
    const formaPagInput = document.getElementById('forma-pag');
    const tipoEntregaInput = document.getElementById('tipo-entrega');
    const filialInput = document.getElementById('filial');
    disableInputs()//desabilito as pastas (Entrega,Assinatura)

    // Definir os valores fixos e desabilitar os campos apropriados
    vendedorInput.value = getIdNomeUser(1); // Preenche com o nome do usuário do localStorage
    vendedorInput.disabled = true;

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    dataInput.value = today; // Data atual
    dataInput.disabled = true;

    horaInput.value = currentTime; // Hora atual
    horaInput.disabled = true;

    // Array de formas de pagamento
    const formasPagamento = ['Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Pix', 'Crediario'];
    // Converter o input de forma de pagamento para um combobox
    convertToCombobox(formaPagInput, formasPagamento, 'forma-pag');

    // Array de tipos de entrega
    const tiposEntrega = ['Venda Balcão', 'Manipulação'];
    // Converter o input de tipo de entrega para um combobox
    convertToCombobox(tipoEntregaInput, tiposEntrega, 'tipo-entrega');

    const filiais = await GetEmpresas('');
    convertToCombobox(filialInput, filiais,'filial',1);
    
    function convertToCombobox(inputElement, optionsArray, selectId , opc) {
        // Cria o elemento select e define a classe
        const selectElement = document.createElement('select');
        selectElement.className = 'form-control';
    
        // Define o ID do select para facilitar a recuperação do valor posteriormente
        selectElement.id = selectId;
    
        // Preenche o select com as opções
        if (opc === 1) {
            optionsArray.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.idMatriz + '-' + option.nome;
                optionElement.textContent = option.idMatriz + '-' + option.nome;
                selectElement.appendChild(optionElement);
            });
        } else {
            optionsArray.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.text = option;
                selectElement.appendChild(optionElement);
            });
        }
    
        // Substitui o input original pelo novo select
        inputElement.parentNode.replaceChild(selectElement, inputElement);
    }
}

window.onload = initializeForm;
 
function calculaTroco() {
    const valorInput = document.getElementById('valor');
    const valorRecebidoInput = document.getElementById('valor-recebido');
    const trocoInput = document.getElementById('troco');

    const valor = parseFloat(valorInput.value) || 0;
    const valorRecebido = parseFloat(valorRecebidoInput.value) || 0;
    const troco = valorRecebido - valor;
    trocoInput.value = troco >= 0 ? troco.toFixed(2) : '0.00';
    trocoInput.disabled = true; // Desabilita o campo de troco

}

function disableInputs() {
    // Seleciona todos os inputs das seções nav-entrega e nav-assinatura
    const entregaInputs = document.querySelectorAll('#nav-entrega input');
    const assinaturaInputs = document.querySelectorAll('#nav-assinatura input');

    // Função para desabilitar inputs
    entregaInputs.forEach(input => {
        input.disabled = true;
    });

    assinaturaInputs.forEach(input => {
        input.disabled = true;
    });
}

async function CadastrarEntrega() {
    try {
        // Captura os valores dos inputs
        const valorTotal = document.getElementById('valor').value;
        const valorReceber = document.getElementById('valor-recebido').value;
        const troco = document.getElementById('troco').value;
        const cupomOrcamento = document.getElementById('documento').value;
        const tipoEntrega = document.getElementById('tipo-entrega').value;
        const formaPagamento = document.getElementById('forma-pag').value;
        const observacao = document.getElementById('obs').value;
        const filial = document.getElementById('filial').value;

        // Função para obter o ID do usuário (implementada previamente)
        const idUser = getIdNomeUser(2);

        // Função para obter o token (implementada previamente)
        const token = getTokenFromLocalStorage();

        // Data e hora atuais no formato ISO (com milissegundos)
        const dataCadastroEntrega = new Date().toISOString();

        // Monta o JSON do body da requisição
        const body = {
            dataCadastroEntrega: dataCadastroEntrega,
            idUser: idUser,
            valorTotal: parseFloat(valorTotal),
            valorReceber: parseFloat(valorReceber),
            troco: parseFloat(troco),
            cupomOrcamento: cupomOrcamento,
            tipoEntrega: tipoEntrega,
            formaPagamento: formaPagamento,
            observacao: observacao,
            idMatriz: parseInt(filial.substring(0, filial.indexOf('-')), 10)
        };

        console.log('JSON Gerado:', body);

        // Faz a requisição POST com autenticação Bearer
        const response = await fetch(`${urlBackend()}/api/v1/entrega`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Entrega incluída com sucesso:', data);
            window.location.href = 'Entregas.html';
        } else {
            console.error('Erro ao incluir entrega:', response.status, response.statusText);
        }

    } catch (error) {
        console.error('Erro ao incluir entrega:', error);
    }
}

/*Muda o focu do campo ao Pressionar enter*/

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
});
