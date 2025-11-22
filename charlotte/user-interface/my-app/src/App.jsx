import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tabs from "./components/Tabs";
import TicTacToe from "./components/TicTacToe";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Tabs />
      <TicTacToe />
    </div>
  );
}

export default App;
