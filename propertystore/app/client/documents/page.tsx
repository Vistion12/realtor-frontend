'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Upload, 
  message, 
  Tag, 
  Space, 
  Spin, 
  Empty,
  Modal,
  Select,
  Divider
} from 'antd';
import { 
  UploadOutlined, 
  DownloadOutlined, 
  DeleteOutlined,
  FileOutlined,
  FolderOpenOutlined 
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { clientDocumentsService, ClientDocument } from '../../services/clientDocuments';
import { useSearchParams } from 'next/navigation';

const { Dragger } = Upload;
const { Option } = Select;

export default function ClientDocumentsPage() {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const searchParams = useSearchParams();
  const dealId = searchParams.get('dealId');

  useEffect(() => {
    loadDocuments();
  }, [dealId]);

  const loadDocuments = async () => {
    try {
      const docs = await clientDocumentsService.getDocuments(dealId || undefined);
      setDocuments(docs);
    } catch (error) {
      message.error('Ошибка загрузки документов');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: ClientDocument) => { // Переименовали document в doc
    try {
      const blob = await clientDocumentsService.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); // Теперь это глобальный document
      a.style.display = 'none';
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a); // Глобальный document
      a.click();
      window.URL.revokeObjectURL(url);
      message.success('Документ скачан');
    } catch (error) {
      message.error('Ошибка скачивания документа');
    }
  };

  const handleDelete = async (documentId: string) => {
    Modal.confirm({
      title: 'Удалить документ?',
      content: 'Вы уверены, что хотите удалить этот документ?',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okType: 'danger',
      onOk: async () => {
        try {
          await clientDocumentsService.deleteDocument(documentId);
          message.success('Документ удален');
          loadDocuments();
        } catch (error) {
          message.error('Ошибка удаления документа');
        }
      },
    });
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;
      
      setUploading(true);
      try {
        const result = await clientDocumentsService.uploadDocument(
          file as File, 
          selectedCategory, 
          dealId || undefined
        );
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        message.success('Документ успешно загружен');
        setUploadModalVisible(false);
        loadDocuments();
      } catch (error) {
        if (onError) {
          onError(new Error('Ошибка загрузки'));
        }
        message.error('Ошибка загрузки документа');
      } finally {
        setUploading(false);
      }
    },
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'Все документы' },
    { value: 'contract', label: 'Договоры' },
    { value: 'passport', label: 'Паспортные данные' },
    { value: 'template', label: 'Шаблоны' },
    { value: 'other', label: 'Прочие' },
  ];

  const columns = [
    {
      title: 'Название файла',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (fileName: string, record: ClientDocument) => (
        <Space>
          <FileOutlined />
          <span>{fileName}</span>
        </Space>
      ),
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const categoryLabels: { [key: string]: string } = {
          'contract': 'Договор',
          'passport': 'Паспорт',
          'template': 'Шаблон',
          'other': 'Прочее'
        };
        
        const colorMap: { [key: string]: string } = {
          'contract': 'blue',
          'passport': 'red',
          'template': 'green',
          'other': 'default'
        };
        
        return (
          <Tag color={colorMap[category]}>
            {categoryLabels[category] || category}
          </Tag>
        );
      },
    },
    {
      title: 'Загрузил',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
      render: (uploadedBy: string) => (
        <Tag color={uploadedBy === 'client' ? 'green' : 'blue'}>
          {uploadedBy === 'client' ? 'Вы' : 'Риелтор'}
        </Tag>
      ),
    },
    {
      title: 'Размер',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => {
        const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return `${(size / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
      },
    },
    {
      title: 'Дата загрузки',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: ClientDocument) => (
        <Space>
          <Button 
            icon={<DownloadOutlined />} 
            size="small"
            onClick={() => handleDownload(record)}
          >
            Скачать
          </Button>
          {record.uploadedBy === 'client' && (
            <Button 
              icon={<DeleteOutlined />} 
              size="small"
              danger
              onClick={() => handleDelete(record.id)}
            >
              Удалить
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Документы</h1>
          <p style={{ color: '#666', margin: 0 }}>
            {dealId ? 'Документы по выбранной сделке' : 'Все ваши документы'}
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<UploadOutlined />}
          onClick={() => setUploadModalVisible(true)}
        >
          Загрузить документ
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 200 }}
          >
            {categories.map(cat => (
              <Option key={cat.value} value={cat.value}>
                {cat.label}
              </Option>
            ))}
          </Select>
        </div>

        {filteredDocuments.length > 0 ? (
          <Table 
            dataSource={filteredDocuments} 
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty 
            description="Документы не найдены" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      {/* Модальное окно загрузки */}
      <Modal
        title="Загрузка документа"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <FolderOpenOutlined />
          </p>
          <p className="ant-upload-text">
            Нажмите или перетащите файл для загрузки
          </p>
          <p className="ant-upload-hint">
            Поддерживаются файлы любых форматов
          </p>
        </Dragger>
        
        <Divider />
        
        <div style={{ marginBottom: 16 }}>
          <label>Категория документа:</label>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: '100%', marginTop: 8 }}
          >
            <Option value="contract">Договор</Option>
            <Option value="passport">Паспортные данные</Option>
            <Option value="template">Шаблон</Option>
            <Option value="other">Прочее</Option>
          </Select>
        </div>
        
        <Button 
          type="primary" 
          icon={<UploadOutlined />}
          loading={uploading}
          style={{ width: '100%' }}
          onClick={() => {
            const uploadElement = document.querySelector('.ant-upload input[type="file"]') as HTMLInputElement;
            if (uploadElement && uploadElement.files && uploadElement.files[0]) {
              uploadProps.customRequest!({
                file: uploadElement.files[0],
                onSuccess: () => {},
                onError: () => {}
              } as any);
            } else {
              message.warning('Пожалуйста, выберите файл для загрузки');
            }
          }}
        >
          {uploading ? 'Загрузка...' : 'Начать загрузку'}
        </Button>
      </Modal>
    </div>
  );
}