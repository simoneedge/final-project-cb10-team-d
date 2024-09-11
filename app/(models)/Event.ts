import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

const eventSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: false },
    category: { type: String, required: false }

});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;