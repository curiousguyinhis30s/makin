import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserPermissions, getUserRoles } from "@/lib/rbac";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [permissions, roles] = await Promise.all([
      getUserPermissions(session.user.id),
      getUserRoles(session.user.id),
    ]);

    return NextResponse.json({
      permissions,
      roles,
      userId: session.user.id,
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
