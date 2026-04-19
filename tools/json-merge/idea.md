# JSON Translation Merger

**JSON Translation Merger** là một công cụ tiện ích nền web giúp các lập trình viên và biên dịch viên dễ dàng hợp nhất, đồng bộ và chỉnh sửa nhiều file JSON chứa dữ liệu đa ngôn ngữ (i18n).

## 🌟 Tính năng nổi bật

* **Quản lý File Động:** Hỗ trợ tải và xử lý số lượng file JSON không giới hạn. Bạn có thể dễ dàng thêm mới, đổi tên hoặc xóa các file cần xử lý.
* **Tự động Đồng bộ Key:** Tự động quyét và gom nhóm tất cả các key (khóa) từ tất cả các file. Nếu một file bị thiếu key nào đó, công cụ sẽ tự động thêm key đó vào file với giá trị là chuỗi rỗng (`""`).
* **Giao diện So sánh Trực quan:** Hiển thị các file dưới dạng lưới (grid) ngang hàng, giúp dễ dàng so sánh bản dịch giữa các ngôn ngữ giống như phần mềm  *Beyond Compare* .
* **Chỉnh sửa Trực tiếp (Live Editing):** Cho phép nhập bản dịch trực tiếp trên bảng so sánh. Những ô bị thiếu dữ liệu sẽ được tô viền đỏ nổi bật để bạn không bỏ sót.
* **Tùy chọn Sắp xếp:** Hỗ trợ sắp xếp danh sách key theo **Thứ tự gốc** (dựa trên file cơ sở) hoặc theo  **Bảng chữ cái (A-Z)** .
* **Xuất File Nhanh chóng:** Tải xuống toàn bộ các file JSON đã được hợp nhất và chuẩn hóa chỉ với một cú click chuột (tên file tải về sẽ có hậu tố `_merged`).

## 🚀 Hướng dẫn sử dụng

Công cụ này được xây dựng hoàn toàn bằng HTML, CSS (Tailwind) và Vanilla JavaScript, không cần cài đặt Node.js hay bất kỳ môi trường nào.

1. **Nhập dữ liệu:** - Công cụ cung cấp sẵn 3 khung nhập liệu cơ bản (`vi.json`, `en.json`, `zh.json`).
   * Dán nội dung JSON của bạn vào các ô tương ứng.
   * Bấm **"Thêm file"** nếu bạn có nhiều hơn 3 ngôn ngữ.
3. **Xử lý:** Bấm nút  **"Xử lý & Hợp nhất"** . Bảng so sánh chi tiết sẽ xuất hiện ở phía dưới.
4. **Chỉnh sửa:** Điền các bản dịch còn thiếu vào các ô màu đỏ trực tiếp trên bảng.
5. **Lưu file:** Chọn chế độ sắp xếp mong muốn, sau đó bấm **"Tải xuống tất cả"** ở góc trên cùng bên phải để lưu các file đã hoàn thiện về máy.

## 🛠️ Công nghệ sử dụng

* **HTML5:** Cấu trúc giao diện.
* **Tailwind CSS (via CDN):** Xây dựng giao diện hiện đại, responsive và đẹp mắt một cách nhanh chóng.
* **Vanilla JavaScript (ES6):** Xử lý logic đọc file, hợp nhất JSON, quản lý trạng thái DOM và tạo file tải xuống.

## 📝 Lưu ý

* Trình duyệt có thể hỏi quyền tải xuống nhiều file cùng lúc khi bạn bấm nút "Tải xuống tất cả". Hãy nhấn "Cho phép" (Allow) để công cụ tải về đầy đủ các file.
* Đảm bảo dữ liệu đầu vào của bạn là định dạng JSON hợp lệ. Nếu JSON bị lỗi cú pháp, hệ thống sẽ hiện thông báo cảnh báo.
