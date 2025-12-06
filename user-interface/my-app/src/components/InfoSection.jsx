import "./InfoSection.css";

export default function InfoSection() {
  return (
    <section className="info-section" id="background">
      <h2>Background & Concepts</h2>

      <div className="info-grid">
        <div className="info-card">
          <h3>Why Tic-Tac-Toe?</h3>
          <p>
            Tic-Tac-Toe for a 3x3 board is simple to understand. As students
            understanding grows, the board can be expanded to reveal differences
            between algorithms.
          </p>
        </div>

        <div className="info-card">
          <h3>Taking Turns</h3>
          <p>
            The game alternates moves between two players: the learning agent
            and the opponent. All performance rates presented in the figures are
            averaged with the agent going first and the opponent going first.
          </p>
        </div>
        <div className="info-card">
          <h3>About Our Baseline Policy</h3>
          <p>
            The baseline policy is taken from Lecture 3 of the course. It is
            used as a reference for evaluation. It does not learn or adapt —
            instead, it chooses moves using fixed rules that make reasonable but
            not optimal decisions, and plays defensively.
          </p>
        </div>
        <div className="info-card">
          <h3>Slipping Probability</h3>
          <p>here.</p>
        </div>
      </div>
    </section>
  );
}
