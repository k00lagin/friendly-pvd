<script>
	import { pvd3RecieverOrgName, pvd3RecieverJobFio, serverUrl } from '../stores.js';
	import Button from '../components/common/Button.svelte';
	import Input from '../components/common/Input.svelte';
	const XlsxPopulate = require('xlsx-populate');
	const path = require('path');
	import { user } from '../stores.js';
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
					sheet.cell('B3').value($user.orgName);
					let workbookRow = 9;
					function setValue(cell, value) {
							sheet.cell(cell).value(value || '');
							sheet.cell(cell).style({borderStyle: 'thin', horizontalAlignment: 'center', verticalAlignment: 'center', fontSize: 9})
					}
					csvbook.forEach(row => {
						if (row && row[0] === $user.orgCode) {
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

					sheet.cell(`A${++workbookRow}`).style({borderStyle: 'thin'});
					mergeSet(`B${workbookRow}`, `D${workbookRow}`, 'Данные отправителя:');
					mergeSet(`E${workbookRow}`, `G${workbookRow}`, 'Данные получателя:');

					setValue(`A${++workbookRow}`, 'Организация');
					mergeSet(`B${workbookRow}`, `D${workbookRow}`, $user.orgName);
					mergeSet(`E${workbookRow}`, `G${workbookRow}`, $pvd3RecieverOrgName);

					setValue(`A${++workbookRow}`, 'Должность, ФИО, Подпись');
					mergeSet(`B${workbookRow}`, `D${workbookRow}`, `${$user.job}, ${$user.fioshort}, /_________________/`);
					mergeSet(`E${workbookRow}`, `G${workbookRow}`, `${$pvd3RecieverJobFio}, /_________________/`);

					workbook.toFileAsync(filePath);
				});
			})
	}
</script>

<style>
	form {
		width: 400px;
		display: flex;
		flex-flow: row wrap;
	}
	form > label:first-child {
		margin-right: auto;
	}
	label {
		display: flex;
		flex-flow: column nowrap;
	}
	label > span {
		margin-bottom: 8px;
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
		width: 400px;
	}
	textarea:focus {
		background-color: var(--background-light);
		outline: none;
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
	<label>
		<span>Наименование организации получателя</span>
		<textarea name="reciever-org-name" id="reciever-org-name" class="reciever-org-name" cols="30" rows="10" bind:value={$pvd3RecieverOrgName} placeholder="Управление росреестра"></textarea>
	</label>
	<label>
		<span>Должность и ФИО получателя</span>
		<textarea name="reciever-job-fio" id="reciever-job-fio" class="reciever-job-fio" cols="30" rows="10" bind:value={$pvd3RecieverJobFio} placeholder="Начальник управления, Иванов И.И."></textarea>
	</label>

	<Button type="submit" primary style="margin-left:auto;">Скачать</Button>
</form>
