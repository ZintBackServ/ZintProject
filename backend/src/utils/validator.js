 const  isValid = (input) => {       //it checks input field, if user enter number , undefined , null, empty array then it return false else true. 
    if( typeof input === "undefined" || input === null  || (typeof input === "number")||
        ( input.trim().length === 0)
    ){
       return false;
    }
    return true;
};

const isEmpty = (input) =>{
    return true;
}

const  isValidName = (input) => {  
    if(!isValid(input)){
        return false;
    }
   return /^[A-Za-z ]*$/.test(input);
}


const isValidEmail = (input) =>{
    isValid();
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
}


const isValidContact = (input) =>{
    isValid();
    return /^[6-9]\d{9}$/.test(input);
}

const isValidPassword = (input) =>{
    isValid();
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/.test(input);
}


 const validators = {
  firstName : isValidName,
  lastName : isValidName,
  email : isValidEmail,
  contactNo : isValidContact,
  address : isValid,
  city : isValidName,
  state : isValidName,
  password : isValidPassword
};

const courseValidation = {
  courseImage:isValid,
  courseName:isValid,
  duration:isValid,
  fee:isValid,
  about:isValid,
  type:isValid,
  category:isValid,
  subCategory:isValid,
  trending:isValid,
  mode:isValid,
  startDate:isEmpty,
  language:isEmpty,
  courseCurriculum:isEmpty,
  certificateImage:isEmpty,
  rating:isEmpty,
}
module.exports = {
    isValid,
    isValidName,
    isValidEmail,
    isValidPassword,
    validators,
    courseValidation
};
