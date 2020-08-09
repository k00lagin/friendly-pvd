<script>
	export let style = '';
	export let type = 'button';
	export let primary = false;
	export let danger = false;
	export let hollow = false;
	export let ariaLabel = '';
	export let title = '';
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
	button.danger {
		background-color: var(--danger);
	}
	button.danger:hover,
	button.danger:focus {
		background-color: var(--danger-light);
	}
	button.danger:active {
		background-color: var(--danger-lighter);
	}
	button.hollow {
		background-color: transparent;
		border: 1px solid currentColor;
	}
	button.hollow:hover,
	button.hollow:focus {
		color: var(--text-darkest);
	}
	button.hollow:active {
		color: var(--accent);
	}
</style>
<button on:click style={style} type={type} class:primary={primary} class:danger={danger} class:hollow={hollow} aria-label={ariaLabel} title={title}>
	<slot></slot>
</button>
