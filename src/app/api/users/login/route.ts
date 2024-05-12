import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { error } from 'console';
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody
        // validation
        console.log(reqBody)

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "User Not found" }, { status: 400 })
        }
        console.log("User exist")

        // compare method is bcrypt method
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 400 })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        // .sign method is jwt method
        //  process.env.TOKEN_SECRET  ! this sign sure that secret come  from .env file
        // also no need of await  here because it will not take time to generate the token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

        const response = NextResponse.json({
            message: "Logged in successfully",
            success: true
        })

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}