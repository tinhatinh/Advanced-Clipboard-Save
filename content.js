// content.js

// Biến toàn cục
let isButtonVisible = false;
let isSaveEnabled = false;
let isClipboardListenerActive = false;
let observer = null;
let lastClipboardContent = '';

// Hàm lưu giá trị vào storage
function saveValue(name, value) {
    chrome.storage.local.set({ [name]: value });
}

// Hàm lấy giá trị từ storage
function getValue(name, defaultValue) {
    return new Promise((resolve) => {
        chrome.storage.local.get(name, (result) => {
            resolve(result[name] === undefined ? defaultValue : result[name]);
        });
    });
}

// CSS cho Extension
const styles = `
    .clipboard-toggle-container {
        position: fixed;
        top: 20px;
        right: 20px;
        left: auto;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .modern-toggle {
        position: relative;
        display: inline-flex;
        align-items: center;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border: none;
        border-radius: 10px;
        padding: 10px 16px;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        gap: 10px;
        font-size: 14px;
        color: white;
        min-width: 100px;
        justify-content: center;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    .modern-toggle:hover {
         transform: translateY(-2px);
          box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1),
         0 4px 6px -2px rgba(0, 0, 0, 0.05);
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    }

    .modern-toggle input {
            opacity: 0;
       width: 0;
         height: 0;
     }

   .modern-slider {
       width: 32px;
       height: 18px;
       background-color: rgba(255, 255, 255, 0.3);
         border-radius: 18px;
       position: relative;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

     .modern-toggle input:checked + .modern-slider {
         background-color: rgba(255, 255, 255, 0.9);
     }

    .modern-slider:before {
            content: '';
      position: absolute;
            width: 14px;
           height: 14px;
           border-radius: 50%;
        background-color: white;
       top: 2px;
       left: 2px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
     }

    .modern-toggle input:checked + .modern-slider:before {
        transform: translateX(14px);
          background-color: #047857;
        }

        .modern-toggle.enabled {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

    .modern-toggle.enabled:hover {
       background: linear-gradient(135deg, #059669 0%, #047857 100%);
     }

    .toggle-tooltip {
       position: absolute;
        top: 100%;
       left: 50%;
        transform: translateX(-50%);
         background: rgba(0,0,0,0.8);
      color: white;
     padding: 6px 12px;
       border-radius: 6px;
       font-size: 12px;
      font-weight: 300;
      white-space: nowrap;
       opacity: 0;
        transition: opacity 0.3s, transform 0.2s;
        pointer-events: none;
      margin-top: 10px;
    }

   .modern-toggle:hover .toggle-tooltip {
        opacity: 1;
         transform: translate(-50%, 5px);
        }

    .toggle-text {
       font-weight: 500;
        letter-spacing: 0.5px;
       text-transform: uppercase;
    }


    .file-save-modal {
        position: fixed;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       background: #F5F5F5; /* Background color */
         padding: 15px; /* giảm padding cho nhỏ lại */
        border-radius: 8px;  /* Round edges */
        box-shadow: 0 2px 4px #D3D3D3; /* Shadow Color */
        z-index: 10000;
        width: 260px; /* Giảm Width  */
        font-family: 'Inter', sans-serif; /* use Inter font */
       color: #333333;  /* Text Color */
        border: 1px solid #D3D3D3 ;/* Border Color */
         display: flex; /* align items in column*/
        flex-direction: column;
         gap: 10px; /* adjust gap between elements */
        transition: all 0.2s;
    }
 .file-save-modal:hover {
       box-shadow: 0 4px 8px #D3D3D3;  /* increase shadow on hover */
    }

    .file-save-modal h3 {
        margin-bottom: 0; /* remove bottom margin */
        color: #333333;
       font-weight: 600;
        text-align: center;
    }

    .file-save-modal input {
        width: 100% ;
        margin: 0 ; /* remove input margin */
        padding: 8px; /* giảm padding input */
        border: 1px solid #D3D3D3; /*  Border on inputs */
           border-radius: 6px;    /* round corners of inputs */
       background-color: white;  /* set background white */
      color: #333333;       /* input text color */
       box-sizing: border-box; /* makes padding not add to width */
       transition: border-color 0.3s;
      }

   .file-save-modal input:focus {
         border-color: #007BFF; /*  primary focus color */
       outline: none;  /* remove default browser outline*/
   }

    .file-save-modal input::placeholder {
     color: #777;
  }

   .file-save-modal button {
      padding: 10px 15px; /* button padding */
       margin-right: 5px;
       border: none;
        border-radius: 4px; /* Slightly Round button*/
          cursor: pointer;
        transition: all 0.2s ease-in-out;
       color: white; /*button text color */
         flex: 1 ;  /* fill equally width */
          font-size: 14px;  /* make button font smaller */

 }

     .file-save-modal #saveButton {
       background-color: #007BFF; /*  primary button color*/
    }

 .file-save-modal #saveButton:hover {
      background-color: #0056b3; /*slightly darker button hover*/
   }

      .file-save-modal #cancelButton {
        background-color: #FF5722;  /* accent button */
     }

  .file-save-modal #cancelButton:hover {
         background-color: #d4441d; /* slightly darker hover color */
   }

     .file-save-modal div {
         display: flex; /* create a flexible container */
         gap: 8px;  /* reduce gap between buttons*/
    }
   `;

// Thêm CSS vào head của trang web
const styleTag = document.createElement('style');
styleTag.textContent = styles;
document.head.appendChild(styleTag);

// Hàm xử lý việc lưu clipboard
async function handleCopy(text) {
  if (!isSaveEnabled || !text || text.trim() === '') return;

  const saveDialog = document.createElement('div');
  saveDialog.className = 'file-save-modal';
  saveDialog.innerHTML = `
      <h3>Save Clipboard Content</h3>
      <input type="text" id="fileName" placeholder="Enter file name" value="copied_content">
      <input type="text" id="fileExtension" placeholder="Enter file extension (e.g. .txt)" value=".txt">
      <div>
          <button id="saveButton">Save</button>
          <button id="cancelButton">Cancel</button>
      </div>
  `;
  document.body.appendChild(saveDialog);

    const saveButton = saveDialog.querySelector('#saveButton');
    const cancelButton = saveDialog.querySelector('#cancelButton');
  const fileNameInput = saveDialog.querySelector('#fileName');
    const fileExtensionInput = saveDialog.querySelector('#fileExtension');

    saveButton.addEventListener('click', () => {
        const fileName = fileNameInput.value || 'copied_content';
      const fileExtension = fileExtensionInput.value.startsWith('.')
          ? fileExtensionInput.value
            : '.' + fileExtensionInput.value;
      const fullFileName = `${fileName}${fileExtension}`;

   const blob = new Blob([text], { type: 'text/plain' });
     const link = document.createElement('a');
       link.href = URL.createObjectURL(blob);
        link.download = fullFileName;
       link.click();

      document.body.removeChild(saveDialog);
  });

  cancelButton.addEventListener('click', () => {
       document.body.removeChild(saveDialog);
  });
}

// Hàm tạo và thêm toggle button
async function createToggleButton() {
  isButtonVisible = await getValue('clipboardButtonVisible', false);
  isSaveEnabled = await getValue('clipboardSaveEnabled', false);
  const toggleContainer = document.createElement('div');
    toggleContainer.className = 'clipboard-toggle-container';
  toggleContainer.style.display = isButtonVisible ? 'flex' : 'none';
  toggleContainer.innerHTML = `
       <label class="modern-toggle ${isSaveEnabled ? 'enabled' : ''}">
          <input type="checkbox" ${isSaveEnabled ? 'checked' : ''}>
          <span class="modern-slider"></span>
          <span class="toggle-text">✂️📋</span>
          <span class="toggle-tooltip">
            ${isSaveEnabled ? 'Clipboard Save On' : 'Clipboard Save Off'}
           </span>
         </label>
       `;
  document.body.appendChild(toggleContainer);

  const toggleCheckbox = toggleContainer.querySelector('input');
    const toggleTooltip = toggleContainer.querySelector('.toggle-tooltip');
    const modernToggle = toggleContainer.querySelector('.modern-toggle');

  toggleCheckbox.addEventListener('change', function () {
       isSaveEnabled = this.checked;
      saveValue('clipboardSaveEnabled', isSaveEnabled);

      toggleTooltip.textContent = isSaveEnabled ? 'Clipboard Save On' : 'Clipboard Save Off';
    modernToggle.classList.toggle('enabled', isSaveEnabled);
    toggleClipboardListener();
 });
}
// Hàm detect button copy
function detectCopyButtons() {
    const copySelectors = [
        'button:contains("Copy")',
        'button.copy-btn',
         'button[aria-label="Copy"]',
        '[data-clipboard-text]',
        '.copy-button',
            'button:contains("📋")'
  ];
     copySelectors.forEach((selector) => {
          const buttons = document.querySelectorAll(selector);
        buttons.forEach((button) => {
        button.addEventListener('click', () => {
        setTimeout(checkClipboard, 200);
        });
       });
    });
}

// Hàm check clipboard khi copy
async function checkClipboard() {
     if (!isButtonVisible) return;
    try {
          const clipText = await navigator.clipboard.readText();
        if (clipText && clipText !== lastClipboardContent) {
           lastClipboardContent = clipText;
           handleCopy(clipText);
        }
    } catch (err) {
       console.error('Clipboard read failed:', err);
     }
}

// Hàm set listener cho clipboard
function setupClipboardListener() {
    const copyTriggers = ['copy', 'cut', 'mouseup', 'keyup'];
  copyTriggers.forEach((eventType) => {
       document.addEventListener(eventType, () => {
            setTimeout(checkClipboard, 100);
        });
    });
     observer = new MutationObserver(detectCopyButtons);
     observer.observe(document.body, { childList: true, subtree: true });
    detectCopyButtons();
}

// Hàm remove listener
function removeClipboardListener() {
    const copyTriggers = ['copy', 'cut', 'mouseup', 'keyup'];
    copyTriggers.forEach((eventType) => {
        document.removeEventListener(eventType, () => {
        });
    });
    if (observer) {
        observer.disconnect();
    }
}

// Hàm toggle clipboard listener
function toggleClipboardListener() {
     if (isSaveEnabled) {
          if (!isClipboardListenerActive) {
                setupClipboardListener();
                isClipboardListenerActive = true;
           }
        } else {
            if (isClipboardListenerActive) {
           removeClipboardListener();
              isClipboardListenerActive = false;
           }
      }
}
// Hàm cập nhật visibility
function updateToggleContainerVisibility() {
    const toggleContainer = document.querySelector('.clipboard-toggle-container');
    if (toggleContainer) {
       toggleContainer.style.display = isButtonVisible ? 'flex' : 'none';
  }
}
   // Main function
 async function main() {
     await createToggleButton();
        if(isSaveEnabled && !isClipboardListenerActive) {
          setupClipboardListener();
               isClipboardListenerActive = true;
        }
      if (!navigator.clipboard?.readText) {
            console.warn('Clipboard API not supported');
          alert('Your browser does not support advanced clipboard features');
          }
    }
    // Bắt đầu chạy
   main();

  // Handle messages from  background
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'toggleButtonVisibility') {
             isButtonVisible = request.isVisible;
             updateToggleContainerVisibility();
        }
   });

  // initial visibility
getValue('clipboardButtonVisible', false).then((visible) => {
    isButtonVisible = visible;
      updateToggleContainerVisibility();
});