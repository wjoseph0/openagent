<script>
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	async function updateOfferRecord(p) {
		const data = {
			isSigned: true
		};
		await pb.collection('offers').update(`${p.template.external_id}`, data);
		goto('/app');
	}
</script>

<docuseal-form
	data-src="https://docuseal.co/d/{$page.params.template}"
	data-email={$page.params.email}
	on:completed={(e) => {
		console.log(e.detail);
		updateOfferRecord(e.detail);
	}}
>
</docuseal-form>
