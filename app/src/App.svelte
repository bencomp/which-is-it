<script>
  let mySecretImage;
  import Card from "./lib/Card.svelte";
  let gameState = "home";
  let actions = [];
  let items = [
    {id: 1, image: "/vite.svg"},
    {id: 2, image: "/vite.svg"},
    {id: 3, image: "/vite.svg"},
    {id: 4, image: "/vite.svg"},
    {id: 5, image: "/vite.svg"},
    {id: 6, image: "/vite.svg"},
    {id: 7, image: "/vite.svg"},
    {id: 8, image: "/vite.svg"},
    {id: 9, image: "/vite.svg"},
    {id: 10, image: "/vite.svg"},
  ];
  function startGame() {
    gameState = "playing";
  }
  function handleToggle(event) {
    
    actions.push(event.detail);
    actions = actions;
  }
</script>

<main>
  <h1>Which is it?</h1>
  {#if gameState === "home"}
  <p>It's the game you know!</p>
  <button on:click={startGame}>Start the game!</button>
  {:else if gameState === "playing"}
  <div class="cards">
    {#each items as item (item.id)}
      <Card number={item.id} image={item.image} on:toggle={handleToggle} />
    {/each}
  </div>
  <ol>
    {#each actions as a}
      <li>You set image {a.number} to {a.active}</li>
    {/each}
  </ol>
  {/if}

</main>

<style>
  .cards {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
    justify-content: space-evenly;
    height: max-content;
  }
</style>
