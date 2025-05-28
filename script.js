// Mathdle - Gerador de questão diária (difícil)

function getSeedFromDate() {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function gerarQuestao(seed) {
    const tipos = ['primeiro_grau', 'segundo_grau', 'fracao', 'produto_notavel', 'logaritmo'];
    
    function rand(min, max) {
        seed = (seed * 9301 + 49297) % 233280;
        return min + (seed / 233280) * (max - min);
    }
    
    function randint(min, max) {
        return Math.floor(rand(min, max + 1));
    }

    const tipo = tipos[randint(0, tipos.length - 1)];
    let enunciado = '';
    let resposta = '';

    if (tipo === 'primeiro_grau') {
        const a = randint(2, 9);
        const rx = randint(-5, 5);
        const b = randint(-5, 5);
        const c = a * rx + b;
        enunciado = `${a}x ${b >= 0 ? '+ ' + b : '- ' + (-b)} = ${c}`;
        resposta = rx;

    } else if (tipo === 'segundo_grau') {
        const r1 = randint(-5, 5);
        const r2 = randint(-5, 5);
        const a = randint(1, 3);
        const b = -a * (r1 + r2);
        const c = a * r1 * r2;
        enunciado = `${a}x² ${b >= 0 ? '+ ' + b : '- ' + (-b)}x ${c >= 0 ? '+ ' + c : '- ' + (-c)} = 0`;
        resposta = [r1, r2].sort((x, y) => x - y);

    } else if (tipo === 'fracao') {
        const a = randint(2, 5);
        const b = randint(3, 10);
        const c = randint(1, 5);
        const x = a * (b - c);
        enunciado = `x/${a} + ${c} = ${b}`;
        resposta = x;

    } else if (tipo === 'produto_notavel') {
        const r = randint(1, 10);
        enunciado = `(x + ${r})² = 0`;
        resposta = -r;

    } else if (tipo === 'logaritmo') {
        const base = [2, 3, 10][randint(0, 2)];
        const exp = randint(1, 3);
        const val = Math.pow(base, exp);
        enunciado = `log${base}(${val}) = x`;
        resposta = exp;
    
    } else if (tipo === 'sistema_equacoes') {
        const x = randint(-5, 5);
        const y = randint(-5, 5);
        const a1 = randint(1, 5);
        const b1 = randint(1, 5);
        const c1 = a1 * x + b1 * y;
        const a2 = randint(1, 5);
        const b2 = randint(1, 5);
        const c2 = a2 * x + b2 * y;
        enunciado = `\u007B ${a1}x + ${b1}y = ${c1}, ${a2}x + ${b2}y = ${c2} \u007D`;
        resposta = [x, y];
    }


    return { tipo, enunciado, resposta };
}

const seed = getSeedFromDate();
const questao = gerarQuestao(seed);

document.addEventListener('DOMContentLoaded', () => {
    const questaoEnunciado = document.getElementById('questao-enunciado');
    const botao = document.getElementById('enviar-resposta');
    const input = document.getElementById('campo-resposta');
    const contador = document.getElementById('contador');

    questaoEnunciado.textContent = questao.enunciado;

    const chaveLocalStorage = 'mathdle_respondeu_' + seed;

    // Verifica se já respondeu hoje e o resultado
    const respostaSalva = localStorage.getItem(chaveLocalStorage);
    if (respostaSalva !== null) {
        botao.disabled = true;
        input.disabled = true;

        if (respostaSalva === 'true') {
            alert('Parabéns! Você já respondeu a questão de hoje e acertou!');
        } else {
            alert('Você já respondeu a questão de hoje e errou. Tente amanhã!');
        }
    }

    botao.addEventListener('click', () => {
        if (botao.disabled) return;

        const valor = input.value.trim();
        if (valor === '') {
            alert('Digite uma resposta.');
            return;
        }

        let acertou = false;

        if (Array.isArray(questao.resposta)) {
            const correta = questao.resposta.map(String).join(',');
            const entrada = valor.split(',').map(s => s.trim()).sort().join(',');
            acertou = (entrada === correta);
        } else {
            acertou = (valor === String(questao.resposta));
        }

        if (acertou) {
            alert('Parabéns! Resposta correta.');
        } else {
            alert('Resposta incorreta. Tente novamente amanhã.');
        }

        botao.disabled = true;
        input.disabled = true;

        // Salva no localStorage o resultado da tentativa (true = acertou, false = errou)
        localStorage.setItem(chaveLocalStorage, acertou.toString());
    });

    function atualizarContador() {
        const agora = new Date();
        const meiaNoite = new Date();
        meiaNoite.setHours(24, 0, 0, 0);

        const diff = meiaNoite - agora;

        if (diff <= 0) {
            contador.textContent = "Nova questão disponível!";
            return;
        }

        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);

        const formatado = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        contador.textContent = `Próxima questão em: ${formatado}`;
    }

    setInterval(atualizarContador, 1000);
    atualizarContador();
});
