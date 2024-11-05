async function cadastrarEmpresa() {
    // Obter o token de autenticação do localStorage
    let token = getTokenFromLocalStorage();

    // Montar o JSON com os dados do formulário
    const formData = {
        nome: document.getElementById('nomeEmpresa').value,
        cnpj: document.getElementById('cnpj').value,
        logradouro: document.getElementById('endereco').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        longitude: document.getElementById('latitude').value,
        latitude: document.getElementById('longitude').checked
    };

    try {
        // Realizar o fetch com o método POST
        const response = await fetch(`${urlBackend()}/api/v1/empresa/matriz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData) // Enviar o corpo da requisição com os dados do formulário
        });

        // Verificar a resposta da requisição
        if (response.ok) {
            console.log('Empresa cadastrado com sucesso:');
            alert('Empresa cadastrado com sucesso!');
            window.location.href = 'Empresa.html';
        } else {
            console.error('Erro ao cadastrar empresa:', response.statusText);
            alert('Erro ao cadastrar empresa: ' + response.statusText);
        }
    } catch (error) {
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