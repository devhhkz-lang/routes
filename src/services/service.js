// Все запросы к API находятся здесь
const API = "https://dummyjson.com/products";

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Товар не найден" : "Ошибка загрузки данных");
  }
  return res.json();
}

// limit=0 возвращает все товары
export const getItems = () => get(`${API}?limit=0`).then((data) => data.products);

export const getItem = (id) => get(`${API}/${id}`);
