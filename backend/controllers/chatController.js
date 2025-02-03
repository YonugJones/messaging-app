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

const getUserChats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // declare chats variable
  const chats = await prisma.chat.findMany({
    // match chats where
    where: {
      // in chatUsers category
      chatUsers: {
        some: {
          // there contains a userId that matches the req userId
          userId: userId
        }
      }
    },
    // info to be included
    include: {
      // within the chatUsers
      chatUsers: {
        // include
        include: {
          // within the user
          user: {
            // id, username, and profilePic
            select: { id: true, username: true, profilePic: true }
          }
        }
      },
      // within the messages
      messages: {
        // order by newest first
        orderBy: { createdAt: 'desc' },
        // display only one message
        take: 1,
      }
    }
  });

  // if there are no chats
  if (!chats.length) {
    // return success 
    return res.status(200).json({
      success: true,
      message: 'No chats found',
      data: []
    });
  }

  res.status(200).json({
    success: true,
    message: 'User chats retrieved successfully',
    data: chats,
  });
});

const getChat = asyncHandler(async (req, res) => {
  // declare chatId from url params
  const chatId = parseInt(req.params.chatId, 10);
  // declare useId from id attached to req.user
  const userId = req.user.id;

  // find a chat
  const chat = await prisma.chat.findUnique({
    // where the id matches the url chatId param
    where: { id: chatId },
    // include
    include: {
      // within chatUsers
      chatUsers: {
        include: {
          // these categories
          user: { select: { id: true, username: true, profilePic: true } }
        }
      },
      // and messages array
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
    userId,
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
  getUserChats,
  getChat,
  addUserToChat,
}