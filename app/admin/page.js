import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Login from "@/component/login";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function App() {
  // get the session
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin/welcome");
  }

  // display the page
  return (
    // <Main />
    <div className="">
      <Login />
    </div>
  );
}
