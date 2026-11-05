export default function Login() {
  return (
    <form className="login" onSubmit={(e) => e.preventDefault()}>
      <h1>Вход</h1>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Пароль" />
      <button>Войти</button>
      <small>Авторизация будет добавлена позже.</small>
    </form>
  );
}
