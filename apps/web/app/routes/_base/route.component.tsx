import { Outlet } from "react-router";

import { Footer } from "./footer";
import { Header } from "./header";

export function Component() {
  return (
    <div>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
