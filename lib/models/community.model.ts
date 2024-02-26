import mongoose from "mongoose";
/*
 Mongoose schema for a community, including fields for a unique identifier, username, name, image, bio, createdBy (user who created the community),
 an array of posts, and an array of members. The schema is then used to create a Mongoose model,
 which can be used to interact with a MongoDB collection named 'communities'

*/

// Mongoose schema for the Community model is created using mongoose.Schema. This schema outlines the fields and their data types for documents stored in the 'communities' collection
const communitySchema = new mongoose.Schema({
  id: { type: String, required: true }, // Represents a unique identifier for the community. It is of type String and is required

  username: { type: String, required: true , unique: true}, // Represents the unique username for the community. It is of type String, required, and has a unique constraint

  name: { type: String, required: true }, // Represents the name of the community. It is of type String and is required

  image: String, // Represents field for the image associated with the community. It is of type String

  bio: String, // Represents  field for the bio or description of the community. It is of type String

  // Represents the user who created the community. It is of type mongoose.Schema.Types.ObjectId and refers to documents in the 'User' collection
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Represents an array of post references associated with the community. Each element is an ObjectId referencing a document in the 'posts' collection
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  //Represents an array of member references associated with the community. Each element is an ObjectId referencing a document in the 'User' collection
  members: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  ]
  
});
// Mongoose model for the Community schema. It checks if the model already exists to prevent redefinition and then creates it if not
const Community = mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;
