import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-content">
        <h1>Privacy Policy</h1>
        <h2>Effective Date: 01/01/2025</h2>
        
        <p>
          Empressa ("we," "our," or "us") values your privacy and is committed to 
          protecting your personal information. This Privacy Policy outlines how we 
          collect, use, and safeguard your data when you interact with our website, 
          mobile applications, and services.
        </p>
        
        <section>
          <h3>1. Information We Collect</h3>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name, email address, phone number, 
              billing/shipping address, and payment details.
            </li>
            <li>
              <strong>Non-Personal Information:</strong> Browser type, device information, 
              IP address, and browsing behavior.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> To enhance user 
              experience and analyze website traffic.
            </li>
          </ul>
        </section>
        
        <section>
          <h3>2. How We Use Your Information</h3>
          <p>We use your information to:</p>
          <ul>
            <li>Process and fulfill orders.</li>
            <li>Provide customer support.</li>
            <li>Personalize user experience.</li>
            <li>Improve our products and services.</li>
            <li>Send promotional materials, with your consent.</li>
          </ul>
        </section>
        
        <section>
          <h3>3. Data Protection and Security</h3>
          <p>
            We implement industry-standard security measures to protect your personal 
            data from unauthorized access, alteration, or disclosure.
          </p>
        </section>
        
        <section>
          <h3>4. Third-Party Sharing</h3>
          <p>
            We do not sell or rent your personal data. However, we may share 
            information with third parties for:
          </p>
          <ul>
            <li>Payment processing.</li>
            <li>Order fulfillment.</li>
            <li>Analytics and marketing (with consent where required).</li>
          </ul>
        </section>
        
        <section>
          <h3>5. Your Rights and Choices</h3>
          <ul>
            <li>You can request access, correction, or deletion of your personal data.</li>
            <li>You can opt-out of marketing communications at any time.</li>
          </ul>
        </section>
        
        <section>
          <h3>6. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy periodically. Changes will be posted on 
            this page with an updated effective date.
          </p>
        </section>
        
        <section>
          <h3>7. Contact Us</h3>
          <p>
            For any questions regarding this Privacy Policy, contact us at{' '}
            <a href="mailto:empressafashion@empressafashion.com">
              empressafashion@empressafashion.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
