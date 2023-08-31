"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OrderColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: OrderColumn;

};

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const params= useParams();
    const router= useRouter();
    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);
    const onCopy = (id:string) => {
        navigator.clipboard.writeText(id);
        toast.success("  copied to the clipboard");
    }


    const onDelete = async () => {
        try{
              setLoading(true);
              await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
              router.refresh();
              toast.success("Billboard deleted.")
        }catch(error){
            toast.error("Make sure you removed all categories  using this billboard first.")
        }finally{
            setLoading(false);
            setOpen(false);
        }
      }
    return (
        <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onCopy(data.id)}>
                <Copy className="mr-2 h-2 w-4"/>
                Copy Id
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
                <Edit className="mr-2 h-2 w-4"/>
                Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Trash className="mr-2 h-2 w-4"/>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    );
};