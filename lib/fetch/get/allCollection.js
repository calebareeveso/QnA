import server from "@/lib/server";

const getAllCollection = async () => {
  try {
    const res = await fetch(`${server}/api/collection`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch collection");
    }
    const data = await res.json();

    return data;
  } catch (error) {
    console.log("Error loading collection: ", error);
  }
};

export default getAllCollection;
