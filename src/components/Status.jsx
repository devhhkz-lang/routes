// Показывает загрузку или ошибку
export default function Status({ loading, error }) {
  if (loading) return <p className="msg">Загрузка...</p>;
  if (error) return <p className="msg error">{error}</p>;
  return null;
}
