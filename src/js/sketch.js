//-----------------------------------------------------------------------------------------
//---------------------------------------- DONNEES ----------------------------------------
//-----------------------------------------------------------------------------------------
let data = [];
let colorSets = [];
let percentages = [];

//-----------------------------------------------------------------------------------------
//----------------------------------------- DEBUG -----------------------------------------
//-----------------------------------------------------------------------------------------
const DEBUG_ON = false; //Change this value to hide console
const DEBUG_SET_CREATION_ON = false; //Change this value to hide console
const DEBUG_POURCENTAGE_ON = true; //Change this value to hide console

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


//Layout = Zone de dessin du layout
const LAYOUT_WIDTH = CANVAS_WIDTH - MARGIN;
const LAYOUT_HEIGHT = CANVAS_HEIGHT - MARGIN;
const LAYOUT_COLOR = 'orange';

//Grille = Ensemble de sets
const GRID_WIDTH = LAYOUT_WIDTH / (MAX_SETS / SETS_BY_GRID) - (SPACING - SPACING / (MAX_SETS / SETS_BY_GRID));
const GRID_HEIGHT = LAYOUT_HEIGHT;
const GRID_COLOR = 'pink';

//Color = Une couleur
const COLOR_WIDTH = GRID_WIDTH / COLORS_BY_SET;
const COLOR_HEIGHT = GRID_HEIGHT / SETS_BY_GRID;

//Autres variables
let gridColors = [];
let randomNb;
let currentColor;
let currentSet = []; // Un set contient plusieurs currentColor
let gridSets = []; // Une grid contient plusieurs currentSet

let conceptsCouples = []; // Contient les couples de couleurs nommés et triés

let colorCanvas;

//-----------------------------------------------------------------------------------------
//----------------------------------------- CANVAS ----------------------------------------
//-----------------------------------------------------------------------------------------

function preload() {
  data = loadJSON('./data/concepts.json');
}

function setup() {
  load();
  colorCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  colorCanvas.parent('colorgrid')
  background(CANVAS_COLOR);
  colorMode(HSB)
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

  for (let l = 0; l < MAX_SETS / SETS_BY_GRID; l++) { //Définir Layout
    for (let i = 0; i < SETS_BY_GRID; i++) { // Définir Grid
      setCurrentSet();
      for (let j = 0; j < COLORS_BY_SET; j++) { //Définir set
        // let neighbourExisting;

        // do {
        //   setRandomNb();
        //   setCurrentColor(j);

        //   // currentSet[j] = currentColor



        //   // Check les voisins
        //   neighbourExisting =
        //     (i > 0 && areColorsEqual(gridColors[i - 1][j], currentColor)) || // en haut
        //     (j > 0 && areColorsEqual(gridColors[i][j - 1], currentColor)); // a gauche

        // } while (neighbourExisting);

        // gridColors[i][j] = currentColor;

        currentColor = currentSet[j];
        // console.log(currentSet)
        // console.log(currentColor)

        fill(currentColor.hue, currentColor.sat, currentColor.bright);

        rect(MARGIN / 2 + j * COLOR_WIDTH + l * GRID_WIDTH + l * SPACING, MARGIN / 2 + i * COLOR_HEIGHT, COLOR_WIDTH, COLOR_HEIGHT);
      }
      // gridSets[i] = currentSet;

      //Fonction je modifie les couleurs -> while les couleurs sont pas bien

      // for (let j = 0; j < COLORS_BY_SET; j++) {

      //   current = gridColors[i][j];
      //   fill(currentColor);
      //   rect(MARGIN/2 + j * COLOR_WIDTH + l*GRID_WIDTH + l * SPACING, MARGIN/2 + i * COLOR_HEIGHT, COLOR_WIDTH, COLOR_HEIGHT);
      // }
    }
  }
}


//-----------------------------------------------------------------------------------------
//--------------------------------------- FUNCTIONS ---------------------------------------
//-----------------------------------------------------------------------------------------
function load() {
  colorSets = data.colorSets;

  // ---------------------------------------------------
  // -- Initialisation de la grille suivi de couleurs --
  for (let i = 0; i < SETS_BY_GRID; i++) {
    gridColors[i] = [];
    for (let j = 0; j < COLORS_BY_SET; j++) {
      gridColors[i][j] = null;
    }
  }

  // ---------------------------------------------------
  // ---------------- Check les couples ----------------
  colorCouples = [...new Set(colorSets.map((set) => set.couple[0]))];
  colorCouples.forEach((coupleIndex) => {
    // Trouver tous les sets du couple
    const relatedSets = colorSets.filter((set) => set.couple[0] === coupleIndex);

    if (relatedSets.length === 2) {
      const [set1, set2] = relatedSets;
      let combinedColors = {
        set1: set1.colors,
        set2: set2.colors
      };

      // Ajouter au tableau final avec le nom
      conceptsCouples.push({
        name: `${set1.name}-${set2.name}`,
        colors: combinedColors
      });
    }
  });

  if (DEBUG_SET_CREATION_ON) {
    console.log("Création des couples");
    console.log(conceptsCouples);
  }

  // ---------------------------------------------------
  // -------------- LOAD les poucentages ---------------

  // Je peux récupérer dynamiquement si je renomme le get item
  conceptsCouples.forEach((oneCouple) => {
    percentages.push({
      name: oneCouple.name,
      value: 20
    });
  });

  if (DEBUG_POURCENTAGE_ON) {
    console.log("Liste pourcentage : ");
    console.log(percentages);
  }

  // percentages = {
  //   "Passive-Active": localStorage.getItem("temperature") || 50,
  //   "Dull-Bright": localStorage.getItem("action") || 50,
  //   "Cold-Warm": localStorage.getItem("vibe") || 50
  // }
}

function setCurrentSet() {
  let possibleColors = getTabPossibleColors();
  const flatPossibleColors = possibleColors.map(set => set.colors).flat();
  let correctColors = [];
  let finalSet = [];

  const warmPercentage = percentages.find((percentage) =>
    percentage.name.includes("Warm")
  );
  const activePercentage = percentages.find((percentage) =>
    percentage.name.includes("Active")
  );
  const brightPercentage = percentages.find((percentage) =>
    percentage.name.includes("Bright")
  );

  if (DEBUG_POURCENTAGE_ON) {
    console.log("Warm % Value : ");
    console.log(warmPercentage);
    console.log("Active % Value : ");
    console.log(warmPercentage);
    console.log("Bright % Value : ");
    console.log(warmPercentage);
  }

  for (let i = 0; i < COLORS_BY_SET; i++) {
    correctColors = [];
    switch (i) {
      case 0:
        flatPossibleColors.forEach(color => {
          if (isColorWarm(color) && warmPercentage.value >= 50 || !isColorWarm(color) && warmPercentage.value <= 50) {
            if (DEBUG_POURCENTAGE_ON) {
              console.log("test");
            }
            if (isColorActive(color) && activePercentage.value >= 50 || !isColorWarm(color) && activePercentage.value <= 50) {
              if (DEBUG_POURCENTAGE_ON) {
                console.log("test 2");
              }
              if (isColorBright(color) && brightPercentage.value >= 50 || !isColorWarm(color) && brightPercentage.value <= 50) {
                if (DEBUG_POURCENTAGE_ON) {
                  console.log("test 3");
                }
                correctColors.push(color);
              }
            }
          }
        });

        break
      case 1:
        flatPossibleColors.forEach(color => {
          if (isColorWarm(color) && warmPercentage.value >= 50 || !isColorWarm(color) && warmPercentage.value <= 50) {
            if (isColorActive(color) && activePercentage.value >= 50 || !isColorWarm(color) && activePercentage.value <= 50) {
              if (isColorBright(color) && brightPercentage.value >= 50 || !isColorWarm(color) && brightPercentage.value <= 50) {
                correctColors.push(color);
              }
            }
          }
        });
        break
      case 2:
        flatPossibleColors.forEach(color => {
          if (isColorWarm(color) && warmPercentage.value >= 50 || !isColorWarm(color) && warmPercentage.value <= 50) {
            if (isColorActive(color) && activePercentage.value >= 50 || !isColorWarm(color) && activePercentage.value <= 50) {
              if (isColorBright(color) && brightPercentage.value >= 50 || !isColorWarm(color) && brightPercentage.value <= 50) {
                correctColors.push(color);
              }
            }
          }
        });
        break
      default:
        flatPossibleColors.forEach(color => {
          if (isColorWarm(color) && warmPercentage.value >= 50 || !isColorWarm(color) && warmPercentage.value <= 50) {
            if (isColorActive(color) && activePercentage.value >= 50 || !isColorWarm(color) && activePercentage.value <= 50) {
              if (isColorBright(color) && brightPercentage.value >= 50 || !isColorWarm(color) && brightPercentage.value <= 50) {
                correctColors.push(color);
              }
            }
          }
        });
        break
    }
    if (correctColors.length < 1) {
      correctColors.push(random(flatPossibleColors));
    }



    //Mélanger le tableau
    correctColors = correctColors.sort(() => Math.random() - 0.5);

    //Push la couleur finale dans le tableau
    let randomColor;
    let exist;
    do {
      exist = false;
      randomColor = correctColors[Math.floor(Math.random() * correctColors.length)];

      for (let j = 0; j < finalSet.length; j++) {
        const colorsEqual = areColorsEqual(randomColor, finalSet[j]);
        if (colorsEqual) {
          exist = true;
        }
      }

      if (DEBUG_SET_CREATION_ON) {
        console.log("random color : ");
        console.log(randomColor);
        console.log("exist :");
        console.log(exist);
      }
    } while (exist);

    finalSet.push(randomColor);

    if (DEBUG_SET_CREATION_ON) {
      console.log("FinalSet :");
      console.log(finalSet);
    }
  }

  currentSet = finalSet;

}

function getTabPossibleColors() {
  let possibleColors = [];

  conceptsCouples.forEach((oneCouple) => {
    const currentPercentage = getPercentage(oneCouple);
    const dominantConceptCouple = currentPercentage > 50 ? 2 : 1;
    const dominantPercentage = dominantConceptCouple === 1 ? currentPercentage : 100 - currentPercentage;

    if (DEBUG_POURCENTAGE_ON) {
      console.log("currentPercentage :");
      console.log(currentPercentage);

      console.log("concept dominant : ");
      console.log(dominantConceptCouple);

      console.log("dominantPercentage");
      console.log(dominantPercentage);
    }

    const set1 = oneCouple.colors.set1;
    const set2 = oneCouple.colors.set2;

    // Calculer le nombre de couleurs à prendre de chaque set
    const nbColorsFromSet1 = Math.round((dominantConceptCouple === 1 ? dominantPercentage : 100 - dominantPercentage) / 100 * COLORS_BY_SET);
    const nbColorsFromSet2 = COLORS_BY_SET - nbColorsFromSet1;

    // Sélectionner aléatoirement les couleurs de chaque set
    const selectedFromSet1 = selectRandomColors(set1, nbColorsFromSet1);
    const selectedFromSet2 = selectRandomColors(set2, nbColorsFromSet2);

    possibleColors.push({
      name: oneCouple.name,
      colors: [...selectedFromSet1, ...selectedFromSet2]
    });
  });

  return possibleColors;
}

function getPercentage(couple) {
  for (let i = 0; i < percentages.length; i++) {
    if (couple.name == percentages[i].name) {
      return percentages[i].value;
    }
  }
}

function setCurrentColor(position) {

  possibleColors = [];

  conceptsCouples.forEach((oneCouple) => {

  });


  if (DEBUG_SET_CREATION_ON) {

  }


  //---------------------------------------------

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
  // return (
  //   red(color1) === red(color2) &&
  //   green(color1) === green(color2) &&
  //   blue(color1) === blue(color2) &&
  //   alpha(color1) === alpha(color2)
  // );

  return (
    color1.hue === color2.hue &&
    color1.sat === color2.sat &&
    color1.bright === color2.bright &&
    color1.alpha === color2.alpha
  );
}

function selectRandomColors(colorSet, numColors) {
  const shuffled = [...colorSet].sort(() => Math.random() - 0.5); // Mélanger les couleurs
  return shuffled.slice(0, numColors);
}

function findDominantConcept() {

}

function isColorWarm(color) {
  if (color.hue > 0 && color.hue < 90 || color.hue > 270) {
    return true;
  } else {
    return false;
  }
}

function isColorActive(color) {
  if (color.sat > 50) {
    return true;
  } else {
    return false;
  }
}

function isColorBright(color) {
  if (color.bright > 50) {
    return true;
  } else {
    return false;
  }
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