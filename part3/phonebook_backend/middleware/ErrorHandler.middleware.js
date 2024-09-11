module.exports = errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === "CastError"){
        response.status(400).send({
            error: "malformated id"
        })
    }

    next(error)
}
