import Qna from "@/models/qna";
import connectMongoDB from "@/lib/db/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  const { collection } = params;
  const { title } = await request.json();
  await connectMongoDB();
  let db = mongoose.connection.db;

  db.collection(collection).rename(title);
  return NextResponse.json(
    { message: "collection updated", collection, title },
    { status: 200 }
  );
}

export async function DELETE(request, { params }) {
  // const id = request.nextUrl.searchParams.get("id");
  // const { collection } = params;
  // await connectMongoDB();
  // await mongoose.connection.db.dropCollection(collection);
  // return NextResponse.json(
  //   { message: "Collection deleted", collection },
  //   { status: 200 }
  // );
  return NextResponse.json({ error: "REMOVED FUNCTIONALITY" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { collection } = params;
  await connectMongoDB();
  const qna = await Qna(collection).find();
  return NextResponse.json({ qna }, { status: 200 });
}

export async function POST(request, { params }) {
  const { collection } = params;
  const {
    qindex,
    createdAt,
    viewedAt,
    dueIn,
    questionTitle,
    questionImage,
    answerContent,
    category,
  } = await request.json();
  await connectMongoDB();

  if (
    qindex == null &&
    createdAt == null &&
    viewedAt == null &&
    dueIn == null &&
    questionTitle == null &&
    questionImage == null &&
    answerContent == null &&
    category == null
  ) {
    if (collection !== "drawer.css.map") {
      await Qna(collection).create();
    }
  } else {
    await Qna(collection).create({
      qindex: qindex ?? 0,
      createdAt: createdAt ?? "",
      viewedAt: viewedAt ?? "",
      dueIn: dueIn ?? "",
      questionTitle: questionTitle ?? "",
      questionImage: questionImage ?? "",
      answerContent: answerContent ?? "",
      category: category ?? "",
    });
  }
  return NextResponse.json({ message: "QnA Created" }, { status: 201 });
}
