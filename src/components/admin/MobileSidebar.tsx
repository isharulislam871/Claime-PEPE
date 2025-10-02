'use client';

import { BellOutlined, CloseOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd-mobile";
import { Drawer } from 'antd';

export const MobileSidebar = ({ sidebarOpen , toggleSidebar , sidebarItems , setActiveTab , setSidebarOpen , activeTab } : any) =>{ return(
    <Drawer
      title={null}
      placement="left"
      onClose={toggleSidebar}
      open={sidebarOpen}
      width={320}
      closable={false}
      styles={{
        body: { 
          padding: 0,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)'
        }
      }}
    >
      <div className="h-full"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)'
        }}
      >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3F83F8, #10B981)' }}
            >
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
              <p className="text-sm text-gray-500">TaskUp Management</p>
            </div>
          </div>
          <Button
            fill="none"
            size="small"
            onClick={toggleSidebar}
            style={{ color: '#6B7280' }}
          >
            <CloseOutlined />
          </Button>
        </div>


      </div>

      {/* Navigation Items */}
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</h3>
          {sidebarItems.map((item : any) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl mb-2 transition-all duration-200 ${activeTab === item.id
                ? 'bg-gradient-to-r from-blue-50 to-green-50 border-l-4 shadow-sm'
                : 'hover:bg-gray-50'
                }`}
              style={{
                borderLeftColor: activeTab === item.id ? item.color : 'transparent'
              }}
            >
              <div
                className={`text-2xl transition-colors duration-200`}
                style={{ color: activeTab === item.id ? item.color : '#64748B' }}
              >
                {item.icon}
              </div>
              <div className="text-left flex-1">
                <div
                  className="font-semibold text-sm"
                  style={{ color: activeTab === item.id ? item.color : '#1F2937' }}
                >
                  {item.title}
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              {activeTab === item.id && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <BellOutlined className="text-gray-500" />
              <span className="text-sm text-gray-700">Notifications</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors">
              <LogoutOutlined className="text-red-500" />
              <span className="text-sm text-red-600">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </Drawer>
  )};