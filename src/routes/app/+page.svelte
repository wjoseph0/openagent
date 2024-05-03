<script>
	import { currentUser, pb } from '$lib/pocketbase.js';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import NewOfferForm from '$lib/components/newOfferForm.svelte';

	if (browser && !$currentUser) {
		goto('/auth/login');
	}

	let offers = [];

	onMount(async function () {
		offers = await pb.collection('offers').getFullList({
			sort: '-created'
		});
	});

	async function viewFile(offer) {
		if (offer.isSigned) {
			window.open(offer.submissionPage);
		} else {
			const fileToken = await pb.files.getToken();
			const url = pb.files.getUrl(offer, offer.offer, { token: fileToken });
			window.open(url);
		}
	}

	async function signOffer(offer) {
		const fileToken = await pb.files.getToken();
		const offerUrl = pb.files.getUrl(offer, offer.offer, { token: fileToken });
		const res = await pb.send('/createDocusealTemplate', {
			method: 'POST',
			body: { offerUrl: `${offerUrl}`, offerId: `${offer.id}`, offerTitle: `${offer.title}` }
		});
		goto(`/app/sign/${res.slug}/${$currentUser.email}`);
	}
</script>

{#if $currentUser}
	<main class="container">
		<NewOfferForm />
		<h1>My Offers</h1>
		<table>
			<tr>
				<th>Title</th>
				<th>Signed</th>
				<th>Actions</th>
			</tr>
			{#each offers as offer}
				<tr>
					<td>{offer.title}</td>
					<td>{offer.isSigned}</td>
					<td>
						<button on:click={viewFile(offer)}>View and Download</button>
						{#if !offer.isSigned}
							<button on:click={signOffer(offer)}>View and Sign</button>
						{/if}
					</td>
				</tr>
			{/each}
		</table>
	</main>
{/if}
