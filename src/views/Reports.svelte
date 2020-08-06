<script>
	import { pvd3route, serverUrl, me } from '@src/stores.js';
	import Button from '@common/Button.svelte';
	import Input from '@common/Input.svelte';
	import Icon from '@common/Icon.svelte';
	const XlsxPopulate = require('xlsx-populate');
	const path = require('path');
	const fs = require('fs');
	const { dialog } = require('electron').remote;
	let start = new Date().toISOString().split('T')[0], end = new Date().toISOString().split('T')[0];
	function handleSubmit(e) {
		e.preventDefault();
		let filePath = dialog.showSaveDialogSync({
			defaultPath: 'Сопроводительный реестр.xlsx',
			filters: [
				{ name: 'Таблицы Excel', extensions: ['xlsx'] }
			]
		});
		let url = `http://${$serverUrl}/api/rs/reports/execute`;
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				"file":"Сопроводительный реестр.jrd",
				"output":"csv",
				"params":[{
					"name":"start",
					"label":"Начало периода",
					"type":"DATE",
					"required":true,
					"value": Date.parse(start)
				},
				{
					"name":"end",
					"label":"Конец периода",
					"type":"DATE",
					"required":true,
					"value": Date.parse(end)
				}]
			})
		})
			.then(response => response.text())
			.then(csv => {
				XlsxPopulate.fromFileAsync(path.resolve(__dirname, './report.xlsx'))
				.then(workbook => {
					let csvbook = csv.split('\n').map(row => {
						row = row.split('"').map((fragment, index) => {
							return index % 2 ? fragment.split(',').join('') : fragment;
						}).join('');
						return row.split(',');
					});
					let sheet = workbook.sheet('Сопроводительный реестр');
					sheet.cell('A2').value(csvbook[1][0]);
					sheet.cell('B3').value($me.orgName);
					let workbookRow = 9;
					function setValue(cell, value) {
							sheet.cell(cell).value(value || '');
							sheet.cell(cell).style({borderStyle: 'thin', horizontalAlignment: 'center', verticalAlignment: 'center', fontSize: 9})
					}
					csvbook.forEach(row => {
						if (row && row[0] === $me.orgCode) {
							sheet.row(workbookRow).height(50);
							setValue(`A${workbookRow}`, row[3]);
							setValue(`B${workbookRow}`, row[4]);
							setValue(`C${workbookRow}`, row[6]);
							setValue(`D${workbookRow}`, row[7]);
							setValue(`E${workbookRow}`, row[8]);
							setValue(`F${workbookRow}`, row[9]);
							setValue(`G${workbookRow}`, row[10]);
							workbookRow++;
						}
					});

					function mergeSet(start, end, value) {
						let range = sheet.range(`${start}:${end}`);
						range.style({borderStyle: 'thin', horizontalAlignment: 'center', verticalAlignment: 'center', fontSize: 9})
						range.value(value || '');
						range.merged(true);
					}

					$pvd3route.forEach(step => {
						sheet.cell(`A${++workbookRow}`).style({borderStyle: 'thin'});
						mergeSet(`B${workbookRow}`, `D${workbookRow}`, 'Данные отправителя:');
						mergeSet(`E${workbookRow}`, `G${workbookRow}`, 'Данные получателя:');

						setValue(`A${++workbookRow}`, 'Организация');
						mergeSet(`B${workbookRow}`, `D${workbookRow}`, step.sender.orgName);
						mergeSet(`E${workbookRow}`, `G${workbookRow}`, step.reciever.orgName);

						setValue(`A${++workbookRow}`, 'Должность, ФИО, Подпись');
						mergeSet(`B${workbookRow}`, `D${workbookRow}`, `${step.sender.executive}, /_________________/`);
						mergeSet(`E${workbookRow}`, `G${workbookRow}`, `${step.reciever.executive}, /_________________/`);
						workbookRow++;
					});

					workbook.toFileAsync(filePath);
				});
			})
	}
	if (localStorage.pvd3_reciever_orgname && localStorage.pvd3_reciever_jobfio) {
		$pvd3route[0].reciever.executive = localStorage.pvd3_reciever_jobfio;
		$pvd3route[0].reciever.executive = localStorage.pvd3_reciever_orgname;
		localStorage.removeItem('pvd3_reciever_jobfio');
		localStorage.removeItem('pvd3_reciever_orgname');
	}
	if (!$pvd3route[0].sender.executive) {
		$pvd3route[0].sender.executive = `${$me.job}, ${$me.fioshort}`;
	}
	if (!$pvd3route[0].sender.orgName) {
		$pvd3route[0].sender.orgName = $me.orgName;
	}

	function addStep() {
		let lastIndex = $pvd3route.length - 1;
		$pvd3route.push({
			sender: {
				executive: lastIndex >= 0 ? $pvd3route[lastIndex].reciever.executive : `${$me.job}, ${$me.fioshort}`,
				orgName:  lastIndex >= 0 ? $pvd3route[lastIndex].reciever.orgName : $me.orgName
			},
			reciever: {
				executive: '',
				orgName: ''
			}
		});
		$pvd3route = $pvd3route;
	}
	function removeStep(e) {
		let index = Number(e.currentTarget.parentElement.getAttribute('data-index'));
		$pvd3route.splice(index, 1);
		$pvd3route = $pvd3route;
	}
</script>

<style>
	form {
		width: 820px;
		display: flex;
		flex-flow: row wrap;
	}
	form > label:first-child {
		margin-right: 20px;
	}
	.step-field {
		display: flex;
		flex-flow: column nowrap;
	}
	textarea {
		background-color: var(--background);
		border: 0;
		padding: 8px 16px;
		color: #EEE;
		font-family: inherit;
		font-size: inherit;
		resize: none;
		display: block;
		width: 100%;
	}
	textarea:focus {
		background-color: var(--background-light);
		outline: none;
	}
	h4 {
		width: 100%;
	}
	section {
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
	}
	.step {
		position: relative;
		padding: 16px;
		border-radius: 8px;
	}
	.step:hover {
		background-color: rgba(255, 255, 255, 0.03);
	}
	.step > div {
		width: calc(50% - 10px);
		margin-right: auto;
	}
	header {
		margin-bottom: 8px;
	}
	label {
		display: inline;
	}
</style>

<h3>Сопроводительный реестр</h3>
<form on:submit={handleSubmit}>
	<label>
		<span>От</span>
		<Input required type="date" bind:value={start}></Input>
	</label>
	<label>
		<span>До</span>
		<Input required type="date" bind:value={end}></Input>
	</label>

	<section>
		<h4>Маршрут</h4>
		{#each $pvd3route as step, index}
			<section class="step" data-index={index}>
				<Button on:click={removeStep} style="position:absolute;right:8px;top:8px;width:24px;height:24px;padding:0;">
					<Icon size="18px" type="close"></Icon>
				</Button>
				<div class="step-field">
					<header>
						<label for={`sender.executive.${index}`}>Должность и ФИО отправителя</label>
						{#if index === 0 && step.sender.executive !== `${$me.job}, ${$me.fioshort}`}
							<Button style="width:18px;height:18px;vertical-align:bottom;transform:translateX(5px)scale(1.2);padding:0;"
								title={`${$me.job}, ${$me.fioshort}`}
								on:click={()=>{step.sender.executive=`${$me.job}, ${$me.fioshort}`;}}>
								<Icon size="16px" type="restore"></Icon>
							</Button>
						{/if}
						{#if index > 0 && step.sender.executive !== $pvd3route[index - 1].reciever.executive}
							<Button style="width:18px;height:18px;vertical-align:bottom;transform:translateX(5px)scale(1.2);padding:0;"
								title={$pvd3route[index - 1].reciever.executive}
								on:click={()=>{step.sender.executive=$pvd3route[index - 1].reciever.executive;}}>
								<Icon size="16px" type="restore"></Icon>
							</Button>
						{/if}
					</header>
					<Input id={`sender.executive.${index}`} bind:value={step.sender.executive}></Input>
				</div>
				<div class="step-field">
					<header>
						<label for={`reciever.executive.${index}`}>Должность и ФИО получателя</label>
					</header>
					<Input id={`reciever.executive.${index}`} bind:value={step.reciever.executive} placeholder="Начальник управления, Иванов И.И."></Input>
				</div>
				<div class="step-field">
					<header style="margin-top:16px">
						<label for={`sender.orgName.${index}`}>Наименование организации отправителя</label>
						{#if index === 0 && step.sender.orgName !== $me.orgName}
							<Button style="width:18px;height:18px;vertical-align:bottom;transform:translateX(5px)scale(1.2);padding:0;"
								title={$me.orgName}
								on:click={()=>{step.sender.orgName=$me.orgName}}>
								<Icon size="16px" type="restore"></Icon>
							</Button>
						{/if}
						{#if index > 0 && step.sender.orgName !== $pvd3route[index - 1].reciever.orgName}
							<Button style="width:18px;height:18px;vertical-align:bottom;transform:translateX(5px)scale(1.2);padding:0;"
								title={$pvd3route[index - 1].reciever.orgName}
								on:click={()=>{step.sender.orgName=$pvd3route[index - 1].reciever.orgName}}>
								<Icon size="16px" type="restore"></Icon>
							</Button>
						{/if}
					</header>
					<textarea id={`sender.orgName.${index}`} rows="5" bind:value={step.sender.orgName}></textarea>
				</div>
				<div class="step-field">
					<header style="margin-top:16px">
						<label for={`reciever.orgName.${index}`}>Наименование организации получателя</label>
					</header>
					<textarea id={`reciever.orgName.${index}`} rows="5" bind:value={step.reciever.orgName} placeholder="Управление росреестра"></textarea>
				</div>
			</section>
		{/each}
		<Button on:click={addStep} style="width:32px;height:32px;border-radius:50%;">
			<Icon size="24" type="plus"></Icon>
		</Button>
	</section>

	<Button type="submit" primary style="margin-left:auto;">Скачать</Button>
</form>
