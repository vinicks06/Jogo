const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

document.addEventListener("click", (e) => {
    if(gameOver==true){
        location.reload()
    }
})

let gameOver = false;

const personagem = {
    posx:50,
    posy:canvas.height-50,
    largura:50,
    altura:50
}

function desenhaPersonagem(){
    ctx.fillStyle = 'white'
    ctx.fillRect(personagem.posx,
        personagem.posy,
        personagem.largura,
        personagem.altura)
}

const obstaculo = {
    posx:canvas.width-100,
    posy:canvas.height-100,
    tamx:50,
    tamy:100,
    velocidade:5
}

function desenhaObstaculo(){
    ctx.fillStyle = 'red'
    ctx.fillRect(
        obstaculo.posx,
        obstaculo.posy,
        obstaculo.tamx,
        obstaculo.tamy
    )
}

function atualizaObstaculo(){
    obstaculo.posx -= obstaculo.velocidade
}

function verificaColisao() {
    if (
        personagem.posx < obstaculo.posx + obstaculo.tamx &&
        personagem.posx + personagem.largura > obstaculo.posx &&
        personagem.posy < obstaculo.posy + obstaculo.tamy &&
        personagem.posy + personagem.altura > obstaculo.posy
    ) {
        houveColisao()
    }
}

function houveColisao(){
    obstaculo.velocidade = 0
    atualizaObstaculo()
    ctx.fillStyle = 'red'
    ctx.fillRect((canvas.width/2)-200, (canvas.height/2)-50, 400, 100)
    ctx.fillStyle = 'black'
    ctx.font = '50px Arial'
    ctx.fillText("GAME OVER", (canvas.width/2)-150, (canvas.height/2)+20)
    gameOver = true
    
}

function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    verificaColisao
    desenhaObstaculo()
    desenhaPersonagem()
    atualizaObstaculo()
    verificaColisao()
    requestAnimationFrame(loop)
}

loop()