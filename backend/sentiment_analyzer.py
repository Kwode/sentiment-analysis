from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import transformers
from transformers import pipeline

sent = SentimentIntensityAnalyzer()

def analyzer(text: str):
    return sent.polarity_scores(text=text)


sent_transform = pipeline('sentiment-analysis', model='finiteautomata/bertweet-base-sentiment-analysis')

def analyzer_transoform(text: str):
    return sent_transform(text)