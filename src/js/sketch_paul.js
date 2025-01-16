let data = [];
let colorSets = [];
let gridSets = [];
let percentages = {
  "Cold-Warm": localStorage.getItem("temperature") || 50,
  "Passive-Active": localStorage.getItem("action") || 50,
  "Dull-Bright": localStorage.getItem("vibe") || 50,
};

let huePercentage = percentages["Cold-Warm"];
let actionPercentage = percentages["Passive-Active"];
let vibePercentage = percentages["Dull-Bright"];

//-----------------------------------------------------------------------------------------
//----------------------------------------- DEBUG -----------------------------------------
//-----------------------------------------------------------------------------------------
const DEBUG_ON = false; //Change this value to hide console

//-----------------------------------------------------------------------------------------
//-------------------------------------- DECLARATION --------------------------------------
//-----------------------------------------------------------------------------------------

const MAX_SETS = 20;
const COLORS_BY_SET = 4; //Nb couleurs par ligne de chaque bloc (largeur d'une grille)
const SETS_BY_GRID = 4; //Nb de lignes de chaque bloc (hauteur)

const MARGIN = 100;
const SPACING = 20;

//Canvas = Zone de dessin totale
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 300;
const CANVAS_COLOR = 120;

//Canvas = Zone de dessin du layout
const LAYOUT_WIDTH = CANVAS_WIDTH - MARGIN;
const LAYOUT_HEIGHT = CANVAS_HEIGHT - MARGIN;
const LAYOUT_COLOR = "orange";

//Grille = Ensemble de sets
const GRID_WIDTH = LAYOUT_WIDTH / (MAX_SETS / SETS_BY_GRID) - (SPACING - SPACING / (MAX_SETS / SETS_BY_GRID));
const GRID_HEIGHT = LAYOUT_HEIGHT;
const GRID_COLOR = "pink";

//Color = Une couleur
const COLOR_WIDTH = GRID_WIDTH / COLORS_BY_SET;
const COLOR_HEIGHT = GRID_HEIGHT / SETS_BY_GRID;

//Autres variables
let gridColors = [];
let randomNb;
let currentColor;
let currentSet = [];

let colorCanvas;

//-----------------------------------------------------------------------------------------
//----------------------------------------- CANVAS ----------------------------------------
//-----------------------------------------------------------------------------------------

function preload() {
  data = loadJSON("./data/concepts.json");
}

function setup() {
  load();
  colorCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  colorCanvas.parent("colorgrid");
  background(CANVAS_COLOR);
  colorMode(HSB);
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

  for (let k = 0; k < MAX_SETS / SETS_BY_GRID; k++) {
    fill(GRID_COLOR);
    rect(MARGIN / 2 + k * GRID_WIDTH + k * SPACING, MARGIN / 2, GRID_WIDTH, GRID_HEIGHT);
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
            if (i > 0) {
              console.log("Color gridColor en haut: " + gridColors[i - 1][j]);
            }
            if (j > 0) {
              console.log("Color gridColor a gauche: " + gridColors[i][j - 1]);
            }
            console.log("CurrentColor : " + currentColor);
            console.log("Neighbour exist : " + neighbourExisting);
          }
        } while (neighbourExisting);

        gridColors[i][j] = currentColor;
        fill(currentColor);

        rect(MARGIN / 2 + j * COLOR_WIDTH + l * GRID_WIDTH + l * SPACING, MARGIN / 2 + i * COLOR_HEIGHT, COLOR_WIDTH, COLOR_HEIGHT);
      }
      gridSets[i] = currentSet;

      // fonction pour voir si le pourcentage hue est respecté -> while les couleurs sont pas biens

      let COLORS_BY_GRID = COLORS_BY_SET * SETS_BY_GRID;

      function checkHue() {
        let warmCount = 0;

        for (let j = 0; j < COLORS_BY_SET; j++) {
          if (gridColors[i][j]) {
            let currentHue = hue(gridColors[i][j]);
            if (currentHue < 70 || currentHue > 315) {
              warmCount++;
            }
          }
        }

        const hueCalc = (warmCount * COLORS_BY_GRID) / 100;
        console.log("Hue calc : " + hueCalc);

        if (hueCalc === huePercentage) {
          return true;
        } else {
          return false;
        }
      }

      function adjustHue() {
        for (let j = 0; j < COLORS_BY_SET; j++) {
          if (gridColors[i][j]) {
            let currentHue = hue(gridColors[i][j]);
            let newHue;

            if (huePercentage > 50) {
              if (currentHue > 70) {
                newHue = currentHue - huePercentage * 2;
              } else if (currentHue < 315) {
                newHue = currentHue + huePercentage;
              }
            } else {
              if (currentHue < 70) {
                newHue = currentHue + huePercentage;
              } else if (currentHue > 315) {
                newHue = currentHue - huePercentage;
              }
            }
            gridColors[i][j] = color(newHue, saturation(gridColors[i][j]), brightness(gridColors[i][j]));
          }
        }
      }

      function checkSaturation() {
        let activeCount = 0;

        for (let j = 0; j < COLORS_BY_SET; j++) {
          if (gridColors[i][j]) {
            let currentSat = saturation(gridColors[i][j]);
            if (currentSat > 50) {
              activeCount++;
            }
          }
        }
        const actionCalc = (activeCount * COLORS_BY_GRID) / 100;
        console.log("Action calc : " + actionCalc);

        if (actionCalc === actionPercentage) {
          return true;
        } else {
          return false;
        }
      }

      function adjustSaturation() {
        for (let j = 0; j < COLORS_BY_SET; j++) {
          if (gridColors[i][j]) {
            let currentSat = saturation(gridColors[i][j]);
            let newSat;

            if (actionPercentage > 50) {
              if (currentSat > 50) {
                newSat = currentSat - actionPercentage;
              }
            } else {
              if (currentSat < 50) {
                newSat = currentSat + actionPercentage;
              }
            }
            gridColors[i][j] = color(hue(gridColors[i][j]), newSat, brightness(gridColors[i][j]));
          }
        }
      }

      function checkBrightness() {
        let brightCount = 0;

        for (let j = 0; j < COLORS_BY_SET; j++) {
          if (gridColors[i][j]) {
            let currentBright = brightness(gridColors[i][j]);
            if (currentBright > 50) {
              brightCount++;
            }
          }
        }
        const vibeCalc = (brightCount * COLORS_BY_GRID) / 100;
        console.log("Vibe calc : " + vibeCalc);

        if (vibeCalc === vibePercentage) {
          return true;
        } else {
          return false;
        }
      }

      function adjustBrightness() {
        for (let j = 0; j < COLORS_BY_SET; j++) {
          if (gridColors[i][j]) {
            let currentBright = brightness(gridColors[i][j]);
            let newBright;

            if (vibePercentage > 50) {
              if (currentBright > 50) {
                newBright = currentBright + vibePercentage / 2;
              }
            } else {
              if (currentBright < 50) {
                newBright = currentBright - vibePercentage / 2;
              }
            }
            gridColors[i][j] = color(hue(gridColors[i][j]), saturation(gridColors[i][j]), newBright);
          }
        }
      }

      do {
        adjustHue();
        adjustSaturation();
        adjustBrightness();
      } while (checkHue() === true && checkSaturation() === true && checkBrightness() === true);

      for (let j = 0; j < COLORS_BY_SET; j++) {
        // définir set

        currentColor = gridColors[i][j];
        fill(currentColor);

        rect(MARGIN / 2 + j * COLOR_WIDTH + l * GRID_WIDTH + l * SPACING, MARGIN / 2 + i * COLOR_HEIGHT, COLOR_WIDTH, COLOR_HEIGHT);
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
  randomColor = random(colorSets[5].colors);
  if (DEBUG_ON) {
    // console.log("ColorSet[0] : " +colorSets[0]);
    // console.log("ColorSet[0].colors : " +colorSets[0].colors);
    // console.log("Random color : " +randomColor);
  }
  currentColor = color(randomColor.hue, randomColor.sat, randomColor.bright);
}

function checkNeighbours() {}

//-----------------------------------------------------------------------------------------
//--------------------------------------- UTILITIES ---------------------------------------
//-----------------------------------------------------------------------------------------

function setRandomNb() {
  randomNb = int(random(1, 101));
}

function areColorsEqual(color1, color2) {
  return red(color1) === red(color2) && green(color1) === green(color2) && blue(color1) === blue(color2) && alpha(color1) === alpha(color2);
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

const playButton = document.getElementById("playButton");

playButton.addEventListener("click", () => {
  console.log("clicked")
  for (let l = 0; l < MAX_SETS / SETS_BY_GRID; l++) {
    for (let i = 0; i < SETS_BY_GRID; i++) {
      for (let j = 0; j < COLORS_BY_SET; j++) {
        gridColors[i][j] = color(hue(gridColors[i][j]), saturation(gridColors[i][j]), brightness(gridColors[i][j]), 0.5);
      }
    }
    setTimeout(() => {
      draw();
    }, 1000);
  }
});
