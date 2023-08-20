import { redirect } from "next/navigation";
import Script from "next/script";

// component
import Main from "@/component/main";

// lib
import getAllQnA from "@/lib/fetch/get/allQnA";
import getAllCollection from "@/lib/fetch/get/allCollection";
import server from "@/lib/server";

export default async function Page() {
  // const qna = await getAllQnA(about);
  const qnaresponse = await fetch(`${server}/api/qna/about`, {
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

  return <Main qna={qna} collections={collections} pathname={"about"} />;
}
