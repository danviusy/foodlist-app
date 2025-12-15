import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";

function App() {
  return (
    <div>
      <header></header>
      <article>
        <Router>
          <AppRoutes />
        </Router>
      </article>
    </div>
  );
}

export default App;
