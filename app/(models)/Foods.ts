import mongoose, { Schema } from "mongoose";

export interface IFood {
    color: string;
    _id: number;
    title?: string;
    longTitle?: string;
    image?: string;
    tag?: string[];
    description?: string;
    dateStart?: string;
    dateEnd?: string;
    price?: string;
    location?: string;
}

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

const foodsSchema = new Schema({
    /*     _id: { type: String, required: true }, */
    title: { type: String, required: true },
    longTitle: { type: String },
    image: { type: String },
    tag: { type: [String] },  // Modifica qui per essere un array di stringhe
    description: { type: String },
    dateStart: { type: String },
    dateEnd: { type: String },
    price: { type: String },
    location: { type: String },
    color: { type: String }

});

const Food = mongoose.models.Food || mongoose.model("Food", foodsSchema);

export default Food;