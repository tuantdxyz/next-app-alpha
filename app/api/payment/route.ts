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
    return NextResponse.json({ success: true, tempId });
  }

  // url for webhook: https://example.com/api/payment
  // url mapping: https://subscription-payments.vercel.app/

  // Kiểm tra trạng thái thanh toán
  // Xử lý logic ở đây (check orderID, packageName, Price)
  const tempId = data.tempId;
  if (tempId) {
    if (tempTransactions[tempId]) {
      const transaction = tempTransactions[tempId];
      const paymentStatus = transaction.transferAmount > 0 ? 'Paid' : 'Unpaid';
      return NextResponse.json({ payment_status: paymentStatus });
    } else {
      return NextResponse.json({ payment_status: 'transaction_not_found' }, { status: 404 });
    }
  }

  return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
}