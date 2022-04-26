<script>
	import { count } from './stores.js';
	import Incrementer from './Incrementer.svelte';
	import Decrementer from './Decrementer.svelte';
	import Resetter from './Resetter.svelte';
    import { onDestroy } from 'svelte';
	let countValue;

    const unsubscribe = count.subscribe(value => {
	countValue = value;
});
onDestroy(unsubscribe);
</script>

<div>
Writable
<h1>The count is {$count}</h1>
</div>



<Incrementer/>
<Decrementer/>
<Resetter/>
