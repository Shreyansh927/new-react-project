import { useState, useMemo } from "react";

const OPTIONS = ["apple", "banana", "grapes", "orange", "apricot"];

export default function Autocomplete() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => OPTIONS.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {query && (
        <ul>
          {filtered.map((opt) => (
            <li key={opt}>{opt}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
