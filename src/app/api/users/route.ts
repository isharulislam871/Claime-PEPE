import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { generateUniqueReferralCode } from '@/lib/utils/referralCode';
import { getClientIP } from '@/lib/utils/getClientIP';
import User from '@/models/User';
import Activity from '@/models/Activity';

import { decrypt } from '@/lib/authlib';



// POST /api/users - Create new user with random referral code
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, telegramUsername, referredBy, hash , profilePicUrl } = body;

    if (!hash) {
      return NextResponse.json(
        { error: 'Missing required fields: telegramId ' },
        { status: 400 }
      );
    }


    const decrypted = decrypt(hash as string);
    const telegramId = decrypted.split(':')[0]


    // Get client IP address
    const clientIP = getClientIP(request);

   /*  const activity = await Activity.findOne({ hash });
    if (activity) {
      return NextResponse.json({
        success: false,
        error: 'Hash already used. Please generate a new hash.',
        code: 'HASH_ALREADY_USED'
      }, { status: 409 });
    } */



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

      // Check if the requesting IP matches the user's registered IP
      /* if (existingUser.ipAddress && existingUser.ipAddress !== clientIP) {
        return NextResponse.json({
          success: false,
          error: 'Access denied. IP address mismatch. Please login from your registered device.',
          code: 'IP_MISMATCH',
          registeredIP: existingUser.ipAddress,
          currentIP: clientIP
        }, { status: 403 });
      }
 */
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

    // Check if IP address already exists (one account per IP)
   /*  const existingIPUser = await User.findOne({ ipAddress: clientIP });
    if (existingIPUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account already exists for this IP address. Only one account per IP is allowed.',
          code: 'IP_ALREADY_REGISTERED'
        },
        { status: 409 }
      );
    } */

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
        referrer.balance += 500; // Bonus for referrer
        referrer.referralEarnings += 500
        await referrer.save();

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
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

