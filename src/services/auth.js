import {
  browserLocalPersistence, setPersistence, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signOut,
} from "firebase/auth";
import { auth } from "../firebase";

export const configurationError = "Добавьте настройки Firebase в .env.local и перезапустите приложение.";
const ready = auth ? setPersistence(auth, browserLocalPersistence) : Promise.resolve();
// Ошибка также будет передана подписчику и операциям авторизации.
ready.catch(() => {});
export function observeAuth(onChange, onError) {
  let unsubscribe;
  let cancelled = false;
  if (!auth) { onChange(null); return () => {}; }
  ready.then(() => {
    if (!cancelled) unsubscribe = onAuthStateChanged(auth, onChange, onError);
  }).catch((error) => { if (!cancelled) onError(error); });
  return () => { cancelled = true; unsubscribe?.(); };
}
async function run(action) {
  if (!auth) throw new Error(configurationError);
  await ready;
  return action();
}
export const signup = (email, password) => run(() => createUserWithEmailAndPassword(auth, email, password));
export const login = (email, password) => run(() => signInWithEmailAndPassword(auth, email, password));
export const loginWithGoogle = () => run(() => signInWithPopup(auth, new GoogleAuthProvider()));
export const logout = () => run(() => signOut(auth));
export function authErrorMessage(error) {
  const messages = {
    "auth/invalid-credential": "Неверный email или пароль.",
    "auth/email-already-in-use": "Этот email уже зарегистрирован.",
    "auth/weak-password": "Пароль должен содержать минимум 6 символов.",
    "auth/invalid-email": "Введите корректный email.",
    "auth/popup-closed-by-user": "Окно входа закрыто. Попробуйте снова.",
    "auth/popup-blocked": "Разрешите всплывающие окна для входа через Google.",
    "auth/account-exists-with-different-credential": "Войдите способом, использованным при регистрации.",
    "auth/unauthorized-domain": "Добавьте домен приложения в Authorized domains в Firebase.",
    "auth/operation-not-allowed": "Включите этот способ входа в Firebase Authentication.",
    "auth/network-request-failed": "Нет соединения. Проверьте интернет.",
    "auth/too-many-requests": "Слишком много попыток. Попробуйте позже.",
  };
  return messages[error.code] || (error.code ? "Не удалось выполнить авторизацию. Попробуйте снова." : error.message);
}
