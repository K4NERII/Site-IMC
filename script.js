// formata o numero
function formatPhone(value) {
    // remove o que nn é numero
    const numbers = value.replace(/\D/g, '');
    
    // meio dificil de explicar mas basicamente faz bota essa mascara aqui (xx) xxxxx xxxx
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

// calcula o IMC
function calcularIMC(peso, altura) {
    return peso / (altura * altura);
}

// classifica o IMC
function classificarIMC(imc) {
    if (imc < 18.5) {
        return {
            classificacao: 'Abaixo do peso',
            cor: '#FFC107',
            texto: '#333',
            mensagem: 'Hulk magrelo.'
        };
    } else if (imc >= 18.5 && imc < 25) {
        return {
            classificacao: 'Peso normal',
            cor: '#4CAF50',
            texto: 'white',
            mensagem: 'Nada mais que sua obrigação'
        };
    } else if (imc >= 25 && imc < 30) {
        return {
            classificacao: 'Sobrepeso',
            cor: '#FF9800',
            texto: 'white',
            mensagem: 'Aceitavel ainda vai pra academia'
        };
    } else if (imc >= 30 && imc < 35) {
        return {
            classificacao: 'Obesidade Grau I',
            cor: '#FF5722',
            texto: 'white',
            mensagem: 'Baleio nivel 1 medo de saladas'
        };
    } else if (imc >= 35 && imc < 40) {
        return {
            classificacao: 'Obesidade Grau II',
            cor: '#F44336',
            texto: 'white',
            mensagem: 'vegetais contam historias suas na fogueira'
        };
    } else {
        return {
            classificacao: 'Obesidade Grau III',
            cor: '#B71C1C',
            texto: 'white',
            mensagem: 'Voê tem seu proprio pulso gravitacional, parabens'
        };
    }
}

// envia mensagem via WhatsApp
function enviarWhatsApp(numero, imc, classificacao, mensagem) {
    // tira a formatação
    const numeroLimpo = numero.replace(/\D/g, '');
    
    // mensagem
    const texto = `*Resultado do IMC*\n\n` +
                  `*IMC:* ${imc.toFixed(1)}\n` +
                  `*Classificação:* ${classificacao}\n\n` +
                  `*Recomendação:* ${mensagem}\n\n` +
                  `_Cálculo realizado em: ${new Date().toLocaleDateString('pt-BR')}_`;
    
    // codifica a mensagem para URL
    const textoCodificado = encodeURIComponent(texto);
    
    // cria o link do WhatsApp
    const linkWhatsApp = `https://wa.me/55${numeroLimpo}?text=${textoCodificado}`;
    
    // abre o WhatsApp em nova aba
    window.open(linkWhatsApp, '_blank');
}

// formatação do campo WhatsApp
document.getElementById('whatsapp').addEventListener('input', function(e) {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
});

// submit do formulário
document.getElementById('imcForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // obtém os valores
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const whatsapp = document.getElementById('whatsapp').value;
    
    // validações
    if (!peso || !altura || !whatsapp) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (peso < 20 || peso > 300) {
        alert('Um numero normal por favor (entre 20kg e 300kg)');
        return;
    }
    
    if (altura < 0.5 || altura > 2.5) {
        alert('você não tem 3 metros (entre 0.5m e 2.5m)');
        return;
    }
    
    // validação do WhatsApp
    const whatsappNumeros = whatsapp.replace(/\D/g, '');
    if (whatsappNumeros.length < 10 || whatsappNumeros.length > 11) {
        alert('Por favor, insira um número de WhatsApp válido com DDD');
        return;
    }
    
    // calcula o IMC
    const imc = calcularIMC(peso, altura);
    const resultado = classificarIMC(imc);
    
    // atualiza o resultado na tela
    const resultadoDiv = document.getElementById('resultado');
    const imcValue = document.getElementById('imcValue');
    const classificacao = document.getElementById('classificacao');
    const progressBar = document.getElementById('progressBar');
    
    resultadoDiv.classList.remove('hidden');
    imcValue.textContent = imc.toFixed(1);
    classificacao.textContent = resultado.classificacao;
    classificacao.style.backgroundColor = resultado.cor;
    classificacao.style.color = resultado.texto;
    
    // progresso (IMC de 10 a 40+)
    const progresso = Math.min(((imc - 10) / 30) * 100, 100);
    progressBar.style.setProperty('--progress', `${progresso}%`);
    progressBar.querySelector('::after')?.style?.setProperty('width', `${progresso}%`);
    progressBar.setAttribute('data-progress', progresso);
    
    // botão do WhatsApp
    document.getElementById('whatsappBtn').onclick = function() {
        enviarWhatsApp(whatsapp, imc, resultado.classificacao, resultado.mensagem);
    };
    
    // scroll até o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// adiciona estilo dinâmico para a barra de progresso
const style = document.createElement('style');
style.textContent = `
    .progress-bar::after {
        width: var(--progress, 0%);
    }
`;
document.head.appendChild(style);

// atualiza o progresso da barra quando definido
function atualizarProgressBar(progresso) {
    document.documentElement.style.setProperty('--progress', `${progresso}%`);
}

// observador para atualizar a barra de progresso
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
