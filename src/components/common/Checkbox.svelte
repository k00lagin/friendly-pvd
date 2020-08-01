<script>
	import Icon from '@common/Icon.svelte';
	export let name = '';
	export let checked = false;
</script>

<label>
	<input type="checkbox" bind:checked={checked} name={name} class="visually-hidden">
	<Icon size="18" type={checked?'checkbox-outline':'checkbox-blank-outline'} style="vertical-align: sub;"></Icon>
	<slot></slot>
</label>
