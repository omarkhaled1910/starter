import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_TOKEN } from "@/constants";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_TOKEN)?.value;
  console.log(token, "token in middlware");
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }

  return NextResponse.next();
}
