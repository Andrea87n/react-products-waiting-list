"use client";
import { useEffect, useState } from "react";

export default function SidebarPopular() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/popular");
      const json = await res.json();
      if (json.ok) setData(json.stats);
    } catch (err) {
      console.error("Error loading popular list:", err);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("waitinglist-updated", loadData);
    return () => window.removeEventListener("waitinglist-updated", loadData);
  }, []);

  if (!data.length) return null;

  return (
    <aside className="w-full bg-white border-r border-gray-200 p-4 h-screen sticky top-0 overflow-y-auto order-2 md:w-64 md:order:1">
      <h2 className="font-semibold mb-3 text-gray-700">Most Requested</h2>
      <ul className="space-y-2 text-sm">
        {data.map((item) => (
          <li key={item._id} className="flex justify-between">
            <span className="text-gray-600">Product ID: {item._id}</span>
            <span className="text-gray-400">{item.total}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
