// Saves options to chrome.storage
function save_options() {
  const breaktime1 = document.querySelector<HTMLSelectElement>("#breaktime1Select");
  if (breaktime1 == null) {
    return;
  }
  // console.log("save breaktime1: ", breaktime1.options[breaktime1.selectedIndex].value);
  chrome.storage.sync.set({
    breaktime1: breaktime1.options[breaktime1.selectedIndex].value
  }, function () {
    // Update status to let user know options were saved.
    const status = document.querySelector<HTMLElement>("#status");
    if (status != null) {
      status.textContent = 'Saved!';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
    }
  });
}

// Restores select box state using the preferences stored in chrome.storage.
function restore_options() {
  // Use default value
  chrome.storage.sync.get({
    breaktime1: '720',
  }, function (items) {
    const breaktime1 = document.querySelector<HTMLSelectElement>("#breaktime1Select");
    if (breaktime1 != null) {
      // console.log("restore breaktime1: ", items.breaktime1);
      breaktime1.value = items.breaktime1;
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector("#save")?.addEventListener("click", save_options);
