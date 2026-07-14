# Conversation Intelligence Studio

An advanced, warm-minimal visual sandbox designed to audit, analyze, and stress-test customer service AI conversations using Google Gemini models.

---

## 🛠️ Local Development

### 1. Backend (FastAPI)
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file and define your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Run the server:
   ```bash
   python main.py
   # OR
   uvicorn main:app --port 8000 --reload
   ```

### 2. Frontend (Next.js)
1. Install dependencies from the project root:
   ```bash
   npm install
   ```
2. Launch the dev client:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to view the application.

---

## 🚀 Render Deployment Instructions

This repository is optimized to deploy the Next.js frontend and the FastAPI backend as **separate services** on [Render](https://render.com).

### 1. Backend Service (FastAPI Web Service)
1. In the Render Dashboard, click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   * **Name**: `conversation-intelligence-backend`
   * **Language**: `Python`
   * **Root Directory**: `backend`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the following **Environment Variables**:
   * `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API Key)*
5. Click **Deploy Web Service**. Copy the generated URL (e.g. `https://conversation-intelligence-backend.onrender.com`).

### 2. Frontend Service (Next.js Static Site or Web Service)

#### Option A: Deploy as a Static Site (Recommended & Cost-Efficient)
1. Click **New +** and select **Static Site**.
2. Connect your GitHub repository.
3. Configure the service:
   * **Name**: `conversation-intelligence-studio`
   * **Build Command**: `npm run build`
   * **Publish Directory**: `out`
4. Add the following **Environment Variables**:
   * `NEXT_PUBLIC_API_URL`: `https://conversation-intelligence-backend.onrender.com` *(pointing to your backend URL)*
5. Click **Deploy Static Site**.

*Note: For Static Site exports, ensure you configure `output: 'export'` inside `next.config.ts` if exporting static files, or use Option B below.*

#### Option B: Deploy as a Node.js Web Service (Full SSR)
1. Click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   * **Name**: `conversation-intelligence-studio-ssr`
   * **Language**: `Node`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm run start`
4. Add the following **Environment Variables**:
   * `NEXT_PUBLIC_API_URL`: `https://conversation-intelligence-backend.onrender.com` *(pointing to your backend URL)*
5. Click **Deploy Web Service**.
