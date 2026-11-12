import { useState } from "react";
import { authErrorMessage } from "../services/auth";
export default function useAuthAction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function execute(action) {
    setPending(true); setError("");
    try { await action(); return true; }
    catch (err) { setError(authErrorMessage(err)); return false; }
    finally { setPending(false); }
  }
  return { pending, error, execute, setError };
}
