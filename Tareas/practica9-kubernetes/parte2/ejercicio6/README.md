# Ejercicio 6 - Gestión segura de secretos con Sealed Secrets

Este ejercicio implementa secretos versionables en Kubernetes utilizando Sealed Secrets.

## Requisitos

- Kubernetes funcionando
- kubectl instalado
- kubeseal instalado
- Sealed Secrets Controller instalado en el clúster

## 1. Instalar Sealed Secrets Controller

```bash
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.40.0/controller.yaml

Verificar:
kubectl get pods -n kube-system | grep sealed

2. Instalar kubeseal
curl -OL https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.40.0/kubeseal-0.40.0-linux-amd64.tar.gz

tar -xvzf kubeseal-0.40.0-linux-amd64.tar.gz kubeseal

sudo install -m 755 kubeseal /usr/local/bin/kubeseal

Verificar:
kubeseal --version

3. Crear el namespace
kubectl create namespace votos-gitops

4. Aplicar el secreto cifrado
kubectl apply -f sealed-secret.yaml

5. Verificar el SealedSecret
kubectl get sealedsecret -n votos-gitops

6. Verificar el Secret generado
kubectl get secret ms-votos-secret -n votos-gitops
