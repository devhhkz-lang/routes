import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useAuthAction from "../hooks/useAuthAction";
export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const { pending, error, execute } = useAuthAction();
  return <><nav className="navbar" aria-label="Главная навигация">
    <NavLink to="/" end>Home</NavLink>
    <NavLink to="/items">Products</NavLink>
    <NavLink to="/dashboard">Dashboard</NavLink>
    <NavLink to="/about">About</NavLink>
    {loading ? <span role="status">Проверяем сессию...</span> : user ? <>
      <NavLink to="/profile">Profile</NavLink>
      <button disabled={pending} onClick={() => execute(logout)}>{pending ? "Выходим..." : "Logout"}</button>
    </> : <><NavLink to="/login">Login</NavLink><NavLink to="/signup">Signup</NavLink></>}
  </nav>{error && <p role="alert" className="container error">{error}</p>}</>;
}
