<script>
	import { me, serverUrl, pvd3UserLogin, pvd3UserPassword } from '@src/stores.js';
	import Button from '../components/common/Button.svelte';
	import Input from '../components/common/Input.svelte';
	import Checkbox from '../components/common/Checkbox.svelte';
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
			.then(data => {
				$me = data;
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
	}
</style>

<form class="pvd3-login-form" on:submit={handleSubmit} bind:this={form}>
	Вход в ПВД3:
	<label>
		Логин
		<Input type="text" name="username" bind:value={login}></Input>
	</label>
	<label>
		Пароль
		<Input type="password" name="password" bind:value={password}></Input>
	</label>
	<Checkbox bind:checked={rememberMe}>Запомнить меня</Checkbox>
	<!-- <Checkbox bind:checked={guessServer}>Автоматически определить сервер</Checkbox> -->
	<!-- {#if !guessServer} -->
	<label>
		IP адрес сервера
		<Input name="server" bind:value={$serverUrl}></Input>
	</label>
	<!-- {/if} -->
	<Button type="submit">Войти</Button>
	<Input type="hidden" name="commit" value="Войти"></Input>
	<Input type="hidden" name="redirect" value="http://{$serverUrl}/api/rs/manager/user"></Input>
</form>
