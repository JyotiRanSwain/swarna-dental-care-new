// ===== SWABOOT CHATBOT =====
(function () {
    const QA = [
        {
            patterns: ["appointment", "book", "schedule", "visit", "reserve"],
            answer: "You can book an appointment easily! 📅 Fill the online form: <a href='https://forms.gle/AhPmukqKpe9QDpXF7' target='_blank' style='color:var(--primary);font-weight:600'>Click here to Book</a>, or call us at <a href='tel:+918093974393' style='color:var(--primary);font-weight:600'>+91 80939 74393</a>."
        },
        {
            patterns: ["tooth pain", "toothache", "pain", "ache", "hurts"],
            answer: "Tooth pain should not be ignored! 😟 Please call us immediately at <a href='tel:+918093974393' style='color:var(--primary);font-weight:600'>+91 80939 74393</a>. We offer painless treatments!"
        },
        {
            patterns: ["whitening", "whiten", "bright", "stain"],
            answer: "We offer professional teeth whitening! 😁 Modern whitening treatments give visible results. Book a consultation for details!"
        },
        {
            patterns: ["cleaning", "scale", "polish", "hygiene", "checkup"],
            answer: "We recommend professional cleaning every 6 months! 🌟 Our advanced scaling and polishing keeps your teeth healthy!"
        },
        {
            patterns: ["cavity", "filling", "decay", "hole"],
            answer: "Cavities are treated with tooth-coloured composite fillings. 🦷 The procedure is quick and virtually painless!"
        },
        {
            patterns: ["root canal", "pulp", "infection", "rct"],
            answer: "Root canal treatment removes infected pulp and saves your natural tooth. 💊 Modern techniques make it comfortable!"
        },
        {
            patterns: ["implant", "missing tooth", "replace", "gap"],
            answer: "Dental implants are the best solution for missing teeth! 🦷 They look and function like natural teeth and can last a lifetime!"
        },
        {
            patterns: ["hours", "open", "timing", "schedule"],
            answer: "🕘 Our Clinic Hours:<br>• Mon – Sat: 10:00 AM – 1:00 PM & 5:00 PM – 8:00 PM<br>• Sunday: 10:00 AM – 1:00 PM"
        },
        {
            patterns: ["location", "address", "where", "directions"],
            answer: "📍 Nilima Complex, Plot No. 988<br>Near Delta Square, Baramunda<br>Bhubaneswar – 751003<br><a href='https://maps.app.goo.gl/rAGBcvqvvve7DV9r6' target='_blank' style='color:var(--primary);font-weight:600'>Get Directions</a>"
        },
        {
            patterns: ["doctor", "dentist", "dr", "sibarpita"],
            answer: "Our clinic is led by <strong>Dr. Sibarpita Subhadarshi Sahu</strong> 👩‍⚕️<br>• BDS from S.O.A University<br>• Registration No: 1567A<br>Trusted by 2500+ patients since 2016!"
        },
        {
            patterns: ["whatsapp", "message", "contact", "reach"],
            answer: "You can reach us via:<br>📞 Call: <a href='tel:+918093974393' style='color:var(--primary);font-weight:600'>+91 80939 74393</a><br>💬 WhatsApp: <a href='https://wa.me/918093974393' target='_blank' style='color:var(--primary);font-weight:600'>Chat on WhatsApp</a>"
        },
        {
            patterns: ["hi", "hello", "hey", "namaste", "hii"],
            answer: "Namaste! 🙏 Welcome to Swarna Dental Care. I'm Swaboot, your dental assistant. How can I help you today? 😊"
        },
        {
            patterns: ["thank", "thanks", "appreciate"],
            answer: "You're most welcome! 😊 We're always happy to help. Visit us at Swarna Dental Care! 🦷"
        },
        {
            patterns: ["bye", "goodbye", "see you"],
            answer: "Goodbye! 👋 Take care and remember to brush twice daily! 😁"
        }
    ];

    const QUICK_REPLIES = [
        { label: "📅 Book Appointment", key: "appointment" },
        { label: "🕘 Clinic Hours", key: "hours" },
        { label: "📍 Location", key: "location" },
        { label: "☎️ Contact Us", key: "whatsapp" }
    ];

    const launcher = document.getElementById('swabootLauncher');
    const window_ = document.getElementById('swabootWindow');
    const closeBtn = document.getElementById('swabootClose');
    const messages = document.getElementById('swabootMessages');
    const input = document.getElementById('swabootInput');
    const sendBtn = document.getElementById('swabootSend');
    const badge = document.getElementById('swabootBadge');

    let isOpen = false;
    let greeted = false;

    function toggle() {
        isOpen = !isOpen;
        window_?.classList.toggle('swaboot-visible', isOpen);
        launcher?.classList.toggle('swaboot-open', isOpen);
        if (isOpen) {
            badge.style.display = 'none';
            if (!greeted) {
                greeted = true;
                greet();
            }
            setTimeout(() => input?.focus(), 300);
        }
    }

    launcher?.addEventListener('click', toggle);
    closeBtn?.addEventListener('click', toggle);

    function greet() {
        addBotBubble("Namaste! 🙏 I'm <strong>Swaboot</strong>, your Swarna Dental Care assistant. How can I help you today?", true);
    }

    function addBotBubble(html, showQR = false) {
        const row = document.createElement('div');
        row.className = 'swaboot-row swaboot-row-bot';
        row.innerHTML = `
            <div class="swaboot-bot-icon">🦷</div>
            <div class="swaboot-bubble swaboot-bubble-bot">${html}</div>`;
        messages?.appendChild(row);

        if (showQR) {
            const qrWrap = document.createElement('div');
            qrWrap.className = 'swaboot-quick-replies';
            QUICK_REPLIES.forEach(qr => {
                const btn = document.createElement('button');
                btn.className = 'swaboot-qr-btn';
                btn.textContent = qr.label;
                btn.addEventListener('click', () => {
                    qrWrap.remove();
                    processInput(qr.key);
                });
                qrWrap.appendChild(btn);
            });
            messages?.appendChild(qrWrap);
        }
        scroll();
    }

    function addUserBubble(text) {
        const row = document.createElement('div');
        row.className = 'swaboot-row swaboot-row-user';
        row.innerHTML = `<div class="swaboot-bubble swaboot-bubble-user">${escHtml(text)}</div>
                         <div class="swaboot-user-icon"><i class="fas fa-user"></i></div>`;
        messages?.appendChild(row);
        scroll();
    }

    function getAnswer(text) {
        const lower = text.toLowerCase();
        for (const qa of QA) {
            if (qa.patterns.some(p => lower.includes(p))) return qa.answer;
        }
        return "I'm not sure about that. Please call us at <a href='tel:+918093974393' style='color:var(--primary);font-weight:600'>+91 80939 74393</a> or visit us! 😊";
    }

    async function processInput(text) {
        if (!text.trim()) return;
        addUserBubble(text);
        await showTyping();
        addBotBubble(getAnswer(text));
    }

    function handleSend() {
        const val = input?.value.trim();
        if (!val) return;
        input.value = '';
        processInput(val);
    }

    sendBtn?.addEventListener('click', handleSend);
    input?.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleSend();
    });

    function scroll() {
        if (messages) messages.scrollTop = messages.scrollHeight;
    }

    function escHtml(t) {
        return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function showTyping(delay = 800) {
        return new Promise(resolve => {
            const row = document.createElement('div');
            row.className = 'swaboot-row swaboot-row-bot';
            row.innerHTML = `
                <div class="swaboot-bot-icon">🦷</div>
                <div class="swaboot-bubble swaboot-bubble-bot swaboot-typing">
                    <span></span><span></span><span></span>
                </div>`;
            messages?.appendChild(row);
            scroll();
            setTimeout(() => {
                row.remove();
                resolve();
            }, delay + Math.random() * 400);
        });
    }

    setTimeout(() => {
        if (!isOpen) {
            badge.style.display = 'flex';
        }
    }, 3000);
})();
