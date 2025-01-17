let data;

const CANVAS_WIDTH = 550;
const CANVAS_HEIGHT = 80;

const BOX_SIZE = CANVAS_HEIGHT;

function preload() {
  data = loadJSON("../data/concepts.json");
}

function setup() {
  noCanvas();
  const main = select("#colorPaletteDisplay");

  data.colorSets.forEach((oneColorSet) => {
    let wrapperColorPalette = createDiv();
    wrapperColorPalette.class("colorPalette");
    wrapperColorPalette.parent(main);

    let name = createElement("h2", oneColorSet.name);
    name.class("colorPalette-name");
    name.parent(wrapperColorPalette);

    let canvas = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.class("colorPalette-canvas");
    wrapperColorPalette.child(canvas.elt);
    canvas.style("display", "block");

    let colorInfo = createDiv();
    colorInfo.class("colorPalette-info");
    colorInfo.parent(wrapperColorPalette);
    colorInfo.style("bottom", `calc((${CANVAS_HEIGHT}px / 2) - 5px)`);

    oneColorSet.colors.forEach((color) => {
        
      let r = red(`hsb(${color.hue}, ${color.sat}%, ${color.bright}%)`);
      let g = green(`hsb(${color.hue}, ${color.sat}%, ${color.bright}%)`);
      let b = blue(`hsb(${color.hue}, ${color.sat}%, ${color.bright}%)`);

      let hexColor = rgbToHex(r, g, b);
      let colorInfoText = createElement("p", `${hexColor}`);
      colorInfoText.style("width", `${CANVAS_HEIGHT}px`);

      colorInfoText.style("color", getContrastColor(r, g, b));

      colorInfoText.parent(colorInfo);
    });

    draw(canvas, oneColorSet.colors);
  });
}

function draw(graphics, colors) {
  const numberOfColors = colors.length;

  const totalBoxesWidth = BOX_SIZE * numberOfColors;
  const SPACING = (CANVAS_WIDTH - totalBoxesWidth) / (numberOfColors + 1);

  if (numberOfColors === 1) {
    SPACING = 0;
  }

  graphics.colorMode(HSB);
  graphics.noStroke();

  colors.forEach((color, index) => {
    const x = SPACING + (BOX_SIZE + SPACING) * index;

    graphics.fill(color.hue, color.sat, color.bright);
    graphics.rect(x, 0, BOX_SIZE, BOX_SIZE);
  });
}

function componentToHex(c) {
    var hex = Math.ceil(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getContrastColor(r, g, b) {
  const luminance = (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255;

  return luminance > 0.5 ? "black" : "white";
}