<script>
  import Child from "./Child.svelte";
  import Keypad from "./Keypad.svelte";
  import Input from "./Input.svelte";
  import Onmount from "./LifeCycles/Onmount.svelte";
  import BeforeAfterUpdate from "./LifeCycles/BeforeAfterUpdate.svelte"
  import Tick from "./LifeCycles/Tick.svelte"
  import Writable from "./Stores/Writable.svelte"
  import Readable from "./Stores/Readable.svelte"
  import Derived from "./Stores/Derived.svelte"
  import CustomStores from "./Stores/CustomStores.svelte"
  import Bindings from "./Stores/Bindings.svelte"
  import Tweened from "./Motion/Tweened.svelte"
  import Spring from "./Motion/Spring.svelte"
  import Transitions from "./Transitions/TransitionDirective.svelte"
  import Local from "./Transitions/LocalTransitions.svelte"
  import Deferred from "./Transitions/DeferredTransitions.svelte"
  import KeyBlocks from "./Transitions/keyBlocks.svelte"
  import Directive from "./Actions/Directive.svelte"
  import Class from "./Styling/Class.svelte"
  import Slots from "./ComponentComposition/Slots.svelte"
  import NamedSlots from "./ComponentComposition/NamedSlots.svelte"
  import Checking from "./ComponentComposition/CheckingSlotContent.svelte"
  import SlotProps from "./ComponentComposition/SlotProps.svelte"
import Self from "./SpecialElements/svelte-self/Self.svelte"
import Component from "./SpecialElements/svelte-component/Component.svelte"
import Window from "./SpecialElements/Window.svelte"
import BodyEl from "./SpecialElements/BodyEl.svelte"
import Options from "./SpecialElements/svelte-options/Options.svelte"

  let inputValue = "";
  let field;

  let pin = "";
  $: view = pin ? pin.replace(/\d(?!$)/g, "•") : "enter your pin";
  let photos = [];
  let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};

  function handleSubmit(data) {
    console.log("🚀 ~ file: App.svelte ~ line 10 ~ handleSubmit ~ data", data);
    // alert('´submitted ${pin}´')
    console.log("submitted", { pin });
  }
  import { onMount } from 'svelte';

let characters = ['🥳', '🎉', '✨'];

let confetti = new Array(100).fill()
  .map((_, i) => {
    return {
      character: characters[i % characters.length],
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      r: 0.1 + Math.random() * 1
    };
  })
  .sort((a, b) => a.r - b.r);

onMount(() => {
  let frame;

  function loop() {
    frame = requestAnimationFrame(loop);

    confetti = confetti.map(emoji => {
      emoji.y += 0.7 * emoji.r;
      if (emoji.y > 120) emoji.y = -20;
      return emoji;
    });
  }

  loop();

  return () => cancelAnimationFrame(frame);
});
</script>

<main>
  <input bind:value={user.firstname}>
<input bind:value={user.lastname}>

{(console.log(user), '')}

<h1>Hello {user.firstname}! Console u direk kullanabiliyorum :D</h1>

{#each confetti as c}
	<span style="left: {c.x}%; top: {c.y}%; transform: scale({c.r})">{c.character}</span>
{/each}
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
  <!-- <Onmount /> -->
  <!-- <BeforeAfterUpdate /> -->
  <!-- <Tick /> -->
  <!-- <Writable /> -->
  <!-- <Readable />
  <Derived /> -->
  <!-- <CustomStores /> -->
<!-- <Bindings /> -->
<!-- <Tweened /> -->
<!-- <Spring /> -->
<!-- <Transitions /> -->
<!-- <Local /> -->
<!-- <Deferred /> -->
<!-- <KeyBlocks /> -->
<!-- <Directive /> -->
<!-- <Class /> -->
<!-- <Slots /> -->
<!-- <NamedSlots /> -->
<!-- <Checking /> -->
<!-- <SlotProps /> -->
<!-- <Self /> -->
<!-- <Component /> -->
<!-- <Window /> -->
<!-- <BodyEl /> -->
<!-- <Options /> -->
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
  :global(body) {
		overflow: hidden;
	}

	span {
		position: absolute;
		font-size: 5vw;
		user-select: none;
	}
</style>
