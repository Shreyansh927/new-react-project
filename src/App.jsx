import React from "react";
import Query from "./query.jsx";
import Edit from "./imageEdit.jsx";
import NavBar from "./nav-bar.jsx";

const App = () => {
  return (
    <div>
      <NavBar />
      <Query />
      <Edit />

      <h1>navbar added successfully</h1>
    </div>
  );
};

export default App;
