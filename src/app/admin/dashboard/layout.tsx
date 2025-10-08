'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  SoundOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  PlusOutlined,
  MenuOutlined,
  CloseOutlined,
  ToolOutlined,
  WalletOutlined,
  PlayCircleOutlined,
  ContainerOutlined,
  ApiOutlined,
  SafetyOutlined
} from '@ant-design/icons';

// TypeScript interfaces
interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

interface LayoutProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface MenuItemType {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

// Layout Components
const Layout = ({ children, style }: LayoutProps) => (
  <div className="flex min-h-screen bg-gray-50 w-full" style={style}>
    {children}
  </div>
);

const Sider = ({ children, collapsed, width = 256 }: { children: React.ReactNode; collapsed?: boolean; width?: number }) => (
  <aside 
    className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out relative z-10 ${
      collapsed ? 'w-16 md:w-20' : 'w-64 md:w-72'
    }`}
    style={{ width: collapsed ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 64 : 80) : width }}
  >
    <div className="flex flex-col h-full">
      {children}
    </div>
  </aside>
);

const Header = ({ children, style }: LayoutProps) => (
  <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-20" style={style}>
    {children}
  </header>
);

const Menu = ({ children, mode = 'inline' }: { children: React.ReactNode; mode?: string }) => (
  <nav className="flex-1 px-3 py-4 overflow-y-auto">
    <ul className="space-y-1">
      {children}
    </ul>
  </nav>
);

const MenuItem = ({ 
  icon, 
  children, 
  active = false, 
  onClick 
}: { 
  icon?: React.ReactNode; 
  children: React.ReactNode; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <li>
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
        active 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-[1.02]' 
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'
      }`}
    >
      {icon && (
        <span className={`text-lg flex-shrink-0 ${
          active ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
        }`}>
          {icon}
        </span>
      )}
      <span className="font-medium text-sm truncate">{children}</span>
    </button>
  </li>
);

const LogoHeader = ({ collapsed }: { collapsed: boolean }) => (
  <div className="p-4 md:p-6 border-b border-gray-200">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="TaskUp Logo"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent truncate">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-xs truncate">TaskUp Crypto App</p>
        </div>
      )}
    </div>
  </div>
);

 

const PageHeader = ({ 
  collapsed, 
  onToggleCollapse, 
  title, 
  subtitle,
  adminData,
  onLogout
}: { 
  collapsed: boolean; 
  onToggleCollapse: () => void; 
  title: string; 
  subtitle?: string;
  adminData: any;
  onLogout: () => void;
}) => (
  <Header>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
        >
          {collapsed ? <MenuOutlined className="text-xl" /> : <CloseOutlined className="text-xl" />}
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
            {title}
          </h2>
          {subtitle && <p className="text-gray-600 text-sm hidden md:block">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <button className="relative p-2 text-gray-500 hover:text-blue-500 transition-colors rounded-xl hover:bg-blue-50">
          <BellOutlined className="text-lg" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
       
        {/* Admin Profile in Header */}
        <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <UserOutlined className="text-white text-xs" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 truncate max-w-24">
              {adminData?.user?.name || adminData?.user?.username || 'Admin'}
            </span>
            <span className="text-xs text-gray-500 truncate max-w-24">
              {adminData?.user?.role || 'Administrator'}
            </span>
          </div>
          <button 
            onClick={onLogout}
            className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
            title="Logout"
          >
            <LogoutOutlined className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  </Header>
);

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('overview');

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
  }, [status, router]);

  // Set selected key based on current pathname
  useEffect(() => {
    const path = pathname.split('/').pop();
    if (path === 'dashboard') {
      setSelectedKey('overview');
    } else if (path) {
      setSelectedKey(path);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const menuItems: MenuItemType[] = [
    { key: 'overview', icon: <DashboardOutlined />, label: 'Overview', path: '/admin/dashboard' },
    { key: 'users', icon: <TeamOutlined />, label: 'Users', path: '/admin/dashboard/users' },
    { key: 'activities', icon: <ClockCircleOutlined />, label: 'Activities', path: '/admin/dashboard/activities' },
    { key: 'tasks', icon: <FileTextOutlined />, label: 'Tasks', path: '/admin/dashboard/tasks' },
    { key: 'withdrawals', icon: <DollarOutlined />, label: 'Withdrawals', path: '/admin/dashboard/withdrawals' },
    { key: 'fraud-check', icon: <SafetyOutlined />, label: 'Fraud Check', path: '/admin/dashboard/fraud-check' },
    { key: 'wallets', icon: <WalletOutlined />, label: 'Wallet Management', path: '/admin/dashboard/wallets' },
    { key: 'coins', icon: <ContainerOutlined />, label: 'Coin Management', path: '/admin/dashboard/coins' },
    { key: 'rpc-nodes', icon: <ApiOutlined />, label: 'RPC Node Management', path: '/admin/dashboard/rpc-nodes' },
    { key: 'ads', icon: <PlayCircleOutlined />, label: 'Ads Settings', path: '/admin/dashboard/ads' },
    { key: 'broadcast', icon: <SoundOutlined />, label: 'Send Broadcast', path: '/admin/dashboard/broadcast' },
    { key: 'maintenance', icon: <ToolOutlined />, label: 'Maintenance', path: '/admin/dashboard/maintenance' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings', path: '/admin/dashboard/settings' },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  const currentMenuItem = menuItems.find(item => item.key === selectedKey);

  return (
    <Layout style={{ width: '100vw', maxWidth: '100vw' }}>
      {/* Background Animation */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-5 animate-pulse top-1/5 left-1/10"></div>
        <div className="absolute w-30 h-30 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-5 animate-pulse top-3/5 right-1/6"></div>
        <div className="absolute w-15 h-15 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-5 animate-pulse bottom-1/5 left-1/5"></div>
      </div>

      <Sider collapsed={collapsed} width={256}>
        {/* Logo/Header */}
        <LogoHeader collapsed={collapsed} />

        {/* Navigation Menu */}
        <Menu mode="inline">
          {menuItems.map((item) => (
            <MenuItem
              key={item.key}
              icon={item.icon}
              active={selectedKey === item.key}
              onClick={() => router.push(item.path)}
            >
              {!collapsed && item.label}
            </MenuItem>
          ))}
        </Menu>

       
      </Sider>

      <Layout style={{ flexDirection: 'column', flex: 1 }}>
        <PageHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          title={currentMenuItem?.label || 'Dashboard'}
          subtitle="Monitor your crypto task app performance"
          adminData={session}
          onLogout={handleLogout}
        />

        {children}
      </Layout>
    </Layout>
  );
}
