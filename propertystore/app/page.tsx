"use client";

import { useEffect } from "react";
import { ConsultationForm } from "./components/ConsultationForm"; // Исправлен путь
import { getAllClients } from "./services/clients"; // Исправлен путь

export default function Home() {
  useEffect(() => {
    // Тестовый запрос к API
    getAllClients()
      .then(clients => console.log("Clients:", clients))
      .catch(error => console.error("API Error:", error));
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Property Store</h1>
      <p>Мы поможем вам найти идеальную недвижимость</p>
      <ConsultationForm />
    </div>
  );
}