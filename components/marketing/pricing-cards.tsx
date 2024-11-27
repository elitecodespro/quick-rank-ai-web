"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, PLANS } from "@/utils";
import { SignInButton } from "@clerk/nextjs";
import { CheckCircleIcon } from "lucide-react";

const PricingCards = () => {

    return (
        <div className="w-full flex flex-col items-center justify-center">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full md:gap-8 flex-wrap max-w-5xl mx-auto pt-6">
                {PLANS.map((plan, indy) => (
                    <Card
                        key={plan.name}
                        className={cn(
                            "flex flex-col w-full border-border rounded-xl",
                            plan.name === "Pro" && "border-2 border-purple-500"
                        )}
                    >
                        <CardHeader className={cn(
                            "border-b border-border",
                            plan.name === "Pro" ? "bg-purple-500/[0.07]" : "bg-foreground/[0.03]"
                        )}>
                            <CardTitle className={cn(plan.name !== "Pro" && "text-muted-foreground", "text-lg font-medium")}>
                                {plan.name}
                            </CardTitle>
                            
                            <h5 className="text-3xl font-semibold">
                                ${plan.price}
                                <span className="text-base text-muted-foreground font-normal">
                                    {plan.name !== "Free" ? "/month" : ""}
                                </span>
                            </h5>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircleIcon className="text-purple-500 w-4 h-4" />
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <p className={cn(feature && "border-b !border-dashed border-border cursor-pointer")}>
                                                    {feature}
                                                </p>
                                            </TooltipTrigger>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="w-full mt-auto">
                            {indy === 0 ? (
                                <SignInButton>
                                    <Button
                                        style={{ width: "100%" }}
                                        className={buttonVariants({
                                            variant: "primary",
                                            className: plan.name === "Pro" && "bg-purple-500 hover:bg-purple-500/80 text-white"
                                        })}
                                    >
                                        Get started
                                    </Button>
                                </SignInButton>
                                ) : (
                                <SignInButton>    
                                    <Button
                                        style={{ width: "100%" }}
                                        className={buttonVariants({
                                            variant: "primary",
                                            className: plan.name === "Pro" && "bg-purple-500 hover:bg-purple-500/80 text-white"
                                        })}
                                    >
                                        Upgrade to Pro
                                    </Button>
                                </SignInButton>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

        </div>
    )
};

export default PricingCards
