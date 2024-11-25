import { NextResponse } from 'next/server';

let paymentStatus = 'Unpaid'; // Trạng thái mặc định

export async function POST(request: Request) {
  const data = await request.json(); // Nhận dữ liệu từ body
  const { status } = data; // Lấy trạng thái từ dữ liệu

  if (status) {
    paymentStatus = status; // Cập nhật trạng thái thanh toán
    return NextResponse.json({ message: 'Status updated', status: paymentStatus }, { status: 200 });
  }
  
  return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
}

export async function GET() {
  // Trả về trạng thái hiện tại nếu là GET
  return NextResponse.json({ status: paymentStatus }, { status: 200 });
}