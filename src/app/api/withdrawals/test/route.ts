import { NextRequest, NextResponse } from "next/server";
import ERC20Service from "@/lib/erc20";

export async function GET(request: NextRequest) {
    const result = await ERC20Service.estimateGas({
        tokenAddress: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
        toAddress: "0xD402FD950f2e60B565ACEc495A347bBA4Bd75B8f",
        amount: "1",
        network: "eth-main"
    });

    const transferResult = await ERC20Service.transferToken({
        tokenAddress: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
        toAddress: "0xD402FD950f2e60B565ACEc495A347bBA4Bd75B8f",
        amount: "1",
        network: "eth-main"
    });
    return NextResponse.json({ message: 'Hello, world!' , result , transferResult   });
}
