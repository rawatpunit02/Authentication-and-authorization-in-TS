import type{Request, Response} from 'express'
import { signupPayloadModel,signinPayloadModel } from './models.js'
import {db} from '../../db/index.js'
import { usersTable } from '../../db/schema.js'
import { eq } from 'drizzle-orm'
import { randomBytes,createHmac } from 'node:crypto' 
class AuthenticationController{
 
    public async handleSignup(req:Request,res:Response){
        console.log('HI')
    const  validationResult= await signupPayloadModel.safeParseAsync(req.body)
    if(validationResult.error){
        return res.status(400).json({message:'body validation failed',error:validationResult.error})
    }

    const {firstName,lastName,email, password}= validationResult.data

    const userEmailResult= await db.select().from(usersTable).where(eq(usersTable.email,email))
    
    if(userEmailResult.length>0){
        return res.status(400).json({error:'duplicate entry',message:`user with this email ${email} already exist`})
    }
    
    const salt=randomBytes(32).toString('hex')
    const hash=createHmac('sha256',salt).update(password).digest('hex')

    const [result] = await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password:hash,
        salt
    }).returning({id:usersTable.id})
 
    return res.status(201).json({message:'user has been created successfully', data:{id: result?.id}})

    }

    public async handleSignIn(req:Request,res:Response){
     
        const validResult=await signinPayloadModel.safeParseAsync(req.body)
        
        if(validResult.error){
            return res.status(400).json({
                message:'body validation failed',
                error:validResult.error.issues
            })
        }
      
        const {email,password}= validResult.data
        const [user]= await db.select().from(usersTable).where(eq(usersTable.email,email))

        if(!user){
            return res.status(400).json({
                message:`User with this email ${email} does not exist`
            })
        }
        
        const salt=user.salt!
        const hash=createHmac('sha256',salt).update(password).digest('hex')
        if(user.password!==hash){
            return res.status(400).json({
                message:'Email or password is Incorrect'
            })
        }


        return res.json({message:'Signin Success',data:{token:1}})
    }


}

export default AuthenticationController