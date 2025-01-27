import React, { useState } from 'react';
import './App.css';
import Confetti from 'react-confetti';

const ROWS = 6;
const COLS = 7;

function App() {
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('Red');
  const [winner, setWinner] = useState(null);
  const [playerColors, setPlayerColors] = useState({ Red: 'red', Yellow: 'yellow' });
  const [playerNames, setPlayerNames] = useState({ Red: 'Player 1', Yellow: 'Player 2' });
  const [nameLocked, setNameLocked] = useState({ Red: false, Yellow: false });
  const [gameStarted, setGameStarted] = useState(false);

  const handleClick = (col) => {
    if (winner) return;
    const newBoard = board.map(row => row.slice());
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setGameStarted(true);
        if (checkWin(newBoard, row, col)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
        }
        break;
      }
    }
  };

  const checkWin = (board, row, col) => {
    const directions = [
      { dr: 0, dc: 1 }, // horizontal
      { dr: 1, dc: 0 }, // vertical
      { dr: 1, dc: 1 }, // diagonal down-right
      { dr: 1, dc: -1 } // diagonal down-left
    ];
    for (const { dr, dc } of directions) {
      let count = 1;
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== currentPlayer) break;
        count++;
      }
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== currentPlayer) break;
        count++;
      }
      if (count >= 4) return true;
    }
    return false;
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer('Red');
    setWinner(null);
    setGameStarted(false);
    setNameLocked({ Red: false, Yellow: false });
  };

  const handleColorChange = (player, color) => {
    if (!gameStarted) {
      setPlayerColors({ ...playerColors, [player]: color });
    }
  };

  const handleNameChange = (player, name) => {
    setPlayerNames({ ...playerNames, [player]: name });
  };

  const lockName = (player) => {
    setNameLocked({ ...nameLocked, [player]: true });
  };

  const renderCell = (row, col) => {
    const cellValue = board[row][col];
    const cellStyle = cellValue ? { backgroundColor: playerColors[cellValue], transition: 'background-color 0.5s ease' } : { backgroundColor: '#ddd' };
    return (
      <div
        className="cell"
        style={cellStyle}
        onClick={() => handleClick(col)}
        key={col}
      >
        {/* No content needed inside the cell */}
      </div>
    );
  };

  const renderRow = (row, rowIndex) => {
    return (
      <div className="row" key={rowIndex}>
        {row.map((cell, colIndex) => renderCell(rowIndex, colIndex))}
      </div>
    );
  };

  return (
    <div className="App">
      {winner && <Confetti />}
      <header className="App-header">
        <h1>Connect Four</h1>
        <div className="board">
          {board.map((row, rowIndex) => renderRow(row, rowIndex))}
        </div>
        {winner ? (
          <div className="winner-popup">
            <p>Winner: {playerNames[winner]}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        ) : (
          <p>Current Player: {playerNames[currentPlayer]}</p>
        )}
        <div className="settings">
          <div className="color-picker">
            <label>
              {playerNames.Red} Color:
              <input
                type="color"
                value={playerColors.Red}
                onChange={(e) => handleColorChange('Red', e.target.value)}
                disabled={gameStarted}
              />
            </label>
            <label>
              {playerNames.Yellow} Color:
              <input
                type="color"
                value={playerColors.Yellow}
                onChange={(e) => handleColorChange('Yellow', e.target.value)}
                disabled={gameStarted}
              />
            </label>
          </div>
          <div className="name-input">
            <label>
              {nameLocked.Red ? playerNames.Red : 'Red Player Name:'}
              {!nameLocked.Red && (
                <>
                  <input
                    type="text"
                    value={playerNames.Red}
                    onChange={(e) => handleNameChange('Red', e.target.value)}
                  />
                  <button onClick={() => lockName('Red')}>Lock Name</button>
                </>
              )}
            </label>
            <span className="vs">vs</span>
            <label>
              {nameLocked.Yellow ? playerNames.Yellow : 'Yellow Player Name:'}
              {!nameLocked.Yellow && (
                <>
                  <input
                    type="text"
                    value={playerNames.Yellow}
                    onChange={(e) => handleNameChange('Yellow', e.target.value)}
                  />
                  <button onClick={() => lockName('Yellow')}>Lock Name</button>
                </>
              )}
            </label>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
