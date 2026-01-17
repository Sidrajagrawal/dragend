import { SelectionCard } from "./SelectionCard";
import { Database } from "lucide-react";

const DBS = ["PostgreSQL", "MySQL", "MongoDB", "SQL Server", "Oracle"];

export const StepDatabase = ({ formData, update }) => (
  <div className="grid grid-cols-2 gap-3">
    {DBS.map((db) => (
      <SelectionCard
        key={db}
        title={db}
        icon={<Database size={18} />}
        selected={formData.dbType === db}
        onClick={() => update("dbType", db)}
      />
    ))}
  </div>
);

