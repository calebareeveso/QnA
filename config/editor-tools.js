// tools.js
import EditorjsImage from "@editorjs/image";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import EditorjsHeader from "@editorjs/header";
export const EDITOR_JS_TOOLS = {
  header: {
    class: EditorjsHeader,
    config: {
      placeholder: "Enter a header",
      levels: [1, 2, 3, 4],
      defaultLevel: 3,
    },
  },
  Marker: {
    class: Marker,
  },
  inlineCode: {
    class: InlineCode,
  },
  image: {
    class: EditorjsImage,
    inlineToolbar: true,
    config: {
      /**
       * Custom uploader
       */
      uploader: {
        uploadByFile(file) {
          // Cloudinary upload logic
          let formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_APP_UPLOAD_PRESET
          );
          formData.append("cloud_name", process.env.NEXT_PUBLIC_APP_CLOUD_NAME);

          return fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_APP_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          )
            .then((response) => response.json())
            .then((data) => {
              return {
                success: 1,
                file: {
                  url: data.secure_url,
                },
              };
            });
        },

        uploadByUrl(url) {
          if (url) {
            return new Promise(function (resolve, reject) {
              resolve({
                success: 1,
                file: {
                  url: url,
                },
              });
            });
          }
        },
      },
    },
  },
};
