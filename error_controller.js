const httpStatus = require("http-status-codes");
// handle all request not handled.
// return : 404 not found.
// redirect : to error page.
exports.pageNotFound = (req , res) => {
    let error = httpStatus.NOT_FOUND;
    res.status(error);
    res.send("this a warning next i will ban you from the server");
};
// handle any internal server probleme
// return : 500 internal server error.
// redirect : to internalservererror page.
exports.internalServerError = (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    res.status(errorCode);
    res.render("internalServerError");
    res.send(`${errorCode} | Sorry, our application is taking a nap!`);
    res.send("this a warning next i will ban you from the server");

};