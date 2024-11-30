import React from 'react';
import GenerateBlogComponent from './generate-blog-component';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { checkContentCreationEligibility } from '@/utils/stripe';

const GenerateBlogPostsPage = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/");
    }

    const { isEligible, message, remainingGenerations } =
    await checkContentCreationEligibility();

    return (
        <div className="flex flex-1 flex-col gap-4 p-8 m-5 min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min">

            {!isEligible && (
                <div className="p-4 mb-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {message}
                </div>
            )}
            {remainingGenerations > 0 && (
                <div className="p-4 mb-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                    {message}
                </div>
            )}
            {isEligible && remainingGenerations === 0 && (
                <div className="p-4 mb-2 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    {message}
                </div>
            )}
            
            <GenerateBlogComponent />
        </div>
    )
};

export default GenerateBlogPostsPage