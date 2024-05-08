
import puppeteer from 'puppeteer';

export async function GET() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://www.google.com');
	// other actions...
	const html = await page.content();
	console.log(html);
	await browser.close();
	return new Response(`${html}`, { status: 200 });
}

