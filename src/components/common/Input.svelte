<script>
	export let type = 'text';
	export let value = '';
	export let name = '';
	let element;
	const textualTypes = new Set([
		'text',
		'password',
		'date',
		'datetime',
		'time',
		'email',
		'number',
		'search',
		'tel',
		'url',
		'week'
	]);
	function handleChange() {
		if (!textualTypes.has(type)) {
			value = element.value;
		}
	}
	function handleInput() {
		if (textualTypes.has(type)) {
			value = element.value;
		}
	}
</script>

<style>
	input {
		background-color: #272729;
		border: 0;
		padding: 8px 16px;
		color: #EEE;
		font-family: inherit;
		font-size: inherit;
	}
	input:focus {
		background-color: #444;
	}
</style>

{#if textualTypes.has(type)}
	<input type={type} value={value} name={name} on:input={handleInput} bind:this={element}>
{:else}
	<input type={type} value={value} name={name} on:change={handleChange} bind:this={element}>
{/if}
