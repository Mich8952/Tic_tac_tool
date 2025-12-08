# Tic Tac Tool

# Quick Start - View the Web App
You can view our complete project via the hosted web app at the following URL:


http://tictactool.duckdns.org:5174/

This should work with the interactive play mode.

--- 

Alternatively if that is not working, you can view the UI with this link (note that interactive play does **not** work in this mode (please see the above URL instead)).

https://tic-tac-tool.netlify.app/



## Running Locally

If you prefer to load a local version of the UI, you can follow the directions below. **Please note that there is no difference functionally between using the URL and running locally.**

### 1. Download the policy folder from SharePoint

Download the folder from the following SharePoint link:

https://utoronto-my.sharepoint.com/personal/md_murray_mail_utoronto_ca/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmd%5Fmurray%5Fmail%5Futoronto%5Fca%2FDocuments%2Fpolicies&viewid=e248d5a5%2D1bc6%2D43ae%2D8cf6%2Daf392976a073&ga=1

---

### 2. Clone the repository

```
git clone https://github.com/Mich8952/Tic_tac_tool.git
```

### 3. Navigate into the project

```
cd Tic_tac_tool/
```

### 4. Place the downloaded folder from SharePoint

Place the downloaded policy folder into the root Tic_tac_tool directory.

This means the file directory should look like this;

```
Tic_tac_tool/
├── README.md
├── requirements.txt
├── policies/            <-------- Place downloaded folder here (unzip it)
│   ├── DQN/
│   ├── MC/
│   ├── PI/
│   ├── QL/
│   └── VI/
├── 1_ModelBased/
├── 2_ModelFree/
├── 3_DeepLearning/
├── 4_AlphaZero/
├── Evaluate/
└── 6_UI/
    └── ...
```

### 5. Navigate to the UI directory

```
cd Tic_tac_tool/6_UI/my-app
```

### 6. (If needed) Install Node.js

Download Node.js from: https://nodejs.org/en

Install using the .pkg installer.

Check installation:

```
node -v
npm -v
```

These should show outputs such as;
```
v25.2.1
```

and 

```
11.6.2
```

With no error messages. If these version do not match, it is probably okay. However, if you run into any issues, please try installing these specific versions (node and npm respectively) as above.


### 7. (If needed) Create a Python symlink

```
sudo ln -s $(which python3) /usr/local/bin/python
```

### 8. Install Python dependencies

Now, navigate back to the main directory `Tic_tac_tool/`. You made need to type `cd ..` a few times until you get there.

```
pip3 install -r requirements.txt
```

### 9. Install Node dependencies

Now, navigate back to the web app directory;

```
cd Tic_tac_tool/6_UI/my-app
```

and type

```
npm install
```

### 10. Start the app

```
npm run start
```

Then, the terminal should present a local network address such as;

```
  ➜  Local:   http://localhost:5173/
```

You can click on that address/open it in your web-browser to use the UI!


If any extended issues persist, please contact any of the group-members and we will get back to you ASAP.
