import ProductCard from "./components/ProductCard";
import SidebarPopular from "./components/SidebarPopular";
import products from "../products.json";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex">
      <SidebarPopular />

      <div className="flex-1 p-8">
        <Link
          href="/admin"
          className="btn btn-warning rounded-full fixed bottom-4 right-4 z-10"
        >
          Admin
        </Link>

        <h1 className="text-4xl font-semibold text-center mb-4">
          React Products Waiting List
        </h1>
        <h2 className="text-center mb-8">
          A Waiting List small React application + Tailwind + MongoDB for demo
          purposes only!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
