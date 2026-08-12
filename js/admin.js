const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkZTuOUM2n92DSQAb6cbtCOv02b2kvKFlA9AhfhIzaIi5pvhvTQQ_TbFA29fNb2_vDkQ/exec';
const token = localStorage.getItem("sdc_token");

if (!token && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("sdc_token");
    window.location.href = "login.html";
}

// Tab Switcher
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');

    if (tabName === 'allBlogs') loadAllBlogs();
    if (tabName === 'appointments') loadAppointments();
}

// Global state for appointments pagination
let allAppointments = [];
let filteredAppointments = [];
let currentPage = 1;
const pageSize = 20;

async function loadAppointments() {
    const tbody = document.getElementById("apptsBody");
    if (!tbody) return;

    try {
        tbody.innerHTML = '<tr><td colspan="9">Loading appointments...</td></tr>';
        const res = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: "getAppointments", token })
        });
        const data = await res.json();

        if (data.success) {
            allAppointments = data.appointments;
            applyAppointmentFilter();
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="9">Failed to load appointments.</td></tr>';
    }
}

// Filter appointments by search query and date
function applyAppointmentFilter() {
    const searchVal = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
    const filterDate = document.getElementById("filterDate")?.value || "";

    filteredAppointments = allAppointments.filter(a => {
        const matchesSearch = !searchVal || 
            (a.bookingId && a.bookingId.toLowerCase().includes(searchVal)) ||
            (a.fullName && a.fullName.toLowerCase().includes(searchVal)) ||
            (a.mobile && String(a.mobile).toLowerCase().includes(searchVal));

        const matchesDate = !filterDate || (a.date === filterDate || (a.bookedOn && a.bookedOn.startsWith(filterDate)));

        return matchesSearch && matchesDate;
    });

    currentPage = 1;
    renderAppointmentsTable();
}

function clearFilters() {
    if (document.getElementById("searchInput")) document.getElementById("searchInput").value = "";
    if (document.getElementById("filterDate")) document.getElementById("filterDate").value = "";
    applyAppointmentFilter();
}

// Render formatted appointment table
function renderAppointmentsTable() {
    const tbody = document.getElementById("apptsBody");
    if (!tbody) return;

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = filteredAppointments.slice(startIndex, startIndex + pageSize);

    if (paginatedItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem;">No appointment records found.</td></tr>';
        document.getElementById("pageInfo").innerText = "Page 0 of 0";
        return;
    }

    tbody.innerHTML = paginatedItems.map(a => `
        <tr>
            <td><b style="color:#0284c7;">${a.bookingId}</b></td>
            <td><small style="color:#64748b; line-height: 1.4; display: block;">${a.bookedOn ? a.bookedOn.replace(' ', '<br>') : 'N/A'}</small></td>
            <td style="line-height: 1.5;">
                <strong style="color:#0f172a;">${a.fullName}</strong><br>
                <small style="color:#475569;">
                    ${a.gender || ''}${a.gender && a.age ? ', ' : ''}${a.age ? a.age + ' yrs' : ''}<br>
                    📞 <a href="tel:${a.mobile}" style="color:#0284c7; text-decoration:none;">${a.mobile}</a><br>
                    ${a.email ? '✉️ ' + a.email + '<br>' : ''}
                    📍 ${a.address}
                </small>
            </td>
            <td>
                <b style="color:#0f172a;">${a.date}</b><br>
                <small style="color:#0284c7;">${a.slot}</small>
            </td>
            <td>
                <small>
                    <b>Visit:</b> ${a.visitType}<br>
                    <b>Duration:</b> ${a.duration}
                </small>
            </td>
            <td>
                <small style="line-height: 1.4; display: block;">
                    <b>Problem:</b> ${a.problem}<br>
                    <span style="color:#e11d48;"><b>Pain:</b> ${a.painLevel}</span>
                </small>
            </td>
            <td>
                <span style="font-weight:600; color:${a.status === 'Confirmed' ? '#16a34a' : a.status === 'Cancelled' ? '#dc2626' : '#d97706'};">
                    ${a.status}
                </span>
                ${a.reason ? `<br><small style="color:#dc2626;">${a.reason}</small>` : ''}
            </td>
            <td>
                <select onchange="updateStatus(${a.rowIndex}, this.value)" style="padding: 0.4rem; border-radius:6px; font-size:0.8rem; border:1px solid #cbd5e1;">
                    <option value="">Action</option>
                    <option value="Confirmed">Confirm</option>
                    <option value="Cancelled">Cancel</option>
                    <option value="Completed">Completed</option>
                </select>
            </td>
        </tr>
    `).join('');

    const totalPages = Math.ceil(filteredAppointments.length / pageSize);
    document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${totalPages} (${filteredAppointments.length} entries)`;
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage >= totalPages || totalPages === 0;
}

function clearDateFilter() {
    document.getElementById("filterDate").value = "";
    applyAppointmentFilter();
}

function renderAppointmentsTable() {
    const tbody = document.getElementById("apptsBody");
    if (!tbody) return;

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = filteredAppointments.slice(startIndex, startIndex + pageSize);

    if (paginatedItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem;">No appointment records found.</td></tr>';
        document.getElementById("pageInfo").innerText = "Page 0 of 0";
        return;
    }

    tbody.innerHTML = paginatedItems.map(a => `
        <tr>
            <td><b style="color:#0284c7;">${a.bookingId}</b></td>
            <td><small style="color:#64748b; line-height: 1.4; display: block;">${a.bookedOn ? a.bookedOn.replace(' ', '<br>') : 'N/A'}</small></td>
            <td style="line-height: 1.5;">
                <strong style="color:#0f172a;">${a.fullName}</strong><br>
                <small style="color:#475569;">
                    ${a.gender || ''}${a.gender && a.age ? ', ' : ''}${a.age ? a.age + ' yrs' : ''}<br>
                    📞 <a href="tel:${a.mobile}" style="color:#0284c7; text-decoration:none;">${a.mobile}</a><br>
                    ${a.email ? '✉️ ' + a.email + '<br>' : ''}
                    📍 ${a.address}
                </small>
            </td>
            <td>
                <b style="color:#0f172a;">${a.date}</b><br>
                <small style="color:#0284c7;">${a.slot}</small>
            </td>
            <td>
                <small>
                    <b>Visit:</b> ${a.visitType}<br>
                    <b>Duration:</b> ${a.duration}
                </small>
            </td>
            <td>
                <small style="line-height: 1.4; display: block;">
                    <b>Problem:</b> ${a.problem}<br>
                    <span style="color:#e11d48;"><b>Pain Level:</b> ${a.painLevel}</span><br>
                    <span style="color:#64748b;"><b>Medical:</b> ${a.medicalConditions}</span>
                </small>
            </td>
            <td>
                <span style="font-weight:600; color:${a.status === 'Confirmed' ? '#16a34a' : a.status === 'Cancelled' ? '#dc2626' : '#d97706'};">
                    ${a.status}
                </span>
                ${a.reason ? `<br><small style="color:#dc2626;">${a.reason}</small>` : ''}
            </td>
            <td>
                <select onchange="updateStatus(${a.rowIndex}, this.value)" style="padding: 0.4rem; border-radius:6px; font-size:0.8rem; border:1px solid #cbd5e1;">
                    <option value="">Action</option>
                    <option value="Confirmed">Confirm</option>
                    <option value="Cancelled">Cancel</option>
                    <option value="Completed">Completed</option>
                </select>
            </td>
        </tr>
    `).join('');

    const totalPages = Math.ceil(filteredAppointments.length / pageSize);
    document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${totalPages} (${filteredAppointments.length} entries)`;
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage >= totalPages || totalPages === 0;
}

function changePage(direction) {
    currentPage += direction;
    renderAppointmentsTable();
}

async function updateStatus(rowIndex, status) {
    if (!status) return;

    let reason = "";
    if (status === "Cancelled") {
        reason = prompt("Please enter the cancellation reason (Sent to patient via email):");
        if (reason === null) return;
    }

    const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ 
            action: "updateAppointmentStatus", 
            token, 
            payload: { rowIndex, status, reason } 
        })
    });

    const data = await res.json();
    if (data.success) {
        alert("Status updated successfully!");
        loadAppointments();
    }
}

// Blog Management Functions
async function loadAllBlogs() {
    const tbody = document.getElementById("blogsBody");
    tbody.innerHTML = '<tr><td colspan="5">Loading blogs...</td></tr>';

    const res = await fetch(`${APPS_SCRIPT_URL}?action=getBlogs`);
    const blogs = await res.json();

    if (!Array.isArray(blogs) || blogs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No blog posts found.</td></tr>';
        return;
    }

    tbody.innerHTML = blogs.map(b => `
        <tr>
            <td><img src="${b['Image URL'] || '../images/blog-placeholder.jpg'}" width="50" height="50" style="object-fit:cover; border-radius:4px;"></td>
            <td>${b['Date']}</td>
            <td><b>${b['Title']}</b></td>
            <td>${b['Author Name']}</td>
            <td>
                <button class="btn btn-secondary" onclick="editBlogPrompt(${b.rowIndex}, '${encodeURIComponent(b['Title'])}', '${encodeURIComponent(b['Description'])}', '${encodeURIComponent(b['Author Name'])}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteBlog(${b.rowIndex})">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function editBlogPrompt(rowIndex, encTitle, encDesc, encAuthor) {
    const currentTitle = decodeURIComponent(encTitle);
    const currentDesc = decodeURIComponent(encDesc);
    const currentAuthor = decodeURIComponent(encAuthor);

    const newTitle = prompt("Update Title:", currentTitle);
    if (newTitle === null) return;

    const newDesc = prompt("Update Description:", currentDesc);
    if (newDesc === null) return;

    const newAuthor = prompt("Update Author Name:", currentAuthor);
    if (newAuthor === null) return;

    const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "editBlog",
            token,
            payload: { rowIndex, title: newTitle, description: newDesc, author: newAuthor }
        })
    });

    const data = await res.json();
    if (data.success) {
        alert("Blog updated!");
        loadAllBlogs();
    }
}

async function deleteBlog(rowIndex) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "deleteBlog", token, payload: { rowIndex } })
    });

    const data = await res.json();
    if (data.success) {
        alert("Blog deleted!");
        loadAllBlogs();
    }
}

async function handleAddBlog(e) {
    e.preventDefault();
    const btn = document.getElementById("blogBtn");
    btn.disabled = true;

    const file = document.getElementById("blogFile").files[0];
    let imageBase64 = null;

    if (file) {
        imageBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    const payload = {
        title: document.getElementById("blogTitle").value,
        description: document.getElementById("blogDesc").value,
        author: document.getElementById("blogAuthor").value,
        imageBase64
    };

    const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "addBlog", token, payload })
    });
    const data = await res.json();

    if (data.success) {
        alert("Blog Published!");
        location.reload();
    } else {
        alert("Failed: " + data.message);
    }
    btn.disabled = false;
}