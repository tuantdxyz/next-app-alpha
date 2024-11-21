'use client'
import Link from 'next/link';
import styles from '../style/dashboard.module.css';
import PricingPlans from './pricingPlans';

const DashboardHome = () => {
    return (
        <div className={styles.container}>
        {/* <header className={styles.header}>
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header> */}
  
        <main className={styles.main}>
          <h1>Welcome to JIN Service</h1>
          {/* <BillingButtons /> */}
          <PricingPlans />
        </main>
  
        <footer className={styles.footer}>
          <p>© 2024 Jin. All rights reserved.</p>
        </footer>
      </div>
    );
};

export default DashboardHome;