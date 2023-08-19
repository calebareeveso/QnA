"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
export default function visitorsWarning() {
  const { data: session } = useSession();

  return (
    session !== null ?
     <div></div> : <div className="visitors_warning">
     <p>Administrator privilege, reserved exclusively for <Link href={'https://www.calebareeveso.com'}>CALEB 😎</Link>, is required for content editing, removal, and addition.
       
     </p>
 </div> 
    
  );
}