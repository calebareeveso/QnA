import server from "@/lib/server";
const removeCollection = async (collection) => {
  try {
    // const res = await fetch(`${server}/api/qna/${collection}`, {
    //   method: "DELETE",
    // });

    // if (!res.ok) {
    //   throw new Error("Failed to Delete qna");
    // }
    // const result = await res.json();
    // console.log("Success:", result);
    // return result;

    return { error: "REMOVED FUNCTIONALITY" };
  } catch (error) {
    console.log("Error deleteing qna: ", error);
  }
};

export default removeCollection;
