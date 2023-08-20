import server from "@/lib/server";
export const revalidate = 0;
const getAllQnA = async (collection) => {
  try {
    const res = await fetch(`${server}/api/qna/${collection}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch qna");
    }
    const data = await res.json();
    const qna = data.qna;
    return qna;
  } catch (error) {
    console.log("Error loading qna: ", error);
  }
};

export default getAllQnA;
