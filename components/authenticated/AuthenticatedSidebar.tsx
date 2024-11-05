"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronsUpDown, GalleryVerticalEnd, LogOut, Search } from "lucide-react";
import { Label } from "../ui/label";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "../ui/breadcrumb";

interface Props {
    children: React.ReactNode
}

const AuthenticatedSidebar = ({ children }: Props) => {
    const pathname = usePathname()
    const { user } = useUser();
    const { signOut } = useClerk();

    const data = {
    
        navMain: [
            {
                title: "Dashboard",
                url: "/dashboard",
                isActive: pathname == "/dashboard" ? true : false
            },
            {
                title: "My Chapters",
                url: "/chapters",
                isActive: pathname == "/chapters" ? true : false
            },
            {
                title: "Generate Chapters",
                url: "/generate-chapters",
                isActive: pathname == "/generate-chapters" ? true : false
            },
            {
                title: "My Presentations",
                url: "/presentations",
                isActive: pathname == "/presentations" ? true : false
            },
            {
                title: "Generate Presentations",
                url: "/generate-presentations",
                isActive: pathname == "/generate-presentations" ? true : false
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
                    <form>
                        <SidebarGroup className="py-0">
                            <SidebarGroupContent className="relative">
                                <Label htmlFor="search" className="sr-only">
                                    Search
                                </Label>
                                <SidebarInput
                                id="search"
                                placeholder="Search the docs..."
                                className="pl-8"
                                />
                                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </form>
                </SidebarHeader>
                <SidebarContent className="bg-zinc-900 text-slate-300">
                    {/* We create a SidebarGroup for each parent. */}
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-zinc-500">List of Features</SidebarGroupLabel>
                        <SidebarGroupContent>
                            {data.navMain.map((item) => (
                                <SidebarMenu key={item?.title}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={item?.isActive} className="hover:bg-zinc-700 hover:text-zinc-300">
                                        <Link href={item.url} className="visited:bg-zinc-700 active:bg-zinc-700">{item.title}</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                </SidebarMenu>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel className="text-zinc-500">Account</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem onClick={() => signOut()} className="flex cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span className="align-middle">Sign out</span>
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
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    {`Welcome back, 👋 ${user?.firstName || "User"}`}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
    
}

export default AuthenticatedSidebar