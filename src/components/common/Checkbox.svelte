<script>
	export let name = '';
	export let checked = false;
</script>

<label>
	<input type="checkbox" bind:checked={checked}>
	<slot></slot>
</label>