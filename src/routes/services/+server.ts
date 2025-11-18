import type { RequestHandler } from './$types';
import services from '$static/services.json';

async function checkService(service: { id: string; name: string; url: string; description?: string }): Promise<ServiceProps> {
	const startTime = Date.now();
	
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 9000); 
		
		const response = await fetch(service.url, {
			method: 'HEAD',
			signal: controller.signal
		});
		
		clearTimeout(timeoutId);
		const responseTime = Date.now() - startTime;
		
		let status: Status;
		if (response.ok) {
			status = 'ok';
		} else if (response.status >= 500) {
			status = 'down';
		} else {
			status = 'ping';
		}
		
		return {
			name: service.name,
			description: service.description,
			status,
			responseTime,
			lastChecked: new Date().toISOString()
		};
	} catch (error) {
		const responseTime = Date.now() - startTime;
		return {
			name: service.name,
			description: service.description,
			status: 'down',
			responseTime,
			lastChecked: new Date().toISOString()
		};
	}
}

export const GET: RequestHandler = async () => {
	
	const checkedServices = await Promise.all(
		services.map(service => checkService(service))
	);
	
	return new Response(JSON.stringify(checkedServices), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};