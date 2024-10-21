import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	// Initilisation---------------------------------------------------
	// State-----------------------------------------------------------
	const [loggedInUser, setLoggedInUser] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Retrieve user from session storage on load
		const storedUser = sessionStorage.getItem('loggedInUser');
		if (storedUser) {
			setLoggedInUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);
	// Handlers--------------------------------------------------------

	const login = (user) => {
		sessionStorage.setItem('loggedInUser', JSON.stringify(user));
		setLoggedInUser(user);
		setLoading(false);
		console.log(user);
	};

	const logout = () => {
		sessionStorage.removeItem('loggedInUser');
		setLoggedInUser(null);
	};

	// View------------------------------------------------------------
	return (
		<AuthContext.Provider value={{ loggedInUser, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
	children: PropTypes.node,
};
