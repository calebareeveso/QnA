import Qna from "@/models/qna";
import connectMongoDB from "@/lib/db/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { collection, id } = params;
  const updatedData = await request.json();
  await connectMongoDB();
  await Qna(collection).findByIdAndUpdate(id, updatedData);
  return NextResponse.json(
    { message: `Updated collection:${collection} with id:${id}`, updatedData },
    { status: 200 }
  );
}

export async function DELETE(request, { params }) {
  // const id = request.nextUrl.searchParams.get("id");
  const { collection, id } = params;
  await connectMongoDB();
  await Qna(collection).findByIdAndDelete(id);
  return NextResponse.json(
    { message: "QnA deleted", collection, id },
    { status: 200 }
  );
}
