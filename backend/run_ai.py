import os
import django
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import pickle

# ১. Django এনভায়রনমেন্ট সেটআপ করা
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from finance.models import Transaction

def main():
    print("🚀 Starting AI Model Training Process...")

    # ২. ডাটাবেস থেকে ডাটা লোড করা
    transactions = list(Transaction.objects.all().values())
    if not transactions:
        print("❌ Error: No transactions found! Please run the seed script first.")
        return

    df = pd.DataFrame(transactions)
    print(f"✅ Loaded {len(df)} transactions.")

    # ৩. ফিচার ইঞ্জিনিয়ারিং (Feature Engineering)
    # Decimal থেকে Float এ কনভার্ট করা হচ্ছে যাতে গাণিতিক অপারেশন করা যায়
    df['amount'] = df['amount'].astype(float) 

    df['hour'] = pd.to_datetime(df['created_at']).dt.hour
    df['day_of_week'] = pd.to_datetime(df['created_at']).dt.dayofweek
    df['amount_log'] = np.log1p(df['amount'])

    # ক্যাটাগরি ও টাইপ এনকোডিং
    df = pd.get_dummies(df, columns=['transaction_type', 'category'])

    # ৪. টার্গেট লেবেল তৈরি (Target Label Creation)
    def label_logic(row):
        # লজিক: যদি রাত ২টা থেকে ৪টা এর মধ্যে বড় অ্যামাউন্ট হয়, তবে সেটি ফ্রড (1)
        if 2 <= row['hour'] <= 4 and row['amount'] > 1000:
            return 1
        return 0

    df['is_fraud'] = df.apply(label_logic, axis=1)
    print(f"📊 Data distribution:\n{df['is_fraud'].value_counts()}")

    # ৫. ফিচার এবং টার্গেট আলাদা করা
    drop_cols = ['id', 'user_id', 'description', 'created_at']
    X = df.drop(columns=[c for c in drop_cols if c in df.columns] + ['is_fraud'])
    y = df['is_fraud']

    # ৬. ট্রেন ও টেস্ট স্প্লিট
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # ৭. মডেল ট্রেনিং
    print("🧠 Training Random Forest Model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # ৮. মডেল মূল্যায়ন (Evaluation)
    y_pred = model.predict(X_test)
    print("\n--- Model Performance ---")
    print(f"Accuracy Score: {accuracy_score(y_test, y_pred):.2%}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    # ৯. মডেল সেভ করা (Pickle format)
    os.makedirs('ai_engine/models', exist_ok=True)
    model_data = {
        'model': model,
        'features': X.columns.tolist()
    }
    model_path = 'ai_engine/models/fraud_model.pkl'
    with open(model_path, 'wb') as f:
        pickle.dump(model_data, f)

    print(f"\n✅ Model saved successfully at: {model_path}")

if __name__ == "__main__":
    main()