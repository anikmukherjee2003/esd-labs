// The whole app: App → Header, Matrix → Cell, Stats.
// App owns the numbers. Matrix and Stats only receive them as props.
import { useState } from "react";
import Header from "./Header.jsx";
import Matrix from "./Matrix.jsx";
import Stats from "./Stats.jsx";
import { START, incrementAt } from "./matrix.js";

export default function App() {
  const [matrix, setMatrix] = useState(START);

  function increment(row, col) {
    setMatrix((current) => incrementAt(current, row, col));
  }

  // Section 07: hold the matrix in state, starting from START, and render
  //             <Matrix matrix={…} /> under the header.
  // Section 08: write increment(row, col): it calls the setter with incrementAt.
  //             Pass it down to Matrix as onIncrement.
  // Section 09: render <Stats matrix={…} /> NEXT TO the matrix, not inside it.
  // Section 11: load /matrix.json once, in a useEffect, and put it in the state.
  return (
    <main className="app">
      <Header />
      <div className="board">
        <Matrix matrix={matrix} onIncrement={increment} />
        <Stats matrix={matrix} />
      </div>
    </main>
  );
}
