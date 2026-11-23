# LinkVault

Ứng dụng web quản lý liên kết và thư mục, chạy hoàn toàn trên trình duyệt. Dữ liệu lưu bằng `localStorage`, không cần server hay backend.

## Tính năng

- Thêm, sửa, xóa liên kết
- Tổ chức liên kết theo thư mục
- Tìm kiếm theo tiêu đề, tag hoặc nội dung
- Lọc theo thư mục
- Nhập / xuất dữ liệu dạng JSON để sao lưu

## Công nghệ

- HTML, CSS, JavaScript thuần
- [Tailwind CSS](https://tailwindcss.com/) (CDN)
- [Font Awesome](https://fontawesome.com/) 6.4
- Google Fonts (Inter)

## Cấu trúc thư mục

```
linkvault/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── tailwind-config.js
│   └── app.js
├── README.md
├── LICENSE
└── .gitignore
```

## Chạy thử

Mở trực tiếp file `index.html` bằng trình duyệt, hoặc chạy server cục bộ:

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## Triển khai lên GitHub Pages

1. Đẩy code lên repository GitHub.
2. Vào **Settings → Pages**.
3. Ở mục **Source**, chọn nhánh `main` và thư mục `/ (root)`, nhấn **Save**.
4. Sau ít phút, trang chạy tại `https://<username>.github.io/<tên-repo>/`.

## Lưu ý

Dữ liệu nằm trong `localStorage` của từng trình duyệt và từng tên miền. Hãy dùng nút **Xuất** để sao lưu định kỳ.

## Giấy phép

MIT
