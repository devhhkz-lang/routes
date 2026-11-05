import { useEffect, useState } from "react";

// Загружает данные и защищает от "устаревших" ответов (ignore)
export default function useFetch(request, deps) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    request()
      .then((result) => !ignore && setData(result))
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true; // если id изменился, старый ответ игнорируется
    };
  }, deps);

  return { data, error, loading };
}
