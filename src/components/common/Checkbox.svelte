<script>
	export let name = '';
	export let checked = false;
</script>

<label>
	<input type="checkbox" bind:checked={checked} name={name}>
	<slot></slot>
</label>
