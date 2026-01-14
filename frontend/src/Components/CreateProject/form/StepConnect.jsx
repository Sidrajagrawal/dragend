import { Input } from "./Input";

export const StepConnect = ({ formData, errors, update }) => (
  <div className="space-y-4">
    <Input label="Connection Name" error={errors.connectionName} onChange={(e) => update("connectionName", e.target.value)} />
    <Input label="Host" error={errors.dbHost} onChange={(e) => update("dbHost", e.target.value)} />

    {formData.dbType !== "MongoDB" && (
      <>
        <Input label="Port" error={errors.dbPort} onChange={(e) => update("dbPort", e.target.value)} />
        <Input label="Database Name" error={errors.dbName} onChange={(e) => update("dbName", e.target.value)} />
      </>
    )}

    <Input label="User" error={errors.dbUser} onChange={(e) => update("dbUser", e.target.value)} />
    <Input label="Password" error={errors.dbPass} type="password" onChange={(e) => update("dbPass", e.target.value)} />
  </div>
);

