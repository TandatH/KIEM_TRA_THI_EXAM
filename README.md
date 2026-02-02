# 🎓 Hệ Thống Thi Trực Tuyến

Hệ thống thi trực tuyến đầy đủ tính năng: tạo đề từ LaTeX, tự động chấm điểm, phát hiện gian lận, xuất Excel.

![Version](https://img.shields.io/badge/version-2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Tính Năng

### Giáo Viên:
- ✅ Tạo đề thi từ mã LaTeX
- ✅ Xem trước đề thi
- ✅ Tạo mã đề tự động
- ✅ Theo dõi kết quả realtime
- ✅ Xuất Excel với thống kê
- ✅ Xóa kết quả linh hoạt

### Học Sinh:
- ✅ Đăng nhập bằng mã
- ✅ Đồng hồ đếm ngược
- ✅ Tự động nộp khi hết giờ
- ✅ **Phát hiện chuyển tab** → tự động nộp
- ✅ Xem kết quả chi tiết ngay
- ✅ Tính điểm tự động (thang 10)

## 🚀 Cài Đặt

### Cách 1: Tải về và chạy
```bash
git clone https://github.com/your-username/exam-system.git
cd exam-system
# Mở teacher.html hoặc student.html trong trình duyệt
```

### Cách 2: GitHub Pages
1. Fork repository
2. Settings > Pages > Source: main branch
3. Truy cập: `https://your-username.github.io/exam-system/`

## 📖 Hướng Dẫn Sử Dụng

### Giáo Viên:

1. **Đăng nhập:** Mở `teacher.html`, nhập tên (admin/giaovien/teacher)

2. **Tạo đề:** Nhập thông tin và mã LaTeX:
```latex
\question Câu hỏi 1?
\choice Đáp án A
\choice Đáp án B
\CorrectChoice Đáp án C
\choice Đáp án D
```

3. **Lưu đề:** Click "Tạo Đề Thi" > "Lưu & Tạo Mã"

4. **Chia sẻ:** Copy mã (VD: ABC123) và link `student.html`

### Học Sinh:

1. **Đăng nhập:** Nhập tên + mã đề
2. **Làm bài:** Click "Bắt Đầu", chọn đáp án
3. **Nộp bài:** Click "Nộp Bài" hoặc đợi hết giờ
4. **Xem kết quả:** Điểm hiện ngay sau khi nộp

## ⚠️ Lưu Ý Quan Trọng

- ⚠️ **KHÔNG chuyển tab** khi làm bài
- ⚠️ Bài thi tự động nộp khi chuyển tab
- ✅ Mỗi câu chỉ có 1 đáp án đúng
- ✅ Làm bài ở nơi yên tĩnh, internet ổn định

## 📦 Cấu Trúc File

```
exam-system/
├── index.html          # Trang chủ
├── teacher.html        # Giao diện giáo viên
├── student.html        # Giao diện học sinh
├── styles.css          # CSS chung
├── teacher.js          # Logic giáo viên
├── student.js          # Logic học sinh
├── README.md           # File này
└── LICENSE             # Giấy phép MIT
```

## 📊 File Excel

File Excel xuất ra gồm 2 sheet:

**Sheet 1 - Kết Quả:**
- STT, Họ tên, Mã đề, Tên đề
- Điểm, Số câu đúng/tổng, Tỷ lệ %
- Cảnh báo tab, Thời gian

**Sheet 2 - Thống Kê:**
- Tổng học sinh, Điểm TB/max/min
- Phân loại: Giỏi/Khá/TB/Yếu
- Số học sinh chuyển tab

## 🎨 Tùy Chỉnh

### Thay màu sắc (styles.css):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Thay thang điểm (student.js):
```javascript
const score = ((correct / total) * 10).toFixed(1); // Đổi 10 thành 100
```

### Thêm tên GV hợp lệ (teacher.js):
```javascript
const validNames = ['admin', 'giaovien', 'teacher', 'GV'];
```

## 🔧 Công Nghệ

- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Storage:** LocalStorage
- **Excel:** SheetJS (XLSX)
- **Dependencies:** CDN only (không cần npm)

## ⚠️ Giới Hạn

- ❌ Chỉ chạy trên 1 máy (dữ liệu lưu LocalStorage)
- ❌ Không hỗ trợ nhiều máy thi cùng lúc
- ❌ Dữ liệu mất khi xóa cache trình duyệt

**💡 Giải pháp:** Sử dụng Firebase cho nhiều máy → Xem [FIREBASE.md](FIREBASE.md)

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón!

1. Fork dự án
2. Tạo branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 Changelog

### v2.0 (02/02/2025)
- ✅ Viết lại toàn bộ code, tối ưu
- ✅ Sửa tất cả bugs
- ✅ Cải thiện UX/UI
- ✅ Tài liệu đầy đủ

### v1.1
- ✅ Thêm xuất Excel
- ✅ Thêm xóa kết quả

### v1.0
- ✅ Release đầu tiên

## 📄 License

MIT License - Xem [LICENSE](LICENSE)

## 👨‍💻 Tác Giả

**Tên của bạn**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your-email@example.com

## 🙏 Credits

- SheetJS - https://sheetjs.com
- Google Fonts - https://fonts.google.com

---

⭐ **Nếu hữu ích, hãy cho repo một ngôi sao!** ⭐
