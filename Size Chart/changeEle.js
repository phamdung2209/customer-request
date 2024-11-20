const app = {
    selectors: {
      headerClass: '.PopupPreview-Content__header',
      authorMobileClass: '.PopupPreview__AuthorMobile',
    },

    newImageSrc: 'https://link',

    start: function () {
      this.observeElements([this.selectors.headerClass, this.selectors.authorMobileClass]);
    },

    observeElements: function (selectors) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            selectors.forEach((selector) => {
              const targetElements = document.querySelectorAll(selector);
              targetElements.forEach((element) => this.updateImageSrc(element));
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },

    updateImageSrc: function (element) {
      const imgTag = element.querySelector('img');
      if (imgTag) {
        imgTag.src = this.newImageSrc;
      }
    },
  };

  app.start();