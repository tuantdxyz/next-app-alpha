'use client';
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
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(200); // Thời gian đếm ngược 200 giây
  const [showPopup, setShowPopup] = useState(false); // Trạng thái để hiển thị popup
  const intervalRef = useRef<number | null>(null); // Đảm bảo kiểu là number hoặc null

  const checkPaymentStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tempId }), // Sử dụng tempId từ URL
      });

      if (!response.ok) {
        throw new Error('Network response was not ok'); // Ném lỗi nếu không thành công
      }

      const data = await response.json();
      setPaymentStatus(data.payment_status || 'Unpaid');
    } catch (error) {
      // Không xử lý lỗi để không hiển thị thông báo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeRemaining > 0) {
      checkPaymentStatus(); // Gọi API chỉ khi thời gian còn lại
      intervalRef.current = window.setInterval(checkPaymentStatus, 5000); // Kiểm tra mỗi 5 giây
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current); // Chỉ gọi clearInterval khi intervalRef.current không phải null
      }
    };
  }, [timeRemaining]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timerId); // Dừng interval khi hết thời gian
          setPaymentStatus('Cancelled'); // Cập nhật trạng thái thanh toán
          setShowPopup(true); // Hiển thị popup
          return 0; // Đảm bảo không giảm xuống dưới 0
        }
      });
    }, 1000);

    return () => clearInterval(timerId); // Dọn dẹp interval khi component unmount
  }, []);

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
            <h2>Cảm ơn!</h2>
            <p>Thanh toán đã được xác nhận.</p>
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