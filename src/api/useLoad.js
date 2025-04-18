import { useState, useEffect } from 'react';
import API from './API';
import { useAuth } from '../hooks/useAuth';

const useLoad = (endpoint, shouldLoad = true) =>{
	const { authState } = useAuth();
	// State ------------------------------------------------------
	const [records, setRecords] = useState([]);
	const [totalRecords, setTotalRecords] = useState(null); 
	const [loadingMessage, setLoadingMessage] = useState('Loading records...');
	const [isLoading, setIsLoading] = useState(true);
	// Methods ---------------------------------------------------
	const loadRecords = async () => {
		if (!shouldLoad) return;
		const response = await API.get(endpoint, authState.isLoggedIn);
		setIsLoading(false);
		if (response.isSuccess) {
			setRecords(response.result || []);
			setTotalRecords(response.totalRecords || null); 

		} else {
			setRecords([]);
			setLoadingMessage(response.message);
			setTotalRecords(null);
		}
	};

	// Run on component mount or endpoint change
	useEffect(() => {
		loadRecords();
	}, [endpoint]);

	// Return -------------------------------------------------------
	return [records, setRecords, loadingMessage, isLoading, loadRecords, totalRecords ];
};

export default useLoad;