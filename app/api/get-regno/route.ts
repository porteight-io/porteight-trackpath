import { db } from "@/db";
import { porteight_trucks } from "@/db/schema";
import { count, countDistinct, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const data = await db.selectDistinct({
            registrationNo: porteight_trucks.truck_no
        })
        .from(porteight_trucks)
        .where(eq(porteight_trucks.organization_id, 154))

        // const total = data.length > 0 ? await db.select({ count: count() }).from(porteight_trucks).where(eq(porteight_trucks.organization_id, 154)) : [ { count: 0 } ];

        return NextResponse.json({ data: data });
    } catch (error) {
        console.error('Error fetching table data:', error);
        return NextResponse.json({ error: 'Failed to fetch table data' }, { status: 500 });
    }
}