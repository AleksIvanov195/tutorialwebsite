import { useState, useEffect } from 'react';
import API from './API';

const useLoad = (endpoint) =>{
	// State ------------------------------------------------------
	const [records, setRecords] = useState([]);
	const [loadingMessage, setLoadingMessage] = useState('Loading records...');
	const [isLoading, setIsLoading] = useState(true);
	// Methods ---------------------------------------------------
	const loadRecords = async () => {
		setIsLoading(true);
		const response = await API.get(endpoint);
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