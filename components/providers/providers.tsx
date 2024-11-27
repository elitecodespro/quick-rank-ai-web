"use client";

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

interface Props {
    children: React.ReactNode;
}

const Providers = ({ children }: Props) => {

    return (
        <ClerkProvider 
            appearance={{
                baseTheme: dark,
            }}

            telemetry={false}
        >
            {children}
        </ClerkProvider>
    )
};

export default Providers
