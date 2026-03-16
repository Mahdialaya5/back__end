const isAdmin = (req, res, next) => {
    if (req?.user?.role === "admin") {
        next()
        return;
    }
    return  res.status(401).json({msg: "Access denied."})
}

module.exports=isAdmin