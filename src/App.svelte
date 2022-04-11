<script>
  import Child from "./Child.svelte";
  import Keypad from "./Keypad.svelte";
  import Input from "./Input.svelte";
  import { onMount } from "svelte";
  let inputValue = "";
  let field;

  let pin = "";
  $: view = pin ? pin.replace(/\d(?!$)/g, "•") : "enter your pin";
  let photos = [];

  onMount(async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/photos?_limit=20`
    );
    photos = await res.json();
  });

  function handleSubmit(data) {
    console.log("🚀 ~ file: App.svelte ~ line 10 ~ handleSubmit ~ data", data);
    // alert('´submitted ${pin}´')
    console.log("submitted", { pin });
  }
</script>

<main>
  <!-- <Child propValue="Pass this to the child!" /> -->
  <!-- <Child bind:value="{inputValue}"  /> -->
  <!-- componentlerdeki instanceların kendilerini bağlayabilirz -->
  <!-- <Input bind:this={field}/>
  <button on:click="{() => field.focus()}">
    Focus field
  </button>
  <p>Input value is: {inputValue}</p>
  <h1 style="color: {pin ? '#333' : '#ccc'}">{view}</h1>
  <Keypad bind:value={pin} on:submit={handleSubmit} /> -->
  <h1>Photo album</h1>
  <div class="photos">
    {#each photos as photo}
    <figure>
      <img src={photo.thumbnailUrl} alt={photo.title}>
      <figcaption>{photos.title}</figcaption>
    </figure>
    {:else}
		<!-- this block renders when photos.length === 0 -->
		<p>loading...</p>
	{/each}

  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  .photos {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 8px;
	}

	figure, img {
		width: 100%;
		margin: 0;
	}

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
