<script>
  let current = "foo";
  let big = false;
  let bgOpacity = 0.5;
	$: color = bgOpacity < 0.6 ? '#000' : '#fff';
</script>

<div class="flex">
  <div>
    <button
      class:selected={current === "foo"}
      on:click={() => (current = "foo")}>foo</button
    >

    <button
      class={current === "bar" ? "selected" : ""}
      on:click={() => (current = "bar")}>bar</button
    >

    <button
      class={current === "baz" ? "selected" : ""}
      on:click={() => (current = "baz")}>baz</button
    >
  </div>
  <div>
    <label>
        <input type=checkbox bind:checked={big}>
        big
    </label>
    <div class:big>
        some {big ? 'big' : 'small'} text
    </div>
  </div>
  <div>
    <input type="range" min="0" max="1" step="0.1" bind:value={bgOpacity} />

    <p style:color 
	style:--opacity="{bgOpacity}">This is a paragraph.</p>
  </div>
  <div />
</div>

<style>
  button {
    display: block;
  }
  .flex {
      display: flex;
      justify-content: space-around;
  }
  .big {
		font-size: 4em;
	}

  .selected {
    background-color: #641f07;
    color: white;
  }
  p {
		font-family: "Comic Sans MS", cursive;
		background: rgba(255, 62, 0, var(--opacity));
	}
</style>
