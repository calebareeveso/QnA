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
export default async function Page() {
  const qna = await getAllQnA("about");
  const collections = await getAllCollection();

  return <Main qna={qna} collections={collections} pathname={"about"} />;
}
