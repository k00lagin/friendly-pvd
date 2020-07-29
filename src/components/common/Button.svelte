<script>
	export let style = '';
	export let type = 'button';
	export let primary;
</script>
<style>
	button {
		background-color: var(--background);
		border: 0;
		color: #dfdfdf;
		height: 40px;
		display: inline-flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		position: relative;
		border-radius: 2px;
	}
	button:hover,
	button:focus {
		background-color: var(--background-light);
	}
	button:active {
		background-color: var(--background-lighter);
	}
	button.primary {
		background-color: var(--primary);
	}
	button.primary:hover,
	button.primary:focus {
		background-color: var(--primary-light);
	}
	button.primary:active {
		background-color: var(--primary-lighter);
	}
</style>
<button on:click style={style} type={type} class:primary={primary}>
	<slot></slot>
</button>
