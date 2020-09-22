const {Schema, model, Types} = require("mongoose");
const moment = require("moment");

const ReplySchema = new Schema(
    {
        // Set a custom id to avoid confusion with parent comment _id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        writtenBy: {
            type: String, 
            required: true,
            trim: true
        },
        replyBody: {
            type: String, 
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // Reformat date on backend using Moment.js
            get: (createdAtVal) => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a")
        }
    },
    // Allow the use of getters (allows Moment.js functionality)
    {
        toJSON: {
            getters: true
        }
    }
);

const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String, 
            required: true,
            trim: true
        },
        commentBody: {
            type: String, 
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // Reformat date on backend using Moment.js
            get: (createdAtVal) => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a")
        },
        replies: [ReplySchema]
    },
    // Allow the use of getters (allows Moment.js functionality)
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

CommentSchema.virtual("replyCount").get(function() {
    return this.replies.length;
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;