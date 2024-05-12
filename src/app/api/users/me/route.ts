import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/helper/getDataFromToken';

connect()

export async function POST(request: NextRequest) {
    // extract data from token
    const userId = await getDataFromToken(request)

    //  .select("-password") use to not get password - is used in select
    const user = await User.findOne({ _id: userId }).select("-password")

    // check if there is no user
    return NextResponse.json({
        message: "user found",
        data: user
    })

}