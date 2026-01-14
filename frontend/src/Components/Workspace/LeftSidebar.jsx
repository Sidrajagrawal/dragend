import { Files, GitBranch, Database, Settings, Workflow } from "lucide-react";

const items = [
    // { id: "explorer", icon: Files, label: "File Explorer" },
    { id: "db", icon: Database, label: "Database" },
    { id: "workflow", icon: Workflow, label: "Workflow" },
    { id: "git", icon: GitBranch, label: "Version Control" },
];

function LeftSidebar({ activePanel, setActivePanel }) {
    return (
        <div className="w-16 h-180 mt-[2%] bg-[#333333] flex flex-col items-center py-4 rounded-full ml-[1%]">
            <div className="flex flex-col gap-4 mt-5">
                {items.map(({ id, icon: Icon, label }) => {
                    const isActive = activePanel === id;

                    return (
                        <button
                            key={id}
                            title={label}
                            onClick={() => setActivePanel(isActive ? null : id)}
                            className={`group relative w-12 h-12 flex items-center justify-center rounded-md
                ${isActive
                                    ? "text-white bg-[#2a2d2e]"
                                    : "text-gray-400 hover:text-white hover:bg-[#2a2d2e]"
                                }
              `}
                        >
                            <span
                                className={`absolute left-0 top-0 h-full w-1 bg-purple-700 rounded-full transition-opacity
                  ${isActive
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                    }
                `}
                            />

                            <Icon size={22} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default LeftSidebar;
