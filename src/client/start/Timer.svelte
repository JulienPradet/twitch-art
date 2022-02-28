<script>
  import { onMount } from "svelte";
  import { fly, slide } from "svelte/transition";
  import { backOut } from "svelte/easing";

  let remainingTime = 5 * 60;
  let minutes = ["0", "0"];
  let seconds = ["0", "0"];

  const animationDuration = 250;

  $: {
    if (remainingTime >= 0) {
      minutes = Math.floor(remainingTime / 60)
        .toString()
        .padStart("2", "0")
        .split("");
      seconds = (remainingTime % 60).toString().padStart("2", "0").split("");
    }
  }

  let interval = null;
  function restart() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    remainingTime = 5 * 60;
    interval = setInterval(() => {
      remainingTime -= 1;
    }, 1000);
  }
  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }
  onMount(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Space" || event.key === " ") {
        restart();
      } else if (event.key === "Escape") {
        stop();
      }
    });
    window.addEventListener("click", () => {
      restart();
    });
  });
</script>

<div>
  {#if remainingTime >= -10}
    <p out:fly={{ y: -50, duration: animationDuration, delay: 0 }}>
      {#each minutes as number, index}
        {#key number}
          <span
            class="minute-{index}"
            in:fly={{
              y: 50,
              duration: animationDuration,
              delay: animationDuration / 5,
            }}
            out:fly={{ y: -50, duration: animationDuration, delay: 0 }}
            >{number}</span
          >
        {/key}
      {/each}
      <span class="separator">:</span>
      {#each seconds as number, index}
        {#key number}
          <span
            class="second-{index}"
            in:fly={{
              y: 50,
              duration: animationDuration,
              delay: animationDuration / 5,
            }}
            out:fly={{ y: -50, duration: animationDuration, delay: 0 }}
            >{number}</span
          >
        {/key}
      {/each}
    </p>
  {:else}
    <p
      class="small"
      in:fly={{
        y: 50,
        duration: animationDuration,
        delay: animationDuration / 5,
      }}
    >
      J'arrive tout de suite ! 👀
    </p>
  {/if}
</div>

<style>
  div {
    position: relative;
    height: 5rem;
  }
  p {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: 0.8rem 0 0 0;
    font-size: 5rem;
    text-align: center;
    font-weight: 300;
    line-height: 5rem;
  }
  span {
    position: absolute;
    top: 0;
  }
  .minute-0 {
    left: calc(50% - 2.5ch);
  }
  .minute-1 {
    left: calc(50% - 1.5ch);
  }
  .separator {
    left: calc(50% - 0.1ch);
  }
  .second-0 {
    left: calc(50% + 0.5ch);
  }
  .second-1 {
    left: calc(50% + 1.5ch);
  }

  .small {
    font-size: 3rem;
  }
</style>
