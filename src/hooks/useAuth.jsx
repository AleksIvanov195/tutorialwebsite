import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/API';
import auth from '../api/authFunctions';
import PropTypes from 'prop-types';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	// Initilisation---------------------------------------------------
	// State-----------------------------------------------------------
	const [authState, setAuthState] = useState({ isLoggedIn: false, loading: true, role: null });

	const updateAuthState = (updates) => {
		setAuthState((prevState) => ({ ...prevState, ...updates }));
	};

	useEffect(() => {
		checkAuth();
	}, []);

	// Handlers--------------------------------------------------------
	const checkAuth = async () =>{
		try{
			updateAuthState({ loading: true });
			const response = await auth.checkAuth();
			if (response.isSuccess) {
				updateAuthState({ isLoggedIn: response.result.isLoggedIn, role: response.result.userType, loading: false });
			}else{
				updateAuthState({ isLoggedIn: false, role: null, loading: false });
			}
		}catch(error) {
			updateAuthState({ loading: false });
			console.log('Unexpected Error:', error);
		}
	};
	const logout = async () => {
		try{
			const response = await auth.logout('/');
			if (response.isSuccess) {
				updateAuthState({ isLoggedIn: false, role: null, loading: false });

			}
		}catch(error) {
			updateAuthState({ loading: false });
			console.log('Unexpected Error: ', error);
		}
	};
	const login = async (data) => {
		return await auth.login(data);
	};

	// View------------------------------------------------------------
	return (
		<AuthContext.Provider value={{ authState, checkAuth, logout, login }}>
			{children}
		</AuthContext.Provider>
	);
};


export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
	children: PropTypes.node,
};
