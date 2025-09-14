"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, message, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Client, getAllClients, deleteClient } from "../services/clients";
import { ClientForm } from "../components/ClientForm";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const loadClients = async () => {
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (error) {
      message.error("Ошибка загрузки клиентов");
    } finally {
      setLoading(false);
    }
  };

  const showNotes = (notes: string) => {
    setSelectedNotes(notes);
    setIsNotesModalOpen(true);
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

  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Источник",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Заметки",
      dataIndex: "notes",
      key: "notes",
      render: (notes: string) => notes ? (
        <Button 
          type="link" 
          onClick={() => showNotes(notes)}
          style={{ padding: 0, height: 'auto' }}
        >
          <div style={{ 
            maxWidth: 200, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {notes}
          </div>
        </Button>
      ) : '-',
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: Client) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              setEditingClient(record);
              setIsModalOpen(true);
            }}
          >
            Редактировать
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDelete(record.id)}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

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

      <Table 
        dataSource={clients} 
        columns={columns} 
        loading={loading}
        rowKey="id"
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

      <Modal
        title="Заметки о клиенте"
        open={isNotesModalOpen}
        onCancel={() => setIsNotesModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsNotesModalOpen(false)}>
            Закрыть
          </Button>
        ]}
      >
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '6px',
          minHeight: '100px',
          whiteSpace: 'pre-wrap'
        }}>
          {selectedNotes || 'Заметок нет'}
        </div>
      </Modal>
    </div>
  );
}