import { redirect } from "next/navigation";
import Script from "next/script";
// component
import Nav from "@/component/nav";
import Header from "@/component/header";
import Prompt from "@/component/qna";
import PromptEditor from "@/component/editor";

import Main from "@/component/main";
import VisitorsWarning from "@/component/visitorsWarning";
// lib
import formattedDate from "@/lib/fDate";
import getAllQnA from "@/lib/fetch/get/allQnA";
import getAllCollection from "@/lib/fetch/get/allCollection";
export default async function Page({ params }) {
  // const qna = await getAllQnA(params.collection);
  // const collections = await getAllCollection();
  // const isSlugValid = collections.some(
  //   (item) => item.title === params.collection
  // );
  // console.log(isSlugValid);

  // if (!isSlugValid) {
  //   redirect("/");
  // }

  return (
    <div>JUST DEPLOY</div>
    // <Main qna={qna} collections={collections} pathname={params.collection} />
  );
}
