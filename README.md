# 🏏 Crick.AI – Match Companion

**An AI-powered cricket companion that transforms match data into interactive insights, smart recaps, and conversational experiences.**

Crick.AI is a web-based cricket analytics application built with Django and powered by Groq AI. It helps cricket fans explore match statistics, understand key moments, generate over-based summaries, and interact with an AI cricket assistant.

## ✨ Features

- **Interactive Match Dashboard:** Explore cricket match information through a dedicated dashboard.
- **Over Insights:** Discover match insights and important statistics from ball-by-ball data.
- **Smart Match Recaps:** Generate AI-powered summaries for selected over intervals (5, 10, 15, and 20 overs).
- **AI Cricket Chatbot:** Ask questions about the match and receive conversational responses powered by Groq AI.
- **Match Video Integration:** Watch the associated cricket match video directly within the application.
- **Ball-by-Ball Data:** Uses structured IPL JSON match data to provide match context.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Django | Web framework |
| HTML5 | Frontend structure |
| CSS3 | Styling and UI |
| JavaScript | Interactive functionality |
| Groq API | AI-powered responses |
| SQLite | Database |
| YouTube Player API | Match video integration |
| Gunicorn | Production application server |
| WhiteNoise | Static file serving |

## 📂 Project Structure

```text
Crick.AI/
│
├── companion/
│   ├── data/
│   │   └── ipl_json/
│   ├── migrations/
│   ├── services/
│   │   ├── groq_service.py
│   │   └── insights_service.py
│   ├── static/
│   │   └── companion/
│   │       ├── css/
│   │       └── js/
│   ├── templates/
│   │   └── companion/
│   ├── models.py
│   ├── urls.py
│   └── views.py
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── .env.example
├── .gitignore
├── manage.py
├── requirements.txt
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/sush-debug/Crick.AI.git
cd Crick.AI
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=openai/gpt-oss-120b

YOUTUBE_VIDEO_ID=9VV-JbsIknQ
```

Replace the placeholder values with your own credentials.

**Important:** Never upload your actual `.env` file or expose your API keys publicly.

### 5. Apply database migrations

```bash
python manage.py migrate
```

### 6. Run the development server

```bash
python manage.py runserver
```

Open the application:

```text
http://127.0.0.1:8000/
```

## 🔑 API Configuration

Crick.AI uses the Groq API to power its AI chatbot and smart match recap functionality.

You need a valid Groq API key to use these AI features.

Get an API key from:

https://console.groq.com/

## 🚀 Deployment

The application is configured for deployment using:

- **Hosting:** Render
- **Repository:** GitHub
- **Application Server:** Gunicorn
- **Static Files:** WhiteNoise

Production environment variables should be configured through the hosting provider rather than committed to the repository.

## 📊 Dataset

The project includes IPL JSON match data stored in:

`companion/data/ipl_json/`

Refer to the included `README.txt` and `LICENSE.txt` files for dataset information and applicable usage terms.

## 🔮 Future Improvements

- Expanded match and tournament coverage.
- More detailed player and team analytics.
- Improved match-specific AI responses.
- Enhanced match recap accuracy.
- Additional interactive cricket statistics.



GitHub: https://github.com/sush-debug

---

*Crick.AI – Making cricket data more interactive, insightful, and accessible.*