const {Pizza} = require("../models");

const pizzaController = {

    // Get all pizzas at api/pizzas
    getAllPizza(req, res) {
        Pizza.find({})
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Get one pizza at api/pizzas/id
    getPizzaById({params}, res) {
        Pizza.findOne({_id: params.id})
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
        Pizza.findOneAndUpdate({_id: params.id}, body, {new: true})
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