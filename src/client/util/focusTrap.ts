const useFocusTrap = (node: HTMLElement, focusDelay = 0) => {
  const previousFocusElement = document.activeElement;

  let timeout: ReturnType<typeof setTimeout> | null = setTimeout(function () {
    node.focus();
    timeout = null;
  }, focusDelay);

  const isNext = (event: KeyboardEvent) =>
    event.key === "Tab" && !event.shiftKey;
  const isPrevious = (event: KeyboardEvent) =>
    event.key === "Tab" && event.shiftKey;
  const trapFocusListener = (event: KeyboardEvent) => {
    if (node.contains(event.target as Node)) {
      const focusable = node.querySelectorAll(
        "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"
      );
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      if (isNext(event) && event.target === last) {
        event.preventDefault();
        first.focus();
      } else if (isPrevious(event) && event.target === first) {
        event.preventDefault();
        last.focus();
      }
    }
  };
  document.addEventListener("keydown", trapFocusListener);

  return {
    destroy() {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (previousFocusElement && previousFocusElement instanceof HTMLElement) {
        previousFocusElement.focus();
      }
      document.removeEventListener("keydown", trapFocusListener);
    },
  };
};

export default useFocusTrap;
