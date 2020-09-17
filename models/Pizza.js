const moment = require("moment");
const {Schema, model} = require("mongoose");

const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String
        },
        createdBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // Reformat date on backend using Moment.js
            get: (createdAtVal) => moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a")
        },
        size: {
            type: String,
            default: "Large"
        },
        toppings: [],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    },
    // Allows use of virtuals for comment count property.  This line not necessary if no virtuals
    // Also allow the use of getters (allows Moment.js functionality)
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// Get number of comments and replies on retrieval of a Pizza object
PizzaSchema.virtual("commentCount").get(function() {
    return this.comments.length;
});

const Pizza = model("Pizza", PizzaSchema);

module.exports = Pizza;