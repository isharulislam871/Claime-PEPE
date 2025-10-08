'use client';

import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Card
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Option } = Select;
const { confirm } = Modal;

interface AdminUser {
  key: string;
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  createdDate: string;
}

interface AdminUsersTableProps {
  onUserAdd?: (user: any) => void;
  onUserEdit?: (user: any) => void;
  onUserDelete?: (userId: string) => void;
}

export default function AdminUsersTable({ 
  onUserAdd, 
  onUserEdit, 
  onUserDelete 
}: AdminUsersTableProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch admin users from API
  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/listofadmin');
      const result = await response.json();
      
      if (result.success) {
        setAdminUsers(result.data);
      } else {
        message.error('Failed to fetch admin users');
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      message.error('Failed to fetch admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const handleAddAdmin = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditAdmin = (user: AdminUser) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDeleteAdmin = (user: AdminUser) => {
    if (user.role === 'super_admin') {
      message.warning('Cannot delete super admin user');
      return;
    }

    confirm({
      title: 'Delete Admin User',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete admin user "${user.username}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          const response = await fetch(`/api/admin/listofadmin/${user.id}`, {
            method: 'DELETE',
          });
          
          const result = await response.json();
          
          if (result.success) {
            message.success('Admin user deleted successfully');
            onUserDelete?.(user.id);
            fetchAdminUsers(); // Refresh the list
          } else {
            message.error(result.message || 'Failed to delete admin user');
          }
        } catch (error) {
          console.error('Error deleting admin user:', error);
          message.error('An error occurred while deleting the user');
        }
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // Update existing user via API
        const response = await fetch(`/api/admin/listofadmin/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        const result = await response.json();
        
        if (result.success) {
          message.success('Admin user updated successfully');
          onUserEdit?.(values);
          fetchAdminUsers(); // Refresh the list
        } else {
          message.error(result.message || 'Failed to update admin user');
        }
      } else {
        // Add new user via API
        const response = await fetch('/api/admin/listofadmin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        const result = await response.json();
        
        if (result.success) {
          message.success('Admin user added successfully');
          onUserAdd?.(result.data);
          fetchAdminUsers(); // Refresh the list
        } else {
          message.error(result.message || 'Failed to add admin user');
        }
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
      message.error('An error occurred while saving the user');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colors = {
          super_admin: 'red',
          admin: 'orange',
          moderator: 'blue',
          support: 'green'
        };
        return (
          <Tag color={colors[role as keyof typeof colors]}>
            {role.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Created',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: AdminUser) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            className="text-blue-500 hover:bg-blue-50"
            title="Edit Admin"
            onClick={() => handleEditAdmin(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500 hover:bg-red-50"
            title="Delete Admin"
            disabled={record.role === 'super_admin'}
            onClick={() => handleDeleteAdmin(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Admin Users</h3>
          <p className="text-sm text-gray-600">Manage administrator accounts and permissions</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddAdmin}
        >
          Add Admin
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={adminUsers}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={editingUser ? 'Edit Admin User' : 'Add New Admin'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
        okText={editingUser ? 'Update' : 'Add'}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            role: 'moderator',
            status: 'active'
          }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username!' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email!' },
              { type: 'email', message: 'Please enter valid email!' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: !editingUser, message: 'Please enter password!' }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select placeholder="Select role">
              <Option value="moderator">Moderator</Option>
              <Option value="support">Support</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="banned">Banned</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
