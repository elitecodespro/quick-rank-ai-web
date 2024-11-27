import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { tips } from "@/utils/constants/tips"
import { Tips } from "@/utils/types"
import GenerateSummariesComponent from "./generate-summaries-component"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { checkContentCreationEligibility } from "@/utils/stripe"

const GenerateSummariesPage = async () => {

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

            <GenerateSummariesComponent />

            <Card className="mx-auto w-full mt-5">
                <CardHeader>
                    <CardTitle className="text-left text-2xl font-bold">
                        How to generate summaries from your videos?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-500">
                        Make sure you follow all the tips below before submitting any youtube video
                        URL.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {tips?.map((tip: Tips) => (
                            <div
                            className="p-4 rounded-lg mt-4 border border-zinc-600 bg-zinc-800"
                            key={tip.icon}
                            >
                            <p className="text-gray-400">{tip.description}</p>
                            <div className="text-2xl mt-2">{tip.icon}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default GenerateSummariesPage