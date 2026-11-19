import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useItems } from "../hooks/useItems";
import { useOnline } from "../hooks/useOnline";
import Status from "../components/Status";
import CachedBanner from "../components/CachedBanner";

// Считает, сколько товаров в каждой группе
function countBy(items, key) {
  const result = {};
  items.forEach((i) => (result[i[key]] = (result[i[key]] || 0) + 1));
  return result;
}

// Блок разбивки: каждая строка — ссылка на каталог с фильтром
function Breakdown({ title, counts, param }) {
  return (
    <section className="breakdown">
      <h3>{title}</h3>
      {Object.entries(counts).map(([name, n]) => (
        <p key={name}>
          <Link to={`/items?${param}=${encodeURIComponent(name)}`}>{name}</Link>: {n}
        </p>
      ))}
    </section>
  );
}

export default function Dashboard() {
  const [minRating, setMinRating] = useState(0); // интерактивный фильтр
  const { data, error, loading, fromCache } = useItems();
  const online = useOnline();
  const location = useLocation();

  // Нет сети, данных нет вообще (ни свежих, ни из кэша): страница /offline
  if (error && !data && !online) {
    return <Navigate to="/offline" replace state={{ from: location.pathname }} />;
  }

  const items = (data || []).filter((i) => i.rating >= minRating);
  const total = items.length;
  const avg = (key) => (total ? (items.reduce((s, i) => s + i[key], 0) / total).toFixed(2) : 0);
  const best = [...items].sort((a, b) => b.rating - a.rating)[0];

  return (
    <>
      <h1>Dashboard</h1>
      <CachedBanner show={fromCache} />

      <select
        className="dash-filter"
        value={minRating}
        onChange={(e) => setMinRating(Number(e.target.value))}
      >
        <option value={0}>Любой рейтинг</option>
        <option value={3}>Рейтинг 3+</option>
        <option value={4}>Рейтинг 4+</option>
        <option value={4.5}>Рейтинг 4.5+</option>
      </select>

      <Status loading={loading} error={error} />

      {data && (
        <>
          <div className="stats">
            <div>Товаров: <b>{total}</b></div>
            <div>Средняя цена: <b>${avg("price")}</b></div>
            <div>Средний рейтинг: <b>{avg("rating")}</b></div>
            <div>Всего на складе: <b>{items.reduce((s, i) => s + i.stock, 0)}</b></div>
          </div>

          <div className="breakdowns">
            <Breakdown title="По категориям" counts={countBy(items, "category")} param="category" />
            <Breakdown title="По наличию" counts={countBy(items, "availabilityStatus")} param="stock" />
          </div>

          {best && (
            <p>Лучший товар: <Link to={`/items/${best.id}`}>{best.title}</Link> ({best.rating})</p>
          )}
          <Link to="/items">Все товары</Link>
        </>
      )}
    </>
  );
}