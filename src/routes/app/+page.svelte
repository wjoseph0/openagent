<script>
	import { currentUser, pb } from '$lib/pocketbase.js';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { PDFDocument } from 'pdf-lib';
	import dayjs from 'dayjs';
	import numbro from 'numbro';
	import { onMount } from 'svelte';

	if (browser && !$currentUser) {
		goto('/auth/login');
	}

	let offers = [];

	onMount(async function () {
		offers = await pb.collection('offers').getFullList({
			sort: '-created'
		});
	});

	const usaStatesList = [
		'Alabama',
		'Alaska',
		'Arizona',
		'Arkansas',
		'California',
		'Colorado',
		'Connecticut',
		'Delaware',
		'Florida',
		'Georgia',
		'Hawaii',
		'Idaho',
		'Illinois',
		'Indiana',
		'Iowa',
		'Kansas',
		'Kentucky',
		'Louisiana',
		'Maine',
		'Maryland',
		'Massachusetts',
		'Michigan',
		'Minnesota',
		'Mississippi',
		'Missouri',
		'Montana',
		'Nebraska',
		'Nevada',
		'New Hampshire',
		'New Jersey',
		'New Mexico',
		'New York',
		'North Carolina',
		'North Dakota',
		'Ohio',
		'Oklahoma',
		'Oregon',
		'Pennsylvania',
		'Rhode Island',
		'South Carolina',
		'South Dakota',
		'Tennessee',
		'Texas',
		'Utah',
		'Vermont',
		'Virginia',
		'Washington',
		'West Virginia',
		'Wisconsin',
		'Wyoming'
	];

	let buyerName;
	let propertyType;
	let propertyAddress;
	let earnestMoney;
	let purchasePrice;
	let propertyState;
	let preApprovalFileInput = [];

	async function createOffer() {
		const templateUrl = 'Residential-Purchase-and-Sale-Agreement-Template.pdf';
		const templatePdfBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());
		const offerDoc = await PDFDocument.load(templatePdfBytes);
		const offerForm = offerDoc.getForm();
		const fields = offerForm.getFields();
		fields.forEach((field) => {
			const type = field.constructor.name;
			const name = field.getName();
			console.log(`${type}: ${name}`);
			if (type === 'PDFRadioGroup2') {
				const options = field.getOptions();
				console.log(`Radio Group options: ${options}`);
			}
		});

		// PAGE ONE

		const creationDate = offerForm.getTextField('Creation Date');
		creationDate.setText(`${dayjs().format('MM/DD/YYYY')}`);

		const buyerNameField = offerForm.getTextField('Buyer Name');
		buyerNameField.setText(buyerName);

		const propertyTypeField = offerForm.getRadioGroup('Property Type');
		propertyTypeField.select(propertyType);

		const propertyAddressField = offerForm.getTextField('Property Address');
		propertyAddressField.setText(propertyAddress);

		const earnestMoneyField = offerForm.getTextField('Earnest Money Deposit');
		earnestMoneyField.setText(numbro(earnestMoney).format({ thousandSeparated: true }));

		const depositDateField = offerForm.getTextField('Deposit Date');
		depositDateField.setText(`${dayjs().add(7, 'day').format('MM/DD/YYYY')}`);

		const depositTimeField = offerForm.getTextField('Deposit Time');
		depositTimeField.setText('11:59');

		const depositAMPMField = offerForm.getRadioGroup('Deposit Time (AM/PM)');
		depositAMPMField.select('PM');

		const depositAccountField = offerForm.getRadioGroup('Earnest Money: IS / IS NOT');
		depositAccountField.select('IS');

		// PAGE TWO

		const purchasePriceField = offerForm.getTextField('Purchase Price (Numerically)');
		purchasePriceField.setText(numbro(purchasePrice).format({ thousandSeparated: true }));

		const purchaseTermsField = offerForm.getRadioGroup('Purchase Terms');
		purchaseTermsField.select('Bank Financing');

		const financingTypeField = offerForm.getRadioGroup('Type of Financing');
		financingTypeField.select('Conventional Loan');

		const financingApprovalLetterField = offerForm.getTextField('Letter Due Date');
		financingApprovalLetterField.setText(`${dayjs().add(7, 'day').format('MM/DD/YYYY')}`);

		const financingContingentOnSaleField = offerForm.getRadioGroup('Loan Approval: IS / IS NOT');
		financingContingentOnSaleField.select('IS NOT');

		const terminationDaysField = offerForm.getTextField('Termination Days');
		terminationDaysField.setText('3');

		// PAGE THREE

		const offerContingentOnSaleField = offerForm.getRadioGroup('Sale of Property');
		offerContingentOnSaleField.select('SHALL NOT');

		const closingCostsField = offerForm.getRadioGroup('Closing Costs');
		closingCostsField.select('Buyer');

		const closingDateField = offerForm.getTextField('Closing Date');
		closingDateField.setText(`${dayjs().add(30, 'day').format('MM/DD/YYYY')}`);

		const closingTimeField = offerForm.getTextField('Closing Time');
		closingTimeField.setText('10:00');

		const closingTimeAMPMField = offerForm.getRadioGroup('Closing (AM/PM)');
		closingTimeAMPMField.select('AM');

		// PAGE FOUR

		const surveyNoticeField = offerForm.getTextField('Survey Notice');
		surveyNoticeField.setText('10');

		const remedyDaysField = offerForm.getTextField('Remedy Days');
		remedyDaysField.setText('10');

		const titleSearchNoticeField = offerForm.getTextField('Title Search Report Notice');
		titleSearchNoticeField.setText('3');

		const titleSearchRemedyField = offerForm.getTextField('Title Search Report Seller Days');
		titleSearchRemedyField.setText('5');

		// PAGE FIVE

		const inspectionDeadlineField = offerForm.getTextField('Inspection Deadline');
		inspectionDeadlineField.setText(`${dayjs().add(13, 'day').format('MM/DD/YYYY')}`);

		const inspectionDeadlineTimeField = offerForm.getTextField('Inspection Deadine Time');
		inspectionDeadlineTimeField.setText('11:59');

		const inspectionDeadlineTimeAMPMField = offerForm.getRadioGroup('Inspection (AM/PM)');
		inspectionDeadlineTimeAMPMField.select('PM');

		const inspectionDisclosuresDeadlineField = offerForm.getTextField('Disclosures Deadline');
		inspectionDisclosuresDeadlineField.setText(`${dayjs().add(15, 'day').format('MM/DD/YYYY')}`);

		const inspectionDisclosuresDeadlineTimeField = offerForm.getTextField(
			'Disclosures Deadline Time'
		);
		inspectionDisclosuresDeadlineTimeField.setText('11:59');

		const inspectionDisclosuresDeadlineTimeAMPMField =
			offerForm.getRadioGroup('Disclosures (AM/PM)');
		inspectionDisclosuresDeadlineTimeAMPMField.select('PM');

		const daysToAgreementField = offerForm.getTextField('Days to Reach Agreement');
		daysToAgreementField.setText('5');

		const appraisalContingencyField = offerForm.getRadioGroup('Appraisal');
		appraisalContingencyField.select('SHALL');

		const daysToNegociateField = offerForm.getTextField('Days to Re-negotiate');
		daysToNegociateField.setText('5');

		const daysToRefundEarnestMoneyField = offerForm.getTextField('Days to Refund Earnest Money');
		daysToRefundEarnestMoneyField.setText('5');

		// PAGE SEVEN

		const governingState = offerForm.getTextField('Governing State');
		governingState.setText(propertyState);

		const offerExpirationDate = offerForm.getTextField('Offer Expiration Date');
		offerExpirationDate.setText(`${dayjs().add(5, 'day').format('MM/DD/YYYY')}`);

		const offerExpirationTime = offerForm.getTextField('Offer Expiration Time');
		offerExpirationTime.setText('11:59');

		const offerExpirationTimeAMPM = offerForm.getRadioGroup('Copy of Agreement (AM/PM)');
		offerExpirationTimeAMPM.select('PM');

		// PAGE EIGHT

		const anyAdditionalDisclosuresRadio = offerForm.getRadioGroup('Disclosures (Check one)');
		anyAdditionalDisclosuresRadio.select('NO Disclosures / Addendums');

		// Attaching pre-approval letter

		if (preApprovalFileInput.length >= 1) {
			anyAdditionalDisclosuresRadio.select('NO Disclosures/Addendums');
			const disclosuresCheckboxTwo = offerForm.getCheckBox('Disclosures Check (2)');
			disclosuresCheckboxTwo.check();
			const disclosuresFieldTwo = offerForm.getTextField('Additional Form (2)');
			disclosuresFieldTwo.setText('Lender Pre-Approval Letter');

			const preApprovalFileUrl = URL.createObjectURL(preApprovalFileInput[0]);
			const preApprovalFileBytes = await fetch(preApprovalFileUrl).then((res) => res.arrayBuffer());
			const preApproval = await PDFDocument.load(preApprovalFileBytes);
			const preApprovalPages = await offerDoc.copyPages(preApproval, preApproval.getPageIndices());
			preApprovalPages.forEach((page) => offerDoc.addPage(page));
		}

		//

		const offer = await offerDoc.save();
		const blob = new Blob([offer], { type: 'application/pdf' });

		const data = {
			user: $currentUser.id,
			title: propertyAddress,
			offer: blob
		};

		await pb.collection('offers').create(data);
		// const blobUrl = URL.createObjectURL(blob);
		// window.open(blobUrl);
		// URL.revokeObjectURL(blobUrl);
	}

	async function viewFile(file) {
		const fileToken = await pb.files.getToken();
		const url = pb.files.getUrl(file, file.offer, { token: fileToken });
		window.open(url);
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

<main>
	<form on:submit={createOffer}>
		<h1>Offer Generator</h1>
		<input type="text" placeholder="Buyer Name" bind:value={buyerName} />

		<select bind:value={propertyType}>
			<option value="Single-Family" selected>Single-Family</option>
			<option value="Condominium">Condominium</option>
			<option value="PUD">Planned Unit Development</option>
			<option value="Duplex">Duplex</option>
			<option value="Triplex">Triplex</option>
			<option value="Fourplex">Fourplex</option>
		</select>

		<input type="text" placeholder="Property Street Address" bind:value={propertyAddress} />

		<select bind:value={propertyState}>
			<option value="" selected>-- Property State --</option>
			{#each usaStatesList as state}
				<option value={state}>{state}</option>
			{/each}
		</select>
		<input type="number" placeholder="Earnest Money Amount" bind:value={earnestMoney} />

		<input type="number" placeholder="Purchase Price" bind:value={purchasePrice} />

		<p>Pre-Approval Letter Upload</p>
		<input type="file" bind:files={preApprovalFileInput} />

		<br />
		<button type="submit">Generate Offer</button>
	</form>

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
