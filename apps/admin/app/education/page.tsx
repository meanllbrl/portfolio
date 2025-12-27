import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { getEducations } from "@/app/actions";
import { DeleteButton } from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EducationList } from "@/components/EducationList";

export default async function EducationPage() {
    const educations = await getEducations();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Education</h1>
                <Link href="/education/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </Link>
            </div>

            <EducationList initialItems={educations} />
        </div>
    );
}
