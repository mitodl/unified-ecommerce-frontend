"use client";
import { useSearchParams } from "next/navigation";

const Cart = () => {
  const searchParams = useSearchParams();
  return (
    <div>
      <h1>Cart</h1>
      <pre>{JSON.stringify(Object.fromEntries(searchParams), null, 2)}</pre>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const params = formData.get("params");
          window.history.pushState(null, "", `?${params}`);
        }}
      >
        <input name="params" />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Cart;
