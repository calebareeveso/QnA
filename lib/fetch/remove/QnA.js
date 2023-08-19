import server from "@/lib/server";
const removeQnA = async (collection, id) => {
  try {
    const res = await fetch(`${server}/api/qna/${collection}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to Delete qna");
    }
    const result = await res.json();
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.log("Error deleteing qna: ", error);
  }
};

export default removeQnA;
