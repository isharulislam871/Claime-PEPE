import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { generateUniqueReferralCode } from '@/lib/utils/referralCode';
import { getClientIP } from '@/lib/utils/getClientIP';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { verifySignature , generateSignature } from 'auth-fingerprint';
import SystemSettings from '@/models/SystemSettings';
import TelegramService from '@/lib/telegram';
// POST /api/users - Create new user with random referral code


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {  timestamp , hash , signature } = body;
    const { success , data   } =  verifySignature({ timestamp , hash , signature } , process.env.NEXTAUTH_SECRET || 'app');
 
    const { username, telegramUsername, referredBy,   profilePicUrl  ,  telegramId   } = JSON.parse(data as string)

    if (!success) {
       return NextResponse.json({
         success : false,
         error : 'Invalid signature'
       }, { status: 401 })
    } 
   
    // Get client IP address and user agent
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Get system settings
    const settings = await SystemSettings.getSettings();

    // Check if user registration is allowed
    if (!settings.allowUserRegistration) {
      return NextResponse.json({
        success: false,
        error: 'User registration is currently disabled',
        code: 'REGISTRATION_DISABLED'
      }, { status: 403 });
    }
 

    // Check if user already exists by telegramId
    const existingUser = await User.findOne({ telegramId });
    if (existingUser) {
      // Update IP address and user agent
      existingUser.ipAddress = clientIP;
      existingUser.userAgent = userAgent;
      await existingUser.save();

      return NextResponse.json({
        success: false,
        error: 'User already registered',
        code: 'USER_ALREADY_EXISTS'
      }, { status: 409 });
    }
 
    // Generate unique random referral code
    const referralCode = await generateUniqueReferralCode();

    // Create new user with generated referral code, IP address, and user agent
    const user = await User.create({
      telegramId,
      username,
      telegramUsername,
      referralCode,
      referredBy,
      ipAddress: clientIP,
      userAgent: userAgent,
      balance: settings.newUserBonus,
      profilePicUrl
    });



    // If user was referred, update referrer's stats
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.referralCount += 1;
        await referrer.save();

      }
    }

    return NextResponse.json({
      success: true,
       message : 'User created successfully',
       
    }, { status: 201 });

  } catch (error: any) {
   
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




// GET /api/users - Get user information by telegramId
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const timestamp = searchParams.get('timestamp');
    const hash = searchParams.get('hash');
    const signature = searchParams.get('signature');

 

    // Verify signature for security
    if (!timestamp || !hash || !signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing required authentication parameters'
      }, { status: 400 });
    }

    const { success , data  } = verifySignature({ timestamp, hash, signature }, process.env.NEXTAUTH_SECRET || 'app');

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid signature or expired signature'
      }, { status: 401 });
    }

    const { telegramId } = JSON.parse(data as string);

    if (!telegramId) {
      return NextResponse.json({
        success: false,
        error: 'telegramId is required'
      }, { status: 400 });
    }

    // Get client IP address
    const clientIP = getClientIP(request);

    // Check for IP-based account limits and auto-ban logic
    const accountsWithSameIP = await User.find({ ipAddress: clientIP , status : 'active' });
  
 
    // If there are already 5+ accounts with same IP, auto-ban all accounts with this IP
    if (accountsWithSameIP.length >= 5 ) {
      // Auto-ban all accounts with the same IP
      await User.updateMany(
        { ipAddress: clientIP, status: 'active' },
        { 
          status: 'ban',
          banReason: 'Multiple accounts detected from same IP address (Auto-banned)'
        }
      );

      // Log the auto-ban activity for each account
      const bannedAccounts = accountsWithSameIP.filter(user => user.status === 'active');
      const telegramService = new TelegramService();
      for (const account of bannedAccounts) {
        try {
          await telegramService.sendMessageToUser(
            account.telegramId.toString(), 
            'Account Banned', 
            'Multiple accounts detected from this IP address. All accounts have been banned.', 
            'system_update'
          );
        } catch (error) {
          console.error(`Failed to send ban notification to user ${account.telegramId}:`, error);
        }
      }

     
    }

    // Find user by telegramId
    const user = await User.findOne({ telegramId });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

  
    // Calculate 24-hour ads count from Activity model
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const adsCount24h = await Activity.countDocuments({
      telegramId: telegramId,
      type: 'ad_view',
       timestamp: { $gte: startOfToday, $lt: endOfToday }

    });

 
    // Log the user access
   if(user.status === 'active') {
    await Activity.create({
      telegramId,
      type: 'login',
      description: 'User data accessed via GET /api/users',
      reward: .02,
      metadata: { method: 'GET', endpoint: '/api/users' },
      timestamp: new Date(),
      ipAddress: clientIP,
      hash : `login_${telegramId}_${Date.now()}`
    });
   }

    return NextResponse.json({
      success: true,
    
        users: {
          id: user._id.toString(),
          username: user.username,
          telegramUsername: user.telegramUsername,
          referralCode: user.referralCode,
          referralCount: user.referralCount,
          referralEarnings: user.referralEarnings,
          balance: user.balance,
          totalEarned: user.totalEarned,
          totalAdsViewed: user.totalAdsViewed,
          totalRefers: user.totalRefers,
          status: user.status,
          banReason: user.banReason,
          adsWatchedToday: adsCount24h,
          ip: user.ipAddress,
          profilePicUrl: user.profilePicUrl,
          lastDailyCheckIn: user.lastDailyCheckIn,
          dailyCheckInStreak: user.dailyCheckInStreak,
          dailyCheckInCycle: user.dailyCheckInCycle,
          totalSpins: user.totalSpins,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
    
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

