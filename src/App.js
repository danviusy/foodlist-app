import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";

function App() {
  return (
    <div>
      <header>
        <h1>Header</h1>
      </header>
      <article>
        <Router>
          <AppRoutes />
        </Router>
      </article>
    </div>
  );
}

export default App;
