import createError from "../utils/createError.js"
import Conversation from "../models/conversation.model.js"

export const createConversation = async (req,res,next)=>{
        const newConversation = new Conversation({
            conversationId: req.body.conversationId,
            userId:req.userId,
            desc:req.body.desc
        })
    try{
       // const savedConversation = await newConversation.save()


    } catch (err) {
        next(err)
        
    }

};
export const getConversations = async (req,res,next)=>{
    try {
        const conversations = await Conversation.find({ConversationId: req.params.id});
        res.status(200).send(conversations);
    } catch (err) {
        next(err)
        
    }

};