# Docker Installation Guide för Windows

## Prerequisites
- Windows 10/11 Pro, Enterprise, eller Education (64-bit)
- WSL 2 (Windows Subsystem for Linux 2)
- Virtualization enabled i BIOS

## Steg 1: Installera WSL 2

### 1.1 Aktivera WSL
Öppna PowerShell som Administrator och kör:
```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

### 1.2 Aktivera Virtual Machine Platform
```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### 1.3 Starta om datorn
```powershell
Restart-Computer
```

### 1.4 Ladda ner WSL 2 Linux kernel update
Ladda ner från: https://aka.ms/wsl2kernel

### 1.5 Installera WSL 2
```powershell
wsl --set-default-version 2
```

### 1.6 Installera Ubuntu från Microsoft Store
- Öppna Microsoft Store
- Sök efter "Ubuntu"
- Installera "Ubuntu" (inte Ubuntu 20.04 LTS)

## Steg 2: Installera Docker Desktop

### 2.1 Ladda ner Docker Desktop
- Gå till: https://www.docker.com/products/docker-desktop
- Ladda ner Docker Desktop för Windows

### 2.2 Installera Docker Desktop
- Kör den nedladdade filen
- Följ installationsguiden
- Starta om datorn vid behov

### 2.3 Konfigurera Docker Desktop
- Starta Docker Desktop
- Gå till Settings > General
- Aktivera "Use WSL 2 based engine"
- Gå till Settings > Resources > WSL Integration
- Aktivera integration med Ubuntu

## Steg 3: Verifiera Installation

### 3.1 Testa Docker
Öppna PowerShell och kör:
```powershell
docker --version
docker-compose --version
```

### 3.2 Testa Docker Hello World
```powershell
docker run hello-world
```

## Steg 4: Starta Smajobb Projekt

### 4.1 Klona Repository
```powershell
git clone <your-repo-url>
cd smajobb
```

### 4.2 Konfigurera Environment
```powershell
# Kopiera environment template
Copy-Item env.example .env

# Redigera .env med dina värden
notepad .env
```

### 4.3 Starta Docker Compose
```powershell
docker-compose up -d
```

### 4.4 Verifiera Tjänster
```powershell
docker-compose ps
```

## Felsökning

### Problem: Docker Desktop startar inte
- Kontrollera att WSL 2 är aktiverat
- Verifiera att virtualization är aktiverat i BIOS
- Starta om datorn

### Problem: Portar är upptagna
- Kontrollera att inga andra tjänster använder portarna 3000, 7000, 5432, 6379
- Stoppa eventuella lokala PostgreSQL eller Redis instanser

### Problem: WSL 2 fungerar inte
- Uppdatera Windows till senaste versionen
- Installera alla Windows updates
- Kontrollera att Hyper-V är aktiverat

## Alternativ: Använda WSL 2 direkt

Om Docker Desktop inte fungerar, kan du använda WSL 2 direkt:

### 1. Installera Docker i WSL 2
```bash
# I Ubuntu WSL
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
```

### 2. Starta Docker service
```bash
sudo service docker start
```

### 3. Kör projektet från WSL 2
```bash
cd /mnt/c/VSC/smajobb
docker-compose up -d
```

## Nästa Steg

Efter att Docker är installerat och fungerar:

1. **Konfigurera GitHub Repository**
2. **Sätt upp GitHub Secrets**
3. **Konfigurera Branch Protection**
4. **Starta utvecklingsmiljön**

## Support

För Docker-relaterade problem:
- Docker Documentation: https://docs.docker.com/
- WSL Documentation: https://docs.microsoft.com/en-us/windows/wsl/
- GitHub Issues: Skapa issue i repository
