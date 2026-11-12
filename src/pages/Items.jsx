import { useSearchParams } from "react-router-dom";
import { useItems } from "../hooks/useItems";
import Card from "../components/Card";
import Status from "../components/Status";

const PER_PAGE = 12;

function Select({ value, onChange, options, label }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{label}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

export default function Items() {
  const [params, setParams] = useSearchParams();
  const { data, error, loading } = useItems();

  // Значения берём из URL
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const stock = params.get("stock") || "";
  const sort = params.get("sort") || "";
  const requestedPage = Number(params.get("page"));

  // Меняем один параметр в URL (при смене фильтра возвращаемся на 1 страницу)
  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  const all = data || [];

  // Поиск + фильтры
  const items = all.filter(
    (i) =>
      i.title.toLowerCase().includes(q.toLowerCase()) &&
      (!category || i.category === category) &&
      (!stock || i.availabilityStatus === stock)
  );

  // Сортировка, например "price-asc"
  if (sort) {
    const [key, dir] = sort.split("-");
    items.sort((a, b) => (dir === "asc" ? a[key] - b[key] : b[key] - a[key]));
  }

  // Пагинация
  const pages = Math.ceil(items.length / PER_PAGE);
  const page = Number.isInteger(requestedPage) ? Math.max(1, Math.min(requestedPage, pages || 1)) : 1;
  const visible = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <h1>Товары</h1>

      <div className="filters">
        <input placeholder="Поиск..." value={q} onChange={(e) => update("q", e.target.value)} />
        <Select label="Все категории" value={category} onChange={(v) => update("category", v)}
          options={[...new Set(all.map((i) => i.category))]} />
        <Select label="Любое наличие" value={stock} onChange={(v) => update("stock", v)}
          options={[...new Set(all.map((i) => i.availabilityStatus))]} />
        <select value={sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="">Без сортировки</option>
          <option value="price-asc">Цена ↑</option>
          <option value="price-desc">Цена ↓</option>
          <option value="rating-desc">Рейтинг ↓</option>
        </select>
      </div>

      <Status loading={loading} error={error} />
      {!loading && !error && items.length === 0 && <p className="msg">Ничего не найдено</p>}

      <div className="grid">
        {visible.map((item) => <Card key={item.id} item={item} />)}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => update("page", page - 1)}>Назад</button>
          <span>{page} / {pages}</span>
          <button disabled={page >= pages} onClick={() => update("page", page + 1)}>Вперёд</button>
        </div>
      )}
    </>
  );
}
