const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
  currentUnit: "cm",

  start: function () {
    this.waitForElements();
  },

  render: function () {
    const avadaTableData = $$("#Avada-SC__Table--custom tbody tr td");

    avadaTableData.forEach((td) => {
      if (td.children.length === 0 && td.innerText.trim() !== "") {
        const text = td.innerText.trim();

        if (text.includes("-")) {
          const values = text.split("-").map((val) => {
            return +val
              .trim()
              .replace(/,/g, "")
              .replace(/[^0-9.]/g, "");
          });

          const convertedValues = values.map((value) => {
            if (app.currentUnit === "inch") {
              return (value / 2.54).toFixed(0); // cm -> inch
            } else if (app.currentUnit === "cm") {
              return (value * 2.54).toFixed(0); // inch -> cm
            }
            return value;
          });

          td.innerText = `${convertedValues[0]}-${convertedValues[1]}`;
        } else {
          let value = +text.replace(/,/g, "").replace(/[^0-9.]/g, "");

          if (app.currentUnit === "inch") {
            value = (value / 2.54).toFixed(0); // cm -> inch
          } else if (app.currentUnit === "cm") {
            value = (value * 2.54).toFixed(0); // inch -> cm
          }

          td.innerText = value;
        }
      }
    });
  },

  waitForElements: function () {
    const maxWaitTime = 10000;
    const intervalTime = 100;
    let elapsedTime = 0;

    const interval = setInterval(() => {
      const avadaBtnCm = $("#Avada-SC__Btn--Centimeter--custom");
      const avadaBtnInch = $("#Avada-SC__Btn--Inch--custom");
      const avadaTable = $("#Avada-SC__Table--custom");

      if (avadaBtnCm && avadaBtnInch) {
        clearInterval(interval);
        this.handleEvent(avadaBtnCm, avadaBtnInch, avadaTable);
      }

      elapsedTime += intervalTime;
      if (elapsedTime >= maxWaitTime) {
        clearInterval(interval);
        console.warn("Elements not found within 10 seconds");
      }
    }, intervalTime);
  },

  handleEvent: function (avadaBtnCm, avadaBtnInch) {
    avadaBtnCm.onclick = this.handleBtnCm;
    avadaBtnInch.onclick = this.handleBtnInch;
  },

  handleBtnCm: function () {
    if (app.currentUnit === "cm") {
      return;
    }

    app.currentUnit = "cm";
    app.render();

    const avadaBtnCm = $("#Avada-SC__Btn--Centimeter--custom");
    const avadaBtnInch = $("#Avada-SC__Btn--Inch--custom");
    app.setActiveButton(avadaBtnCm, avadaBtnInch);
  },

  handleBtnInch: function () {
    if (app.currentUnit === "inch") {
      return;
    }

    app.currentUnit = "inch";
    app.render();

    const avadaBtnCm = $("#Avada-SC__Btn--Centimeter--custom");
    const avadaBtnInch = $("#Avada-SC__Btn--Inch--custom");
    app.setActiveButton(avadaBtnInch, avadaBtnCm);
  },

  setActiveButton: function (activeButton, inactiveButton) {
    activeButton.style.backgroundColor = "rgb(32, 34, 35)";
    activeButton.style.color = "rgb(255, 255, 255)";

    inactiveButton.style.backgroundColor = "transparent";
    inactiveButton.style.color = "rgb(32, 34, 35)";
  },
};

app.start();
