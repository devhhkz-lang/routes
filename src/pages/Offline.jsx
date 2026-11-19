import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

async function checkConnection() {
  try {
    // manifest не лежит в precache, значит запрос реально идёт в сеть
    const res = await fetch(`/manifest.webmanifest?t=${Date.now()}`, {
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function Offline() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(false);
  const [msg, setMsg] = useState("");

  const target = location.state?.from || "/";

  const retry = useCallback(async () => {
    setChecking(true);
    setMsg("");
    const ok = await checkConnection();
    setChecking(false);
    if (ok) navigate(target, { replace: true });
    else setMsg("Соединения всё ещё нет. Попробуйте позже.");
  }, [navigate, target]);

  // Если браузер сообщил, что сеть вернулась, проверяем сразу
  useEffect(() => {
    const onOnline = () => retry();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [retry]);

  return (
    <section className="offline-page">
      <div className="offline-icon" aria-hidden="true">📡</div>
      <h1>Вы не в сети</h1>
      <p>
        Не удаётся подключиться к интернету. Ранее открытые страницы и
        сохранённые данные по-прежнему доступны.
      </p>

      <div className="offline-actions">
        <button onClick={retry} disabled={checking}>
          {checking ? "Проверяем..." : "Retry Connection"}
        </button>
        <button className="secondary" onClick={() => navigate("/")}>
          На главную
        </button>
      </div>

      {msg && <p className="offline-msg" role="status">{msg}</p>}
    </section>
  );
}