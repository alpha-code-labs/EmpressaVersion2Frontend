import React from 'react';
import './ReturnsPolicy.css';

const ReturnsPolicyPage = () => {
  return (
    <div className="returns-policy-container">
      <div className="returns-policy-content">
        <h1>Return and Refund Policy</h1>
        <h2>Effective Date: 01/01/2025</h2>
        
        <p>
          At Empressa, we strive to ensure customer satisfaction with every purchase. 
          If you are not completely satisfied with your order, please review our 
          Return and Refund Policy below.
        </p>
        
        <section>
          <h3>1. Return Policy</h3>
          <ul>
            <li>Items are eligible for return within <strong>7 days</strong> from the date of delivery.</li>
            <li>Products must be unused, in their original packaging, and with all tags attached.</li>
            <li>Returns are not accepted for final sale items, customized products, or personal care items.</li>
            <li>Customers are responsible for return shipping costs unless the item received is defective or incorrect.</li>
            <li>To initiate a return, contact our customer support team at <a href="mailto:fashionempressa@gmail.com">fashionempressa@gmail.com</a> with your order details.</li>
            <li>Once approved, you will receive instructions on how to return the item.</li>
            <li>Returns must be shipped within <strong>7 days</strong> of approval.</li>
          </ul>
        </section>
        
        <section>
          <h3>2. Refund Policy</h3>
          <ul>
            <li>Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.</li>
            <li>If approved, refunds will be processed within <strong>5 business days</strong> to the original payment method or as store credit.</li>
            <li>Shipping fees are non-refundable unless the return is due to our error.</li>
            <li>Partial refunds may be issued for items that do not meet return conditions.</li>
            <li>If you haven't received your refund within the stated period, please contact us.</li>
          </ul>
        </section>
        
        <section>
          <h3>3. Exchanges</h3>
          <ul>
            <li>Exchanges are available for defective or damaged items only.</li>
            <li>If you need to exchange an item, contact our customer support team within <strong>7 days</strong> of delivery.</li>
          </ul>
        </section>
        
        <section>
          <h3>4. Cancellations</h3>
          <ul>
            <li>Orders can be canceled within <strong>24 hours</strong> of placement if they have not been shipped.</li>
            <li>Once an order is processed, it cannot be canceled, but it may be eligible for return.</li>
          </ul>
        </section>
        
        <section>
          <h3>5. Contact Us</h3>
          <p>
            For any return, refund, or exchange inquiries, please contact us at{' '}
            <a href="mailto:fashionempressa@gmail.com">
              fashionempressa@gmail.com
            </a>
            . Our team is happy to assist you!
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReturnsPolicyPage;
