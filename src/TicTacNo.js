/*
TODO:
	Use a tree structure.

	1   2   3
	4   5   6
	7   8   9

	1->right = 2     5->right = 6     3->diag  = 5
	1->down  = 4     5->down  = 8     3->down  = 6
	1->diag  = 5     5->diag  = 9     3->right = null

	node {
		length_O;
		length_X;
		right;
		down;
		diag;
		player_ch; // ('O'||'X')
	}

*/
import './TicTacNo.scss';
import { useState, useRef, useCallback, useEffect } from 'react';

const winConditions = [
	[0, 1, 2], [3, 4, 5],
	[6, 7, 8], [0, 3, 6],
	[1, 4, 7], [2, 5, 8],
	[0, 4, 8], [2, 4, 6]
];

const GAME_NAME = "TicTacNo";

const GAME_STATE_RUNNING = 0;
const GAME_STATE_WIN = 1;
const GAME_STATE_LOSE = 2;

const PLAYER_LETTER = 0;
const COMPUTER_LETTER = 1;
const LETTERS = ['X', 'O'];

const BOARD_SIZE = 9;
const newBoard = () => {
	let board = new Array(BOARD_SIZE).fill('');
	return board;
};

const CHEAT_FREQUENCY = 25;

// This is the "No" in "TicTacNo"
// Sometimes the computer always wins.
const rollForCheats = () => Math.floor(Math.random() * 100) >= CHEAT_FREQUENCY ? true : false;

const validateBoard = (board) => {
	for (let i = 0; i < winConditions.length; i++) {
		let letter = board[winConditions[i][0]];
		if (letter != '' &&
			board[winConditions[i][1]] == letter &&
			board[winConditions[i][2]] == letter) {
			return letter;
		}
	}
	return '';
};

const computerMove = (board, isCheater) => {
	// Computer is not smart, but can cheat.
	let availableMoves = [];
	for (let i = 0; i < board.length; i++)
		if (board[i] == '')
			availableMoves.push(i);
	board[availableMoves[Math.floor(Math.random() * availableMoves.length)]] 
		= LETTERS[COMPUTER_LETTER];
	if (isCheater && Math.random() >= CHEAT_FREQUENCY /  100) {
		availableMoves.pop();
		board[availableMoves[Math.floor(Math.random() * availableMoves.length)]] 
			= LETTERS[COMPUTER_LETTER];
	}
};

const boardIsFull = (board) => {
	for (let i = 0; i < BOARD_SIZE; i++)
		if (board[i] == '')
			return false;
	return true;
};

export function TicTacNo( {win, lose} ) {
	return (
		<Board win={win} lose={lose}/>
	);
}

function Board({ win, lose }) {
	const [board, setBoard] = useState(newBoard());
	const [turn, setTurn] = useState(PLAYER_LETTER); 
	const [gameState, setGameState] = useState(GAME_STATE_RUNNING);
	const [isCheater, setIsCheater] = useState(rollForCheats());

	useEffect( ()=> {
		if (gameState != GAME_STATE_RUNNING) {
			setBoard(newBoard());
			setGameState(GAME_STATE_RUNNING);
			setIsCheater(rollForCheats());
		}
	}, [gameState]);

	const clickLetterHandler = (event, index) => {
		if (gameState != GAME_STATE_RUNNING)
			return;

		if (board[index] == '') {
			// Player turn
			board[index] = LETTERS[PLAYER_LETTER];
			setBoard((prev) => [...board]);
			let winner = validateBoard(board);
			if (winner != '') {
				win(GAME_NAME);
				setGameState(GAME_STATE_WIN);
				return;
			}

			// Computer turn
			computerMove(board, isCheater);
			winner = validateBoard(board);
			if (winner != '') {
				lose(GAME_NAME);
				setGameState(GAME_STATE_LOSE);
			}
			
			setBoard((prev) => [...board]);

			if (boardIsFull(board)) {
				// If you're not first you're last!
				lose(GAME_NAME);
				setGameState(GAME_STATE_LOSE);
			}
		}
	};

	return (
		<div className="cl-ttn-board">
			{board.map( (letter, index) => (
				<div className="cl-ttn-letter" key={index} onClick={(event) => {clickLetterHandler(event, index);}}>{letter}</div>
			))}
		</div>
	);
}














