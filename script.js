const quadro = document.getElementById('pixel-board');
const botaoLimpar = document.getElementById('clear-board');
const botaoCoresAleatorias = document.getElementById('button-random-color');
const cores = document.querySelectorAll('.color');
const entradaTamanhoQuadro = document.getElementById('board-size');
const botaoGerarQuadro = document.getElementById('generate-board');

function mostrarMensagemErro() {
  alert("Board inválido!");
}

function criarQuadroDePixels(linhas, colunas) {
  const pixels = [];
  const totalPixels = linhas * colunas;
  for (let i = 0; i < totalPixels; i++) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.style.backgroundColor = 'rgb(255, 255, 255)';
    pixel.addEventListener('click', pintarPixel);
    pixels.push(pixel);
  }
  return pixels;
}

function adicionarPixelsAoQuadro(pixels) {
  pixels.forEach((pixel) => quadro.appendChild(pixel));
}

function selecionarCor(evento) {
  const corSelecionada = document.querySelector('.selected');
  if (corSelecionada) {
    corSelecionada.classList.remove('selected');
  }
  evento.target.classList.add('selected');
}

function pintarPixel(evento) {
  const corSelecionada = document.querySelector('.selected');
  if (corSelecionada && evento.target.classList.contains('pixel')) {
    evento.target.style.backgroundColor = corSelecionada.style.backgroundColor;
    salvarPintura();
  }
}

function limparQuadro() {
  const pixels = document.querySelectorAll('.pixel');
  pixels.forEach((pixel) => (pixel.style.backgroundColor = 'white'));
  salvarPintura();
}

function obterCorAleatoria() {
  const letras = '0123456789ABCDEF';
  let cor;
  do {
    cor = '#';
    for (let i = 0; i < 6; i++) {
      cor += letras[Math.floor(Math.random() * 16)];
    }
  } while (cor === 'rgb(255, 255, 255)');
  return cor;
}

function coresAleatorias() {
  cores.forEach((botao) => {
    let corAleatoria = obterCorAleatoria();
    while (corAleatoria === 'rgb(255, 255, 255)') {
      corAleatoria = obterCorAleatoria();
    }
    botao.style.backgroundColor = corAleatoria;
  });
}

function salvarPintura() {
  const pixels = document.querySelectorAll('.pixel');
  const coresDosPixels = Array.from(pixels).map(
    (pixel) => pixel.style.backgroundColor
  );
  localStorage.setItem('pixelBoard', JSON.stringify(coresDosPixels));
}

function carregarPintura() {
  const pixelColors = JSON.parse(localStorage.getItem('pixelBoard'));
  if (pixelColors) {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach((pixel, index) => {
      pixel.style.backgroundColor = pixelColors[index];
    });
  }
}

function obterTamanhoQuadro() {
  const tamanhoQuadro = parseInt(entradaTamanhoQuadro.value);
  if (isNaN(tamanhoQuadro) || tamanhoQuadro <= 0) {
    return null;
  }const tamanhoMinimo = 5;
  if (tamanhoQuadro < tamanhoMinimo) {
    mostrarMensagemErro();
    entradaTamanhoQuadro.value = ''; 
    return;
  }
  return tamanhoQuadro;
}

function gerarQuadro() {
  const tamanhoQuadro = obterTamanhoQuadro();
  if (tamanhoQuadro === null) {
    ;
    return;
  }
  const tamanhoMaximo = 50;
  if (tamanhoQuadro > tamanhoMaximo) {
    mostrarMensagemErro();
  }

  entradaTamanhoQuadro.value = tamanhoQuadro <= tamanhoMaximo ? tamanhoQuadro : tamanhoMaximo;
  localStorage.setItem('boardSize', entradaTamanhoQuadro.value);

  const pixels = criarQuadroDePixels(tamanhoQuadro, tamanhoQuadro);
  quadro.innerHTML = '';
  adicionarPixelsAoQuadro(pixels);
  cores.forEach((botao) => botao.addEventListener('click', selecionarCor));
  botaoLimpar.addEventListener('click', limparQuadro);
  botaoCoresAleatorias.addEventListener('click', coresAleatorias);
  carregarPintura();
}

function iniciarQuadro() {
  const tamanhoQuadroSalvo = parseInt(localStorage.getItem('boardSize'));
  if (tamanhoQuadroSalvo) {
    entradaTamanhoQuadro.value = tamanhoQuadroSalvo;
  } else {
    entradaTamanhoQuadro.value = 5;
  }
  gerarQuadro();
}

function atualizarTamanhoQuadro() {
  const tamanhoQuadro = obterTamanhoQuadro();
  if (tamanhoQuadro === null) {
    return;
  }
  if (tamanhoQuadro < 5) {
    return;
  }
  gerarQuadro();
}

botaoGerarQuadro.addEventListener('click', gerarQuadro);
entradaTamanhoQuadro.addEventListener('input', atualizarTamanhoQuadro);

iniciarQuadro();