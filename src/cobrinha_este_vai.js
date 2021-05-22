let yasmim, //chat mudou de canvas
  res,
  context,
  falseH, //chat mudou de realW
  falsefalseH,
  treco = [],  //chat mudou de aObject
  fps = 5,
  beiçola,
  pontuacao = 0,
  cresce = false; //chat mudou de refreshInterval
  


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
  criaComida(6, 1);

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
    tipo: "zé",
    movel: true,
    colisivel: true,
    solido: true ,
    direcao: {x:1,y:0} 
  };
};
const criaRicardo = (x, y,dir) => {
  treco[y][x] = {
    tipo: "ricardo",
    movel: true,
    colisivel: true,
    solido: true ,
    direcao: dir
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
const adicionaRicardo = ()=>{
  // adiciona um colisivel do tipo ricardo no objeto treco
  // ele deve ser adicionado no vetor oposto ao deslocamento do fragmento de ricardo anterior ou zé caso seja o primeiro
  
  let posLastFrag = achaObjeto('ricardo') ?? achaObjeto('zé');
  console.log(posLastFrag)
  if(posLastFrag){
    let pivotDir = treco[posLastFrag[0]][posLastFrag[1]].direcao
    let newFragPos = [posLastFrag[0] + (pivotDir.y*-1), posLastFrag[1] + (pivotDir.x*-1)]    // {x:pivotDir.x*-1,y:pivotDir.y*-1}
    criaRicardo(newFragPos[1],newFragPos[0],pivotDir);
  }
  
}
const calculaPos = () =>{
  let apartamentosNoMorumbi = [] //apartamentosNoMorumbi => moveis
  //Y
  for(var y = 0; y < falsefalseH; y++){
    //x
    for(var x = 0; x < falseH; x++){
      
      let item = treco[y][x];
      if(item && item.movel){
        apartamentosNoMorumbi.push({
          x,y,
          item
        });
      } 
    }
  }

  for(let obj in apartamentosNoMorumbi){
    let sofá = apartamentosNoMorumbi[obj]   //sofá => movel
    /**
     * @param fa1seH - chat mudou de newPos
     */
    let fa1seH ={
      x:sofá.x+sofá.item.direcao.x,
      y:sofá.y+sofá.item.direcao.y
    }
    
    //se maior que cenário 
    fa1seH.y = fa1seH.y>=falsefalseH?0:fa1seH.y; 
    fa1seH.x = fa1seH.x>=falseH?0:fa1seH.x;

    //se menor que cenário 
    fa1seH.y = fa1seH.y<0?falsefalseH-1:fa1seH.y; 
    fa1seH.x = fa1seH.x<0?falseH-1:fa1seH.x;

     
     
    
    if(detectaColisao(treco[fa1seH.y][fa1seH.x],sofá.item)){
      //comida se não for solido, se ambos forem solidos = gameover
      // console.log(treco[fa1seH.y][fa1seH.x].tipo)
      
      if(treco[fa1seH.y][fa1seH.x].solido == sofá.item.solido){
        console.log("GAME OVER!!",sofá.item,treco[fa1seH.y][fa1seH.x])
        debugger                      
      }else{
        if(treco[fa1seH.y][fa1seH.x].tipo == "comida"){
          marcaPonto(treco[fa1seH.y][fa1seH.x].valor)
          cresce = true;
          criaComida();
        }
      }
    }else{
      sofá.item.moveu = true;
      treco[fa1seH.y][fa1seH.x] = sofá.item;
      treco[sofá.y][sofá.x] = null; 
    }

    
    if(cresce){
      cresce = false;
      adicionaRicardo();
    }

  }
  
}

const detectaColisao = (obj,movel) =>{
  if(obj && movel){
    console.log(obj,movel)
    if(obj && (obj.colisivel && movel.colisivel))
      return true
  }
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
          case "zé":
            desenhaCobra(coluna, linha);
            break
          case "comida":
            desenhaComida(coluna, linha);
            break
          case "ricardo":
            desenhaRicardo(coluna, linha);
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
}
desenhaRicardo = (x,y) =>{
  desenhaPixelUpscaled("#000",x,y)
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

  let posZé = achaObjeto('zé');
  let dirAtual = treco[posZé[0]][posZé[1]].direcao;
  if(Math.abs(dirAtual.x + DIRCOBRINHA.x) === 1 || Math.abs(dirAtual.y + DIRCOBRINHA.y) === 1)
    treco[posZé[0]][posZé[1]].direcao = DIRCOBRINHA

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
