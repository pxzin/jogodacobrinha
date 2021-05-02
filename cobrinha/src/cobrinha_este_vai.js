let canvas,
  res,
  context,
  realW,
  realH,
  treco = []; //chat mudou para aObject

const corBg = "#9bc405",
  corCobra = "#000",
  fator = 3;

// FATOR
// 84 / 3 = 28
// 48 / 3 = 16

/**
 * Configura as parada tudo
 * @param {string} palco ID do canvas
 * @param {number} w largura do cenário
 * @param {number} h altura do cenário
 * @param {number} resolution resolução -- o tamanho em pixels de cada unidade
 */
const config = (palco, w, h, resolution) => {
  // Configura variaveis
  canvas = document.getElementById(palco);
  context = canvas.getContext("2d");
  res = resolution;

  //FATOR pra downscaling do mapa de objetos
  realW = Math.floor(w / fator);
  realH = Math.floor(h / fator);

  let coluna = new Array(realW);
  let linha = new Array(realH);

  //popula a coluna
  for (var i = 0; i < realW; i++) {
    coluna[i] = null;
  }

  //popula a linha
  for (var i = 0; i < realH; i++) {
    linha[i] = coluna.slice();
  }

  treco = linha.slice();
};

const init = (id, largura, altura, resolution) => {
  config(id, largura, altura, resolution);
  criaCobra(1, 1);
  loop();
};

const loop = () => {
  desenhaObjetos();

  //Comida da cobrinha
  // desenhaRect("#000",{x:5*res,y:1*res,w:res,h:res});
  // desenhaRect("#000",{x:4*res,y:2*res,w:res,h:res});
  // desenhaRect("#000",{x:6*res,y:2*res,w:res,h:res});
  // desenhaRect("#000",{x:5*res,y:3*res,w:res,h:res});
};

const criaCobra = (x, y) => {
  treco[y][x] = {
    tipo: "cobra",
    cabeça: true,
  };
};
const desenhaObjetos = () => {
  //iterar sobre as linhas do array de objetos
  console.log("VAI DESENHAR BJETOS");
  for (var linha in treco) {
    for (var coluna in treco[linha]) {
      let item = treco[linha][coluna];
      if (!item) {
        // desenhaRect(corBg, { x: coluna * res, y: linha * res, w: res, h: res });
        desenhaPixelUpscaled(corBg, coluna, linha);
      } else {
        if (item && item.tipo && item.tipo === "cobra") {
          desenhaCobra(coluna, linha);
        }
      }
    }
  }
};

const desenhaCobra = (x, y) => {
  desenhaPixelUpscaled(corCobra, x, y);
};
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
