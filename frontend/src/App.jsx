import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <section>
        <Navbar />
        <div>
          <Outlet/>
        </div>
      </section>
    </>
  );
}

export default App;
