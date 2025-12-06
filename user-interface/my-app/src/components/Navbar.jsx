import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">TicTacTool</div>
      <ul className="nav-links">
        <li>
          <a href="#tabs">The Algorithms</a>
        </li>
        <li>
          <a href="#background">Background</a>
        </li>
        <li>
          <a href="#play">Play Now</a>
        </li>
      </ul>
    </nav>
  );
}
