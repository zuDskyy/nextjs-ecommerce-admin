import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizesPage = async (
    props: {
        params: Promise<{ sizeId: string }>
    }
) => {
    const params = await props.params;
    const sizes = await prismadb.size.findUnique({
        where: {
            id: params.sizeId
        }
    });

    return (
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8">
                <SizeForm initialData={sizes} />
            </div>
        </div>);
}

export default SizesPage;