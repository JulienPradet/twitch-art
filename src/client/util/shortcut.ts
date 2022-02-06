const shortcut = (
  node: HTMLElement,
  { key, listener }: { key: string; listener: (event: KeyboardEvent) => void }
) => {
  const escapeListener = (event: KeyboardEvent) => {
    if (event.key === key && node.contains(event.target as Node)) {
      listener(event);
    }
  };
  document.addEventListener("keydown", escapeListener);

  return {
    destroy: () => {
      document.removeEventListener("keydown", escapeListener);
    },
  };
};

export default shortcut;
