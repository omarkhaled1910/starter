import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase";
// import connectMongo from "../../db";

export type UserLogDto = {
  walletAddress: string;
};

export async function POST(req: NextRequest) {
  try {
    // await connectMongo();
    // supabaseServer.auth.admin.listUsers()
    const body = await req.json();
    console.log(body, "body", req.body, body.walletAddress);

    return NextResponse.json(
      { message: "Eadd yors" },
      { status: HttpStatusCode.BadRequest }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred: " + error },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
