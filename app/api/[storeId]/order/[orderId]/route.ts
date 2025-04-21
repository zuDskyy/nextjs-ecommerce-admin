import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    props: { params: Promise<{ storeId: string, orderId: string }> }
) {
    const params = await props.params;
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.orderId) {
            return new NextResponse("Color id is required", { status: 400 })
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        await prismadb.orderItem.deleteMany({
            where: { orderId: params.orderId }
        });
        const order = await prismadb.order.deleteMany({
            where: {
                id: params.orderId,

            }
        });

        return NextResponse.json(order);

    } catch (error) {
        console.log("[ORDER_DELETE]", error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}