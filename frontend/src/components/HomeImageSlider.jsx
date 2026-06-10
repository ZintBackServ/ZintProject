import { useState, useEffect } from "react";
// import homeImg from "../assets/homeImg1.png"
import Img1 from "../assets/HomePoster1.png"
import Img2 from "../assets/HomePoster2.png"
import Img3 from "../assets/HomePoster3.png"
import Img4 from "../assets/HomePoster4.png"
import Img5 from "../assets/HomePoster5.png"
import Img6 from "../assets/HomePoster6.png"
import Img7 from "../assets/HomePoster7.png"
import Img8 from "../assets/HomePoster8.png"
import Img9 from "../assets/HomePoster9.png"
import Img10 from "../assets/HomePoster10.png"
import Img11 from "../assets/HomePoster11.png"
import Img12 from "../assets/HomePoster12.png"
import Img13 from "../assets/HomePoster13.png"
import Img14 from "../assets/HomePoster14.png"
import Img15 from "../assets/HomePoster15.png"

// import Img7 from "../assets/"
const images = [
  Img1,
  Img2,
  Img3,
  Img4,
  Img5,
  Img6,
  Img7,
  Img8,
  Img9,
  Img10,
  Img11,
  Img12,
  Img13,
  Img14,
  Img15,

];

 function AutoSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto Slide Logic
  useEffect(() => {
    if (isHovered) return; // stop when hovered

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  return (

    <div
      className="relative w-full mx-auto overflow-hidden "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <img
        src={images[current]}
        alt="slider"
        className="w-full sm:h-80 md:h-110 object-center transition-all duration-500"
      />

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ❮
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default AutoSlider;