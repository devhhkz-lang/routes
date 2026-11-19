export default function CachedBanner({ show }) {
  if (!show) return null;
  return (
    <div className="cached-banner" role="status">
      📦 Вы просматриваете сохранённые данные. Они могут быть устаревшими.
    </div>
  );
}