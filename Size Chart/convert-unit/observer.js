const app = {
    selectors: {
      avadaButton: '#Avada-SC-button',
      targetButton: '[option-name="Ring size"]:not([option-name-value]) gp-text div div'
    },
  
    start: function() {
      this.observeElement(this.selectors.avadaButton);
    },
  
    observeElement: function(selector) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            const targetButton = document.querySelector(this.selectors.targetButton);
            const avadaButton = document.querySelector(this.selectors.avadaButton);
            
            if (targetButton && avadaButton) {
              this.moveElement();
              observer.disconnect();
            }
          }
        });
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },
  
    moveElement: function() {
      const avadaButton = document.querySelector(this.selectors.avadaButton);
      const targetButtons = document.querySelectorAll(this.selectors.targetButton);
  
      if (!avadaButton || targetButtons.length === 0) {
        return;
      }
  
      targetButtons[0].before(avadaButton);
    },
  
    init: function() {
      const targetButton = document.querySelector(this.selectors.targetButton);
      const avadaButton = document.querySelector(this.selectors.avadaButton);
  
      if (targetButton && avadaButton) {
        this.moveElement(); 
      } else {
        this.observeElement(this.selectors.avadaButton);
      }
    }
  };
  
  app.start();
  