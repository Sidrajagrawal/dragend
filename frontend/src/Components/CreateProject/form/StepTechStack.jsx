import { SelectionCard } from "./SelectionCard";
import { Globe, Server } from "lucide-react";

// const FRONTENDS = ["React", "Vue", "Angular", "Next.js"];
const BACKENDS = ["Node + Express", "FastAPI", "Django", "Laravel", "Spring Boot"];

export const StepTechStack = ({ formData, update }) => (
  <div className="space-y-6">
    {/* <h3 className="text-2xl font-semibold">Frontend</h3> */}

    {/* {FRONTENDS.map((f) => (
      <SelectionCard
        key={f}
        title={f}
        icon={<Globe size={18} />}
        selected={formData.frontend === f}
        onClick={() => update("frontend", f)}
      />
    ))} */}

    <h3 className="text-2xl font-semibold mt-6">Backend</h3>

    {BACKENDS.map((b) => (
      <SelectionCard
        key={b}
        title={b}
        icon={<Server size={18} />}
        selected={formData.backend === b}
        onClick={() => update("backend", b)}
      />
    ))}
  </div>
);
