"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, GraduationCap, FileText, Trophy, MessageSquare } from "lucide-react";
import clsx from "clsx";
import { ModeToggle } from "./ModeToggle";

const navItems = [
    { name: "Hero & CV", href: "/hero", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: LayoutDashboard },
    { name: "Posts", href: "/posts", icon: FileText },
    { name: "Experience", href: "/experience", icon: Briefcase },

    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Education", href: "/education", icon: GraduationCap },
    { name: "Recommendations", href: "/recommendations", icon: MessageSquare },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
            <div className="flex h-14 items-center justify-between border-b px-4">
                <h1 className="text-lg font-bold">Portfolio Admin</h1>
                <ModeToggle />
            </div>
            <nav className="flex-1 space-y-1 p-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t space-y-2">
                <p className="text-xs text-muted-foreground text-center">v1.1.0 Local</p>
            </div>
        </div>
    );
}
