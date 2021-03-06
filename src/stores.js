import { writable } from 'svelte/store';

export function persistent(key, initialValue) {
	const store = writable(initialValue)
	const {subscribe, set} = store
	const json = localStorage.getItem(key)

	if (json) {
		set(JSON.parse(json))
	}

	return {
		set(value) {
			localStorage.setItem(key, JSON.stringify(value))
			set(value)
		},
		update(cb) {
			const value = cb(get(store))
			this.set(value)
		},
		subscribe
	}
}

export let serverUrl = persistent('pvd3_server_ip', '10.74.159.129');
export let pvd3UserLogin = persistent('pvd3_user_login', '');
export let pvd3UserPassword = persistent('pvd3_user_password', '');

export let pvd3route = persistent('pvd3_route', [{
	sender: {
		executive: '',
		orgName: ''
	},
	reciever: {
		executive: '',
		orgName: ''
	}
}]);

// export let pvd3RecieverOrgName = persistent('pvd3_reciever_orgname', '');
// export let pvd3RecieverJobFio = persistent('pvd3_reciever_jobfio', '');

export const me = writable({});
export let route = writable('reports');
export const users = writable([]);
