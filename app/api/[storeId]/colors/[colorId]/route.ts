import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function GET(req: Request, props: { params: Promise<{ colorId: string }> }) {
    const params = await props.params;
    try {



        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: 400 })
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });


        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_GET]", error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    props: { params: Promise<{ storeId: string, colorId: string }> }
) {
    const params = await props.params;
    try {
        const { userId } =await auth();
        const body = await req.json();
        const { name, value } = body;
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });

        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }
        if (!value) {
            return new NextResponse("Value is required", { status: 400 })
        }
        if (!params.colorId) {
            return new NextResponse("Store id is required", { status: 400 })
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
        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                 name,
                 value
            }
        });
        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_PATCH]", error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}


export async function DELETE(
    req: Request,
    props: { params: Promise<{ storeId: string, colorId: string }> }
) {
    const params = await props.params;
    try {
        const { userId } = await auth();


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });

        }

        if (!params.colorId) {
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
        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,

            }
        });


        return NextResponse.json(color);

    } catch (error) {
        console.log("[COLOR_DELETE]", error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}