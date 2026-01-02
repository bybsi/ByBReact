import './GameArea.scss';
import { Wordle } from './Wordle';
import { TicTacNo } from './TicTacNo';
import { useReducer, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './hooks/AuthContext';
import { StatusContext } from './hooks/StatusContext';
import { localDataStore } from './utils/helpers';
/*
interface GameStatus {
	name: string,
	wins: number,
	losses: number
};
//const gameStatus : Arrray<GameStatus> = [];
const gameStatus : GameStatus[] = [
*/
const SAVE_WAIT_TIME = 10; // seconds

const initialGameStats = {
	'Wordle': {
		wins:0,
		losses:0
	},
	'TicTacNo': {
		wins: 0,
		losses: 0
	}
};

const prepareSaveData = (stats) => {
	return new URLSearchParams({
		wordle:stats.Wordle.wins + ':' + stats.Wordle.losses,
		tictacno:stats.TicTacNo.wins + ':' + stats.TicTacNo.losses
	});
};

const gsReducer = (state, action) => {
	let newStats = null;
	switch (action.type) {
		case "WIN":
			newStats = {
				...state, 
				[action.gameName]: { 
					wins:state[action.gameName].wins + 1, 
					losses:state[action.gameName].losses
				}
			};
			break;
		case "LOSE":
			newStats = {
				...state, 
				[action.gameName]: { 
					wins:state[action.gameName].wins, 
					losses:state[action.gameName].losses + 1
				}
			};
			break;
		default:
			return state;
	}
	saveStats(newStats);
	return newStats;
};

const LOCAL_STORAGE_KEY = 'bybGameStats';
const saveStats = (data) => {
	localDataStore.save(LOCAL_STORAGE_KEY, data);
};
const loadStats = () => {
	let stats = localDataStore.load(LOCAL_STORAGE_KEY);
	return stats ?? initialGameStats;
}

export function ByBGameArea() {
	
	const { updateStatus } = useContext(StatusContext);
	const [gameStats, dispatchGameStats] = useReducer(gsReducer, loadStats());

	const handleWin = (gameName) => {
		dispatchGameStats({type:"WIN", gameName:gameName});
		// Display winner message for 1000ms
		updateStatus('okay', "Winner!", 1000);
	};
	const handleLose = (gameName) => {
		dispatchGameStats({type:"LOSE", gameName:gameName});
		// Display loser message for 1000ms
		updateStatus('error', "Defeat!", 1000);
	};

	return (
		<div className="cl-game-area">
			<GameArea win={handleWin} lose={handleLose} />
			<GameStatusDisplay stats={gameStats} />
		</div>
	);
}

function GameStatusDisplay( { stats } ) {
	const { user, isAuthenticated, authError, login, logout } = useAuth();
	const { updateStatus } = useContext(StatusContext);
	const [saveReady, setSaveReady] = useState(true);

	useEffect( () => {
		if (saveReady == false)
			setTimeout(() => {
				setSaveReady(true);
			}, SAVE_WAIT_TIME * 1000);
	}, [saveReady]);

	const saveGameStats = () => {
		if (!saveReady) {
			updateStatus('error', `Please wait ${SAVE_WAIT_TIME} seconds`, 3000);
			return;
		}

		fetch('/api/index.php?r=save_game_stats', {
			method: 'POST',
			credentials: 'include',
			headers: {},
			body: prepareSaveData(stats)
		}).then( (response) => {
			if (!response.ok)
				throw new Error(`Could not save stats. ${response.status}`);
			return response.json();
		}).then ( (data) => {
			if (data.saved)
				updateStatus('okay', 'Saved.', 2000);
			else
				throw new Error(`could not save stats. ${data.error}`);
		}).catch( (err) => {
			updateStatus('error', err.message, 3000);
		});

		setSaveReady(false);
	};

	return (
		<div className="cl-game-status">
			<div className="cl-game-user"></div>
			{Object.keys(stats).map( ( gameName, idx ) => (
				<GameStats 
					key={`gn-${idx}`} 
					gameName={gameName}
					stats={stats[gameName]}
				/>
			))}
			{isAuthenticated && <button className="byb-button" onClick={saveGameStats}>Save</button>}
			<div className="cl-game-status-about">
				<ul>
					<li>Data is stored locally in the browser.</li>
					<li>To save data to the server, click save. (after logging in)</li>
				</ul>
			</div>
		</div>
	);
}

function GameStats( { gameName, stats } ) {
	return (
		<>
			<div className="cl-game-name">{gameName}</div>
			<div className="cl-stat-div">
				<span className="cl-stat-lbl">Wins:</span><span className="cl-stat-win">{stats.wins}</span>
			</div>
			<div className="cl-stat-div">
				<span className="cl-stat-lbl">Losses:</span><span className="cl-stat-lose">{stats.losses}</span>
			</div>
		</>
	);
}

function GameArea( {win, lose} ) {
	return (
		<div className="cl-game-area-grid">
			<div className="cl-game-board">
				<div className="cl-game-name">Wordle</div>
	            		<Wordle win={win} lose={lose}/>
				<div className="cl-game-about">
					<ul>
						<li>Type letters, then press enter to guess the word</li>
						<li>Correctly placed letters will be green</li>
						<li>Correct letters in the wrong place will be yellow</li>
						<li>You have 5 guesses</li>
						<li>Press F12 to cheat.</li>
					</ul>
				</div>
			</div>
			<div className="cl-game-board">
				<div className="cl-game-name">TicTacNo</div>
				<TicTacNo win={win} lose={lose}/>
				<div className="cl-game-about">
					<ul>
						<li>The computer isn't smart and only cheats <i>sometimes</i></li>
						<li>If you're not first, you're last</li>
					</ul>
				</div>
			</div>
			<div className="cl-game-board cl-1s2">
				<div className="cl-game-name">Data Structure ...coming soon.</div>
				<div />
				<div />
			</div>
		</div>
	);
}
