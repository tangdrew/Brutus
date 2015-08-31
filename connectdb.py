import requests
import pymongo
from pymongo import MongoClient
import time

# get mongo stuff
client = MongoClient('mongodb://localhost:27017')

db = client['brutus']
