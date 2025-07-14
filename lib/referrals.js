// Referral tracking logic 
export const generateReferralLink = (userId, contentId) => {
    return `${window.location.origin}/content/${contentId}?ref=${userId}`;
  };
  