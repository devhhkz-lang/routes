import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useAuthAction from "../hooks/useAuthAction";
import { configurationError } from "../services/auth";

export default function AuthForm({ signup = false }) {
  const auth = useAuth();
  const { pending, error, execute, setError } = useAuthAction();
  const location = useLocation();
  const from = location.state?.from;
  const destination = typeof from === "string" && from.startsWith("/") && !from.startsWith("//") && !/^\/(login|signup)([/?#]|$)/.test(from) ? from : "/profile";
  if (auth.loading) return <p role="status">Проверяем сессию...</p>;
  if (auth.user) return <Navigate to={destination} replace />;
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email").trim();
    const password = data.get("password");
    if (signup && password !== data.get("confirm")) { setError("Пароли не совпадают."); return; }
    execute(() => signup ? auth.signup(email, password) : auth.login(email, password));
  }
  const disabled = pending || !auth.configured || Boolean(auth.error);
  return <form className="login" onSubmit={submit}>
    <h1>{signup ? "Регистрация" : "Вход"}</h1>
    {!auth.configured && <p role="alert" className="error">{configurationError}</p>}
    {(error || auth.error) && <p role="alert" className="error">{error || auth.error}</p>}
    <label>Email<input name="email" type="email" autoComplete="email" required disabled={pending} /></label>
    <label>Пароль<input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={signup ? 6 : undefined} required disabled={pending} /></label>
    {signup && <label>Повторите пароль<input name="confirm" type="password" autoComplete="new-password" minLength={6} required disabled={pending} /></label>}
    <button disabled={disabled}>{pending ? "Подождите..." : signup ? "Зарегистрироваться" : "Войти"}</button>
    <button type="button" className="secondary" disabled={disabled} onClick={() => execute(auth.loginWithGoogle)}>Войти через Google</button>
    <Link to={signup ? "/login" : "/signup"} state={location.state}>{signup ? "Уже есть аккаунт? Войти" : "Создать аккаунт"}</Link>
  </form>;
}
