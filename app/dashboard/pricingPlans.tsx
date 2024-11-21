'use client'
import styles from '../style/pricingPlans.module.css';
import Link from 'next/link';
import { useState } from 'react';

type PricingPlan = {
    name: string;
    monthlyPrice: number;
    description: string;
};

const PricingPlans: React.FC = () => {
    const [isPriceMonthly, setIsPriceMonthly] = useState(true);

    const pricingPlans: PricingPlan[] = [
        { name: 'Netflix', monthlyPrice: 12, description: 'Gói dành cho những người yêu thích và khám phá.' },
        { name: 'CapCut', monthlyPrice: 24, description: 'Gói lý tưởng cho các freelancer với nhiều tính năng hỗ trợ.' },
        { name: 'Canva', monthlyPrice: 32, description: 'Gói cho các startup mới, giúp phát triển nhanh chóng.' },
        { name: 'Sportify', monthlyPrice: 48, description: 'Gói dành cho doanh nghiệp lớn với giải pháp toàn diện.' },
    ];

    const handleTogglePricing = () => {
        setIsPriceMonthly((prevState) => !prevState);
    };

    return (
        <div className={styles.container}>
            <div className={styles.toggleContainer}>
                <button
                    className={`${styles.toggleButton} ${isPriceMonthly ? styles.active : ''}`}
                    onClick={handleTogglePricing}
                >
                    Gói Tháng
                </button>
                <button
                    className={`${styles.toggleButton} ${!isPriceMonthly ? styles.active : ''}`}
                    onClick={handleTogglePricing}
                >
                    Gói Năm
                </button>
            </div>

            <div className={styles.plansContainer}>
                {pricingPlans.map((plan, index) => (
                    <div key={index} className={styles.planCard}>
                        <h3 className={styles.planName}>{plan.name}</h3>
                        <p className={styles.planPrice} >
                            ${isPriceMonthly ? plan.monthlyPrice : plan.monthlyPrice * 12}
                            {/* ${isPriceMonthly ? plan.monthlyPrice : plan.monthlyPrice * 12}/
                            {isPriceMonthly ? 'month' : 'year'} */}
                        </p>
                        <p className={styles.planDescription}>{plan.description}</p>
                        <Link href={{
                            pathname: '/order',
                            query: { plan: plan.name, price: isPriceMonthly ? plan.monthlyPrice : plan.monthlyPrice * 12 },
                        }}>
                            <button className={styles.subscribeButton}>Order</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPlans;