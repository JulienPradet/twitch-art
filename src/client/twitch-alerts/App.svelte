<script lang="ts">
  import Evolution from "./Evolution.svelte";
  import Alert from "./Alert.svelte";
  import {
    AlertClientData,
    ClientDataStore,
    UserClientData,
  } from "./ClientDataStore";

  export let dataStore: ClientDataStore;
  export let debug: boolean;

  function handleAlertEnd() {
    dataStore.deleteFirstAlert();
  }
</script>

<div class="page {debug ? 'page--debug' : ''}">
  {#if $dataStore.alerts.length > 0}
    {#key $dataStore.alerts[0].key}
      <Alert
        alert={$dataStore.alerts[0]}
        {debug}
        on:alertEnd={handleAlertEnd}
      />
    {/key}
  {/if}

  {#if !debug}
    <div class="container">
      <div class="description">
        Pour gagner de l'XP, n'hésitez pas à papoter dans le chat !
      </div>
      {#if $dataStore.lastUser !== null}
        {#key $dataStore.lastUser?.user.id + $dataStore.lastUser?.user.messageCount}
          <Evolution user={$dataStore.lastUser} />
        {/key}
      {/if}
    </div>
  {/if}
</div>

<style>
  .page--debug {
    background: #333;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .container {
    width: 100%;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.9) 0%,
      70%,
      rgba(0, 0, 0, 0) 100%
    );
    height: 130px;
    padding-bottom: 20px;
    padding-left: 20px;
    position: fixed;
    bottom: 0;
    color: #ddd;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    font-size: 1.3em;
  }

  .description {
    margin-bottom: 10px;
    font-size: 0.85em;
    font-weight: bold;
  }
</style>
