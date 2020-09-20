const router = require("express").Router();
const {addComment, addReply, removeComment, removeReply} = require("../../controllers/comment-controller");

// Set up POST at /api/comments/:pizzaId/ to add a comment
router
    .route("/:pizzaId")
    .post(addComment);
    
// Set up DELETE at /api/comments/:pizzaId/:commentId to delete a comment
// Set up PUT at /api/comments/:pizzaId/:commentId to add a reply to a comment
router
    .route("/:pizzaId/:commentId")
    .put(addReply)
    .delete(removeComment);
    
// Set up DELETE at /api/comments/:pizzaId/:commentId/:replyId to delete a reply
router
    .route("/:pizzaId/:commentId/:replyId")
    .delete(removeReply);

module.exports = router;