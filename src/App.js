import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";

function App() {
  return (
    <main className="App">
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>   
    </main>
  );
}

export default App;
