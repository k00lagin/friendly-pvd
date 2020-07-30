<script>
	import { user, serverUrl } from '../stores.js';
	import Button from '../components/common/Button.svelte';
	import Input from '../components/common/Input.svelte';
</script>

<label>
	Логин
	<Input value={$user.login}></Input>
</label>
<label>
	Фамилия
	<Input value={$user.surName}></Input>
</label>
<label>
	Имя
	<Input value={$user.firstName}></Input>
</label>
<label>
	Отчество
	<Input value={$user.patronymic}></Input>
</label>
<label>
	Должность
	<Input value={$user.job}></Input>
</label>
<label>
	Организация
	<Input value={`${$user.orgCode} ${$user.orgName}`}></Input>
</label>
<label>
	Доступные ТОСПы
</label>
<label>
	Доступные роли
	<Input value={$user.roles}></Input>
</label>
<label>
	Пароль
</label>
