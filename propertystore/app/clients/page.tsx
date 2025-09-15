"use client";

import { useEffect, useState } from "react";
import { Button, Modal, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Client, getAllClients, deleteClient } from "../services/clients";
import { ClientForm } from "../components/ClientForm";
import { ClientsCard } from "../components/ClientsCard";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients();
      setClients(data);
    } catch (error) {
      message.error("Ошибка загрузки клиентов");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await deleteClient(id);
      message.success("Клиент удален");
      loadClients();
    } catch (error) {
      message.error("Ошибка удаления клиента");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Spin size="large" />
        <div>Загрузка клиентов...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h1>Управление клиентами</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
        >
          Добавить клиента
        </Button>
      </div>

      <ClientsCard 
        clients={clients}
        onEdit={(client) => {
          setEditingClient(client);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        title={editingClient ? "Редактировать клиента" : "Добавить клиента"}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <ClientForm 
          client={editingClient || undefined}
          onSuccess={() => {
            handleModalClose();
            loadClients();
            message.success(editingClient ? "Клиент обновлен" : "Клиент добавлен");
          }}
          onCancel={handleModalClose}
        />
      </Modal>

      
    </div>
  );
}