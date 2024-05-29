import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddProject from "./pages/AddProject";
import TaskList from "./pages/TaskList";
import DataCollect from "./pages/DataCollect";
import AddData from "./pages/AddData";
import Forbidden from "./pages/Forbidden";
import AIModel from "./pages/AIModel";
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
          <Route path="/taipower-autolabe-beta" element={<AddProject ProjectData={ProjectData} />} />
          <Route path="/project" element={<TaskList />} />
          <Route
            path="/project/:id"
            element={<TaskList ProjectData={ProjectData} />}
          />
          <Route path="/datacollect">
            <Route index element={<DataCollect ProjectData={ProjectData} />} />
            <Route path="add" element={<AddData />} />
          </Route>
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/ai" element={<AIModel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
