import React from "react";

const LoadingAnimation: React.FC = () => {
  const [dots, setDots] = React.useState("");
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) return ".";
        return prevDots + ".";
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="text-[rgb(90,90,90)]">Generating{dots}</div>
    </>
  );
};
export default LoadingAnimation;
