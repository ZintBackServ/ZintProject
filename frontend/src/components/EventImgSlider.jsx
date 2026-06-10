import { useEffect, useState } from "react";
import img1 from "../assets/EventImg1.jpeg"
import img2 from "../assets/EventImg2.jpeg"
import img3 from "../assets/EventImg3.jpeg"
import img4 from "../assets/EventImg4.jpeg"
import img5 from "../assets/EventImg5.jpeg"
import img6 from "../assets/EventImg6.jpeg"
import img7 from "../assets/EventImg7.jpeg"
import img8 from "../assets/EventImg8.jpeg"
import img9 from "../assets/EventImg9.jpeg"
import img10 from "../assets/EventImg10.jpeg"
import img11 from "../assets/EventImg11.jpeg"
import img12 from "../assets/EventImg12.jpeg"
import img13 from "../assets/EventImg13.jpeg"
import img14 from "../assets/EventImg14.jpeg"
import img15 from "../assets/EventImg15.jpeg"
import img16 from "../assets/EventImg16.jpeg"

export default function ImageSlider() {

  const images = [
    img1,
    img2,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
    
  ];

  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  // Next
  const nextSlide = () => {
    setCurrent(
      current === images.length - 1 ? 0 : current + 1
    );
  };

  // Prev
  const prevSlide = () => {
    setCurrent(
      current === 0 ? images.length - 1 : current - 1
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl">

      {/* Images */}
      <div
        className="flex transition-transform duration-700"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="slider"
            className="w-full h-[250px] md:h-[500px] object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full"
      >
        ‹
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index
                ? "bg-white"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>

    </div>
  );
}