'use client';

import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, FireOutlined, StarOutlined, GiftOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, Card, SearchBar, Dialog } from "antd-mobile";
import { useState } from "react";
import { TaskEditPopup } from "./TaskEditPopup";
import { TaskAddPopup } from "./TaskAddPopup";

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: 'Ads' | 'Social' | 'Survey' | 'Referral' | 'Daily';
  status: 'active' | 'inactive' | 'banned' | 'paused';
  completions: number;
  duration?: number;
  url?: string;
  type?: string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return '#10B981';
        case 'inactive': return '#F59E0B';
        case 'banned': return '#EF4444';
        case 'paused': return '#F59E0B';
        default: return '#6B7280';
    }
};

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Ads': return <FireOutlined className="text-red-500" />;
        case 'Social': return <UserOutlined className="text-blue-500" />;
        case 'Survey': return <StarOutlined className="text-yellow-500" />;
        case 'Referral': return <GiftOutlined className="text-green-500" />;
        case 'Daily': return <StarOutlined className="text-purple-500" />;
        default: return <StarOutlined className="text-gray-500" />;
    }
};

const initialTasks: Task[] = [
    {
      id: '2',
      title: 'Social Media Follow',
      description: 'Follow our social media accounts',
      reward: 100,
      category: 'Social',
      status: 'active',
      completions: 890,
      url: 'https://twitter.com/taskup'
    }
  ]


export const Tasks = () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [tasksData, setTasksData] = useState<Task[]>(initialTasks);
    const [searchValue, setSearchValue] = useState('');

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setShowEditPopup(true);
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
        setSelectedTask(null);
    };

    const handleSaveTask = (updatedTask: Task) => {
        setTasksData(prevTasks => 
            prevTasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    };

    const handleAddTask = (newTask: Task) => {
        setTasksData(prevTasks => [...prevTasks, newTask]);
    };

    const handleCloseAddPopup = () => {
        setShowAddPopup(false);
    };

    const handleOpenAddPopup = () => {
        setShowAddPopup(true);
    };

    const handleDeleteTask = (taskId: string) => {
        Dialog.confirm({
            content: 'Are you sure you want to delete this task?',
            onConfirm: () => {
                setTasksData(prevTasks => prevTasks.filter(task => task.id !== taskId));
            }
        });
    };

    const filteredTasks = tasksData.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchValue.toLowerCase());
        return matchesSearch;
    });

    const renderTaskItem = (task: Task) => (
        <Card key={task.id} className="mb-3">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        {getCategoryIcon(task.category)}
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-gray-800">{task.title}</div>
                        <div className="text-sm text-gray-600 mb-1">{task.description}</div>
                        <div className="text-xs flex items-center gap-4">
                            <span>
                                Reward: <span style={{ color: '#10B981' }}>{task.reward} pts</span>
                            </span>
                            <span>
                                Completions: <span style={{ color: '#3F83F8' }}>{task.completions}</span>
                            </span>
                            {task.duration && (
                                <span>
                                    Duration: <span style={{ color: '#8B5CF6' }}>{task.duration}s</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        content={task.status}
                        style={{ backgroundColor: getStatusColor(task.status) }}
                    />
                    <Button size="small" fill="none" style={{ color: '#F59E0B' }} onClick={() => handleEditTask(task)}>
                        <EditOutlined />
                    </Button>
                    <Button size="small" fill="none" style={{ color: '#EF4444' }} onClick={() => handleDeleteTask(task.id)}>
                        <DeleteOutlined />
                    </Button>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <UserOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Social Media Task</h2>
                         
                        </div>
                    </div>
                    <Button
                        size="small"
                        onClick={handleOpenAddPopup}
                        style={{ backgroundColor: '#8B5CF6', color: 'white', border: 'none' }}
                    >
                        <PlusOutlined /> Add Task
                    </Button>
                </div>

            
               
            </Card>

            {/* Tasks List */}
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Social Media Follow Task</h3>
                    <Badge 
                        content={filteredTasks.length} 
                        style={{ backgroundColor: '#8B5CF6' }} 
                    />
                </div>
                
                <div className="space-y-3">
                    {filteredTasks.map(renderTaskItem)}
                    
                    {filteredTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <SearchOutlined className="text-4xl mb-2" />
                            <div>No tasks found</div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Task Edit Popup */}
            <TaskEditPopup
                visible={showEditPopup}
                task={selectedTask}
                onClose={handleCloseEditPopup}
                onSave={handleSaveTask}
            />

            {/* Task Add Popup */}
            <TaskAddPopup
                visible={showAddPopup}
                onClose={handleCloseAddPopup}
                onSave={handleAddTask}
            />
        </div>
    )
};