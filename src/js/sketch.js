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
const DEBUG_SET_CREATION_ON = true; //Change this value to hide console
const DEBUG_POURCENTAGE_ON = false; //Change this value to hide console
const DEBUG_UTILITIES_FUNCTIONS = false; //Change this value to hide console

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
const CANVAS_COLOR = 255;


//Layout = Zone de dessin du layout
const LAYOUT_WIDTH = CANVAS_WIDTH - MARGIN;
const LAYOUT_HEIGHT = CANVAS_HEIGHT - MARGIN;
const LAYOUT_COLOR = 'white';

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
  stroke('white');
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

  for (let l = 0; l < MAX_SETS / SETS_BY_GRID; l++) { //Pour chaque grid
    for (let i = 0; i < SETS_BY_GRID; i++) { // Pour chaque ligne
      setCurrentSet();
      for (let j = 0; j < COLORS_BY_SET; j++) { //Pour chaque couleur
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
  // -- Initialisation de la grille suivi de couleurs --  -> A VIRER
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

  if (DEBUG_SET_CREATION_ON) {
    console.log("Flat colors");
    console.log(flatPossibleColors);
  }
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
  if (DEBUG_SET_CREATION_ON) {
    console.log("--------- NOUVEAU SET ----------- ");
  }

  for (let i = 0; i < COLORS_BY_SET; i++) {
    correctColors = [];
    switch (i) {
      case 0:
        flatPossibleColors.forEach(color => {
          if (isColorWarm(color) && warmPercentage.value >= 50 || !isColorWarm(color) && warmPercentage.value <= 50) {
            if (isColorActive(color) && activePercentage.value >= 50 || !isColorActive(color) && activePercentage.value <= 50) {
              if (isColorBright(color) && brightPercentage.value >= 50 || !isColorBright(color) && brightPercentage.value <= 50) {
                correctColors.push(color);
              }
            }
          }
        });

        break
      case 1:
        const checkWarmCouple = isParamOn(warmPercentage);
        const checkActiveCouple = isParamOn(activePercentage);
        const checkBrightCouple = isParamOn(brightPercentage);

        if (DEBUG_SET_CREATION_ON) {
          console.log("--------------------------------------------------------------------------------------");
          console.log("Check couple");
          console.log(checkWarmCouple);
          console.log(checkActiveCouple);
          console.log(checkBrightCouple);
        }

        flatPossibleColors.forEach(color => {
          if (checkWarmCouple) {
            if (checkActiveCouple) {
              if (checkBrightCouple) {
                if (isColorWarm(color) && warmPercentage.value <= 50 || !isColorWarm(color) && warmPercentage.value >= 50) {
                  if (isColorActive(color) && activePercentage.value >= 50 || !isColorActive(color) && activePercentage.value <= 50) {
                    if (isColorBright(color) && brightPercentage.value >= 50 || !isColorBright(color) && brightPercentage.value <= 50) {
                      correctColors.push(color);
                    }
                  }
                }
              } else {
                if (isColorWarm(color) && warmPercentage.value <= 50 || !isColorWarm(color) && warmPercentage.value >= 50) {
                  if (isColorActive(color) && activePercentage.value >= 50 || !isColorActive(color) && activePercentage.value <= 50) {
                    correctColors.push(color);
                  }
                }
              }
            } else {
              if (checkBrightCouple) {
                if (isColorWarm(color) && warmPercentage.value <= 50 || !isColorWarm(color) && warmPercentage.value >= 50) {
                  if (isColorBright(color) && brightPercentage.value >= 50 || !isColorBright(color) && brightPercentage.value <= 50) {
                    correctColors.push(color);
                  }
                }
              } else {
                if (isColorWarm(color) && warmPercentage.value <= 50 || !isColorWarm(color) && warmPercentage.value >= 50) {
                  correctColors.push(color);
                }
              }
            }
          } else {
            if (checkActiveCouple) {
              if (checkBrightCouple) {
                if (isColorActive(color) && activePercentage.value >= 50 || !isColorActive(color) && activePercentage.value <= 50) {
                  if (isColorBright(color) && brightPercentage.value >= 50 || !isColorBright(color) && brightPercentage.value <= 50) {
                    correctColors.push(color);
                  }
                }
              } else {
                if (isColorActive(color) && activePercentage.value >= 50 || !isColorActive(color) && activePercentage.value <= 50) {
                  correctColors.push(color);
                }
              }
            } else {
              if (checkBrightCouple) {
                if (isColorBright(color) && brightPercentage.value >= 50 || !isColorBright(color) && brightPercentage.value <= 50) {
                  correctColors.push(color);
                }
              }
            }
          }
        });
        break
      case 2:
        flatPossibleColors.forEach(color => {
          if (isColorWarm(color) && warmPercentage.value >= 50 || !isColorWarm(color) && warmPercentage.value <= 50) {
            if (isColorActive(color) && activePercentage.value >= 50 || !isColorActive(color) && activePercentage.value <= 50) {
              if (isColorBright(color) && brightPercentage.value >= 50 || !isColorBright(color) && brightPercentage.value <= 50) {
                correctColors.push(color);
              }
            }
          }
        });
        break
      default:
        flatPossibleColors.forEach(color => {
          if (isColorWarm(color) && warmPercentage.value >= 50 || !isColorWarm(color) && warmPercentage.value <= 50) {
            if (isColorActive(color) && activePercentage.value >= 50 || !isColorActive(color) && activePercentage.value <= 50) {
              if (isColorBright(color) && brightPercentage.value >= 50 || !isColorBright(color) && brightPercentage.value <= 50) {
                correctColors.push(color);
              }
            }
          }
        });
        break
    }

    if (DEBUG_SET_CREATION_ON) {
      // console.log("CorrectColors before pushing");
      // console.log(correctColors);
    }

    if (correctColors.length <= 1) {
      let set;
      const coldWarmCouple = conceptsCouples.find((couple) =>
        couple.name.includes("Warm")
      );
      if (warmPercentage > 50) {
        set = coldWarmCouple.colors.set2;
      } else {
        set = coldWarmCouple.colors.set1;
      }

      let newColor1;
      let newColor2;
      let colorIsTheSame

      newColor1 = random(set);
      do {
        colorIsTheSame = false;
        newColor2 = random(set);

        if (areColorsEqual(newColor1, newColor2)) {
          colorIsTheSame = true;
        }
      } while (colorIsTheSame);

      correctColors.push(newColor1);
      correctColors.push(newColor2);

      if (DEBUG_SET_CREATION_ON) {
        // console.log("CorrectColors inférieur à 1 ici");
        // console.log("CorrectColors after pushing");
        // console.log(correctColors);
      }
    }



    //Mélanger le tableau
    correctColors = correctColors.sort(() => Math.random() - 0.5);

    //Push la couleur finale dans le tableau
    let randomColor;
    let exist;
    do {
      exist = false;
      let trucrandom = Math.floor(Math.random() * correctColors.length);
      randomColor = correctColors[trucrandom];
      if (DEBUG_SET_CREATION_ON) {
        // console.log("nombre random : ");
        // console.log(trucrandom);
        // console.log("RandomColor");
        // console.log(randomColor);
      }


      for (let m = 0; m < finalSet.length; m++) {
        const colorsEqual = areColorsEqual(randomColor, finalSet[m]);
        if (colorsEqual) {
          exist = true;
        }
      }

      if (DEBUG_SET_CREATION_ON) {
        // console.log("exist :");
        // console.log(exist);
      }
    } while (exist);

    finalSet.push(randomColor);

    if (DEBUG_SET_CREATION_ON) {
      // console.log("FinalSet :");
      // console.log(finalSet);
    }
  }

  currentSet = finalSet;

}

function getTabPossibleColors() {
  let possibleColors = [];

  conceptsCouples.forEach((oneCouple) => {
    const currentPercentage = getPercentage(oneCouple);
    const dominantConceptCouple = currentPercentage > 50 ? 2 : 1;
    const dominantPercentage = dominantConceptCouple === 2 ? currentPercentage : 100 - currentPercentage;

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
    let nbColorsFromSet1 = Math.round((dominantConceptCouple === 1 ? dominantPercentage : 100 - dominantPercentage) / 100 * COLORS_BY_SET);
    if (nbColorsFromSet1 === COLORS_BY_SET) {
      setRandomNb();
      if (randomNb > 0 && randomNb <= dominantPercentage && dominantPercentage != 100) {
        nbColorsFromSet1 = COLORS_BY_SET - 1;
      }
    }
    const nbColorsFromSet2 = COLORS_BY_SET - nbColorsFromSet1;

    // Sélectionner aléatoirement les couleurs de chaque set
    const selectedFromSet1 = selectRandomColors(set1, nbColorsFromSet1);
    const selectedFromSet2 = selectRandomColors(set2, nbColorsFromSet2);

    if (DEBUG_SET_CREATION_ON) {
      // console.log("Total des couleurs : " + selectedFromSet1.length + " "+ selectedFromSet2.length)
    }

    // possibleColors.push({
    //   name: oneCouple.name,
    //   colors: [...selectedFromSet1, ...selectedFromSet2]
    // });

    possibleColors.push({
      name: oneCouple.name,
      colors: [...set1, ...set2]
    });
  });

  if (DEBUG_SET_CREATION_ON) {
    console.log("Possible colors : ")
    console.log(possibleColors)
  }
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

  if (DEBUG_UTILITIES_FUNCTIONS) {
    console.log("-- COLORS EQUAL --");
    console.log("color 1 : ");
    console.log(color1);
    console.log("color 2 :");
    console.log(color2);
    console.log("------------------");
  }

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

function isColorWarm(color) {
  if (color.hue > 0 && color.hue < 80 || color.hue > 290) {
    if (DEBUG_UTILITIES_FUNCTIONS) {
      console.log("Ma couleur est warm");
    }
    return true;
  } else {
    if (DEBUG_UTILITIES_FUNCTIONS) {
      console.log("Ma couleur n'est pas warm");
    }
    return false;
  }
}

function isColorActive(color) {
  if (color.sat > 50) {
    if (DEBUG_UTILITIES_FUNCTIONS) {
      console.log("Ma couleur est active");
    }
    return true;
  } else {
    if (DEBUG_UTILITIES_FUNCTIONS) {
      console.log("Ma couleur n'est pas active");
    }
    return false;
  }
}

function isColorBright(color) {
  if (color.bright > 50) {
    if (DEBUG_UTILITIES_FUNCTIONS) {
      console.log("Ma couleur est bright");
    }
    return true;
  } else {
    if (DEBUG_UTILITIES_FUNCTIONS) {
      console.log("Ma couleur n'est pas bright");
    }
    
    return false;
  }
}

function isParamOn(param) {
  setRandomNb();
  console.log("% :")
  console.log(param.value)
  console.log("Nombre random :")
  console.log(randomNb)
  if (randomNb <= param.value) {
    return true;
  } else {
    return false;
  }
}