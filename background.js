// Server configuration
const ENV = 'production';
const config = {
    development: {
        serverUrl: ''
    },
    production: {
        serverUrl: 'https://api.aivoicerecorder.pro'
    }
};

// Set initial configuration and handle install
chrome.runtime.onInstalled.addListener((details) => {
    // Set server URL in storage
    chrome.storage.local.set({
        serverUrl: config[ENV].serverUrl
    });
    
    // Open welcome page on install
    if (details.reason === "install") {
        chrome.tabs.create({ 
            url: 'https://www.aivoicerecorder.pro/welcome.html'
        });
    }
});

// Set uninstall URL
chrome.runtime.setUninstallURL("https://app.youform.com/forms/0i8fs50o", () => {
    if (chrome.runtime.lastError) {
        console.error("Error setting uninstall URL:", chrome.runtime.lastError);
    }
});

// Configure side panel behavior
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// Handle extension icon click 
chrome.action.onClicked.addListener((tab) => {
    if (!tab.url.startsWith("chrome://")) {
        if (chrome.sidePanel && chrome.sidePanel.open) {
            chrome.sidePanel.open({ tabId: tab.id }).catch(error => {
                console.error("Error opening side panel:", error);
                chrome.tabs.create({ url: 'sidepanel.html' });
            });
        } else {
            chrome.tabs.create({ url: 'sidepanel.html' });
        }
    } else {
        console.log("Cannot run on chrome:// pages");
    }
});

// Handle messages from content script and extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handle microphone permission and recording requests
    if (request.action === "requestMicrophonePermission" || request.action === "startRecording") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, request, sendResponse);
        });
        return true; // Indicates we'll respond asynchronously
    }
    
    // Handle welcome page requests
    if (request.type === 'OPEN_WELCOME_PAGE') {
        chrome.tabs.create({
            url: 'https://www.aivoicerecorder.pro/welcome.html'
        });
    }
});