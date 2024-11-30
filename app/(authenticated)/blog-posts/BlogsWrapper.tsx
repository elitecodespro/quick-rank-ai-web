"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Posts } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaSadTear } from "react-icons/fa";

const ITEMS_PER_PAGE = 9;

interface BlogsWrapperProps {
    user: {
      savedPosts: Posts[];
    };
}

const BlogsWrapper = ({ user }: BlogsWrapperProps) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.ceil(user.savedPosts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const filteredPosts = user?.savedPosts.filter((post) => post.archived === false)
    const currentPosts = filteredPosts.slice(startIndex, endIndex);

    return (
        <div className="space-y-6 py-6 px-6">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <p className="text-muted-foreground mt-1">
                        Manage your Blog Posts
                    </p>
                </div>
                <Link href={"/generate-blog-posts"} className={buttonVariants()}>
                    New Blog Post
                </Link>
            </div>

            <section>
                {filteredPosts.length === 0 && (
                    <Card
                    className="bg-card hover:shadow-lg transition-all duration-300 border hover:border-primary/20"
                    >
                        <CardContent>
                            <div className="flex flex-col gap-4 mt-12 text-center h-full pt-10 pb-16">
                                <h1 className="text-2xl font-bold flex items-center justify-center gap-2 text-gray-500">
                                    No Blog Post found <FaSadTear className="w-10 h-10" />
                                </h1>
                                <p className="text-gray-500">
                                    You do not have any Blog Post saved. Try generating some Blog Post for
                                    a YouTube video.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {filteredPosts && filteredPosts.length > 0 && (
                    <>
                        <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentPosts.map((post: Posts) => (
                                <Card
                                    key={post.id}
                                    className="bg-card hover:shadow-lg transition-all duration-300 border hover:border-primary/20"
                                >
                                    <CardHeader>
                                        <CardTitle className="line-clamp-1 text-lg text-card-foreground">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-4">
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {post.content.split("\n").slice(1).join("\n")}
                                            </p>
                                            <Link
                                                href={`/blog-posts/${post.id}`}
                                                className={buttonVariants({
                                                    variant: "primary",
                                                    className: "w-full justify-center",
                                                })}
                                            >
                                                Manage Post <ArrowRight className="w-5 h-5 pt-1" />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredPosts.length > 0 && (
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
                    </>
                )}
            </section>
        </div>
    )
}

export default BlogsWrapper;

