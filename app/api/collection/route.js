import formattedDate from "@/lib/fDate";
import connectMongoDB from "@/lib/db/mongodb";
import { NextResponse } from "next/server";
import Qna from "@/models/qna";
import mongoose from "mongoose";
// forced dynamic render
export const dynamic = "force-dynamic";

// Function to get collection information
export async function GET(request) {
  await connectMongoDB();

  const collections = await mongoose.connection.db.listCollections().toArray();

  const collectionInfoArray = await Promise.all(
    collections
      .filter(({ name }) => {
        return name !== "users";
      })
      .filter(({ name }) => {
        return name !== "collection1";
      })
      .map(async (collection) => {
        const collectionName = collection.name;
        const collectionModel = Qna(collectionName); // Assuming you have the Qna function defined
        const collectionData = await collectionModel.find({});
        const numberOfDocuments = await collectionModel.countDocuments();
        const noOfDueQnas = collectionData.filter(
          (obj) =>
            obj.viewedAt !== undefined &&
            Number(
              formattedDate.datediff(
                formattedDate.parseDate(obj.viewedAt),
                formattedDate.parseDate(formattedDate.Today())
              )
            ) >= Number(obj.dueIn)
        ).length;

        return {
          title: collectionName,
          noOfQnas: numberOfDocuments,
          noOfDueQnas: noOfDueQnas,
        };
      })
  );

  return NextResponse.json(collectionInfoArray, { status: 201 });
}
