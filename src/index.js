import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{(props.isWinner == true) ? <b>{props.value}</b> : props.value}
		</button>
	);
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], [a, b, c]];
		}
	}
	return null;
}

class Board extends React.Component {
	renderSquare(i, isWinner) {
		const winner = calculateWinner(this.props.squares);

		return (
			<Square 
				value={this.props.squares[i]}
				isWinner={(winner && winner[1].includes(i)) ? true : false}
				onClick={() => this.props.onClick(i)} 
			/>
		);
	}
	
	renderBoard() {
		let boardRow = 3;
		let boardCol = 3;

		let tableRow = new Array(boardRow).fill(null);
		let tableCol = new Array(boardCol).fill(null);

		return(
			<div>
				{[...tableRow].map((row, rowIndex) => {
					return (
						<div className="board-row">
							{[...tableCol].map((col, rowCol) => this.renderSquare(rowIndex*boardCol + rowCol))}
						</div>
					)
				})}
			</div>
		);
	}

	render() {
		return (
			<div>
				{this.renderBoard()}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor() {
		super();
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			xIsNext: true,
			stepNumber: 0,
			moveBeenClicked: false,
			sorted: true,
		};
	}
	
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		
		squares[i] = this.state.xIsNext ? 'X' : 'O';
				
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			squares: squares,
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length,
			moveBeenClicked: false,
		});
	}
	
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
			moveBeenClicked: true,
		});
	}

	handleReverseClick(y) {
		this.setState({
			sorted: !this.state.sorted
		});
	}
	
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		
		const moves = history.map((step, move) => {
			const desc = move ?
				'Move #' + move + ' ':
				'Game start';
			
			return (
				<li key={move}>
					<a href="#" onClick={() => this.jumpTo(move)}>{(this.state.moveBeenClicked && move == this.state.stepNumber) ? <b>{desc}</b> : desc}</a>
				</li>
			);
		});
		
		if(!this.state.sorted) 
			moves.reverse();

		let status;
		if (winner) {
		  status = 'Winner: ' + winner[0];
		} else {
		  status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
				    />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<div><button onClick={(y) => this.handleReverseClick(y)}>Reverse</button></div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
