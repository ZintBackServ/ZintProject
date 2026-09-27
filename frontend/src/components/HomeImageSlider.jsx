import { useState } from "react";
import Img1  from "../assets/HomePoster1.webp";
import Img2  from "../assets/HomePoster2.webp";
import Img3  from "../assets/HomePoster3.webp";
import Img4  from "../assets/HomePoster4.webp";
import Img5  from "../assets/HomePoster5.webp";
import Img6  from "../assets/HomePoster6.webp";
import Img7  from "../assets/HomePoster7.webp";
import Img8  from "../assets/HomePoster8.webp";
import Img9  from "../assets/HomePoster9.webp";
import Img10 from "../assets/HomePoster10.webp";
import Img11 from "../assets/HomePoster11.webp";
import Img12 from "../assets/HomePoster12.webp";
import Img13 from "../assets/HomePoster13.webp";


const images = [
  { src: Img1,  alt: "Zint Institute - Admissions Open 2024" },
  { src: Img2,  alt: "Zint Computer Education - Software Courses" },
  { src: Img3,  alt: "Zint Institute - Placement Drive" },
  { src: Img4,  alt: "Zint Institute - Workshop Event" },
  { src: Img5,  alt: "Zint Institute - Scholarship Program" },
  { src: Img6,  alt: "Zint Institute - Career Development" },
  { src: Img7,  alt: "Zint Institute - Student Activity" },
  { src: Img8,  alt: "Zint Institute - Campus Event" },
  { src: Img9,  alt: "Zint Institute - Award Ceremony" },
  { src: Img10, alt: "Zint Institute - Training Session" },
  { src: Img11, alt: "Zint Institute - Guest Lecture" },
  { src: Img12, alt: "Zint Institute - Industry Visit" },
  { src: Img13, alt: "Zint Institute - Graduation Day" },

];

function AutoSlider() {
  const [current, setCurrent] = useState(0);
  const prevSlide = () =>
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  const nextSlide = () =>
    setCurrent(current === images.length - 1 ? 0 : current + 1);

  return (
    <div
      className="relative mx-auto w-full overflow-hidden aspect-[1920/768] bg-[#0a020f]"
    >
      <img
        src={current === 0 ? "/home-hero.webp" : images[current].src}
        alt={images[current].alt}
        width="1920"
        height="768"
        className="w-full h-auto block select-none"
        loading="eager"
        fetchPriority={current === 0 ? "high" : "auto"}
        decoding="async"
      />

      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        ❯
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default AutoSlider;
