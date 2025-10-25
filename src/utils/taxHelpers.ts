// Tax rates (adjust these as needed)
const STATE_TAX_RATE = 0.06; // 6% Vermont state tax
const LOCAL_TAX_RATE = 0.01;  // 1% Local option tax
const TOTAL_TAX_RATE = STATE_TAX_RATE + LOCAL_TAX_RATE; // 7% combined

/**
 * Calculate the base price (price without tax) from a total price
 * @param totalPrice - The total price including tax (as string or number)
 * @returns The price without tax, rounded to 2 decimal places
 */
export const calculatePriceWithoutTax = (totalPrice: string | number): number => {
    const price = typeof totalPrice === 'string' ? parseFloat(totalPrice) : totalPrice;
    const priceWithoutTax = price / (1 + TOTAL_TAX_RATE);
    return Number(priceWithoutTax.toFixed(2));
};

/**
 * Calculate state tax amount from a base price
 * @param basePrice - The price without tax
 * @returns The state tax amount, rounded to 2 decimal places
 */
export const calculateStateTax = (basePrice: number): number => {
    return Number((basePrice * STATE_TAX_RATE).toFixed(2));
};

/**
 * Calculate local tax amount from a base price
 * @param basePrice - The price without tax
 * @returns The local tax amount, rounded to 2 decimal places
 */
export const calculateLocalTax = (basePrice: number): number => {
    return Number((basePrice * LOCAL_TAX_RATE).toFixed(2));
};

/**
 * Calculate total tax from a base price
 * @param basePrice - The price without tax
 * @returns The total tax amount (state + local), rounded to 2 decimal places
 */
export const calculateTotalTax = (basePrice: number): number => {
    return calculateStateTax(basePrice) + calculateLocalTax(basePrice);
};

/**
 * Calculate total price with tax from a base price
 * @param basePrice - The price without tax
 * @returns The total price including tax, rounded to 2 decimal places
 */
export const calculateTotalWithTax = (basePrice: number): number => {
    return Number((basePrice * (1 + TOTAL_TAX_RATE)).toFixed(2));
};

/**
 * Get all tax-related calculations in one object
 * @param price - The price (with or without tax)
 * @param isPriceWithTax - Whether the provided price includes tax (default: true)
 * @returns Object containing all tax-related calculations
 */
export const getTaxCalculations = (price: string | number, isPriceWithTax: boolean = true) => {
    const basePrice = isPriceWithTax 
        ? calculatePriceWithoutTax(price)
        : typeof price === 'string' ? parseFloat(price) : price;
        
    const stateTax = calculateStateTax(basePrice);
    const localTax = calculateLocalTax(basePrice);
    const totalTax = calculateTotalTax(basePrice);
    const totalWithTax = calculateTotalWithTax(basePrice);

    return {
        basePrice: Number(basePrice.toFixed(2)),
        stateTax,
        localTax,
        totalTax,
        totalWithTax,
        stateTaxRate: STATE_TAX_RATE,
        localTaxRate: LOCAL_TAX_RATE,
        totalTaxRate: TOTAL_TAX_RATE
    };
};
