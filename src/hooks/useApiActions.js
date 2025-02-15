import { useAuth } from './useAuth';
import API from '../api/API';
import toast from 'react-hot-toast';

const useApiActions = () => {
	const { authState } = useAuth();

	const handleApiCall = async (apiMethod, endpoint, data = null) => {
		const toastId = toast.loading('Processing request...');
		const response = await apiMethod(endpoint, data, authState.isLoggedIn);

		if (response.isSuccess) {
			toast.success('Request completed successfully!', { id: toastId });
		} else {
			toast.error(response.message || 'An error occurred.', { id: toastId });
		}

		return response;
	};

	const post = async (endpoint, data) => handleApiCall(API.post, endpoint, data);
	const put = async (endpoint, data) => handleApiCall(API.put, endpoint, data);
	const deleteRequest = async (endpoint) => handleApiCall(API.delete, endpoint);

	// Batch API calls
	const batchRequests = async (requests) => {
		const toastId = toast.loading('Processing requests...');

		const responses = await Promise.all(requests);
		const success = responses.every(response => response.isSuccess);

		if (success) {
			toast.success('All requests completed successfully!', { id: toastId });
		} else {
			toast.error('Some requests failed', { id: toastId });
		}

		return responses;
	};

	return { post, put, delete: deleteRequest, batchRequests };
};

export default useApiActions;