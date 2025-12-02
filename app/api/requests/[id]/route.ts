import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    try {
        const serviceRequest = await db.serviceRequest.findUnique({
            where: {
                id,
            },
            include: {
                documents: true,
                comments: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!serviceRequest) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (serviceRequest.userId !== session.user.id && session.user.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 });
        }

        return NextResponse.json(serviceRequest);
    } catch (error) {
        console.error("[REQUEST_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    try {
        if (session.user.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const body = await req.json();
        const { status } = body;

        const serviceRequest = await db.serviceRequest.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        return NextResponse.json(serviceRequest);
    } catch (error) {
        console.error("[REQUEST_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
