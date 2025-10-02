import { NextRequest, NextResponse } from 'next/server';

export interface QuickActionConfig {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}

// Default quick actions configuration
const defaultQuickActions: QuickActionConfig[] = [
  { id: 'daily-checkin', title: 'Daily Check-in', enabled: true, order: 1 },
  { id: 'tasks', title: 'Tasks', enabled: true, order: 2 },
  { id: 'ads', title: 'Watch Ads', enabled: true, order: 3 },
  { id: 'home', title: 'Home', enabled: false, order: 4 },
  { id: 'withdraw', title: 'Withdraw', enabled: true, order: 5 },
  { id: 'invite', title: 'Invite Friends', enabled: true, order: 6 },
  { id: 'swap', title: 'Swap', enabled: true, order: 7 },
  { id: 'history', title: 'History', enabled: true, order: 8 },
  { id: 'profile', title: 'Profile', enabled: false, order: 9 },
  { id: 'rewards', title: 'Rewards', enabled: true, order: 10 },
  { id: 'shop', title: 'Shop', enabled: false, order: 11 },
  { id: 'voucher', title: 'Voucher', enabled: false, order: 12 },
  { id: 'leaderboard', title: 'Leaderboard', enabled: true, order: 13 },
  { id: 'earning-center', title: 'Earning Center', enabled: false, order: 14 },
  { id: 'support', title: 'Support', enabled: false, order: 15 }
];

// In a real application, this would be stored in a database
let quickActionsConfig = [...defaultQuickActions];

// GET - Fetch quick actions configuration
export async function GET(request: NextRequest) {
  try {
    // Filter only enabled quick actions and sort by order
    const enabledQuickActions = quickActionsConfig
      .filter(action => action.enabled)
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      data: enabledQuickActions,
      message: 'Quick actions fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching quick actions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quick actions',
        message: 'An error occurred while fetching quick actions configuration'
      },
      { status: 500 }
    );
  }
}

// POST - Update quick actions configuration (for admin use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quickActions } = body;

    if (!Array.isArray(quickActions)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
          message: 'quickActions must be an array'
        },
        { status: 400 }
      );
    }

    // Validate each quick action
    for (const action of quickActions) {
      if (!action.id || typeof action.enabled !== 'boolean' || typeof action.order !== 'number') {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid quick action format',
            message: 'Each quick action must have id, enabled (boolean), and order (number)'
          },
          { status: 400 }
        );
      }
    }

    // Update the configuration
    quickActionsConfig = quickActions.map((action: any) => ({
      id: action.id,
      title: action.title || action.id,
      enabled: action.enabled,
      order: action.order
    }));

    return NextResponse.json({
      success: true,
      data: quickActionsConfig,
      message: 'Quick actions configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating quick actions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update quick actions',
        message: 'An error occurred while updating quick actions configuration'
      },
      { status: 500 }
    );
  }
}

// PUT - Toggle specific quick action
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionId, enabled } = body;

    if (!actionId || typeof enabled !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
          message: 'actionId and enabled (boolean) are required'
        },
        { status: 400 }
      );
    }

    // Find and update the specific action
    const actionIndex = quickActionsConfig.findIndex(action => action.id === actionId);
    
    if (actionIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Action not found',
          message: `Quick action with id '${actionId}' not found`
        },
        { status: 404 }
      );
    }

    quickActionsConfig[actionIndex].enabled = enabled;

    return NextResponse.json({
      success: true,
      data: quickActionsConfig[actionIndex],
      message: `Quick action '${actionId}' ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Error toggling quick action:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to toggle quick action',
        message: 'An error occurred while toggling quick action'
      },
      { status: 500 }
    );
  }
}
