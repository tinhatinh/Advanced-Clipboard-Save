// popup.js

const toggleButton = document.getElementById('toggleButton');

// Hàm set giá trị toggle
async function setButtonState(state) {
    try {
        await chrome.storage.local.set({ clipboardButtonVisible: state });
    } catch (err) {
        console.error('Error set button visibility:', err);
    }
}

// Hàm set và load ban đầu
async function setToggleStateOnLoad() {
  try {
        const visible = await new Promise((resolve) => {
           chrome.storage.local.get('clipboardButtonVisible', (result) => {
            resolve(result.clipboardButtonVisible === undefined ? false : result.clipboardButtonVisible)
           });
        });
     toggleButton.checked = visible;   
    } catch (err) {
         console.error('Error set toggle state:', err)
        }
}
setToggleStateOnLoad();


// Lắng nghe sự kiện thay đổi trạng thái của toggle button
 toggleButton.addEventListener('change', async function() {
    try {
        await setButtonState(this.checked);
         // sau khi set state, thông báo cho content script cập nhật trạng thái
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
     if (tabs && tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'toggleButtonVisibility',
                isVisible: this.checked,
              });
            }
    });
} catch (err) {
    console.error('Error setting and updating button state:', err);
}
});