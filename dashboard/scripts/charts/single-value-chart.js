const renderSVChart = (id) => {
  let valueDisplay = document.getElementById(id);
  let duration = 1000;
  let startValue = 0;
  let endValue = +valueDisplay.dataset.val;
  let interval = Math.floor(duration / endValue);
  let counter = setInterval(function () {
    startValue += 1;
    valueDisplay.textContent =
      startValue.toLocaleString() + valueDisplay.dataset.unit;
    if (startValue == endValue) {
      clearInterval(counter);
    }
  }, interval);
};

renderSVChart("chart7");

document.addEventListener("aos:in:chart8", () => {
  renderSVChart("chart8");
});

document.addEventListener("aos:in:chart9", () => {
  renderSVChart("chart9");
});
