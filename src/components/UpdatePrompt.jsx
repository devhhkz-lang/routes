// components/UpdatePrompt.jsx
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()
  if (!needRefresh) return null
  return (
    <div className="update-toast" role="alert">
      Доступна новая версия
      <button onClick={() => updateServiceWorker(true)}>Обновить</button>
    </div>
  )
}