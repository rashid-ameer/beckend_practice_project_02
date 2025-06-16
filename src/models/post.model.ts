import mongoose, { type Document } from "mongoose";

interface PostDocument extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<PostDocument>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model<PostDocument>("Post", postSchema);
export default PostModel;
