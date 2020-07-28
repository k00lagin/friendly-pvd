<script>
	import Button from '../components/common/Button.svelte';
	import Input from '../components/common/Input.svelte';
	const XlsxPopulate = require('xlsx-populate');
	const path = require('path');
	import { user } from '../stores.js';
	const fs = require('fs');
	const { dialog } = require('electron').remote;
	let start, end, recieverOrgName, recieverJobFio;
	function handleSubmit(e) {
		e.preventDefault();
		let filePath = dialog.showSaveDialogSync({
			defaultPath: 'Сопроводительный реестр.xlsx',
			filters: [
				{ name: 'Таблицы Excel', extensions: ['xlsx'] }
			]
		});
		let url = 'http://10.74.159.129/api/rs/reports/execute';
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

					mergeSet(`B${++workbookRow}`, `D${workbookRow}`, 'Данные отправителя:');
					mergeSet(`E${workbookRow}`, `G${workbookRow}`, 'Данные получателя:');

					sheet.cell(`A${++workbookRow}`).value('Организация');
					mergeSet(`B${workbookRow}`, `D${workbookRow}`, $user.orgName);
					mergeSet(`E${workbookRow}`, `G${workbookRow}`, recieverOrgName);

					sheet.cell(`A${++workbookRow}`).value('Должность, ФИО, Подпись');
					mergeSet(`B${workbookRow}`, `D${workbookRow}`, `${$user.job}, ${$user.fioshort}, /_________________/`);
					mergeSet(`E${workbookRow}`, `G${workbookRow}`, `${recieverJobFio}, /_________________/`);

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
		background-color: #272729;
		border: 0;
		padding: 8px 16px;
		color: #EEE;
		font-family: inherit;
		font-size: inherit;
		resize: none;
		display: block;
		width: 400px;
	}
</style>

<h3>Сопроводительный реестр</h3>
<form on:submit={handleSubmit}>
	<label>
		<span>От</span>
		<Input type="date" bind:value={start}></Input>
	</label>
	<label>
		<span>До</span>
		<Input type="date" bind:value={end}></Input>
	</label>
	<label>
		<span>Наименование организации получателя</span>
		<textarea name="reciever-org-name" id="reciever-org-name" class="reciever-org-name" cols="30" rows="10" bind:value={recieverOrgName} placeholder="Управление росреестра"></textarea>
	</label>
	<label>
		<span>Должность и ФИО получателя</span>
		<textarea name="reciever-job-fio" id="reciever-job-fio" class="reciever-job-fio" cols="30" rows="10" bind:value={recieverJobFio} placeholder="Начальник управления Иванов И.И."></textarea>
	</label>

	<Button type="submit" primary style="margin-left:auto;">Скачать</Button>
</form>
