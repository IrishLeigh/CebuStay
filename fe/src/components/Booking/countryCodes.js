// countryCodes.js
const countryCodesWithPatterns = {
  '+1': {
    name: 'United States',
    pattern: /^\d{10}$/, // 10-digit phone number
  },
  '+44': {
    name: 'United Kingdom',
    pattern: /^\d{10}$/, // 10-digit phone number
  },
  '+63': {
    name: 'Philippines',
    pattern: /^\d{10}$/, // 10-digit mobile number
  },
  '+61': {
    name: 'Australia',
    pattern: /^\d{9}$/, // 9-digit phone number
  },
  '+91': {
    name: 'India',
    pattern: /^\d{10}$/, // 10-digit mobile number
  },
  // Add more country codes and patterns as needed
};

export default countryCodesWithPatterns;
