import { Outlet } from "react-router";
import Navbar from "../components/miscellaneous/navbar.tsx";

export default function Layout() {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
}
