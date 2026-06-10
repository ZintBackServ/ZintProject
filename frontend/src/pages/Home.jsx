import {useState, useEffect} from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ImageSlider from "../components/HomeImageSlider";
import LatestUpdates from "../components/LatestUpdates";
import CompanyLogo from "../components/CompanyLogoSlider";
import CourseSlider from "./trendingCourseSlider";
import PlacedStudentsSlider from "../components/PlacedStudentSlider"
import Location from "../components/Location"
import Reviews from "../components/Reviews"
import ContactUs from "../components/ContactUs"
import Mentor from "./Mentor"; 


const trend=[["Full Stack Programming","6 Months"],["AI Tools and Prompting","10 Weeks"],["Cloud and DevOps","4 Months"],["Tally with GST","8 Weeks"]];

const Title=({tag,title,text})=><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.28em] text-sky-700">{tag}</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{title}</h2><p className="mt-4 text-base leading-7 text-slate-600">{text}</p></div>;
const hero=[["Admissions Open","Build job-ready skills at Zint Institute.","Learn programming, AI, cloud, steno, tally, and more with practical classes."],["Upcoming Events","Join workshops, seminars, and scholarship offers.","We run demo classes, career guidance sessions, and admission campaigns."],["Placement Focus","Training that moves students toward real careers.","Projects, interview prep, and company exposure are built into our programs."]];

function Home() {

     const [menu,setMenu]=useState(false);
     const [heroIndex,setHeroIndex]=useState(0);
     const [trendIndex,setTrendIndex]=useState(0);
     const [category,setCategory]=useState("Programming");
      useEffect(()=>{const a=setInterval(()=>setHeroIndex(i=>(i+1)%hero.length),5000);
        const b=setInterval(()=>setTrendIndex(i=>(i+1)%trend.length),3500);
        return()=>{clearInterval(a);clearInterval(b);};},[]);
     const visible=[0,1,2].map(i=>trend[(trendIndex+i)%trend.length]);
  return (
   <div className="">
     <ImageSlider/>
     <LatestUpdates/>
     <CourseSlider/>
     <PlacedStudentsSlider/>
     <CompanyLogo/>
     

    <section 
      id="home" className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
      <div  
          className="rounded-[36px] bg-gray-800 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:p-10"
        >
           <p className="inline-flex rounded-full  bg-white/10 px-4 py-2 text-sm font-semibold text-amber-300">{hero[heroIndex][0]}</p>
           <h1 className="mt-6 text-4xl font-black h-40 leading-tight tracking-tight sm:text-5xl">{hero[heroIndex][1]}</h1>
           <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{hero[heroIndex][2]}</p>
           <div className="mt-8 flex flex-wrap gap-3">
              <a 
                href="#course" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950">Explore Courses
              </a>
              <a 
                href="#events" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Upcoming Events
              </a>
            </div>
            <div className="mt-8  flex items-center justify-between">
            <div 
               className="flex gap-2">
              {hero.map((s,i)=>
               <button
                key={s[0]} 
                type="button" 
                onClick={()=>setHeroIndex(i)} 
                className={`h-3 rounded-full ${i===heroIndex?"w-10 bg-amber-300":"w-3 bg-white/30"}`} 
               /> 
              )}
             </div>
            <div className="flex gap-2">
             <button 
              type="button" onClick={()=>setHeroIndex(i=>(i-1+hero.length)%hero.length)}   className="rounded-full border border-white/15 p-3">
              <ChevronLeft className="h-4 w-4" />
             </button>
             <button 
              type="button" onClick={()=>setHeroIndex(i=>(i+1)%hero.length)} className="rounded-full border border-white/15 p-3">
              <ChevronRight className="h-4 w-4" />
             </button>
          </div>
        </div>
      </div>
    
     <div className="space-y-5 ">
       <div 
          className="rounded-[32px] border border-orange-200 bg-[linear-gradient(135deg,_#fff2d7,_#ffe5e5)] p-7 hover:shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-orange-700">Upcoming Events and Offers</p>
          <div 
           className="mt-6 space-y-4">{["Free AI seminar - 20 April","Full Stack demo class and scholarship test","Admission offer up to 25% off selected batches"].map(i=><div key={i} className="rounded-3xl bg-white/75 p-4 font-semibold text-slate-700">{i}</div>)}
          </div>
        </div>
        <div  
          className="rounded-[32px] border border-sky-100 bg-white p-7 shadow-[0_20px_50px_rgba(14,165,233,0.08)] hover:shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-sky-700">Why Choose Us</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="text-xl font-extrabold">100% Placement Support</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Resume help, mock interviews, and interview guidance.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="text-xl font-extrabold">Flexible Batches</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Morning, evening, and weekend batch options.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Mentor/>
    <ContactUs/>
    <Reviews/>
    <Location/>
   </div>
  );
};

export default Home;

