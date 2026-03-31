from fastapi import FastAPI
from pydantic import BaseModel
from sentiment_analyzer import analyzer, analyzer_transoform
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os


app = FastAPI()

origins = [
    'http://localhost:3000',
    'http://localhost:5173'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_methods = ['*'],
    allow_headers = ['*'],
    allow_credentials = True
)


class SentAnalyzer(BaseModel):
    text: str

@app.post('/sent')
def sent_analysis(text: SentAnalyzer):
    result = analyzer(text=text.text)['compound']

    if result >= 0.2:
        sentiment = "positive"
    elif result <= -0.2:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return { "sentiment": sentiment, "score": result }

@app.post('/vader')
def sent_analysis_transform(text: SentAnalyzer):
    label = analyzer_transoform(text=text.text)[0]['label']
    score = analyzer_transoform(text=text.text)[0]['score']

    if label == 'POS':
        label = 'positive'
    elif label == 'NEG':
        label = 'negative'
    else:
        label = 'neutral'

    return { "sentiment": label, "score": score }

# compute absolute path
frontend_path = os.path.join(os.path.dirname(__file__), "../frontend/dist")

app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")