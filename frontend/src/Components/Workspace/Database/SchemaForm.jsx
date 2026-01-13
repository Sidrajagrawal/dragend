import { useState } from "react";
import ModalPortal from "../../common/ModalPortal";
function SchemaForm({ onClose, onSave }) {
  const [field, setField] = useState({
    name: "",
    type: "string",
    constraint: "",
    required: false,
  });
  const handleSave = () => {
    if (!field.name.trim()) return;
    onSave(field);
  };
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white text-black rounded-xl w-[420px] p-5 shadow-2xl">
          <h2 className="text-sm font-semibold mb-4">Add Field</h2>
          <div className="flex flex-col gap-3">
            <input placeholder="Field name" className="border px-3 py-2 text-sm rounded outline-none" value={field.name} onChange={(e) => setField({ ...field, name: e.target.value }) } />
            <select className="border px-3 py-2 text-sm rounded outline-none" value={field.type} onChange={(e) => setField({ ...field, type: e.target.value })}>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
            </select>
            <select className="border px-3 py-2 text-sm rounded outline-none" value={field.constraint}
              onChange={(e) =>
                setField({ ...field, constraint: e.target.value })
              }
            >
              <option value="">Constraint</option>
              <option value="unique">Unique</option>
              <option value="primary">Primary Key</option>
              <option value="foreign">Foreign Key</option>
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={field.required}
                onChange={(e) =>
                  setField({ ...field, required: e.target.checked })
                }
              />
              Required
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <button onClick={onClose} className="px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400" >
              Cancel
            </button>

            <button onClick={handleSave} className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700">
              Save
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

export default SchemaForm;
