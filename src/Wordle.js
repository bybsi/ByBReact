import './Wordle.scss';

import { useState, useEffect, useCallback, useRef } from 'react';

const ROW_SIZE = 5;
const COL_SIZE = 5;

const GAME_NAME = "Wordle";

const GAME_STATE_INIT = 3;
const GAME_STATE_RUNNING = 0;
const GAME_STATE_WIN = 1;
const GAME_STATE_LOSE = 2;
const GAME_STATUS_TEXT = [
	"Guess!", "Win!", "Lose!", "Init!"
];
const TILE_CLASS_GRAY = 0;
const TILE_CLASS_YELLOW = 1;
const TILE_CLASS_GREEN = 2;
const TILE_CLASS_NONE = 3;
const TILE_CLASSES = ['cl-gray', 'cl-yellow', 'cl-green', ''];

const newGuessObj = () => ({guess:'', tileClass:Array(COL_SIZE).fill(TILE_CLASS_NONE)});

const finalizeGuess = (guessObj, answer, guesses) => {
	for (let col_idx = 0; col_idx < COL_SIZE; col_idx++) {
		if (guessObj.guess[col_idx] == answer[col_idx])
			guessObj.tileClass[col_idx] = TILE_CLASS_GREEN;
		else if (answer.indexOf(guessObj.guess[col_idx]) != -1)
			guessObj.tileClass[col_idx] = TILE_CLASS_YELLOW;
		else
			guessObj.tileClass[col_idx] = TILE_CLASS_GRAY;
	}

	guesses.push(guessObj);

	if (guessObj.guess == answer)
		return GAME_STATE_WIN;
	if (guesses.length == ROW_SIZE)
		return GAME_STATE_LOSE;
	
	return GAME_STATE_RUNNING;
}

export function Wordle( {win, lose} ) {
	const [word, setWord] = useState("");
	const [guesses, setGuesses] = useState([]);
	const [guess, setGuess] = useState(newGuessObj());
	const [gameState, setGameState] = useState(GAME_STATE_INIT);
	const guessRef = useRef(guess);
	const gameStateRef = useRef(gameState);
	const wordRef = useRef(word);
	const guessesRef = useRef(guesses);

	useEffect(() => {
		if (gameState != GAME_STATE_RUNNING) {
			fetch('/api/index.php?r=wordle_word', {})
				.then( response => {
					if (!response.ok)//response.status != 200)
						throw new Error("Could not load Wordle words.");
					return response.json();
				}).then ( data => {
					setWord(data.word);
					console.log(data.word);
				}).catch ( error => {
					console.log(error);
				});
			setGameState(GAME_STATE_RUNNING);
		}

		return () =>  {
			setGuesses([]);
			setGuess(newGuessObj());
		};
	}, [gameState]);

	useEffect(() => {
		guessRef.current = guess;
		gameStateRef.current = gameState;
		wordRef.current = word;
		guessesRef.current = guesses;
		if (gameState == GAME_STATE_WIN)
			win(GAME_NAME);
		else if (gameState == GAME_STATE_LOSE)
			lose(GAME_NAME);

	}, [guess, gameState, word, guesses]);

	const wordleHandler = useCallback((event) => {
		if (!event.key)
			return;

		if (gameStateRef.current != GAME_STATE_RUNNING) {
			console.log("Game is not running.");
			return;
		}

		let key = event.key.toLowerCase();
		const guessObj = guessRef.current;
		const word = wordRef.current;
		const guesses = guessesRef.current;
		if (key == 'enter' && guessObj.guess.length == COL_SIZE) {
			let result = finalizeGuess(guessObj, word, guesses);
			setGuesses(() => [...guesses]);
			setGuess(newGuessObj());
			setGameState(result);
		} else if (key == 'backspace' && guessObj.guess.length > 0) {
			setGuess(prev => ({...prev, guess:prev.guess.slice(0, -1)}));
		} else if (guessObj.guess.length < COL_SIZE && key.length == 1 && key >= 'a' && key <= 'z') {
			setGuess(prev => ({...prev, guess:prev.guess + key }));
		}
	}, [guess, gameState, word, guesses]);

	useEffect(() => {
		window.addEventListener('keydown', wordleHandler);
		return () => {
			window.removeEventListener('keydown', wordleHandler);
		}
	}, []);
	
	return (
		<Board guesses={guesses} guess={guess} />
	);
}

function Board({guesses, guess}) {
	// Fill the board with previous guesses.
	const lines = [...guesses];
	if (lines.length < ROW_SIZE) {
		// Don't add a blank guess if the grid is already filled.
		lines.push(guess);
		// Add blank guesses to complete the grid.
		for (let row_idx = lines.length; row_idx < ROW_SIZE; row_idx++) 
			lines.push(newGuessObj());
	}

	return (
		<div className="cl-board">
			{lines.map((guessObj, index) => (
				<Line 
					guessObj={guessObj} 
					key={`line-${index}`} 
				/>
			))}
		</div>
	);
}

function Line({guessObj}) {
	return (
		<div className="cl-line">
			{guessObj.tileClass.map( (cls, idx) => (
				<Tile
					text={guessObj.guess[idx] ?? ''}
					key={`letter-${idx}`}
					clsId={guessObj.tileClass[idx]}
				/>
			))}
		</div>
	);
}

function Tile ({text, clsId}) {
	return (
		<div className={`cl-tile ${TILE_CLASSES[clsId]}`}>{text}</div>
	);
}
