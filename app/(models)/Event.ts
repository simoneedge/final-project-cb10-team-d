import mongoose, { Schema } from "mongoose";

export interface IEvent {
    color: string;
    _id: number;
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

const eventSchema = new Schema({
    /*     _id: { type: String, required: true }, */
    title: { type: String, required: true },
    longTitle: { type: String },
    image: { type: String },
    tag: { type: [String] },  // Modifica qui per essere un array di stringhe
    description: { type: String },
    date: { type: String },
    price: { type: String },
    location: { type: String },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);



export default Event;