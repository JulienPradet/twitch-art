<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { fly, fade, blur } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import { AlertCanvasFunction } from "./AlertCanvasFunction";
  import { AlertClientData } from "./ClientDataStore";

  const dispatch = createEventDispatcher();

  export let debug: boolean;
  export let alert: AlertClientData;

  let canvasContainer: HTMLElement;

  const duration = 6000;

  onMount(() => {
    AlertCanvasFunction(canvasContainer, 100, 200, alert.user);
  });

  setTimeout(() => {
    dispatch("alertEnd");
  }, duration);
</script>

<div
  class="container {debug ? 'container--debug' : ''}"
  out:fade={{ duration: 200 }}
>
  <div
    class="canvas"
    bind:this={canvasContainer}
    in:fly={{ y: 35, duration: 100, delay: 970, easing: backOut }}
  />
  <div class="text">
    <p
      class="big"
      in:fly={{ y: 40, duration: 130, delay: 1000, easing: backOut }}
    >
      Hein ?
    </p>
    <p in:fly={{ y: 45, duration: 150, delay: 1030, easing: backOut }}>
      <span class="pseudo">{alert.user.displayName}</span> Evolue !
    </p>
  </div>
</div>

<style>
  .container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 40%;
    height: 30%;
  }

  .container--debug {
    top: 30%;
  }

  .canvas {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }

  .text {
    margin-top: 15px;
    color: white;
    text-align: center;
    font-size: 2.5em;
    font-weight: bold;
    text-shadow: 0px 0px 15px rgba(0 0 0 / 80%);
  }

  p {
    margin: 0;
  }
  p + p {
    margin-top: 0.3em;
  }

  .pseudo {
    color: #b7e770;
  }

  .big {
    font-size: 1.8em;
  }
</style>
