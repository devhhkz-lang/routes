import { useOnline } from "../hooks/useOnline";

export default function OfflineBanner() {
  const online = useOnline();
  if (online) return null;

  return (
    <div className="offline-banner" role="status">
      Вы offline. Показаны сохранённые данные, если они есть.
    </div>
  );
}