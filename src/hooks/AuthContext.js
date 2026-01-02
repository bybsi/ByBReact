import { useState, useEffect, createContext, useContext } from 'react';
import { StatusContext } from './StatusContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	const { updateStatus } = useContext(StatusContext);
	
	const login = async (username, password, sid_login = false) => {
		updateStatus('alert', 'Logging in...');
		try {
			const data = sid_login ?
				new URLSearchParams({sid_login:''}) :
				new URLSearchParams({
					login_username:username,
					login_password:password,
					//csrf_token:csrfToken
				});
				
			const response = await fetch('/actions/login_react.php', {
				method: 'POST',
				credentials: 'include',
				headers: {},
				body: data
			});
			const user = await response.json();
			if (!!user.error) {
				updateStatus('error', user.error);
				return;
			}
			updateStatus('okay', 'Logged in!', 1250);
			setUser({
				displayName:user.display_name,
				contactData:user.contact_data,
				userId:user.user_id,
				userName:user.username
			});
		} catch (err) {
			updateStatus('hidden', '');
			console.log(err.message);
		} finally {
		}
	};

	const logout = async () => {
		updateStatus('alert', 'Logging out...');
		try {
			const response = await fetch('/actions/logout.php', {
				// TODO POST + csrf
				method: 'GET',
				credentials: 'include',
				headers: {},
			});
			if (response.status == 200)
				setUser(null);
		} catch (err) {
			console.log(err);
		} finally {
			updateStatus('hidden', '');
		}
	};

	const isAuthenticated = !!user;

	return (
		<AuthContext.Provider value={{ user, setUser, isAuthenticated, error, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

