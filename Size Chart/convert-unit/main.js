const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
  currentUnit: 'cm',
  originalValues: [],
  convertibleValues: [],
  enableConvertOtherUnits: true,

  start: function() {
    this.waitForElements();
  },

  render: function() {
    const avadaTableData = $$('#Avada-SC__Table--custom tbody tr');
    const headerRow = avadaTableData[0];

    // Find columns with 'kg' or 'lb' in the header row
    const headerCells = headerRow.querySelectorAll('td');
    if (this.enableConvertOtherUnits) {
      headerCells.forEach((td, index) => {
        const strongElement = td.querySelector('strong');

        const text = strongElement ? strongElement.innerText.trim() : '';
        if (text.includes('(kg)') || text.includes('(lb)')) {
          if (app.currentUnit === 'inch') {
            strongElement.innerText = text.replace('(kg)', '(lb)').replace('(lb)', '(lb)');
          } else if (app.currentUnit === 'cm') {
            strongElement.innerText = text.replace('(lb)', '(kg)').replace('(kg)', '(kg)');
          }
          app.convertibleValues.push(index);
          console.log(`Column index with kg or lb: ${index}, Data: ${strongElement.innerText}`);
        }
      });
    }

    avadaTableData.forEach((row, rowIndex) => {
      if (rowIndex > 0) {
        // Skip the header row
        const cells = row.querySelectorAll('td');
        cells.forEach((td, cellIndex) => {
          const text = td.innerText.trim();
          if (app.convertibleValues.includes(cellIndex)) {
            console.log(`Row ${rowIndex}, Cell ${cellIndex}: ${text}`);
            this.handleConvertUnit(td, text, cellIndex);
          } else if (!td.children.length && text !== '') {
            this.handleConvertUnit(td, text, cellIndex);
          }
        });
      }
    });
  },

  handleConvertUnit: function(td, text, index) {
    const isKgOrLbColumn = app.convertibleValues.includes(index);

    if (text.includes('-')) {
      const values = text.split('-').map(val => {
        return +val
          .trim()
          .replace(/,/g, '')
          .replace(/[^0-9.]/g, '');
      });

      if (!this.originalValues[index]) {
        this.originalValues[index] = values;
      }

      const convertedValues = values.map((value, i) => {
        if (isKgOrLbColumn) {
          return app.currentUnit === 'inch'
            ? (value * 2.20462).toFixed(1) // kg -> lb
            : (value / 2.20462).toFixed(0); // lb -> kg
        } else {
          return app.currentUnit === 'inch'
            ? (value / 2.54).toFixed(1) // cm -> inch
            : (value * 2.54).toFixed(0); // inch -> cm
        }
      });

      td.innerText = `${convertedValues[0]}-${convertedValues[1]}`;
    } else {
      let value = +text.replace(/,/g, '').replace(/[^0-9.]/g, '');

      if (!this.originalValues[index]) {
        this.originalValues[index] = value;
      }

      if (isKgOrLbColumn) {
        value =
          app.currentUnit === 'inch'
            ? (value * 2.20462).toFixed(1) // kg -> lb
            : (value / 2.20462).toFixed(0); // lb -> kg
      } else {
        value =
          app.currentUnit === 'inch'
            ? (value / 2.54).toFixed(1) // cm -> inch
            : (value * 2.54).toFixed(0); // inch -> cm
      }

      td.innerText = value;
    }
  },

  waitForElements: function() {
    const maxWaitTime = 10000;
    const intervalTime = 100;
    let elapsedTime = 0;
    const interval = setInterval(() => {
      const avadaBtnCm = $('#Avada-SC__Btn--Centimeter--custom');
      const avadaBtnInch = $('#Avada-SC__Btn--Inch--custom');
      const avadaTable = $('#Avada-SC__Table--custom');
      if (avadaBtnCm && avadaBtnInch) {
        clearInterval(interval);
        this.handleEvent(avadaBtnCm, avadaBtnInch, avadaTable);
      }
      elapsedTime += intervalTime;
      if (elapsedTime >= maxWaitTime) {
        clearInterval(interval);
        console.warn('Elements not found within 10 seconds');
      }
    }, intervalTime);
  },

  handleEvent: function(avadaBtnCm, avadaBtnInch) {
    avadaBtnCm.onclick = this.handleBtnCm.bind(this);
    avadaBtnInch.onclick = this.handleBtnInch.bind(this);
  },

  handleBtnCm: function() {
    if (app.currentUnit === 'cm') {
      return;
    }
    app.currentUnit = 'cm';
    app.render();
    const avadaBtnCm = $('#Avada-SC__Btn--Centimeter--custom');
    const avadaBtnInch = $('#Avada-SC__Btn--Inch--custom');
    app.setActiveButton(avadaBtnCm, avadaBtnInch);
  },

  handleBtnInch: function() {
    if (app.currentUnit === 'inch') {
      return;
    }
    app.currentUnit = 'inch';
    app.render();
    const avadaBtnCm = $('#Avada-SC__Btn--Centimeter--custom');
    const avadaBtnInch = $('#Avada-SC__Btn--Inch--custom');
    app.setActiveButton(avadaBtnInch, avadaBtnCm);
  },

  setActiveButton: function(activeButton, inactiveButton) {
    activeButton.style.backgroundColor = 'rgb(32, 34, 35)';
    activeButton.style.color = 'rgb(255, 255, 255)';
    inactiveButton.style.backgroundColor = 'transparent';
    inactiveButton.style.color = 'rgb(32, 34, 35)';
  }
};

app.start();
