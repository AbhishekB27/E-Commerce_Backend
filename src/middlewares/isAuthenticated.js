import { verifyJWT } from "../uitls/jwt"

const isAuthenticated = (req,res,next)=>{
    let message = {
        success: false,
        data:null,
        message:''
    }
    const bearerToken = req.headers['x-access-token'] || req.headers['Authorization']
    const token = bearerToken && bearerToken.split(' ')[1]
    console.log("Bearer token: " + bearerToken)
    console.log("Token: "+ token)
    try {
        if(!token){
            message = {
                success:false,
                data: null,
                message:'Access token not found'
            }
            return res.send(message)
        }
        const tokenVerification = verifyJWT(token)
        console.log(tokenVerification)
       if(tokenVerification){
            next() 
        }else{
            message = {
                success:false,
                data: null,
                message:'Token Expired'
            }
            return res.send(message)
        }
    } catch (error) {
        console.log(error.message)
    }
    
}

export default isAuthenticated