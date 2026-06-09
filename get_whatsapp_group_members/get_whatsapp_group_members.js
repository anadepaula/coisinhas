(() => {
  window.detectedPhoneNumbers = window.detectedPhoneNumbers || new Set();

  const phoneRegex = /\+\d[\d\s\(\)\-]{4,}/g;

  function scanText(text) {
    if (!text) return;

    const matches = text.match(phoneRegex);
    if (!matches) return;

    matches.forEach(phone => {
      const normalized = phone.trim();
      if (!window.detectedPhoneNumbers.has(normalized)) {
        window.detectedPhoneNumbers.add(normalized);
        console.log("Phone number:", normalized);
      }
    });
  }

  function scanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      scanText(node.textContent);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(scanNode);
    }
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === "characterData") {
        scanText(mutation.target.textContent);
      }

      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(scanNode);
      }
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  scanNode(document.documentElement);

  console.log("Watching DOM.");
  console.log("Access to global var with phones here: Array.from(detectedPhoneNumbers)");
})();
