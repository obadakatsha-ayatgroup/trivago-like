export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const isFutureDate = (date: Date): boolean => {
  return isValidDate(date) && date > new Date();
};

export const isValidBookingDates = (checkIn: Date, checkOut: Date): boolean => {
  return (
    isValidDate(checkIn) &&
    isValidDate(checkOut) &&
    isFutureDate(checkIn) &&
    checkOut > checkIn
  );
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isValidCreditCard = (cardNumber: string): boolean => {
  // Simple Luhn algorithm check
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};