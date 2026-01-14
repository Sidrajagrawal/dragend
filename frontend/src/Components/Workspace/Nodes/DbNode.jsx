import { useState } from "react";
import SchemaForm from "../Database/SchemaForm";

function DbNode() {
  const [showForm, setShowForm] = useState(false);
  const [fields, setFields] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addField = (field) => {
    setFields((prev) => [...prev, field]);
    setShowForm(false);
  };

  return (
    <>
      <div className="relative w-30 bg-[#202020] text-white text-xs rounded-lg shadow-lg border border-gray-700">
        <div className="text-center p-1 border-b border-gray-700">
          <input type="text" placeholder="Schema Name" className="w-full text-[9px] bg-transparent outline-none text-center" />
        </div>
        <div className="p-1 text-[9px] space-y-1">
          {fields.map((field, index) => (
            <div
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
              key={index}
              className="flex items-center justify-between bg-[#2a2a2a] rounded px-2 py-1 cursor-pointer hover:bg-[#464646]"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="max-w-[55px] truncate" title={field.name}>
                  {field.name}
                </span>

                <span className="text-gray-400 text-[8px]">
                  {field.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {expandedIndex !== null && (
          <div className="absolute top-0 left-full ml-2 w-40 bg-[#1f1f1f] border border-gray-700 rounded-lg shadow-xl p-2 text-[9px] z-50 ">
            <div className="font-semibold text-white mb-1">
              {fields[expandedIndex].name}
            </div>
            <div className="space-y-1 text-gray-300">
              <div>
                <span className="text-gray-400">Type:</span>{" "}
                {fields[expandedIndex].type}
              </div>
              <div>
                <span className="text-gray-400">Required:</span>{" "}
                {fields[expandedIndex].required ? "Yes" : "No"}
              </div>
              <div>
                <span className="text-gray-400">Constraint:</span>{" "}
                {fields[expandedIndex].constraint || "None"}
              </div>
            </div>
          </div>
        )}
        <div className="p-1 text-center text-[9px] text-gray-400 ">
          <button className="hover:text-white cursor-pointer" onClick={() => setShowForm(true)} >
            + Add Field
          </button>
        </div>
      </div>

      {showForm && (
        <SchemaForm
          onClose={() => setShowForm(false)}
          onSave={addField}
        />
      )}
    </>
  );
}

export default DbNode;