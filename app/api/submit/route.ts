import { NextResponse } from 'next/server';

// CORSヘッダーを追加（Storybookからのアクセスを許可）
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[API ROUTE] Received submission:', body);

    // サーバーサイド処理をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully on server!',
        data: body
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[API ROUTE ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
