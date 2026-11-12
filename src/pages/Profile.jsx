import { useAuth } from "../hooks/useAuth";
import useAuthAction from "../hooks/useAuthAction";
export default function Profile() {
  const { user, logout } = useAuth();
  const { pending, error, execute } = useAuthAction();
  return <section className="profile">
    <h1>Профиль</h1>
    <dl><dt>Email</dt><dd>{user.email || "Email не указан"}</dd><dt>UID</dt><dd>{user.uid}</dd></dl>
    {error && <p role="alert" className="error">{error}</p>}
    <button disabled={pending} onClick={() => execute(logout)}>{pending ? "Выходим..." : "Выйти"}</button>
  </section>;
}
