import pickle
import pandas as pd
import numpy as np
import os

class FraudPredictor:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), 'models', 'fraud_model.pkl')
        self.model_data = self._load_model()

        if self.model_data:
            self.model = self.model_data['model']
            self.features = self.model_data['features']
        else:
            self.model = None
            self.features = []

    def _load_model(self):
        if os.path.exists(self.model_path):
            with open(self.model_path, 'rb') as f:
                return pickle.load(f)
        return None

    def predict(self, transaction_dict: dict):
        """
        Predicts if a transaction is fraud based on features.
        """
        if not self.model:
            return 0

        try:
            # ১. ইনপুট ডাটাকে DataFrame এ রূপান্তর করা
            df = pd.DataFrame([transaction_dict])

            # ২. সকল ফিচার কলাম নিশ্চিত করা (মডেলের ফিচারের সাথে মিল রেখে)
            for col in self.features:
                if col not in df.columns:
                    df[col] = 0
            
            # ৩. কলামের অর্ডার ঠিক করা (মডেলের ফিচারের সিরিয়াল অনুযায়ী)
            df = df[self.features]

            # ৪. প্রেডিকশন করা
            prediction = self.model.predict(df)
            return int(prediction[0])
        except Exception as e:
            print(f"Prediction Error: {e}")
            return 0 # এরর হলে ডিফল্টভাবে Safe (0) ধরা হবে