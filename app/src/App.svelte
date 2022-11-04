<script>
  import * as Model from "./model.js";
  import Card from "./lib/Card.svelte";
  let gameState = "home";
  let mySecretImage;
  let actions = [];
  
  var items = null;

  function startGame() {
    Model.getItems(function(_items){
      console.log(items);
      items = _items;    
      gameState = "playing";
    })
  }
  
  function handleToggle(event) {
    //  actions.push(event.detail);
    // actions = actions;
  
    let annotation = {
       "@context": "http://www.w3.org/ns/anno.jsonld",                                                                                                               
      "id": "https://w3id.org/whichisit/annotation/#"+Math.floor(Math.random()*100000),                                                                                                                           
       "type": "Annotation",                                                                                                                                     
        "bodyValue": "hoipipelepoi",                                                                                                                         
       "target": event.detail.number
    }

    console.log(event);
  }

    function reset(event){
      let figures = document.getElementsByTagName("figure");
      for(let i=0;i++;i<figures.length-1){
               figures[i].classList.add("active");
      }

      console.log(figures)
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
   <label for="fname">vraag</label>
<input on:click={reset} type="text" id="vraag" name="vraag"> 
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
