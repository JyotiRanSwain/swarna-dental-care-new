// js/blog.js - Public Blog Handler
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkZTuOUM2n92DSQAb6cbtCOv02b2kvKFlA9AhfhIzaIi5pvhvTQQ_TbFA29fNb2_vDkQ/exec'; // Ensure your deployment URL is here

let allBlogs = [];
let currentBlogPage = 1;
const BLOGS_PER_PAGE = 10;

document.addEventListener('DOMContentLoaded', () => {
    fetchBlogs();
});

async function fetchBlogs() {
    const blogContainer = document.getElementById('blog-container') || document.getElementById('blogContainer');
    if (!blogContainer) return;

    try {
        blogContainer.innerHTML = `
            <div class="blog-loading" style="grid-column: 1/-1;">
                <i class="fas fa-spinner fa-spin"></i> Loading blog posts...
            </div>`;

        const response = await fetch(`${APPS_SCRIPT_URL}?action=getBlogs`);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            blogContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 2rem;">No blog posts found.</p>';
            return;
        }

        // Sort Descending by Date
        allBlogs = data.sort((a, b) => {
            const dateA = new Date(a['Date'] || a['Timestamp']);
            const dateB = new Date(b['Date'] || b['Timestamp']);
            return dateB - dateA;
        });

        currentBlogPage = 1;
        renderBlogPage();

    } catch (error) {
        console.error('Error fetching blogs:', error);
        blogContainer.innerHTML = `
            <div class="blog-error" style="grid-column: 1/-1;">
                <p>Failed to load blog posts. Please try again later.</p>
            </div>`;
    }
}

function renderBlogPage() {
    const blogContainer = document.getElementById('blog-container') || document.getElementById('blogContainer');
    const startIndex = (currentBlogPage - 1) * BLOGS_PER_PAGE;
    const paginatedBlogs = allBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);

    const cardsHtml = paginatedBlogs.map((blog, index) => {
        const globalIndex = startIndex + index;
        let formattedDate = formatDateDisplay(blog['Date'] || blog['Timestamp']);
        const imageSrc = blog['Image URL'] ? blog['Image URL'] : '../images/blog-placeholder.jpg';
        const title = blog['Title'] || 'Untitled Post';
        const description = blog['Description'] || '';
        const author = blog['Author Name'] || 'Dr. Sibarpita Sahu';

        // Short preview text (first 100 characters)
        const shortDesc = description.length > 120 ? description.substring(0, 120) + '...' : description;

        return `
            <article class="blog-card" data-aos="fade-up" style="cursor:pointer;" onclick="openBlogModal(${globalIndex})">
                <div class="blog-img-wrapper">
                    <img src="${imageSrc}" alt="${title}" onerror="this.onerror=null;this.src='../images/logo.png';">
                </div>
                <div class="blog-content">
                    <h3>${title}</h3>
                    <p>${shortDesc}</p>
                    <div class="blog-meta">
                        <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="far fa-user"></i> ${author}</span>
                    </div>
                    <span style="color: var(--primary, #7c3aed); font-weight: 600; display: inline-block; margin-top: 0.5rem;">Read More &rarr;</span>
                </div>
            </article>
        `;
    }).join('');

    // Pagination Controls
    const totalPages = Math.ceil(allBlogs.length / BLOGS_PER_PAGE);
    let paginationHtml = '';

    if (totalPages > 1) {
        paginationHtml = `
            <div class="blog-pagination">
                <button class="blog-page-btn" ${currentBlogPage === 1 ? 'disabled' : ''} onclick="changeBlogPage(${currentBlogPage - 1})">&laquo; Prev</button>
                ${Array.from({ length: totalPages }, (_, i) => `
                    <button class="blog-page-btn ${i + 1 === currentBlogPage ? 'active' : ''}" onclick="changeBlogPage(${i + 1})">${i + 1}</button>
                `).join('')}
                <button class="blog-page-btn" ${currentBlogPage === totalPages ? 'disabled' : ''} onclick="changeBlogPage(${currentBlogPage + 1})">Next &raquo;</button>
            </div>
        `;
    }

    blogContainer.innerHTML = cardsHtml + paginationHtml;

    if (typeof AOS !== 'undefined') AOS.refresh();
}

function changeBlogPage(newPage) {
    currentBlogPage = newPage;
    renderBlogPage();
    window.scrollTo({ top: document.getElementById('blog-container').offsetTop - 100, behavior: 'smooth' });
}

function openBlogModal(index) {
    const blog = allBlogs[index];
    if (!blog) return;

    const formattedDate = formatDateDisplay(blog['Date'] || blog['Timestamp']);
    const imageSrc = blog['Image URL'] ? blog['Image URL'] : '../images/blog-placeholder.jpg';

    const modalBody = document.getElementById('blogModalBody');
    modalBody.innerHTML = `
        <img src="${imageSrc}" class="blog-modal-img" alt="${blog['Title']}" onerror="this.onerror=null;this.src='../images/logo.png';">
        <h2 style="font-size: 1.4rem; color: #0f172a; margin-bottom: 0.5rem;">${blog['Title']}</h2>
        <div class="blog-modal-meta">
            <span><i class="far fa-calendar"></i> ${formattedDate}</span>
            <span><i class="far fa-user"></i> ${blog['Author Name'] || 'Dr. Sibarpita Sahu'}</span>
        </div>
        <p style="color: #475569; line-height: 1.6; font-size: 0.95rem; white-space: pre-line;">${blog['Description']}</p>
        
        <div class="blog-modal-cta">
            <h4>For more information or to book an appointment:</h4>
            <div class="cta-btn-group">
                <a href="tel:+918093974393" class="cta-btn cta-call"><i class="fas fa-phone-alt"></i> Call Now</a>
                <a href="https://wa.me/918093974393" target="_blank" class="cta-btn cta-whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
            </div>
        </div>
    `;

    document.getElementById('blogReadModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
    document.getElementById('blogReadModal').classList.remove('active');
    document.body.style.overflow = '';
}

function formatDateDisplay(rawDate) {
    if (!rawDate) return '';
    if (typeof rawDate === 'string' && rawDate.includes('-')) {
        const parts = rawDate.split('T')[0].split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return rawDate;
}