<script lang="ts">
  import { onMount } from "svelte";
  import { AlertCanvasFunction } from "./AlertCanvasFunction";

  import { UserClientData } from "./ClientDataStore";

  export let user: UserClientData;

  let badgeContainer: HTMLElement | null = null;

  let widthRatio = Math.min(
    100,
    (user.xp / user.requiredXpForNextEvolution) * 100
  );
  let completedRatio = widthRatio.toFixed(0) + "%";

  onMount(() => {
    if (badgeContainer) {
      AlertCanvasFunction(badgeContainer, 25, 50, user.user);
    }
  });
</script>

<div class="container">
  <div class="badge" bind:this={badgeContainer} />
  <div class="evolution">
    <div class="name">{user.user.displayName}</div>
    <div class="progress">
      <span class="text"
        >{user.xp} / {user.requiredXpForNextEvolution} Exp.</span
      >
      <div class="completed" style="--completed-ratio: {completedRatio}" />
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
  }
  .badge {
    margin-right: 15px;
  }
  .evolution {
    display: flex;
    align-items: baseline;
  }

  .progress {
    position: relative;
    background: grey;
    display: flex;
    margin-left: 15px;
  }
  .completed {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    background: green;
    width: var(--completed-ratio);
  }

  .text {
    position: relative;
    z-index: 1;
    padding: 5px;
  }
</style>
