import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Items from "./pages/Items";

// Ленивая загрузка (4 страницы)
const About = lazy(() => import("./pages/About"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="items">
          <Route index element={<Items />} />
          <Route path=":id" element={<ItemDetails />} />
        </Route>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}><Route path="profile" element={<Profile />} /></Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
