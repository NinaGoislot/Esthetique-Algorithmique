const temperatureInput = document.getElementsByName('temperature')[0];
const actionInput = document.getElementsByName('action')[0];
const vibeInput = document.getElementsByName('vibe')[0];
const harmonyInput = document.getElementsByName('harmony')[0];

const submitButton = document.getElementById("generateMusic");

const temperatureDisplay = document.getElementById("temperatureDisplay");
const actionDisplay = document.getElementById("actionDisplay");
const vibeDisplay = document.getElementById("vibeDisplay");
const harmonyDisplay = document.getElementById("harmonyDisplay");

const data = {
    temperature: temperatureInput.value,
    action: actionInput.value,
    vibe: vibeInput.value,
    harmony: harmonyInput.value
};

temperatureInput.addEventListener('input', () => {
    const temperatureValue = temperatureInput.value;
    console.log(temperatureValue);
});

actionInput.addEventListener('input', () => {
    const actionValue = actionInput.value;
    console.log(actionValue);
});

vibeInput.addEventListener('input', () => {
    const vibeValue = vibeInput.value;
    console.log(vibeValue);
});

harmonyInput.addEventListener('input', () => {
    const harmonyValue = harmonyInput.value;
    console.log(harmonyValue);
});

submitButton.addEventListener('click', () => {
    // add data to the data.json file
});

temperatureDisplay.innerHTML = temperatureInput.value;
actionDisplay.innerHTML = actionInput.value;
vibeDisplay.innerHTML = vibeInput.value;
harmonyDisplay.innerHTML = harmonyInput.value;