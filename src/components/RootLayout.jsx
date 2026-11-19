import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import UpdatePrompt from "./UpdatePrompt";
import OfflineBanner from "./OfflineBanner";

export default function RootLayout() {
  return (
    <>
      <NavBar />
      <OfflineBanner />
      <main className="container">
        <Suspense fallback={<p className="msg">Загрузка страницы...</p>}>
          <Outlet />
        </Suspense>
      </main>
      <UpdatePrompt />
    </>
  );
}