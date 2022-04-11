<script>
  let input;
  let descriptiveVariableName = "";
  export function focus() {
    input.focus();
  }
</script>

<input bind:value={descriptiveVariableName} bind:this={input} />

<p>{descriptiveVariableName}!</p>
