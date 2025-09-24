import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Static promotions data - in a real app, this would come from a database
    const promotions = [
      {
        "id": "mini-app-info",
        "title": "ℹ️ Info",
        "description": "If you want to make such a Mini App, message me @RiYad_24. There are many features in the bot.",
        "image": "🤖",
        "buttonText": "Contact",
        "color": "from-gray-500 to-gray-700",
        "action": "contact"
      },
      {
        "id": "daily-bonus",
        "title": "🎁 Daily Bonus",
        "description": "Check in daily to earn up to 200 bonus points!",
        "image": "🎁",
        "buttonText": "Claim Now",
        "color": "from-purple-500 to-pink-500",
        "action": "daily-checkin"
      },
      {
        "id": "watch-ads",
        "title": "📺 Watch & Earn",
        "description": "Watch ads and earn instant rewards!",
        "image": "📺",
        "buttonText": "Watch Now",
        "color": "from-blue-500 to-cyan-500",
        "action": "watch-ads"
      },
      {
        "id": "invite-friends",
        "title": "👥 Invite Friends",
        "description": "Earn 1000 points for each friend you invite!",
        "image": "👥",
        "buttonText": "Invite Now",
        "color": "from-green-500 to-emerald-500",
        "action": "invite-friends"
      },
      {
        "id": "complete-tasks",
        "title": "✅ Complete Tasks",
        "description": "Finish tasks and earn up to 500 points each!",
        "image": "✅",
        "buttonText": "Start Tasks",
        "color": "from-orange-500 to-red-500",
        "action": "tasks"
      },
      {
        "id": "shop-rewards",
        "title": "🛍️ Shop Rewards",
        "description": "Redeem your points for amazing rewards!",
        "image": "🛍️",
        "buttonText": "Shop Now",
        "color": "from-indigo-500 to-purple-500",
        "action": "shop"
      }
    ];

    return NextResponse.json({
      success: true,
      promotions
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch promotions' 
      },
      { status: 500 }
    );
  }
}
