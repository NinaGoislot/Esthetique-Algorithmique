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
const DEBUG_POURCENTAGE_ON = false; //Change this value to hide console
const DEBUG_UTILITIES_FUNCTIONS = false; //Change this value to hide console
const DEBUG_STEP_CODE_ON = false; //Change this value to hide console
const DEBUG_UPDATE_VALUES = true; //Change this value to hide console

//-----------------------------------------------------------------------------------------
//-------------------------------------- DECLARATION --------------------------------------
//-----------------------------------------------------------------------------------------

const MAX_SETS = 20;
const COLORS_BY_SET = 4; //Nb couleurs par ligne de chaque bloc (largeur d'une grille)
const SETS_BY_GRID = 4; //Nb de lignes de chaque bloc (hauteur)
const PERCENTS_DEFAULT = 40;

const MARGIN = 100;
const SPACING = 20;

//Canvas = Zone de dessin totale
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 300;
const CANVAS_COLOR = 255;

//Layout = Zone de dessin du layout
const LAYOUT_WIDTH = CANVAS_WIDTH - MARGIN;
const LAYOUT_HEIGHT = CANVAS_HEIGHT - MARGIN;
const LAYOUT_COLOR = 255;

//Grille = Ensemble de sets
const GRID_WIDTH = LAYOUT_WIDTH / (MAX_SETS / SETS_BY_GRID) - (SPACING - SPACING / (MAX_SETS / SETS_BY_GRID));
const GRID_HEIGHT = LAYOUT_HEIGHT;
const GRID_COLOR = 255;

//Color = Une couleur
const COLOR_WIDTH = GRID_WIDTH / COLORS_BY_SET;
const COLOR_HEIGHT = GRID_HEIGHT / SETS_BY_GRID;

let SPEED = 1;

//Autres variables
let randomNb; //Nombre random entre 1 et 100 compris
let currentColor;
let currentSet = []; // Un set contient plusieurs currentColor
let currentGridSets = []; // Une grid contient plusieurs currentSet

let conceptsCouples = []; // Contient les couples de couleurs nommés et triés

let colorCanvas;

// Variables animations
let layoutSets = [];
let play = false;
let counterColor = 0;
let counterSet = 0;
let counterGrid = 0;
let firstRepetitionAnimation = true;

//-----------------------------------------------------------------------------------------
//----------------------------------------- CANVAS ----------------------------------------
//-----------------------------------------------------------------------------------------

function preload() {
  if (DEBUG_STEP_CODE_ON) {
    console.log("► STEP 1 : Je charge les données du json");
  }

  try {
    data = loadJSON("./data/concepts.json", (loadedData) => {
      if (!loadedData || !loadedData.colorSets) {
        throw new Error("Données JSON manquantes ou incorrectes.");
      }
    });
  } catch (err) {
    console.error("Erreur lors du chargement des données :", err.message);
    noLoop();
  }
}

function setup() {
  //to add
  const playButton = document.getElementById("playButton");

  playButton.addEventListener("click", playAnimation);

  //Prévention erreur
  if (colorSets == []) {
    error("Les données des concepts n'ont pas été chargées.");
    return;
  }

  //Debug console
  if (DEBUG_STEP_CODE_ON) {
    console.log("► STEP 2 : Je setup le canvas");
  }

  if (DEBUG_ON) {
    console.log("Canvas : " + CANVAS_WIDTH + " x " + CANVAS_HEIGHT);
    console.log("Layout : " + LAYOUT_WIDTH + " x " + LAYOUT_HEIGHT);
    console.log("Grid : " + GRID_WIDTH + " x " + GRID_HEIGHT);
    console.log("Color : " + COLOR_WIDTH + " x " + COLOR_HEIGHT);
  }

  //code
  load();
  colorCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  colorCanvas.parent("colorgrid");
  background(CANVAS_COLOR, 0);
  colorMode(HSB);
  stroke("white");
  strokeWeight(2);
  noLoop();
}

//to update
function draw() {
  if (play === false) {
    const SliderVibe = document.querySelector("input[name=vibe]");
    SPEED = SliderVibe.value / 100 + 0.25;
    if (DEBUG_STEP_CODE_ON) {
      console.log("► STEP 3 : Je draw");
    }

    frameRate(1);
    fill(LAYOUT_COLOR, 0);
    rect(MARGIN / 2, MARGIN / 2, LAYOUT_WIDTH, LAYOUT_HEIGHT);

    for (let k = 0; k < MAX_SETS / SETS_BY_GRID; k++) {
      fill(GRID_COLOR, 0);
      rect(MARGIN / 2 + k * GRID_WIDTH + k * SPACING, MARGIN / 2, GRID_WIDTH, GRID_HEIGHT);
    }

    layoutSets = [];
    for (let l = 0; l < MAX_SETS / SETS_BY_GRID; l++) {
      //Définir Layout
      currentGridSets = [];
      for (let i = 0; i < SETS_BY_GRID; i++) {
        // Définir Grid
        setCurrentSet();
        currentGridSets.push(currentSet);
        for (let j = 0; j < COLORS_BY_SET; j++) {
          //Pour chaque couleur

          currentColor = currentSet[j];

          fill(currentColor.hue, currentColor.sat, currentColor.bright);

          rect(MARGIN / 2 + j * COLOR_WIDTH + l * GRID_WIDTH + l * SPACING, MARGIN / 2 + i * COLOR_HEIGHT, COLOR_WIDTH, COLOR_HEIGHT);
        }
      }
      layoutSets.push(currentGridSets);
    }

    if (DEBUG_STEP_CODE_ON) {
      console.log("► STEP FINAL : fonction draw finie");
    }
  } else {
    
    console.log("super");
    frameRate(SPEED);
    fill(LAYOUT_COLOR);
    rect(MARGIN / 2, MARGIN / 2, LAYOUT_WIDTH, LAYOUT_HEIGHT);

    for (let k = 0; k < MAX_SETS / SETS_BY_GRID; k++) {
      fill(GRID_COLOR);
      rect(MARGIN / 2 + k * GRID_WIDTH + k * SPACING, MARGIN / 2, GRID_WIDTH, GRID_HEIGHT);
    }

    for (let l = 0; l < MAX_SETS / SETS_BY_GRID; l++) {
      //Définir Layout
      for (let i = 0; i < SETS_BY_GRID; i++) {
        // Définir Grid
        currentSet = layoutSets[l][i];
        for (let j = 0; j < COLORS_BY_SET; j++) {
          //Pour chaque couleur

          currentColor = currentSet[j];
          if (counterSet === i && counterGrid === l) {
            fill(currentColor.hue, currentColor.sat, currentColor.bright);
            playMusic(currentColor);
          } else {
            fill(currentColor.hue, currentColor.sat, currentColor.bright, 0.25);
          }

          rect(MARGIN / 2 + j * COLOR_WIDTH + l * GRID_WIDTH + l * SPACING, MARGIN / 2 + i * COLOR_HEIGHT, COLOR_WIDTH, COLOR_HEIGHT);

          console.log(counterColor);
        }
        counterColor = 0;
      }
    }
    if (firstRepetitionAnimation) {
      firstRepetitionAnimation = false;
    } else {
      if (compareSets(layoutSets[counterGrid][counterSet], layoutSets[layoutSets.length - 1][SETS_BY_GRID - 1])) {
        stopAnimation();
      } else {
        if (counterSet < SETS_BY_GRID - 1) {
          counterSet++;
        } else {
          counterSet = 0;
          counterGrid++;
        }
        if (compareSets(layoutSets[counterGrid][counterSet], layoutSets[layoutSets.length - 1][SETS_BY_GRID - 1])) {
          firstRepetitionAnimation = true;
        }
      }
    }
  }
}

function playMetronome() {
  let metronome = new Audio("./music/metronome.mp3");
  metronome.play();
}

function playMusic(color) {
  let hue = color.hue;
  let sat = color.sat;
  let octave = "middle";

  if (sat >= 0 && sat < 30) {
    octave = "grave";
  } else if (sat >= 60 && sat < 100) {
    octave = "aigu";
  }

  if (hue >= 0 && hue < 51) playSound(`${octave}/do`);
  else if (hue >= 51 && hue < 102) playSound(`${octave}/re`);
  else if (hue >= 102 && hue < 153) playSound(`${octave}/mi`);
  else if (hue >= 153 && hue < 204) playSound(`${octave}/fa`);
  else if (hue >= 204 && hue < 255) playSound(`${octave}/sol`);
  else if (hue >= 255 && hue < 306) playSound(`${octave}/la`);
  else if (hue >= 306 && hue <= 360) playSound(`${octave}/si`);
}

function playSound(note) {
  let audio = new Audio(`./music/${note}.mp3`);
  console.log(`Playing ${note}`);
  audio.play();
}

//-----------------------------------------------------------------------------------------
//--------------------------------------- FUNCTIONS ---------------------------------------
//-----------------------------------------------------------------------------------------
function load() {
  colorSets = data.colorSets;

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
        set2: set2.colors,
      };

      // Ajouter au tableau final avec le nom
      conceptsCouples.push({
        name: `${set1.name}-${set2.name}`,
        colors: combinedColors,
      });
    }
  });

  if (DEBUG_SET_CREATION_ON) {
    console.log("Création des couples");
    console.log(conceptsCouples);
  }

  // ---------------------------------------------------
  // -------------- LOAD les poucentages ---------------

  //Prévention erreur
  if (conceptsCouples == []) {
    error("Les données des couples de concepts n'ont pas été chargées.");
    return;
  }

  // Je peux récupérer dynamiquement si je renomme le get item
  conceptsCouples.forEach((oneCouple) => {
    percentages.push({
      name: oneCouple.name,
      value: PERCENTS_DEFAULT,
    });
  });

  if (DEBUG_POURCENTAGE_ON) {
    console.log("Liste pourcentage : ");
    console.log(percentages);
  }
}

function setCurrentSet() {
  let possibleColors = getTabPossibleColors();

  //Prévention erreur
  if (possibleColors == []) {
    error("Aucune couleur n'a été récupérée.");
    return;
  }

  if (DEBUG_STEP_CODE_ON) {
    console.log("► STEP 5 : Je commence la création d'un set");
  }

  const flatPossibleColors = possibleColors.map((set) => set.colors).flat();

  let correctColors = [];
  let finalSet = [];

  const warmPercentage = percentages.find((percentage) => percentage.name.includes("Warm"));
  const activePercentage = percentages.find((percentage) => percentage.name.includes("Active"));
  const brightPercentage = percentages.find((percentage) => percentage.name.includes("Bright"));

  if (DEBUG_POURCENTAGE_ON) {
    console.log("Warm % Value : ");
    console.log(warmPercentage);
    console.log("Active % Value : ");
    console.log(warmPercentage);
    console.log("Bright % Value : ");
    console.log(warmPercentage);
  }

  if (DEBUG_STEP_CODE_ON) {
    console.log("► STEP 6 : Je récupère 4 couleurs pour le set");
  }
  for (let i = 0; i < COLORS_BY_SET; i++) {
    correctColors = [];
    switch (i) {
      case 0:
        flatPossibleColors.forEach((color) => {
          if ((isColorWarm(color) && warmPercentage.value >= 50) || (!isColorWarm(color) && warmPercentage.value <= 50)) {
            if ((isColorActive(color) && activePercentage.value >= 50) || (!isColorActive(color) && activePercentage.value <= 50)) {
              if ((isColorBright(color) && brightPercentage.value >= 50) || (!isColorBright(color) && brightPercentage.value <= 50)) {
                correctColors.push(color);
              }
            }
          }
        });
        if (DEBUG_STEP_CODE_ON) {
          console.log("► STEP 6 - A : Première couleur");
        }
        break;
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

        flatPossibleColors.forEach((color) => {
          if (checkWarmCouple) {
            if (checkActiveCouple) {
              if (checkBrightCouple) {
                if ((isColorWarm(color) && warmPercentage.value <= 50) || (!isColorWarm(color) && warmPercentage.value >= 50)) {
                  if ((isColorActive(color) && activePercentage.value >= 50) || (!isColorActive(color) && activePercentage.value <= 50)) {
                    if ((isColorBright(color) && brightPercentage.value >= 50) || (!isColorBright(color) && brightPercentage.value <= 50)) {
                      correctColors.push(color);
                    }
                  }
                }
              } else {
                if ((isColorWarm(color) && warmPercentage.value <= 50) || (!isColorWarm(color) && warmPercentage.value >= 50)) {
                  if ((isColorActive(color) && activePercentage.value >= 50) || (!isColorActive(color) && activePercentage.value <= 50)) {
                    correctColors.push(color);
                  }
                }
              }
            } else {
              if (checkBrightCouple) {
                if ((isColorWarm(color) && warmPercentage.value <= 50) || (!isColorWarm(color) && warmPercentage.value >= 50)) {
                  if ((isColorBright(color) && brightPercentage.value >= 50) || (!isColorBright(color) && brightPercentage.value <= 50)) {
                    correctColors.push(color);
                  }
                }
              } else {
                if ((isColorWarm(color) && warmPercentage.value <= 50) || (!isColorWarm(color) && warmPercentage.value >= 50)) {
                  correctColors.push(color);
                }
              }
            }
          } else {
            if (checkActiveCouple) {
              if (checkBrightCouple) {
                if ((isColorActive(color) && activePercentage.value >= 50) || (!isColorActive(color) && activePercentage.value <= 50)) {
                  if ((isColorBright(color) && brightPercentage.value >= 50) || (!isColorBright(color) && brightPercentage.value <= 50)) {
                    correctColors.push(color);
                  }
                }
              } else {
                if ((isColorActive(color) && activePercentage.value >= 50) || (!isColorActive(color) && activePercentage.value <= 50)) {
                  correctColors.push(color);
                }
              }
            } else {
              if (checkBrightCouple) {
                if ((isColorBright(color) && brightPercentage.value >= 50) || (!isColorBright(color) && brightPercentage.value <= 50)) {
                  correctColors.push(color);
                }
              }
            }
          }
        });
        if (DEBUG_STEP_CODE_ON) {
          console.log("► STEP 6 - B : Deuxième couleur");
        }
        break;
      case 2:
        let coupleToChoose = percentages[0];
        percentages.forEach((percentCouple) => {
          if (percentCouple.value > coupleToChoose.value) {
            coupleToChoose = percentCouple;
          } else if (percentCouple.value == percentCouple.value) {
            setRandomNb();
            coupleToChoose = randomNb > 50 ? coupleToChoose : percentCouple;
          }
        });

        const coupleValues = conceptsCouples.find((couple) => couple.name == coupleToChoose.name);

        correctColors = coupleToChoose.value > 50 ? coupleValues.colors.set2 : coupleValues.colors.set1;

        if (DEBUG_STEP_CODE_ON) {
          console.log("► STEP 6 - C : Troisième couleur");
        }

        if (DEBUG_SET_CREATION_ON) {
          console.log("Set à % dominant : " + coupleToChoose.name);
        }
        break;
      default:
        let allSetsWithProba = [];
        percentages.forEach((couplePercent) => {
          //Trouver le set dominant
          let dominantSet = couplePercent.value > 50 ? 2 : 1;
          if (couplePercent.value === 50) {
            setRandomNb();
            dominantSet = randomNb > 50 ? 2 : 1;
          }

          // Stocker les % pour chaque set
          let percentSet1 = dominantSet == 1 ? 100 - couplePercent.value : couplePercent.value;
          let percentSet2 = dominantSet == 2 ? couplePercent.value : 100 - couplePercent.value;

          //Normaliser les % du set
          const totalPercent = couplePercent.length * 2 * 100;
          percentSet1 = (percentSet1 * 100) / totalPercent;
          percentSet2 = (percentSet2 * 100) / totalPercent;

          //Récupérer les sets de couleurs
          const coupleColors = conceptsCouples.find((couple) => couple.name == couplePercent.name);

          const colorsSet1 = coupleColors.colors.set1;
          const colorsSet2 = coupleColors.colors.set2;

          //Stocker les couleurs et proba dans le tableau
          allSetsWithProba.push({
            set: colorsSet1,
            percent: percentSet1,
          });

          allSetsWithProba.push({
            set: colorsSet2,
            percent: percentSet2,
          });
        });

        //Sélectionner au hasard un set
        setRandomNb();
        let currentProba = 0;

        allSetsWithProba.forEach((setWithProba) => {
          currentProba += setWithProba.percent;

          if (currentProba >= randomNb) {
            correctColors = setWithProba.set;
          }
        });
        if (DEBUG_STEP_CODE_ON) {
          console.log("► STEP 6 - D : Plus de couleurs");
        }
        break;
    }

    if (correctColors.length < COLORS_BY_SET) {
      let set;
      const coldWarmCouple = conceptsCouples.find((couple) => couple.name.includes("Warm"));

      if (warmPercentage > 50) {
        set = coldWarmCouple.colors.set2;
      } else {
        set = coldWarmCouple.colors.set1;
      }

      // Je complète les couleurs que le code peut choisir à la fin pour avoir au moins 4 choix
      while (correctColors.length < COLORS_BY_SET) {
        let newColor;
        let colorIsUnique;

        do {
          colorIsUnique = true;
          newColor = random(set);

          // Vérifier si la nouvelle couleur est déjà dans le tableau
          if (correctColors.some((existingColor) => areColorsEqual(existingColor, newColor))) {
            colorIsUnique = false;
          }
        } while (!colorIsUnique);

        correctColors.push(newColor);
      }
    }

    if (DEBUG_STEP_CODE_ON) {
      console.log("► STEP 7 : Je choisi une couleur au hasard pour chaque");
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

      if (DEBUG_STEP_CODE_ON) {
        // console.log("nombre random : ");
        // console.log(trucrandom);
        // console.log("RandomColor");
        // console.log(randomColor);
        // console.log("finalSet");
        // console.log(finalSet);
      }

      for (let m = 0; m < finalSet.length; m++) {
        const colorsEqual = areColorsEqual(randomColor, finalSet[m]);
        if (colorsEqual) {
          exist = true;
          break;
        }

        if (DEBUG_STEP_CODE_ON) {
          console.log(colorsEqual);
        }
      }
    } while (exist);

    finalSet.push(randomColor);

    if (DEBUG_SET_CREATION_ON) {
      console.log("FinalSet :");
      console.log(finalSet);
    }
  }

  if (DEBUG_STEP_CODE_ON) {
    console.log("► STEP 8 : Je transmet le set final");
  }

  currentSet = finalSet;
}

function getTabPossibleColors() {
  if (DEBUG_STEP_CODE_ON) {
    console.log("► STEP 4 : Je récupère toutes les couleurs");
  }
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

    possibleColors.push({
      name: oneCouple.name,
      colors: [...set1, ...set2],
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

//to add
function playAnimation() {
  if (play) {
    stopAnimation();
  } else {
    counterSet = 0;
    counterGrid = 0;
    play = true;
    firstRepetitionAnimation = true;
    loop();
    draw();
  }
}

function stopAnimation() {
  play = false;
  noLoop();
  reDraw();
}

function reDraw() {
  fill(LAYOUT_COLOR);
  rect(MARGIN / 2, MARGIN / 2, LAYOUT_WIDTH, LAYOUT_HEIGHT);

  for (let k = 0; k < MAX_SETS / SETS_BY_GRID; k++) {
    fill(GRID_COLOR);
    rect(MARGIN / 2 + k * GRID_WIDTH + k * SPACING, MARGIN / 2, GRID_WIDTH, GRID_HEIGHT);
  }

  for (let l = 0; l < MAX_SETS / SETS_BY_GRID; l++) {
    //Définir Layout
    for (let i = 0; i < SETS_BY_GRID; i++) {
      // Définir Grid
      currentSet = layoutSets[l][i];
      for (let j = 0; j < COLORS_BY_SET; j++) {
        //Pour chaque couleur

        currentColor = currentSet[j];
        fill(currentColor.hue, currentColor.sat, currentColor.bright);

        rect(MARGIN / 2 + j * COLOR_WIDTH + l * GRID_WIDTH + l * SPACING, MARGIN / 2 + i * COLOR_HEIGHT, COLOR_WIDTH, COLOR_HEIGHT);
      }
    }
  }
}

//-----------------------------------------------------------------------------------------
//--------------------------------------- UTILITIES ---------------------------------------
//-----------------------------------------------------------------------------------------

function setRandomNb() {
  randomNb = int(random(1, 101));
}

function areColorsEqual(color1, color2) {
  if (DEBUG_UTILITIES_FUNCTIONS) {
    console.log("-- COLORS EQUAL --");
    console.log("color 1 : ");
    console.log(color1);
    console.log("color 2 :");
    console.log(color2);
    console.log("------------------");
  }

  return color1.hue === color2.hue && color1.sat === color2.sat && color1.bright === color2.bright && color1.alpha === color2.alpha;
}

function selectRandomColors(colorSet, numColors) {
  const shuffled = [...colorSet].sort(() => Math.random() - 0.5); // Mélanger les couleurs
  return shuffled.slice(0, numColors);
}

function isColorWarm(color) {
  if ((color.hue > 0 && color.hue < 80) || color.hue > 290) {
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
  if (randomNb <= param.value) {
    return true;
  } else {
    return false;
  }
}
function updatePercent() {
  percentages.forEach((couplePercent) => {
    let localStorageItem;

    if (DEBUG_UPDATE_VALUES) {
      console.log("→ Fonction updatePercent. ");
    }

    //Couple Cold-Warm
    if (couplePercent.name == "Cold-Warm") {
      localStorageItem = localStorage.getItem("vibe");

      couplePercent.value = localStorageItem ? localStorageItem : PERCENTS_DEFAULT;

      if (DEBUG_UPDATE_VALUES) {
        console.log("Nouveau Cold-Warm :" + couplePercent.value);
      }
    }

    //Couple Passive-Active
    if (couplePercent.name == "Passive-Active") {
      localStorageItem = localStorage.getItem("temperature");

      couplePercent.value = localStorageItem ? localStorageItem : PERCENTS_DEFAULT;

      if (DEBUG_UPDATE_VALUES) {
        console.log("Nouveau Passive-Active :" + couplePercent.value);
      }
    }

    //Couple Dull-Bright
    if (couplePercent.name == "Dull-Bright") {
      localStorageItem = localStorage.getItem("action");

      couplePercent.value = localStorageItem ? localStorageItem : PERCENTS_DEFAULT;

      if (DEBUG_UPDATE_VALUES) {
        console.log("Nouveau Dull-Bright :" + couplePercent.value);
      }
    }
  });

  draw();
}

function error(text = "Une erreur s'est produite.") {
  console.error(text);
  alert(text);
  noLoop();
}

// to add
function compareSets(set1, set2) {
  if (set1.length !== set2.length) {
    return false;
  }

  for (let i = 0; i < set1.length; i++) {
    if (!areColorsEqual(set1[i], set2[i])) {
      return false;
    }
  }

  return true;
}

//-----------------------------------------------------------------------------------------
//------------------------------------ EVENT LISTENERS ------------------------------------
//-----------------------------------------------------------------------------------------

const temperatureInput = document.getElementsByName("temperature")[0];
const actionInput = document.getElementsByName("action")[0];
const vibeInput = document.getElementsByName("vibe")[0];
const harmonyInput = document.getElementsByName("harmony")[0];

const submitButton = document.getElementById("generateMusic");

// temperatureInput.addEventListener("input", () => {
//   const temperatureValue = temperatureInput.value;
//   // console.log(temperatureValue);
// });

// actionInput.addEventListener("input", () => {
//   const actionValue = actionInput.value;
//   console.log(actionValue);
// });

// vibeInput.addEventListener("input", () => {
//   const vibeValue = vibeInput.value;
//   console.log(vibeValue);
// });

// harmonyInput.addEventListener("input", () => {
//   const harmonyValue = harmonyInput.value;
//   console.log(harmonyValue);
// });

submitButton.addEventListener("click", () => {
  //ADD LOCAL STORAGE VALUES
  localStorage.clear();
  localStorage.setItem("temperature", temperatureInput.value);
  localStorage.setItem("action", actionInput.value);
  localStorage.setItem("vibe", vibeInput.value);
  localStorage.setItem("harmony", harmonyInput.value);

  //GET LOCAL STORAGE VALUES
  document.getElementById("temperatureDisplay").innerHTML = localStorage.getItem("temperature");
  document.getElementById("actionDisplay").innerHTML = localStorage.getItem("action");
  document.getElementById("vibeDisplay").innerHTML = localStorage.getItem("vibe");
  document.getElementById("harmonyDisplay").innerHTML = localStorage.getItem("harmony");

  //SCROLL TO MUSIC SHEET
  document.getElementById("music-sheet").scrollIntoView({
    behavior: "smooth",
  });

  updatePercent();
});
