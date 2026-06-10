
function Button({data}){
    // const categories = [...new Set(courses.map(c => c.category))];
    // console.log(categories);
    return(
        <div className=" p-4 m-5 rounded shadow w-70 hover:shadow-2xl hover:shadow-gray-400">
          
           <h2 className="text-xl font-bold mt-2"> {data.category}</h2>

        </div>  
    )
}

export default Button;