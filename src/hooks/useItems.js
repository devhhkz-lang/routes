import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, getItem, createItem, updateItem, deleteItem } from "../services/service";
export const itemKeys = { all: ["products"], list: ["products", "list"], detail: (id) => ["products", "detail", String(id)] };
function result(query) { return { data: query.data, error: query.error?.message || "", loading: query.isPending, refreshing: query.isFetching, refetch: query.refetch }; }
export function useItems() {
  return result(useQuery({ queryKey: itemKeys.list, queryFn: ({ signal }) => getItems(signal) }));
}
export function useItem(id) {
  return result(useQuery({ queryKey: itemKeys.detail(id), queryFn: ({ signal }) => getItem(id, signal) }));
}
// Любая операция изменения проходит здесь и инвалидирует общий кеш товаров.
export function useItemMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id, data }) => {
      if (type === "create") return createItem(data);
      if (type === "update") return updateItem(id, data);
      if (type === "delete") return deleteItem(id);
      throw new Error("Неизвестная операция");
    },
    onSuccess: () => client.invalidateQueries({ queryKey: itemKeys.all }),
  });
}
