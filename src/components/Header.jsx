import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  let navigate = useNavigate();

  return (
    <div className="bg-white border-b-2 border-blue-500 h-16 w-full flex justify-start p-4">
      <section>
        <h2 className="text-lg text-[#9e9e9e] font-sans font-semibold">
          Random table objects generator
        </h2>
      </section>
    </div>
  );
}

export default Header;
