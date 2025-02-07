import { useState } from "react";
import './paymentform.css';
const PaymentForm = () => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiration: '',
        cvc: '',
        nameOnCard: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Payment Details:', formData);
    };

    return (
        <div className="payment-container">
            <h2>Your Orders</h2>
            <div className="order-summary">
                <div className="album-art"></div>
                <div className="order-information">
                    <div className="order-details">
                        <p><strong>Song:</strong></p>
                        <p><strong>Artists:</strong></p>
                        <p><strong>Released Date:</strong></p>
                        <p><strong>Album/Single:</strong></p>
                    </div>
                    <div className="order-pricing">
                        <p>Sub total</p>
                        <p>Total due:</p>
                    </div>
                </div>
            </div>

            <div className="payment-options">
                <button className="pay-button apple-pay">Pay with  Pay</button>
                <button className="pay-button google-pay">Buy with G Pay</button>
            </div>

            <p className="divider">or pay with card</p>

            <form onSubmit={handleSubmit} className="card-form">
                <label>Card Number</label>
                <input className="input-info"
                    type="text"
                    name="cardNumber"
                    placeholder="4242 XXXX XXXX XXXX"
                    value={formData.cardNumber}
                    onChange={handleChange}
                />

                <label>Expiration</label>
                <input className="input-info"
                    type="text"
                    name="expiration"
                    placeholder="MM/YY"
                    value={formData.expiration}
                    onChange={handleChange}
                />

                <label>CVC</label>
                <input className="input-info"
                    type="text"
                    name="cvc"
                    placeholder="123"
                    value={formData.cvc}
                    onChange={handleChange}
                />

                <label>Name on Card</label>
                <input className="input-info"
                    type="text"
                    name="nameOnCard"
                    placeholder="Full Name"
                    value={formData.nameOnCard}
                    onChange={handleChange}
                />

                <button type="submit" className="submit-button">Pay</button>
            </form>
        </div>
    );
};

export default PaymentForm;