<script>
	import Login from './views/Login.svelte';
	import Reports from './views/Reports.svelte';
	import MyProfile from './views/MyProfile.svelte';
	import Nav from './components/Nav.svelte';
	import { user, route } from './stores.js';
</script>

{#if $user.id}
<Nav></Nav>
{/if}

<main class:unauthorised={!$user.id}>
	{#if !$user.id}
		<Login></Login>

	{:else}
		{#if $route === 'reports'}
			<Reports></Reports>
		{:else if $route === 'my-profile'}
			<MyProfile></MyProfile>
		{/if}
	{/if}
</main>

<style>
	:global(body) {
		padding: 0;
		display: flex;
		flex-flow: row nowrap;
		background-color: var(--background-dark);
		color: #d0d7db;
	}
	main.unauthorised {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	main {
		flex-grow: 1;
		height: 100%;
	}
	main:not(.unauthorised) {
		padding-left: 24px;
	}
</style>
