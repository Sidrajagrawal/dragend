import { Database } from "lucide-react";

function ActivePanelDb() {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: "dbNode" })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        draggable
        onDragStart={onDragStart}
        className="flex justify-center gap-2 p-3 rounded-lg cursor-grab bg-[#2a2d2e] hover:bg-[#3a3d3e]"
      >
        <Database size={20} />
        <span className="text-sm">New Schema</span>
      </div>
    </div>
  );
}

export default ActivePanelDb;
