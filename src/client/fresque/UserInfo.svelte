<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { backOut } from "svelte/easing";

  import { TwitchUser } from "../../TwitchUser";
  import { AlertCanvasFunction } from "../twitch-alerts/AlertCanvasFunction";
  import { StyleParams } from "../canvas/styles";

  export let user: TwitchUser;

  let canvasContainer: HTMLElement;
  let params: StyleParams;

  onMount(async () => {
    const width = Math.min(300, canvasContainer.clientWidth);

    params = await AlertCanvasFunction(canvasContainer, width, width * 2, user);
  });
</script>

<div class="user-info">
  <h2 in:fly={{ y: 35, duration: 140, delay: 350, easing: backOut }}>
    Salut {user.displayName} !
  </h2>

  <div
    class="canvas"
    bind:this={canvasContainer}
    in:fly={{ y: 35, duration: 180, delay: 400, easing: backOut }}
  />

  {#if params}
    <dl>
      <dt>Style</dt>
      <dd>{params.style}</dd>
    </dl>
    <dl>
      <dt>Number of messages</dt>
      <dd>{user.messageCount}</dd>
    </dl>
  {/if}
</div>

<style>
  .user-info {
    padding: 1.5rem;
  }

  h2 {
    text-align: center;
  }

  .canvas {
    margin: 3rem auto;
  }
</style>
