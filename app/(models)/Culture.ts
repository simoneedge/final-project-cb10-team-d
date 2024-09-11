import mongoose, { Schema } from "mongoose";

export interface ICulture {
    _id: string;
    title?: string;
    longTitle?: string;
    image?: string;
    tag?: string[];
    description?: string;
    date?: string;
    price?: string;
    location?: string;

}

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

const cultureSchema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    longTitle: { type: String, required: true },
    image: { type: String, required: true },
    tag: { type: [String], required: true },  // Modifica qui per essere un array di stringhe
    description: { type: String, required: true },
    date: { type: String, required: false },
    price: { type: String, required: false },
    location: { type: String, required: false },
});

const Culture = mongoose.models.Culture || mongoose.model("Culture", cultureSchema);

export default Culture;