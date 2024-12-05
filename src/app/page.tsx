"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMetaIntegratedSystemsList } from "@/services/ecommerce/meta/hooks";

import { getCurrentSystem } from "@/utils/system";

const SelectSystem: React.FC = () => {
  const systems = useMetaIntegratedSystemsList();
  const router = useRouter();

  const hndSystemChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(ev.target.value);

    router.push(`/?system=${ev.target.value}`);
  }

  return systems.isFetched && systems.data ? <>
    <label htmlFor="system">Select a system:</label>
    <select name="system" id="system" onChange={hndSystemChange}>
      <option value="">Select a system</option>
      {systems.data.results.map((system) => (
        <option key={system.id} value={system.slug || ""}>
          {system.name}
        </option>
      ))}
    </select>
  </> : <>Loading systems...</>
}

const Home = () => {
  const searchParams = useSearchParams();
  const specifiedSystem = getCurrentSystem(searchParams);

  return specifiedSystem === "" ? <>
    <p>You ain't got no system.</p>

    <h1>Home</h1>

    <SelectSystem />
  </> : <div>
      <h1>Home</h1>

      <p>I suppose we should show you a cart.</p>
    </div>;
};

export default Home;
