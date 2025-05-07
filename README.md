# HRM System

Human Resource Management System sử dụng React và Vite.

## Cấu trúc thư mục

```
src/
├── assets/         # Hình ảnh, fonts, và static files khác
├── components/     # Các component tái sử dụng
│   ├── ui/         # UI components (Button, Input, etc.)
│   └── common/     # Common components (Header, Footer, etc.)
├── context/        # React Context
├── constants/      # Hằng số, Enums
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── pages/          # Các trang của ứng dụng
├── services/       # API services
├── types/          # Type definitions
└── utils/          # Utility functions
```

## Nguyên tắc Clean Code

1. **Cấu trúc dự án có tổ chức**: 
   - Các file và thư mục được sắp xếp hợp lý theo chức năng.
   - Mọi thứ đều có vị trí cụ thể và có thể dự đoán được.

2. **Separation of Concerns**:
   - Components chỉ xử lý UI và sự tương tác người dùng.
   - Services xử lý gọi API và business logic.
   - Hooks xử lý logic tái sử dụng.
   - Context quản lý trạng thái global của ứng dụng.

3. **Component-Based Architecture**:
   - Các components nhỏ, độc lập và có thể tái sử dụng.
   - Các components được thiết kế theo nguyên tắc Single Responsibility.

4. **Conventions**:
   - Tên file PascalCase cho Components (Button.jsx)
   - Tên file camelCase cho utilites và services (apiService.js)
   - Tên hàm camelCase và mô tả hành động (getUserData)
   - Tên biến camelCase và mô tả giá trị (userProfile)

5. **Documentation**:
   - Comments và JSDoc cho functions và components.
   - README.md cung cấp hướng dẫn cài đặt và sử dụng.

## Cài đặt

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục dự án
cd hrm

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

## Các scripts

- `npm run dev`: Chạy development server
- `npm run build`: Build production version
- `npm run preview`: Preview production build
- `npm run lint`: Kiểm tra lỗi với ESLint
