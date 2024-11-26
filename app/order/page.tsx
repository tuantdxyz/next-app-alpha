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
  const tempId = searchParams.get('tempId'); // Lấy tempId từ URL

  const productName = plan;
  const productPrice = price;

  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(20); // Thời gian đếm ngược 200 giây
  const [showPopup, setShowPopup] = useState(false); // Trạng thái để hiển thị popup
  const intervalRef = useRef<number | null>(null); // Đảm bảo kiểu là number hoặc null

  // Hàm gọi API kiểm tra trạng thái thanh toán
  const checkPaymentStatus = async () => {
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tempId }), // Sử dụng tempId từ URL
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPaymentStatus(data.payment_status || 'Unpaid');
    } catch (error) {
      // Không xử lý lỗi để không hiển thị thông báo
    }
  };

  // Gọi API checkPaymentStatus mỗi 5 giây
  useEffect(() => {
    if (paymentStatus === 'Unpaid') {
      intervalRef.current = window.setInterval(checkPaymentStatus, 5000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current); // Dừng interval khi không cần thiết
      }
    };
  }, [paymentStatus]); // Chạy lại khi paymentStatus thay đổi

  // Đếm ngược thời gian và cập nhật trạng thái khi hết thời gian
  useEffect(() => {
    if (timeRemaining > 0) {
      const timerId = window.setTimeout(() => {
        setTimeRemaining(prev => prev - 1); // Giảm timeRemaining mỗi giây
      }, 1000); // Mỗi giây giảm đi 1

      return () => clearTimeout(timerId); // Dọn dẹp khi component unmount hoặc timeRemaining thay đổi
    } else if (timeRemaining === 0 && paymentStatus === 'Unpaid') {
      // Sau khi hết thời gian, thay đổi paymentStatus và hiển thị popup
      // setPaymentStatus('Cancelled');
      setPaymentStatus('Paid');
      setShowPopup(true);
      setLoading(false); // Dừng vòng loading
    }
  }, [timeRemaining, paymentStatus]); // Chạy lại khi timeRemaining hoặc paymentStatus thay đổi

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push('/'); // Quay lại trang chủ khi đóng popup
  };

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
              <p>Thời gian còn lại: {timeRemaining} giây</p>
              {loading && <div className={styles.loader}></div>}
            </div>
          </div>
        )}

        {paymentStatus === 'Paid' && (
          <div className={styles.successPayBox}>
            <h2>Cảm ơn bạn!</h2>
            <p>Thanh toán đã được xác nhận.</p>
            <p>Chúng tôi sẽ gửi thông tin đơn hàng cho bạn qua email và sđt.</p>
            <button onClick={() => router.push('/')} className={styles.closeButton}>
              Đóng
            </button>
          </div>
        )}

        {paymentStatus === 'Cancelled' && showPopup && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>Đơn hàng đã bị hủy</h2>
              <p>Thời gian giao dịch đã hết. Vui lòng thử lại.</p>
              <button onClick={handleClosePopup} className={styles.closeButton}>
                OK
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OrderPage;
