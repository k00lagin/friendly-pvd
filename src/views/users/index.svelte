<script>
	import { me, serverUrl, users, route } from '@src/stores.js';
	import Checkbox from '@common/Checkbox.svelte';
	import Button from '@common/Button.svelte';
	import Icon from '@common/Icon.svelte';
	let showInactiveUsers = false;
	async function loadUsers() {
		$users = await fetch(`http://${$serverUrl}/api/rs/managermia/user?page=0&size=1000`)
		.then(response => response.json())
		.then(json => json.content.filter(user => user.orgCode && user.orgCode === $me.orgCode));
	}
	loadUsers();
</script>

<style>
	table {
		border-collapse: collapse;
	}
	th {
		padding: 16px;
		padding-bottom: 32px;
		position: relative;
	}
	th::after {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 54px;
		background-color: var(--background);
		z-index: -1;
	}
	tr:not(.header) {
		border-top: 2px solid transparent;
		border-bottom: 2px solid transparent;
		border-radius: 4px;
	}
	tr:not(.header):hover {
		background-color: var(--background);
	}
	td {
		padding: 8px;
		max-width: 300px;
		box-sizing: border-box;
	}
	td:first-child {
		padding-left: 16px;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
	}
	td:last-child {
		padding-right: 16px;
		border-bottom-right-radius: 4px;
		border-top-right-radius: 4px;
	}
</style>

{#await $users}
	загрузка
{:then}
	<Checkbox bind:checked={showInactiveUsers}>Показывать архивные записи</Checkbox>
	<table>
		<tr class="header">
			<th></th>
			<th>Логин</th>
			<th>ФИО</th>
			<th>Должность</th>
			<th>Роли</th>
			<th class="status"></th>
		</tr>
		{#each $users as user (user.id)}
			{#if user.status === 'Актуальный' || showInactiveUsers}
				<tr>
					<td class="tool">
						<Button ariaLabel="Редактировать" style="width:24px;height:24px;padding:0;" hollow on:click={()=> $route=`users/edit/${user.id}`}>
							<Icon size="16" type={'account-edit-outline'}></Icon>
						</Button>
					</td>
					<td>{user.login}</td>
					<td>{`${user.surName} ${user.firstName} ${user.patronymic}`}</td>
					<td>{user.job}</td>
					<td>{user.roles.split(',').join(', ').replace(/(Оператор)(?:\s)([а-яё]+)\,?\s?(?:Оператор\s([а-яё]+)\,?\s?)?(?:Оператор\s([а-яё]+))?/, (match, p1, p2, p3, p4) => {
						return `${p1} ${p2}` + (p3 ? (`/${p3}` + (p4 ? `/${p4}` : '')) : '')
					})}</td>
					<td class="tool">
						{#if $me.login !== user.login}
							<Button style="width:24px;height:24px;padding:0;" danger={user.status === 'Актуальный'} primary={user.status !== 'Актуальный'}>
								<Icon size="16" type={user.status === 'Актуальный' ? 'delete' : 'delete-restore'}></Icon>
							</Button>
						{/if}
					</td>
				</tr>
			{/if}
		{/each}
	</table>
	<Button on:click={()=> $route=`users/edit/new`}>Создать</Button>
{/await}
