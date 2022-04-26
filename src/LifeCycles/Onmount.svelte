<script>
  import { onMount } from "svelte";

  let photos = [];

  onMount(async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/photos?_limit=20`
    );
    photos = await res.json();
  });
</script>

<main>
  <h1>Photo album</h1>
  <div class="photos">
    {#each photos as photo}
      <figure>
        <img src={photo.thumbnailUrl} alt={photo.title} />
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

  figure,
  img {
    width: 100%;
    margin: 0;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
