import { useAuth } from './useAuth';
import API from '../api/API';

const useApiActions = () => {
	const { authState } = useAuth();

	const post = async (endpoint, data) => {
		return await API.post(endpoint, data, authState.isLoggedIn);
	};

	const put = async (endpoint, data) => {
		return await API.put(endpoint, data, authState.isLoggedIn);
	};

	const deleteRequest = async (endpoint) => {
		return await API.delete(endpoint, authState.isLoggedIn);
	};

	return { post, put, delete: deleteRequest };
};

export default useApiActions;