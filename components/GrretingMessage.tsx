import React from "react";
import SpinningAmogus from "../assets/images/SpinningAmogus.gif";

const GreetingMessage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col text-center justify-center">
        <img
          src={SpinningAmogus}
          className="rounded-full shadow-[4px_8px_10px_rgba(0,0,0,0.2)] max-w-30 mx-auto"
        />
        <div
          className="text-white text-2xl"
          style={{ fontFamily: "ShadowsIntoLight" }}
        >
          I wanna Special Summon Kitkallos and mill 5
        </div>
      </div>
    </>
  );
};

export default GreetingMessage;
