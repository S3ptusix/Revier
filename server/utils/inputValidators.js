import validator from 'validator';

// PASSWORD VALIDATION
export const validatePassword = (password) => {

    if (!password.trim()) {
        return 'Password is required';
    }
    if (!validator.isLength(password, { min: 8 })) {
        return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character';
    }

    return null;
};

// EMAIL VALIDATION
export const validateEmail = (email) => {
    return validator.isEmail(email);
}

export const validateOtp = (otp) => /^\d{6}$/.test(otp);

export const isValidLinkedInUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company|school|posts|jobs)\/[A-Za-z0-9-_./%]+\/?$/i;
    return pattern.test(url);
};

export const isValidPHPhone = (num) => {
    if (!num) return false;

    // Remove spaces, hyphens, parentheses
    const cleaned = num.replace(/[\s-()]/g, "");

    // Normalize to "09xxxxxxxxx"
    let normalized = cleaned;

    if (cleaned.startsWith("+63")) {
        normalized = "0" + cleaned.slice(3);
    } else if (cleaned.startsWith("63")) {
        normalized = "0" + cleaned.slice(2);
    }

    // After normalization, it must match: 09xxxxxxxxx
    const pattern = /^09\d{9}$/;

    return pattern.test(normalized);
};

export const isValidFormArrayWithType = (formArray, schema) => {
    if (!Array.isArray(formArray)) return false;

    return formArray.every(item => {
        if (typeof item !== 'object' || item === null) return false;

        return Object.entries(schema).every(([key, type]) => {
            return item.hasOwnProperty(key) && typeof item[key] === type;
        });
    });
};


export const isArrayofNumbers = (arr) => {
    return Array.isArray(arr) && arr.every(n => Number.isInteger(n) && n > 0);
};

export const validAdminRole = (role) => {
    return ['HR Manager', 'HR Associate'].includes(role);
}

export const countCharacters = (str) => {
  if (!str) return 0;

  return str.replace(/[\s\n]/g, "").length;
}
