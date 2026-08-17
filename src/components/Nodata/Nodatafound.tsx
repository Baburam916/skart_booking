import React from 'react'
import nodatafoundimage from "../../assets/images/noDataFound/nodata.jpg"
export default function Nodatafound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <img
        src={nodatafoundimage}
        alt="Internal Error Image"
        className="w-1/2 rounded-full opacity-50"
      />
    </div>
  );
}
