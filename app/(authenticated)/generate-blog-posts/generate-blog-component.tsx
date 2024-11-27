"use client"

import { Input } from "@/components/ui/input";
import { cn, extractYouTubeID } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubmissionButton from "@/components/SubmissionButton";
import { VideoIcon } from "lucide-react";
import { generateBlogPost } from "./actions";

const GenerateBlogComponent = () => {
    const router = useRouter();
    const [link, setLink] = useState<string | null>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    // eslint-disable-next-line
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateYouTubeUrl = (url: string) => {
        const pattern =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        return pattern.test(url);
    };

    const getVideoId = (link: string) => {
        const match = link.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        return match ? match[1] : null;
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const link = e.target.value.trim();

        if (!link) {
            setError(null);
            setIsValid(false);
            return;
        }

        setLink(link);

        const videoId = getVideoId(link);

        if (validateYouTubeUrl(link) && videoId) {
            setError(null);
            setIsValid(true);
        } else {
            setError("Invalid YouTube URL");
            setIsValid(false);
            toast.error("Invalid Youtube Video ID");
        }
    };

    const handleSubmit = async (formData: FormData) => {
        if (!link) {
            setError("Please enter a valid YouTube URL");
            toast.error("Please enter a valid YouTube URL");
            return;
        }

        if (!isValid) {
            setError("Invalid YouTube URL");
            toast.error("Invalid YouTube URL");
            return;
        }

        setError(null);

        const videoId = extractYouTubeID(link || "");

        if (!videoId) {
            setError("Invalid YouTube URL");
            toast.error("Invalid YouTube URL");
            return;
        }

        setIsLoading(true);

        const result = await generateBlogPost(formData);
        if (result.success) {
            router.push("/blog-posts/" + result.data?.id);
        } else {
            router.push(`/error?error=${result.error}`);
        }
    }

    function clearError() {
        setError(null);
        if (error) setLink("");
    }

    const errorStyles = error
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

    return(
        <div className="w-full max-w-[960px]">
            <form
                action={handleSubmit}
                className="flex gap-2 items-center justify-center"
            >
                <Input
                    name="link"
                    placeholder={
                        error ? error : "Youtube Video ID or URL"
                    }
                    value={`${link}`}
                    onChange={handleUrlChange}
                    disabled={isLoading}
                    aria-label="YouTube URL"
                    onMouseDown={clearError}
                    className={cn(
                        "w-full focus:text-amber-600 focus-visible:ring-pink-500",
                        errorStyles
                    )}
                    required
                />
                <SubmissionButton text="Create Blog Post" />
            </form>

            <p className="text-left text-sm text-slate-500 mb-4">
                Supported formats: YouTube video URLs (e.g,
                https://youtube.com/watch?v=...)
            </p>

            {isValid ? (
                <div className="mb-2 aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${getVideoId(link || "")}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube video player"
                    />
                </div>
                ) : (
                <div className="mb-8 aspect-video bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-500 shadow-inner">
                    <VideoIcon className="w-16 h-16 mb-4 text-slate-500" />
                    <p>Enter a YouTube URL to get started.</p>
                </div>
            )}
        </div>
    )
}

export default GenerateBlogComponent