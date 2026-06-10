function MentorCard({data}){
    return(
        <div className=" m-5 rounded shadow w-70 bg-white hover:shadow-md hover:shadow-white">
           <img src={data.profileImage} alt={data.profileImage} className=" w-full h-50 object-cover"/>
           <h2 className="text-lg px-2 font-bold mt-2"> {data.mentorName}</h2>
           <h2 className="text-md px-2 text-gray-800 font-bold "> {data.expertise}</h2>
           <h2 className="text-md px-2 text-gray-800 font-bold ">{data.experience} year</h2>
           <p className="text-md px-2 text-gray-800"> {data.bio}</p>
        </div>  
    )
}

export default MentorCard;