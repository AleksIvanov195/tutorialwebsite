import API_URL from './apiURL';


// Object with methods

const API = {
	get: (endpoint) => callFetch(endpoint, 'GET', null),
	post: (endpoint, data) => callFetch(endpoint, 'POST', data),
	put: (endpoint, data) => callFetch(endpoint, 'PUT', data),
	delete: (endpoint) => callFetch(endpoint, 'DELETE', null),
};

const callFetch = async (endpoint, method, data) => {
	// Build Request Object
	const requestObj = {
		method: method,
		headers: { 'Content-Type': 'application/json' },
		...(data && { body: JSON.stringify(data) }),
	};

	const endpointAddress = `${API_URL}${endpoint}`;

	try{
		const response = await fetch(endpointAddress, requestObj);

		// Handle Response
		let result;
		if (response.status === 204) {
			result = null;
		} else{
			// In case data cannot be parsed as JSON
			result = await response.json().catch(() => null);
		}

		if (response.ok) {
			return { isSuccess: true, result };
		} else{
			return{
				isSuccess: false,
				message: result && result.message || 'An error occurred',
				status: response.status,
			};
		}
	} catch(error) {
		return {
			isSuccess: false,
			message: `Error: ${error.message}`,
		};
	}
};

export default API;