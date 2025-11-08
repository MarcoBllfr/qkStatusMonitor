import type { RequestHandler } from './$types';
import services from '$static/services.json'; 

export const GET: RequestHandler = async () => {
	//add more logic 
	return new Response(JSON.stringify(services), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
