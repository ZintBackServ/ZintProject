import {useState} from "react";
import {useNavigate} from "react-router-dom"

function SignUp(){
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    contactNo:"",
    address:"",
    city:"",
    state:"",
    password:"",
    confirmPassword:"",
   });

   const [errors, setErrors] = useState({})
   function formValidator(){
    let formError = {};
    let {firstName, lastName, email, contactNo, address, city, state, password, confirmPassword} = formData;
    console.log(password);
    console.log(confirmPassword);

     const isValidName = /^[a-zA-Z ]*$/;

        const isValidEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

        const isValidPhone =
            /^(?:\+91)?[6-9]\d{9}$/;
            

        let isValidPassword =
              /^(?=.{8,20}$)(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;


        //first name validation
        if (firstName.trim() < 2) {
            formError.firstName = "First Name Must be 2 Character Long...";
        } else if (!isValidName.test(firstName)) {
            formError.firstName = "Invalid First Name";
        }

        //last name validation
        if (!firstName.trim()) {
            formError.lastName = "Last Name is Required";
        } else if (!isValidName.test(lastName)) {
            formError.lastName = "Invalid Last Name";
        }

        //email validation
        if (!isValidEmail.test(email)) {
            formError.email = "Invalid Email";
        }

        //contact validation
        if (!isValidPhone.test(contactNo)) {
            formError.contactNo = "Invalid Contact Number";
        }


        //address validation
        if (address.trim().length === 0) {
            formError.address = "Address is Required"
        }
        

        //city validation
        if (city.trim().length === 0) {
            formError.city = "city is Required"
        }

         //state validation
        if (state.trim().length === 0) {
            formError.state = "state is Required"
        }

        

        //password validation
        if(password.trim().length === 0){
          formError.password = "password is Required"
        }
        if (!isValidPassword.test(password)) {
            formError.password = "Password Must be between 8 to 20 Character long and includes Uppercase, Lowercase, Number and Special Character";
        }

        //confirmpassword validation
        if(password !== confirmPassword){
          formError.confirmPassword = "password  and confirm password do not match";
        }
        return formError;
   }

   const changeHandler = (e) => {
        //console.log(e.target.name);
        let { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        setErrors((prev)=>({
            ...prev,
            [name]: "",
        }));
        // localStorage.setItem("formData",JSON.stringify({...formData, [name]:value}));

    };

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(formData);
    try {
         const validate = formValidator();
         setErrors(validate);

         if (Object.keys(validate).length === 0) {
             const { confirmPassword, ...userData } = formData;     //confirm passwrod key is not stored in userData
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/newUser`, {
              method: "POST",    
             headers:{
               "Content-Type":"application/json",
             },
             body: JSON.stringify(userData),
           });
             
          //  console.log(response);
            const result = await response.json(); 
            if (response.status === 400) {  //if status code is 400
               console.log("this email or contact number already registered, enter another email or contact    number")
               await alert("this email or contact number already registered, enter another email or contact number");
               console.log("Error:", result.msg);
             }else if (response.status === 500){    //is status code is 500
                 await alert("Internal server Error");
             } else if(response.status === 201) {     //if data save in database
                console.log("Success:", result.msg);
                await alert("Form submitted successfully")
                navigate("/login");  //navigate to login page after signup successfully
             }

           if(response.ok){
                setFormData({
                    firstName:"",
                    lastName:"",
                    email:"",
                    contactNo:"",
                    address:"",
                    city:"",
                    state:"",
                    password:"",
                    confirmPassword:"",
                 });
             }
            
          }
    } catch (err) {
    console.log(err);
  }
};
       
return(
  <>
     <div>
        <form className="h-screen w-screen text-black bg-white-400 flex flex-col items-center " onSubmit={submitHandler}>

          <h1
             className="text-blue-700 font-bold text-4xl mt-20"
           >
             Registration Form
          </h1>
          <div  
             className ="h-auto w-3/4 md:w-1/2 md:text-sm  mt-4 bg-emrald-100 flex flex-col shadow-lg shadow-indigo-300 gap-2 rounded p-5 "
            >
            
             <div className="flex flex-row gap-4 items-center">
             <label htmlFor="firstName" className="text-lg font-semibold">First Name: </label>    
             <input
                 className="w-1/1 p-2  border border-gray-500  hover:shadow-blue-300 rounded-2xl" 
                 type="text" 
                 id="firstName"
                 name="firstName"
                 value={formData.firstName}
                 onChange={changeHandler}
                 placeholder="enter first name "
               />
            </div>
            {errors.firstName && (<span className="text-red-500 font-semibold">{errors.firstName}</span>)}


            <div className="flex flex-row gap-4 items-center">
             <label htmlFor="lastName" className="text-lg font-semibold">Last Name: </label>    
             <input
                 className="w-1/1 p-2 border border-gray-500  hover:shadow-blue-300 rounded-2xl" 
                 type="text" 
                 id="lastName"
                 name="lastName"
                 value={formData.lastName}
                 onChange={changeHandler}
                 placeholder="enter last name "
               />
            </div>
            {errors.lastName && (<span className="text-red-500 font-semibold">{errors.lastName}</span>)}

            <div className="flex flex-row gap-4 items-center">
             <label htmlFor="email" className="text-lg font-semibold">Email: </label>    
             <input
                 className="w-1/1 p-2 ml-10 border border-gray-500  hover:shadow-blue-300 rounded-2xl" 
                 type="email"
                 id="email"
                 name="email" 
                 value={formData.email}
                 onChange={changeHandler}
                 placeholder="enter email address"
               />
            </div>
            {errors.email && (<span className="text-red-500 font-semibold">{errors.email}</span>)}

            <div className="flex flex-row gap-4 items-center">
             <label htmlFor="contactNo" className="text-lg font-semibold">contactNo.: </label>    
             <input
                 className="w-1/1 p-2 border border-gray-500  hover:shadow-blue-300 rounded-2xl" 
                 type="tel"
                 id="contactNo"
                 name="contactNo"
                 onChange={changeHandler} 
                 value={formData.contactNo}
                 placeholder="enter phone number "
               />
            </div>
            {errors.contactNo && (<span className="text-red-500 font-semibold">{errors.contactNo}</span>)}

            <div className="flex flex-row gap-4 items-center">
             <label htmlFor="address" className="text-lg font-semibold">Address: </label>    
             <input
                  type="text" id="address" value={formData.address} name="address"  onChange={changeHandler}
                 className="w-1/1 p-2 ml-5 border border-gray-500  hover:shadow-blue-300 rounded-2xl" 
                 placeholder="enter your address "
               />
            </div>
              {errors.address && (<span className="text-red-500 font-semibold">{errors.address}</span>)}


            <div className="flex flex-row gap-4 items-center">
             <label htmlFor="city" className="text-lg font-semibold">city: </label>    
             <input
                 className="w-1/1 p-2 ml-14 border border-gray-500  hover:shadow-blue-300 rounded-2xl" 
                 type="text" 
                 id="city"
                 name="city"
                 value={formData.city}
                 onChange={changeHandler}
                 placeholder="enter your city name "
               />
               <label htmlFor="state" className="text-lg font-semibold">State: </label>    
             <input
                 className="w-1/1 p-2 ml-2 border border-gray-500  hover:shadow-blue-300 rounded-2xl" 
                 type="text"
                 id="state" 
                 name="state"
                 onChange={changeHandler}
                 value={formData.state}
                 placeholder="enter your state name "
               />
            </div>
            {errors.city && (<span className="text-red-500 font-semibold">{errors.city}</span>)}
            {errors.state && (<span className="text-red-500 font-semibold">{errors.state}</span>)}


            <div className="flex flex-row gap-4 items-center">
             <label htmlFor="password" className="text-lg font-semibold">Password: </label>    
             <input
                 className="w-1/1 p-2 ml-2 border border-gray-500  hover:shadow-blue-300 rounded-2xl" 
                 type="password" 
                 id="password"
                 value={formData.password}
                 onChange={changeHandler}
                 name="password"
                 placeholder="enter your password"
               />
            </div>
            {errors.password && (<span className="text-red-500 font-semibold">{errors.password}</span>)}
            
            <div className="flex flex-row gap-4 items-center">
             <label htmlFor="confirmPassword" className="text-lg font-semibold">Confirm Password: </label>    
             <input
                 className="w-[140%] p-2 border border-gray-500  hover:shadow-blue-300 rounded-2xl" 
                 type="password" 
                 id="confirmPassword"
                 value={formData.confirmPassword}
                 onChange={changeHandler}
                 name="confirmPassword"
                 placeholder="enter same password"
               />
            </div>
            {errors.confirmPassword && (<span className="text-red-500 font-semibold">{errors.confirmPassword}</span>)}
              
            <button
            onClick={submitHandler}
             type="submit"
             className="w-1/1 p-2 text-white bg-indigo-500 shadow-lg shadow-indigo-500/50 rounded-2xl hover:bg-indigo-600"
            >
              Submit Form
            </button>
          </div>
        </form>
    </div>
  </>
    )
}

export default SignUp;