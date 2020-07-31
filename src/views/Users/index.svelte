<script>
	import { me, serverUrl, users } from '@src/stores.js';
	async function loadUsers() {
		$users = await fetch('http://10.74.159.129/api/rs/managermia/user?page=0&size=1000')
		.then(response => response.json())
		.then(json => json.content.filter(user => user.orgCode && user.orgCode === $me.orgCode));
	}
	loadUsers();
</script>

<style>
	table {
		border-collapse: collapse;
	}
	tr:nth-child(2n) {
		background-color: var(--background);
	}
	tr:hover {
		background-color: var(--background-lighter);
	}
	td,tr {
		border: 0;
	}
	.active {
		background-color: ivory;
	}
</style>

{#await $users}
	загрузка
{:then $users}
	<table>
		<tr class="header">
			<th>Логин</th>
			<th>ФИО</th>
			<th>Должность</th>
			<th>Роли</th>
			<th class="status"></th>
		</tr>
		{#each $users as user}
			<tr>
				<td>{user.login}</td>
				<td>{`${user.surName} ${user.firstName} ${user.patronymic}`}</td>
				<td>{user.job}</td>
				<td>{user.roles}</td>
				<td class:active={user.status}></td>
			</tr>
		{/each}
	</table>
{/await}
