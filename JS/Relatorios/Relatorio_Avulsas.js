async function obterRelatorio() {
    try {
        const token = getTokenFromLocalStorage(); // Sua função existente para obter o token
        const dataInicio = document.getElementById('dataInicio').value;
        const dataFim = document.getElementById('dataFim').value;
        const selectEntregador = document.getElementById("entregadoresSelect");
        const idEntregador = selectEntregador.options[selectEntregador.selectedIndex].value;

        //Verifico Data e Hora
        if (!dataInicio || !dataFim) {
            alert('Por favor, preencha ambas as datas.');
            return;
        }else if(dataInicio > dataFim){
            alert('A Data inicial não pode ser maior que a data final.');
            return;
        } 
        let url 

        const dataHoraInicio = `${dataInicio}T00:00:00`;
        const dataHoraFim = `${dataFim}T23:59:59`;
        url = `${urlBackend()}/api/v1/relatorio/avulsas/${dataHoraInicio}/${dataHoraFim}`;
        
        // Verifica se um entregador foi selecionado
        if (idEntregador !== "") {
            url = `${url}?idsEntregador=${idEntregador}`
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        // Obtém o blob do PDF
        const blob = await response.blob();
        
        // Verifica se o blob é um PDF
        const contentType = response.headers.get('Content-Type');
        if (contentType !== 'application/pdf') {
            throw new Error('A resposta não é um PDF.');
        }

        // Cria uma URL para o blob
        const urlPDF = URL.createObjectURL(blob);

        // Abre o PDF em uma nova aba
        window.open(urlPDF, '_blank');

        // Chama a função para imprimir o PDF
        imprimirPDF(urlPDF);
    } catch (error) {
        console.error('Erro ao obter o relatório:', error);
        alert('Erro ao obter o relatório: ' + error.message);
    }
}

function imprimirPDF(pdfUrl) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none'; // Esconde o iframe
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);

    iframe.onload = function() {
        setTimeout(() => {
            iframe.contentWindow.print(); // Chama a função de impressão do iframe
            document.body.removeChild(iframe); // Remove o iframe após a impressão
        }, 1);
    };
}

//--------------------------------------------------------------------Combo Entregadores----------------------------------------------------------------

async function preencherComboEntregadores() {
    // Pegando o combo select pelo ID
    const selectEntregador = document.getElementById("entregadoresSelect");

    // Limpando as opções atuais (exceto a primeira)
    selectEntregador.innerHTML = '<option value="">Todos Entregadores</option>';

    // Chama a função GetEntregadores e preenche o combo com as opções
    const entregadores = await getEntregadores();

    // Itera sobre os entregadores e cria um option para cada um
    entregadores.forEach(entregador => {
        const option = document.createElement("option");
        option.value = entregador.idEntregador; // Valor será o ID do entregador
        option.textContent = entregador.nome; // Texto visível será o nome do entregador
        selectEntregador.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', preencherComboEntregadores);

