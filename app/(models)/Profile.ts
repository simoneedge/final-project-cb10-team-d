import mongoose, { Schema } from "mongoose";

export interface IProfile {
    mail: string;
    eventId: [string]
}

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;

const profileSchema = new Schema({
    mail: { type: String },
    eventId: { type: [String] }
});

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;