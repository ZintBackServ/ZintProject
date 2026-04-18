import {useEffect, useState} from "react";
import Card from "../components/Card";

const Courses = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState([true]);
  const [error, setError] = useState(null);
  useEffect(()=>{
   fetch("http://localhost:2000/getAllCourse")   //course API
    .then((res)=> res.json())
    .then((data)=>{
      // console.log(data);
      setCards(data.courses);
      setLoading(false);
    })

    .catch((err)=> {
      console.log(err);
      setError("Failed to load courses");
      setLoading(false);
    });
  }, []);

   if (loading) return <div className="animate-pulse">
     <div className="h-40 rounded-lg bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200"></div>
    </div>
 


  if (error) return <h1>{error}</h1>;
  if (!cards.length) return <h1>No courses available</h1>;

  return (
   <> 
   
     <div className="flex gap-4 flex-wrap justify-center ">
       {cards.map((item) =>(
         <Card key = {item._id} data={item} />
       ))}
     </div>
   </>
  );
};

export default Courses;


