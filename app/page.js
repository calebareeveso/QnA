import { redirect } from "next/navigation";
import Script from "next/script";
// component
import Main from "@/component/main";

// lib
import getAllQnA from "@/lib/fetch/get/allQnA";
import getAllCollection from "@/lib/fetch/get/allCollection";
// forced dynamic rendering
import { headers } from "next/headers";
export default async function Page() {
  //
  const headersList = headers();
  const referer = headersList.get("referer");
  //
  const qna = await getAllQnA("about");
  const collections = await getAllCollection();

  return (
    <Main
      qna={qna}
      collections={collections}
      pathname={"about"}
      referer={referer}
    />
  );
}
