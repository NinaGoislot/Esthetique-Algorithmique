const temperatureInput = document.getElementsByName("temperature")[0];
const actionInput = document.getElementsByName("action")[0];
const vibeInput = document.getElementsByName("vibe")[0];
const harmonyInput = document.getElementsByName("harmony")[0];

const submitButton = document.getElementById("generateMusic");


temperatureInput.addEventListener("input", () => {
  const temperatureValue = temperatureInput.value;
  console.log(temperatureValue);
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
  localStorage.clear();
  localStorage.setItem("temperature", temperatureInput.value);
  localStorage.setItem("action", actionInput.value);
  localStorage.setItem("vibe", vibeInput.value);
  localStorage.setItem("harmony", harmonyInput.value);
});