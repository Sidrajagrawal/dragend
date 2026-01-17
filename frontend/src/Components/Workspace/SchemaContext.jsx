import { createContext, useContext, useState } from "react";
const SchemaContext = createContext();
export const useSchema = () => useContext(SchemaContext);

export const SchemaProvider = ({ children }) => {
    const [savedSchemas, setSavedSchemas] = useState([]);

    const saveSchema = (schema) => {
        setSavedSchemas((prev) => {
            const exists = prev.find((s) => s.id === schema.id);
            if (exists) {
                return prev.map((s) => (s.id === schema.id ? schema : s));
            }
            return [...prev, schema];
        });
    };

    return (
        <SchemaContext.Provider value={{ savedSchemas, saveSchema }}>
            {children}
        </SchemaContext.Provider>
    );
};