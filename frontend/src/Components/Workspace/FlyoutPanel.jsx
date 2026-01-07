import { Table, Link2 } from "lucide-react";
import ActivePanelDb from "./Database/ActivePanelDb";
import ActivePanelExplorer from "./Explorer/ActivePanelExplorer";
import ActivePanelFlow from "./ActivePanelFlow";
import ActivePanelGit from "./ActivePanelGit";

function FlyoutPanel({ activePanel }) {
    return (
        <div className="w-64 h-180 mt-[2%] ml-3 bg-[#202020] rounded-2xl p-4 text-white shadow-lg">
            {activePanel === "db" && (
                <div>
                    <ActivePanelDb />
                </div>
            )}

            {activePanel === "explorer" && (
                <div className="text-gray-400 text-sm">
                    <ActivePanelExplorer />
                </div>
            )}

            {activePanel === "workflow" && (
                <div className="text-gray-400 text-sm">
                    <ActivePanelFlow />
                </div>
            )}

            {activePanel === "git" && (
                <div className="text-gray-400 text-sm">
                    <ActivePanelGit />
                </div>
            )}
        </div>
    );
}

export default FlyoutPanel;
