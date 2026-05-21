// app/api/users/[id]/role/route.ts
import { getServerSession } from "next-auth";
import { db } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const VALID_ROLES = ["ADMIN", "MODERATOR", "USER"] as const;
  type Role = (typeof VALID_ROLES)[number];

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  const { role } = await req.json();

  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }


  const user = await db.user.update({
    where: { id: Number(params.id) },
    data: { role: role as Role },
  });

  return NextResponse.json(user);
}