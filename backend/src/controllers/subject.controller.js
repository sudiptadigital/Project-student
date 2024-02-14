const db = require('../db.js')
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const asyncHandler = require('../utils/asyncHandler.js');

exports.getSubjectController = asyncHandler(async function(req, res, next){
 
        const result = await db.query('SELECT * FROM master_tbl_subjects');

        if(!result.rowCount){
            return next(new ApiError(500, "Subjects not found"))
        };
        
        return res.status(200).json(
            new ApiResponse(201, result.rows, "Subject saved successfully")
        );

})

exports.saveSubjectController = asyncHandler(async function(req, res, next){
        const { sub_name } = req.body;

        const result = await db.query(`SELECT add_data_to_subject_tbl($1)`,[sub_name]);

        if(!result.rowCount){
            return next(new ApiError(500, "Subject not saved"))
        };
        
        return res.status(200).json(
            new ApiResponse(201, result.rows, "Subject saved successfully")
        );
    
});