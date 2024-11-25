'use client'
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import QRCodeImage from '../media/QRCode_example.png';
import styles from '../style/orderPage.module.css';

const OrderPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');

  const productName = plan;
  const productPrice = price;

  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkPaymentStatus = () => {
    setLoading(true);
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current!);
          setPaymentStatus('Cancelled'); // Cập nhật trạng thái thành 'Cancelled'
          return 0; // Đảm bảo không có giá trị âm
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Kiểm tra trạng thái thanh toán khi component được mount
  useEffect(() => {
    checkPaymentStatus();

    // Giả lập trạng thái thanh toán thành công hay thất bại
    const timeoutId = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Dừng interval
      }
      setLoading(false);
      // setPaymentStatus('Paid'); // Cập nhật trạng thái thành 'Paid'
      setPaymentStatus('Cancelled');
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Dừng interval khi component unmount
      }
      clearTimeout(timeoutId); // Dừng timeout khi component unmount
    };
  }, []);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <h1>Thông tin đặt hàng</h1>
        <h2>Product: {productName}</h2>
        <p>Price: ${productPrice} per month</p>

        {paymentStatus === 'Unpaid' && (
          <div className={styles.paymentWaitingScreen}>
            <div className={styles.paymentWaitingContent}>
              <Image src={QRCodeImage} alt="QR Code" width={300} height={300} />
              <h2>Vui lòng quét mã QR để thanh toán</h2>
              <p>Hệ thống đang chờ xác nhận thanh toán của bạn.</p>
              {loading && <div className={styles.loader}></div>}
              <p>Thời gian còn lại: {timeRemaining} giây</p>
            </div>
          </div>
        )}

        {paymentStatus === 'Paid' && (
          <div className={styles.successPayBox}>
            <h2>Cảm ơn!</h2>
            <p>Thanh toán đã được xác nhận.</p>
            <button onClick={() => router.push('/')} className={styles.closeButton}>
              Đóng
            </button>
          </div>
        )}

        {paymentStatus === 'Cancelled' && (
          <div className={styles.failurePayBox}>
            <h2>Đơn hàng đã bị hủy</h2>
            <p>Vui lòng thử lại.</p>
            <button onClick={() => router.push('/')} className={styles.closeButton}>
              Về trang chủ
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OrderPage;