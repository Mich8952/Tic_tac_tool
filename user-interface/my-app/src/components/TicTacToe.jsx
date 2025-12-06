import { useState, useEffect } from "react";
import "./TicTacToe.css";

export default function TicTacToe() {
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState(Array(3 * 3).fill(null));
  const [player1, setPlayer1] = useState("Human");
  const [player2, setPlayer2] = useState("Human");
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [firstMove, setFirstMove] = useState("Player 1");

  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentPlayer(firstMove === "Player 1" ? "X" : "O");
  }, [boardSize, firstMove]);

  const convertTo2D = (board, size) => {
    const board2D = [];
    for (let i = 0; i < size; i++) {
      board2D.push(board.slice(i * size, (i + 1) * size)); // convert to 2 dimensions instead of its flat state form
    }
    return board2D;
  };

  const getAIMove = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/get-ai-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board: convertTo2D(board, boardSize), // dont really need this since in the backend we go back to the flat state (TODO if time)
          player: currentPlayer,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting AI move:", error);
      return null;
    }
  };

  useEffect(() => {
    const makeAIMove = async () => {
      if (checkWinner(board)) {
        return;
      }

      let currentPlayerType;

      if (currentPlayer === "X") {
        currentPlayerType = player1;
      } else {
        currentPlayerType = player2;
      }

      console.log("Current player:", currentPlayer, "Type:", currentPlayerType);

      if (currentPlayerType === "Model-Based (VI)") {
        console.log("AI making move...");
        const move = await getAIMove();
        console.log("AI move received:", move);
        if (move) {
          const index = move.row * boardSize + move.col; // get the flat index
          if (!board[index]) {
            const newBoard = [...board]; //copy current board
            newBoard[index] = currentPlayer; // play move
            setBoard(newBoard);
            setCurrentPlayer(currentPlayer === "X" ? "O" : "X"); // set to next player which is O if it was previously X
          }
        }
      }
    };

    makeAIMove();
  }, [currentPlayer, board, player1, player2]);

  const handleClick = (index) => {
    if (board[index] || checkWinner(board)) return;

    const currentPlayerType = currentPlayer === "X" ? player1 : player2;
    if (currentPlayerType !== "Human") return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const checkWinner = (board) => {
    const size = boardSize;
    // Check rows
    for (let r = 0; r < size; r++) {
      const rowStart = r * size;
      if (
        board[rowStart] &&
        Array.from({ length: size }).every(
          (_, i) => board[rowStart + i] === board[rowStart]
        )
      )
        return board[rowStart];
    }
    // Check columns
    for (let c = 0; c < size; c++) {
      if (
        board[c] &&
        Array.from({ length: size }).every(
          (_, i) => board[c + i * size] === board[c]
        )
      )
        return board[c];
    }
    // Check diagonals
    if (
      board[0] &&
      Array.from({ length: size }).every(
        (_, i) => board[i * (size + 1)] === board[0]
      )
    )
      return board[0];
    if (
      board[size - 1] &&
      Array.from({ length: size }).every(
        (_, i) => board[(i + 1) * (size - 1)] === board[size - 1]
      )
    )
      return board[size - 1];

    return null;
  };

  const resetGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentPlayer(firstMove === "Player 1" ? "X" : "O");
  };

  const winner = checkWinner(board);

  return (
    <section className="tic-tac-toe-container" id="play">
      <h2>Tic-Tac-Toe</h2>

      <div className="tic-tac-toe-flex">
        {/* Left: controls */}
        <div className="tic-tac-toe-settings">
          <label>
            Board Size:
            <select
              value={boardSize}
              onChange={(e) => setBoardSize(Number(e.target.value))}
            >
              <option value={3}>3x3</option>
              <option value={4}>4x4</option>
              <option value={5}>5x5</option>
            </select>
          </label>

          <label>
            Player 1:
            <select
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
            >
              <option>Human</option>
              <option>Model-Based (VI)</option>
              <option>Model-Free</option>
              <option>Deep Learning</option>
            </select>
          </label>

          <label>
            Player 2:
            <select
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
            >
              <option>Human</option>
              <option>Model-Based (VI)</option>
              <option>Model-Free</option>
              <option>Deep Learning</option>
            </select>
          </label>

          <label>
            First Move:
            <select
              value={firstMove}
              onChange={(e) => setFirstMove(e.target.value)}
            >
              <option>Player 1</option>
              <option>Player 2</option>
            </select>
          </label>

          <button className="reset-button" onClick={resetGame}>
            Reset
          </button>
        </div>

        {/* Center: board */}
        <div className="tic-tac-toe-board-column">
          <div
            className="board"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, 80px)`,
              gridTemplateRows: `repeat(${boardSize}, 80px)`,
            }}
          >
            {board.map((cell, idx) => (
              <div key={idx} className="cell" onClick={() => handleClick(idx)}>
                {cell}
              </div>
            ))}
          </div>

          {winner && <p className="winner-text">{winner} wins!</p>}
        </div>
      </div>
    </section>
  );
}
