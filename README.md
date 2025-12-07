# Tic Tac Tool

## Getting Started

### 1. Download the policy folder from SharePoint

Download the folder from the following SharePoint link:

https://utoronto-my.sharepoint.com/personal/md_murray_mail_utoronto_ca/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmd%5Fmurray%5Fmail%5Futoronto%5Fca%2FDocuments%2Fpolicies&viewid=e248d5a5%2D1bc6%2D43ae%2D8cf6%2Daf392976a073&ga=1

---

### 2. Clone the repository

```bash
git clone https://github.com/Mich8952/Tic_tac_tool.git

```

### 3. Navigate into the project

```bash
cd Tic_tac_tool/
```

### 4. Place the downloaded folder from SharePoint

Place the downloaded policy folder into the root Tic_tac_tool directory.

### 5. Navigate to the UI directory

```bash
cd Tic_tac_tool/6_UI/my-app
```

### 6. (If needed) Install Node.js

Download Node.js from: https://nodejs.org/en

Install using the .pkg installer.

Check installation:

```bash
node -v
npm -v
```

### 7. (If needed) Create a Python symlink

```bash
sudo ln -s $(which python3) /usr/local/bin/python
```

### 8. Install Python dependencies

```bash
pip3 install -r requirements.txt
```

### 9. Install Node dependencies

```bash
npm install
```

### 10. Start the app

```bash
npm run start
```
