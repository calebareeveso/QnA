import server from "@/lib/server";
const addQnA = async (collection, data) => {
  try {
    const res = await fetch(`${server}/api/qna/${collection}`, {
      method: "POST", // or 'PUT'
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + "",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to add qna");
    }
    const result = await res.json();
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.log("Error adding qna: ", error);
  }
};

export default addQnA;
