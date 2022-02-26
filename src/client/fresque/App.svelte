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
  let latestFocus: {
    hidden: boolean;
    user: TwitchUser;
    offsetX: number;
    offsetY: number;
  } | null = null;
  let height: number | null = null;
  let userWidth: number | null = null;

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

      const result = await FresqueCanvasFunction(
        canvasContainer,
        window.innerWidth,
        window.innerHeight,
        data,
        (user) => {
          selectedUser = user;
        },
        (user, offsetX, offsetY) => {
          latestFocus = { hidden: false, user, offsetX, offsetY };
        },
        (user, offsetX, offsetY) => {
          latestFocus = { hidden: true, user, offsetX, offsetY };
        }
      );

      height = result.canvasHeight;
      userWidth = result.userWidth;
      removeListeners = result.removeListeners;
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

<div class="canvas-container">
  <div class="canvas" bind:this={canvasContainer} />

  {#if latestFocus}
    <div
      aria-hidden={!latestFocus.user || null}
      aria-live={latestFocus.user ? "assertive" : "off"}
      class="tooltip"
      style={`--offset-x: ${latestFocus.offsetX}px; --offset-y: ${latestFocus.offsetY}px; --height: ${height}px; --width: ${userWidth}px`}
    >
      {latestFocus.user.displayName}
    </div>
  {/if}
</div>

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
  .canvas-container {
    position: relative;
    z-index: 0;
    width: min-content;
    margin: 0 auto;
  }
  .canvas {
    margin: 0 auto;
  }

  .canvas :global(canvas) {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }
  .canvas :global(path:focus) {
    outline: none;
    stroke: azure;
    stroke-width: 10px;
  }

  .tooltip {
    position: absolute;
    z-index: 2;
    left: var(--offset-x);
    bottom: calc(var(--height) - var(--offset-y) + 10px);
    min-width: var(--width);
    transform: translateX(-50%);
    padding: 10px;
    text-align: center;
    background: rgba(0 0 0 / 30%);
  }
</style>
