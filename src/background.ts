const contextMenuId = "miteras-kintai-helper-context-menu-id";
const messageName = "miteras-kintai-helper-message";

function createContextMenu() {
  chrome.contextMenus.create(
    {
      id: contextMenuId,
      title: chrome.i18n.getMessage("extName"),
      contexts: ["all"],
      documentUrlPatterns: ["https://kintai.miteras.jp/*/work-condition"],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
    }
  );
}

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.runtime.onUpdateAvailable.addListener((details: chrome.runtime.UpdateAvailableDetails) => {
  console.log("updating to version " + details.version);
  chrome.runtime.reload();
});

// Fired when a context menu item is clicked.
chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    // console.log('context menu clicked');
    // console.log(info);
    // console.log(tab);
    if (tab == null || tab.id == null || tab.id < 0) {
      return;
    }
    if (info.menuItemId === contextMenuId) {
      chrome.tabs.sendMessage(
        tab.id,
        {
          message: messageName,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
            return;
          }
          if (response != null && response.message === "success") {
            // console.log("contextMenu is succeeded.");
          }
        }
      );
      return true;
    }
  }
);
