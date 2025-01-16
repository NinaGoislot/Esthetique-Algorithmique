const SliderTemperature = document.querySelector("input[name=temperature]");
SliderTemperature.oninput = (_) => {
  const sliderColorTemperature = 255 * (1 - `${SliderTemperature.value}` / 100);
  SliderTemperature.style.setProperty(
    "--SliderColor",
    `hsl(${sliderColorTemperature}, 90%, 45%)`
  );
};

const SliderAction = document.querySelector("input[name=action]");
SliderAction.oninput = (_) => {
  const sliderColorAction = 150 * (1 - `${SliderAction.value}` / 100);
  SliderAction.style.setProperty(
    "--SliderColor",
    `rgb(0, ${sliderColorAction}, 145)`
  );
};

const SliderVibe = document.querySelector("input[name=vibe]");
SliderVibe.oninput = (_) => {
  const sliderColorVibe1 = 100 + 155 * (`${SliderVibe.value}` / 100);
  const sliderColorVibe2 = 90 - 90 * (`${SliderVibe.value}` / 100);
  const sliderColorVibe3 = 100 + 30 * (`${SliderVibe.value}` / 100);
  SliderVibe.style.setProperty(
    "--SliderColor",
    `rgb(${sliderColorVibe1}, ${sliderColorVibe2}, ${sliderColorVibe3})`
  );
};

const temperatureInput = document.getElementsByName("temperature")[0];
const actionInput = document.getElementsByName("action")[0];
const vibeInput = document.getElementsByName("vibe")[0];
const harmonyInput = document.getElementsByName("harmony")[0];

const submitButton = document.getElementById("generateMusic");

temperatureInput.addEventListener("input", () => {
  const temperatureValue = temperatureInput.value;
  // console.log(temperatureValue);
});

actionInput.addEventListener("input", () => {
  const actionValue = actionInput.value;
  console.log(actionValue);
});

vibeInput.addEventListener("input", () => {
  const vibeValue = vibeInput.value;
  console.log(vibeValue);
});

harmonyInput.addEventListener("input", () => {
  const harmonyValue = harmonyInput.value;
  console.log(harmonyValue);
});

submitButton.addEventListener("click", () => {
  //ADD LOCAL STORAGE VALUES
  localStorage.clear();
  localStorage.setItem("temperature", temperatureInput.value);
  localStorage.setItem("action", actionInput.value);
  localStorage.setItem("vibe", vibeInput.value);
  localStorage.setItem("harmony", harmonyInput.value);

  //GET LOCAL STORAGE VALUES
  document.getElementById("temperatureDisplay").innerHTML =
    localStorage.getItem("temperature");
  document.getElementById("actionDisplay").innerHTML =
    localStorage.getItem("action");
  document.getElementById("vibeDisplay").innerHTML =
    localStorage.getItem("vibe");
  document.getElementById("harmonyDisplay").innerHTML =
    localStorage.getItem("harmony");

  //SCROLL TO MUSIC SHEET
  document.getElementById("music-sheet").scrollIntoView({
    behavior: "smooth"
  });
  
});