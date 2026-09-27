import { useEffect, useState } from "react";

const images = [
  { src: "/events/EventImg1.webp",  alt: "Zint Institute Event 1"  },
  { src: "/events/EventImg2.webp",  alt: "Zint Institute Event 2"  },
  { src: "/events/EventImg3.webp",  alt: "Zint Institute Event 3"  },
  { src: "/events/EventImg4.webp",  alt: "Zint Institute Event 4"  },
  { src: "/events/EventImg5.webp",  alt: "Zint Institute Event 5"  },
  { src: "/events/EventImg6.webp",  alt: "Zint Institute Event 6"  },
  { src: "/events/EventImg7.webp",  alt: "Zint Institute Event 7"  },
  { src: "/events/EventImg8.webp",  alt: "Zint Institute Event 8"  },
  { src: "/events/EventImg9.webp",  alt: "Zint Institute Event 9"  },
  { src: "/events/EventImg10.webp", alt: "Zint Institute Event 10" },
  { src: "/events/EventImg11.webp", alt: "Zint Institute Event 11" },
  { src: "/events/EventImg12.webp", alt: "Zint Institute Event 12" },
  { src: "/events/EventImg13.webp", alt: "Zint Institute Event 13" },
  { src: "/events/EventImg14.webp", alt: "Zint Institute Event 14" },
  { src: "/events/EventImg15.webp", alt: "Zint Institute Event 15" },
  { src: "/events/EventImg16.webp", alt: "Zint Institute Event 16" },
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
