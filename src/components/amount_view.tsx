import React from 'react';
import { Typography } from 'antd';
import { Amount } from "@models/index.ts";

interface AmountViewProps {
    amount: number;
    currency?: string;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    type?: 'success' | 'warning' | 'danger' | 'secondary';
}

const AmountView: React.FC<AmountViewProps> = ({
    amount,
    currency,
    prefix,
    suffix,
    className,
    type
}: AmountViewProps) => {
    const _amount = Amount.from(amount, currency)
    if (!_amount) return null

    const getTextType = () => {
        switch (type) {
            case 'success':
                return 'success';
            case 'warning':
                return 'warning';
            case 'danger':
                return 'danger';
            case 'secondary':
                return 'secondary';
            default:
                return undefined;
        }
    };

    return (
        <Typography.Text className={className} type={getTextType()}>
            {prefix}
            {_amount.label}
            {currency && ` ${currency}`}
            {suffix}
        </Typography.Text>
    );
};

export default AmountView;