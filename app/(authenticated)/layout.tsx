import AuthenticatedSidebar from '@/components/authenticated/AuthenticatedSidebar';
import { checkUser } from '@/lib/checkUser';
import prisma from '@/lib/prisma';
import { createCheckoutLink, createCustomerIfNull, generateCustomerPortalLink, hasSubscription } from '@/utils/stripe';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

interface Props {
    children: React.ReactNode
}

const AuthLayout = async ({ children }: Props) => {
    const user = await checkUser();
    await createCustomerIfNull();

    if (!user) {
        redirect('/sign-in')
    }

    const userData = await prisma.user.findFirst({
        where: {
          id: user?.id,
        },
        select: {
          stripe_customer_id: true,
        },
    });
    
    if (!userData) {
        redirect("/");
    }

    const subscribed = await hasSubscription();
    const manage_link = await generateCustomerPortalLink(
    "" + userData.stripe_customer_id
    );
    const checkout_link = await createCheckoutLink(
    "" + userData?.stripe_customer_id
    );
    
    return (
        <main className="mx-auto w-full relative">
            <AuthenticatedSidebar 
                user={user}
                subscribed={subscribed.isSubscribed}
                manage_link={manage_link || ""}
                checkout_link={checkout_link || ""}
            >
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            </AuthenticatedSidebar>
        </main>
    );
};

export default AuthLayout
