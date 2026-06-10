import { useNavigate } from "react-router-dom";

function Card({data}){
     const navigate = useNavigate();
   
    return(
        <div className="  rounded shadow w-80 hover:shadow-2xl overflow-hidden hover:shadow-gray-400">
           <img src={data.courseImage} alt={data.courseName} className="w-full h-50 object-full"/>
         
           <div className="flex flex-col flex-1 p-5 gap-3">
               {/* Course title */}
                <h3 className="text-gray-900 font-bold text-[15px] leading-snug line-clamp-2">
                   {data.courseName}
                </h3>

                {/* Info pills */}
                <div className="flex flex-wrap gap-2">
                       {data.duration && (
                            <span 
                             className="text-[11px] bg-orange-50 text-orange-500 font-semibold px-3 py-1 rounded-full"
                            >
                              ⏱ {data.duration}
                            </span>
                       )}
                       {data.mode && (
                           <span 
                             className="text-[11px] bg-blue-50 text-blue-500 font-semibold px-3 py-1 rounded-full"
                            >
                             🖥 {data.mode}
                            </span>
                        )}
                       {data.language && (
                            <span 
                               className="text-[11px] bg-green-50 text-green-600 font-semibold px-3 py-1 rounded-full"
                            >
                              🗣 {data.language}
                           </span>
                        )}
                    </div> 

                    {/* Short description */}
                       {data.about && (
                             <p className="text-gray-400 text-[12px] leading-relaxed line-clamp-3">
                                {data.about}
                             </p>
                       )}

                    {/* Push footer to bottom */}
                       <div className="flex-1" />

                    {/* ── Footer ── */}
                    <div className="flex items-center justify-between border-t border-gray-100">
                        <button
                            
                            onClick={() => navigate(`/courses/${course._id}`)}
                            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-orange-200"
                        >
                         View More →
                        </button>
                    </div>
                </div>
           {/* <p className="text-gray-600 line-clamp-3 ">description: {data.about}</p> */}
        
        </div>  
    )
}

export default Card;
 {/* ── Card Body ── */}
    //   <div className="flex flex-col flex-1 p-5 gap-3">

    //     {/* Course title */}
    //     <h3 className="text-gray-900 font-bold text-[15px] leading-snug line-clamp-2">
    //       {course.courseName}
    //     </h3>

    //      {/* Info pills */}
    //     <div className="flex flex-wrap gap-2">
    //       {course.duration && (
    //         <span className="text-[11px] bg-orange-50 text-orange-500 font-semibold px-3 py-1 rounded-full">
    //           ⏱ {course.duration}
    //         </span>
    //       )}
    //       {course.mode && (
    //         <span className="text-[11px] bg-blue-50 text-blue-500 font-semibold px-3 py-1 rounded-full">
    //           🖥 {course.mode}
    //         </span>
    //       )}
    //       {course.language && (
    //         <span className="text-[11px] bg-green-50 text-green-600 font-semibold px-3 py-1 rounded-full">
    //           🗣 {course.language}
    //         </span>
    //       )}
    //     </div> 

    //     {/* Short description */}
    //     {/* {course.about && (
    //       <p className="text-gray-400 text-[12px] leading-relaxed line-clamp-3">
    //         {course.about}
    //       </p>
    //     )} */}

    //     {/* Push footer to bottom */}
    //     {/* <div className="flex-1" /> */}

    //     {/* ── Footer ── */}
    //     <div className="flex items-center justify-between  border-t border-gray-100">
    //       <button
    //         onClick={onKnowMore}
    //         className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-orange-200"
    //       >
    //         Know More →
    //       </button>
    //     </div>
    //   </div>

