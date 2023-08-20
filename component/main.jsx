"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
// lib
import formattedDate from "@/lib/fDate";
import Link from "next/link";
 
// component
import Nav from "@/component/nav";
import Header from "@/component/header";
import VisitorsWarning from "./visitorsWarning";
// fetch allQnA
import getAllQnA from "@/lib/fetch/get/allQnA";
import getAllCollection from "@/lib/fetch/get/allCollection";
const Qna = dynamic(() => import("@/component/qna"), { ssr: false });
const QnaEditor = dynamic(() => import("@/component/editor"), {
  ssr: false,
});
 

// forced dynamic search 
import { useSearchParams } from 'next/navigation'

export default function Main({ children,pathname,qna,collections,referer }) {
  // forced dynamic search 
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  //   const pathname = usePathname();
  //   const title = pathname.replace(/^\//, "");

  const [allQnaData, setallQnaData] = useState([]);
  const [allCollectionData, setallCollectionData] = useState([]);
  const [reloadContentTime, setreloadContentTime] = useState(new Date().toISOString());
  const [contentLoaded, setcontentLoaded] = useState(false);
  const [changeCollectionData, setchangeCollectionData] = useState(false);
  useEffect(() => {
    (async()=>{
      const qna = await getAllQnA(pathname);
      setallQnaData(qna)
      const collections = await getAllCollection();
      setallCollectionData(collections)
      setcontentLoaded(true)
      setchangeCollectionData(true)
    })();
  }, [reloadContentTime]);

  const setReloadAppData = (reloadAppDataValue) => {
    console.log(`from main::: `, reloadAppDataValue);
    setreloadContentTime(new Date().toISOString());
  };

  const [headersearchInput, setHeadersearchInput] = useState("");
  const setSearchInput = (searchInput) => {
    console.log(`search Input From main::: `, searchInput);
    setHeadersearchInput(searchInput);
  };


  // get qna
  useEffect(() => {
    (async ()=>{
      const qna = await getAllQnA("collection1")
    console.log("QnA::",qna)
      const ac = await getAllCollection()
    console.log("All Collection::",ac)
    console.log("Main pathname::",pathname)
  })()
  }, [])
  
  return (
    <main>
    
     
        <>
          {<Nav collectionData={changeCollectionData ? allCollectionData : collections} />}

          <section className="play__ground">
          <VisitorsWarning/>
            {<Header collectionData={changeCollectionData ? allCollectionData : collections} pathname={pathname} setSearchInput={setSearchInput}/>}
            {
              <div className="qna__container">
                {" "}
                {contentLoaded ?
                <div>
                  {allQnaData.filter(({ questionTitle }) => {
                return Object.values(questionTitle)
                  .join("")
                  .toLowerCase()
                  .includes(headersearchInput.toLowerCase());
              }).map(
                    ({
                      _id,
                      qindex,
                      createdAt,
                      viewedAt,
                      dueIn,
                      questionTitle,
                      questionImage,
                      answerContent,
                      category,
                    }) =>
                      questionTitle && (
                        <Qna
                          pathname={pathname}
                          id={_id}
                          key={_id}
                          qindex={qindex}
                          createdAt={createdAt}
                          viewedAt={viewedAt}
                          dueIn={dueIn}
                          questionTitle={questionTitle}
                          questionImage={questionImage}
                          answerContent={answerContent}
                          category={category}
                          setReloadAppData={setReloadAppData}
                        />
                      )
                  )}
                  <div>
                    <QnaEditor
                      collectionData={collections}
                      title={pathname}
                      allQnaData={
                        allQnaData 
                      }
                      pathname={pathname}
                      setReloadAppData={setReloadAppData}
                    />
                  </div>
                </div>
                : <div className="dot-wave">
                <div className="dot-wave__dot"></div>
                <div className="dot-wave__dot"></div>
                <div className="dot-wave__dot"></div>
                <div className="dot-wave__dot"></div>
            </div>}
              </div>
            }
          </section>
        </>
     
    </main>
  );
}
