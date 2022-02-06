<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  import focusTrap from "./focusTrap";
  import shortcut from "./shortcut";

  export let ariaLabel: string;
  export let onDismiss: () => void;
  let modalContainer: HTMLElement | null = null;

  onMount(() => {
    const listener = (event: MouseEvent) => {
      const target = event.target;
      if (target === null) {
        onDismiss();
        return;
      }

      const node = target as Node;

      if (!modalContainer || !modalContainer.contains(node)) {
        onDismiss();
      }
    };
    window.addEventListener("click", listener);

    return () => {
      window.removeEventListener("click", listener);
    };
  });
</script>

<div
  class="modal"
  role="dialog"
  aria-label={ariaLabel}
  aria-modal="true"
  tabindex="-1"
  bind:this={modalContainer}
  use:focusTrap
  use:shortcut={{ key: "Escape", listener: onDismiss }}
  in:fly={{ x: 300, y: 0, duration: 130, delay: 150, opacity: 1 }}
  out:fly={{ x: 300, y: 0, duration: 130, delay: 0, opacity: 1 }}
>
  <slot />
</div>

<style>
  .modal {
    position: fixed;
    background: var(--c-dark);
    top: 0;
    bottom: 0;
    right: 0;
    width: 20vw;
    min-width: 300px;
    box-shadow: 0 0 2em var(--c-shadow);
    outline: none;
  }
</style>
