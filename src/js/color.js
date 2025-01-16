let paletteCanvas;

let data;
let font;
let colorPalette;

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;
const CANVAS_COLOR = "white";

function preload() {
  data = loadJSON("./data/concepts.json");
  font = loadFont("./fonts/Outfit-VariableFont_wght.ttf");
}

function setup() {
  paletteCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);
  paletteCanvas.parent("colorPalette");
  background(CANVAS_COLOR);
  colorMode(HSB);
  textFont(font);
  textSize(32);
}

function draw() {
  frameRate(1);
  
  for (let line = 0; line < data.colorSets.length; line++) {
      colorPalette = data.colorSets[line];
    for (let oneLine = 0; oneLine < data.colorSets.length; oneLine++) {
      if (oneLine % 2 == 0) {
        let colorPaletteName = colorPalette.name;
        text(colorPaletteName, oneLine, 0);
        textAlign(CENTER, CENTER);
      } else {
        for (let column = 0; column < colorPalette.colors.length; column++) {
          let x = column * 100;
          let y = oneLine * 100;
          let color = colorPalette.colors[column];
          fill(color.hue, color.sat, color.bright);
          rect(x, y, 100, 100);
        }
      }
    }
  }
}
