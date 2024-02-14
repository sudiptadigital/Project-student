const validator = require('validator');
const db = require('../db.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { log } = require('console');




exports.getStudentController = asyncHandler(async function(req, res, next){
        const { search,  pageNumber = 1, pageSize = 10} = req.query;
        const offset = (pageNumber - 1) * pageSize;
  
        if (search) {
          query = `SELECT * FROM tbl_students WHERE lower(first_name) LIKE $1 OR lower(last_name) LIKE $1 OR lower(email) LIKE $1`;
          const result = await db.query(query, [`%${search.toLowerCase()}%`]);
          
          if(!result.rowCount){
            return next(new ApiError(500, "Students not found!!!"));
          }
        
          return res.status(200).json(
            new ApiResponse(201, result.rows, "Students data found successfully")
          )
        };

        const result = await db.query(`SELECT * FROM tbl_students LIMIT $1 OFFSET $2`,[pageSize, offset]);
        if(!result.rowCount){
            return next(new ApiError(500, "Students not found!!!"));
        }
        
        return res.status(200).json(
            new ApiResponse(201, result.rows, "Students data found successfully")
        );
 
      
});

exports.saveStudentDetails = asyncHandler(async  function(req, res, next){
    
        const { first_name, last_name, email, subject_ids } = req.body;

        if(first_name.length<3){
            return next(new ApiError(400, "first name charecter is less than three"));
        }

        if(last_name.length<3){
            return next(new ApiError(400, "last name charecter is less than three"));
        }

        if(!validator.isEmail(email)){
            return next(new ApiError(400, "email is invalid"));
        }

        const subjects = await db.query(
            `SELECT * FROM master_tbl_subjects`
        )

        if((subject_ids.length>=3 && subject_ids.length<=5)){
            for(let i=0; i<subject_ids.length; i++){
                let count = 0;
                let id = subject_ids[i]
                for(let j=0; j<subjects.rowCount; j++){
                    if(subjects.rows[j]['sub_id'] == id ){
                        count++;
                    }
                }
                if(!count){
                    return next(new ApiError(501, "Subject id invalid!!!"))
                }

            }
        }else{
            return next(new ApiError(500, "max or min subject limit not fulfilled!!!"));
        }

        const result = await db.query(
                `SELECT add_data_to_students_tbl($1, $2, $3, $4)`,
                 [first_name, last_name, email, subject_ids ]
            );

            if(!result.rowCount){
                return next(new ApiError(500, "Student not saved"))
            };
            
            return res.status(200).json(
                new ApiResponse(201, result.rows, "Student saved successfully")
            );


});

exports.updateStudentController = asyncHandler(async function (req, res, next) {
    const { email } = req.params;
    const { first_name, last_name, subject_ids } = req.body;

    const validEmail = await db.query(
        `SELECT * from tbl_students WHERE email = $1`,
        [email]
    )
    if(!validEmail.rowCount){
        return next(new ApiError(500, "Invalid email address!!!"))
    };

    const result = await db.query(
        `SELECT update_data_in_students_tbl($1, $2, $3, $4)`,
        [first_name || null, last_name || null,subject_ids || null, email]
    )

    if(!result.rowCount){
        return next(new ApiError(500, "Student not updated"))
    };
    
    return res.status(200).json(
        new ApiResponse(201, result.rows, "Student updated successfully")
    );

})
exports.deleteStudentController = asyncHandler(async function(req, res, next){
    const { email } = req.params;
    const validEmail = await db.query(
        `SELECT * from tbl_students WHERE email = $1`,
        [email]
    )
    if(!validEmail.rowCount){
        return next(new ApiError(500, "Invalid email address!!!"))
    };

    const result = await db.query(
        `DELETE FROM tbl_students WHERE email = $1`,
        [email]
    )

    if(!result.rowCount){
        return next(new ApiError(500, "Student not deleted"))
    };
    
    return res.status(200).json(
        new ApiResponse(201, result.rows, "Student deleted successfully")
    );
})



