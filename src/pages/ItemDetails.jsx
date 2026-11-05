import { Link, useNavigate, useParams } from "react-router-dom";
import { getItem } from "../services/service";
import useFetch from "../hooks/useFetch";
import Status from "../components/Status";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, error, loading } = useFetch(() => getItem(id), [id]);

  return (
    <>
      <p className="links">
        <button onClick={() => navigate(-1)}>← Назад</button>
        <Link to="/items">Все товары</Link>
      </p>

      <Status loading={loading} error={error} />

      {item && !error && (
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
