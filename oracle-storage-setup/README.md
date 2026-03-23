# 📦 Setup Oracle Cloud Storage (50GB)

This setup turns your Oracle Cloud VM into a private "S3" storage for your gallery.

## 1. Prerequisites
*   Install **Docker** and **Docker Compose** on your Oracle VM.
*   In Oracle Cloud Console, go to **Networking -> Virtual Cloud Networks -> Security Lists**.
*   Add **Ingress Rules** for ports `9000` (S3 API) and `9001` (Web UI).

## 2. Start MinIO
Copy the `docker-compose.yml` file to your VM and run:
```bash
docker-compose up -d
```

## 3. Configure MinIO
*   Open `http://YOUR_ORACLE_IP:9001` (Login: admin / password123).
*   Go to **Buckets** -> **Create Bucket** and name it `mygallery`.
*   Go to **Access Keys** -> **Create Access Key**. Save the `Access Key` and `Secret Key`.

## 4. Connect to Vercel
In your Vercel Project Settings, add these **Environment Variables**:

| Variable | Value |
| :--- | :--- |
| `S3_ENDPOINT` | `http://YOUR_ORACLE_IP:9000` |
| `S3_ACCESS_KEY` | (Your Access Key) |
| `S3_SECRET_KEY` | (Your Secret Key) |
| `S3_BUCKET` | `mygallery` |
| `S3_PUBLIC_URL` | `http://YOUR_ORACLE_IP:9000` |

---
**Note:** If you don't use this Oracle setup, the gallery will automatically fallback to **Vercel Blob** (if configured).
