const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const ReactionSchema = newSchema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timeCreated) => moment(timeCreated).format('dddd, MMMM Do YYYY, h:mm:ss a')
        }
    }
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timeCreated) => moment(timeCreated).format('dddd, MMMM Do YYYY, h:mm:ss a')
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema]
    }
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});