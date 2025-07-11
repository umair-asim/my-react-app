# 📝 Post Project

A full-stack MERN-based social posting platform with secure user authentication, post creation, comments, and likes — built with scalability, security, and usability in mind.

---

## 🚀 Features

### ✅ 1. Users Module

- User registration with:
  - **Unique email**
  - **Full name**
  - **Secure password** (hashed using **bcrypt** or **Argon2**)
- Login functionality using email and password
- **Email verification** upon registration
- **Password reset via email**
- Authentication and authorization middleware to protect secure routes

---

### ✅ 2. Posts Module

- Each post includes:
  - **Title**
  - **Text content**
- Only **authenticated users** can create posts
- Users can:
  - ✍️ Create posts
  - ✏️ Edit their own posts
  - ❌ Delete their own posts
- **Ownership middleware** ensures users can only edit/delete their own posts

---

### ✅ 3. Comments Module

- Each post can have **multiple comments**
- Each comment includes:
  - **Comment text**
  - **Commenter's name** (auto-filled for logged-in users)
- Authenticated users can:
  - 💬 Comment on any post
  - ✏️ Edit or ❌ delete their own comments
- Post owners can ❌ delete **any comment** on their posts

---

### ✅ 4. Like Functionality

- Any **authenticated user** can like/unlike a post
- Like button acts as a **toggle**:
  - 👍 If already liked → unlike on click
  - 🤍 If not liked → like on click
- Display total **number of likes** per post

---

## 🔒 Security & Best Practices

- 🔐 **JWT** or **session-based authentication**
- ✅ Authorization checks to prevent unauthorized edits or deletions
- ⚠️ Validations for all data entries (users, posts, comments)
- 🛡️ Use **CORS** and **Helmet** to mitigate common web security risks
- 📊 Design scalable and descriptive schema:
  - Enforce **unique constraints** (e.g., emails)
  - Apply **indexes** for performance on key fields

---

## 📁 Tech Stack

- **Frontend**: React + Tailwind (or your chosen UI framework)
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL / MongoDB (based on implementation)
- **Authentication**: JWT / Session-based
- **Email**: NodeMailer / any SMTP provider
- **ORM**: Prisma / Mongoose / Sequelize (based on DB)

---