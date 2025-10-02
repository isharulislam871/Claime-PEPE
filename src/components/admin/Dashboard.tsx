import { Badge, Card, Skeleton } from "antd-mobile";
import { useEffect, useState } from "react";


interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalTasks: number;
    completedTasks: number;
    totalRewards: number;
    pendingWithdrawals: number;
  }


export const Dashboard = () => {

    const [loading, setLoading] = useState(true);

     const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        activeUsers: 0,
        totalTasks: 0,
        completedTasks: 0,
        totalRewards: 0,
        pendingWithdrawals: 0
      });

     useEffect(() => {
        // Simulate loading admin data
        setTimeout(() => {
          setStats({
            totalUsers: 1247,
            activeUsers: 892,
            totalTasks: 45,
            completedTasks: 2596,
            totalRewards: 125000,
            pendingWithdrawals: 15
          });
          setLoading(false);
        }, 1500);
      }, []);
    

    return (

        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="p-4">
                            <Skeleton.Title animated className="!w-16 !h-8 !mb-2" />
                            <Skeleton.Title animated className="!w-20 !h-4" />
                        </Card>
                    ))
                ) : (
                    <>
                        <Card className="p-4 border-l-4" style={{ borderLeftColor: '#3F83F8' }}>
                            <div className="text-2xl font-bold" style={{ color: '#3F83F8' }}>
                                {stats.totalUsers.toLocaleString()}
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>Total Users</div>
                        </Card>

                        <Card className="p-4 border-l-4" style={{ borderLeftColor: '#10B981' }}>
                            <div className="text-2xl font-bold" style={{ color: '#10B981' }}>
                                {stats.activeUsers.toLocaleString()}
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>Active Users</div>
                        </Card>

                        <Card className="p-4 border-l-4" style={{ borderLeftColor: '#F59E0B' }}>
                            <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                                {stats.totalTasks}
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>Total Tasks</div>
                        </Card>

                        <Card className="p-4 border-l-4" style={{ borderLeftColor: '#8B5CF6' }}>
                            <div className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
                                {stats.completedTasks.toLocaleString()}
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>Completed</div>
                        </Card>

                        <Card className="p-4 border-l-4" style={{ borderLeftColor: '#EF4444' }}>
                            <div className="text-2xl font-bold" style={{ color: '#EF4444' }}>
                                ${(stats.totalRewards / 100).toFixed(0)}
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>Total Rewards</div>
                        </Card>

                        <Card className="p-4 border-l-4" style={{ borderLeftColor: '#F59E0B' }}>
                            <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                                {stats.pendingWithdrawals}
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>Pending</div>
                        </Card>
                    </>
                )}
            </div>

            {/* Recent Activity */}
            <Card title="Recent Activity" className="mt-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                            <div className="font-medium" style={{ color: '#1F2937' }}>New user registered</div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>sarah_johnson joined 5 minutes ago</div>
                        </div>
                        <Badge content="New" style={{ backgroundColor: '#3F83F8' }} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                            <div className="font-medium" style={{ color: '#1F2937' }}>Task completed</div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>mike_wilson completed "Watch Advertisement"</div>
                        </div>
                        <Badge content="✓" style={{ backgroundColor: '#10B981' }} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                            <div className="font-medium" style={{ color: '#1F2937' }}>Withdrawal request</div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>jane_smith requested $25 withdrawal</div>
                        </div>
                        <Badge content="!" style={{ backgroundColor: '#F59E0B' }} />
                    </div>
                </div>
            </Card>
        </div>
    );
}

