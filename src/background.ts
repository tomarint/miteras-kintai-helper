(() => {
  class MiterasKintaiHelperBackend {
    readonly contextMenuId = "miteras-kintai-helper-context-menu-id";
    readonly messageName = "miteras-kintai-helper-message";

    constructor() {
      chrome.contextMenus.create({
        id: this.contextMenuId,
        title: chrome.i18n.getMessage("extName"),
        contexts: ["all"],
        documentUrlPatterns: ["https://kintai.miteras.jp/*/work-condition"],
      });
    
      // Fired when a tab is updated.
      chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
        if (tab == null || tabId < 0 || changeInfo == null) {
          return;
        }
        if (changeInfo.status === "complete") {
          let url = tab.url;
          if (url == null) {
            url = "";
          }

          if (url.indexOf("https://kintai.miteras.jp/") >= 0) {
            chrome.storage.sync.get(
              {
                breaktime1: '705',
                breaktime2: '-1',
                breaktime3: '0',
                loginButtonAnimation: '0',
              }
            ).then((items) => {
              let loginButtonAnimation = Number(items.loginButtonAnimation);
              if (loginButtonAnimation !== 1) {
                chrome.scripting.insertCSS(
                  {
                    target: { tabId },
                    css: `.login-button { transition: none !important; }`
                  }
                ).then(() => {
                  if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                  }
                }).catch((reason: any) => {
                  if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError, reason);
                  }
                })
              }
            }).catch(function (error) {
              console.log(error);
            });
          }
        }
      });

      // Fired when a context menu item is clicked.
      chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
        // console.log('context menu clicked');
        // console.log(info);
        // console.log(tab);
        if (tab == null || tab.id == null || tab.id < 0) {
          return;
        }
        if (info.menuItemId === this.contextMenuId) {
          chrome.tabs.sendMessage(
            tab.id,
            {
              message: this.messageName
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
      });
    }
  };
  new MiterasKintaiHelperBackend();
})();
