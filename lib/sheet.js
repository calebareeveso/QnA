import formattedDate from "./fDate";
export default class SheetsAPI {
  constructor() {
    this.CLIENT_ID = process.env.NEXT_PUBLIC_APP_CLIENT_ID;
    this.API_KEY = process.env.NEXT_PUBLIC_APP_API_KEY;

    this.DISCOVERY_DOC =
      "https://sheets.googleapis.com/$discovery/rest?version=v4";
    this.SCOPES = "https://www.googleapis.com/auth/spreadsheets";

    this.isAuthenticated = false;

    this.tokenClient = null;
    this.gapiInited = false;
    this.gisInited = false;
  }

  static async getAllCollection() {
    const waitForAccessToken = () => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (
            typeof window?.gapi?.client?.getToken()?.access_token === "string"
          ) {
            clearInterval(interval);
            resolve();
          }
          // console.log(
          //   `typeof TOKEN: ${typeof window?.gapi?.client?.getToken()
          //     ?.access_token}`
          // );
          // console.log(
          //   `NEW CONDITION typeof TOKEN: ${
          //     typeof window?.gapi?.client?.getToken()?.access_token == "string"
          //   }`
          // );
          return;
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reject("your error msg");
        }, 5000);
      });
    };
    return waitForAccessToken().then(async () => {
      const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_PUBLIC_APP_SHEET_ID}?key=${process.env.NEXT_PUBLIC_APP_API_KEY}`;
      const response = await fetch(endpoint);
      const sheetData = await response.json();

      const sheets = await Promise.all(
        sheetData.sheets.map(async (sheet) => {
          const readData =
            await window.gapi.client.sheets.spreadsheets.values.get({
              spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
              range: `${sheet.properties.title}!A2:H`,
            });
          // console.log(`readData`, readData.result.values);
          const noOfDuePrompts = readData.result.values.filter(
            (item) =>
              item[2] !== undefined &&
              Number(
                formattedDate.datediff(
                  formattedDate.parseDate(item[2]),
                  formattedDate.parseDate(formattedDate.Today())
                )
              ) > Number(item[3])
          ).length;

          const noOfPrompts = readData.result.values.length;

          return {
            title: sheet.properties.title,
            cindex: sheet.properties.index,
            cid: sheet.properties.sheetId,
            noOfDuePrompts,
            noOfPrompts,
          };
        })
      );

      console.log("getAllCollection() =>", sheets);

      return sheets;
    });
  }

  static async createCollection(title) {
    try {
      let params = {
        spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
      };

      const batchUpdateSpreadsheetRequestBody = {
        requests: [{ addSheet: { properties: { title: title } } }],
      };

      const request = window.gapi.client.sheets.spreadsheets.batchUpdate(
        params,
        batchUpdateSpreadsheetRequestBody
      );

      const response = await request;

      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            let values = [
              [
                "index",
                "createdAt",
                "viewedAt",
                "dueIn",
                "questionTitle",
                "questionImage",
                "answerContent",
                "category",
              ],
            ];
            const body = {
              values: values,
            };

            console.log(`title==>${title}`);
            console.log(
              `response.result.replies[0].addSheet.properties.title==>${response.result.replies[0].addSheet.properties.title}`
            );

            const updateResponse =
              await window.gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
                range: `${title}!1:1`,
                valueInputOption: "USER_ENTERED",
                resource: body,
              });

            console.log(`updateResponse:`, updateResponse);
            resolve(updateResponse);
          } catch (err) {
            console.log(err.message);
            reject(err);
          }
        }, 1000);
      });
    } catch (err) {
      console.log(err.message);
      return;
    }
  }
  // static async createCollection(title) {
  //   try {
  //     let params = {
  //       // The spreadsheet to apply the updates to.
  //       spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID, // TODO: Update placeholder value.
  //     };

  //     const batchUpdateSpreadsheetRequestBody = {
  //       requests: [{ addSheet: { properties: { title: title } } }],
  //     };

  //     const request = window.gapi.client.sheets.spreadsheets.batchUpdate(
  //       params,
  //       batchUpdateSpreadsheetRequestBody
  //     );

  //     return request.then(
  //       function (response) {
  //         setTimeout(async () => {
  //           try {
  //             let values = [
  //               [
  //                 "index",
  //                 "createdAt",
  //                 "viewedAt",
  //                 "dueIn",
  //                 "questionTitle",
  //                 "questionImage",
  //                 "answerContent",
  //                 "category",
  //               ],
  //             ];
  //             const body = {
  //               values: values,
  //             };
  //             console.log(`title==>${title}`);
  //             console.log(
  //               `response.result.replies[0].addSheet.properties.title==>${response.result.replies[0].addSheet.properties.title}`
  //             );
  //             return await window.gapi.client.sheets.spreadsheets.values.update(
  //               {
  //                 spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
  //                 range: `${title}!1:1`,
  //                 valueInputOption: "USER_ENTERED",
  //                 resource: body,
  //               }
  //             );
  //           } catch (err) {
  //             console.log(err.message);
  //             return;
  //           }
  //         }, 1000);
  //       },
  //       function (reason) {
  //         console.error("error: " + reason.result.error.message);
  //       }
  //     );
  //   } catch (err) {
  //     console.log(err.message);
  //     return;
  //   }
  // }

  static async getAllPrompt(collectionName) {
    const waitForAccessToken = () => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (
            typeof window?.gapi?.client?.getToken()?.access_token === "string"
          ) {
            clearInterval(interval);
            resolve();
          }
          // console.log(
          //   `typeof TOKEN: ${typeof window?.gapi?.client?.getToken()
          //     ?.access_token}`
          // );
          // console.log(
          //   `NEW CONDITION typeof TOKEN: ${
          //     typeof window?.gapi?.client?.getToken()?.access_token == "string"
          //   }`
          // );
          return;
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reject("your error msg");
        }, 5000);
      });
    };
    const token = window?.gapi?.client?.getToken();
    console.log(`token ${token}`);
    return waitForAccessToken()
      .then(async () => {
        let response;
        try {
          response = await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
            range: `${collectionName}!A1:H`,
          });
        } catch (err) {
          console.log(err.message);
          return;
        }

        const range = response.result.values;
        console.log(range);
        if (range.length > 0) {
          const headers = range[0];
          const databaseAsObjectArray = [];

          for (let i = 1; i < range.length; i++) {
            const entry = {};
            for (let j = 0; j < headers.length; j++) {
              const key = headers[j];
              if (key === "") continue;
              console.log(`range[i].length=> ${range[i].length}`);
              entry[key] = range[i][j];
            }
            if (range[i].length > 0) {
              databaseAsObjectArray.push(entry);
            }
          }
          console.log(databaseAsObjectArray);
          return databaseAsObjectArray;
        }
      })
      .catch((err) => console.error(err));
  }

  static async getPrompt(collectionName, index) {
    const waitForAccessToken = () => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (
            typeof window?.gapi?.client?.getToken()?.access_token === "string"
          ) {
            clearInterval(interval);
            resolve();
          }
          console.log(
            `typeof TOKEN: ${typeof window?.gapi?.client?.getToken()
              ?.access_token}`
          );
          console.log(
            `NEW CONDITION typeof TOKEN: ${
              typeof window?.gapi?.client?.getToken()?.access_token == "string"
            }`
          );
          return;
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reject("your error msg");
        }, 5000);
      });
    };
    return waitForAccessToken()
      .then(async () => {
        let response;
        try {
          response = await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
            range: `${collectionName}!${parseInt(index) + 1}:${
              parseInt(index) + 1
            }`,
          });
          const resultObject = response.result.values[0];
          return {
            qindex: resultObject[0],
            createdAt: resultObject[1],
            viewedAt: resultObject[2],
            dueIn: resultObject[3],
            questionTitle: resultObject[4],
            questionImage: resultObject[5],
            answerContent: resultObject[6],
          };
        } catch (err) {
          console.log(err.message);
          return;
        }
      })
      .catch((err) => console.error(err));
  }

  static async editPrompt(collectionName, index, headerValue, value) {
    const waitForAccessToken = () => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (
            typeof window?.gapi?.client?.getToken()?.access_token === "string"
          ) {
            clearInterval(interval);
            resolve();
          }
          console.log(
            `typeof TOKEN: ${typeof window?.gapi?.client?.getToken()
              ?.access_token}`
          );
          console.log(
            `NEW CONDITION typeof TOKEN: ${
              typeof window?.gapi?.client?.getToken()?.access_token == "string"
            }`
          );
          return;
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reject("your error msg");
        }, 5000);
      });
    };
    return waitForAccessToken()
      .then(async () => {
        let response;
        try {
          let values = [[value]];
          const body = {
            values: values,
          };

          let cell;
          switch (headerValue) {
            case "qindex":
              cell = "A";
              break;
            case "createdAt":
              cell = "B";
              break;
            case "viewedAt":
              cell = "C";
              break;
            case "dueIn":
              cell = "D";
              break;
            case "questionTitle":
              cell = "E";
              break;
            case "questionImage":
              cell = "F";
              break;
            case "answerContent":
              cell = "G";
              break;
            case "category":
              cell = "H";
          }
          console.log(`CELL:::::${cell}`);
          console.log(`headerValue:::::${headerValue}`);
          response = await window.gapi.client.sheets.spreadsheets.values.update(
            {
              spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
              range: `${collectionName}!${cell}${parseInt(index) + 1}`,
              valueInputOption: "USER_ENTERED",
              resource: body,
            }
          );
          return response.result;
        } catch (err) {
          console.log(err.message);
          return;
        }
      })
      .catch((err) => console.error(err));
  }

  static async addPrompt(collectionName, index, objValue) {
    const waitForAccessToken = () => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (
            typeof window?.gapi?.client?.getToken()?.access_token === "string"
          ) {
            clearInterval(interval);
            resolve();
          }
          console.log(
            `typeof TOKEN: ${typeof window?.gapi?.client?.getToken()
              ?.access_token}`
          );
          console.log(
            `NEW CONDITION typeof TOKEN: ${
              typeof window?.gapi?.client?.getToken()?.access_token == "string"
            }`
          );
          return;
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reject("your error msg");
        }, 5000);
      });
    };
    return waitForAccessToken()
      .then(async () => {
        let response;
        try {
          let values = [
            [
              index,
              objValue.createdAt,
              objValue.viewedAt,
              objValue.dueIn,
              objValue.questionTitle || " ",
              objValue.questionImage || " ",
              objValue.answerContent || " ",
              objValue.category || " ",
            ],
          ];
          const body = {
            values: values,
          };

          response = await window.gapi.client.sheets.spreadsheets.values.update(
            {
              spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
              range: `${collectionName}!${parseInt(index) + 1}:${
                parseInt(index) + 1
              }`,
              valueInputOption: "USER_ENTERED",
              resource: body,
            }
          );
          return response.result;
        } catch (err) {
          console.log(err.message);
          return;
        }
      })
      .catch((err) => console.error(err));
  }

  static async deletePrompt(collectionName, index) {
    const waitForAccessToken = () => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (
            typeof window?.gapi?.client?.getToken()?.access_token === "string"
          ) {
            clearInterval(interval);
            resolve();
          }
          console.log(
            `typeof TOKEN: ${typeof window?.gapi?.client?.getToken()
              ?.access_token}`
          );
          console.log(
            `NEW CONDITION typeof TOKEN: ${
              typeof window?.gapi?.client?.getToken()?.access_token == "string"
            }`
          );
          return;
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          reject("your error msg");
        }, 5000);
      });
    };
    return waitForAccessToken()
      .then(async () => {
        let response;
        try {
          let values = [["", "", "", "", "", "", "", ""]];
          const body = {
            values: values,
          };

          response = await window.gapi.client.sheets.spreadsheets.values.update(
            {
              spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
              range: `${collectionName}!${parseInt(index) + 1}:${
                parseInt(index) + 1
              }`,
              valueInputOption: "USER_ENTERED",
              resource: body,
            }
          );
          return response.result;
          // let batchUpdateRequest = {
          //   requests: [
          //     {
          //       deleteDimension: {
          //         range: {
          //           sheetId: sheetId,
          //           dimension: "ROWS",
          //           startIndex: parseInt(index),
          //           endIndex: parseInt(index) + 1,
          //         },
          //       },
          //     },
          //   ],
          // };
          // response = gapi.client.sheets.spreadsheets.batchUpdate({
          //   spreadsheetId: process.env.NEXT_PUBLIC_APP_SHEET_ID,
          //   resource: batchUpdateRequest,
          // });
          // return response;
        } catch (err) {
          console.log(err.message);
          return;
        }
      })
      .catch((err) => console.error(err));
  }
}
