const { User, Thought } = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    createThought({ body }, res) {
        // console.log("BODY", body)
        Thought.create(body)
            .then(({ _id }) => {
                // console.log("ID: ", _id)
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                )
                .then(dbUserData => {
                    // console.log('DBUSERDATA: ', dbUserData)
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found with this id!' });
                        return;
                    }
                    res.json(dbUserData);
                })
                .catch(err => res.json(err));
            })

    },

    updateThought({ params, body}, res) {
        // console.log("BODY: ", body)
        // console.log("PARAMS: ", params)
        Thought.findOneAndUpdate(
            { _id: params.id },
            { thoughtText: body.thoughtText },
            { new: true }
        )
        .then(dbThoughtData => {
            // console.log("DBTHOUGHTDATA: ", dbThoughtData)
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with that id!' });
                    return;
                }
                
                User.findOneAndUpdate(
                    { username: dbThoughtData.username },
                    { $pull: { thoughts: params.id } }
                )
                .then(() => {
                    res.json({ message: 'Thought delete successful!' })
                })
                .catch(err => res.status(500).json(err))
            })
            .catch(err => res.status(500).json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' })
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err)) 
    },

    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    }
}

module.exports = thoughtController;