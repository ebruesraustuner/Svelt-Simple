<script>
	import { countCustom } from './stores.js';
</script>

<h1>The count is {$countCustom}</h1>

<button on:click={countCustom.increment}>+</button>
<button on:click={countCustom.decrement}>-</button>
<button on:click={countCustom.reset}>reset</button>