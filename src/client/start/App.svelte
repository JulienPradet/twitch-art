<script>
  import Timer from "./Timer.svelte";
</script>

<div class="container">
  <header>
    <h1>Début du stream</h1>
    <h2>Roi Patate</h2>
  </header>
  <Timer />
</div>

<style>
  .container {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  header {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: max-content;
    margin: 0 auto;
    margin-top: 2.5rem;
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 10rem;
    font-weight: 100;
    text-align: center;
    text-shadow: 0px 0px 10px rgba(140 220 246 / 80%),
      0px 0px 25px rgba(255 255 255 / 40%);
    background: #000;
  }

  h2 {
    position: relative;
    z-index: 1;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.5rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.8em;
    text-shadow: 0px 0px 10px rgba(140 220 246 / 50%),
      0px 0px 25px rgba(255 255 255 / 25%);
    background: #000;
    padding: 0 0.4em 0 1.1em;
  }
  header::after {
    content: "";
    position: absolute;
    height: 1px;
    background: #fff;
    left: 1em;
    right: 0.5em;
    margin-top: 12.9rem;
  }
</style>
