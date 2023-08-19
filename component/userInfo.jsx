"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div className="user_info_layout">
    <div className="user_info_container">
      <div className="user_info_details">
        <span className="font-bold">Welcome {session?.user?.name} 👋🏾</span>
      </div>
      <div >
       <Link className='user_info_details_collection' href="/collections/about"> View collections <svg className="user_info_details_collection_icon" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.30902 1C2.93025 1 2.58398 1.214 2.41459 1.55279L1.05279 4.27639C1.01807 4.34582 1 4.42238 1 4.5V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V4.5C14 4.42238 13.9819 4.34582 13.9472 4.27639L12.5854 1.55281C12.416 1.21403 12.0698 1.00003 11.691 1.00003L7.5 1.00001L3.30902 1ZM3.30902 2L7 2.00001V4H2.30902L3.30902 2ZM8 4V2.00002L11.691 2.00003L12.691 4H8ZM7.5 5H13V13H2V5H7.5ZM5.5 7C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H9.5C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7H5.5Z" fill="currentColor" fillRule="evenodd" clip-rule="evenodd"></path></svg>
       </Link></div>
      <button
        onClick={() => signOut()}
        className="user_info_log_out_button"
      >
        Log Out
      </button>
    </div>
  </div>
  );
}