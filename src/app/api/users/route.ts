import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { generateUniqueReferralCode } from '@/lib/utils/referralCode';
import { getClientIP } from '@/lib/utils/getClientIP';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { verifySignature , generateSignature } from 'auth-fingerprint';
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
   
    // Get client IP address
    const clientIP = getClientIP(request);
 
 
    // Calculate 24-hour ads count from Activity model
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const adsCount24h = await Activity.countDocuments({
      telegramId: telegramId,
      type: 'ad_view_home',
      timestamp: { $gte: last24Hours }
    });

    // Check if user already exists by telegramId
    const existingUser = await User.findOne({ telegramId });
    if (existingUser) {

 
      // Update IP address if user doesn't have one (for existing users)
       if (!existingUser.ipAddress) {
        existingUser.ipAddress = clientIP;
        await existingUser.save();
      } 



      // Log this hash usage to prevent reuse
      await Activity.create({
        telegramId,
        type: 'login',
        description: 'User login via POST /api/users',
        reward: 0.001,
        metadata: { method: 'POAST', endpoint: '/api/users' },
        timestamp: new Date(),
        ipAddress: clientIP,
        hash
      });
      return NextResponse.json({
        success: true,
        result: {
          users: {
            id : existingUser._id.toString(),
            username: existingUser.username,
            referralCode: existingUser.referralCode,
            referralCount: existingUser.referralCount,
            referralEarnings: existingUser.referralEarnings,
            balance: existingUser.balance,
            totalEarned: existingUser.totalEarned,
            status: existingUser.status,
            isNewUser: !existingUser.createdAt || (Date.now() - existingUser.createdAt.getTime()) < 1000,
            adsWatchedToday: adsCount24h,
            ip: existingUser.ipAddress,
            profilePicUrl : existingUser.profilePicUrl,
            banReason : existingUser.banReason
          }
        }

      });
    }
 
    // Generate unique random referral code
    const referralCode = await generateUniqueReferralCode();

    // Create new user with generated referral code and IP address
    const user = await User.create({
      telegramId,
      username,
      telegramUsername,
      referralCode,
      referredBy,
      ipAddress: clientIP,
      balance: 250,
      profilePicUrl
    });



    // Log this hash usage to prevent reuse
    await Activity.create({
      telegramId,
      type: 'api',
      description: 'User api via POST /api/users',
      reward: 250,
      metadata: { method: 'POST', endpoint: '/api/users' },
      timestamp: new Date(),
      ipAddress: clientIP,
      hash
    });
    // If user was referred, update referrer's stats
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.referralCount += 1;
        referrer.balance += 1000; // Bonus for referrer
        referrer.referralEarnings += 1000
        await referrer.save();

        await Activity.create({
          telegramId: referrer.telegramId,
          type: 'referral',
          description: `Referral bonus for inviting user ${telegramId}`,
          reward: 1000,
          metadata: { 
            referredUser: telegramId,
            referralCode: referredBy,
            bonusType: 'referrer_reward'
          },
          timestamp: new Date(),
          ipAddress: clientIP,
          hash: `referral_${referrer.telegramId}_${telegramId}_${Date.now()}`
        })

      }
    }

    return NextResponse.json({
      success: true,
      result: {
        users: {
          id : user._id.toString(),
          username: user.username,
          referralCode: user.referralCode,
          referralCount: user.referralCount,
          referralEarnings: user.referralEarnings,
          balance: user.balance,
          totalEarned: user.totalEarned,
          status: user.status,
          isNewUser: !user.createdAt || (Date.now() - user.createdAt.getTime()) < 1000,
          adsWatchedToday: adsCount24h,
          ip: user.ipAddress,
          profilePicUrl : user.profilePicUrl,
          banReason : user.banReason
        }
      }
    }, { status: 201 });

  } catch (error: any) {
   
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

