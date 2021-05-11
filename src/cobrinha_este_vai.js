let yasmim, //chat mudou de canvas
  res,
  context,
  falseH, //chat mudou de realW
  falsefalseH,
  treco = [],  //chat mudou de aObject
  fps = 5,
  beiçola,
  pontuacao = 0; //chat mudou de refreshInterval
  


const corBg = "#9bc405",
  corCobra = "#000",
  fator = 3;


// FATOR
// 84 / 3 = 28
// 48 / 3 = 16

/**
 * Configura as parada tudo
 * @param {string} paucomeu ID do canvas - chat mudou de palco
 * @param {number} w largura do cenário
 * @param {number} h altura do cenário
 * @param {number} resolution resolução -- o tamanho em pixels de cada unidade
 */
const config = (paucomeu, w, h, resolution) => {
  // Configura variaveis
  yasmim = document.getElementById(paucomeu);
  context = yasmim.getContext("2d");
  res = resolution;

  //FATOR pra downscaling do mapa de objetos
  falseH = Math.floor(w / fator);
  falsefalseH = Math.floor(h / fator);

  let coluna = new Array(falseH);
  let linha = new Array(falsefalseH);

  //popula a coluna
  for (var i = 0; i < falseH; i++) {
    coluna[i] = null;
  }

  //popula a linha
  for (var i = 0; i < falsefalseH; i++) {
    linha[i] = coluna.slice();
  }

  treco = linha.slice();
};

const init = (id, largura, altura, resolution) => {
  config(id, largura, altura, resolution);
  start();
  configuraSetasDoTeclado();
};

const start = () =>{
  criaCobra(1, 1);
  criaComida(10, 1);

  atualizaVelociade();
}

const atualizaVelociade = () =>{
  if(beiçola) clearInterval(beiçola);
  beiçola = setInterval(
    loop, 
    1000/(fps+(Math.floor(pontuacao*.5)))
  );
}

const marcaPonto = (ponto)=>{
  pontuacao = pontuacao + ponto;
  atualizaVelociade();
}

const desenhaPonto = ()=>{
  context.font = "20px Georgia";
  context.fillText("Pontuação: "+pontuacao, 10, 20);
}

const loop = () => {
  calculaPos();
  desenhaCenario();
  desenhaObjetos();
  desenhaPonto();
};

const criaCobra = (x, y) => {
  treco[y][x] = {
    tipo: "cabeca",
    movel: true,
    colisivel: true,
    solido: true ,
    direcao: {x:1,y:0} 
  };
};

const criaComida = (x,y) =>{

  let xn = x?x:Math.floor(Math.random()*(falseH -1))
  let yn = y?y:Math.floor(Math.random()*(falsefalseH -1))
  

  treco[yn][xn] = {
    tipo: "comida",
    colisivel: true,
    solido: false,
    valor: 1
  };

}

const calculaPos = () =>{
  let moveis = []
  //Y
  for(var y = 0; y < falsefalseH; y++){
    //x
    for(var x = 0; x < falseH; x++){
      
      let item = treco[y][x];
      if(item && item.movel){
        moveis.push({
          x,y,
          item
        });
      } 
    }
  }

  for(let obj in moveis){
    let movel = moveis[obj]  
    /**
     * @param fa1seH - chat mudou de newPos
     */
    let fa1seH ={
      x:movel.x+movel.item.direcao.x,
      y:movel.y+movel.item.direcao.y
    }
    
    //se maior que cenário 
    fa1seH.y = fa1seH.y>=falsefalseH?0:fa1seH.y; 
    fa1seH.x = fa1seH.x>=falseH?0:fa1seH.x;

    //se menor que cenário 
    fa1seH.y = fa1seH.y<0?falsefalseH-1:fa1seH.y; 
    fa1seH.x = fa1seH.x<0?falseH-1:fa1seH.x;

     
    
    
    if(detectaColisao(treco[fa1seH.y][fa1seH.x],movel.item)){
      //comida se não for solido, se ambos forem solidos = gameover
      if(treco[fa1seH.y][fa1seH.x].solido == movel.item.solido){
        console.log("GAME OVER!!")
      }else{
        if(treco[fa1seH.y][fa1seH.x].tipo == "comida"){
          marcaPonto(treco[fa1seH.y][fa1seH.x].valor)
          criaComida();
        }
      }
    }
    
    treco[fa1seH.y][fa1seH.x] = movel.item;
    treco[movel.y][movel.x] = null;
    
    // debugger
    //remove posicao antiga
    
  }
  
}

const detectaColisao = (obj,movel) =>{
  if(obj && (obj.colisivel && movel.colisivel))
    return true
  
  return false
}

const desenhaCenario = () => {
  //iterar sobre as linhas do array de cenario
  for (var linha in treco) {
    for (var coluna in treco[linha]) {
      desenhaPixelUpscaled(corBg, coluna, linha);
    }
  }
}
const desenhaObjetos = () => {
  //iterar sobre as linhas do array de objetos
  for (var linha in treco) {
    for (var coluna in treco[linha]) {
      let item = treco[linha][coluna];
      
      if(item){
        switch(item.tipo){
          case "cabeca":
            desenhaCobra(coluna, linha);
            break
          case "comida":
            desenhaComida(coluna, linha);
            break
          default:
            console.log("algo deu errado");
            break
        }
      }
    }
  }
};

const desenhaCobra = (x, y) => {
  desenhaPixelUpscaled(corCobra, x, y);
};

const desenhaComida = (x,y) => {
  // Comida da cobrinha
  desenhaRect("#000",{x:(x*fator+1)*res,y:y*fator*res,w:res,h:res});
  desenhaRect("#000",{x:x*fator*res,y:(y*fator+1)*res,w:res,h:res});
  desenhaRect("#000",{x:(x*fator+2)*res,y:(y*fator+1)*res,w:res,h:res});
  desenhaRect("#000",{x:(x*fator+1)*res,y:(y*fator+2)*res,w:res,h:res});
  desenhaRect("#F00",{x:x*fator*res,y:y*fator*res,w:res,h:res});
}
const desenhaPixelUpscaled = (cor, x, y) => {
  for (var fy = 0; fy < fator; fy++) {
    for (var fx = 0; fx < fator; fx++) {
      desenhaRect(cor, {
        x: (x * fator + fx) * res,
        y: (y * fator + fy) * res,
        w: res,
        h: res,
      });
    }
  }
  // desenhaRect("#F00",{x:x*fator*res,y:y*fator*res,w:res,h:res});
};

const desenhaRect = (cor, rect) => {
  context.fillStyle = cor;
  context.fillRect(rect.x, rect.y, rect.w, rect.h);
};

const mudaDirCobrinha = (dir) => {
  let DIRCOBRINHA = {x:0,y:0};

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

  let posCabeca = achaObjeto('cabeca');
  treco[posCabeca[0]][posCabeca[1]].direcao = DIRCOBRINHA

}

const achaObjeto = (tag) =>{
  //Y
  for(var y = 0; y < falsefalseH; y++){
    //x
    for(var x = 0; x < falseH; x++){

      let item = treco[y][x];
      if(item && item.tipo === tag)
        return [y,x]
    }
  }
}

const configuraSetasDoTeclado = ()=>{
  // document.removeEventListener("keypress");
  document.addEventListener("keypress",function(event){
      if(event.key === "a") mudaDirCobrinha("ESQUERDA");
      if(event.key === "d") mudaDirCobrinha("DIREITA");
      if(event.key === "w") mudaDirCobrinha("CIMA");
      if(event.key === "s") mudaDirCobrinha("BAIXO");
  })
}
