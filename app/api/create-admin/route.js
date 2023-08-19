import connectMongoDB from "@/lib/db/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    // --------- UNCOMMENT ---------

    // const hashedPassword = await bcrypt.hash("Password12345678#", 10);
    // await connectMongoDB();
    // await User.create({
    //   name: "Caleb Areeveso",
    //   email: "calebareeveso7@gmail.com",
    //   password: hashedPassword,
    // });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
