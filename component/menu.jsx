"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// lib
import formattedDate from "@/lib/fDate";
import Link from "next/link";
export default function menu({ title, noOfDueQnas }) {
  //   const pathname = usePathname();
  //   const [noOfoverDueQnas, setnoOfoverDueQnas] = useState([]);
  //   useEffect(() => {
  //     const loadQnaData = async () => {
  //       const dev = process.env.NODE_ENV !== "production";
  //       const server = dev
  //         ? "http://localhost:3000"
  //         : "https://your_deployment.server.com";

  //       const collectionDataRes = await fetch(`${server}/api/collection`);
  //       const collectionData = await collectionDataRes.json();

  //       const overDueQnasPromise = collectionData.map(async (item) => {
  //         const qnaDataRes = await fetch(
  //           `${server}/api/qna?title=${item.title}`
  //         );
  //         const qnaData = await qnaDataRes.json();

  //         const noOfDueQnas = qnaData.filter(
  //           (obj) =>
  //             obj.viewedAt !== undefined &&
  //             Number(
  //               formattedDate.datediff(
  //                 formattedDate.parseDate(obj.viewedAt),
  //                 formattedDate.parseDate(formattedDate.Today())
  //               )
  //             ) > Number(obj.dueIn)
  //         ).length;

  //         const noOfQnas = qnaData.length;
  //         console.log(`item.title`, item.title);
  //         console.log(`noOfDueQnas`, noOfDueQnas);
  //         console.log(`noOfQnas`, noOfQnas);
  //         return {
  //           title: item.title,
  //           noOfDueQnas,
  //           noOfQnas,
  //         };
  //       });

  //       const overDueQnas = await Promise.all(overDueQnasPromise);

  //       console.log(`overDueQnas`, overDueQnas);
  //       setnoOfoverDueQnas(overDueQnas);
  //     };
  //     loadQnaData();
  //   }, []);

  return (
    <li className="menu__item">
      {" "}
      <Link
        // onClick={linkReloadapp}
        className="menu__link"
        data-reloadapp={title}
        href={`/collections/${title.replace(/\s+/g, "-")}`}
      >
        <span
          id="{title}DueQnas"
          className={`menu__link__icon ${
            noOfDueQnas > 0 ? "red__text" : ""
          }`}
        >
          [{noOfDueQnas}]
        </span>
        <span>{title.replace(/-/g, " ")}</span>
      </Link>
    </li>
  );
}
