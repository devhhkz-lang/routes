import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useItem } from "../hooks/useItems";
import { useOnline } from "../hooks/useOnline";
import Status from "../components/Status";
import CachedBanner from "../components/CachedBanner";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const online = useOnline();
  const { data: item, error, loading, fromCache } = useItem(id);

  // Нет сети, а этот товар раньше не открывали (в кэше его нет): страница /offline
  if (error && !item && !online) {
    return <Navigate to="/offline" replace state={{ from: location.pathname }} />;
  }

  return (
    <>
      <p className="links">
        <button onClick={() => navigate(-1)}>← Назад</button>
        <Link to="/items">Все товары</Link>
      </p>

      <CachedBanner show={fromCache} />

      <Status loading={loading} error={error} />

      {item && (
        <div className="details">
          <img src={item.thumbnail} alt={item.title} />
          <div>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            <ul>
              <li>Категория: {item.category}</li>
              <li>Бренд: {item.brand || "—"}</li>
              <li>Цена: ${item.price}</li>
              <li>Скидка: {item.discountPercentage}%</li>
              <li>Рейтинг: {item.rating}</li>
              <li>На складе: {item.stock} ({item.availabilityStatus})</li>
              <li>Гарантия: {item.warrantyInformation}</li>
              <li>Доставка: {item.shippingInformation}</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}