"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";

// lib
import formattedDate from "@/lib/fDate";
import API from "@/lib/sheet";
// tools
import { EDITOR_JS_TOOLS } from "@/config/editor-tools";
import updateQnA from "@/lib/fetch/update/QnA";
import removeQnA from "@/lib/fetch/remove/QnA";
// session 
import { useSession } from "next-auth/react";
export default function qna({
  pathname,
  id,
  qindex,
  createdAt,
  viewedAt,
  dueIn,
  questionTitle,
  questionImage,
  answerContent,
  category,
  setReloadAppData
}) {
    // session
    const { data: session } = useSession();
  const [qneDueIn, setqneDueIn] = useState(dueIn);
  const [categoryValue, setcategoryValue] = useState(category);
  const [qnaModalEditInput, setqnaModalEditInput] =
    useState(questionTitle);
  const [questionTitleValue, setquestionTitleValue] = useState(questionTitle);
  const [questionImageValue, setquestionImageValue] = useState(questionImage);
  const [dateDiff, setdateDiff] = useState(0);
  const [qnaHolderId, setqnaHolderId] = useState("");
  const [qnaIndex, setqnaIndex] = useState("");
  const [isQnaEditorReady, setisQnaEditorReady] = useState(false);
  const [qnaEditor, setqnaEditor] = useState("");
  const qnaEditorRef = useRef(null);
  const activeQnaEditorRef = useRef(null);
  const qnaEditorLoader = useRef(null);
  const qnaDialogRef = useRef(null);
  useEffect(() => {
    setdateDiff(
      formattedDate.datediff(
        formattedDate.parseDate(viewedAt),
        formattedDate.parseDate(formattedDate.Today())
      )
    );
    const mountEditor = () => {
      const bpEditor = new EditorJS({
        holder: `qna__editor-${id}`,
        onReady: async () => {
          await bpEditor.blocks.renderFromHTML(answerContent);
        },
        // readOnly: false,
        onChange: qnaEditorDebounce(saveQna, 4000),
        // onChange: window.qnaEditorDebounce(saveQna, 2000),
        // this.saveQna(qnaEditor)
        tools: EDITOR_JS_TOOLS,
      });
      function saveQna() {
        bpEditor
          .save()
          .then(async (outputData) => {
            const edjsParser = edjsHTML();
            const html = edjsParser.parse(outputData);

            if (html.join("") !== answerContent) {
              console.log("Article data: ", outputData);
              console.log("html: ", html.join(""));
              console.log("QnA id: ",id);
              if(session){
                const qnaResult = await updateQnA(pathname, id,{
                  answerContent: html.join(""),
                })
                if(qnaResult){
                  console.log("qnaResult: ",qnaResult);
                  qnaEditorLoader?.current?.classList.remove(
                    "error__qna__editor__loader"
                  );
                }
              }
            }else{
              qnaEditorLoader?.current?.classList.remove(
                "error__qna__editor__loader"
              );
            }
            if (qnaEditorLoader) {
              qnaEditorLoader?.current?.classList.remove(
                "error__qna__editor__loader"
              );
            }
          })
          .catch((error) => {
            console.log("Saving failed: ", error);
          });
      }
      setqnaEditor(bpEditor);
    };

    if (isQnaEditorReady !== false) {
      mountEditor();
    }

    const qnaEditorReady = () => {
      setisQnaEditorReady(true);
      // console.log(`I AM READY`,isQnaEditorReady);
    };

    const qnaIsReadyTimeoutId = setTimeout(qnaEditorReady, 2000);
    return () => {
      clearTimeout(qnaIsReadyTimeoutId);
    };
  }, [isQnaEditorReady]);

  const qnaEditorDebounce = (func, delay) => {
    let debounceTimer;
    return function () {
      console.log(`typing...`, isQnaEditorReady);
      clearTimeout(debounceTimer);
    
      qnaEditorLoader?.current?.classList.add(
        "error__qna__editor__loader"
      );
      const context = this;
      const args = arguments;
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };
  // const saveQna = () => {
  //   qnaEditor
  //     .save()
  //     .then((outputData) => {
  //       const edjsParser = edjsHTML();
  //       const html = edjsParser.parse(outputData);
  //       console.log("Article data: ", outputData);
  //       console.log("html: ", html.join(""));

  //       qnaEditorLoader.current.classList.remove(
  //         "error__qna__editor__loader"
  //       );
  //     })
  //     .catch((error) => {
  //       console.log("Saving failed: ", error);
  //     });
  // };

  const saveCategoryValue = async () => {
    if(session){
    const categoryResult = await updateQnA(pathname, id,{
      category: categoryValue,
    })
  
    console.log(`categoryValue=>`, categoryValue);
  }
  };
  const saveDueInInputValue = async (event) => {
    let newDueIn = event.target.value
    if(session){
    const dueInResult = await updateQnA(pathname, id,{
      dueIn: event.target.value,
    })
    if(dueInResult){
       console.log(newDueIn);
       setqneDueIn(newDueIn)
    }
  }
  };
  const saveQnaModalEditInput = async (event) => {
    if(session){
    const questionTitleResult = await updateQnA(pathname, id,{
      questionTitle: qnaModalEditInput,
    })
    if(questionTitleResult){
      setquestionTitleValue(qnaModalEditInput);
      qnaDialogRef.current.close();
      console.log(qnaModalEditInput);
    }
  }
  };

  const editQuestionImageValue = (event,pathname, id)=>{
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_APP_UPLOAD_PRESET
      );
      formData.append("cloud_name", process.env.NEXT_PUBLIC_APP_CLOUD_NAME);

      fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_APP_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then(async (data) => {
          let secureUrl = data.secure_url
          if(session){
          const questionImageResult = await updateQnA(pathname, id,{
            questionImage: secureUrl,
          })
          if(questionImageResult){
            setquestionImageValue(secureUrl)
            console.log(secureUrl);
          }
        }
        });
    }
  }
  const deleteQuestionImageValue = async ()=>{
    if(session){
    const questionImageResult = await updateQnA(pathname, id,{
      questionImage: "",
    })
    if(questionImageResult){
      setquestionImageValue("")
      console.log("Image Removed");
    }
  }
  }

  const deleteQna = async ()=>{
    console.log(pathname, id);
    if(session){
    const delteResult = await removeQnA(pathname, id)
    if(delteResult){
      console.log("QnA Removed");
      setReloadAppData(true);
    }
  }
  }

  const reloadapp = (e) => {
    setReloadAppData(e);
  };
  // const reMountEditor = (event) => {
  //   window.qnaEditor.destroy();
  //   const qnaEditorHTML = qnaEditorRef.current.innerHTML;
  //   console.log(`qnaEditorHTML`, qnaEditorHTML);
  //   qnaEditorRef.current.innerHTML = "";
  //   const dataIndex = event.currentTarget.getAttribute("data-index");
  //   const elementId = event.currentTarget.id;
  //   setqnaHolderId(elementId);
  //   setqnaIndex(dataIndex);
  //   window.qnaEditor = new EditorJS({
  //     holder: `qna__editor-${dataIndex}`,
  //     onReady: async () => {
  //       await window.qnaEditor.blocks.renderFromHTML(qnaEditorHTML);
  //     },
  //     // readOnly: false,
  //     // onChange: () => {
  //     //   document
  //     //     .getElementById(`qnaEditorSaveButton`)
  //     //     .classList.add("not__saved");
  //     // },
  //     // onChange: window.qnaEditorDebounce(saveQna, 2000),
  //     // this.saveQna(qnaEditor)
  //     tools: EDITOR_JS_TOOLS,
  //   });

  //   console.log(dataIndex);
  //   console.log(elementId);
  // };
  const viewedQnA=async ()=>{
    if(session){
      const viewedAtResult = await updateQnA(pathname, id,{
        viewedAt: formattedDate.Today()
      })
      if(viewedAtResult){
         console.log(formattedDate.Today());
         setdateDiff(
          formattedDate.datediff(
            formattedDate.parseDate(formattedDate.Today()),
            formattedDate.parseDate(formattedDate.Today())
          )
        );
        if(dateDiff >= dueIn){
        setReloadAppData(true);
        }
      }
    }
  }
  return (
    <div key={qindex}>
      <details>
        <summary className="qna__item__btn" onClick={viewedQnA}>
          <span className="">
            {" "}
            <span className={dateDiff >= dueIn ? "red__text" : ""}>
              {/* {questionTitle} */}
              {questionTitleValue}
            </span>{" "}
            {dateDiff >= dueIn ? (
              <>
                <span className="clock__icon ">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z"
                      fill="#757575"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                <span className="gray__text">{dateDiff}dys ago</span>
              </>
            ) : (
              <span />
            )}
          </span>
          <img
            id="qnaQuestionImage-${qindex}"
            className="question__image"
            alt=""
            src={questionImageValue}
          />
        </summary>

        <div>
          <div>
            <div className="answer__content__header ">
              <div className="qna__category">
                <div>
                  <span className="qna__category__icon"># </span>
                  <input
                    id="qnaCategoryinput-${qindex}"
                    className="qna__category__input"
                    type="text"
                    value={categoryValue}
                    onChange={(e) => setcategoryValue(e.target.value)}
                    onBlur={saveCategoryValue}
                    name="category"
                    placeholder="Category"
                  />
                </div>
              </div>
              <div>
                <select
                  value={qneDueIn}
                  className="qna__due__in__select__input qna__item__dropdown__select"
                  data-duein={dueIn}
                  id="qnaDueIninput-${qindex}"
                  onChange={saveDueInInputValue}
                >
                  <option value="1">Due In 1 dy</option>
                  <option value="3">Due In 3 dys</option>
                  <option value="5">Due In 5 dys</option>
                  <option value="7">Due In 7 dys</option>
                  <option value="12">Due In 12 dys</option>
                  <option value="14">Due In 14 dys</option>
                  <option value="30">Due In 30 dys</option>
                </select>

{session &&
                <div className="qna__item__dropdown">
                  <button className="qna__item__dropdown__drop__btn">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                        fill="#757575"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <div
                    className="qna__item__dropdown__content"
                    data-index={qindex}
                  >
                    <span
                      onClick={() => qnaDialogRef.current.showModal()}
                      className="qna__item__edit__title__btn"
                    >
                      Edit Title
                    </span>
                    <label htmlFor={`question-image-upload-${id}`} className="qna__item__edit__image__btn">
                      Edit Image
                      <input accept="image/jpeg, image/png, image/jpg" type="file" id={`question-image-upload-${id}`} style={{display:"none"}} onChange={(event)=>editQuestionImageValue(event,pathname,id)}/>
                    </label>
                    <span onClick={deleteQuestionImageValue} className="qna__item__delete__image__btn">
                      Delete Image
                    </span>
                    <span onClick={deleteQna} className="qna__item__delete__qna__btn">
                      Delete Question
                    </span>
                  </div>
                </div>
}
              </div>
            </div>
            <div
              ref={qnaEditorLoader}
              className="qna__editor__loader"
            ></div>
            <div ref={activeQnaEditorRef}>
              <div
                className="active__qna__editor active__qna__item__editor"
                id={`qna__editor-${id}`}
                ref={qnaEditorRef}
                data-index={qindex}
                // onClick={reMountEditor}
                // dangerouslySetInnerHTML={{ __html: answerContent }}
              ></div>
            </div>

            {/* <!-- The Modal --> */}
            <div>
              <dialog
                // open
                ref={qnaDialogRef}
                id="qnaDialog"
                className="qna__modal-content"
              >
                <div className="qna__modal-header">
                  <span
                    onClick={() => qnaDialogRef.current.close()}
                    id="qnaModalCloseBtn-${qindex}"
                    className="qna__modal__close"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <h2>Edit title</h2>
                </div>
                <div className="qna__modal-body">
                  <input
                    id="qnaModalEditInput-${qindex}"
                    value={qnaModalEditInput}
                    onChange={(event) =>
                      setqnaModalEditInput(event.target.value)
                    }
                    type="text"
                    placeholder="Edit qna title"
                    className="qna__modal__input"
                  />
                  <button
                    onClick={saveQnaModalEditInput}
                    className="qna__modal__save__btn"
                    id="qnaModalEditSaveBtn-${qindex}"
                  >
                    Save
                  </button>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
