import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function RootLayout() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Suspense fallback={<p className="msg">Загрузка страницы...</p>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
