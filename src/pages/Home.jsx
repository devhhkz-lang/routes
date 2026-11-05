import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>Магазин товаров</h1>
      <p>Каталог товаров с поиском, фильтрами и статистикой.</p>
      <img className="hero" src="https://picsum.photos/id/1060/1000/350" alt="Главное фото" />
      <p className="links">
        <Link to="/items">Каталог</Link>
        <Link to="/dashboard">Статистика</Link>
        <Link to="/about">О проекте</Link>
      </p>
    </>
  );
}
