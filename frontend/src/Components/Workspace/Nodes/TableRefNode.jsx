import { Handle, Position } from "@xyflow/react";
import { Database } from "lucide-react";

function TableRefNode({ data }) {
  return (
    <div className="relative min-w-[140px] bg-[#202020] rounded-lg border border-purple-500/30 shadow-lg overflow-hidden group">

      {/* Header */}
      <div className="bg-[#2a2a2a] px-3 py-2 border-b border-gray-700 flex items-center gap-2">
        <Database size={12} className="text-purple-400" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
          {data.tableName}
        </span>
      </div>

      {/* Simplified Fields View (No Handles) */}
      <div className="p-1.5 flex flex-col gap-1">
        {data.fields?.slice(0, 5).map((field, index) => ( // Only show first 5 to save space? Or all.
          <div key={index} className="flex items-center gap-2 px-2 py-1 bg-[#1a1a1a] rounded border border-gray-800/50">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 
                 ${field.constraint === 'primary' ? 'bg-yellow-500' :
                field.constraint === 'foreign' ? 'bg-blue-500' : 'bg-gray-600'}`}
            />
            <span className="text-[9px] text-gray-400 font-medium truncate">{field.name}</span>
          </div>
        ))}
        {data.fields?.length > 5 && (
          <div className="text-[8px] text-gray-500 text-center py-0.5">
            + {data.fields.length - 5} more fields
          </div>
        )}
      </div>

      {/* --- SINGLE SOURCE HANDLE --- */}
      <Handle
        type="source"
        position={Position.Right}
        id="table-source"
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-[#202020] transition-transform hover:scale-125"
        style={{ right: -6, top: '50%' }} // Centered on the right
      />
    </div>
  );
}

export default TableRefNode;