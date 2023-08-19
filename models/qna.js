import mongoose, { Schema } from "mongoose";

const Qna = (collection) => {
  const qnaSchema = new Schema(
    {
      qindex: Number,
      createdAt: String,
      viewedAt: String,
      dueIn: String,
      questionTitle: String,
      questionImage: String,
      answerContent: String,
      category: String,
    },
    { collection: collection }
  );

  return mongoose.models[collection] || mongoose.model(collection, qnaSchema);
};

export default Qna;
