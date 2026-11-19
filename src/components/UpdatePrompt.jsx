import { useRegisterSW } from "virtual:pwa-register/react";

const CHECK_EVERY = 60 * 1000;

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;

      const check = async () => {
        if (registration.installing || !navigator.onLine) return;
        try {
          // убеждаемся, что sw.js реально доступен, и просим браузер его перепроверить
          const res = await fetch(swUrl, {
            cache: "no-store",
            headers: { "cache-control": "no-cache" },
          });
          if (res.ok) await registration.update();
        } catch {
          /* сети нет, просто пропускаем проверку */
        }
      };

      setInterval(check, CHECK_EVERY);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") check();
      });
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="update-toast" role="alert">
      <span>Доступна новая версия</span>
      <div>
        <button onClick={() => updateServiceWorker(true)}>Обновить</button>
        <button className="secondary" onClick={() => setNeedRefresh(false)}>
          Позже
        </button>
      </div>
    </div>
  );
}