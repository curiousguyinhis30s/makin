import Sidebar from "@/components/organisms/Sidebar";
import { CommandPalette } from "@/components/portal/CommandPalette";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pt-[60px] md:pt-0">
                {children}
            </main>
            <CommandPalette />
        </div>
    );
}
