<script>
	import Icon from './common/Icon.svelte'
	import { me, route } from '@src/stores.js';
</script>

<style>
	nav {
		color: rgba(255,255,255,.65);
		background-color: var(--background);
		box-shadow: 0 2px 5px -2px rgba(0,0,0,0.5);
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
		<li on:click={()=>$route='my-profile'}>ПК ПВД3 {$me.fioshort}</li>
		<li class="active">
			<Icon type="file-table-outline" size="18px"></Icon>
			<span on:click={()=>$route='reports'}>Отчёты</span>
		</li>
		<!-- <li>Администрирование пользователей</li> -->
		<!-- chrome://dino -->
	</ul>
</nav>
