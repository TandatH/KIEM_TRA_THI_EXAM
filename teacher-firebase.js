// TEACHER-FIREBASE.JS - Hỗ trợ nhiều máy

let db = null;
let exam = null;
let results = [];
let listener = null;

// ===== CẤU HÌNH FIREBASE =====
function saveConfig() {
    const config = {
        apiKey: document.getElementById('apiKey').value.trim(),
        databaseURL: document.getElementById('databaseURL').value.trim(),
        projectId: document.getElementById('projectId').value.trim(),
        authDomain: document.getElementById('projectId').value.trim() + '.firebaseapp.com'
    };
    
    if (!config.apiKey || !config.databaseURL || !config.projectId) {
        alert('Vui lòng điền đầy đủ!');
        return;
    }
    
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        db = firebase.database();
        localStorage.setItem('fbConfig', JSON.stringify(config));
        
        // Test connection
        db.ref('.info/connected').once('value', (snap) => {
            if (snap.val()) {
                updateStatus(true);
                document.getElementById('configSection').classList.add('hidden');
                document.getElementById('loginSection').classList.remove('hidden');
                alert('✅ Kết nối Firebase thành công!');
            }
        });
        
        // Monitor connection
        db.ref('.info/connected').on('value', (snap) => {
            updateStatus(snap.val());
        });
        
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

function useLocal() {
    alert('⚠️ Chế độ Offline: Chỉ 1 máy có thể thi.');
    document.getElementById('configSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

function reconfig() {
    localStorage.removeItem('fbConfig');
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('configSection').classList.remove('hidden');
}

function updateStatus(online) {
    const status = document.getElementById('status');
    const indicator = document.getElementById('indicator');
    
    if (status) {
        status.textContent = online ? '🟢 Đã kết nối Firebase' : '🔴 Mất kết nối';
    }
    
    if (indicator) {
        indicator.textContent = online ? '🟢' : '🔴';
    }
}

// ===== ĐĂNG NHẬP =====
function login() {
    const name = document.getElementById('teacherName').value.trim();
    const valid = ['admin', 'giaovien', 'teacher'];
    
    if (valid.includes(name) || name.toLowerCase().includes('giáo viên')) {
        localStorage.setItem('teacher', name);
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('mainSection').classList.remove('hidden');
        loadActive();
        loadResults();
    } else {
        alert('Tên không hợp lệ!');
    }
}

function logout() {
    if (listener) listener.off();
    localStorage.removeItem('teacher');
    location.reload();
}

// ===== TẠO ĐỀ =====
function createExam() {
    const title = document.getElementById('examTitle').value.trim();
    const duration = parseInt(document.getElementById('duration').value);
    const latex = document.getElementById('latex').value.trim();
    
    if (!title || !latex) {
        alert('Vui lòng điền đầy đủ!');
        return;
    }
    
    try {
        const questions = parseLatex(latex);
        if (questions.length === 0) {
            alert('Không có câu hỏi!');
            return;
        }
        
        exam = { title, duration, questions };
        showPreview(questions);
        
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

function parseLatex(latex) {
    const questions = [];
    const blocks = latex.split('\\question').filter(b => b.trim());
    
    blocks.forEach((block, i) => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        if (!lines.length) return;
        
        const question = lines[0];
        const choices = [];
        let correct = -1;
        
        lines.slice(1).forEach(line => {
            if (line.startsWith('\\choice')) {
                choices.push(line.replace('\\choice', '').trim());
            } else if (line.startsWith('\\CorrectChoice')) {
                correct = choices.length;
                choices.push(line.replace('\\CorrectChoice', '').trim());
            }
        });
        
        if (question && choices.length > 0 && correct !== -1) {
            questions.push({ id: i + 1, question, choices, correctAnswer: correct });
        }
    });
    
    return questions;
}

function showPreview(questions) {
    const box = document.getElementById('previewBox');
    box.innerHTML = '';
    
    questions.forEach((q, i) => {
        const div = document.createElement('div');
        div.className = 'question-preview';
        
        let html = `<div class="question-text">Câu ${i + 1}: ${q.question}</div>`;
        q.choices.forEach((c, j) => {
            const ok = j === q.correctAnswer;
            html += `<div class="choice-item ${ok ? 'correct-choice' : ''}">
                ${String.fromCharCode(65 + j)}. ${c} ${ok ? '✓' : ''}
            </div>`;
        });
        
        div.innerHTML = html;
        box.appendChild(div);
    });
    
    document.getElementById('preview').classList.remove('hidden');
}

// ===== LƯU ĐỀ =====
async function saveExam() {
    if (!exam) return;
    
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    const data = {
        ...exam,
        code,
        created: new Date().toISOString(),
        teacher: localStorage.getItem('teacher'),
        active: true
    };
    
    if (db) {
        try {
            await db.ref('exams/' + code).set(data);
            alert('✅ Đã lưu lên Firebase!');
        } catch (error) {
            alert('Lỗi Firebase: ' + error.message);
            return;
        }
    } else {
        const exams = JSON.parse(localStorage.getItem('exams') || '{}');
        exams[code] = data;
        localStorage.setItem('exams', JSON.stringify(exams));
    }
    
    document.getElementById('code').textContent = code;
    document.getElementById('codeBox').classList.remove('hidden');
    loadActive();
}

function copy() {
    const code = document.getElementById('code').textContent;
    navigator.clipboard.writeText(code).then(() => alert('Đã copy: ' + code));
}

// ===== ĐỀ THI HOẠT ĐỘNG =====
async function loadActive() {
    const list = document.getElementById('activeList');
    
    if (db) {
        db.ref('exams').orderByChild('active').equalTo(true).once('value', (snap) => {
            const exams = snap.val() || {};
            displayActive(exams, list);
        });
    } else {
        const exams = JSON.parse(localStorage.getItem('exams') || '{}');
        const active = {};
        Object.keys(exams).forEach(k => {
            if (exams[k].active) active[k] = exams[k];
        });
        displayActive(active, list);
    }
}

function displayActive(exams, list) {
    if (Object.keys(exams).length === 0) {
        list.innerHTML = '<p class="hint">Chưa có đề nào.</p>';
        return;
    }
    
    let html = '<table style="width:100%; border-collapse:collapse;">';
    html += '<tr style="background:#f8f9fa;"><th style="padding:10px;border:1px solid #ddd;">Mã</th><th style="padding:10px;border:1px solid #ddd;">Tên</th><th style="padding:10px;border:1px solid #ddd;">Thời gian</th><th style="padding:10px;border:1px solid #ddd;">Số câu</th><th style="padding:10px;border:1px solid #ddd;">Thao tác</th></tr>';
    
    Object.keys(exams).forEach(code => {
        const e = exams[code];
        html += `<tr>
            <td style="padding:10px;border:1px solid #ddd;"><strong>${code}</strong></td>
            <td style="padding:10px;border:1px solid #ddd;">${e.title}</td>
            <td style="padding:10px;border:1px solid #ddd;">${e.duration} phút</td>
            <td style="padding:10px;border:1px solid #ddd;">${e.questions.length} câu</td>
            <td style="padding:10px;border:1px solid #ddd;">
                <button onclick="deactivate('${code}')" class="btn-delete">Tắt</button>
            </td>
        </tr>`;
    });
    
    html += '</table>';
    list.innerHTML = html;
}

async function deactivate(code) {
    if (!confirm('Tắt đề này?')) return;
    
    if (db) {
        await db.ref('exams/' + code + '/active').set(false);
    } else {
        const exams = JSON.parse(localStorage.getItem('exams') || '{}');
        if (exams[code]) exams[code].active = false;
        localStorage.setItem('exams', JSON.stringify(exams));
    }
    
    loadActive();
    alert('Đã tắt!');
}

// ===== KẾT QUẢ =====
function loadResults() {
    if (db) {
        listener = db.ref('results');
        listener.on('value', (snap) => {
            const data = snap.val() || {};
            results = Object.values(data);
            displayResults();
        });
    } else {
        results = JSON.parse(localStorage.getItem('results') || '[]');
        displayResults();
        setInterval(() => {
            results = JSON.parse(localStorage.getItem('results') || '[]');
            displayResults();
        }, 5000);
    }
}

function displayResults() {
    const list = document.getElementById('resultsList');
    
    if (results.length === 0) {
        list.innerHTML = '<p class="hint">Chưa có kết quả.</p>';
        return;
    }
    
    let html = '<table style="width:100%; border-collapse:collapse;">';
    html += '<tr style="background:#f8f9fa;"><th style="padding:10px;border:1px solid #ddd;">Họ tên</th><th style="padding:10px;border:1px solid #ddd;">Mã</th><th style="padding:10px;border:1px solid #ddd;">Điểm</th><th style="padding:10px;border:1px solid #ddd;">Thời gian</th><th style="padding:10px;border:1px solid #ddd;">Tab</th><th style="padding:10px;border:1px solid #ddd;">Xóa</th></tr>';
    
    results.forEach((r, i) => {
        html += `<tr>
            <td style="padding:10px;border:1px solid #ddd;">${r.name}</td>
            <td style="padding:10px;border:1px solid #ddd;">${r.code}</td>
            <td style="padding:10px;border:1px solid #ddd;"><strong>${r.score}/10</strong></td>
            <td style="padding:10px;border:1px solid #ddd;">${new Date(r.time).toLocaleString('vi-VN')}</td>
            <td style="padding:10px;border:1px solid #ddd;">${r.tabSwitch ? '⚠️' : '✓'}</td>
            <td style="padding:10px;border:1px solid #ddd;">
                <button onclick="deleteResult('${r.id || i}')" class="btn-delete">🗑️</button>
            </td>
        </tr>`;
    });
    
    html += '</table>';
    list.innerHTML = html;
}

async function deleteResult(id) {
    if (!confirm('Xóa?')) return;
    
    if (db) {
        await db.ref('results/' + id).remove();
    } else {
        results = results.filter((r, i) => (r.id || i) != id);
        localStorage.setItem('results', JSON.stringify(results));
        displayResults();
    }
}

async function clearResults() {
    if (!confirm('⚠️ XÓA TẤT CẢ?')) return;
    if (!confirm('Xác nhận?')) return;
    
    if (db) {
        await db.ref('results').remove();
    } else {
        localStorage.setItem('results', '[]');
        results = [];
        displayResults();
    }
    
    alert('Đã xóa!');
}

function refresh() {
    loadResults();
}

// ===== EXCEL =====
function downloadExcel() {
    if (results.length === 0) {
        alert('Không có kết quả!');
        return;
    }
    
    const data = results.map((r, i) => ({
        'STT': i + 1,
        'Họ tên': r.name,
        'Mã đề': r.code,
        'Tên đề': r.examTitle || '',
        'Điểm': r.score,
        'Số câu đúng': r.correct || 0,
        'Tổng câu': r.total || 0,
        'Tỷ lệ %': r.total ? ((r.correct / r.total) * 100).toFixed(1) : 0,
        'Tab': r.tabSwitch ? 'Có' : 'Không',
        'Thời gian': new Date(r.time).toLocaleString('vi-VN')
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{wch:5},{wch:25},{wch:12},{wch:30},{wch:8},{wch:12},{wch:12},{wch:10},{wch:12},{wch:20}];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kết Quả');
    
    const scores = results.map(r => r.score);
    const stats = [
        {Chỉ số: 'Tổng HS', Giá trị: results.length},
        {Chỉ số: 'Điểm TB', Giá trị: (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(2)},
        {Chỉ số: 'Cao nhất', Giá trị: Math.max(...scores).toFixed(1)},
        {Chỉ số: 'Thấp nhất', Giá trị: Math.min(...scores).toFixed(1)},
        {Chỉ số: 'Giỏi', Giá trị: scores.filter(s=>s>=8).length},
        {Chỉ số: 'Khá', Giá trị: scores.filter(s=>s>=6.5).length},
        {Chỉ số: 'TB', Giá trị: scores.filter(s=>s>=5).length},
        {Chỉ số: 'Yếu', Giá trị: scores.filter(s=>s<5).length},
        {Chỉ số: 'Chuyển tab', Giá trị: results.filter(r=>r.tabSwitch).length}
    ];
    
    const wsStats = XLSX.utils.json_to_sheet(stats);
    wsStats['!cols'] = [{wch:20},{wch:15}];
    XLSX.utils.book_append_sheet(wb, wsStats, 'Thống Kê');
    
    const now = new Date();
    const file = `KetQua_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}.xlsx`;
    
    XLSX.writeFile(wb, file);
    alert('✅ Đã tải: ' + file);
}

// ===== KHỞI TẠO =====
window.addEventListener('load', () => {
    const config = localStorage.getItem('fbConfig');
    if (config) {
        try {
            const cfg = JSON.parse(config);
            if (!firebase.apps.length) {
                firebase.initializeApp(cfg);
            }
            db = firebase.database();
            document.getElementById('configSection').classList.add('hidden');
            
            db.ref('.info/connected').on('value', (snap) => {
                updateStatus(snap.val());
            });
            
            const teacher = localStorage.getItem('teacher');
            if (teacher) {
                document.getElementById('loginSection').classList.add('hidden');
                document.getElementById('mainSection').classList.remove('hidden');
                loadActive();
                loadResults();
            } else {
                document.getElementById('loginSection').classList.remove('hidden');
            }
        } catch (error) {
            console.error(error);
        }
    }
});
