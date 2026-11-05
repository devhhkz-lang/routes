import { Link } from "react-router-dom";

export default function Card({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="card">
      <img src={item.thumbnail} alt={item.title} />
      <h3>{item.title}</h3>
      <p>{item.category}</p>
      <b>${item.price}</b>
    </Link>
  );
}
