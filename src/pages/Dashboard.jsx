import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Servers from "../components/Servers";

function Dashboard() {
  const [showList, setShowList] = useState();
  const handleData = (data) => {
    setShowList(data);
  };
  return (
    <div>
      <Navbar val={handleData} />
      <Servers val={showList} />
    </div>
  );
}

export default Dashboard;
