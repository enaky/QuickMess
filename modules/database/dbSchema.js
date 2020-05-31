const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//-------MESSAGE-------
const messageSchema = new Schema(
    {
        message: {type: String, required: true},
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true},
        date: {type: Date, required: true}
    }
);
const Message = mongoose.model("Message", messageSchema);

//-------CHAT-------
const chatSchema = new Schema(
    {
        messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
    }
)
const Chat = mongoose.model("Chat", chatSchema);

//-------POST-------
const postSchema = new Schema(
    {
        message: {type: String, required: true},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        date: {type: Date, required: true}
    }
);
const Post = mongoose.model("Post", postSchema);

//-------USER-------
const userSchema = new Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        birthDay: {type: Date, required: true},
        email: {type: String, required: true},
        role: {type: String, required: true},
        gender: {type: String, required: true},
        status: {type: String, required: true},
        country: {type: String, required: true},
        city: {type: String, required: true},
        profileImagePath: {type: String},
        posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
        friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        friendRequests: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        friendRequestsSentByMe: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }
);
const User = mongoose.model("User", userSchema);

module.exports = {
    Chat: Chat,
    User: User,
    Message: Message,
    Post: Post,
};
