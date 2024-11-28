"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronsUpDown, GalleryVerticalEnd, Package, Settings } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "../ui/breadcrumb";
import { buttonVariants } from "../ui/button";

interface Props {
    children: React.ReactNode
    user: any
    subscribed: boolean
    manage_link: string
    checkout_link: string
}

const AuthenticatedSidebar = ({ user, subscribed, manage_link, checkout_link, children }: Props) => {
    const pathname = usePathname()
    
    const data = {
    
        navMain: [
            {
                title: "",
                url: "#",
                isActive: pathname == "/dashboard" ? true : false,
                items: [
                    {
                        title: "Dashboard",
                        url: "/dashboard",
                        isActive: pathname == "/dashboard" ? true : false,
                    }
                ]
            },
            {
                title: "Blogs",
                url: "#",
                isActive: (pathname == "/blog-posts") || (pathname == "/generate-blog-posts") ? true : false,
                items: [
                    {
                      title: "My Blog Posts",
                      url: "/blog-posts",
                      isActive: pathname == "/blog-posts" ? true : false,
                    },
                    {
                        title: "Generate Blog Posts",
                        url: "/generate-blog-posts",
                        isActive: pathname == "/generate-blog-posts" ? true : false
                    },
                ]
            },
            {
                title: "Summaries",
                url: "#",
                isActive: (pathname == "/summaries") || (pathname == "/generate-summaries") ? true : false,
                items: [
                    {
                      title: "My Summaries",
                      url: "/summaries",
                      isActive: pathname == "/summaries" ? true : false,
                    },
                    {
                        title: "Generate Summaries",
                        url: "/generate-summaries",
                        isActive: pathname == "/generate-summaries" ? true : false
                    },
                ],
            }
        ],
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="bg-zinc-900 text-slate-300">
                    <SidebarMenu>
                        <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-zinc-700 hover:text-zinc-300"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <GalleryVerticalEnd className="size-4" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold">{`${user?.firstName || "User"}`}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width]"
                            align="start"
                            >
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent className="bg-zinc-900 text-slate-300">
                    {/* We create a SidebarGroup for each parent. */}
                    {data.navMain.map((item) => (
                        <SidebarGroup key={item.title}>
                            <SidebarGroupLabel className="text-slate-400">{item.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive}>
                                            <Link href={item.url}>{item.title}</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-zinc-500">Plan</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem className="flex cursor-pointer">
                                    {subscribed ? (
                                        <Link
                                            href={manage_link}
                                            className={buttonVariants({
                                                variant: "primary",
                                                className: "align-middle"
                                            })}
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            Manage subscription
                                        </Link>
                                        ) : (
                                        <Link
                                            href={checkout_link}
                                            className={buttonVariants({
                                                variant: "primary",
                                                className: "align-middle"
                                            })}
                                        >
                                            <Package className="mr-2 h-4 w-4" />
                                            Upgrade to pro
                                        </Link>
                                    )}
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex w-full justify-between align-middle">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        {`Welcome back, 👋 ${user?.firstName || "User"}`}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                
                            </BreadcrumbList>
                        </Breadcrumb>

                        {subscribed ? (
                            <Link
                                href={manage_link}
                                className={buttonVariants({
                                    variant: "primary",
                                    className: "align-middle"
                                })}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Manage subscription
                            </Link>
                            ) : (
                            <Link
                                href={checkout_link}
                                className={buttonVariants({
                                    variant: "primary",
                                    className: "align-middle"
                                })}
                            >
                                <Package className="mr-2 h-4 w-4" />
                                Upgrade to pro
                            </Link>
                        )}

                        <UserButton />
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
    
}

export default AuthenticatedSidebar