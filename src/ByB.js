import { useState, useCallback } from 'react';
//import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { HashRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './ByB.scss';

import { Wordle } from './Wordle';
import { ByBHome } from './ByBHome';
import { ByBHeader } from './ByBHeader';
import { ByBGameArea } from './ByBGameArea';
import { AuthProvider } from './hooks/AuthContext';
import { StatusProvider } from './hooks/StatusContext';
import { SidLogin } from './components/SidLogin';

const logoSrc = "/images/logo_b.png";
const iconPath = "/images/icons";
const homeTitle = "React";

const fnNavClassName = ({isActive}) => (isActive ? "nav-item-icon nav-item-icon-on" : "nav-item-icon");
const navLinks = [
	{id:'gaming',label:'Games',element:<ByBGameArea/>},
];

function ByB() {
	const [headerTitle, setHeaderTitle] = useState(homeTitle);

	const updateHeaderTitle = useCallback((title) => {
		setHeaderTitle(prev => title);
	},[]);

	return (
<div className="byb">
	<Router>
		<nav>
			<div className="byb-left">
				<div className="byb-logo">
					<NavLink 
						to="/home"
						onClick={() => updateHeaderTitle(homeTitle)}>
						<img src={logoSrc}/>
					</NavLink>
				</div>
				<div className="byb-nav">
				{navLinks.map((link, idx) => {
					return (
					<NavLink 
						key={`nl_${idx}`} 
						to={`/${link.id}`} className={fnNavClassName}
						onClick={() => updateHeaderTitle(link.label)}>
						<img src={`${iconPath}/${link.id}.png`} alt={link.label} />
						<br />
						{link.label}
					</NavLink>
					)}
				)}
					<a href="https://github.com/bybsi/" target="_blank"><img src={`${iconPath}/code.png`} /> <br />Code</a>
				</div>
			</div>
		</nav>
		<div className="byb-content">
			<StatusProvider>
			<AuthProvider>
				<ByBHeader title={headerTitle} />
				<div className="byb-content-main">
					<Routes>
						<Route path="/home" element={<ByBHome />} />
						{navLinks.map(link => (
							<Route path={`/${link.id}`} element={link.element}/>
						))}
						{<Route path="*" element={<Navigate to="/home" replace />} />}
					</Routes>
				</div>
				<SidLogin />
			</AuthProvider>
			</StatusProvider>
		</div>
	</Router>
</div>
);
}

export default ByB;

