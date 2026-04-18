function Card({data}){
    return(
        <div className=" p-4 m-5 rounded shadow w-70 hover:shadow-2xl hover:shadow-gray-400">
           <img src={data.courseImage} alt={data.courseName} className="w-full h-50 object-cover"/>
           <h2 className="text-xl font-bold mt-2">course: {data.courseName}</h2>
           <h2 className="text-xl font-bold mt-2">duration: {data.duration}</h2>
           <h2 className="text-xl font-bold mt-2">fee: {data.fee}</h2>
           <p className="text-gray-600">description: {data.about}</p>
        </div>  
    )
}

export default Card;


