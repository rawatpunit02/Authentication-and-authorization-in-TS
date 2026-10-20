import  express  from "express";
import type { Express } from "express";
import {authRouter} from './auth/routes.js'
export function createApplication():Express{
    const app=express()
     
    app.use(express.json())
    
    app.get('/',(req,res)=>{
       
     return res.json({
        message:"health is good"
     })
    })

  app.use('/auth',authRouter)
  
    return app
} 