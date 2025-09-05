'use client';

import { Card, Table, Button, Tag, Space, Input, Select, Modal, Form, InputNumber, Switch, DatePicker, message } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FileTextOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Task {
  _id: string;
  id: string;
  title: string;
  description: string;
  reward: number;
  type: string;
  category: string;
  url?: string;
  duration?: string;
  maxCompletions: number;
  currentCompletions: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  summary: {
    totalTasks: number;
    activeTasks: number;
    pausedTasks: number;
    completedTasks: number;
    totalRewards: number;
    totalCompletions: number;
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 100, total: 0, pages: 0 });
  
  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<any>(null);
  
  // Modals
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(searchText && { search: searchText }),
        ...(dateRange && dateRange[0] && { dateFrom: dateRange[0].format('YYYY-MM-DD') }),
        ...(dateRange && dateRange[1] && { dateTo: dateRange[1].format('YYYY-MM-DD') })
      });

      const response = await fetch(`/api/admin/tasks?${params}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      
      const data: TasksResponse = await response.json();
      setTasks(data.tasks);
      setPagination(data.pagination);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [pagination.page, pagination.limit, statusFilter, typeFilter, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== '' || dateRange) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchTasks();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText, dateRange]);


  const taskColumns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          <div className="text-sm text-gray-500 mt-1">{record.description}</div>
          <div className="flex gap-2 mt-2">
            <Tag color="blue">{record.type}</Tag>
            <Tag color="green">{record.category}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Task ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{text}</span>
      ),
    },
    {
      title: 'Reward',
      dataIndex: 'reward',
      key: 'reward',
      render: (reward: number) => (
        <span className="font-semibold text-green-600">{reward} PEPE</span>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: any, record: Task) => {
        const percentage = (record.currentCompletions / record.maxCompletions) * 100;
        return (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{record.currentCompletions}</span>
              <span>{record.maxCompletions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% complete</div>
          </div>
        );
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'paused' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Task) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            className="text-green-500 hover:bg-green-50"
            title="Edit Task"
            onClick={() => handleEditTask(record)}
          />
          <Button
            type="text"
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            className="text-yellow-500 hover:bg-yellow-50"
            title={record.status === 'active' ? 'Pause Task' : 'Activate Task'}
            onClick={() => handleToggleTaskStatus(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500 hover:bg-red-50"
            title="Delete Task"
            onClick={() => handleDeleteTask(record)}
          />
        </Space>
      ),
    },
  ];


  // Task actions
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    editForm.setFieldsValue({
      title: task.title,
      description: task.description,
      reward: task.reward,
      type: task.type,
      category: task.category,
      url: task.url,
      duration: task.duration,
      maxCompletions: task.maxCompletions,
      status: task.status
    });
    setIsEditModalVisible(true);
  };

  const handleToggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status === 'active' ? 'paused' : 'active';
      const response = await fetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      message.success(`Task ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
      fetchTasks();
    } catch (error) {
      message.error('Failed to update task status');
    }
  };

  const handleDeleteTask = (task: Task) => {
    Modal.confirm({
      title: 'Delete Task',
      content: `Are you sure you want to delete "${task.title}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await fetch(`/api/admin/tasks?taskId=${task.id}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) throw new Error('Failed to delete task');
          
          message.success('Task deleted successfully');
          fetchTasks();
        } catch (error) {
          message.error('Failed to delete task');
        }
      }
    });
  };


  const handleCreateTask = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalOk = async () => {
    try {
      const values = await createForm.validateFields();
      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          status: values.active ? 'active' : 'draft'
        })
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      
      message.success('Task created successfully');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      fetchTasks();
    } catch (error) {
      message.error('Failed to create task');
    }
  };

  const handleEditModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      const response = await fetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: editingTask?.id,
          ...values
        })
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      message.success('Task updated successfully');
      setIsEditModalVisible(false);
      setEditingTask(null);
      editForm.resetFields();
      fetchTasks();
    } catch (error) {
      message.error('Failed to update task');
    }
  };

  const handleCreateModalCancel = () => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditingTask(null);
    editForm.resetFields();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage tasks for users</p>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTask} className="bg-blue-500">
            Create Task
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{summary?.totalTasks || 0}</div>
          <div className="text-gray-500">Total Tasks</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{summary?.activeTasks || 0}</div>
          <div className="text-gray-500">Active Tasks</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">{summary?.pausedTasks || 0}</div>
          <div className="text-gray-500">Paused Tasks</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">{summary?.totalCompletions || 0}</div>
          <div className="text-gray-500">Total Completions</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Search
              placeholder="Search tasks..."
              allowClear
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="paused">Paused</Option>
              <Option value="completed">Completed</Option>
              <Option value="draft">Draft</Option>
            </Select>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 150 }}
            >
              <Option value="all">All Types</Option>
              <Option value="daily">Daily</Option>
              <Option value="social">Social</Option>
              <Option value="video">Video</Option>
              <Option value="survey">Survey</Option>
              <Option value="quiz">Quiz</Option>
              <Option value="special">Special</Option>
            </Select>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 150 }}
            >
              <Option value="all">All Categories</Option>
              <Option value="Education">Education</Option>
              <Option value="Social Media">Social Media</Option>
              <Option value="Research">Research</Option>
              <Option value="Marketing">Marketing</Option>
            </Select>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <RangePicker
              placeholder={['Start Date', 'End Date']}
              value={dateRange}
              onChange={setDateRange}
              style={{ width: 250 }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchTasks}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card>
        <Table
          columns={taskColumns}
          dataSource={tasks.map(task => ({ ...task, key: task._id }))}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} tasks`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, page, limit: pageSize || prev.limit }));
            },
            onShowSizeChange: (current, size) => {
              setPagination(prev => ({ ...prev, page: 1, limit: size }));
            }
          }}
          className="overflow-x-auto"
        />
      </Card>

      {/* Create Task Modal */}
      <Modal
        title="Create New Task"
        open={isCreateModalVisible}
        onOk={handleCreateModalOk}
        onCancel={handleCreateModalCancel}
        width={600}
        confirmLoading={loading}
      >
        <Form
          form={createForm}
          layout="vertical"
          name="createTask"
        >
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please input task title!' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input task description!' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter task description" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Task Type"
              rules={[{ required: true, message: 'Please select task type!' }]}
            >
              <Select placeholder="Select type">
                <Option value="daily">Daily</Option>
                <Option value="social">Social</Option>
                <Option value="video">Video</Option>
                <Option value="survey">Survey</Option>
                <Option value="quiz">Quiz</Option>
                <Option value="special">Special</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select category!' }]}
            >
              <Select placeholder="Select category">
                <Option value="Education">Education</Option>
                <Option value="Social Media">Social Media</Option>
                <Option value="Research">Research</Option>
                <Option value="Marketing">Marketing</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="reward"
              label="Reward (PEPE)"
              rules={[{ required: true, message: 'Please input reward amount!' }]}
            >
              <InputNumber
                min={1}
                placeholder="100"
                style={{ width: '100%' }}
                addonAfter="PEPE"
              />
            </Form.Item>

            <Form.Item
              name="maxCompletions"
              label="Max Completions"
              rules={[{ required: true, message: 'Please input max completions!' }]}
            >
              <InputNumber
                min={1}
                placeholder="1000"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="duration"
            label="Estimated Duration"
            rules={[{ required: true, message: 'Please input duration!' }]}
          >
            <Input placeholder="e.g., 5 min" />
          </Form.Item>

          <Form.Item
            name="url"
            label="Task URL (Optional)"
          >
            <Input placeholder="https://example.com" />
          </Form.Item>

          <Form.Item
            name="active"
            label="Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Draft" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        title="Edit Task"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        width={600}
        confirmLoading={loading}
      >
        <Form
          form={editForm}
          layout="vertical"
          name="editTask"
        >
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please input task title!' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input task description!' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter task description" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Task Type"
              rules={[{ required: true, message: 'Please select task type!' }]}
            >
              <Select placeholder="Select type">
                <Option value="daily">Daily</Option>
                <Option value="social">Social</Option>
                <Option value="video">Video</Option>
                <Option value="survey">Survey</Option>
                <Option value="quiz">Quiz</Option>
                <Option value="special">Special</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select category!' }]}
            >
              <Select placeholder="Select category">
                <Option value="Education">Education</Option>
                <Option value="Social Media">Social Media</Option>
                <Option value="Research">Research</Option>
                <Option value="Marketing">Marketing</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="reward"
              label="Reward (PEPE)"
              rules={[{ required: true, message: 'Please input reward amount!' }]}
            >
              <InputNumber
                min={1}
                placeholder="100"
                style={{ width: '100%' }}
                addonAfter="PEPE"
              />
            </Form.Item>

            <Form.Item
              name="maxCompletions"
              label="Max Completions"
              rules={[{ required: true, message: 'Please input max completions!' }]}
            >
              <InputNumber
                min={1}
                placeholder="1000"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="duration"
            label="Estimated Duration"
            rules={[{ required: true, message: 'Please input duration!' }]}
          >
            <Input placeholder="e.g., 5 min" />
          </Form.Item>

          <Form.Item
            name="url"
            label="Task URL (Optional)"
          >
            <Input placeholder="https://example.com" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status">
              <Option value="draft">Draft</Option>
              <Option value="active">Active</Option>
              <Option value="paused">Paused</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
