<script>
  export let propValue;
  export let descriptiveVariableName = ''
</script>

<main>this is child
    <p>I'm taking this from the parent: {propValue}</p>
    <p>Child received props: {descriptiveVariableName}</p>
    <input bind:value="{descriptiveVariableName}"  />
</main>
