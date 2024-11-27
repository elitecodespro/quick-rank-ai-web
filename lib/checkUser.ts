import { currentUser } from '@clerk/nextjs/server';
import prisma from './prisma';

export const checkUser = async () => {
  const user = await currentUser();

  // Check for current logged in clerk user
  if (!user) {
    return null;
  }

  // Check if the user is already in the database
  const loggedInUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  // If user is in database, return user
  if (loggedInUser) {
    return loggedInUser;
  }

  // If not in database, create new user
  const newUser = await prisma.user.create({
    data: {
      id: user.id,
      clerkId: user.id,
      firstName: `${user.firstName}`,
      lastName: `${user.lastName}`,
      image: `${user.imageUrl}`,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
};
