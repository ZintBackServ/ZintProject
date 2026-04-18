import {useNavigate} from "react-router-dom";

function Login() {
   const navigate = useNavigate();
   const handleSignUp = () => {
    navigate("/signup")
   }
  return (
  <>
   
    <div 
         className="h-screen w-screen text-black bg-white-400 flex  flex-col items-center "
       >
        <h1
           className="text-blue-700 font-bold text-4xl mt-20"
          >
           Login in to ZInstitute
          </h1>
          <div  
             className ="h-1/2 w-3/4 md:w-1/2 md:text-lg font-semibold mt-6 bg-emrald-100 flex flex-col shadow-md rounded items-center gap-4 p-6"
            >
            <input
               className="w-1/1 p-2 border-2 border-gray-300  hover:border-black rounded-2xl" 
               type="text" 
               placeholder="Email address or phone number"
               />
            <input 
              className="w-1/1 p-2 border-2 border-gray-300 hover:border-black rounded-2xl" 
              type="text" 
              placeholder="password"
            />
            <button
            className="w-1/1 p-2 text-white bg-indigo-500 rounded-2xl hover:bg-indigo-600"
            >
              Log in
            </button>

            <button 
             className="w-1/1 p-2 hover:bg-gray-200 rounded-2xl "
            >
              Forgotten password?
            </button>

            <button 
              onClick={handleSignUp}
              className="w-1/1 p-2 text-blue-500  border-2 border-indigo-600 rounded-2xl hover:bg-gray-200 mt-5"
            >
              Create new account
            </button>
          </div>
   </div>
  </>
  );
};

export default Login;