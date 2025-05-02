"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ElectionsPage() {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/election/getAllElections");
        if (!response.ok) {
          throw new Error("Failed to fetch elections data");
        }

        const data = await response.json();
        setElections(data);
      } catch (err) {
        console.error("Error fetching elections:", err);
        setError("Failed to load elections data. Please try again.");
        toast.error("Error", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchElections();
  }, []);

  if (isLoading) {
    return <div>Loading elections...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Elections</h1>
      <ul>
        {elections.map((election) => (
          <li key={election.id}>
            <h2>{election.title}</h2>
            <p>{election.description}</p>
            <p>Status: {election.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
