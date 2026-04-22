const express = require('express')
const router = express.Router()
const authenticate = require('../../middleware/authenticate')
const messageController = require('./messaging.controller')

router.use(authenticate)

// Chat List
router.get('/chat-list', messageController.getChatList)

// Conversation (use ?userId=XX)
router.get('/conversation', messageController.getConversation)

// Send Message
router.post('/', messageController.sendMessage)

// Mark Seen
router.put('/seen', messageController.markConversationSeen)

// Edit Message
router.put('/:id', messageController.editMessage)

// Unread Count
router.get('/unread-count', messageController.getUnreadMessageCount)

// Predefined Questions
router.get('/predefined-questions', messageController.getPredefinedQuestions)

module.exports = router
