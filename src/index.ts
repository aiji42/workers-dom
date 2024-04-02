import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';

export interface Env {}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const target = url.searchParams.get('url');
		if (!target) return new Response('url is required', { status: 400 });

		const html = await fetch(target).then((res) => res.text());
		const { document } = parseHTML(html);

		const reader = new Readability(document);
		const article = reader.parse();
		if (!article) return new Response('failed to parse article', { status: 500 });

		console.log(article);
		return Response.json(article);
	},
};
