# 🚀 HƯỚNG DẪN ĐƯA LÊN GITHUB

## 📋 CHUẨN BỊ

Bạn cần có:
- ✅ Tài khoản GitHub (đăng ký tại: https://github.com)
- ✅ 6 file: index.html, teacher.html, student.html, styles.css, teacher.js, student.js

## 🎯 CÁCH 1: DÙNG GITHUB WEB (DỄ NHẤT - KHUYÊN DÙNG)

### Bước 1: Tạo Repository

1. Đăng nhập GitHub
2. Click dấu **+** góc phải > **New repository**
3. Điền thông tin:
   - **Repository name:** `exam-system`
   - **Description:** "Hệ thống thi trực tuyến"
   - **Public** ✅
   - **KHÔNG** tick "Add a README file"
4. Click **Create repository**

### Bước 2: Upload Files

1. Trong repository vừa tạo, click **"uploading an existing file"**
2. Kéo thả cả 6 file HTML/CSS/JS vào
3. Hoặc click **"choose your files"**
4. Ở ô Commit:
   ```
   Title: Initial commit
   ```
5. Click **Commit changes**

### Bước 3: Kích Hoạt GitHub Pages

1. Click tab **Settings**
2. Menu trái > **Pages**
3. Ở **Source**:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**
5. Đợi 2-5 phút

### Bước 4: Truy Cập

Sau vài phút, link sẽ sẵn sàng:
```
https://YOUR-USERNAME.github.io/exam-system/
```

**Link cụ thể:**
- Trang chủ: `https://YOUR-USERNAME.github.io/exam-system/`
- Giáo viên: `https://YOUR-USERNAME.github.io/exam-system/teacher.html`
- Học sinh: `https://YOUR-USERNAME.github.io/exam-system/student.html`

✅ **XONG! Đơn giản vậy thôi!**

---

## 💻 CÁCH 2: DÙNG GIT COMMAND LINE

### Bước 1: Cài Git

**Windows:**
- Tải: https://git-scm.com/download/win
- Cài đặt (để mặc định)

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

### Bước 2: Cấu Hình Git

```bash
git config --global user.name "Tên Bạn"
git config --global user.email "email@example.com"
```

### Bước 3: Tạo Repository Trên GitHub

1. Vào GitHub > New repository
2. Tên: `exam-system`
3. Public
4. **KHÔNG** tick README
5. Create repository

### Bước 4: Push Code Lên

```bash
# Di chuyển đến thư mục chứa 6 file
cd /đường/dẫn/đến/thư/mục

# Khởi tạo Git
git init

# Thêm tất cả file
git add .

# Commit
git commit -m "Initial commit"

# Đổi branch
git branch -M main

# Thêm remote (thay YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/exam-system.git

# Push
git push -u origin main
```

### Nếu yêu cầu đăng nhập:

**Tạo Personal Access Token:**
1. GitHub > Settings > Developer settings
2. Personal access tokens > Tokens (classic)
3. Generate new token (classic)
4. Chọn scope: **repo** (tất cả)
5. Generate token
6. **COPY TOKEN** (chỉ hiện 1 lần!)
7. Dùng token làm password khi push

### Kích Hoạt GitHub Pages:

Làm giống Cách 1, Bước 3.

---

## 🖥️ CÁCH 3: GITHUB DESKTOP

### Bước 1: Cài Đặt

Tải: https://desktop.github.com

### Bước 2: Tạo Repository

1. File > New Repository
2. Name: `exam-system`
3. Local path: Chọn thư mục
4. Create Repository

### Bước 3: Copy Files

Copy 6 file vào thư mục vừa tạo

### Bước 4: Commit & Publish

1. Trong GitHub Desktop, tick tất cả file
2. Summary: "Initial commit"
3. Commit to main
4. Publish repository
5. Chọn Public
6. Publish

### Kích Hoạt Pages:

Vào web GitHub, làm giống Cách 1, Bước 3.

---

## 🎯 KIỂM TRA

### Test trên máy local:

Mở trực tiếp file trong Chrome:
```
file:///C:/path/to/teacher.html
```

### Test trên GitHub Pages:

```
https://YOUR-USERNAME.github.io/exam-system/teacher.html
```

### Workflow test:

1. **Giáo viên:**
   - Mở link giáo viên
   - Đăng nhập: admin
   - Tạo đề thi test
   - Lấy mã (VD: ABC123)

2. **Học sinh:**
   - Mở link học sinh (tab mới)
   - Nhập tên + mã ABC123
   - Làm bài test
   - Nộp bài

3. **Kiểm tra:**
   - Quay lại tab giáo viên
   - F5 refresh
   - Thấy kết quả học sinh
   - Tải Excel

---

## 🔧 CẬP NHẬT CODE SAU NÀY

### Dùng GitHub Web:

1. Vào repository
2. Click file cần sửa
3. Click icon ✏️ (Edit)
4. Sửa code
5. Commit changes

### Dùng Git Command:

```bash
# Sửa file trong máy
# Sau đó:

git add .
git commit -m "Mô tả thay đổi"
git push
```

### Dùng GitHub Desktop:

1. Sửa file trong máy
2. GitHub Desktop tự động phát hiện
3. Commit to main
4. Push origin

---

## ❓ XỬ LÝ LỖI

### Lỗi: "Permission denied"

**Nguyên nhân:** Chưa xác thực

**Giải pháp:**
1. Tạo Personal Access Token
2. Dùng token làm password

### Lỗi: "Repository not found"

**Nguyên nhân:** URL sai

**Giải pháp:**
```bash
git remote -v  # Xem URL hiện tại
git remote set-url origin https://github.com/YOUR-USERNAME/exam-system.git
```

### GitHub Pages không hiển thị

**Nguyên nhân:** Chưa deploy xong

**Giải pháp:**
- Đợi 5-10 phút
- Kiểm tra Settings > Pages
- Xóa cache trình duyệt (Ctrl+Shift+Delete)

### File không load trên GitHub Pages

**Nguyên nhân:** Đường dẫn file sai

**Giải pháp:**
- Đảm bảo tất cả file ở root (không trong thư mục con)
- Tên file chính xác: `teacher.html` không phải `Teacher.html`

---

## 📝 CHECKLIST

- [ ] Tạo GitHub account
- [ ] Tạo repository `exam-system`
- [ ] Upload 6 file (HTML/CSS/JS)
- [ ] Kích hoạt GitHub Pages
- [ ] Test link giáo viên
- [ ] Test link học sinh
- [ ] Tạo đề thi test
- [ ] Test làm bài thi
- [ ] Kiểm tra kết quả
- [ ] Tải Excel test
- [ ] Chia sẻ link với người dùng

---

## 💡 MẸO

1. **Bookmark link:** Lưu link để truy cập nhanh

2. **Custom domain:** Nếu có domain riêng:
   - Settings > Pages > Custom domain
   - Nhập domain
   - Cấu hình DNS ở nhà cung cấp

3. **Bảo vệ branch:**
   - Settings > Branches > Add rule
   - Yêu cầu review trước khi merge

4. **README đẹp:**
   - Thêm screenshots
   - Badges (version, license)
   - Demo video

---

## 🎉 HOÀN THÀNH!

Bạn đã có hệ thống thi trực tuyến trên GitHub!

**Link chia sẻ:**
```
Trang chủ: https://YOUR-USERNAME.github.io/exam-system/
```

**Bước tiếp theo:**
- ⭐ Star repository
- 📢 Chia sẻ với bạn bè
- 🔔 Watch để nhận thông báo
- 🍴 Fork để customize

---

**Cần hỗ trợ?**
- GitHub Docs: https://docs.github.com
- GitHub Community: https://github.community
