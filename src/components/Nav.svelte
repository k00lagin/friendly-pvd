<script>
	import Icon from '@common/Icon.svelte'
	import { me, route } from '@src/stores.js';
</script>

<style>
	nav {
		color: rgba(255,255,255,.65);
		background-color: var(--background);
		box-shadow: 0 2px 5px -2px rgba(0,0,0,0.5);
		flex-shrink: 0;
	}
	ul {
		list-style: none;
		display: flex;
		flex-flow: column nowrap;
		margin: 0;
		padding: 0;
	}
	li {
		display: flex;
		flex-flow: row nowrap;
		height: 40px;
		margin: 4px 0;
		padding: 0 16px;
		align-items: center;
		cursor: default;
	}
	li:hover:not(:active) {
		background-image: linear-gradient(0, rgba(255,255,255,0.05), rgba(255,255,255,0.05));
	}
	li > span {
		margin-left: 10px;
	}
	li.active {
		color: #fff;
		background-color: var(--background-light);
	}
</style>

<nav>
	<ul>
		<li on:click={()=>$route='users/edit/me'}>ПК ПВД3 {$me.fioshort}</li>
		<li class="active" class:active={$route=='reports'} on:click={()=>$route='reports'}>
			<Icon type="file-table-outline" size="18px"></Icon>
			<span>Отчёты</span>
		</li>
		{#if $me.job.toLowerCase().indexOf('программист') >= 0}
			<li class:active={$route=='users'} on:click={()=>$route='users'}>
				<Icon type="account-group-outline" size="18px"></Icon>
				<span>Пользователи</span>
			</li>
		{/if}
	</ul>
</nav>
