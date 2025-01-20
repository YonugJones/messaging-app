const prisma = require('../prisma/prismaClient');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');

const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { chatId, content, recipientIds } = req.body;


  if (!chatId) {
    throw new CustomError('Chat ID needed', 404);
  }

  if (!content || !recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
    throw new CustomError('Message content and recipients are required', 400);
  }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { chatUsers: true },
  });
  if (!chat) {
    throw new CustomError('Chat not found', 404);
  }

  const isSenderInChat = chat.chatUsers.some((user) => user.id === senderId);
  if (!isSenderInChat) {
    throw new CustomError('Unauthorized. Sender is not part of chat', 403);
  }

  const allRecipientsValid = recipientIds.every((recipientId) => {
    chat.chatUsers.some((user) => user.id === recipientId)
  });
  if (!allRecipientsValid) {
    throw new CustomError('One or more recipients are not part of chat', 400);  
  }

  const message = await prisma.message.create({
    data: {
      content,
      authorId: senderId,
      chatId,
      recipients: {
        create: recipientIds.map((recipientId) => ({
          userId: recipientId,
        })),
      },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: message,
  })
});

module.exports = {
  sendMessage,
}