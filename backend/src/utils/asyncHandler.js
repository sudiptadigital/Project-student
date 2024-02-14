const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
       (requestHandler(req, res, next)).catch(next)
    }
}


module.exports = asyncHandler;