// STUDENT-FIREBASE.JS - Hỗ trợ nhiều máy

let db = null;
let exam = null;
let name = '';
let code = '';
let answers = {};
let startTime = null;
let timer = null;
let tabSwitch = false;
let submitted = false;

// ===== KHỞI TẠO FIREBASE =====
function initFirebase() {
    const config = localStorage.getItem('fbConfig');
    if (config) {
        try {
            const cfg = JSON.parse(config);
            if (!firebase.apps.length) {
                firebase.initializeApp(cfg);
            }
            db = firebase.database();
            updateStatus(true);
            
            db.ref('.info/connected').on('value', (snap) => {
                updateStatus(snap.val());
            });
            
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    return false;
}

function updateStatus(online) {
    const el = document.getElementById('status');
    if (el) {
        el.textContent = online ? '🟢 Đã kết nối' : '🔴 Mất kết nối';
    }
}

// ===== ĐĂNG NHẬP =====
async function login() {
    const n = document.getElementById('name').value.trim();
    const c = document.getElementById('code').value.trim().toUpperCase();
    
    if (!n) {
        alert('Vui lòng nhập tên!');
        return;
    }
    
    if (!c) {
        alert('Vui lòng nhập mã!');
        return;
    }
    
    name = n;
    code = c;
    
    if (db) {
        try {
            const snap = await db.ref('exams/' + c).once('value');
            const e = snap.val();
            
            if (!e) {
                alert('Mã không hợp lệ!');
                return;
            }
            
            if (!e.active) {
                alert('Đề thi đã bị tắt!');
                return;
            }
            
            exam = e;
            showWaiting();
            
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    } else {
        const exams = JSON.parse(localStorage.getItem('exams') || '{}');
        
        if (!exams[c]) {
            alert('Mã không hợp lệ!');
            return;
        }
        
        exam = exams[c];
        showWaiting();
    }
}

function showWaiting() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('waitingSection').classList.remove('hidden');
    
    document.getElementById('welcome').textContent = `Chào ${name}!`;
    document.getElementById('title').textContent = exam.title;
    document.getElementById('duration').textContent = exam.duration;
    document.getElementById('count').textContent = exam.questions.length;
}

// ===== BẮT ĐẦU THI =====
function start() {
    document.getElementById('waitingSection').classList.add('hidden');
    document.getElementById('examSection').classList.remove('hidden');
    
    document.getElementById('titleTop').textContent = exam.title;
    
    answers = {};
    showQuestions();
    startTimer();
    detectTab();
    
    document.getElementById('warning').classList.remove('hidden');
}

function showQuestions() {
    const container = document.getElementById('questions');
    container.innerHTML = '';
    
    exam.questions.forEach((q, i) => {
        const div = document.createElement('div');
        div.className = 'question-container';
        
        let html = `
            <div class="question-number">Câu ${i + 1}</div>
            <div class="question-content">${q.question}</div>
            <div class="choices">
        `;
        
        q.choices.forEach((c, j) => {
            html += `
                <label class="choice-label">
                    <input type="radio" name="q${i}" value="${j}" onchange="save(${i}, ${j})">
                    <span>${String.fromCharCode(65 + j)}. ${c}</span>
                </label>
            `;
        });
        
        html += '</div>';
        div.innerHTML = html;
        container.appendChild(div);
    });
}

function save(i, j) {
    answers[i] = j;
}

// ===== TIMER =====
function startTimer() {
    startTime = Date.now();
    let remaining = exam.duration * 60;
    
    timer = setInterval(() => {
        remaining--;
        
        const min = Math.floor(remaining / 60);
        const sec = remaining % 60;
        
        const el = document.getElementById('timer');
        el.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        
        if (remaining <= 300) {
            el.classList.add('warning');
        }
        
        if (remaining <= 0) {
            clearInterval(timer);
            submit(true);
        }
    }, 1000);
}

// ===== PHÁT HIỆN TAB =====
function detectTab() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !submitted) {
            tabSwitch = true;
            alert('⚠️ Đã phát hiện chuyển tab! Tự động nộp bài.');
            submit(true);
        }
    });
}

// ===== NỘP BÀI =====
async function submit(auto = false) {
    if (submitted) return;
    submitted = true;
    
    if (timer) clearInterval(timer);
    
    // Tính điểm
    let correct = 0;
    exam.questions.forEach((q, i) => {
        if (answers[i] === q.correctAnswer) {
            correct++;
        }
    });
    
    const total = exam.questions.length;
    const score = parseFloat(((correct / total) * 10).toFixed(1));
    
    // Lưu kết quả
    const result = {
        name,
        code,
        examTitle: exam.title,
        score,
        correct,
        total,
        answers,
        tabSwitch,
        time: new Date().toISOString()
    };
    
    if (db) {
        try {
            const ref = db.ref('results').push();
            result.id = ref.key;
            await ref.set(result);
        } catch (error) {
            console.error(error);
            saveLocal(result);
        }
    } else {
        saveLocal(result);
    }
    
    // Hiển thị kết quả
    document.getElementById('examSection').classList.add('hidden');
    showResult(correct, total, score, auto);
}

function saveLocal(result) {
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    results.push(result);
    localStorage.setItem('results', JSON.stringify(results));
}

function showResult(correct, total, score, auto) {
    document.getElementById('resultSection').classList.remove('hidden');
    
    document.getElementById('score').textContent = score;
    document.getElementById('resultName').textContent = name;
    document.getElementById('correct').textContent = correct;
    document.getElementById('total').textContent = total;
    
    let msg = auto ? 
        (tabSwitch ? '⚠️ Tự động nộp do chuyển tab!' : '⏰ Tự động nộp do hết giờ!') :
        '✓ Nộp bài thành công!';
    
    document.getElementById('msg').textContent = msg;
    
    showDetails();
}

function showDetails() {
    const container = document.getElementById('details');
    container.innerHTML = '<h3>Chi Tiết:</h3>';
    
    exam.questions.forEach((q, i) => {
        const studentAns = answers[i];
        const correctAns = q.correctAnswer;
        const isCorrect = studentAns === correctAns;
        
        const div = document.createElement('div');
        div.className = `result-question ${isCorrect ? 'correct' : 'incorrect'}`;
        
        let html = `
            <div class="question-text">Câu ${i + 1}: ${q.question}</div>
            <div class="answer-info">
        `;
        
        if (studentAns !== undefined) {
            html += `Bạn chọn: <span class="${isCorrect ? 'correct-answer' : 'wrong-answer'}">${String.fromCharCode(65 + studentAns)}. ${q.choices[studentAns]}</span><br>`;
        } else {
            html += `Bạn chọn: <span class="wrong-answer">Không trả lời</span><br>`;
        }
        
        if (!isCorrect) {
            html += `Đáp án đúng: <span class="correct-answer">${String.fromCharCode(65 + correctAns)}. ${q.choices[correctAns]}</span>`;
        }
        
        html += '</div>';
        div.innerHTML = html;
        container.appendChild(div);
    });
}

// ===== KHỞI TẠO =====
window.addEventListener('load', () => {
    initFirebase();
});

window.addEventListener('beforeunload', (e) => {
    if (!submitted && startTime) {
        e.preventDefault();
        e.returnValue = 'Bài thi chưa nộp!';
    }
});
