chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "open_options") chrome.runtime.openOptionsPage();
});
