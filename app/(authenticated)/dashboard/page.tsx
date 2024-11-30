import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import MagicCard from '@/components/ui/magic-card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DashboardPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <MagicCard className="p-0 md:p-0 relative w-full">
          <Link href={`/generate-blog-posts`} className="w-full h-full absolute -z-1 inset-0"></Link>
          <Card className="group border-0">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-center h-40 lg:h-52 overflow-hidden">
                <Image
                    src={'/assets/bgp1.jpg'}
                    alt='Generate Blog Post'
                    width={1024}
                    height={1024}
                    unoptimized
                    className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col items-start justify-start mt-4">
                <CardTitle className="text-lg font-semibold text-foreground/80 group-hover:text-foreground transition-all duration-300">
                    Generate Blogs
                </CardTitle>
                <CardDescription className="mt-2">
                    Create posts from any youtube videos
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </MagicCard>

        <MagicCard className="p-0 md:p-0 relative">
          <Link href={`/generate-quizzes`} className="w-full h-full absolute -z-1 inset-0"></Link>
          <Card className="group border-0">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-center h-40 lg:h-52 overflow-hidden">
                <Image
                    src={'/assets/bgp3.jpg'}
                    alt='Generate Quiz'
                    width={1024}
                    height={1024}
                    unoptimized
                    className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col items-start justify-start mt-4">
                <CardTitle className="text-lg font-semibold text-foreground/80 group-hover:text-foreground transition-all duration-300">
                  Generate Quiz
                </CardTitle>
                <CardDescription className="mt-2">
                  Create quiz from any youtube videos
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </MagicCard>

        <MagicCard className="p-0 md:p-0 relative">
          <Link href={`/generate-summaries`} className="w-full h-full absolute -z-1 inset-0"></Link>
          <Card className="group border-0">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-center h-40 lg:h-52 overflow-hidden">
                <Image
                    src={'/assets/bgp2.jpg'}
                    alt='Generate Summaries'
                    width={1024}
                    height={1024}
                    unoptimized
                    className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col items-start justify-start mt-4">
                <CardTitle className="text-lg font-semibold text-foreground/80 group-hover:text-foreground transition-all duration-300">
                  Generate Summaries
                </CardTitle>
                <CardDescription className="mt-2">
                  Create summaries from any youtube videos
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </MagicCard>
        
      </div>
    </div>
  )
}

export default DashboardPage