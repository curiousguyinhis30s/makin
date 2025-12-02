import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { type, title, description } = body;

        if (!type || !title || !description) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const serviceRequest = await db.serviceRequest.create({
            data: {
                userId: session.user.id,
                type,
                title,
                description,
                status: "Pending",
            },
        });

        return NextResponse.json(serviceRequest);
    } catch (error) {
        console.error("[REQUESTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        let requests;
        if (session.user.role === "ADMIN") {
            requests = await db.serviceRequest.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            requests = await db.serviceRequest.findMany({
                where: {
                    userId: session.user.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        return NextResponse.json(requests);
    } catch (error) {
        console.error("[REQUESTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
