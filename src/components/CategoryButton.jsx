import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiCategory } from "react-icons/bi";

const CategoryButton = () => {
  const navigate = useNavigate();
  const [isRotating, setIsRotating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    setIsRotating(true);
    setTimeout(() => {
      navigate("/category-all");
      setIsRotating(false);
    }, 800);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`fixed z-[999] bottom-32 right-5 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg transition-transform ${
          isVisible ? "opacity-100 animate-bounce" : "opacity-0"
        }`}
        style={{
          transition: "opacity 0.3s",
          animation: isVisible ? "1s infinite" : "none",
        }}
      >
        <BiCategory
          className={`text-white text-lg ${
            isRotating ? "rotate-animation" : ""
          }`}
        />
      </button>

      <style>
        {`
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .rotate-animation {
            animation: rotate 0.5s linear infinite;
          }
        `}
      </style>
    </>
  );
};

export default CategoryButton;
