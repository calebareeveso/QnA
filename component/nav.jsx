"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
// lib
import formattedDate from "@/lib/fDate";
 
// component
import Menu from "./menu";
// db
import addCollection from "@/lib/fetch/add/collection";
// session 
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
export default function nav({ collectionData}) {
  // session
  const { data: session } = useSession();
  const router = useRouter()
  // const [qnaData, setqnaData] = useState([]);
  // useEffect(() => {
  //   const loadQnaData = async () => {
  //     const dev = process.env.NODE_ENV !== "production";
  //     const server = dev
  //       ? "http://localhost:3000"
  //       : "https://your_deployment.server.com";
  //     const response = await fetch(`${server}/api/test?title=last-last-one`, {
  //       cache: "no-store",
  //     });
  //     console.log(`response::`, response);
  //     const jsonData = await response.json();
  //     console.log(`TEST jsonData::`, jsonData);

  //     const collectionDataRes = await fetch(`${server}/api/collection`, {
  //       // cache: "no-store",
  //     });
  //     const collectionData = await collectionDataRes.json();
  //     console.log(`TEST collectionData::`, collectionData);
  //     // setqnaData(jsonData);
  //   };
  //   loadQnaData();
  //   // console.log(data);
  //   // setqnas(data);
  // }, []);
  const navBar = useRef(null);
  const navBarOverlay = useRef(null);
  const toggleNav = () => {
    navBar.current.classList.toggle("open__nav");
    navBarOverlay.current.classList.toggle("show__nav__overlay");
  };
 
  // create collection 
  const createCollection =async ()=>{
    // alert(newCollectionInputValue.toLowerCase().replace(/\s+/g, '-'))
    let processedNewCollectionInputValue = newCollectionInputValue.toLowerCase().replace(/\s+/g, '-')
    if (processedNewCollectionInputValue!=="" && session!== null){
      const addResult = await addCollection(processedNewCollectionInputValue)
      if(addResult){
        router.push(`/collections/${processedNewCollectionInputValue}`)
      }
    }
   
  }
 
  const [newCollectionInputValue, setnewCollectionInputValue] = useState("");
// search functionality
const [searchInput, setSearchInput] = useState("");
  return (
    // <>
    //   <button id="authorize_button">Authorize</button>
    // </>
    <>
      <nav ref={navBar} className="app__nav">
        <h1 className="app_logo_conatiner"><Link href="/" className="logo">QnA</Link>  <span>
          
         {session!==null ? <button className="app_session_button"  onClick={() => signOut()}>
          {/* LOGOUT */}
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z" fill="currentColor" fillRule="evenodd" clip-rule="evenodd"></path></svg>
          </button>:
          <Link href={'/admin'}  className="app_session_button">
          {/* "LOGIN" */}
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 1C4.22386 1 4 1.22386 4 1.5C4 1.77614 4.22386 2 4.5 2H12V13H4.5C4.22386 13 4 13.2239 4 13.5C4 13.7761 4.22386 14 4.5 14H12C12.5523 14 13 13.5523 13 13V2C13 1.44772 12.5523 1 12 1H4.5ZM6.60355 4.89645C6.40829 4.70118 6.09171 4.70118 5.89645 4.89645C5.70118 5.09171 5.70118 5.40829 5.89645 5.60355L7.29289 7H0.5C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H7.29289L5.89645 9.39645C5.70118 9.59171 5.70118 9.90829 5.89645 10.1036C6.09171 10.2988 6.40829 10.2988 6.60355 10.1036L8.85355 7.85355C9.04882 7.65829 9.04882 7.34171 8.85355 7.14645L6.60355 4.89645Z" fill="currentColor" fillRule="evenodd" clip-rule="evenodd"></path></svg>
          </Link>
          }


          </span></h1>

        <div className="qna__search">
          <span className="qna__search__icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                fill="#090909"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            id="qnaCollectionInput"
            type="text"
            placeholder="search for qnas..."
            className="qna__search__input"
          />
        </div>
        <ul className="menu">
          {collectionData.filter(({ title }) => {
                return Object.values(title)
                  .join("")
                  .toLowerCase()
                  .includes(searchInput.toLowerCase());
              }).map(({ title, noOfDueQnas }) => (
            <Menu
              key={title}
              noOfDueQnas={noOfDueQnas}
              title={title}
              
            />
          ))}
        </ul>
        {session &&
        <div className="add__new__qna">
          <button className="add__new__qna__icon" onClick={createCollection}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                fill="#757575"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <input
            type="text"
            placeholder="Add collection"
            className="add__new__qna__input"
            value={newCollectionInputValue}
            onChange={(event) =>
              setnewCollectionInputValue(event.target.value)
            }
          />
        </div>
        }
      </nav>
      <div
        ref={navBarOverlay}
        onClick={toggleNav}
        className="app__nav__overlay"
      ></div>
      <button className="app__nav__burger" onClick={toggleNav}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
            fill="#090909"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </>
  );
}
