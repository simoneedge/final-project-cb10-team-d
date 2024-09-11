import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

const eventSchema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: false },
    longTitle: { type: String, required: false },
    image: { type: String, required: false },
    tag: { type: [String], required: false },  // Modifica qui per essere un array di stringhe
    description: { type: String, required: false },
    date: { type: String, required: false },
    price: { type: String, required: false },
    location: { type: String, required: false },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;