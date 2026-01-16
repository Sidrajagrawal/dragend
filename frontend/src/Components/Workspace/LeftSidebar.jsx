import { Files, GitBranch, Database, Workflow } from "lucide-react";
import logo from '../../media/logo.png';
import { useNavigate } from 'react-router-dom';

const items = [
    { id: "Dragend", icon: logo, label: "Home", isImage: true },
    { id: "db", icon: Database, label: "Database" },
    { id: "workflow", icon: Workflow, label: "Workflow" },
    { id: "git", icon: GitBranch, label: "Version Control" },
];

function LeftSidebar({ activePanel, setActivePanel }) {
    const navigate = useNavigate();

    const handleClick = (id) => {
        if (id === "Dragend") {
            navigate('/');
            setActivePanel(null);
            return;
        }
        setActivePanel(activePanel === id ? null : id);
    };

    return (
        <div className="w-16 h-[90vh] bg-[#333333] flex flex-col items-center py-6 rounded-full ml-4 z-50 shadow-xl border border-white/5">
            <div className="flex flex-col gap-6 w-full items-center">
                {items.map(({ id, icon: Icon, label, isImage }) => {
                    const isActive = activePanel === id;
                    return (
                        <button key={id} title={label} onClick={() => handleClick(id)}
                            className={`group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200
                                ${isActive ? "text-white bg-purple-600 shadow-lg shadow-purple-500/20" : "text-gray-400 hover:text-white hover:bg-[#444]"} `} >
                            {isActive && (
                                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full" />
                            )}
                            {isImage ? (
                                <img src={Icon} alt={label} className="w-10 h-10 object-contain" />
                            ) : (
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
export default LeftSidebar;