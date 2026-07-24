export const generateWhatsAppLink = (message, whatsappNumber) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/91${whatsappNumber || ''}?text=${encodedMessage}`;
};

export const generateServiceEnquiryLink = (serviceName, whatsappNumber) => {
  const message = `Hello Mouryan Tech Solutions,\n\nI would like to inquire about your ${serviceName} service.\n\nPlease provide more details.`;
  return generateWhatsAppLink(message, whatsappNumber);
};
