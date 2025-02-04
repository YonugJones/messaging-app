const prisma = require('../prisma/prismaClient');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');

const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const chatId = parseInt(req.body.chatId, 10);
  const content = req.body.content;


  if (!chatId) {
    throw new CustomError('Chat ID needed', 404);
  }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { chatUsers: true },
  });

  if (!chat) {
    throw new CustomError('Chat not found', 404);
  }

  const isSenderInChat = chat.chatUsers.some((user) => user.userId === senderId);
  if (!isSenderInChat) {
    throw new CustomError('Unauthorized. Sender is not part of chat', 403);
  }

  const message = await prisma.message.create({
    data: {
      content,
      authorId: senderId,
      chatId,
      recipients: {
        create: chat.chatUsers
          .filter(user => user.userId !== senderId)
          .map(user => ({ userId: user.userId })),
      },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: message,
  })
});

const editMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { content } = req.body;
  const messageId = parseInt(req.params.messageId, 10);

  if (isNaN(messageId)) {
    throw new CustomError('Invalid message ID', 400);
  }

  if (!messageId) {
    throw new CustomError('Message ID missing', 404);
  }

  if (!content) {
    throw new CustomError('Message content cannot be blank', 404);
  }

  const message = await prisma.message.findUnique({ where: { id: messageId } });

  if (senderId !== message.authorId) {
    throw new CustomError('Unauthorized: only sender can edit message', 403);
  }

  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: { content },
  });

  res.status(200).json({
    success: true,
    message: 'Message updated successfully',
    data: updatedMessage,
  });
});

module.exports = {
  sendMessage,
  editMessage,
}