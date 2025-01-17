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

