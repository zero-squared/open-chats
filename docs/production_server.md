# Production server

## Iptables port

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
```

## PostgreSQL

Config path: `/etc/postgresql/16/main/postgresql.conf`

```bash
sudo -u postgres psql
```

## SSL Certificate

```bash
sudo certbot certonly --standalone
sudo chown ubuntu -R /etc/letsencrypt
sudo certbot renew --dry-run
```

[Node, Express, SSL Certificate](https://dev.to/omergulen/step-by-step-node-express-ssl-certificate-run-https-server-from-scratch-in-5-steps-5b87)

## WireGuard

It is used to access PostgreSQL DB

```bash
sudo su -
curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
./wireguard-install.sh
```
