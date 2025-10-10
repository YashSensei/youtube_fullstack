import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try{
        const token = req.cookies?.accessToken || req.header?.("Authorization")?.replace("Bearer ", "");
        if (!token){
            throw new ApiError(401, "unauthorized request");
        }   
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        await User.findById(decodedToken?._id).select("-password -refreshToken").then((user)=>{
            if (!user){
                throw new ApiError(401, "unauthorized request");
            }
            req.user = user;
            next();
        });
    }catch(error){
        throw new ApiError(401, error?.message || "invalid access token");
    }

});

