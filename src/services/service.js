const API = "https://dummyjson.com/products";
async function request(path = "", options = {}) {
  const response = await fetch(`${API}${path}`, options);
  if (!response.ok) throw new Error(response.status === 404 ? "Товар не найден" : "Ошибка загрузки данных");
  return response.json();
}
export const getItems = (signal) => request("?limit=0", { signal }).then((data) => data.products);
export const getItem = (id, signal) => request(`/${encodeURIComponent(id)}`, { signal });
const json = (method, data) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const createItem = (data) => request("/add", json("POST", data));
export const updateItem = (id, data) => request(`/${encodeURIComponent(id)}`, json("PUT", data));
export const deleteItem = (id) => request(`/${encodeURIComponent(id)}`, { method: "DELETE" });
