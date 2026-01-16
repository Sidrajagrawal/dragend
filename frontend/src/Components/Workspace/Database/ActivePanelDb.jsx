import { Database, Table, Plus } from "lucide-react";

function ActivePanelDb() {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: "dbNode" })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
        Database Entities
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div draggable onDragStart={onDragStart}
          className="group relative flex items-center gap-3 p-3 rounded-lg cursor-grab bg-[#2a2d2e] border border-transparent hover:border-purple-500/50 hover:bg-[#333] transition-all select-none overflow-hidden shadow-sm hover:shadow-purple-500/10"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600" />
          <div className="p-2 rounded-md bg-[#202020] text-purple-400 group-hover:text-white group-hover:bg-purple-600 transition-all duration-300 shadow-inner">
            <Table size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
              New Schema
            </span>
            <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400 transition-colors">
              Create a new Schema
            </span>
          </div>
          <div className="absolute right-2 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
            ⋮⋮
          </div>
        </div>
      </div>
    </div>
  );
}
export default ActivePanelDb;