chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get('clipboardButtonVisible', (result) => {
        if (result.clipboardButtonVisible === undefined) {
             chrome.storage.local.set({ clipboardButtonVisible: false });
        }
    });
});

chrome.commands.onCommand.addListener((command) => {

  if (command === 'toggle-clipboard-button') {
    chrome.storage.local.get('clipboardButtonVisible', (result) => {
      const isVisible = !result.clipboardButtonVisible;
      chrome.storage.local.set({ clipboardButtonVisible: isVisible }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
               if (tabs && tabs.length > 0) {
                   chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleButtonVisibility', isVisible });
             }
     });
      });
    });
  }
});