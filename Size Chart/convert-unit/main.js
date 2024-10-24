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
          
          // Store original value if not exists
          if (!this.originalValues[rowIndex]) {
            this.originalValues[rowIndex] = {};
          }
          if (this.originalValues[rowIndex][cellIndex] === undefined) {
            this.originalValues[rowIndex][cellIndex] = text;
          }

          if (app.convertibleValues.includes(cellIndex)) {
            console.log(`Row ${rowIndex}, Cell ${cellIndex}: ${text}`);
            this.handleConvertUnit(td, this.originalValues[rowIndex][cellIndex], cellIndex);
          } else if (!td.children.length && text !== '') {
            this.handleConvertUnit(td, this.originalValues[rowIndex][cellIndex], cellIndex);
          }
        });
      }
    });
  },

  handleConvertUnit: function(td, originalText, index) {
    const isKgOrLbColumn = app.convertibleValues.includes(index);

    if (originalText.includes('-')) {
      const values = originalText.split('-').map(val => {
        return +val
          .trim()
          .replace(/,/g, '')
          .replace(/[^0-9.]/g, '');
      });

      if (app.currentUnit === 'cm') {
        td.innerText = originalText;
        return;
      }

      const convertedValues = values.map(value => {
        if (isKgOrLbColumn) {
          return this.roundToOneDecimal(value * 2.20462); // kg -> lb
        } else {
          return this.roundToOneDecimal(value / 2.54); // cm -> inch
        }
      });

      td.innerText = `${convertedValues[0]} - ${convertedValues[1]}`;
    } else {
      let value = +originalText.replace(/,/g, '').replace(/[^0-9.]/g, '');

      if (app.currentUnit === 'cm') {
        td.innerText = originalText;
        return;
      }

      if (isKgOrLbColumn) {
        value = this.roundToOneDecimal(value * 2.20462); // kg -> lb
      } else {
        value = this.roundToOneDecimal(value / 2.54); // cm -> inch
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
  },

  roundToOneDecimal: function(number = 0) {
    return Math.round(number * 10) / 10;
  }
};

app.start();
