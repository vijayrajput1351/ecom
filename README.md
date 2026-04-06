# 🛒 E-Commerce Microservices App

## Services & Ports
| Service | Port | Database |
|---|---|---|
| Frontend (Nginx) | 80 | - |
| API Gateway | 4000 | - |
| User Service | 3001 | userdb |
| Product Service | 3002 | productdb |
| Order Service | 3003 | orderdb |
| Payment Service | 3004 | paymentdb |
| MongoDB | 27017 | - |

---

## Local Run karo

### Step 1 — MongoDB start karo:
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=mypassword \
  mongo:7
```

### Step 2 — Har service alag terminal mein:
```bash
# Terminal 1
cd user-service && npm install && node server.js

# Terminal 2
cd product-service && npm install && node server.js

# Terminal 3
cd order-service && npm install && node server.js

# Terminal 4
cd payment-service && npm install && node server.js

# Terminal 5
cd api-gateway && npm install && node server.js
```

### Step 3 — Browser mein open karo:
```
http://localhost:4000
```

---

## Docker Images Build karo
```bash
docker build -t YOUR_USERNAME/ecom-frontend:latest ./frontend
docker build -t YOUR_USERNAME/ecom-api-gateway:latest ./api-gateway
docker build -t YOUR_USERNAME/ecom-user-service:latest ./user-service
docker build -t YOUR_USERNAME/ecom-product-service:latest ./product-service
docker build -t YOUR_USERNAME/ecom-order-service:latest ./order-service
docker build -t YOUR_USERNAME/ecom-payment-service:latest ./payment-service
```

---

## K8s Deployment YAML mein yeh banana hai:

### Resources:
```
1.  Namespace           → ecommerce
2.  Secret              → MongoDB credentials
3.  PersistentVolume    → MongoDB storage
4.  PersistentVolumeClaim → MongoDB PVC
5.  MongoDB Deployment  → replicas: 1
6.  MongoDB Service     → port: 27017
7.  User Deployment     → replicas: 2
8.  User Service        → port: 3001
9.  Product Deployment  → replicas: 2
10. Product Service     → port: 3002
11. Order Deployment    → replicas: 2
12. Order Service       → port: 3003
13. Payment Deployment  → replicas: 2
14. Payment Service     → port: 3004
15. API Gateway Deployment → replicas: 2
16. API Gateway Service → port: 4000
17. Frontend Deployment → replicas: 2
18. Frontend Service    → NodePort: 30005
19. Ingress             → shop.local
20. HPA (5 services)    → CPU 70%
```

### Environment Variables for K8s:

#### API Gateway:
```yaml
- name: USER_SERVICE_URL
  value: "http://user-service:3001"
- name: PRODUCT_SERVICE_URL
  value: "http://product-service:3002"
- name: ORDER_SERVICE_URL
  value: "http://order-service:3003"
- name: PAYMENT_SERVICE_URL
  value: "http://payment-service:3004"
```

#### Each Service MONGO_URI:
```yaml
# User Service
- name: MONGO_URI
  value: "mongodb://admin:mypassword@mongo-service:27017/userdb?authSource=admin"

# Product Service
- name: MONGO_URI
  value: "mongodb://admin:mypassword@mongo-service:27017/productdb?authSource=admin"

# Order Service
- name: MONGO_URI
  value: "mongodb://admin:mypassword@mongo-service:27017/orderdb?authSource=admin"

# Payment Service
- name: MONGO_URI
  value: "mongodb://admin:mypassword@mongo-service:27017/paymentdb?authSource=admin"
```

---

## Ingress Setup:
```bash
minikube addons enable ingress
sudo minikube tunnel

# /etc/hosts mein add karo:
127.0.0.1 shop.local
```

## Browser:
```
http://shop.local
```
