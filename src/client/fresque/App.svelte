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

  onMount(async () => {
    await FresqueCanvasFunction(
      canvasContainer,
      window.innerWidth,
      window.innerHeight,
      data,
      (user) => {
        selectedUser = user;
      }
    );
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
</style>
