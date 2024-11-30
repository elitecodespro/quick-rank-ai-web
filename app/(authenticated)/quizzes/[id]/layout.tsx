import { extractYouTubeID } from "@/lib/utils";
import ClientYouTubePlayer from "@/components/custom/client-youtube-player";
import prisma from "@/lib/prisma";

export default async function QuizSingleRoute({
  params,
  children,
}: {
  readonly params: any;
  readonly children: React.ReactNode;
}) {

    const { id } = await params;
    
    const data = await prisma.quiz.findFirst({
        where: {
            id: id,
        },
    });

    if (data === null) return <p>No Items Found</p>;
    const videoYTId = extractYouTubeID(data.videoId);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 m-5 min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min">
        <div className="h-full grid gap-4 grid-rows md:grid-cols-5">
            <div className="md:col-span-3">{children}</div>
            <div className="md:col-span-2">
                <ClientYouTubePlayer videoId={videoYTId as string} />
            </div>
        </div>
        </div>
    );
}