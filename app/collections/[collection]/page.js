import { redirect } from "next/navigation";
import Script from "next/script";
// component
import Main from "@/component/main";

// lib
import getAllQnA from "@/lib/fetch/get/allQnA";
import getAllCollection from "@/lib/fetch/get/allCollection";
import server from "@/lib/server";
export default async function Page({ params }) {
  // const qna = await getAllQnA(params.collection);
  const qnaresponse = await fetch(`${server}/api/qna/${params.collection}`, {
    cache: "no-store",
  });
  const qnadata = await qnaresponse.json();
  const qna = qnadata.qna;
  // const collections = await getAllCollection();
  const res = await fetch(`${server}/api/collection`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch collection");
  }
  const collections = await res.json();
  const isSlugValid = collections.some(
    (item) => item.title === params.collection
  );
  console.log(isSlugValid);

  if (!isSlugValid) {
    redirect("/");
  }

  return (
    <Main qna={qna} collections={collections} pathname={params.collection} />
  );
}
