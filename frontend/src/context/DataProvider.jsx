import { useState } from "react";
import { DataContext } from "./DataContext";
import { useEffect } from "react";

const DataProvider = ({ children }) => {
  const [data, setData] = useState({ courses: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [courseRes, catRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/course/getAllCourse`),
        fetch(`${import.meta.env.VITE_API_URL}/category/getAllCategories`),
      ]);
      const courseResult = await courseRes.json();
      const catResult    = await catRes.json();
      setData({
        courses:    courseResult.courses || [],
        categories: catResult.categories || [],
      });
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