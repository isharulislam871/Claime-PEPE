import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
import AdsSettings from '@/models/AdsSettings';
import { verifySignature } from 'auth-fingerprint'
import { getClientIP } from '@/lib/utils/getClientIP';

export async function POST(request: NextRequest) {
  try {
     const { hash , signature , timestamp } = await request.json();

     const { success, data } = verifySignature({ hash, signature, timestamp }, process.env.NEXTAUTH_SECRET || 'app');

     if (!success) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { telegramId } = JSON.parse(data as string)

  
    await connectToDatabase();

    // Get ads settings
    const adsSettings = await AdsSettings.findOne();
    if (!adsSettings) {
      return NextResponse.json({ error: 'Ads settings not configured' }, { status: 500 });
    }




    // Get current user using User model
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for recent ad activity to prevent rapid consecutive ad views
    const recentActivityTime = new Date(Date.now() - adsSettings.minWatchTime * 1000);
    const recentActivity = await Activity.findOne({
      telegramId: telegramId,
      type: 'ad_view',
      timestamp: { $gte: recentActivityTime }
    }).sort({ timestamp: -1 });

    if (recentActivity) {
      const timeSinceLastAd = Math.floor((Date.now() - recentActivity.timestamp.getTime()) / 1000);
      if (timeSinceLastAd < adsSettings.minWatchTime) {
        return NextResponse.json({
          error: `Please wait ${adsSettings.minWatchTime - timeSinceLastAd} more seconds before watching another ad`,
          waitTime: adsSettings.minWatchTime - timeSinceLastAd,
          lastAdTime: recentActivity.timestamp
        }, { status: 400 });
      }
    }

    // Check 24-hour ad view limit using Activity model
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const adsCount24h = await Activity.countDocuments({
      telegramId: telegramId,
      type: 'ad_view',
      timestamp: { $gte: last24Hours }
    });

    // Check daily ad limit from settings
    if (adsCount24h >= adsSettings.adsWatchLimit) {
      return NextResponse.json({
        error: `Daily ad limit of ${adsSettings.adsWatchLimit} reached`,
        adsLeftToday: 0,
        adsViewed24h: adsCount24h,
        dailyLimit: adsSettings.adsWatchLimit
      }, { status: 400 });
    }

    // Calculate reward with multiplier
    const baseReward = adsSettings.defaultAdsReward;
    const reward = Math.floor(baseReward * adsSettings.adsRewardMultiplier);

    // Calculate 10% commission for referrer
    const commissionRate = 0.10; // 10%
    const commissionAmount = Math.floor(reward * commissionRate);

    // Update user balance and ad count using Mongoose
    user.balance += reward;
    user.totalAdsViewed += 1;
    user.totalEarned += reward;

    await user.save();

    // Process referral commission if user was referred
    let referrerUpdated = false;
    if (user.referredBy && commissionAmount > 0) {
      const referrer = await User.findByTelegramId(user.referredBy);
      if (referrer && referrer.status === 'active') {
        referrer.balance += commissionAmount;
        referrer.referralEarnings += commissionAmount;
        referrer.totalEarned += commissionAmount;
        await referrer.save();
        referrerUpdated = true;

        // Log referral commission activity
        await Activity.create({
          telegramId: user.referredBy,
          type: 'referral',
          description: `Earned ${commissionAmount} Point commission from ${user.username}'s ad view`,
          reward: commissionAmount,
          timestamp: new Date(),
          hash: `ref_${hash}`,
          ipAddress: getClientIP(request)
        });
      }
    }

    // Log activity using Activity model
    await Activity.create({
      telegramId,
      type: 'ad_view',
      description: `Watched ads and earned ${reward} Point${referrerUpdated ? ` (${commissionAmount} Point commission sent to referrer)` : ''}`,
      reward,
      timestamp: new Date(),
      hash,
      ipAddress: getClientIP(request)
    });

    const adsLeftToday = Math.max(0, adsSettings.adsWatchLimit - (adsCount24h + 1));

    return NextResponse.json({
      success: true,
      message: `Success! ${reward} Point has been added to your balance.${referrerUpdated ? ` Your referrer earned ${commissionAmount} Point commission.` : ''}`,
      user: {...user.toObject(), adsWatchedToday : adsCount24h },
      reward,
      commission: referrerUpdated ? {
        amount: commissionAmount,
        referrerId: user.referredBy
      } : null,
      adsLeftToday
    });

  } catch (error) {
    console.error('Error processing ad view:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');
    const signature = searchParams.get('signature');
    const timestamp = searchParams.get('timestamp');


    const { success, data } = verifySignature({ hash, signature, timestamp }, process.env.NEXTAUTH_SECRET || 'app');


    if (!success) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { telegramId } = JSON.parse(data as string)
    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
    }



    await connectToDatabase();

    // Get ads settings
    const adsSettings = await AdsSettings.findOne();
    if (!adsSettings) {
      return NextResponse.json({ error: 'Ads settings not configured' }, { status: 500 });
    }

    if (!adsSettings.enableGigaPubAds && !adsSettings.monetagEnabled) {
      return NextResponse.json({ error: 'Ads are disabled' }, { status: 400 });
    }



    // Find user
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Count ads viewed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const adsCountToday = await Activity.countDocuments({
      telegramId,
      type: 'ad_view',
      timestamp: { $gte: startOfDay }
    });

    // Calculate remaining ads for today
    const adsLeftToday = Math.max(0, adsSettings.adsWatchLimit - adsCountToday);

    return NextResponse.json({
      success: true,
      data: {
        userStats: {
          todayAdsViewed: adsCountToday,
          adsLeftToday,
          totalAdsViewed: user.totalAdsViewed,
          balance: user.balance,
          dailyLimit: adsSettings.adsWatchLimit
        },
        settings: {
          enabled: adsSettings.enableGigaPubAds,
          baseReward: adsSettings.defaultAdsReward,
          multiplier: adsSettings.adsRewardMultiplier,
          minWatchTime: adsSettings.minWatchTime,
          dailyLimit: adsSettings.adsWatchLimit
        }
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
