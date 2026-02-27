# 🏆 KubeHire AI: Adaptive AI Portfolio Orchestrated on Kubernetes

[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/) [![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/) [![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![OpenAI](https://img.shields.io/badge/OpenAI-412991.svg?style=for-the-badge&logo=OpenAI&logoColor=white)](https://openai.com/)

> **The gap between a static portfolio and a scalable production system—bridged.**

## 🚨 The Problem
Traditional portfolios are static. They don't adapt to recruiter needs, they can't handle real concurrent traffic, and they fail to demonstrate robust, production-level DevOps and scalable architecture.

## 💡 Our Solution: KubeHire AI
KubeHire AI is a self-hosted, intelligent full-stack hiring portfolio that dynamically adapts based on recruiter roles, conducts NLP-based mock interviews, and runs on an auto-scaling Kubernetes cluster to prove real-world infrastructure readiness.

## 🏗 Architecture & Stack
- **Frontend**: React.js (Vite) + Custom Glassmorphism UI
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **AI Engine**: OpenAI API
- **Real-Time Data**: Socket.io
- **Containerization**: Docker (Multi-stage builds)
- **Orchestration**: Kubernetes
- **Scaling**: Horizontal Pod Autoscaler (HPA)

## ⚙️ Core Features
1. **Adaptive Recruiter Mode**: Dynamically filters and reorders projects (Frontend, Backend, DevOps, AI) based on who is viewing it.
2. **AI Mock Interview Engine**: Evaluates responses using NLP and provides an interactive technical screening with scored feedback.
3. **Auto-Scaling Infrastructure**: Managed via Kubernetes Horizontal Pod Autoscaling (HPA) to handle traffic spikes.
4. **Live Analytics Dashboard**: Tracks visits and interview attempts in real-time using WebSockets and stores them in MongoDB.

## 🚀 Quick Start (Local Docker & Kubernetes)

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/kubehire-ai.git
cd kubehire-ai
```

2. **Build Docker Images**
```bash
cd frontend && docker build -t kubehire-frontend:latest .
cd ../backend && docker build -t kubehire-backend:latest .
```

3. **Deploy to Kubernetes** (Requires Minikube or Docker Desktop K8s)
```bash
cd ../k8s
kubectl apply -f .
```

4. **Verify Deployment & Auto-Scaling**
```bash
kubectl get pods -w
kubectl get svc
kubectl get hpa
```

*The frontend will be available at your LoadBalancer IP or NodePort locally.*

---
*Built for Hackathons to prove Cloud-Native readiness and AI integration.*
