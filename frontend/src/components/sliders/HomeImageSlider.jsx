import { useState } from "react";

const images = [
  {
    src: "/homeposters/HomePoster1.webp",
    srcSet: "/homeposters/HomePoster1-sm.webp 720w, /homeposters/HomePoster1-md.webp 1200w, /homeposters/HomePoster1.webp 1920w",
    alt: "Zint Institute - Admissions Open 2024",
  },
  { src: "/homeposters/HomePoster2.webp", alt: "Zint Computer Education - Software Courses" },
  { src: "/homeposters/HomePoster3.webp", alt: "Zint Institute - Placement Drive" },
  { src: "/homeposters/HomePoster4.webp", alt: "Zint Institute - Workshop Event" },
  { src: "/homeposters/HomePoster5.webp", alt: "Zint Institute - Scholarship Program" },
  { src: "/homeposters/HomePoster6.webp", alt: "Zint Institute - 1-Year Job Ready Program" },
  { src: "/homeposters/HomePoster7.webp", alt: "Zint Institute - Student Activity" },
  { src: "/homeposters/HomePoster8.webp", alt: "Zint Institute - Campus Event" },
  { src: "/homeposters/HomePoster9.webp", alt: "Zint Institute - Award Ceremony" },
  { src: "/homeposters/HomePoster10.webp", alt: "Zint Institute - Training Session" },
  { src: "/homeposters/HomePoster11.webp", alt: "Zint Institute - Guest Lecture" },
  { src: "/homeposters/HomePoster12.webp", alt: "Zint Institute - Guest Lecture" },
];

function AutoSlider() {
  const [current, setCurrent] = useState(0);
  const prevSlide = () =>
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  const nextSlide = () =>
    setCurrent(current === images.length - 1 ? 0 : current + 1);

  const activeImage = images[current];

  return (
    <div className="relative mx-auto w-full overflow-hidden aspect-[1920/768] bg-[#0a020f]">
      <img
        src={activeImage.src}
        srcSet={activeImage.srcSet || undefined}
        sizes={activeImage.srcSet ? "100vw" : undefined}
        alt={activeImage.alt}
        width="1920"
        height="768"
        className="w-full h-auto block select-none"
        loading={current === 0 ? "eager" : "lazy"}
        fetchPriority={current === 0 ? "high" : "low"}
        decoding={current === 0 ? "sync" : "async"}
      />

      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
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
