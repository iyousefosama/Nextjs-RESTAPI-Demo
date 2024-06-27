import { model, models, Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },
  },
  { timestamps: true }
);

const Blogs = models.Blogs || model("Blogs", blogSchema);
export default Blogs;
