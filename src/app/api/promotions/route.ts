import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Static promotions data - in a real app, this would come from a database
    const promotions = [
      {
        "id": "daily-bonus",
        "title": "Daily Bonus",
        "description": "Check in daily to earn up to 200 bonus points!",
        "image": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&crop=center",
        "buttonText": "Claim Now",
        "color": "from-purple-500 to-pink-500",
        "actionType": "navigate",
        "actionData": { "route": "/daily-checkin" },
        "isActive": true,
        "priority": 1
      },
      {
        "id": "watch-ads",
        "title": "Watch & Earn",
        "description": "Watch ads and earn instant rewards!",
        "image": "https://i.ibb.co.com/dsr3DhvZ/Gemini-Generated-Image-cltd1icltd1icltd.png",
        "buttonText": "Watch Now",
        "color": "from-blue-500 to-cyan-500",
        "actionType": "popup",
        "actionData": { "type": "isDailyCheckInOpen" },
        "isActive": true,
        "priority": 2
      },
      {
        "id": "invite-friends",
        "title": "Invite Friends",
        "description": "Earn 1000 points for each friend you invite!",
        "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop&crop=center",
        "buttonText": "Invite Now",
        "color": "from-green-500 to-emerald-500",
        "actionType": "navigate",
        "actionData": { "route": "/invite" },
        "isActive": true,
        "priority": 3
      },
      {
        "id": "complete-tasks",
        "title": "Complete Tasks",
        "description": "Finish tasks and earn up to 500 points each!",
        "image": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=200&fit=crop&crop=center",
        "buttonText": "Start Tasks",
        "color": "from-orange-500 to-red-500",
        "actionType": "navigate",
        "actionData": { "route": "/tasks" },
        "isActive": true,
        "priority": 4
      },
      {
        "id": "shop-rewards",
        "title": "Shop Rewards",
        "description": "Redeem your points for amazing rewards!",
        "image": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=200&fit=crop&crop=center",
        "buttonText": "Shop Now",
        "color": "from-indigo-500 to-purple-500",
        "actionType": "navigate",
        "actionData": { "route": "/shop" },
        "isActive": true,
        "priority": 5
      },
      {
        "id": "crypto-news",
        "title": "Crypto News",
        "description": "Stay updated with the latest cryptocurrency news!",
        "image": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop&crop=center",
        "buttonText": "Read More",
        "color": "from-yellow-500 to-orange-500",
        "actionType": "external",
        "actionData": { "url": "https://coindesk.com" },
        "isActive": true,
        "priority": 6
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
