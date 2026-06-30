
import React, { useEffect, useRef, useState } from "react";

  const DarkPurple = "#8E1387";
  const PrimaryPurple = "#B11FA8";
  const LightPurple = "#C94CC2";
  const BLUE = "#53BFEA";
  const GREEN = "#45B51D";

const Mentor = () => {
  const [mentors, setMentors] = useState([]);
  const scrollRef = useRef();
  const intervalRef = useRef();

  // ✅ Fetch backend data
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/mentor/allMentor`);
        const data = await res.json();
        console.log("I am mentor",data.mentors);
        setMentors(data.mentors);
      } catch (err) {
        console.log("error in mentor",err,`${import.meta.env.VITE_API_URL}/mentor/allMentor`)
        console.log(err);
      }
    };

    fetchMentors();
  }, []);

  // ✅ Auto scroll
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const startScroll = () => {
      intervalRef.current = setInterval(() => {
        container.scrollLeft += 1;

        if (
          container.scrollLeft >=
          container.scrollWidth - container.clientWidth
        ) {
          container.scrollLeft = 0;
        }
      }, 20);
    };

    startScroll();

    return () => clearInterval(intervalRef.current);
  }, [mentors]);

  // ✅ Pause on hover
  const stopScroll = () => clearInterval(intervalRef.current);

  const startScrollAgain = () => {
    const container = scrollRef.current;
    intervalRef.current = setInterval(() => {
      container.scrollLeft += 1;
    }, 20);
  };

  // duplicate for smooth loop
  const loopData = [...mentors, ...mentors];

  return (
    
    <div 
      className="bg-cover bg-center bg-black items-center justify-center pt-8"
    >
      <div className="flex flex-col items-center justify-center px-5">
         <h1 className="text-2xl md:text-3xl text-white  font-bold mb-2 p-1">Meet Our  
          <span style={{color:`${LightPurple}`}}> Mentors</span></h1>
         <p className="text-white">Learn from industry veterans and academic excellence who are committed to your success.</p>
      </div>

      <div  className=" flex items-center justify-center">

      <div
        ref={scrollRef}
        onMouseEnter={stopScroll}
        onMouseLeave={startScrollAgain}
        className="flex gap-4 sm:gap-6 overflow-x-auto px-4 sm:px-6 py-10 scrollbar-hide mt-20"
      >
        {loopData.map((item, index) => (
          <div
            key={index}
            className="
              min-w-[220px] 
              sm:min-w-[250px] 
              md:min-w-[280px] 
              lg:min-w-[300px]
              bg-gradient-to-br from-purple-500 to-orange-400 
              p-[2px] rounded-xl 
              hover:scale-105 transition duration-300
            "
          >
            <div className="h-full bg-gray-900 rounded-xl p-2 text-white">
              
              <img
                src={item.profileImage}
                alt={item.mentorName}
                className="w-full h-36 sm:h-40 md:h-48 object-cover rounded-lg mb-3"
              />

              <h2 className="text-base sm:text-lg font-semibold">
                {item.mentorName}
              </h2>

              <p className="text-xs sm:text-sm text-gray-300">
                {item.expertise}
              </p>
              <h2 className="text-xs sm:text-sm text-gray-300">{item.experience} years experience</h2>
              <p className="text-xs sm:text-sm text-gray-300"> {item.bio}</p>
              {/* <button className="mt-3 text-xs sm:text-sm bg-cyan-500 px-3 py-1 rounded">
                View Profile
              </button> */}

            </div>
          </div>
        ))}
      </div>
    </div>
   </div>
  );
};

export default Mentor;
