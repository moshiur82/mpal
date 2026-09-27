import pandas as pd
import numpy as np
import sqlite3 # We use sqlite for temporary processing if needed, but here we use Django models
from django.contrib.auth import get_user_model
from finance.models import Transaction
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import pickle
import os
import django

# Django environment setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()

def train_ai_model():
    print("🚀 Starting AI Model Training...")

    # ১. ডাটাবেস থেকে ডাটা রিড করা
    transactions = Transaction.objects.all().values()
    if not transactions:
        print("❌ Error: No transactions found in database!")
        return

    df = pd.DataFrame(list(transactions))
    print(f"✅ Loaded {len(df)} transactions from database.")

    # ২. ফিচার ইঞ্জিনিয়ারিং (Feature Engineering)
    # আমরা কিছু ফিচার তৈরি করবো যা AI বুঝতে পারবে
    df['hour'] = pd.to_datetime(df['created_at']).dt.hour
    df['day_of_week'] = pd.to_datetime(df['created_at']).dt.dayofweek
    df['amount_log'] = np.log1p(df['amount']) # টাকার পরিমাণকে স্কেল করা

    # ক্যাটাগরি এবং টাইপকে নাম্বার হিসেবে রূপান্তর (One-Hot Encoding)
    df = pd.get_dummies(df, columns=['transaction_type', 'category'])

    # ৩. লেবেল তৈরি করা (Target Label Creation)
    # যেহেতু আমরা ডামি ডাটা জেনারেট করেছি, আমরা লজিক দিয়ে লেবেল করবো:
    # যদি রাত ২টা থেকে ৪টার মধ্যে বড় অ্যামাউন্ট হয়, তবে সেটি ফ্রড (1), নাহলে Safe (0)
    def label_logic(row):
        if 2 <= row['hour'] <= 4 and row['amount'] > 1000:
            return 1 # Fraud
        return 0 # Safe

    df['is_fraud'] = df.apply(label_logic, axis=1)
    print(f"📊 Data distribution:\n{df['is_fraud'].value_counts()}")

    # ৪. ফিচার এবং টার্গেট আলাদা করা
    # আমরা 'id', 'user_id', 'created_at' বাদ দেবো কারণ এগুলো মডেলে কাজ করবে না
    drop_cols = ['id', 'user_id', 'description', 'created_at']
    # নিশ্চিত করছি যে drop_cols সব কলামে আছে
    X = df.drop(columns=[c for c in drop_cols if c in df.columns] + ['is_fraud'])
    y = df['is_fraud']

    # ৫. ট্রেন ও টেস্ট স্প্লিট করা
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # ৬. মডেল ট্রেনিং (Random Forest Classifier)
    print("🧠 Training Random Forest Model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # ৭. মডেল মূল্যায়ন (Evaluation)
    y_pred = model.predict(X_test)
    print("\n--- Model Performance ---")
    print(f"Accuracy Score: {accuracy_score(y_test, y_pred):.2%}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    # ৮. মডেল সেভ করা (Pickle format)
    # আমরা মডেল এবং ফিচার কলামগুলো সেভ করবো যাতে পরবর্তীতে প্রেডিকশন করতে পারি
    model_data = {
        'model': model,
        'features': X.columns.tolist()
    }
    
    # মডেল সেভ করার জন্য ফোল্ডার নিশ্চিত করা
    os.makedirs('models', exist_ok=True)
    with open('models/fraud_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)

    print("\n✅ Model saved successfully in 'ai_engine/models/fraud_model.pkl'!")

if __name__ == "__main__":
    train_ai_model()