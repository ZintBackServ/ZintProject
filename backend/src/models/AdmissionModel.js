const mongoose = require("mongoose");
const AdmissionSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
         courseId: {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "Course",
                 required: true
         },
       

    },
    {timestaps:true}
);

module.exports = mongoose.model("Admission", AdmissionSchema);