"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChapterSet } from "@prisma/client";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSadTear } from "react-icons/fa";
import Clipboard from "clipboard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 9;

interface ChaptersWrapperProps {
  user: {
    savedChapters: ChapterSet[];
  };
}

const ChaptersWrapper = ({ user }: ChaptersWrapperProps) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.ceil(user.savedChapters.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentChapters = user.savedChapters.slice(startIndex, endIndex);

    const clipboard = new Clipboard(".btn-copy");

    useEffect(() => {
        clipboard.on("success", (e) => {
        setCopiedId(e.trigger.id);
        setTimeout(() => {
            setCopiedId(null);
        }, 2000);
        e.clearSelection();
        });

        return () => clipboard.destroy();
    }, []);

    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `.custom-scrollbar::-webkit-scrollbar {
                width: 8px
            }
            .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
            }`;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <Card className="mx-auto w-full">
            <CardHeader>
                <CardTitle className="text-left text-2xl font-bold">
                    My Generated timestamps for YouTube videos
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div>
                    {user?.savedChapters.length === 0 && (
                        <div className="flex flex-col gap-4 mt-12 text-center">
                            <h1 className="text-2xl font-bold flex items-center justify-center gap-2 text-gray-500">
                                No chapters found <FaSadTear className="w-10 h-10" />
                            </h1>
                            <p className="text-gray-500">
                                You do not have any chapters saved. Try generating some chapters for
                                a YouTube video.
                            </p>
                        </div>
                    )}

                    {user?.savedChapters && user.savedChapters.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-2">
                            {currentChapters.map((chapter: ChapterSet) => (
                                <div
                                key={chapter.id}
                                className="border border-gray-700 rounded-md p-4 flex flex-col h-[320px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                <h2 className="text-lg font-semibold mb-2 truncate h-16">
                                    {chapter.title}
                                </h2>
                                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                                    {chapter.content.map((line: string, index: number) => (
                                    <p key={index} className="text-sm text-gray-400 mb-1">
                                        {line}
                                    </p>
                                    ))}
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                            value={"outline"}
                                            className={`w-full flex justify-center items-center space-x-2 btn-copy ${
                                                copiedId === chapter.id ? "bg-violet-950" : ""
                                            }`}
                                            variant={"outline"}
                                            id={chapter.id}
                                            data-clipboard-text={chapter.content.join("\n")}
                                            >
                                            {copiedId === chapter.id ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                            <span>{copiedId === chapter.id ? "Copied" : "Copy"}</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                            {copiedId === chapter.id
                                                ? "Copied To Clipboard!"
                                                : "Copy chapters to clipboard!"}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                </div>
                            ))}
                        </div>
                    )}

                    {user?.savedChapters.length > 0 && (
                        <Pagination className="mt-8">
                            <PaginationContent>
                                <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    className={
                                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                                    }
                                />
                                </PaginationItem>
                                {[...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                    href="#"
                                    onClick={() => setCurrentPage(index + 1)}
                                    >
                                    {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={() =>
                                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                                        }
                                        className={
                                        currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ChaptersWrapper;