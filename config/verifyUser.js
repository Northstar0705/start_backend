export const verifyMentee = (req,res,next) =>{
    console.log(req.session)
    const {user} = req.session
    if(!user){
        return res.status(401).json({errorMessage: "Please login first"})
    }
    next()
}

export const verifyAdmin = (req,res,next) =>{
    const {admin} = req.session
    if(!admin){
        return res.status(401).json({errorMessage: "Please login first"})
    }
    next()
}

export const verifyMentor = (req,res,next) =>{
    const {mentor} = req.session
    if(!mentor){
        return res.status(401).json({errorMessage: "Please login first"})
    }
    // console.log(mentor)
    next()
}