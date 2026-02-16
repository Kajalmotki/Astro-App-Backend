import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, User, Calendar, X } from 'lucide-react';
import { blogs } from '../data/blogs';
import './BlogsPage.css';

const BlogsPage = () => {
    const navigate = useNavigate();
    const [selectedBlog, setSelectedBlog] = useState(null);

    return (
        <div className="blogs-page-container" style={{ background: '#0a0a15', minHeight: '100vh', padding: '20px', color: 'white', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer' }}>
                    <ArrowLeft size={28} />
                </button>
                <h1 style={{ marginLeft: '15px', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Cosmic Wisdom
                </h1>
            </header>

            {/* Blog List */}
            <div className="blogs-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {blogs.map(blog => (
                    <div
                        key={blog.id}
                        onClick={() => setSelectedBlog(blog)}
                        className="blog-card"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                    >
                        <div style={{ height: '160px', overflow: 'hidden' }}>
                            <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '20px' }}>
                            <span style={{ color: '#FFD700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{blog.category}</span>
                            <h3 style={{ margin: '10px 0', fontSize: '1.2rem', fontWeight: '600' }}>{blog.title}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.5' }}>{blog.excerpt}</p>

                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                <User size={14} style={{ marginRight: '5px' }} /> {blog.author}
                                <span style={{ margin: '0 10px' }}>•</span>
                                <Calendar size={14} style={{ marginRight: '5px' }} /> {blog.date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Blog Detail Modal */}
            {selectedBlog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(10, 10, 20, 0.98)', zIndex: 2000, overflowY: 'auto',
                    padding: '20px', boxSizing: 'border-box'
                }}>
                    <button
                        onClick={() => setSelectedBlog(null)}
                        style={{ position: 'fixed', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ maxWidth: '800px', margin: '40px auto 80px' }}>
                        <span style={{ color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>{selectedBlog.category}</span>
                        <h1 style={{ fontSize: '2rem', marginTop: '10px', marginBottom: '20px', lineHeight: '1.2' }}>{selectedBlog.title}</h1>

                        <img
                            src={selectedBlog.image}
                            alt={selectedBlog.title}
                            style={{ width: '100%', borderRadius: '20px', marginBottom: '30px', border: '1px solid rgba(255,215,0,0.2)' }}
                        />

                        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-line' }}>
                            {selectedBlog.content}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogsPage;
