const API = "https://dummyjson.com/products";

// Запрос, который возвращает и данные, и признак «ответ из кэша SW»
async function requestWithMeta(path = "", options = {}) {
  let response;
  try {
    response = await fetch(`${API}${path}`, options);
  } catch (e) {
    if (e.name === "AbortError") throw e; // отмена React Query, не ошибка сети
    throw new Error("Нет соединения с сервером");
  }
  if (!response.ok) {
    throw new Error(response.status === 404 ? "Товар не найден" : "Ошибка загрузки данных");
  }
  return {
    data: await response.json(),
    fromCache: response.headers.get("X-From-Cache") === "true",
  };
}

// Для мутаций метаданные не нужны
const request = (path, options) => requestWithMeta(path, options).then((r) => r.data);

// Публичные GET: возвращают { data, fromCache }
export const getItems = (signal) =>
  requestWithMeta("?limit=0", { signal }).then(({ data, fromCache }) => ({
    data: data.products,
    fromCache,
  }));

export const getItem = (id, signal) =>
  requestWithMeta(`/${encodeURIComponent(id)}`, { signal });

// Мутации без изменений
const json = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
export const createItem = (data) => request("/add", json("POST", data));
export const updateItem = (id, data) => request(`/${encodeURIComponent(id)}`, json("PUT", data));
export const deleteItem = (id) => request(`/${encodeURIComponent(id)}`, { method: "DELETE" });