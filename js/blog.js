// ===== BLOG SYSTEM WITH GOOGLE SHEETS =====

// ⚠️ IMPORTANT: Replace with your actual Google Apps Script URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx0geZtV7WoEdMl1FbiJS0wB6CuKj3oef-kmWkaPPQDEHPLAZLgbWu9f3HnaUVATs9E/exec';

// Load blogs on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBlogs();
});

async function loadBlogs() {
    const container = document.getElementById('blog-container');
    if (!container) return;

    container.innerHTML = '<div class="blog-loading"><i class="fas fa-spinner fa-spin"></i> Loading blog posts...</div>';

    try {
        // Fetch from Google Apps Script
        const response = await fetch(APPS_SCRIPT_URL);
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const blogs = await response.json();
        displayBlogs(blogs);
    } catch (error) {
        console.warn('Waiting for blog data from Google Sheets...', error);
        setTimeout(() => {
            container.innerHTML = '<div style="text-align:center; padding:3rem; color:var(--text-light);"><i class="fas fa-inbox" style="font-size:3rem; margin-bottom:1rem;"></i><p>No blog posts yet. Check back soon!</p></div>';
        }, 1000);
    }
}

function formatDate(dateString) {
    // Handle ISO format: "2026-06-11T04:00:00.000Z" -> "06/11/2026"
    if (!dateString) return new Date().toLocaleDateString();
    
    if (dateString.includes('T')) {
        // ISO format
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        });
    }
    return dateString;
}

function displayBlogs(blogs) {
    const container = document.getElementById('blog-container');
    if (!container) return;

    if (!blogs || blogs.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:3rem; color:var(--text-light);"><i class="fas fa-inbox" style="font-size:3rem; margin-bottom:1rem;"></i><p>No blog posts found yet.</p></div>';
        return;
    }

    container.innerHTML = '';
    
    blogs.forEach((blog, index) => {
        // Handle Google Drive image URLs
        let imageUrl = blog['Image URL'] || blog.image || '';
        
        // If it's a Google Drive ID, convert to thumbnail URL
        if (blog['Google drive Image ID'] && !imageUrl) {
            const driveId = blog['Google drive Image ID'];
            imageUrl = `https://drive.google.com/thumbnail?id=${driveId}&sz=w400`;
        }

        const title = blog.Title || blog.title || '';
        const description = blog.Description || blog.description || 'No description available';
        let date = blog.Date || blog.date || new Date().toLocaleDateString();
        const author = blog['Author Name'] || blog.author || 'Swarna Dental Care';

        // Format date properly
        date = formatDate(date);

        // Only display if has valid title
        if (!title || title === 'Untitled') return;

        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('data-aos', 'fade-up');
        
        const blogStr = JSON.stringify(blog).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        
        card.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="blog-image" onerror="this.style.display='none';">` : ''}
            <div class="blog-content">
                <h3>${title}</h3>
                <p>${description.substring(0, 150)}${description.length > 150 ? '...' : ''}</p>
                <div class="blog-meta">
                    <small><i class="fas fa-calendar"></i> ${date}</small>
                    <small><i class="fas fa-user"></i> ${author}</small>
                </div>
                <a href="#" class="read-more" onclick="event.preventDefault(); showBlogModal(${blogStr})">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        `;

        container.appendChild(card);
    });

    // Reinitialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

function showBlogModal(blog) {
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.style.display = 'flex';
    
    let imageUrl = blog['Image URL'] || blog.image || '';
    if (blog['Google drive Image ID'] && !imageUrl) {
        const driveId = blog['Google drive Image ID'];
        imageUrl = `https://drive.google.com/thumbnail?id=${driveId}&sz=w400`;
    }

    const title = blog.Title || blog.title || 'Untitled';
    const description = blog.Description || blog.description || 'No description available';
    let date = blog.Date || blog.date || new Date().toLocaleDateString();
    const author = blog['Author Name'] || blog.author || 'Swarna Dental Care';

    date = formatDate(date);

    modal.innerHTML = `
        <div class="blog-modal-content" style="max-height: 80vh; overflow-y: auto;">
            <span class="blog-modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="width: 100%; border-radius: 8px; margin-bottom: 1.5rem;">` : ''}
            <h2>${title}</h2>
            <div style="display: flex; gap: 2rem; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-light); flex-wrap: wrap;">
                <span><i class="fas fa-calendar"></i> ${date}</span>
                <span><i class="fas fa-user"></i> ${author}</span>
            </div>
            <div style="line-height: 1.8; color: var(--text); margin-bottom: 2rem;">${description}</div>
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--light-dark);">
                <p style="margin-bottom: 1rem; font-weight: 600;">For more information or to book an appointment:</p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="tel:+918093974393" class="btn btn-primary">
                        <i class="fas fa-phone-alt"></i> Call Now
                    </a>
                    <a href="https://wa.me/918093974393" target="_blank" class="btn btn-secondary">
                        <i class="fas fa-whatsapp"></i> WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.blog-modal');
        modals.forEach(modal => modal.remove());
    }
});
