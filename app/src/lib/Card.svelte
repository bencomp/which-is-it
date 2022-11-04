<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let number;
  export let image;
  export let active = true;

  function handleClick(e) {
    console.log(e)
    //    e.srcElement.parentElement.classList.add("hide");
    active = !active;
    dispatch('toggle', {number: number, active: active})
  }
</script>

<figure class:active on:click={handleClick}>
  <img src={image} alt={number} />
  <figcaption>{number}</figcaption>
</figure>

<style>
  figure {
    flex-basis: content;
    flex-grow: 0;
  }
  
  figure img {
    border: solid 2px;
    width: 200px;
    height: 200px;
  }

  .active {
    box-shadow: red 1em 1em 1em;
  }

  figure {
    visibility:hidden;

  }

  figure.active {

    visibility:visible
  }

</style>
