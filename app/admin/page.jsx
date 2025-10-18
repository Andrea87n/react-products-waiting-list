"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminWaitingList() {
  const [email, setEmail] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/waitinglist?email=${email}`);
      const data = await res.json();
      if (data.ok) setEntries(data.entries);
      else setEntries([]);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Waiting List Search</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
        ) : entries.length > 0 ? (
          <table className="table w-full border">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2 text-left">Product ID</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-2">{item.productId}</td>
                  <td className="p-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null
      }

      <div className="flex">
        <Link href="/" className="btn btn-warning rounded-full mt-8 mx-auto">Back to Shop</Link>
      </div>


    </div>
  );
}