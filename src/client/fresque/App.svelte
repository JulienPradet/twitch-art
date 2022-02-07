<script lang="ts">
  import { onMount } from "svelte";
  import { TwitchData } from "../../DataManager";
  import { TwitchUser } from "../../TwitchUser";
  import Modal from "../util/Modal.svelte";
  import { FresqueCanvasFunction } from "./FresqueCanvasFunction";
  import UserInfo from "./UserInfo.svelte";

  export let data: TwitchData;
  let canvasContainer: HTMLElement;
  let selectedUser: TwitchUser | null = null;

  const debounce = (fn: () => void, timeoutMs: number) => {
    let timeoutRef: NodeJS.Timeout | null = null;

    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
      timeoutRef = setTimeout(() => {
        fn();
        timeoutRef = null;
      }, timeoutMs);
    };
  };

  onMount(async () => {
    let removeListeners: (() => void) | null = null;
    const draw = debounce(async () => {
      if (removeListeners) {
        removeListeners();
        removeListeners = null;
        canvasContainer.innerHTML = "";
      }

      removeListeners = await FresqueCanvasFunction(
        canvasContainer,
        window.innerWidth,
        window.innerHeight,
        data,
        (user) => {
          selectedUser = user;
        }
      );
    }, 200);

    draw();

    window.addEventListener("resize", draw);

    return () => {
      if (removeListeners) {
        removeListeners();
      }
      window.removeEventListener("resize", draw);
    };
  });
</script>

<div class="canvas" bind:this={canvasContainer} />

{#if selectedUser}
  {#key selectedUser}
    <Modal
      onDismiss={() => (selectedUser = null)}
      ariaLabel={`Toutes les infos de ${selectedUser.displayName}`}
    >
      <UserInfo user={selectedUser} />
    </Modal>
  {/key}
{/if}

<style>
  .canvas {
    margin: 0 auto;
  }
</style>
