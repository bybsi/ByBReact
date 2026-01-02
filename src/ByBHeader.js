import { UserPanel } from './UserPanel';
import { StatusDisplay } from './StatusDisplay';

export function ByBHeader({ title }) {

	return (
<div className="byb-header">
	<div className="byb-header-left">
		ByB {title? '-':''} {title}
	</div>
	<StatusDisplay />
	<UserPanel />
</div>
);
}

