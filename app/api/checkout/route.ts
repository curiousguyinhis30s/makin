import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { planId } = body;

        if (!planId) {
            return new NextResponse("Missing planId", { status: 400 });
        }

        // In a real app, you would verify payment here with Stripe/Moyasar

        // Find or create the service (Mocking service creation if not exists for demo)
        let service = await db.service.findUnique({
            where: { slug: planId },
        });

        if (!service) {
            service = await db.service.create({
                data: {
                    slug: planId,
                    title: JSON.stringify({ en: planId, ar: planId }),
                    description: JSON.stringify({ en: "Subscription", ar: "اشتراك" }),
                    price: 0, // Set real price
                    features: "[]",
                },
            });
        }

        const subscription = await db.subscription.create({
            data: {
                userId: session.user.id,
                serviceId: service.id,
                status: "ACTIVE",
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
        });

        return NextResponse.json(subscription);
    } catch (error) {
        console.error("CHECKOUT_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
