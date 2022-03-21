<script>
  import Nested from "./Nested.svelte";

  let name = "esraa";
  let count = 0;
  let menu = ["Cookies and cream", "Mint choc chip", "Raspberry ripple"];
  function incrementCount() {
    count += 1;
  }
  $: doubled = count * 2;
  $: if (doubled >= 10) {
    // alert("count is dangerously high!");
    //count = 9;
  }
  let numbers = [];
  let selected = {}
  function addNumber() {
    //   //normal push işlemi,
    // numbers.push(numbers.length + 1);
    // //otomatik görmeyeceği için
    // //Svelte's reactivity is triggered by assignments
    // numbers = numbers;
    //instead of
    numbers = [...numbers, numbers.length + 1];
  }
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  function showPosition(position) {
    //can not be tested,
    //todo
    console.log(
      "🚀 ~ file: App.svelte ~ line 31 ~ showPosition ~ position",
      position
    );
    console.log(
      "enlem" + position.coords.latitude,
      "boylarm:" + position.coords.longtitude
    );
  }
  function handleClick() {
    alert("no more alerts");
    // 		The full list of modifiers:

    // preventDefault — calls event.preventDefault() before running the handler. Useful for client-side form handling, for example.
    // stopPropagation — calls event.stopPropagation(), preventing the event reaching the next element
    // passive — improves scrolling performance on touch/wheel events (Svelte will add it automatically where it's safe to do so)
    // nonpassive — explicitly set passive: false
    // capture — fires the handler during the capture phase instead of the bubbling phase (MDN docs)
    // once — remove the handler after the first time it runs
    // self — only trigger handler if event.target is the element itself
    // trusted — only trigger handler if event.isTrusted is true. I.e. if the event is triggered by a user action.
  }
  function onSelected(value){
   console.log("🚀 ~ file: App.svelte ~ line 58 ~ onSelected ~ value", value)
	  
  }
</script>

<main>
  <h1>Hello {name.toUpperCase()}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>
  <Nested />
  <button on:click={incrementCount}>{count} doubled {doubled}</button>
  <input type="number" bind:value={count} min="0" max="10" />
  <button on:click={addNumber}>{numbers}</button>
  <button on:click|once={handleClick}> Click me </button>
  <button on:click={getLocation}>Show position</button>
  {#if count > 10}
    <p>{count} is greater than 10</p>
  {:else if 5 > count}
    <p>{count} is less than 5</p>
  {:else}
    <p>{count} is between 5 and 10</p>
  {/if}
  <h2>Flavours</h2>

  {#each menu as flavour}
    <label>
		<input type=radio bind:group={menu} name="scoops" value={1}>
      {flavour}
    </label>
  {/each}
  <select multiple bind:value={selected} on:change="{onSelected(selected)}">
	{#each menu as flavour}
		<option value={flavour}>
			{flavour}
		</option>
	{/each}
</select>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
