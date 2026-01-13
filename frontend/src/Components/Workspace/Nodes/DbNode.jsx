import { useState } from "react";
import SchemaForm from "../Database/SchemaForm";
import { Eye } from "lucide-react";

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
      {/* DB NODE */}
      <div className="w-48 bg-[#202020] text-white rounded-lg shadow-lg border border-gray-700">
        <div className="text-center p-1 border-b border-gray-700">
          <input
            type="text"
            placeholder="Schema Name"
            className="w-full text-xs bg-transparent outline-none text-center"
          />
        </div>

        {/* FIELD LIST */}
        <div className="px-2 py-1 text-xs space-y-1">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#2a2a2a] rounded px-2 py-1"
            >
              <div>
                <div className="font-medium">
                  {field.name}
                </div>
                <div className="text-gray-400 text-[10px]">
                  {field.type}
                </div>
              </div>

              <Eye
                size={14}
                className="cursor-pointer text-gray-400 hover:text-white"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              />
            </div>
          ))}
        </div>

        {/* VIEW MORE DETAILS */}
        {expandedIndex !== null && (
          <div className="px-2 py-2 text-[10px] text-gray-300 border-t border-gray-700">
            <div>Required: {fields[expandedIndex].required ? "Yes" : "No"}</div>
            <div>Constraint: {fields[expandedIndex].constraint || "None"}</div>
          </div>
        )}

        {/* ADD FIELD */}
        <div className="p-1 text-center text-xs text-gray-400 border-t border-gray-700">
          <button
            className="hover:text-white"
            onClick={() => setShowForm(true)}
          >
            + Add Field
          </button>
        </div>
      </div>

      {/* MODAL */}
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
