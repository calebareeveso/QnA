"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import EditorJS from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";
// lib
import formattedDate from "@/lib/fDate";
import generateRandomNumbers from "@/lib/generateRandomNumbers";
import { EDITOR_JS_TOOLS } from "@/config/editor-tools";
 
// add QnA data 
import addQnA from "@/lib/fetch/add/QnA";
// session 
import { useSession } from "next-auth/react";

export default function QnaEditor({
  title,
  allQnaData,
  collectionData,
  pathname,
  setReloadAppData
}) {
  // session 
  const { data: session } = useSession();
  // states
  const qnaEditorLoader = useRef(null);
  const [isQnaEditorReady, setisQnaEditorReady] = useState(false);
  const [qnaEditor, setqnaEditor] = useState("");
  const [imagePreview, setimagePreview] = useState("");
  const qnaEditorRef = useRef(null);
  const activeQnaEditorRef = useRef(null);
  // input
  const questionTitleInput = useRef(null);
  const categoryInput = useRef(null);
  const dueInInput = useRef(null);
  const qnaItemInputFile = useRef(null);
  const questionImagePreview = useRef(null);
  const rmQuestionImagePreview = useRef(null);
  useEffect(() => {
    // alert(session)
    console.log(`collectionData`, collectionData);
    const mountEditor = () => {
      const bpEditor = new EditorJS({
        holder: `qna__editor`,
        onChange: qnaEditorDebounce(saveQna, 4000),
        tools: EDITOR_JS_TOOLS,
      });
      function saveQna() {
        bpEditor
          .save()
          .then(async (outputData) => {
            const edjsParser = edjsHTML();
            const html = edjsParser.parse(outputData);
            const answerContentHTML = html.join("");

            if (html.join("").length > 0) {
              console.log("Article data: ", outputData);
              console.log("html: ", answerContentHTML);

              const questionTitleInputValue = questionTitleInput.current.value;
              const categoryInputValue = categoryInput.current.value;
              const dueInInputValue = dueInInput.current.value;
              const questionImagePreviewSRC = questionImagePreview.current.src;

              console.log(`questionTitleInput:`, questionTitleInputValue);
              console.log(`categoryInputValue:`, categoryInputValue);
              console.log(`dueInInputValue:`, dueInInputValue);
              console.log(`questionImagePreviewSRC:`, questionImagePreviewSRC);
              try {
               if(questionTitleInputValue!=="" && session!== null){

                const qnaResult = await addQnA(pathname, {
                  qindex: generateRandomNumbers(),
                  createdAt: formattedDate.Today(),
                  viewedAt: formattedDate.Today(),
                  dueIn: dueInInputValue !=="" ? dueInInputValue : "7",
                  questionTitle: questionTitleInputValue,
                  questionImage: questionImagePreviewSRC,
                  answerContent: answerContentHTML,
                  category: categoryInputValue,
                })
               if(qnaResult){
               
                questionTitleInput.current.value =''
                categoryInput.current.value = ''
                dueInInput.current.value = ''
                questionImagePreview.current.src = ''
                bpEditor.blocks.clear()
                setReloadAppData(true);
                console.log("qnaResult::",qnaResult);
               }
              }
              } catch (error) {
                console.error("Error:", error);
              }
            }

            qnaEditorLoader.current.classList.remove(
              "error__qna__editor__loader"
            );
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

  const rmEditorImagePreview = () => {
    let preview = questionImagePreview.current;
    let rm = rmQuestionImagePreview.current;
    setimagePreview("");
    preview.style.display = "none";
    rm.style.display = "none";
  };
  const editorImagePreview = (event) => {
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
        .then((data) => {
          let preview = questionImagePreview.current;
          let rm = rmQuestionImagePreview.current;
          //   preview.src = data.secure_url;
          setimagePreview(data.secure_url);
          preview.style.display = "block";
          rm.style.display = "block";
          console.log(data.secure_url);
        });
    }
  };

  return (
    <div className="margin-top-xs">
      
      <details>
        <summary className="qna__item__btn qna__item__editor__btn">
          <span className="qna__item__input">
            <input
              ref={questionTitleInput}
              autoComplete="off"
              type="text"
              placeholder="Add Question..."
              id="qnaQuestion"
              className="add__new__qna__item__input"
            />
            <span className="qna__file__upload">
              {" "}
              <span
                onClick={rmEditorImagePreview}
                ref={rmQuestionImagePreview}
                className="rm__question__image__preview"
                id="rmQuestionImagePreview"
                style={{ display: "none" }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                    fill="#c70000"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>{" "}
              <label
                className="qna__item__input__file__label"
                htmlFor="qnaItemInputFile"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                    fill="#8A8A8A"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </label>
              <input
                ref={qnaItemInputFile}
                onChange={editorImagePreview}
                type="file"
                className="qna__item__input__file"
                id="qnaItemInputFile"
                accept="image/*"
              />
            </span>
          </span>
          <img
            ref={questionImagePreview}
            id="qnaQuestionImage-${qindex}"
            className="question__image "
            alt=""
            src={imagePreview}
          />
        </summary>

        <div>
          <div>
            <div className="answer__content__header">
              <div className="qna__category">
                <div>
                  <span className="qna__category__icon"># </span>
                  <input
                    ref={categoryInput}
                    id="qnaCategoryinput-${qindex}"
                    className="qna__category__input"
                    type="text"
                    // value={categoryValue}
                    // onChange={(e) => setcategoryValue(e.target.value)}
                    // onBlur={saveCategoryValue}
                    name="category"
                    placeholder="Category"
                  />
                </div>
              </div>
              <div>
                <select
                  ref={dueInInput}
                  className="qna__due__in__select__input qna__item__dropdown__select"
                  id="qnaDueIninput-${qindex}"
                  //   onChange={saveDueInInputValue}
                >
                  <option value="1">Due In 1 dy</option>
                  <option value="3">Due In 3 dys</option>
                  <option value="5">Due In 5 dys</option>
                  <option value="7">Due In 7 dys</option>
                  <option value="12">Due In 12 dys</option>
                  <option value="14">Due In 14 dys</option>
                  <option value="30">Due In 30 dys</option>
                </select>
              </div>
            </div>
            <div
              ref={qnaEditorLoader}
              className="qna__editor__loader"
            ></div>
            <div id="qna__editor" />
          </div>
        </div>
      </details>
    </div>
  );
}
