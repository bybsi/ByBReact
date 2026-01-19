import { BaseLoginForm } from './components/forms/BaseLoginForm';
import { UserDisplay } from './UserDisplay';
import { useAuth } from './hooks/AuthContext';

export function UserPanel() {
	const { user, isAuthenticated, authError, login, logout } = useAuth();

	return (
		<div className="byb-header-right">
			{isAuthenticated ? <UserDisplay /> : <BaseLoginForm />}
		</div>
	);
}

