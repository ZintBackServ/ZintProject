// import Mentor from "./Mentor"
import PlacedStudent from "../components/PlacedStudentSlider"
import WhyZint from "../components/WhyZint"
import Mentor from "../pages/Mentor"
import { FaIndustry } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { SiCodementor } from "react-icons/si";

function About() {
  return (
   <div className="mb-10">

      {/* ── HERO SECTION ── */}
     <div className="px-4 sm:px-8 md:px-10 pt-10 pb-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-shadow-md text-shadow-fuchsia-700">
          About the Zint Institute
        </h1>
        <p className="text-center font-semibold mt-1 mb-4 text-sm sm:text-base">
          "Empowering minds, shaping futures"
        </p>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-10 text-center max-w-3xl mx-auto">
          Welcome to our platform. We provide high-quality courses in Tech and Non-Tech to help students build real-world skills.
        </p>

        {/* ── VISION & MISSION — stacked on mobile, side by side on desktop ── */}
        <div className="flex flex-col md:flex-row gap-6 ">
          <div className="bg-gray-100 p-5 shadow-xl mb-2 rounded-xl flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Our Vision</h1>
            <p className="text-base sm:text-lg font-semibold text-gray-700">
              The Zint Institute envisions becoming a premier centre of excellence in education, dedicated to nurturing sagacious, skilled and confident individuals. Our vision is to create a dynamic learning environment that inspires innovation, leadership, and lifelong learning, enabling students to achieve academic success and make meaningful contributions to a global society.
            </p>
          </div>
          <div className="bg-gray-100 p-5 shadow-xl mb-2 rounded-xl flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h1>
            <p className="text-base sm:text-lg font-semibold text-gray-700">
              Zint Institute is committed to cultivating knowledgeable and versatile learners by providing exemplary education that combines intellectual precision with practical proficiency. Our mission is to empower learners to transcend conventional boundaries, develop articulate expression, and embody professionalism, preparing them to excel in competitive arenas and contribute with integrity and purpose. Zint Institute’s mission is to guide every student toward successful placement opportunities; therefore, ZINT launched the “Rozgar Mission,” which achieved remarkable success on 10 January 2026.
            </p>
          </div>
        </div>
      </div> 
      {/* ── PLACED STUDENTS ── */}
       <div className="mt-10 w-full">
          <PlacedStudent />
       </div>
       
      <div className="px-4 sm:px-8 md:px-10 pt-10 pb-4">

        {/* ── CORE VALUES ── */}
        <h1 className="text-2xl sm:text-3xl text-pink-700 font-bold mb-6 text-center mt-8">
          Our Core Values
        </h1>

        {/* 1 col mobile → 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="shadow-2xl text-center bg-gray-100 p-5 rounded-xl">
            <h2 className="text-pink-700 text-xl sm:text-2xl font-semibold mb-2">Integrity</h2>
            <p className="text-gray-800 text-sm sm:text-base">
              We follow strong ethical principles, promoting honesty, transparency, and responsibility in learning and professional behaviour.
            </p>
          </div>
          <div className="shadow-2xl text-center bg-gray-100 p-5 rounded-xl">
            <h2 className="text-pink-700 text-xl sm:text-2xl font-semibold mb-2">Excellence</h2>
            <p className="text-gray-800 text-sm sm:text-base">
              We strive to achieve the highest standards in education, fostering intellectual focus, precision, and a steadfast commitment to excellence in all academic and professional endeavours.
            </p>
          </div>
          <div className="shadow-2xl text-center bg-gray-100 p-5 rounded-xl sm:col-span-2 md:col-span-1">
            <h2 className="text-pink-700 text-xl sm:text-2xl font-semibold mb-2">Innovation</h2>
            <p className="text-gray-800 text-sm sm:text-base">
              We support creative thinking and flexible approaches, helping students solve problems effectively and contribute new ideas in a changing world.
            </p>
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE ZINT ── */}
      <div className="mt-10 px-4 sm:px-8 md:px-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-center text-pink-700 font-bold mb-3">
          Why Choose Zint?
        </h1>
        <p className="text-base sm:text-xl text-gray-600 text-center mb-8">
          What sets us apart from the rest
        </p>

        {/* 1 col mobile → 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-5 text-pink-700 rounded-xl hover:shadow-xl transition">
            <div className="flex align-items-center gap-3">
                <SiCodementor className="text-xl sm:text-2xl mt-1" />
               <h2 className="text-xl sm:text-2xl font-bold mb-3">Personalized Mentorship</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">
              Every student receives one-on-one guidance from dedicated mentors who track progress and provide customized learning paths.
            </p>
          </div>
          <div className="bg-gray-100 p-5 text-pink-700 rounded-xl hover:shadow-xl transition">
            <div className="flex align-items-center gap-3">
                <FaIndustry className="text-xl sm:text-2xl mt-1" />
                <h2 className="text-xl sm:text-2xl font-bold mb-3">Industry-Verified Curriculum</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">
              Our curriculum is designed in collaboration with industry experts to ensure students learn skills that are relevant and in demand.
            </p>
          </div>
          <div className="bg-gray-100 p-5 text-pink-700 rounded-xl hover:shadow-xl transition sm:col-span-2 md:col-span-1">
            <div className="flex align-items-center gap-3">
                <FaComputer className="text-xl sm:text-2xl mt-1" />
                <h2 className="text-xl sm:text-2xl font-bold mb-3">State-of-the-Art Labs</h2>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">
              Students get hands-on access to modern labs and tools, enabling practical learning that goes beyond theory and textbooks.
            </p>
          </div>
        </div>
      </div>

     

      {/* ── MENTORS ── */}
      <div className="mt-6">
        <Mentor />
      </div>
      <div>
          <WhyZint/>
      </div>
       

    </div>
  );
}

export default About;
