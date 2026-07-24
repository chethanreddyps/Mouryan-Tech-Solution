import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '../context/ContentContext';

const SEO = ({ title, description, keywords, url = '' }) => {
  const { companyInfo } = useContent();
  const companyName = companyInfo.name || 'Mouryan Tech Solutions';
  const siteTitle = `${title} | ${companyName}`;
  const siteUrl = `https://mouryantechsolutions.com${url}`; // Placeholder URL
  const logoUrl = `https://mouryantechsolutions.com/logo.png`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description || companyInfo.description} />
      <meta name="keywords" content={keywords || 'IT solutions Bengaluru, laptop repair, CCTV installation'} />
      <meta name="author" content={companyName} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || companyInfo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={logoUrl} />
      <meta property="og:image:alt" content={`${companyName} logo`} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description || companyInfo.description} />
      <meta name="twitter:image" content={logoUrl} />

      {/* Canonical */}
      <link rel="canonical" href={siteUrl} />
    </Helmet>
  );
};

export default SEO;
