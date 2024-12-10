import API_URL from './apiURL';

const auth = {
	refresh: () => refresh(),
	login: (data) => login(data),
	logout: (redirectLocation) => logout(redirectLocation),
	checkAuth: () => checkAuth(),
};
const login = async (data) => {
	try {
		const response = await fetch(`${API_URL}/users/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			credentials: 'include',
		});
		const result = await response.json();
		if (response.ok) {
			return { isSuccess: true, result };
		} else {
			return { isSuccess: false, message: result.message || 'Unable to login' };
		}
	} catch (error) {
		return {
			isSuccess: false,
			message: `Error: ${error.message}`,
		};
	}
};
const refresh = async () => {
	try {
		const response = await fetch(`${API_URL}/users/refresh`, {
			method: 'POST',
			credentials: 'include',
		});
		const result = await response.json();
		if (response.ok) {
			return { isSuccess: true, result };
		} else {
			return { isSuccess: false, message: result.message || 'Unable to refresh token' };
		}
	} catch (error) {
		return {
			isSuccess: false,
			message: `Error: ${error.message}`,
		};
	}
};

const logout = async (redirectLocation) => {
	try {
		const response = await fetch(`${API_URL}/users/logout`, {
			method: 'POST',
			credentials: 'include',
		});
		if (response.ok) {
			window.location.href = redirectLocation;
			return { isSuccess: true };

		} else {
			console.log('Failed to log out:');
		}
	} catch (error) {
		console.log('Error during logout:', error);
	}
};
const checkAuth = async () => {
	try {
		const response = await fetch(`${API_URL}/users/checkAuth`, {
			method: 'POST',
			credentials: 'include',
		});
		const result = await response.json().catch(() => null);
		if (response.ok) {
			return { isSuccess: true, result };
		} else {
			return {
				isSuccess: false,
				message: { isSuccess: false, message: result.message },
				status: response.status,
			};
		}
	} catch (error) {
		return {
			isSuccess: false,
			message: 'Unexpected error', error,
		};
	}
};

export default auth;
