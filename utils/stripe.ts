"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

interface StripeSubscription {
  status: string;
  current_period_start: number;
  current_period_end: number;
  created: number;
}

export async function hasSubscription(): Promise<{
  isSubscribed: boolean;
  subscriptionData: StripeSubscription[];
}> {
    const { userId } = await auth();

  if (userId) {
    const userDB = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userDB?.stripe_customer_id) {
      return {
        isSubscribed: false,
        subscriptionData: [],
      };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: String(userDB.stripe_customer_id),
    });

    return {
      isSubscribed: subscriptions.data.length > 0,
      subscriptionData: subscriptions.data,
    };
  }

  return {
    isSubscribed: false,
    subscriptionData: [],
  };
}

export async function createCheckoutLink(customer: string) {
    const checkout = await stripe.checkout.sessions.create({
        success_url: `https://www.quickrankaipro.com/dashboard`,
        customer: customer, 
        line_items: [
            {
                price: "price_1QPQ1ILSekAHjJz7rhjyqvSd",
                quantity: 1
            }
        ], 
        mode: "subscription"
    })

    return checkout.url
}

export async function generateCustomerPortalLink(customerId: string) {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `https://www.quickrankaipro.com/dashboard`,
    });

    return portalSession.url;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate portal link");
  }
}

export async function createCustomerIfNull() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const userDB = await prisma.user.findFirst({
        where: {
        id: userId,
        },
    });

    if (!userDB?.stripe_customer_id) {
        const customer = await stripe.customers.create({
        email: userDB?.email ?? "",
        });

        await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            stripe_customer_id: customer.id,
        },
        });
    }

    return userDB?.stripe_customer_id;
}

export async function checkContentCreationEligibility(): Promise<{
  isEligible: boolean;
  message: string;
  remainingGenerations: number;
}> {

    const { userId } = await auth();

    if (!userId) {
        return {
        isEligible: false,
        message:
            "You must be logged in to see how many content generations you can make.",
        remainingGenerations: 0,
        };
    }

    const userDB = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });

    if (!userDB) {
        return {
        isEligible: false,
        message:
            "You must be logged in to see how many content generations you can make.",
        remainingGenerations: 0,
        };
    }

    const stripeSubscriptionData = await hasSubscription();

    const currentDate = new Date();

    let isSubscribed = false;
    let periodStart: Date;
    let periodEnd: Date;

    if (stripeSubscriptionData.subscriptionData.length > 0) {
        const subscription = stripeSubscriptionData.subscriptionData[0];
        isSubscribed = subscription.status === "active";
        periodStart = new Date(subscription.current_period_start * 1000);
        periodEnd = new Date(subscription.current_period_end * 1000);
    } else {
        periodEnd = currentDate;
        periodStart = new Date(currentDate.getTime() - 30 * 24 * 60 * 1000);
    }

    const blogPostGenerationCount = await prisma.posts.count({
        where: {
            user_id: userDB.id,
            createdAt: {
                gte: periodStart,
                lte: periodEnd,
            },
        },
    });

    const summaryGenerationCount = await prisma.summaries.count({
        where: {
            user_id: userDB.id,
            createdAt: {
                gte: periodStart,
                lte: periodEnd,
            },
        },
    });

    const quizGenerationCount = await prisma.quiz.count({
      where: {
          userId: userDB.id,
          createdAt: {
              gte: periodStart,
              lte: periodEnd,
          },
      },
    });

    const totalGenerationCount = blogPostGenerationCount + summaryGenerationCount + quizGenerationCount;

    const limit = isSubscribed ? 30 : 3;
    const remainingGenerations = Math.max(0, limit - totalGenerationCount);

    if (remainingGenerations === 0) {
        const resetDate = isSubscribed
        ? periodEnd.toLocaleDateString()
        : new Date(
            currentDate.getTime() + 24 + 60 * 60 * 1000
            ).toLocaleDateString();

        return {
        isEligible: false,
        message: isSubscribed
            ? `You have reached the maximum number of content generations (30) for this subscription period. Reset Date: ${resetDate}`
            : `You have reached the maximum number of content generations (10) for the free tier. You can generate more starting ${resetDate}`,
        remainingGenerations: 0,
        };
    }

    return {
        isEligible: true,
        message: `You have ${remainingGenerations} content generation${
        remainingGenerations !== 1 ? "s" : ""
        } remaining for this ${isSubscribed ? "billing cycle" : "month"}`,
        remainingGenerations: remainingGenerations,
    };
}
