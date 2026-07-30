import { useEffect, useState } from "react";
import img1  from "../assets/EventImg1.webp";
import img2  from "../assets/EventImg2.webp";
import img3  from "../assets/EventImg3.webp";
import img4  from "../assets/EventImg4.webp";
import img5  from "../assets/EventImg5.webp";
import img6  from "../assets/EventImg6.webp";
import img7  from "../assets/EventImg7.webp";
import img8  from "../assets/EventImg8.webp";
import img9  from "../assets/EventImg9.webp";
import img10 from "../assets/EventImg10.webp";
import img11 from "../assets/EventImg11.webp";
import img12 from "../assets/EventImg12.webp";
import img13 from "../assets/EventImg13.webp";
import img14 from "../assets/EventImg14.webp";
import img15 from "../assets/EventImg15.webp";
import img16 from "../assets/EventImg16.webp";

const images = [
  { src: img1,  alt: "Zint Institute Event 1"  },
  { src: img2,  alt: "Zint Institute Event 2"  },
  { src: img4,  alt: "Zint Institute Event 4"  },
  { src: img5,  alt: "Zint Institute Event 5"  },
  { src: img6,  alt: "Zint Institute Event 6"  },
  { src: img7,  alt: "Zint Institute Event 7"  },
  { src: img8,  alt: "Zint Institute Event 8"  },
  { src: img9,  alt: "Zint Institute Event 9"  },
  { src: img10, alt: "Zint Institute Event 10" },
  { src: img11, alt: "Zint Institute Event 11" },
  { src: img12, alt: "Zint Institute Event 12" },
  { src: img13, alt: "Zint Institute Event 13" },
  { src: img14, alt: "Zint Institute Event 14" },
  { src: img15, alt: "Zint Institute Event 15" },
  { src: img16, alt: "Zint Institute Event 16" },
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () =>
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  const prevSlide = () =>
    setCurrent(current === 0 ? images.length - 1 : current - 1);

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl">
      {/* Render only the visible slide — all but first are lazy */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map(({ src, alt }, index) => (
          <img
            key={index}
            src={src}
            alt={alt}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-[250px] md:h-[500px] object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        aria-label="Previous event image"
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full hover:bg-black/70 transition-colors"
      >
        ‹
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        aria-label="Next event image"
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full hover:bg-black/70 transition-colors"
      >
        ›
      </button>
    </div>
  );
}