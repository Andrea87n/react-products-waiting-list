"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function ProductCard({ product }) {
  const { userEmail } = useUser();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/waitinglist?productId=${product.id}&email=${userEmail}`);
        const data = await res.json();
        if (data.ok && data.subscribed) setSubscribed(true);
      } catch (err) {
        console.error("Error checking waiting list", err);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [product.id, userEmail]);

  const handleWaitingList = async () => {
    if (!userEmail) {
      alert("You need to log in to join the waiting list.");
      return;
    }

    if (disabledButton) return;

    setDisabledButton(true);
    setTimeout(() => setDisabledButton(false), 1000)

    if (subscribed) {
      const confirmRemove = confirm("Remove from waiting list?");
      if (!confirmRemove) return;

      const res = await fetch("/api/waitinglist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email: userEmail }),
      });

      const data = await res.json();
      if (data.ok) {
        setSubscribed(false);
        window.dispatchEvent(new Event("waitinglist-updated"));
      } else {
        alert("Error: " + data.message);
      }
      return;
    }

    const res = await fetch("/api/waitinglist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, email: userEmail }),
    });

    const data = await res.json();
    if (data.ok) {
      setSubscribed(true);
      window.dispatchEvent(new Event("waitinglist-updated"));
    } else {
      alert("Error! " + data.message);
    }
  };

  const simulateAddToCart = () => {
    alert('For demo purposes only!');
  }

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure className="px-10 pt-10">
        <img src={product.image} alt={product.title} className="rounded-xl" />
      </figure>

      <div className="card-body items-center text-center">
        <h2 className="card-title">{product.title}</h2>
        <p>{product.description}</p>

        <div className="card-actions">
          {product.status === "instock" ? (
            <button className="btn btn-primary" onClick={simulateAddToCart}>Buy Now</button>
          ) : loading ? (
            <button className="btn btn-disabled" disabled>
              Checking...
            </button>
          ) : (
            <button
              className={`btn ${subscribed ? "btn-success" : "btn-secondary"}`}
              onClick={handleWaitingList}
              disabled={disabledButton}
            >
              {disabledButton
                ? "Please wait..."
                : subscribed
                ? "Added to Waiting List"
                : "Add to Waiting List"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
