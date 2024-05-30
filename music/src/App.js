import { useState } from "react";
import "./App.css";
import Card from "./components/Card";

function App() {
  const[musicNumber, setMusicNumber] = useState(0);
  return (
    <div className="container">
      
      <main>
      <div className="shape shape-1"></div>
        <Card props = {{musicNumber, setMusicNumber}}/>
      </main>
      
    </div>
  );
}

export default App;
