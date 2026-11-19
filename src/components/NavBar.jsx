import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useAuthAction from "../hooks/useAuthAction";
import { useOnline } from "../hooks/useOnline";

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const { pending, error, execute } = useAuthAction();
  const online = useOnline();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // закрытие меню по Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="site-header">
        <NavLink to="/" className="brand" onClick={close}>MyApp</NavLink>

        <span className={`net-badge ${online ? "is-online" : "is-offline"}`} role="status">
          ● {online ? "Online" : "Offline"}
        </span>

        <button
          type="button"
          className="burger"
          aria-label="Меню"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav
          id="main-nav"
          className={`nav-links ${open ? "open" : ""}`}
          aria-label="Главная навигация"
          onClick={close}
        >
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/items">Products</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/about">About</NavLink>

          {loading ? (
            <span role="status" className="nav-status">Проверяем сессию...</span>
          ) : user ? (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <button disabled={pending} onClick={() => execute(logout)}>
                {pending ? "Выходим..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </nav>
      </header>

      {error && <p role="alert" className="container error">{error}</p>}
    </>
  );
}