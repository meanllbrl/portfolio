import Link from "next/link";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getProjects } from "@/app/actions";
import { SafeDeleteButton } from "@/components/SafeDeleteButton";
import { ProjectList } from "@/components/ProjectList";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage your portfolio projects.</p>
                </div>
                <Link href="/projects/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Project
                    </Button>
                </Link>
            </div>

            <ProjectList initialProjects={projects} />
        </div>
    );
}
