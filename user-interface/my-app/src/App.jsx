import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Tabs from "./components/Tabs";
import InfoSection from "./components/InfoSection";

import TicTacToe from "./components/TicTacToe";

// const montecarloAgent = new FakeAgent();

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <Hero />
      <Tabs />
      <InfoSection />
      <TicTacToe />
      {/* <DecisionExplainer agent={montecarloAgent} /> */}
    </div>
  );
}

export default App;
