import { useState, useEffect } from 'react';
import API from './API';
import { useAuth } from '../hooks/useAuth';

const useLoad = (endpoint) =>{
	const { authState } = useAuth();
	// State ------------------------------------------------------
	const [records, setRecords] = useState([]);
	const [loadingMessage, setLoadingMessage] = useState('Loading records...');
	const [isLoading, setIsLoading] = useState(true);
	// Methods ---------------------------------------------------
	const loadRecords = async () => {
		const response = await API.get(endpoint, authState.isLoggedIn);
		setIsLoading(false);
		if (response.isSuccess) {
			setRecords(response.result || []);

		} else {
			setRecords([]);
			setLoadingMessage(response.message);
		}
	};

	// Run on component mount or endpoint change
	useEffect(() => {
		loadRecords();
	}, [endpoint]);

	// Return -------------------------------------------------------
	return [records, setRecords, loadingMessage, isLoading, loadRecords];
};

export default useLoad;