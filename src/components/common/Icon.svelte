<script>
	export let type = '';
	export let size = '24px';
	export let fill = 'currentColor'
	let paths = {
		'close': 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
		'loading': 'M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z',
		'file-table-outline': 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,13H7V11H10V13M14,13H11V11H14V13M10,16H7V14H10V16M14,16H11V14H14V16M10,19H7V17H10V19M14,19H11V17H14V19Z'
	}
</script>

<style>
	@keyframes spin {
		100% {
			transform: rotate(360deg);
		}
	}
	.loading {
		animation: spin 1s linear infinite;
	}
</style>

<svg style="width:{size};height:{size}" viewBox="0 0 24 24" class:loading={type === 'loading'}>
	<path fill={fill} d={paths[type]}/>
</svg>
