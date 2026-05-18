// app/api/users/[id]/role/route.ts
import { db } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  const { role } = await req.json();

  const user = await db.user.update({
    where: { id: Number(params.id) },
    data: { role },
  });

  return NextResponse.json(user);
}