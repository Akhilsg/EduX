import React, { useState, useEffect } from "react";

const LoadingDots = ({ text }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length >= 3 ? "" : prevDots + "."));
    }, 400);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <span>
      {text}
      {dots}
    </span>
  );
};

export default LoadingDots;
