export const verifyAdmin = (req,res,next) =>{
    const {token} = req.cookies
    if(!token){
        return res.status(401).json({errorMessage: "Unauthorized"})
    }
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if(verified.role !== 'admin'){
            return res.status(401).json({errorMessage: "Unauthorized"})
        }
        req.user = verified
        next()
    }catch(err){
        console.error(err)
        res.status(401).json({errorMessage: "Unauthorized"})
    }
}