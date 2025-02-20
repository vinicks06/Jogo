const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');
let gravidade = 0.5

document.addEventListener("click", (e) => {
    if(gameOver==true){
        location.reload()
    }
})
document,addEventListener('keypress', (e) =>{
    if(e.code = 'Space' && personagem.pulando === false){
        personagem.velocidadey = -15
        personagem.pulando = true
    }
})

let gameOver = false;

const personagem = {
    posx:50,
    posy:canvas.height-50,
    largura:50,
    altura:50,
    velocidadey:0,
    pulando: false
}

function desenhaPersonagem(){
    ctx.fillStyle = 'white'
    ctx.fillRect(personagem.posx,
        personagem.posy,
        personagem.largura,
        personagem.altura,)
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
    if(obstaculo.posx + obstaculo.tamx <= 0){
        altura_random = (Math.random() * 50) + 90
        obstaculo.posx = canvas.width;
        obstaculo.tamy = altura_random;
        obstaculo.posy = canvas.height - altura_random;
        obstaculo.velocidade += 0.5;
    }
}

function atualizaPersonagem(){
    if(personagem.pulando == true){
        personagem.velocidadey += gravidade
        personagem.posy += personagem.velocidadey
    }
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

function verificaChao(){
    if(personagem.posy >= canvas.height - personagem.altura){
        personagem.posy = canvas.height - personagem.altura;
        personagem.velocidadey = 0;
        personagem.pulando = false;
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
    document.addEventListener('keydown', (e) =>{
        if(e.code === 'Space'){
            event.preventDefault()
        }
    })
    
}

function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    desenhaObstaculo()
    desenhaPersonagem()
    atualizaObstaculo()
    atualizaPersonagem()
    verificaColisao()
    verificaChao()
    requestAnimationFrame(loop)
}

loop()