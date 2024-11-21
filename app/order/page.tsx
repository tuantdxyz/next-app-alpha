'use client'
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import QRCodeImage from '../media/QRCode_example.png';
import styles from '../style/orderPage.module.css';

const OrderPage = () => {
    const router = useRouter(); // Khởi tạo router
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan');
    const price = searchParams.get('price');
  
    const productName = plan;
    const productPrice = price;
  
    const [showPopup, setShowPopup] = useState(false); // State để quản lý popup
  
    // Hàm xử lý khi người dùng nhấn nút xác nhận
    const handleConfirmPayment = () => {
      setShowPopup(true); // Hiện popup cảm ơn
    };
  
    // Hàm xử lý khi người dùng nhấn nút hủy
    const handleCancel = () => {
    //   alert('Bạn vẫn đang ở trang Order.');
    router.push('/'); // Trở về trang chủ
    };
  
    // Hàm đóng popup
    const closePopup = () => {
      setShowPopup(false);
      router.push('/'); // Chuyển hướng về trang chủ
    };
  
    return (
      <div className={styles.container}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <h1>Thông tin đặt hàng</h1>
          <h2>Product: {productName}</h2>
          <p>Price: ${productPrice} per month</p>
          <div className={styles.qrCodeContainer}>
            <Image src={QRCodeImage} alt="QR Code" width={300} height={300} />
          </div>
          <p>Please scan the QR code and pay with app.</p>
          <h3>Hướng dẫn:</h3>
          <ol>
            <li>Sau khi thanh toán thành công, hệ thống sẽ xác thực.</li>
            <li>Sau đó gửi thông tin gói tương ứng cho bạn qua sdt và email đăng ký.</li>
            <li>Hỗ trợ 24/7 nhanh chóng và bảo hành trách nhiệm.</li>
          </ol>
          <p>Chỉ chấp nhận thanh toán chuyển khoản và có thể mất 15ph để hoàn thành nhận account.</p>
          
          {/* Nút xác nhận thanh toán */}
          <button onClick={handleConfirmPayment} className={styles.confirmButton}>
            Xác nhận thanh toán
          </button>
  
          {/* Nút hủy */}
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Hủy
          </button>
        </form>
  
        {/* Popup cảm ơn */}
        {showPopup && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>Cảm ơn!</h2>
              <p>Thanh toán đã được xác nhận.</p>
              <button onClick={closePopup} className={styles.closeButton}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    );
  };

export default OrderPage;