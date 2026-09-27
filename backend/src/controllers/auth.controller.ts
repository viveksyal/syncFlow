import { getMe, loginUser, registerUser } from "../services/auth.service.js";
import type { Request, Response } from "express";


export async function registerController(req: Request, res: Response){
    const {email, password, name} = req.body;
    const newUser = await registerUser({email, password, name});
    return res.status(201).json({
        message: "User registered successfully",
        name: newUser.name,
        email: newUser.email
    })
}

export async function loginController(req: Request, res: Response){
    const {email, password} = req.body;
    const token = await loginUser({email, password});
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000*60*60*24*7 
    });
    return res.status(200).json({
        message: "User logged in successfully",
    })
}

export async function logoutController(req: Request, res: Response){

    res.clearCookie('token')
    return res.status(200).json({
        message: "User logged out successfully",
    })
}

export async function meController(req: Request, res: Response){
    const userId = req.user.userId;
    const userData = await getMe(userId);
    res.status(200).json({
        id: userData.id,
        name: userData.name,
        email: userData.email
    });
}