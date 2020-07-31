<script>
	import { me, serverUrl, users } from '@src/stores.js';
	import Checkbox from '@common/Checkbox.svelte';
	import Button from '@common/Button.svelte';
	import Icon from '@common/Icon.svelte';
	let showInactiveUsers = false;
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
	tr {
		height: 40px;
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
	td {
		padding: 0 8px;
	}
	.tool {
		padding: 0 2px;
	}
</style>

{#await $users}
	загрузка
{:then $users}
	<Checkbox bind:checked={showInactiveUsers}>Показывать архивные записи</Checkbox>
	<table>
		<tr class="header">
			<th>Логин</th>
			<th>ФИО</th>
			<th>Должность</th>
			<th>Роли</th>
			<th class="status"></th>
		</tr>
		{#each $users as user}
			{#if user.status === 'Актуальный' || showInactiveUsers}
				<tr>
					<td>{user.login}</td>
					<td>{`${user.surName} ${user.firstName} ${user.patronymic}`}</td>
					<td>{user.job}</td>
					<td>{user.roles}</td>
					<td class="tool">
						<Button aria-label="Редактировать" style="width:24px;height:24px;padding:0;" primary>
							<Icon size="16" type={'account-edit-outline'}></Icon>
						</Button>
					</td>
					<td class="tool">
						<Button style="width:24px;height:24px;padding:0;" primary>
							<Icon size="16" type={user.status === 'Актуальный' ? 'account-outline' : 'account-off-outline'}></Icon>
						</Button>
					</td>
				</tr>
			{/if}
		{/each}
	</table>
	<Button>Создать</Button>
{/await}
