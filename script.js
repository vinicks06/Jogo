const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');
let gravidade = 0.5;
let gameOver = false;
let pontuacao = 0;
let tempo = 0; // Variável para controlar o tempo de jogo

// Objeto para rastrear teclas pressionadas
const teclasPressionadas = {
  ArrowRight: false,
  ArrowLeft: false,
};

// Classe base para todas as entidades do jogo
class Entidade {
  constructor(posx, posy, largura, altura, velocidadex = 0, velocidadey = 0) {
    this.posx = posx;
    this.posy = posy;
    this.largura = largura;
    this.altura = altura;
    this.velocidadex = velocidadex;
    this.velocidadey = velocidadey;
  }

  desenhar() {
    ctx.fillStyle = this.cor || 'white';
    ctx.fillRect(this.posx, this.posy, this.largura, this.altura);
  }

  atualizar() {
    this.posx += this.velocidadex;
    this.posy += this.velocidadey;
  }

  verificarColisao(outraEntidade) {
    return (
      this.posx < outraEntidade.posx + outraEntidade.largura &&
      this.posx + this.largura > outraEntidade.posx &&
      this.posy < outraEntidade.posy + outraEntidade.altura &&
      this.posy + this.altura > outraEntidade.posy
    );
  }
}

// Classe Personagem
class Personagem extends Entidade {
  constructor(posx, posy, largura, altura) {
    super(posx, posy, largura, altura);
    this.pulando = false;
    this.gravidade = gravidade;
    this.cor = 'white';
  }

  pular() {
    if (!this.pulando) {
      this.velocidadey = -15;
      this.pulando = true;
    }
  }

  atualizar() {
    super.atualizar();
    if (this.pulando) {
      this.velocidadey += this.gravidade;
    }
    if (this.posy + this.altura > canvas.height) {
      this.posy = canvas.height - this.altura;
      this.velocidadey = 0;
      this.pulando = false;
    }
    if (this.posx < 0) this.posx = 0;
    if (this.posx + this.largura > canvas.width) this.posx = canvas.width - this.largura;
  }
}

// Classe Obstaculo
class Obstaculo extends Entidade {
  constructor(posx, posy, largura, altura, velocidade) {
    super(posx, posy, largura, altura, velocidade);
    this.cor = 'red';
  }

  resetarPosicao() {
    this.posx = canvas.width;
    this.posy = canvas.height - (Math.random() * 50 + 90);
    this.altura = canvas.height - this.posy;
    this.velocidadex -= 0.5; // Aumenta a dificuldade
  }

  atualizar() {
    super.atualizar();
    if (this.posx + this.largura < 0) {
      this.resetarPosicao();
      pontuacao += 1;
    }
  }
}

// Instâncias
const personagem = new Personagem(50, canvas.height - 50, 50, 50);
const obstaculos = [
  new Obstaculo(canvas.width - 100, canvas.height - 100, 50, 100, -5),
  new Obstaculo(canvas.width + 300, canvas.height - 150, 50, 150, -5),
  new Obstaculo(canvas.width + 600, canvas.height - 120, 50, 120, -5),
];

// Event Listeners para movimentação
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp' && !personagem.pulando) {
    personagem.pular();
  }
  if (e.code === 'ArrowRight') teclasPressionadas.ArrowRight = true;
  if (e.code === 'ArrowLeft') teclasPressionadas.ArrowLeft = true;
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowRight') teclasPressionadas.ArrowRight = false;
  if (e.code === 'ArrowLeft') teclasPressionadas.ArrowLeft = false;
});

// Função para atualizar a movimentação do personagem
function atualizarMovimentacao() {
  const velocidadeBloco = Math.abs(obstaculos[0].velocidadex);

  if (teclasPressionadas.ArrowRight && !teclasPressionadas.ArrowLeft) {
    personagem.velocidadex = velocidadeBloco;
  } else if (teclasPressionadas.ArrowLeft && !teclasPressionadas.ArrowRight) {
    personagem.velocidadex = -velocidadeBloco;
  } else {
    personagem.velocidadex = 0;
  }
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  gameOver = false;
  pontuacao = 0;
  tempo = 0;
  gravidade = 0.5;
  personagem.posx = 50;
  personagem.posy = canvas.height - 50;
  personagem.velocidadey = 0;
  personagem.pulando = false;
  personagem.gravidade = gravidade;

  // Reseta os obstáculos
  obstaculos.forEach((obstaculo, index) => {
    obstaculo.posx = canvas.width + (index * 300);
    obstaculo.posy = canvas.height - (Math.random() * 50 + 90);
    obstaculo.altura = canvas.height - obstaculo.posy;
    obstaculo.velocidadex = -5;
  });


  loop();
}

document.addEventListener("click", (e) => {
  if (gameOver) {
    reiniciarJogo();
  }
});

function verificarColisoes() {
  for (const obstaculo of obstaculos) {
    if (personagem.verificarColisao(obstaculo)) {
      gameOver = true;
      ctx.fillStyle = 'red';
      ctx.fillRect((canvas.width / 2) - 200, (canvas.height / 2) - 50, 400, 100);
      ctx.fillStyle = 'black';
      ctx.font = '50px Arial';
      ctx.fillText("GAME OVER", (canvas.width / 2) - 150, (canvas.height / 2) + 20);
      return;
    }
  }
}

function desenharPontuacao() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Pontuação: ${pontuacao}`, 20, 30);
}

function aumentarGravidade() {
  tempo += 1;
  if (tempo % 100 === 0) {
    gravidade += 0.05;
    personagem.gravidade = gravidade;
  }
}

// Loop do jogo
function loop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  atualizarMovimentacao();

  [personagem, ...obstaculos].forEach(entidade => {
    entidade.desenhar();
    entidade.atualizar();
  });

  verificarColisoes();
  desenharPontuacao();
  aumentarGravidade();
  requestAnimationFrame(loop);
}

loop();