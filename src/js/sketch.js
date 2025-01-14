let data = [];
let colorSets = [];
let percentages = {
  "Passive-Active": 50,
  "Dull-Bright": 50,
  "Cold-Warm": 60
};
//-----------------------------------------------------------------------------------------
//----------------------------------------- DEBUG -----------------------------------------
//-----------------------------------------------------------------------------------------
const DEBUG_ON = false; //Change this value to hide console

//-----------------------------------------------------------------------------------------
//-------------------------------------- DECLARATION --------------------------------------
//-----------------------------------------------------------------------------------------

const MAX_SETS = 20;
const COLORS_BY_SET = 4; //Nb couleurs par ligne de chaque bloc (largeur)
const SETS_BY_GRID = 5; //Nb de lignes de chaque bloc (hauteur)

//Canvas = Zone de dessin totale
const MARGIN = 200;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const CANVAS_COLOR = 120;


//Canvas = Zone de dessin du layout
const LAYOUT_WIDTH = CANVAS_WIDTH - MARGIN;
const LAYOUT_HEIGHT = CANVAS_HEIGHT - MARGIN;
const LAYOUT_COLOR = 'orange';

//Grille = Ensemble de sets
const GRID_WIDTH = LAYOUT_WIDTH / COLORS_BY_SET;
const GRID_HEIGHT = LAYOUT_HEIGHT;
const GRID_COLOR = 'pink';

//Color = Une couleur
const COLOR_WIDTH = GRID_WIDTH / (MAX_SETS / SETS_BY_GRID);
const COLOR_HEIGHT = GRID_HEIGHT / SETS_BY_GRID;

//Autres variables
let gridColors = [];
let randomNb;
let currentColor;
let currentSet = [];

//-----------------------------------------------------------------------------------------
//----------------------------------------- CANVAS ----------------------------------------
//-----------------------------------------------------------------------------------------

function preload() {
  data = loadJSON('./data/concepts.json');
}

function setup() {
  load();
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  background(CANVAS_COLOR);
  colorMode(HSL)
  strokeWeight(2);
  noLoop();

  if (DEBUG_ON) {
    console.log("Canvas : " + CANVAS_WIDTH + " x " + CANVAS_HEIGHT);
    console.log("Layout : " + LAYOUT_WIDTH + " x " + LAYOUT_HEIGHT);
    console.log("Grid : " + GRID_WIDTH + " x " + GRID_HEIGHT);
    console.log("Color : " + COLOR_WIDTH + " x " + COLOR_HEIGHT);
  }
}

function draw() {
  frameRate(1);
  fill(LAYOUT_COLOR);
  rect(MARGIN / 2, MARGIN / 2, LAYOUT_WIDTH, LAYOUT_HEIGHT);

  for (let k = 0; k < COLORS_BY_SET; k++) {
    fill(GRID_COLOR);
    rect(MARGIN / 2 + k * GRID_WIDTH, MARGIN / 2, GRID_WIDTH, GRID_HEIGHT);
  }

  for (let l = 0; l < MAX_SETS / SETS_BY_GRID; l++) {
    for (let i = 0; i < SETS_BY_GRID; i++) {
      for (let j = 0; j < COLORS_BY_SET; j++) {
        let neighbourExisting;

        do {
          setRandomNb();
          setCurrentColor();

          // Check les voisins
          neighbourExisting = 
          (i > 0 && areColorsEqual(gridColors[i - 1][j], currentColor)) || // en haut
          (j > 0 && areColorsEqual(gridColors[i][j - 1], currentColor)); // a gauche

          if (DEBUG_ON) {
            if (i>0){
              console.log("Color gridColor en haut: " + gridColors[i - 1][j]);
            }
            if (j>0){
              console.log("Color gridColor a gauche: " + gridColors[i][j - 1]);
            }
            console.log("CurrentColor : " + currentColor);
            console.log("Neighbour exist : " + neighbourExisting);
          }
        } while (neighbourExisting);

        gridColors[i][j] = currentColor;
        fill(currentColor);

        rect(100 + j * COLOR_WIDTH + l*GRID_WIDTH, 100 + i * COLOR_HEIGHT, COLOR_WIDTH, COLOR_HEIGHT);
      }
    }
  }


}


//-----------------------------------------------------------------------------------------
//--------------------------------------- FUNCTIONS ---------------------------------------
//-----------------------------------------------------------------------------------------
function load() {
  colorSets = data.colorSets;
  console.log(colorSets);


  // Initialisation de la grille suivi de couleurs
  for (let i = 0; i < SETS_BY_GRID; i++) {
    gridColors[i] = [];
    for (let j = 0; j < COLORS_BY_SET; j++) {
      gridColors[i][j] = null;
    }
  }
}

function setCurrentColor() {
  randomColor = random(colorSets[0].colors);
  if (DEBUG_ON) {
    // console.log("ColorSet[0] : " +colorSets[0]);
    // console.log("ColorSet[0].colors : " +colorSets[0].colors);
    // console.log("Random color : " +randomColor);
  }
  currentColor = color(randomColor.hue, randomColor.sat, randomColor.bright);
}

function checkNeighbours() {

}

//-----------------------------------------------------------------------------------------
//--------------------------------------- UTILITIES ---------------------------------------
//-----------------------------------------------------------------------------------------

function setRandomNb() {
  randomNb = int(random(1, 101));
}

function areColorsEqual(color1, color2) {
  return (
    red(color1) === red(color2) &&
    green(color1) === green(color2) &&
    blue(color1) === blue(color2) &&
    alpha(color1) === alpha(color2)
  );
}


// function generateGrid(rows, cols) {
//   let grid = [];
//   for (let i = 0; i < rows * cols; i++) {
//     let set = generateSet();
//     grid.push(set);
//   }
//   return grid;
// }

// function generateSet() {
//   let colors = [];
//   let pairings = ["Passive-Active", "Dull-Bright", "Cold-Warm"];

//   for (let pair of pairings) {
//     let [setA, setB] = pair.split("-").map(name => colorSets.find(set => set.name === name));
//     let percent = percentages[pair] / 100;

//     // Select colors based on percentages
//     let selectedColors = [];
//     for (let i = 0; i < 4; i++) {
//       let sourceSet = random() < percent ? setB.colors : setA.colors;
//       let color = random(sourceSet);
//       selectedColors.push(color);
//     }
//     colors.push(...selectedColors);
//   }

//   return colors.slice(0, 4); // Ensure 4 unique colors
// }

// function drawGrid(grid) {
//   let cellWidth = width / 5;
//   let cellHeight = height / 4;

//   for (let i = 0; i < grid.length; i++) {
//     let x = (i % 5) * cellWidth;
//     let y = floor(i / 5) * cellHeight;
//     drawSet(grid[i], x, y, cellWidth, cellHeight);
//   }
// }

// function drawSet(set, x, y, w, h) {
//   let colorWidth = w / set.length;
//   for (let i = 0; i < set.length; i++) {
//     let c = set[i];
//     fill(c.hue, c.sat, c.bright, c.alpha * 255);
//     rect(x + i * colorWidth, y, colorWidth, h);
//   }
// }