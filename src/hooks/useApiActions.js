import { useAuth } from './useAuth';
import API from '../api/API';
import toast from 'react-hot-toast';

const useApiActions = () => {
	const { authState } = useAuth();


	const handleApiCall = async (apiMethod, endpoint, data = null, options = {}) => {
		const { showToast = true, successMessage = 'Request completed successfully!', errorMessage = 'An error occurred.' } = options;

		const toastId = showToast ? toast.loading('Processing...') : null;
		const response = await apiMethod(endpoint, data, authState.isLoggedIn);

		if (showToast) {
			if (response.isSuccess) {
				toast.success(successMessage, { id: toastId });
			} else {
				toast.error(response.message + ' ' + errorMessage, { id: toastId });
			}
		}

		return response;
	};

	const post = async (endpoint, data, options = {}) => handleApiCall(API.post, endpoint, data, options);
	const put = async (endpoint, data, options = {}) => handleApiCall(API.put, endpoint, data, options);
	const deleteRequest = async (endpoint, options = {}) => handleApiCall(API.delete, endpoint, null, options);

	// Batch API calls
	const batchRequests = async (requests, options = {}) => {
		const { showToast = true, successMessage = 'All requests completed successfully!', errorMessage = 'Some requests failed.' } = options;
		const toastId = showToast ? toast.loading('Processing requests...') : null;

		const responses = await Promise.all(requests);
		const success = responses.every(response => response.isSuccess);

		if (showToast) {
			if (success) {
				toast.success(successMessage, { id: toastId });
			} else {
				toast.error(errorMessage, { id: toastId });
			}
		}

		return responses;
	};

	return { post, put, delete: deleteRequest, batchRequests };
};

export default useApiActions;