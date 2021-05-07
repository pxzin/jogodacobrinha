/* 
JOGO DA COBRINHA 0.0.1 
Autor: PXzin
*/

//VARS
var LARGURA, 
    ALTURA, 
    PALCO, CTX,
    CORFUNDO = "#9bc405",
    CORSECUNDARIA = "#575",
    FPS = 30,
    LOOPINTERVAL;

//COBRINHA VARS
var CORCOBRINHA = "#000000",
    VELOCIDADECOBRINHA = 1,
    GROSSURADACOBRA = 7,
    POSCOBRINHA = {x:0,y:0},
    DIRCOBRINHA = {x:1,y:0} //xy -1, 0, 1

var objetos = []
var caudaCobraAr = []

var comida = {
    tipo: "COMIDA",
    x: 0,
    y: 0,
    colisao: true   
}

var caudaCobra = {
    tipo: "CAUDA",
    x: 0,
    y: 0,
    colisao: true   
}

//CONFIGURAÇÕES BASICAS
function config(){
    
    LARGURA = 300;
    ALTURA = 150;
    PALCO = document.getElementById("palco");
    
    CTX = PALCO.getContext('2d');

    POSCOBRINHA.x = 10;
    POSCOBRINHA.y = 10;

    configuraSetasDoTeclado();
}

function criaComida(){
    // NOJENTO
    var nComida = JSON.parse(JSON.stringify(comida));

    nComida.x = Math.abs(Math.floor(Math.random()*LARGURA-(GROSSURADACOBRA + 1) ))
    nComida.y = Math.abs(Math.floor(Math.random()*ALTURA- (GROSSURADACOBRA + 1) ))
    //COMIDA NAO PODE CAIR EM POSICAO PAR
    nComida.x = nComida.x % 2 ? nComida.x : nComida.x - 1
    nComida.y = nComida.y % 2 ? nComida.y : nComida.y - 1
    objetos.push(nComida);
}

//INPUT DOS CONTROLES
function moveCobrinha(){
    POSCOBRINHA.x = POSCOBRINHA.x + (VELOCIDADECOBRINHA * DIRCOBRINHA.x)
    POSCOBRINHA.y = POSCOBRINHA.y + (VELOCIDADECOBRINHA * DIRCOBRINHA.y)

    if(POSCOBRINHA.x > LARGURA) POSCOBRINHA.x = 0;
    if(POSCOBRINHA.y > ALTURA) POSCOBRINHA.y = 0;

    if(POSCOBRINHA.x < 0) POSCOBRINHA.x = LARGURA;
    if(POSCOBRINHA.y < 0) POSCOBRINHA.y = ALTURA;
}

function mudaDirCobrinha(dir){
    switch(dir){
        case "ESQUERDA":
            if(DIRCOBRINHA.x === 0)
                DIRCOBRINHA = {x:-1,y:0}
            break;
        case "DIREITA":
            if(DIRCOBRINHA.x === 0)
                DIRCOBRINHA = {x:1,y:0}
            break;
        case "CIMA":
            if(DIRCOBRINHA.y === 0)
                DIRCOBRINHA = {x:0,y:-1}
            break;
        case "BAIXO":
            if(DIRCOBRINHA.y === 0)
                DIRCOBRINHA = {x:0,y:1}
            break;    
    }
}

function configuraSetasDoTeclado(){
    // document.removeEventListener("keypress");
    document.addEventListener("keypress",function(event){
        if(event.key === "a") mudaDirCobrinha("ESQUERDA");
        if(event.key === "d") mudaDirCobrinha("DIREITA");
        if(event.key === "w") mudaDirCobrinha("CIMA");
        if(event.key === "s") mudaDirCobrinha("BAIXO");
    })
}

function checarColisoes(){
    for(var i in objetos){
        var objeto = objetos[i];
        if( 
            (POSCOBRINHA.x >= objeto.x && POSCOBRINHA.x <= objeto.x+GROSSURADACOBRA) 
                &&
            (POSCOBRINHA.y >= objeto.y && POSCOBRINHA.y <= objeto.y+GROSSURADACOBRA) 
        ){
            //COMEU
            objetos.splice(i,1);
            cobrinhaComeu();
            criaComida();
        }
    }
}

function cobrinhaComeu(){
    VELOCIDADECOBRINHA = VELOCIDADECOBRINHA * 2;
}

//LOOP PRINCIPAL
function loop(){
    //DESENHAR O CENARIO
    desenharCenario();
    //DESENHAR A COBRINHA
    desenharCobrinha();
    //DESENHAR OBJETOS - AKA pontos
    desenharObjetos();

    moveCobrinha();
    checarColisoes();

}

function desenharCenario(){
    CTX.fillStyle = CORFUNDO;
    CTX.fillRect(0, 0, LARGURA, ALTURA);
}

function desenharCobrinha(){
    CTX.fillStyle = CORCOBRINHA;
    CTX.fillRect(
        POSCOBRINHA.x-Math.floor(GROSSURADACOBRA/2), 
        POSCOBRINHA.y-Math.floor(GROSSURADACOBRA/2),
        GROSSURADACOBRA, 
        GROSSURADACOBRA);

    
    
}
function desenharObjetos(){
    for(var i in objetos){
        var objeto = objetos[i];

        CTX.fillStyle = CORSECUNDARIA;
        CTX.fillRect(
            objeto.x-Math.floor(GROSSURADACOBRA/2), 
            objeto.y-Math.floor(GROSSURADACOBRA/2),
            GROSSURADACOBRA, 
            GROSSURADACOBRA);
    }
}
//init
function init (){
    config();
    criaComida();

    clearInterval(LOOPINTERVAL);
    LOOPINTERVAL = setInterval(loop,1000/FPS);
        
}

