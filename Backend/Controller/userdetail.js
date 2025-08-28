import { createUser } from "../Model/usermode.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        console.log("Request received", req.body);

        // Accept either {firstname, lastname} or a single {name}
        const { firstname, lastname, name, email, password } = req.body;

        // Derive first/last name if only `name` provided
        let finalFirstName = firstname;
        let finalLastName = lastname;
        if ((!finalFirstName || !finalLastName) && name) {
            const parts = String(name).trim().split(/\s+/);
            finalFirstName = finalFirstName || parts[0] || '';
            finalLastName = finalLastName || (parts.slice(1).join(' ') || '');
        }

        // Validate required fields
        if (!finalFirstName || !finalLastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields must be filled",
            });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters",
            });
        }

        // Check if the email already exists
        const existingEmail = await createUser.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user (await the promise!)
        const newUser = await createUser.create({
            firstname: finalFirstName,
            lastname: finalLastName,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to register user",
        });
    }
};

export const login = async(req, res) => {
    try {
        const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            sucess:false,
            message:"All fields are required",
        })
    }
    const user = await createUser.findOne({email})
    console.log(email);
    console.log(user);
    if(!user){
        return res.status(400).json({
            sucess:false,
            message:"Invalid email or password",
        })
    }
    const passwordvalidation =  await bcrypt.compare(password,user.password)
    if(!passwordvalidation){
        return res.status(400).json({
            sucess:false,
            message:"Invalid email or password",
        })
    }
    const jwtSecret = process.env.SECRET_KEY || process.env.SCERATE_KEY;
    const token = Jwt.sign({userId : user ._id }, jwtSecret,{
        expiresIn:"7d"
    })
    res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
    })

    return res.status(200).json({
        sucess:true,
        message:`welcome back ${user.firstname}`,
        user,
        token
    });
        
    } catch (error) {
        return res.status(500).json({
            sucess:false,
            message:"failed to login"
        })
        
    }
}
export  const logout = async(req,res) =>{
    res.clearCookie("jwt");
    return res.status(200).json({
        sucess:true,
        message:"logout sucessfull",
        
    })
}







