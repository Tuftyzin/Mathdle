// script.js - Questões com alternativas A–E, timer e modo escuro

const temas = [ "Produtos Notáveis", "Trigonometria", "Função Afim", "Função Quadrática", "Logaritmo", "Sistema de Equações", "Geometria", "Números Complexos" ];

function getDataAtualGMT3() { const now = new Date(); const options = { timeZone: 'America/Sao_Paulo' }; return now.toLocaleDateString('en-CA', options); }

function getIndiceTema() { const hoje = new Date(getDataAtualGMT3()); const inicio = new Date("2025-05-29"); const diasPassados = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24)); return diasPassados % temas.length; }

function embaralhar(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

const geradores = { "Produtos Notáveis": () => { const a = Math.floor(Math.random() * 5 + 1); const b = Math.floor(Math.random() * 5 + 1); const correta = ${a*a}x^2 + ${2*a*b}x + ${b*b}; const incorretas = [ ${a*a}x^2 - ${2*a*b}x + ${b*b}, ${a*a}x^2 + ${2*a*b}x - ${b*b}, ${a*a}x^2 + ${b*b}x + ${2*a*b}, ${2*a*b}x^2 + ${a*a}x + ${b*b} ]; const alternativas = embaralhar([correta, ...incorretas]); return { text: Simplifique: (${a}x + ${b})², alternatives, answer: alternativas.indexOf(correta) }; }, "Trigonometria": () => { const ang = [30, 45, 60][Math.floor(Math.random() * 3)]; const correta = {30: "1/2", 45: "√2/2", 60: "√3/2"}[ang]; const incorretas = ["1", "0", "√3/3", "√2/3"].filter(a => a !== correta); const alternativas = embaralhar([correta, ...incorretas.slice(0, 4)]); return { text: Qual o valor de sen(${ang}°)?, alternatives, answer: alternativas.indexOf(correta) }; }, "Função Afim": () => { const m = Math.floor(Math.random() * 5 + 1); const b = Math.floor(Math.random() * 10); const x = 2; const correta = m * x + b; const alternativas = embaralhar([ correta, correta + 1, correta - 1, correta + 2, correta - 2 ].map(String)); return { text: Se f(x) = ${m}x + ${b}, qual o valor de f(${x})?, alternatives, answer: alternativas.indexOf(String(correta)) }; }, "Função Quadrática": () => { const correta = "1 e 2"; const alternativas = embaralhar([ "1 e 2", "-1 e -2", "2 e 3", "1 e -2", "0 e 2" ]); return { text: "Quais são as raízes de x² - 3x + 2 = 0?", alternatives, answer: alternativas.indexOf(correta) }; }, "Logaritmo": () => { const alternativas = embaralhar(["3", "2", "1", "4", "8"]); return { text: "Qual o valor de log₂(8)?", alternatives, answer: alternativas.indexOf("3") }; }, "Sistema de Equações": () => { const alternativas = embaralhar(["2", "1", "3", "0", "4"]); return { text: "Resolva o sistema:\n2x + y = 7\nx - y = 1\nQual o valor de x?", alternatives, answer: alternativas.indexOf("2") }; }, "Geometria": () => { const alternativas = embaralhar(["12", "10", "14", "8", "16"]); return { text: "Qual é a área de um triângulo com base 6 e altura 4?", alternatives, answer: alternativas.indexOf("12") }; }, "Números Complexos": () => { const alternativas = embaralhar(["5", "7", "4", "3", "6"]); return { text: "Qual é o módulo de 3 + 4i?", alternatives, answer: alternativas.indexOf("5") }; } };

function mostrarQuestaoDoDia() { const index = getIndiceTema(); const tema = temas[index]; const { text, alternatives, answer } = geradorestema;

document.getElementById("question").textContent = text;

const container = document.getElementById("alternatives"); container.innerHTML = ""; ["A", "B", "C", "D", "E"].forEach((letra, i) => { const label = document.createElement("label"); label.innerHTML = <input type='radio' name='alt' value='${i}'> ${letra}) ${alternatives[i]}; container.appendChild(label); container.appendChild(document.createElement("br")); });

window.respostaCorreta = answer; }

function atualizarTimer() { const agora = new Date(); const meiaNoite = new Date(); meiaNoite.setHours(24, 0, 0, 0); const restante = meiaNoite - agora; const h = String(Math.floor(restante / 3600000)).padStart(2, '0'); const m = String(Math.floor((restante % 3600000) / 60000)).padStart(2, '0'); const s = String(Math.floor((restante % 60000) / 1000)).padStart(2, '0'); document.getElementById("timer").textContent = Nova questão em: ${h}:${m}:${s}; }

window.addEventListener("DOMContentLoaded", () => { const toggleBtn = document.getElementById("toggleThemeBtn"); const body = document.body;

const temaSalvo = localStorage.getItem("mathdle_theme"); if (temaSalvo === "dark") { body.classList.add("dark-mode"); toggleBtn.textContent = "Modo Claro"; } else { body.classList.add("light-mode"); toggleBtn.textContent = "Modo Escuro"; }

toggleBtn.addEventListener("click", () => { if (body.classList.contains("light-mode")) { body.classList.replace("light-mode", "dark-mode"); toggleBtn.textContent = "Modo Claro"; localStorage.setItem("mathdle_theme", "dark"); } else { body.classList.replace("dark-mode", "light-mode"); toggleBtn.textContent = "Modo Escuro"; localStorage.setItem("mathdle_theme", "light"); } });

mostrarQuestaoDoDia(); atualizarTimer(); setInterval(atualizarTimer, 1000);

const result = document.getElementById("result"); const btn = document.getElementById("submitBtn");

btn.addEventListener("click", () => { const selecionado = document.querySelector("input[name='alt']:checked"); if (!selecionado) { result.textContent = "Selecione uma alternativa."; return; } const valor = parseInt(selecionado.value); if (valor === window.respostaCorreta) { result.textContent = "Resposta correta! ✅"; } else { result.textContent = "Resposta incorreta. Tente novamente."; } }); });

