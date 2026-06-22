// Função para formatar o número de telefone
function formatPhone(value) {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
        return numbers.replace(/(\d{2})?(\d{5})?(\d{4})?/, function(match, ddd, parte1, parte2) {
            let formatted = '';
            if (ddd) formatted += `(${ddd}) `;
            if (parte1) formatted += `${parte1}`;
            if (parte2) formatted += `-${parte2}`;
            return formatted;
        });
    }
    return value;
}

// Função para calcular o IMC
function calcularIMC(peso, altura) {
    return peso / (altura * altura);
}

// Função para classificar o IMC
function classificarIMC(imc) {
    if (imc < 18.5) {
        return {
            classificacao: 'Abaixo do peso',
            cor: '#FFC107',
            texto: '#333',
            mensagem: 'Você está abaixo do peso ideal. Consulte um nutricionista para orientação adequada.'
        };
    } else if (imc >= 18.5 && imc < 25) {
        return {
            classificacao: 'Peso normal',
            cor: '#4CAF50',
            texto: 'white',
            mensagem: 'Parabéns! Você está com o peso ideal. Mantenha hábitos saudáveis!'
        };
    } else if (imc >= 25 && imc < 30) {
        return {
            classificacao: 'Sobrepeso',
            cor: '#FF9800',
            texto: 'white',
            mensagem: 'Você está com sobrepeso. Considere ajustar sua alimentação e praticar exercícios.'
        };
    } else if (imc >= 30 && imc < 35) {
        return {
            classificacao: 'Obesidade Grau I',
            cor: '#FF5722',
            texto: 'white',
            mensagem: 'Atenção! Obesidade Grau I. É recomendado procurar orientação médica.'
        };
    } else if (imc >= 35 && imc < 40) {
        return {
            classificacao: 'Obesidade Grau II',
            cor: '#F44336',
            texto: 'white',
            mensagem: 'Alerta! Obesidade Grau II. Procure ajuda profissional para sua saúde.'
        };
    } else {
        return {
            classificacao: 'Obesidade Grau III',
            cor: '#B71C1C',
            texto: 'white',
            mensagem: 'Urgente! Obesidade Grau III. Sua saúde está em risco. Procure ajuda médica.'
        };
    }
}

// Função para enviar mensagem via WhatsApp
function enviarWhatsApp(numero, imc, classificacao, mensagem) {
    // Remove a formatação do número
    const numeroLimpo = numero.replace(/\D/g, '');
    
    // Formata a mensagem
    const texto = `🩺 *Resultado do IMC*\n\n` +
                  `📊 *IMC:* ${imc.toFixed(1)}\n` +
                  `📋 *Classificação:* ${classificacao}\n\n` +
                  `💡 *Recomendação:* ${mensagem}\n\n` +
                  `_Cálculo realizado em: ${new Date().toLocaleDateString('pt-BR')}_`;
    
    // Codifica a mensagem para URL
    const textoCodificado = encodeURIComponent(texto);
    
    // Cria o link do WhatsApp
    const linkWhatsApp = `https://wa.me/55${numeroLimpo}?text=${textoCodificado}`;
    
    // Abre o WhatsApp em nova aba
    window.open(linkWhatsApp, '_blank');
}

// Evento de formatação do campo WhatsApp
document.getElementById('whatsapp').addEventListener('input', function(e) {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
});

// Evento de submit do formulário
document.getElementById('imcForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtém os valores
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const whatsapp = document.getElementById('whatsapp').value;
    
    // Validações
    if (!peso || !altura || !whatsapp) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    if (peso < 20 || peso > 300) {
        alert('Por favor, insira um peso válido (entre 20kg e 300kg)');
        return;
    }
    
    if (altura < 0.5 || altura > 2.5) {
        alert('Por favor, insira uma altura válida (entre 0.5m e 2.5m)');
        return;
    }
    
    // Validação do WhatsApp
    const whatsappNumeros = whatsapp.replace(/\D/g, '');
    if (whatsappNumeros.length < 10 || whatsappNumeros.length > 11) {
        alert('Por favor, insira um número de WhatsApp válido com DDD');
        return;
    }
    
    // Calcula o IMC
    const imc = calcularIMC(peso, altura);
    const resultado = classificarIMC(imc);
    
    // Atualiza o resultado na tela
    const resultadoDiv = document.getElementById('resultado');
    const imcValue = document.getElementById('imcValue');
    const classificacao = document.getElementById('classificacao');
    const progressBar = document.getElementById('progressBar');
    
    resultadoDiv.classList.remove('hidden');
    imcValue.textContent = imc.toFixed(1);
    classificacao.textContent = resultado.classificacao;
    classificacao.style.backgroundColor = resultado.cor;
    classificacao.style.color = resultado.texto;
    
    // Calcula a posição na barra de progresso (IMC de 10 a 40+)
    const progresso = Math.min(((imc - 10) / 30) * 100, 100);
    progressBar.style.setProperty('--progress', `${progresso}%`);
    progressBar.querySelector('::after')?.style?.setProperty('width', `${progresso}%`);
    progressBar.setAttribute('data-progress', progresso);
    
    // Configura o botão do WhatsApp
    document.getElementById('whatsappBtn').onclick = function() {
        enviarWhatsApp(whatsapp, imc, resultado.classificacao, resultado.mensagem);
    };
    
    // Scroll suave até o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Adiciona estilo dinâmico para a barra de progresso
const style = document.createElement('style');
style.textContent = `
    .progress-bar::after {
        width: var(--progress, 0%);
    }
`;
document.head.appendChild(style);

// Atualiza o progresso da barra quando definido
function atualizarProgressBar(progresso) {
    document.documentElement.style.setProperty('--progress', `${progresso}%`);
}

// Observador para atualizar a barra de progresso
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'progressBar' && mutation.type === 'attributes') {
            const progresso = mutation.target.getAttribute('data-progress');
            if (progresso) {
                atualizarProgressBar(progresso);
            }
        }
    });
});

const bar = document.getElementById('progressBar');
observer.observe(bar, { attributes: true });
