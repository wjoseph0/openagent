<script>
	import { currentUser, pb } from '$lib/pocketbase.js';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	if (browser && $currentUser) {
		goto('/app');
	}

	let email;
	let password;

	async function login() {
		await pb.collection('users').authWithPassword(email.toLowerCase(), password);
		goto('/app');
	}
</script>

<main class="container">
	<h1>Login</h1>
	<form on:submit|preventDefault={login}>
		<input type="email" placeholder="Email" bind:value={email} required />
		<input type="password" placeholder="Password" bind:value={password} required />
		<button type="submit">Login</button>
	</form>
</main>
