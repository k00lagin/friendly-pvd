<script>
	import { me, serverUrl, users, route } from '@src/stores.js';
	import Input from '@common/Input.svelte';
	import Password from '@common/Password.svelte';
	import Checkbox from '@common/Checkbox.svelte';
	import Button from '@common/Button.svelte';
	let userId = $route.split('/')[2];
	let userRoles = {};
	console.log($route);
	function getUser() {
		if (userId === 'me') {
			let user = $users.find(user => user.login === $me.login);
			if (user) {
				userId = user.id
			}
		}
		if (userId !== 'new') {
			let user = $users.filter(user => user.id === userId)[0];
			let roles = user.roles;
			user.roles = [];
			if (roles.indexOf('Администратор') >= 0) {
				user.roles.push('RS_ADMIN');
				userRoles.admin = true;
			}
			if (roles.indexOf('Руководитель офиса') >= 0) {
				user.roles.push('RS_MAN');
				userRoles.man = true;
			}
			if (roles.indexOf('Диспетчер') >= 0) {
				user.roles.push('RS_DISP');
				userRoles.disp = true;
			}
			if (roles.indexOf('Оператор приёма') >= 0) {
				user.roles.push('RS_RECEPTION');
				userRoles.reception = true;
			}
			if (roles.indexOf('Оператор выдачи') >= 0) {
				user.roles.push('RS_DELIVERY');
				userRoles.delivery = true;
			}
			if (roles.indexOf('Оператор сканирования') >= 0) {
				user.roles.push('RS_SCAN');
				userRoles.scan = true;
			}
			if (user.status === 'Актуальный') {
				user.status = 'ACTUAL'
			}
			if (user.status === 'Архивный') {
				user.status = 'ARCHIVE'
			}
			return user;
		}
		return {
			login: '',
			surName: '',
			firstName: '',
			patronymic: '',
			job: '',
			status: 'ACTUAL',
			roles: [],
			orgCode: $me.orgCode,
			orgName: $me.orgName,
			password: ''
		};
	}
	let user = getUser();

	function handleSubmit(e) {
		e.preventDefault();
		user.roles = [];
		if (userRoles.admin) {
			user.roles.push('RS_ADMIN');
		}
		if (userRoles.man) {
			user.roles.push('RS_MAN');
		}
		if (userRoles.disp) {
			user.roles.push('RS_DISP');
		}
		if (userRoles.reception) {
			user.roles.push('RS_RECEPTION');
		}
		if (userRoles.delivery) {
			user.roles.push('RS_DELIVERY');
		}
		if (userRoles.scan) {
			user.roles.push('RS_SCAN');
		}
		fetch(`http://${$serverUrl}/api/rs/managermia/user`, {
			method: (userId === 'new') ? 'PUT' : 'POST',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			body: JSON.stringify(user)
		})
	}
</script>

<style>
	form {
		width: 400px;
	}
	label {
		display: flex;
		flex-flow: column nowrap;
	}
</style>

{#await user}
	загрузка
{:then}
	<form>
		<label>
			Логин
			{#if userId === 'new'}
				<Input bind:value={user.login}></Input>
			{:else}
				<Input disabled value={user.login}></Input>
			{/if}
		</label>
		<label>
			Фамилия
			<Input bind:value={user.surName}></Input>
		</label>
		<label>
			Имя
			<Input bind:value={user.firstName}></Input>
		</label>
		<label>
			Отчество
			<Input bind:value={user.patronymic}></Input>
		</label>

		<label>
			Должность
			<Input bind:value={user.job}></Input>
		</label>

		<label>
			Роли
			{#if userId !== 'new'}
				{#if userRoles.admin}
					<Checkbox checked={userRoles.admin} disabled>Администратор</Checkbox>
				{/if}
				{#if userRoles.man}
					<Checkbox checked={userRoles.man} disabled>Руководитель офиса</Checkbox>
				{/if}
				{#if userRoles.disp}
					<Checkbox checked={userRoles.disp} disabled>Диспетчер</Checkbox>
				{/if}
			{/if}
			<Checkbox bind:checked={userRoles.reception}>Оператор приёма</Checkbox>
			<Checkbox bind:checked={userRoles.delivery}>Оператор выдачи</Checkbox>
			<Checkbox bind:checked={userRoles.scan}>Оператор сканирования</Checkbox>
		</label>

		<p>{user.orgCode} — {user.orgName}</p>

		{#if userId == 'new'}
			<label>
				Пароль
				<Password bind:value={user.password}></Password>
			</label>
		{/if}

		<Button on:click={handleSubmit}>Сохранить</Button>
	</form>
{/await}
