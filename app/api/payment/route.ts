import { NextResponse } from 'next/server';

interface PaymentData {
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  transferType: string;
  description: string;
  transferAmount: number;
  referenceCode: string;
}

let latestPayment: PaymentData | null = null;

// Endpoint để nhận request từ webhook
export async function POST(request: Request) {
  const data = await request.json();

  console.log("data webhook request: ", data);
  // Kiểm tra dữ liệu đầu vào cho webhook
  if (data.transactionDate && data.referenceCode) {
    latestPayment = {
      gateway: data.gateway,
      transactionDate: data.transactionDate,
      accountNumber: data.accountNumber,
      transferType: data.transferType,
      description: data.description,
      transferAmount: data.transferAmount,
      referenceCode: data.referenceCode,
    };

    console.log("Webhook received and saved:", latestPayment);

    // Trả phản hồi cho SEPAY
    return NextResponse.json({
      status: "success",
      message: "Payment processed",
      amount: data.transferAmount,
    }, { status: 200 });
  } else {
    return NextResponse.json({
      status: "error",
      message: "Invalid data",
    }, { status: 400 });
  }
}

// Endpoint để truy vấn trạng thái thanh toán
export async function GET(request: Request) {
  if (latestPayment) {
    const paymentStatus = latestPayment.transferAmount > 0 ? 'Paid' : 'Unpaid';

    // Trả về trạng thái thanh toán và thông tin giao dịch
    return NextResponse.json({
      success: true,
      paymentStatus: paymentStatus,
      transactionDetails: latestPayment,
    }, { status: 200 });
  } else {
    // Nếu không có dữ liệu giao dịch nào
    return NextResponse.json({
      success: false,
      message: 'No payment data available',
    }, { status: 404 });
  }
}
