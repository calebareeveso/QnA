import { redirect } from "next/navigation";
import Script from "next/script";
// component
import Main from "@/component/main";

// lib
import getAllQnA from "@/lib/fetch/get/allQnA";
import getAllCollection from "@/lib/fetch/get/allCollection";
export const revalidate = 0;
export default async function Page() {
  const qna = await getAllQnA("about");
  const collections = await getAllCollection();

  return <Main qna={qna} collections={collections} pathname={"about"} />;
}
