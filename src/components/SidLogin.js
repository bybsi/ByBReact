import { useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';

export function SidLogin() {
	const { user, isAuthenticated, authError, login, logout } = useAuth();
	
	useEffect(() => {
		// Login if the user already has an active session.
		login('','',true);
	}, []);

}
