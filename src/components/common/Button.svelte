<style>
	button {
		background-color: #272729;
		border: 0;
		color: #dfdfdf;
		height: 40px;
	}
	button:hover,
	button:focus {
		background-color: #555558;
	}
</style>
<button on:click>
	<slot></slot>
</button>
