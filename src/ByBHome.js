import './ByBHome.scss';

const githubIcon = '/images/icons/github.png';

const posts = [
	[
		"ByB React",
		"This page was built using React JS. More will be added to it over time. What can you do here?",
		[
			"Register (or use an existing thingbyb.com account)",
			"Login / Logout",
			"Play some simple react games",
		],
		"2025-12-30 20:00:47",
		[],
		false
	],
	[
		"ByB React Games",
		"Games list:",
		[
			"TicTacNo",
			"Wordle",
			"Data Structure (in development)"
		],
		"2025-12-30 20:00:47",
		[],
		false
	],
	[
		"ByB React Source Code",
		"The following React features are currently being used:",
		[		
			"useState, useEffect, useRef, usePortal, useReducer, useCallback, useContext",
			"Custom hooks",
			"Router",
			"Providers"
		],
		"2025-12-31 20:10:10",
		["https://github.com/bybsi/", "GitHub /bybsi/"],
		true
	]
];

export function ByBHome() {
	return (
		<div className="cl-home cl-layout-bricks">
			{posts.map((post, idx) => (
				<Post
					key={idx}
					title={post[0]}
					content={post[1]}
					list={post[2]}
					date={post[3]}
					link={post[4]}
					showGithub={post[5]}
				/>
			))}
		</div>
	);
}

function Post( {title, content, list, date, link, showGithub} ) {
	return (
		<div className="cl-post-container">
			<div className="cl-post-header">{showGithub && <a href="https://github.com/bybsi/" target="_blank"><img className="github_icon" src={githubIcon} /> </a>} {title}</div>
			<div className="cl-post-content">
				{link.length > 0 && <Link href={link[0]} text={link[1]} />}
				{content}
				<code><ul>
				{list.map((item, idx) => (<li key={idx}>{item}</li>))}
				</ul></code>
			</div>
			<div className="cl-post-footer">byb | {date}</div>
		</div>
	);
			
}

function Link( {href, text} ) {
	return (
		<><a href={href} target="_blank">{text}</a><br/></>
	);
}

