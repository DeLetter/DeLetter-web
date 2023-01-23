import React from "react";
import WarningBoard from "@modules/Warning";
import LoadData from "@modules/LoadData";

const DownLoad: React.FC = () => {
  return (
    <div className="w-4/5">
      <WarningBoard />
      <LoadData />
    </div>
  )
}

export default DownLoad;