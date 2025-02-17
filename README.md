# Advanced Clipboard Save

## General Description

Clipboard Save is a browser extension that allows users to easily save content from their clipboard to files on their computer. The extension automatically detects copy actions on web pages and prompts users to save the copied content with customizable file names and formats. It features a user-friendly interface and supports toggling the clipboard saving functionality on and off.

---

## Installation Steps

### Step 1: Download the .zip File
Download the .zip file containing the Clipboard Save extension.

### Step 2: Extract the .zip File
Once the file is downloaded, extract the .zip file to any folder on your computer.

### Step 3: Load the Extension in Your Browser
1. Open your browser (e.g., Chrome).
2. Go to the Extensions page (chrome://extensions/).
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the extracted folder containing the extension files.

### Step 4: Enable Clipboard Saving
After loading the extension, click on the extension icon and toggle the clipboard saving feature to enable it.

---

## Main Features

- **Automatic Clipboard Detection:**  
  The extension automatically detects copy actions on web pages and prompts users to save the copied content.

- **Customizable File Names and Formats:**  
  Users can enter a file name and choose the file format (e.g., .txt) when saving clipboard content.

- **User -Friendly Interface:**  
  The extension features a modern design that allows users to easily toggle clipboard saving on and off.

- **Cross-Browser Support:**  
  Works on browsers that support the clipboard API, making it accessible for various users.

- **Toggle Button:**  
  Users can enable or disable the clipboard saving feature with a simple toggle button in the extension interface.

---

## How It Work

1. **Clipboard Monitoring:**  
   The extension listens for copy actions on web pages and captures the copied content.

2. **Prompt for Saving:**  
   When content is copied, a dialog box appears, allowing users to enter a file name and select a file format.

3. **Save to File:**  
   The copied content is saved to a file on the user's computer based on the provided name and format.

4. **Toggle Functionality:**  
   Users can easily enable or disable the clipboard saving feature through the extension's interface.

---

## Libraries Used

- **Chrome API:** Utilizes the Chrome extension APIs for storage, commands, and messaging.
- **MutationObserver:** Monitors changes in the DOM to detect copy buttons on web pages.
- **Blob:** Creates file objects for saving clipboard content.

---

## Usage Notes

- Ensure that your browser supports the clipboard API for the extension to function correctly.
- You can toggle the clipboard saving feature on and off from the extension's popup interface.

This extension is perfect for users who frequently copy content and want a quick and efficient way to save it to files without manual intervention.

---
