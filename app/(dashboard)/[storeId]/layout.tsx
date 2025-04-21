import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout(
  props: {
      children: React.ReactNode;
      params: Promise<{ storeId: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  console.log("first",params?.storeId);
  const {userId} = await auth();

  if(!userId){
       redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
        where:{
          id:params?.storeId as string,
          userId
        }
  })

  if(!store){
    redirect('/');
  }



  return(
    <>
       <Navbar/>
       <div className="container mx-auto ">

        {children}
       </div>
  
        </>
  )
}