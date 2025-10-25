// Tax rates (adjust these as needed)
const STATE_TAX_RATE = 0.06; // 6% Vermont state tax
const LOCAL_TAX_RATE = 0.01;  // 1% Local option tax
const TOTAL_TAX_RATE = STATE_TAX_RATE + LOCAL_TAX_RATE; // 7% combined

/**
 * Calculate base price from a total price
 * @param totalPrice - The price with tax
 * @returns The base price, rounded to 2 decimal places
 */
const calculateBasePrice = (totalPrice: number): number => {
    return totalPrice / (1 + TOTAL_TAX_RATE);
};

/**
 * Calculate state tax amount from a base price
 * @param basePrice - The price without tax
 * @returns The state tax amount, rounded to 2 decimal places
 */
const calculateStateTax = (basePrice: number): number => {
    return basePrice * STATE_TAX_RATE;
};

/**
 * Calculate local tax amount from a base price
 * @param basePrice - The price without tax
 * @returns The local tax amount, rounded to 2 decimal places
 */
const calculateLocalTax = (basePrice: number): number => {
    return basePrice * LOCAL_TAX_RATE;
};

/**
 * Calculate total tax from a base price
 * @param basePrice - The price without tax
 * @returns The total tax amount (state + local), rounded to 2 decimal places
 */
const calculateTotalTax = (basePrice: number): number => {
    return calculateStateTax(basePrice) + calculateLocalTax(basePrice);
};

/**
 * Get all tax-related calculations in one object
 * @param price - The price (with tax)
 * @returns Object containing all tax-related calculations
 */
export const getTaxCalculations = (price: string | number) => {
    const totalPrice = typeof price === 'string' ? parseFloat(price) : price;
    const basePrice = calculateBasePrice(totalPrice);
    const stateTax = calculateStateTax(basePrice);
    const localTax = calculateLocalTax(basePrice);
    const totalTax = calculateTotalTax(basePrice);

    return {
        basePrice,
        stateTax,
        localTax,
        totalTax,
        totalWithTax: totalPrice,
        stateTaxRate: STATE_TAX_RATE,
        localTaxRate: LOCAL_TAX_RATE,
        totalTaxRate: TOTAL_TAX_RATE
    };
};
