const {Pizza} = require("../models");

const pizzaController = {

    // Get all pizzas at api/pizzas
    getAllPizza(req, res) {
        Pizza.find({})
            // populate allows you to see data from comment model rather than just comment id
            .populate({
                path: "comments",
                select: "-__v"
            })
            // Tell Pizza model not to display default __v property
            .select("-__v")
            // Sort the pizzas in descending order (newest first)
            .sort({_id: -1})
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Get one pizza at api/pizzas/id
    getPizzaById({params}, res) {
        Pizza.findOne({_id: params.id})
            .populate({
                path: "comments",
                select: "-__v"
            })
            .select("-__v")
            .then(dbPizzaData => {
                if(!dbPizzaData) {
                    res.status(404).json({message: "No pizza found with this id."});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Create a pizza at api/pizzas
    createPizza({body}, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Update a pizza at api/pizzas/id
    updatePizza({params, body}, res) {
        // findOneAndUpdate will return the document as a response, updateOne or updateMany do not return the new document
        Pizza.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
            .then(dbPizzaData => {
                if(!dbPizzaData) {
                    res.status(404).json({message: "No pizza found with this ID"});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Delete a pizza at api/pizzas/id
    deletePizza({params}, res) {
        Pizza.findOneAndDelete({_id: params.id})
            .then(dbPizzaData => {
                if(!dbPizzaData) {
                    res.status(404).json({message: "No pizza found with this ID"});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }

};

module.exports = pizzaController;