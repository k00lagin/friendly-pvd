<script>
	import Icon from './common/Icon.svelte'
	import { user } from "../stores.js";
</script>

<style>
	nav {
		color: rgba(255,255,255,.65);
		background: #272729;
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
		background-color: #161618;
	}
</style>

<nav>
	<ul>
		<li>ПК ПВД3 {$user.fioshort}</li>
		<li class="active">
			<Icon type="file-table-outline" size="18px"></Icon>
			<span>Отчёты</span>

		</li>
		<!-- <li>Администрирование пользователей</li> -->
	</ul>
</nav>
