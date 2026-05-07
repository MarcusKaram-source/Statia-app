import emailjs from 'emailjs-com';

// EmailJS Configuration
// Get your credentials from https://www.emailjs.com/
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_7f3praf';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_ppapxva';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '_xTAUYdP5lA08s6YX';

// Email configuration
const RECIPIENT_EMAIL = 'info@statiarealestate.net';

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

/**
 * Send email using EmailJS
 * @param {Object} templateParams - Parameters to send in the email template
 * @returns {Promise} - Promise that resolves when email is sent
 */
export async function sendEmail(templateParams) {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );
    return { success: true, data: response };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send contact form email
 * @param {Object} formData - Form data including name, email, phone, message
 * @returns {Promise} - Promise that resolves when email is sent
 */
export async function sendContactEmail(formData) {
  const templateParams = {
    to_email: RECIPIENT_EMAIL,
    to_name: 'Statia Team',
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone || '',
    message: formData.message,
    reply_to: formData.email,
  };

  return sendEmail(templateParams);
}

/**
 * Send lead notification email
 * @param {Object} leadData - Lead data including name, email, phone, project, message
 * @returns {Promise} - Promise that resolves when email is sent
 */
export async function sendLeadEmail(leadData) {
  const templateParams = {
    to_email: RECIPIENT_EMAIL,
    to_name: 'Statia Sales Team',
    from_name: leadData.name,
    from_email: leadData.email,
    phone: leadData.phone || '',
    project: leadData.project || 'General Enquiry',
    message: leadData.message || '',
    reply_to: leadData.email,
  };

  return sendEmail(templateParams);
}

export default emailjs;
