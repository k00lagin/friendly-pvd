<script>
	import { me, serverUrl } from '@src/stores.js';
	import Button from '../components/common/Button.svelte';
	import Input from '../components/common/Input.svelte';
</script>

<label>
	Логин
	<Input value={$me.login}></Input>
</label>
<label>
	Фамилия
	<Input value={$me.surName}></Input>
</label>
<label>
	Имя
	<Input value={$me.firstName}></Input>
</label>
<label>
	Отчество
	<Input value={$me.patronymic}></Input>
</label>
<label>
	Должность
	<Input value={$me.job}></Input>
</label>
<label>
	Организация
	<Input value={`${$me.orgCode} ${$me.orgName}`}></Input>
</label>
<label>
	Доступные ТОСПы
</label>
<label>
	Доступные роли
	<Input value={$me.roles}></Input>
</label>
<label>
	Пароль
</label>
