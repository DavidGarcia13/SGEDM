window.onload = initializeForm;

async function carregarEntregas() {
    // Obter o token de autenticação
    let token = getTokenFromLocalStorage();
    desabilitarCampos()

    // Obter o ID da URL
    const idEntrega = getQueryParam('id');
    if (!idEntrega) {
        alert('ID da Entrega não foi fornecido.');
        return;
    }

    try {
        // Fazer o fetch para a API com o ID do entregador
        const response = await fetch(`${urlBackend()}/api/v1/entrega?idEntrega=${idEntrega}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('codigo').value = data.body.idEntrega.toString().padStart(6, '0') || '';
            document.getElementById('nome-vendedor').value = data.body.nomeUser || '';
            document.getElementById('documento').value = data.body.cupomOrcamento || '';
            
            const dataHora = new Date(data.body.dataCadastroEntrega);
            document.getElementById('data').value = dataHora.toLocaleDateString('en-CA') || '';
            document.getElementById('hora').value = dataHora.toTimeString().split(' ')[0].substring(0, 5) || '';
        
            document.getElementById('valor').value = data.body.valorTotal || '';
            document.getElementById('valor-recebido').value = data.body.valorReceber || '';
            document.getElementById('troco').value = data.body.troco || '';
            document.getElementById('forma-pag').value = data.body.formaPagamento || '';
            document.getElementById('obs').value = data.body.observacao || '';
            document.getElementById('tipo-entrega').value = data.body.tipoEntrega || '';
            document.getElementById('filial').value = await GetEmpresas(data.body.idMatriz)|| '';
        
            // entregas
            const dataini = new Date(data.body.dataSelecaoEntrega);
            const datafim = new Date(data.body.dataFinalizacaoEntrega);
            document.getElementById('nome-entregador').value = data.body.nomeEntregador || '';
            document.getElementById('data-entrega').value = dataini.toLocaleDateString('en-CA') || '';
            document.getElementById('hora-entrega').value = dataini.toTimeString().split(' ')[0].substring(0, 5) || '';
            document.getElementById('data-inicio').value = datafim.toLocaleDateString('en-CA') || '';
            document.getElementById('inicio-entrega').value = datafim.toTimeString().split(' ')[0].substring(0, 5) || '';
            document.getElementById('status').value = data.body.statusEntrega || '';
            
            //Campos relacionados à assinatura e datas
            const dataass = new Date(data.body.dataAssinaturaEntrega);
            document.getElementById('vendedor-assinatura').value = data.body.nomeUserAssinatura || '';
            document.getElementById('data-assinatura').value = dataass.toLocaleDateString('en-CA') || '';
            document.getElementById('hora-assinatura').value = dataass.toTimeString().split(' ')[0].substring(0, 5) || '';
            
        } else {
            console.error('Erro ao buscar entrega:', response.statusText);
            alert('Erro ao buscar entrega: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão: ' + error.message);
    }
}

function desabilitarCampos() {
    // Seleciona todos os inputs dentro da div com id "nav-tabContent"
    const dadosentrega = document.querySelectorAll('#nav-entrega input');
    const assinatura = document.querySelectorAll('#nav-assinatura input');
    const vendedor = document.getElementById("nome-vendedor");
    const codigo = document.getElementById("codigo");
    const data = document.getElementById("data");
    const hora = document.getElementById("hora");
    const filial = document.getElementById("filial");
    filial.disabled = true;
    data.disabled = true;
    hora.disabled = true;
    vendedor.disabled = true;
    codigo.disabled = true;

    // Itera sobre todos os inputs e desabilita cada um
    dadosentrega.forEach(dados => {
        dados.disabled = true;
    });

    assinatura.forEach(input => {
        input.disabled = true;
    });
}

async function initializeForm() {
   
    const formaPagInput = document.getElementById('forma-pag');
    const tipoEntregaInput = document.getElementById('tipo-entrega');
    const filialInput = document.getElementById('filial');


    // Array de formas de pagamento
    const formasPagamento = ['Pago','Mães de Goias','BR-Card','Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Pix', 'Crediario'];
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
    carregarEntregas()
}

async function AlterarEntrega() {
    try {
        // Captura os valores dos inputs
        const ident = parseInt(document.getElementById('codigo').value);
        const valorTotal = document.getElementById('valor').value;
        const valorReceber = document.getElementById('valor-recebido').value;
        const troco = document.getElementById('troco').value;
        const cupomOrcamento = document.getElementById('documento').value;
        const tipoEntrega = document.getElementById('tipo-entrega').value;
        const formaPagamento = document.getElementById('forma-pag').value;
        const observacao = document.getElementById('obs').value;
        //const filial = document.getElementById('filial').value;

        // Função para obter o token (implementada previamente)
        const token = getTokenFromLocalStorage();

        // Monta o JSON do body da requisição
        const body = {
            idEntrega: ident,
            valorTotal: parseFloat(valorTotal),
            valorReceber: parseFloat(valorReceber),
            troco: parseFloat(troco),
            cupomOrcamento: cupomOrcamento,
            tipoEntrega: tipoEntrega,
            formaPagamento: formaPagamento,
            observacao: observacao
            //idMatriz: parseInt(filial.substring(0, filial.indexOf('-')), 10)
        };

        console.log('JSON Gerado:', body);

        // Faz a requisição POST com autenticação Bearer
        const response = await fetch(`${urlBackend()}/api/v1/entrega/alterar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            showAlert('Entrega alterada com sucesso!');
            //console.log('Entrega alterada com sucesso:', data);
            window.location.href = 'Entregas.html';
        } else {
            console.error('Erro ao alterar entrega:', response.status, response.statusText);
        }

    } catch (error) {
        console.error('Erro ao alterar entrega:', error);
    }
}

function calculaTroco() {
    const valorInput = document.getElementById('valor');
    const valorRecebidoInput = document.getElementById('valor-recebido');
    const trocoInput = document.getElementById('troco');

    const valor = parseFloat(valorInput.value ?? 0) || 0;
    const valorRecebido = parseFloat(valorRecebidoInput.value  ?? 0) || 0;
    const troco = valorRecebido - valor;
    trocoInput.value = troco >= 0 ? troco.toFixed(2) : '0.00';
    trocoInput.disabled = true; // Desabilita o campo de troco

}
