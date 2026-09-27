import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { DataContext } from "./DataContext";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const DataProvider = ({ children }) => {
  const { pathname } = useLocation();
  const isPortal = pathname.startsWith("/admin") || pathname.startsWith("/user/");

  const [data, setData] = useState({
    courses:        [],
    categories:     [],
    events:         [],
    mentors:        [],
    updates:        [],
    placedStudents: [],
  });
  const [loading, setLoading] = useState(!isPortal);
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const endpoints = [
        { key: "courses",        url: `${API}/course/getAllCourse` },
        { key: "categories",     url: `${API}/category/getAllCategories` },
        { key: "events",         url: `${API}/event/allEvent` },
        { key: "mentors",        url: `${API}/mentor/allMentor` },
        { key: "updates",        url: `${API}/updates/getAllUpdates` },
        { key: "placedStudents", url: `${API}/placedStudent/allPlacedStudent` },
      ];

      const results = await Promise.allSettled(
        endpoints.map(ep => fetch(ep.url, { credentials: "include" }).then(r => (r.ok ? r.json() : null)))
      );

      const parsed = {};
      endpoints.forEach((ep, i) => {
        const res = results[i].status === "fulfilled" ? results[i].value : null;
        if (!res) {
          parsed[ep.key] = [];
          return;
        }

        // Handle various backend response wrappers (e.g. { courses: [...] }, { data: [...] }, [...])
        if (Array.isArray(res)) {
          parsed[ep.key] = res;
        } else if (Array.isArray(res[ep.key])) {
          parsed[ep.key] = res[ep.key];
        } else if (Array.isArray(res.data)) {
          parsed[ep.key] = res.data;
        } else if (Array.isArray(res.Data)) {
          parsed[ep.key] = res.Data;
        } else if (Array.isArray(res.result)) {
          parsed[ep.key] = res.result;
        } else {
          parsed[ep.key] = [];
        }
      });

      setData(parsed);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("DataProvider error fetching global data:", error);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Trigger fetch if we are on a public route and haven't fetched yet.
  // Also fires when navigating from a portal/admin route to any public page.
  useEffect(() => {
    if (!isPortal && !hasFetchedRef.current) {
      fetchData();
    }
  }, [isPortal, fetchData]);

  return (
    <DataContext.Provider value={{ data, loading, refetch: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;