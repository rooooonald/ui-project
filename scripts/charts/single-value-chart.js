const startCount = () => {
  let valueDisplays = document.querySelectorAll(".single-chart-val");
  let duration = 1000;
  valueDisplays.forEach((valueDisplay) => {
    let startValue = 0;
    let endValue = +valueDisplay.dataset.val;
    let interval = Math.floor(duration / endValue);
    let counter = setInterval(function () {
      startValue += 1;
      valueDisplay.textContent = startValue + "%";
      if (startValue == endValue) {
        clearInterval(counter);
      }
    }, interval);
  });
};

document
  .getElementById("v-pills-single-value-chart-tab")
  .addEventListener("click", startCount);
