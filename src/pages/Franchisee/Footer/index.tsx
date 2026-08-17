import React, { useEffect, useState } from "react";

const main = () => {
  const [circleColor, setCircleColor] = useState("bg-white");
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const getInternetSpeed = () => {
      // Using the navigator.connection API to get the internet speed
      if (navigator.connection && navigator.connection.downlink) {
        const speedInMbps = navigator.connection.downlink;

        // Determine the circle color based on speed
        if (speedInMbps >= 10) {
          setCircleColor("bg-green-500"); // Green for fast speed
        } else if (speedInMbps > 5) {
          setCircleColor("bg-orange-400"); // Orange for moderate speed
        } else {
          setCircleColor("bg-red-500"); // Red for slow speed
        }
      } else {
        // Fallback if the API is unsupported

        setCircleColor("bg-white"); // White for unknown speed
      }
    };

    // Call the function initially to get the internet speed
    getInternetSpeed();

    // Set an interval to check the speed every 2 seconds
    const interval = setInterval(getInternetSpeed, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex justify-center gap-2">
      <footer className="text-center text-white mt-2">
        © Copyrights {currentYear} sKart Global Express
      </footer>
      <div
        className={`${circleColor} w-2 h-2 rounded-full  mt-3.5  border border-gray-200 animate-pulse`}
      ></div>
    </div>
  );
};

export default main;
