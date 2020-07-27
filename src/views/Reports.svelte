<script>
	import Button from '../components/common/Button.svelte';
	import Input from '../components/common/Input.svelte';
	// import XlsxPopulate from 'xlsx-populate';
	const XlsxPopulate = require('xlsx-populate');
	import { user } from '../stores.js';
	const fs = require('fs');
	const { dialog } = require('electron').remote;
	let start, end;
	function handleSubmit(e) {
		e.preventDefault();
		let path = dialog.showSaveDialogSync({
			defaultPath: 'Сопроводительный реестр.xlsx',
			filters: [
				{ name: 'Таблицы Excel', extensions: ['xlsx'] }
			]
		})
		console.log(path);
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
				}
				// },
				// {
				// 	"name":"orgCode",
				// 	"label":"Код организации",
				// 	"type":"STRING",
				// 	"required":true,
				// 	"value": $user.orgCode
				// }
			]
			})
		})
			// .then(response => response.blob())
			// .then(blob => XlsxPopulate.fromDataAsync(blob))
			// .then(workbook => console.log(workbook))

			// .then(response => response.arrayBuffer())
			// .then(buffer => XlsxPopulate.fromDataAsync(buffer))
			// .then(workbook => console.log(workbook));

			.then(response => response.text())
			.then(csv => {
				XlsxPopulate.fromFileAsync('report.xlsx')
				.then(workbook => {
					let csvbook = csv.split('\n').map(row => {
						row = row.split('"').reduce((build = '', current) => {
							if (build.endsWith('“')) {
								return build + current + '”'
							}
							else {
								return build + current + '“'
							}
						});
						while (row.match(/(?<=“[^”]+),(?=[^“]+”)/)) {
							row = row.replace(/(?<=“[^”]+),(?=[^“]+”)/,';');
						}
						return row.split(',');
					});
					workbook.sheet('Сопроводительный реестр').cell('B3').value(csvbook[2][1]);
					let sheet = workbook.sheet('Сопроводительный реестр');
					let workbookRow = 8;
					csvbook.forEach(row => {
						if (row && row[0] === $user.orgCode) {
							sheet.cell(`A${workbookRow}`).value(row[0] || '');
							sheet.cell(`B${workbookRow}`).value(row[1] || '');
							sheet.cell(`C${workbookRow}`).value(row[3] || '');
							sheet.cell(`D${workbookRow}`).value(row[4] || '');
							sheet.cell(`E${workbookRow}`).value(row[6] || '');
							sheet.cell(`F${workbookRow}`).value(row[7] || '');
							sheet.cell(`G${workbookRow}`).value(row[8] || '');
							sheet.cell(`H${workbookRow}`).value(row[9] || '');
							sheet.cell(`I${workbookRow}`).value(row[10] || '');
							workbookRow++;
						}
					});
					workbook.toFileAsync(path);
				});
			})
	}
</script>

<h3>Сопроводительный реестр</h3>
<form on:submit={handleSubmit}>
	<Input type="date" bind:value={start}></Input>
	<Input type="date" bind:value={end}></Input>
	<Button type="submit" primary>Скачать</Button>
</form>
