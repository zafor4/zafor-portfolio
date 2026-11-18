# Azure Server Sync Guide

A push to `main` builds the frontend and backend images on GitHub and updates `zaforiq.me` on the Azure VM. The VM pulls those images and restarts only those two containers. Postgres, MinIO, and nginx stay running.

This project serves **only** `zaforiq.me` / `www.zaforiq.me`.

---

## 1. One-time deploy key

On your Mac:


hbefiubreifw
wiufediewfbib
```bash
ssh-keygen -t ed25519 -f ~/.ssh/zaforiq-deploy -N ""
ssh-copy-id -i ~/.ssh/zaforiq-deploy.pub zaforiqbal@4.252.0.112
```

In GitHub, open the repository **Settings → Secrets and variables → Actions** and add:

- `VPS_HOST` = `4.252.0.112`
- `VPS_USER` = `zaforiqbal`
- `VPS_SSH_KEY` = the contents of `~/.ssh/zaforiq-deploy` (the private key)

After the first image push, open your GitHub packages for `portfolio-backend` and `portfolio-frontend` and set each one to **Public** if the workflow could not do that itself. The VM pulls them without a registry password.

---

## 2. First-time VPS setup (clean install)

On the VPS, after Docker is installed and DNS for `zaforiq.me` / `www` points at the VM:

```bash
cd ~
git clone https://github.com/zafor4/zafor-portfolio.git portfolio
cd portfolio
cp .env.example .env
# edit .env — set strong POSTGRES_PASSWORD, MINIO_ROOT_PASSWORD, JWT_SECRET
```

Issue TLS certs (nothing should be listening on port 80 yet):

```bash
sudo apt install -y certbot
sudo certbot certonly --standalone \
  -d zaforiq.me -d www.zaforiq.me \
  --email YOUR_EMAIL \
  --agree-tos --non-interactive
```

Start the stack:

```bash
cd ~/portfolio
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Verify:

```bash
curl -I https://zaforiq.me
curl -fsS https://zaforiq.me/api/portfolio
```

---

## 3. Normal deploy

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

Watch the **Deploy** workflow. It stays green only when `https://zaforiq.me` loads and `https://zaforiq.me/api/portfolio` returns successfully.

---

## 4. Manual fallback

```bash
ssh -i ~/.ssh/zaforiq-deploy zaforiqbal@4.252.0.112
```

```bash
cd portfolio
git pull --ff-only origin main
docker compose -f docker-compose.prod.yml pull backend frontend
docker compose -f docker-compose.prod.yml up -d --no-deps backend frontend
docker exec portfolio-nginx nginx -s reload
```
