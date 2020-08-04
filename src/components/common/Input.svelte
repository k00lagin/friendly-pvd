<script>
	export let type = 'text';
	export let value = '';
	export let name = '';
	export let style = '';
	export let required = false;
	export let disabled = false;
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
		background-color: var(--background);
		border: 0;
		padding: 8px 16px;
		color: #EEE;
		font-family: inherit;
		font-size: inherit;
	}
	input:focus {
		background-color: var(--background-light);
		outline: none;
	}
</style>

{#if textualTypes.has(type)}
	<input style={style} type={type} value={value} name={name} on:input={handleInput} bind:this={element} required={required} disabled={disabled}>
{:else}
	<input style={style} type={type} value={value} name={name} on:change={handleChange} bind:this={element} required={required} disabled={disabled}>
{/if}
