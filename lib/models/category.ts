import {Schema, model, models} from "mongoose";

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    }
}, {timestamps: true});

const Categories = models.Categories || model("Categories", categorySchema);
export default Categories;