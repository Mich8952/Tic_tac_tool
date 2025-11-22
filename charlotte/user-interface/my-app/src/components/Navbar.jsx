import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">TicTacTool</div>
      <ul className="nav-links">
        <li>
          <a href="#hero">About</a>
        </li>
        <li>
          <a href="#tabs">Algorithms</a>
        </li>
        <li>
          <a href="#tictactoe">Play Now</a>
        </li>
      </ul>
    </nav>
  );
}
