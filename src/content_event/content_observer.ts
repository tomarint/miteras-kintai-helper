export function observeElementChanges(
  elementId: string,
  onAdded: (addedElement: HTMLElement) => void
): void {
  // Get the target element
  const targetElement = document.getElementById(elementId);
  if (targetElement == null) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }

  // Get the parent element
  const parentElement = targetElement.parentElement;
  if (parentElement == null) {
    console.error(`Parent of element with id "${elementId}" not found.`);
    return;
  }

  // MutationObserver configuration
  const config: MutationObserverInit = {
    childList: true, // Observe changes to child elements
    subtree: true, // Observe changes to descendants
  };

  // Create and start the MutationObserver
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes) {
        // Check if elements have been added
        for (const node of mutation.addedNodes) {
          if ((node as HTMLElement).id === elementId) {
            onAdded(node as HTMLElement); // Pass the added element to the callback
            break;
          }
        }
      }
    }
  });

  // Start observing the parent element
  observer.observe(parentElement, config);
}
