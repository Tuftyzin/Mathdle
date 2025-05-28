// Mathdle - Gerador de questão diária (difícil)

function getSeedFromDate() { const now = new Date(); return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate(); }

function gerarQuestao(seed) { const tipos = [ 'primeiro_grau', 'segundo_grau', 'fracao', 'produto_notavel', 'logaritmo', 'sistema', 'trigonometria', 'geometria', 'numeros_complexos' ];

function rand(min, max) { seed = (seed * 9301 + 49297) % 233280; return min + (seed / 233280) * (max - min); } function randint(min, max) { return Math.floor(rand(min, max + 1)); } const tipo = tipos[randint(0, tipos.length - 1)]; let enunciado = ''; let resposta = ''; if (tipo === 'primeiro_grau') { const a = randint(3, 10); const rx = randint(-10, 10); const b = randint(-10, 10); const c = a * rx + b; enunciado = `${a}x ${b >= 0 ? '+ ' + b : '- ' + (-b)} = ${c}`; resposta = rx; } else if (tipo === 'segundo_grau') { const r1 = randint(-10, 10); const r2 = randint(-10, 10); const a = randint(1, 5); const b = -a * (r1 + r2); const c = a * r1 * r2; enunciado = `${a}x² ${b >= 0 ? '+ ' + b : '- ' + (-b)}x ${c >= 0 ? '+ ' + c : '- ' + (-c)} = 0`; resposta = [r1, r2].sort((x, y) => x - y); } else if (tipo === 'fracao') { const a = randint(2, 6); const b = randint(5, 15); const c = randint(2, 7); const x = a * (b - c); enunciado = `x/${a} + ${c} = ${b}`; resposta = x; } else if (tipo === 'produto_notavel') { const r = randint(1, 15); enunciado = `(x + ${r})² = 0`; resposta = -r; } else if (tipo === 'logaritmo') { const base = [2, 3, 10][randint(0, 2)]; const exp = randint(2, 5); const val = Math.pow(base, exp); enunciado = `log${base}(${val}) = x`; resposta = exp; } else if (tipo === 'sistema') { const x = randint(-5, 5); const y = randint(-5, 5); const a1 = randint(1, 5); const b1 = randint(1, 5); const a2 = randint(1, 5); const b2 = randint(1, 5); const c1 = a1 * x + b1 * y; const c2 = a2 * x + b2 * y; enunciado = `${a1}x + ${b1}y = ${c1} e ${a2}x + ${b2}y = ${c2}`; resposta = [x, y]; } else if (tipo === 'trigonometria') { const angulos = [30, 45, 60, 90]; const ang = angulos[randint(0, angulos.length - 1)]; const funcoes = ['sen', 'cos', 'tg']; const f = funcoes[randint(0, funcoes.length - 1)]; const valores = { 'sen': {30: '1/2', 45: '√2/2', 60: '√3/2', 90: '1'}, 'cos': {30: '√3/2', 45: '√2/2', 60: '1/2', 90: '0'}, 'tg': {30: '√3/3', 45: '1', 60: '√3', 90: 'indefinido'} }; enunciado = `${f}(${ang}°) = x`; resposta = valores[f][ang]; } else if (tipo === 'geometria') { const base = randint(5, 15); const altura = randint(5, 15); enunciado = `Calcule a área de um triângulo com base ${base} e altura ${altura}`; resposta = (base * altura) / 2; } else if (tipo === 'numeros_complexos') { const a = randint(1, 5); const b = randint(1, 5); enunciado = `Multiplique (${a} + ${b}i) por (${a} - ${b}i)`; resposta = a * a + b * b; } return { tipo, enunciado, resposta }; 

}

const seed = getSeedFromDate(); const questao = gerarQuestao(seed);

// Verificar se já respondeu hoje const hojeKey = 'resposta_' + seed; const respostaAnterior = localStorage.getItem(hojeKey);

function mostrarResultadoPopup(mensagem) { const popup = document.createElement('div'); popup.style.position = 'fixed'; popup.style.top = '50%'; popup.style.left = '50%'; popup.style.transform = 'translate(-50%, -50%)'; popup.style.background = '#eee'; popup.style.padding = '20px'; popup.style.border = '3px solid #000'; popup.style.zIndex = '1000'; popup.style.fontWeight = 'bold'; popup.style.fontSize = '20px'; popup.style.color = '#333'; popup.textContent = mensagem;

document.body.appendChild(popup); setTimeout(() => popup.remove(), 4000); 

}

document.addEventListener('DOMContentLoaded', () => { document.getElementById('questao-enunciado').textContent = questao.enunciado;

const botao = document.getElementById('enviar-resposta'); const input = document.getElementById('campo-resposta'); if (respostaAnterior !== null) { mostrarResultadoPopup(respostaAnterior === 'certa' ? 'Parabéns! Você acertou!' : 'Errado! Tente amanhã.'); botao.disabled = true; input.disabled = true; } botao.addEventListener('click', () => { const valor = input.value.trim(); if (valor === '') { alert('Digite uma resposta.'); return; } let correta = false; if (Array.isArray(questao.resposta)) { const corretaStr = questao.resposta.map(String).join(','); const entrada = valor.split(',').map(s => s.trim()).join(','); correta = entrada === corretaStr; } else { correta = valor === String(questao.resposta); } if (correta) { mostrarResultadoPopup('Parabéns! Você acertou!'); localStorage.setItem(hojeKey, 'certa'); } else { mostrarResultadoPopup('Errado! Tente amanhã.'); localStorage.setItem(hojeKey, 'errada'); } botao.disabled = true; input.disabled = true; }); 

});

