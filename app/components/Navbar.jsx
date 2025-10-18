"use client";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

export default function Navbar() {
  const { userEmail, logout } = useUser();
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWaitingList = async () => {
    if (!userEmail) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/waitinglist?email=${userEmail}`);
      const data = await res.json();
      if (data.ok && data.items) setWaitingList(data.items);
      else setWaitingList([]);
    } catch (err) {
      console.error("Error fetching waiting list", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-3 border-b">
      <Link href="/" className="font-bold text-lg">
        Shop
      </Link>

      <div className="flex gap-3 items-center">
        {userEmail ? (
          <>
            <span className="text-sm">Hi, {userEmail}</span>

            {/* Bottone Waiting List */}
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                fetchWaitingList();
                document.getElementById("waitinglist_modal").showModal();
              }}
            >
              My Waiting List
            </button>

            <button onClick={logout} className="btn btn-warning btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-outline btn-sm">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Modal DaisyUI */}
      <dialog id="waitinglist_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Your Waiting List</h3>

          {loading ? (
            <p>Loading...</p>
          ) : waitingList.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {waitingList.map((item) => (
                <li key={item._id}>
                  Product ID: <span className="font-mono">{item.productId}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No products in your waiting list.</p>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
