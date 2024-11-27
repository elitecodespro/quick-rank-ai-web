"use client";

import { DeleteButton } from "@/components/DeleteButton";
import SubmissionButton from "@/components/SubmissionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export function BlogPostCardForm({
    item,
    className,
  }: {
    readonly item: any;
    readonly className?: string;
  }) {

    return (
        <Card className={cn("mb-8 relative h-auto", className)}>
          <CardHeader> 
            <CardTitle>Video Blog Post </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <form>
                <Input
                  id="title"
                  name="title"
                  placeholder="Update your title"
                  required
                  className="mb-4"
                  defaultValue={item.title}
                />
                <div className="flex-1 flex flex-col">
                  <Tabs
                  defaultValue="preview"
                  className="flex flex-col h-full gap-2"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="markdown">Edit Post</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="flex-1">
                      <ReactMarkdown
                        className="
                        markdown-preview
                        relative w-full h-[600px]
                        overflow-auto scroll-smooth
                        p-4 px-3 py-2
                        text-sm
                        bg-gray-950 dark:bg-gray-950 bg-transparent
                        border border-gray-600 dark:border-gray-700
                        rounded-md
                        shadow-sm
                        mb-4
                        placeholder:text-muted-foreground
                        focus-visible:outline-none
                        focus-visible:bg-gray-900
                        focus-visible:ring-1
                        focus-visible:ring-ring
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                      >
                        {item.content}
                      </ReactMarkdown>
                    </TabsContent>

                    <TabsContent value="markdown" className="flex-1">
                      <Textarea
                        name="content"
                        className="
                          markdown-preview
                          relative w-full h-[600px]
                          overflow-auto scroll-smooth
                          p-4 px-3 py-2
                          text-sm
                          bg-white dark:bg-gray-800 bg-transparent
                          border border-gray-300 dark:border-gray-700
                          rounded-md
                          shadow-sm
                          mb-4
                          placeholder:text-muted-foreground
                          focus-visible:outline-none
                          focus-visible:bg-gray-950
                          focus-visible:ring-1
                          focus-visible:ring-ring
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                        defaultValue={item.content}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                <input type="hidden" name="id" value={item.id} />
                <SubmissionButton text="Update Blog Post" />
              </form>
              <form>
                <DeleteButton className="absolute right-4 top-4 bg-red-700 hover:bg-red-600" />
              </form>
            </div>
          </CardContent>
        </Card>
    )
  }