import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import './AstroStore.css';

const AstroStore = ({ isOpen, onClose }) => {
    const [cart, setCart] = useState([]);

    const products = [
        {
            id: 1,
            name: 'Tibetan Singing Bowl',
            price: 899,
            description: 'Authentic handcrafted Tibetan singing bowl for meditation and relaxation.',
            image: '🥣',
            category: 'Wellness'
        },
        {
            id: 2,
            name: 'Premium Yoga Mat',
            price: 699,
            description: 'Non-slip eco-friendly yoga mat for your daily practice.',
            image: '🧘',
            category: 'Fitness'
        }
    ];

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const getTotalPrice = () => {
        return cart.reduce((sum, item) => sum + item.price, 0);
    };

    if (!isOpen) return null;

    return (
        <div className="store-overlay">
            <div className="store-modal">
                {/* Header */}
                <div className="store-header">
                    <h1 className="store-title">The AstroRevo Store</h1>
                    <button className="store-close-btn" onClick={onClose}>
                        <X size={28} />
                    </button>
                </div>

                {/* Products Grid */}
                <div className="store-content">
                    <div className="products-section">
                        <h2 className="section-title">Featured Products</h2>
                        <div className="products-grid">
                            {products.map((product) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image-container">
                                        <span className="product-emoji">{product.image}</span>
                                    </div>
                                    <div className="product-info">
                                        <p className="product-category">{product.category}</p>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-footer">
                                            <span className="product-price">₹{product.price}</span>
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => addToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart Section */}
                    {cart.length > 0 && (
                        <div className="cart-section">
                            <h2 className="section-title">
                                <ShoppingCart size={20} /> Shopping Cart ({cart.length})
                            </h2>
                            <div className="cart-items">
                                {cart.map((item, index) => (
                                    <div key={index} className="cart-item">
                                        <div className="cart-item-info">
                                            <span className="cart-item-emoji">{item.image}</span>
                                            <div>
                                                <p className="cart-item-name">{item.name}</p>
                                                <p className="cart-item-price">₹{item.price}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-summary">
                                <div className="total-row">
                                    <span>Total</span>
                                    <span className="total-price">₹{getTotalPrice()}</span>
                                </div>
                                <button className="checkout-btn">Proceed to Checkout</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AstroStore;
