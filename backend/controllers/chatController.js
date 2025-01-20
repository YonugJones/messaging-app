const prisma = require('../prisma/prismaClient');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');

const createChat = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const chat = await prisma.chat.create({
    data: {
      chatUsers: {
        create: { userId }
      }
    },
    include: { chatUsers: true }
  });

  res.status(201).json({
    success: true,
    message: 'Chat created successfully',
    data: chat,
  });
});

const getChat = asyncHandler(async (req, res) => {
  const chatId = parseInt(req.params.chatId, 10);
  const userId = req.user.id;

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      chatUsers: true,
      messages: true,
    },
  });

  if (!chat) {
    throw new CustomError('Chat not found', 404);
  }
  
  const isUserInChat = chat.chatUsers.some((chatUser) => chatUser.userId === userId);
  if (!isUserInChat) {
    throw new CustomError('Unauthorized: must be in chat to view', 403);
  }

  res.status(200).json({
    success: true,
    message: 'Chat retrieved',
    data: chat,
  });
});

const addUserToChat = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { chatId, chatUserIds } = req.body;

  if (!chatId) {
    throw new CustomError('Chat ID needed', 404);
  }

  if (!chatUserIds || !Array.isArray(chatUserIds) || chatUserIds.length === 0) {
    throw new CustomError('chatUserIds to add are missing', 404);
  }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      chatUsers: true,
    },
  });

  if (!chat) {
    throw new CustomError('Chat not found', 404);
  }

  const isUserInChat = chat.chatUsers.some((chatUser) => chatUser.userId === userId);
  if (!isUserInChat) {
    throw new CustomError('Unauthorized: must be in chat to view', 403);
  }

  const newChatUsers = chatUserIds.map((chatUserId) => ({
    userId: chatUserId,
    chatId,
  }))

  await prisma.chatUser.createMany({
    data: newChatUsers,
    skipDuplicates: true,
  });

  const updatedChat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      chatUsers: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'User or users added to chat',
    data: updatedChat,
  });
});

module.exports = {
  createChat,
  getChat,
  addUserToChat,
}