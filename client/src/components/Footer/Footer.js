import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div>
      <div className="footer-container">
        <div className="footer-inner">
          <div className="footer-content">

            <div className="footer-column">
              <h1 className="footer-heading">Customer Care</h1>
              <ul className="footer-list">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>Products Return</li>
                <li>Wholesale Policy</li>
              </ul>
            </div>

            <div className="footer-column">
              <h1 className="footer-heading">Quick Shop</h1>
              <ul className="footer-list">
                <li>Pagination</li>
                <li>Terms & Conditions</li>
                <li>Contact</li>
                <li>Accessories</li>
                <li>Term of Use</li>
              </ul>
            </div>

            <div className="footer-column">
              <h1 className="footer-heading">Company</h1>
              <ul className="footer-list">
                <li>Help Center</li>
                <li>Address Store</li>
                <li>Privacy Policy</li>
                <li>Receivers & Amplifiers</li>
                <li>Store Locations</li>
              </ul>
            </div>

          </div>
        </div>
      </div>


    </div>
  )
}

export default Footer
