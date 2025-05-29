// script.js - Questões com alternativas A–E, timer, modo escuro, gabarito fixo e bloqueio após resposta

const temas = [
  "Produtos Notáveis",
  "Trigonometria",
  "Função Afim",
  "Função Quadrática",
  "Logaritmo",
  "Sistema de Equações",
  "Geometria",
  "Números Complexos"
];

function getDataAtualGMT3() {
  const now = new Date();
  const options = { timeZone: 'America/Sao_Paulo' };
  return now.toLocaleDateString('en-CA', options);
}

function getIndiceTema() {
  const hoje = new Date(getDataAtualGMT3());
  const inicio = new Date("2025-05-29");
  const diasPassados = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));
  return diasPassados % temas.length;
}

function seedRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function embaralharComSemente(array, seed) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seedRandom(seed + i) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const geradores = {
  "Produtos Notáveis": () => {
    const a = 3, b = 2;
    const correta = `${a*a}x^2 + ${2*a*b}x + ${b*b}`;
    const incorretas = [
      `${a*a}x^2 - ${2*a*b}x + ${b*b}`,
      `${a*a}x^2 + ${2*a*b}x - ${b*b}`,
      `${a*a}x^2 + ${b*b}x + ${2*a*b}`,
      `${2*a*b}x^2 + ${a*a}x + ${b*b}`
    ];
    return { text: `Simplifique: (${a}x + ${b})²`, correta, incorretas };
  },
  "Trigonometria": () => {
    const ang = 30;
    const correta = "1/2";
    const incorretas = ["1", "0", "√3/3", "√2/3"];
    return { text: `Qual o valor de sen(${ang}°)?`, correta, incorretas };
  },
  "Função Afim": () => {
    const m = 2, b = 3, x = 2;
    const correta = String(m * x + b);
    const incorretas = ["5", "6", "8", "3"];
    return {
      text: `Se f(x) = ${m}x + ${b}, qual o valor de f(${x})?`,
      correta,
      incorretas: incorretas.filter(i => i !== correta)
    };
  },
  "Função Quadrática": () => {
    const correta = "1 e 2";
    const incorretas = ["-1 e -2", "2 e 3", "1 e -2", "0 e 2"];
    return {
      text: "Quais são as raízes de x² - 3x + 2 = 0?",
      correta,
      incorretas
    };
  },
  "Logaritmo": () => {
    return {
      text: "Qual o valor de log₂(8)?",
      correta: "3",
      incorretas: ["2", "1", "4", "8"]
    };
  },
  "Sistema de Equações": () => {
    return {
      text: "Resolva o sistema:\n2x + y = 7\nx - y = 1\nQual o valor de x?",
      correta: "2",
      incorretas: ["1", "3", "0", "4"]
    };
  },
  "Geometria": () => {
    return {
      text: "Qual é a área de um triângulo com base 6 e altura 4?",
      correta: "12",
      incorretas: ["10", "14", "8", "16"]
    };
  },
  "Números Complexos": () => {
    return {
      text: "Qual é o módulo de 3 + 4i?",
      correta: "5",
      incorretas: ["7", "4", "3", "6"]
    };
  }
};

function mostrarQuestaoDoDia() {
  const index = getIndiceTema();
  const tema = temas[index];
  const dataHoje = getDataAtualGMT3();
  const seed = new Date(dataHoje).getTime();
  const { text, correta, incorretas } = geradores[tema]();

  const todas = embaralharComSemente([correta, ...incorretas], seed);
  const corretaIndex = todas.indexOf(correta);

  document.getElementById("question").textContent = text;

  const container = document.getElementById("alternatives");
  container.innerHTML = "";
  ["A", "B", "C", "D", "E"].forEach((letra, i) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type='radio' name='alt' value='${i}'> <strong>${letra})</strong> ${todas[i]}`;
    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  });

  window.respostaCorreta = corretaIndex;
}

function atualizarTimer() {
  const agora = new Date();
  const meiaNoite = new Date();
  meiaNoite.setHours(24, 0, 0, 0);
  const restante = meiaNoite - agora;
  const h = String(Math.floor(restante / 3600000)).padStart(2, '0');
  const m = String(Math.floor((restante % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((restante % 60000) / 1000)).padStart(2, '0');
  document.getElementById("timer").textContent = `Nova questão em: ${h}:${m}:${s}`;
}

window.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleThemeBtn");
  const body = document.body;

  const temaSalvo = localStorage.getItem("mathdle_theme");
  if (temaSalvo === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "Modo Claro";
  } else {
    body.classList.add("light-mode");
    toggleBtn.textContent = "Modo Escuro";
  }

  toggleBtn.addEventListener("click", () => {
    if (body.classList.contains("light-mode")) {
      body.classList.replace("light-mode", "dark-mode");
      toggleBtn.textContent = "Modo Claro";
      localStorage.setItem("mathdle_theme", "dark");
    } else {
      body.classList.replace("dark-mode", "light-mode");
      toggleBtn.textContent = "Modo Escuro";
      localStorage.setItem("mathdle_theme", "light");
    }
  });

  mostrarQuestaoDoDia();
  atualizarTimer();
  setInterval(atualizarTimer, 1000);

  const result = document.getElementById("result");
  const btn = document.getElementById("submitBtn");

  const dataHoje = getDataAtualGMT3();
  const jaRespondeu = localStorage.getItem("resposta_mathdle_" + dataHoje);

  if (jaRespondeu !== null) {
    result.textContent = "Você já respondeu hoje. Volte amanhã!";
    btn.disabled = true;
    const radios = document.getElementsByName("alt");
    radios.forEach(r => r.disabled = true);
    return;
  }

  btn.addEventListener("click", () => {
    const selecionado = document.querySelector("input[name='alt']:checked");
    if (!selecionado) {
      result.textContent = "Selecione uma alternativa.";
      return;
    }
    const valor = parseInt(selecionado.value);
    localStorage.setItem("resposta_mathdle_" + dataHoje, valor);
    const radios = document.getElementsByName("alt");
    radios.forEach(r => r.disabled = true);
    btn.disabled = true;

    if (valor === window.respostaCorreta) {
      result.textContent = "Resposta correta! ✅";
    } else {
      result.textContent = "Resposta incorreta. Tente novamente.";
    }
  });
});
