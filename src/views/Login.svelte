<script>
	import { me, serverUrl, users , pvd3UserLogin, pvd3UserPassword } from '@src/stores.js';
	import Button from '@common/Button.svelte';
	import Input from '@common/Input.svelte';
	import Password from '@common/Password.svelte';
	import Checkbox from '@common/Checkbox.svelte';
	let form, rememberMe = false, login = $pvd3UserLogin, password = $pvd3UserPassword;

	// let guessServer = false;
	// let knownServers = [
	// 	'10.74.159.127',
	// 	'10.74.159.128',
	// 	'10.74.159.129',
	// 	'10.74.159.130',
	// 	'10.74.159.131'
	// ];
	// let availableServers = (() => {
	// 	let servers = [];
	// 	knownServers.forEach(ip => {
	// 		fetch(`http://${ip}`).then(response => {
	// 			if (response.ok) {
	// 				servers.push(ip);
	// 			}
	// 		})
	// 	});
	// 	console.log(servers);
	// 	return servers;
	// })();
	function handleSubmit(e) {
		e.preventDefault();
		let url = `http://${$serverUrl}/api/rs/login`;
		if (rememberMe) {
			$pvd3UserLogin = login;
			$pvd3UserPassword = password;
		}
		fetch(url, {
			method: 'POST',
			body: new FormData(document.querySelector('.pvd3-login-form'))
		}).then(response => response.json())
			.then(async data => {
				$me = data;
				$users = await fetch(`http://${$serverUrl}/api/rs/managermia/user?page=0&size=1000`)
				.then(response => response.json())
				.then(json => json.content.filter(user => user.orgCode && user.orgCode === $me.orgCode));
			})
	}
</script>

<style>
	form {
		display: flex;
		flex-flow: column nowrap;
		width: 300px;
	}
	label {
		display: flex;
		flex-flow: column nowrap;
		margin: 8px 0;
	}
	label > span {
		margin-bottom: 4px;
	}
</style>

<form class="pvd3-login-form" on:submit={handleSubmit} bind:this={form}>
	Вход в ПВД3:
	<label>
		<span>Логин</span>
		<Input type="text" name="username" bind:value={login}></Input>
	</label>
	<label>
		<span>Пароль</span>
		<Password name="password" bind:value={password}></Password>
	</label>
	<Checkbox bind:checked={rememberMe}>Запомнить меня</Checkbox>
	<!-- <Checkbox bind:checked={guessServer}>Автоматически определить сервер</Checkbox> -->
	<!-- {#if !guessServer} -->
	<label>
		<span>IP адрес сервера</span>
		<Input name="server" bind:value={$serverUrl}></Input>
	</label>
	<!-- {/if} -->
	<Button type="submit">Войти</Button>
	<Input type="hidden" name="commit" value="Войти"></Input>
	<Input type="hidden" name="redirect" value="http://{$serverUrl}/api/rs/manager/user"></Input>
</form>
