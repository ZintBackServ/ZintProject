import { useState } from "react";
import { DataContext } from "./DataContext";
import { useEffect } from "react";

const DataProvider = ({ children }) => {
  const [data, setData] = useState({ courses: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`);
      const result = await res.json();
      setData({ courses: result.courses || [] });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <DataContext.Provider value={{ data, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;