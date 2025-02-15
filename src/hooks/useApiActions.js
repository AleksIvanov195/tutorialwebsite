import { useAuth } from './useAuth';
import API from '../api/API';
import toast from 'react-hot-toast';

const useApiActions = () => {
	const { authState } = useAuth();

	const handleApiCall = async (apiMethod, endpoint, data = null, showToast = true) => {
		const toastId = showToast ? toast.loading('Processing...') : null;
		const response = await apiMethod(endpoint, data, authState.isLoggedIn);

		if (showToast) {
			if (response.isSuccess) {
				toast.success('Request completed successfully!', { id: toastId });
			} else {
				toast.error(response.message || 'An error occurred.', { id: toastId });
			}
		}

		return response;
	};

	const post = async (endpoint, data, showToast = true) => handleApiCall(API.post, endpoint, data, showToast);
	const put = async (endpoint, data, showToast = true) => handleApiCall(API.put, endpoint, data, showToast);
	const deleteRequest = async (endpoint, showToast = true) => handleApiCall(API.delete, endpoint, null, showToast);

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