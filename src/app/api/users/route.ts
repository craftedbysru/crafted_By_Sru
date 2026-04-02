import { NextResponse } from "next/server";
import * as userService from "@/services/userService";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, action, name } = body;
  let user = await userService.findUserByEmail(email);
  
  if (action === "signup") {
    if (user) return NextResponse.json({ error: "User already exists" }, { status: 400 });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await userService.createUser({
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
      role: "customer"
    });
    return NextResponse.json(user, { status: 201 });
  }

  if (action === "signin") {
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json(user);
  }

  return NextResponse.json(user);
}
