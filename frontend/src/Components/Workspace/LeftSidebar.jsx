import { Files, GitBranch, Database, Settings, Workflow } from "lucide-react";

const items = [
    { id: "explorer", icon: Files, label: "File Explorer" },
    { id: "db", icon: Database, label: "Database" },
    { id: "Workflow", icon: Workflow, label: "Workflow" },
    { id: "git", icon: GitBranch, label: "Version Control" },
];

function LeftSidebar() {
    return (
        <div className="w-16 h-180 mt-[2%] bg-[#333333] flex flex-col justify-between items-center py-4 rounded-full ml-[1%]">
            <div className="flex flex-col gap-4 mt-5">
                {items.map(({ id, icon: Icon, label }) => (
                    <button key={id} title={label} className="group relative w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2a2d2e] rounded-md" >
                        <span className="absolute left-0 top-0 h-full w-1 bg-purple-700 rounded-full opacity-0 group-hover:opacity-100" />
                        <Icon size={22} />
                    </button>
                ))}
            </div>
            <div className="flex flex-col gap-4">
                <button title="Settings" className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2a2d2e] rounded-md" >
                    <Settings size={22} />
                </button>
            </div>
        </div>
    );
}

export default LeftSidebar;
