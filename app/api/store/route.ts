import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    props: { params: Promise<{ query: string }> }
) {
    try {
        const { userId } = await auth();
        const params = await props.params;
        const query = params.query;
        console.log(query);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!query) {
            return new NextResponse("query is required", { status: 400 });
        }

        const product = await prismadb.product.findMany({
            where: {
                name: {
                    contains: query
                }
            }
        })
        return NextResponse.json(product);
    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
export async function POST(
    req: Request,
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { name } = body;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        })
        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}