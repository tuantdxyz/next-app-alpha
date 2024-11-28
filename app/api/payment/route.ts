// app/api/payment.ts
import { NextResponse } from 'next/server';

const tempTransactions: { [key: string]: any } = {};

// Endpoint để nhận request từ webhook
export async function POST(request: Request) {
  const data = await request.json();

  console.log("data webhook request: ", data);
  // Kiểm tra dữ liệu đầu vào cho webhook
  if (data.transactionDate && data.referenceCode) {
    const tempId = data.referenceCode;
    tempTransactions[tempId] = {
      // Lưu thông tin giao dịch
      gateway: data.gateway,
      transactionDate: data.transactionDate,
      accountNumber: data.accountNumber,
      subAccount: data.subAccount,
      transferType: data.transferType,
      transferAmount: data.transferAmount,
      accumulated: data.accumulated,
      code: data.code,
      transactionContent: data.content,
      referenceNumber: data.referenceCode,
      description: data.description,
    };
    const transaction = tempTransactions[tempId];
    const paymentStatus = transaction.transferAmount > 0 ? 'Paid' : 'Unpaid';
    const price = data.price;
    const plan = data.plan;
    // response from server
    return NextResponse.json({ success: true, message: `${tempId} ${price} ${plan} valid data`, payment_status: paymentStatus }, { status: 200 });
  } else
    return NextResponse.json({ success: false, message: 'Invalid data', paymentStatus: 'Unpaid' }, { status: 400 });
}