import pandas as pd
import pickle

# Load data
movieDict = pickle.load(open('movie.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))

# Convert to DataFrame
movies = pd.DataFrame(movieDict)

# Save as JSON
movies.to_json('movie.json', orient='records')
pd.DataFrame(similarity).to_json('similarity.json', orient='values')
