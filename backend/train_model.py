import pandas as pd
import numpy as np
import re
import string
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, top_k_accuracy_score

# --- CONFIG ---
DATA_PATH = "resume_dataset.csv"   # your dataset file name
MODEL_PATH = "role_model.pkl"
VECTORIZER_PATH = "vectorizer.pkl"
LABEL_ENCODER_PATH = "label_encoder.pkl"
TEST_SIZE = 0.2
RANDOM_STATE = 42

# --- 1️⃣ Load dataset ---
df = pd.read_csv(DATA_PATH)
print("Loaded dataset shape:", df.shape)
print("Columns:", df.columns.tolist())

# --- 2️⃣ Combine useful text fields ---
text_columns = [col for col in df.columns if df[col].dtype == "object"]
df["text"] = df[text_columns].fillna("").agg(" ".join, axis=1)

# --- 3️⃣ Clean text ---
def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

df["text_clean"] = df["text"].apply(clean_text)

# --- 4️⃣ Define labels ---
df["label"] = df["Title"].astype(str)  # You can change to another column if needed

print("Unique labels sample (count):", len(df["label"].unique()))
print("Number of classes:", len(df["label"].unique()))
print("Some labels:", df["label"].unique()[:10])

# --- 5️⃣ Filter rare labels (<2 samples) ---
label_counts = df["label"].value_counts()
valid_labels = label_counts[label_counts >= 2].index
df = df[df["label"].isin(valid_labels)]
print("After filtering, dataset shape:", df.shape)

# --- 6️⃣ Prepare X and y ---
X = df["text_clean"]
y = df["label"]

# --- 7️⃣ Encode labels ---
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# --- 8️⃣ Split data ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y_encoded
)

# --- 9️⃣ Vectorize and train model ---
vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

model = MultinomialNB()
model.fit(X_train_vec, y_train)

# --- 🔟 Evaluate ---
y_pred = model.predict(X_test_vec)
acc = accuracy_score(y_test, y_pred)

# ✅ Fix: Ensure label consistency for top_k_accuracy_score
y_prob = model.predict_proba(X_test_vec)
unique_classes = np.unique(y_train)  # only classes seen during training

top5_acc = top_k_accuracy_score(
    y_test, y_prob, k=5, labels=unique_classes
)

print(f"\n✅ Model Accuracy: {acc*100:.2f}%")
print(f"✅ Top-5 Accuracy: {top5_acc*100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, zero_division=0))

# --- 11️⃣ Save model artifacts ---
joblib.dump(model, MODEL_PATH)
joblib.dump(vectorizer, VECTORIZER_PATH)
joblib.dump(label_encoder, LABEL_ENCODER_PATH)
print("\n🎉 Model and vectorizer saved successfully!")
