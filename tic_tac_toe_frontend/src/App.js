import React, { useState } from 'react';
import './App.css';

// Theme & accent color constants
const ACCENT = '#00e676';      // strong green
const PRIMARY = '#3f51b5';    // blue
const SECONDARY = '#f50057';  // pink-red

/**
 * PUBLIC_INTERFACE
 * Main App component for the Tic Tac Toe game.
 * Provides a centered, modern UI with a 3x3 grid for
 * two-player local play, game state management and winner/draw display.
 */
function App() {
  // 0-indexed 3x3 board (Array of 9)
  const [squares, setSquares] = useState(Array(9).fill(null));
  // true: X turn, false: O turn
  const [xIsNext, setXIsNext] = useState(true);

  // Winner result: {winner: "X"/"O"/null, line: [indices]|null}
  const result = calculateWinner(squares);
  const isDraw = !result.winner && squares.every(Boolean);

  // PUBLIC_INTERFACE
  /**
   * Handles a player's move.
   * @param {number} i - index of grid
   */
  function handleClick(i) {
    if (squares[i] || result.winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  /**
   * Resets the game to initial empty state.
   */
  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // UI: status message
  let status;
  if (result.winner) {
    status = (
      <span>
        <span style={{ color: result.winner === 'X' ? PRIMARY : SECONDARY, fontWeight: 700 }}>
          {result.winner}
        </span>{' '}
        wins!
      </span>
    );
  } else if (isDraw) {
    status = <span style={{ color: ACCENT, fontWeight: 700 }}>It's a draw!</span>;
  } else {
    status = (
      <>
        Next turn:{' '}
        <span style={{
          color: xIsNext ? PRIMARY : SECONDARY,
          fontWeight: 700
        }}>
          {xIsNext ? 'X' : 'O'}
        </span>
      </>
    );
  }

  return (
    <div className="App">
      <main className="ttt-main">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{status}</div>
        <div className="ttt-board-container">
          <Board
            squares={squares}
            onClick={handleClick}
            winningLine={result.line}
          />
        </div>
        <div className="ttt-controls">
          <button
            className="ttt-btn"
            style={{
              background: ACCENT, color: '#fff'
            }}
            onClick={resetGame}
            aria-label="Restart game"
            data-testid="restart"
          >
            Restart
          </button>
        </div>
        <footer className="ttt-footer">
          <span>
            <span style={{ color: PRIMARY, fontWeight: 600 }}>X</span> &ndash; Player 1&nbsp;&nbsp;|&nbsp;&nbsp;
            <span style={{ color: SECONDARY, fontWeight: 600 }}>O</span> &ndash; Player 2
          </span>
        </footer>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Renders the Tic Tac Toe board (3x3 grid).
 * @param {Object} props - {squares, onClick, winningLine}
 */
function Board({ squares, onClick, winningLine }) {
  // Paint squares with winning highlight
  function renderSquare(i) {
    const isWinning = winningLine && winningLine.includes(i);
    return (
      <button
        key={i}
        className={`ttt-square${isWinning ? ' ttt-square-win' : ''}`}
        onClick={() => onClick(i)}
        aria-label={"play " + (i + 1)}
        data-testid={`square-${i}`}
      >
        {squares[i]}
      </button>
    );
  }
  return (
    <div className="ttt-board" role="grid">
      {[0, 1, 2].map(row =>
        <div className="ttt-board-row" key={row} role="row">
          {[0, 1, 2].map(col =>
            renderSquare(row * 3 + col)
          )}
        </div>
      )}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Returns winner symbol and the winning row/col/diag line or null.
 * @param {Array} squares - game board array.
 * @returns {{winner: string|null, line: number[]|null}}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

export default App;
