import { Input } from "./Input";

export const StepConnect = ({ formData, errors, update }) => (
  <div className="space-y-4">
    <Input
      label="Connection Name"
      onChange={(e) => update("connectionName", e.target.value)}
    />

    {formData.dbType === "Oracle" && (
      <Input
        label="Service Name"
        onChange={(e) => update("serviceName", e.target.value)}
      />
    )}
    <Input label="Host" onChange={(e) => update("host", e.target.value)} />
    <Input
      label="PORT"
      error={errors.connectionName}
      onChange={(e) => update("port", e.target.value)}
    />

    {/* URI ONLY */}
    {formData.authType === "uri" && (
      <Input
        label="Database URI"
        onChange={(e) => update("uri", e.target.value)}
      />
    )}

    {/* CREDENTIALS */}
    {formData.authType === "credentials" && (
      <>
        <Input label="URI" onChange={(e) => update("uri", e.target.value)} />
        <Input
          label="Username"
          onChange={(e) => update("username", e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          onChange={(e) => update("password", e.target.value)}
        />
      </>
    )}

    {/* API KEY */}
    {formData.authType === "apiKey" && (
      <>
        <Input
          label="Endpoint"
          onChange={(e) => update("endpoint", e.target.value)}
        />
        <Input
          label="API Key"
          type="password"
          onChange={(e) => update("apiKey", e.target.value)}
        />
      </>
    )}
  </div>
);
