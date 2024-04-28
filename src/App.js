import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddProject from "./pages/AddProject";
import TaskList from "./pages/TaskList";
import "./App.css";

function App() {
  const [ProjectData, setProjectData] = React.useState("");

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/projects`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setProjectData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<AddProject ProjectData={ProjectData} />} />
          <Route path="/project" element={<TaskList />} />
          <Route
            path="/project/:id"
            element={<TaskList ProjectData={ProjectData} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
