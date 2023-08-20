import { redirect } from "next/navigation";
import Script from "next/script";
// component
import Main from "@/component/main";

// lib
import getAllQnA from "@/lib/fetch/get/allQnA";
import getAllCollection from "@/lib/fetch/get/allCollection";

// forced dynamic rendering
import { headers } from "next/headers";
export default async function Page({ params }) {
  //
  const headersList = headers();
  const referer = headersList.get("referer");
  //
  const qna = await getAllQnA(params.collection);
  const collections = await getAllCollection();
  const isSlugValid = collections.some(
    (item) => item.title === params.collection
  );
  console.log(isSlugValid);

  if (!isSlugValid) {
    redirect("/");
  }

  return (
    <Main
      qna={qna}
      collections={collections}
      pathname={params.collection}
      referer={referer}
    />
  );
}
