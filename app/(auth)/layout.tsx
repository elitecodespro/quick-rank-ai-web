import MaxWidthWrapper from "@/components/marketing/global/max-width-wrapper";
import { Toaster } from "@/components/ui/sonner";
import React from 'react';

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <MaxWidthWrapper>
            <Toaster richColors theme="dark" position="top-right" />
            <main className="mx-auto w-full relative">
                {children}
            </main>
        </MaxWidthWrapper>
    );
};

export default MarketingLayout
