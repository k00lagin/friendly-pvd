<script>
	import Icon from '@common/Icon.svelte'
	import Input from '@common/Input.svelte'
	import Button from '@common/Button.svelte'
	export let value = '';
	export let name = '';
	let isPasswordClear = false;
</script>

<style>
	div {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}
</style>

<div>
<Input type={isPasswordClear?'text':'password'} bind:value={value} name={name} style="width:100%;"></Input>
<Button on:click={()=>isPasswordClear=!isPasswordClear} style="padding:0;width:24px;height:24px;margin-left:-30px">
	<Icon size="16px" type={isPasswordClear?'eye-off':'eye'}></Icon>
</Button>
</div>
