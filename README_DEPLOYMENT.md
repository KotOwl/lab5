# 🚀 Покроковий гайд по деплою (Lab 5)

Ваш проект складається з двох частин: **Backend** (Node.js сервер) та **Frontend** (React додаток). Вони повинні працювати разом у хмарі.

---

## Крок 1: Налаштування Firebase (База даних) ☁️
Перед деплоєм сервісу, база даних має бути готова:
1. Створіть проект у [Firebase Console](https://console.firebase.google.com/).
2. В розділі **Firestore Database** натисніть "Create Database".
3. В налаштуваннях проекту (**Project Settings**) знайдіть ваш `Project ID`. Він знадобиться для сервера.

---

## Крок 2: Деплой Backend (Сервер) 🖥️
Найкращий варіант для Node.js — **Render.com**:
1. Створіть акаунт на [Render](https://render.com/).
2. Натисніть **New +** -> **Web Service**.
3. Підключіть ваш репозиторій GitHub.
4. **Root Directory**: `lab5/server` (це важливо!).
5. **Build Command**: `npm install`.
6. **Start Command**: `node index.js`.
7. **Environment Variables**: Натисніть "Advanced" і додайте:
   - `JWT_SECRET` = (будь-який складний пароль)
   - `FIREBASE_PROJECT_ID` = (ваш ID з кроку 1)
   - `PORT` = `5001`
8. Після деплою ви отримаєте посилання, наприклад: `https://my-app-backend.onrender.com`. **Скопіюйте його!**

---

## Крок 3: Деплой Frontend (Клієнт) 🌐
Використовуйте **Vercel** або **Netlify**:
1. В папці `lab5/client/src/services/api.js` змініть `API_URL` на ваше посилання з Кроку 2:
   ```javascript
   const API_URL = 'https://my-app-backend.onrender.com/api'; 
   ```
2. Залийте код на GitHub.
3. На **Vercel**:
   - Оберіть папку `lab5/client` як корінь.
   - Build command: `npm run build`.
   - Output directory: `dist`.
4. Натисніть **Deploy**.

---

## Як вони "спілкуються"? 🔗
- Коли користувач відкриває сайт (Frontend), браузер робить запити до вашого сервера (Backend).
- Сервер перевіряє JWT токен і бере дані з Firebase.
- Для того, щоб це працювало, сервер повинен дозволяти запити з домену вашого сайту (це робить `cors` в `index.js`).

