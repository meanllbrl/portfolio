import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { getExperiences } from "@/app/actions";
import { DeleteButton } from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { revalidatePath } from "next/cache";
import { ExperienceList } from "@/components/ExperienceList";

export default async function ExperiencePage() {
    const experiences = await getExperiences();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
                <Link href="/experience/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </Link>
            </div>

            <ExperienceList initialItems={experiences} />
        </div>
    );
}
