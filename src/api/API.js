import API_URL from './apiURL';
import auth from './authFunctions';

// Object with methods
const API = {
	get: (endpoint, isLoggedIn) => callFetch(endpoint, 'GET', null, isLoggedIn),
	post: (endpoint, data, isLoggedIn) => callFetch(endpoint, 'POST', data, isLoggedIn),
	put: (endpoint, data, isLoggedIn) => callFetch(endpoint, 'PUT', data, isLoggedIn),
	delete: (endpoint, isLoggedIn) => callFetch(endpoint, 'DELETE', null, isLoggedIn),
};

const callFetch = async (endpoint, method, data, isLoggedIn = false) => {
	const requestObj = {
		method: method,
		headers: { 'Content-Type': 'application/json' },
		...(data && { body: JSON.stringify(data) }),
		credentials: 'include',
	};
	const endpointAddress = `${API_URL}${endpoint}`;

	try {
		let response = await fetch(endpointAddress, requestObj);


		// Handle Response
		let result;
		if (response.status === 204) {
			result = null;
		} else {
			result = await response.json().catch(() => null);
			if (isLoggedIn && response.status === 401 && (result.message === 'Access token expired' || result.message === 'Access token missing')) {
				const refreshResponse = await auth.refresh();
				if (refreshResponse.isSuccess) {
					// Retry the original request after refreshing token
					response = await fetch(endpointAddress, requestObj);
					result = await response.json().catch(() => null);
				}else{
					await auth.logout('/login?sessionExpired=true');
				}
			}
		}

		if (response.ok) {
			return { isSuccess: true, result };
		} else {
			return {
				isSuccess: false,
				message: result && result.message || 'An error occurred',
				status: response.status,
			};
		}
	} catch (error) {
		return {
			isSuccess: false,
			message: `Error: ${error.message}`,
		};
	}
};

export default API;
