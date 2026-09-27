# ১. পাইথন ইমেজ ব্যবহার করা হচ্ছে
FROM python:3.12-slim

# ২. কাজের ডিরেক্টরি সেট করা
WORKDIR /app

# ৩. সিস্টেম ডিপেন্ডেন্সি ইন্সটল করা (PostgreSQL এর জন্য প্রয়োজন)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# ৪. পাইথন ডিপেন্ডেন্সি ফাইল কপি করা এবং ইন্সটল করা
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ৫. প্রজেক্টের বাকি সব ফাইল কপি করা
COPY . .

# ৬. পোর্ট এক্সপোজ করা
EXPOSE 8000

# ৭. সার্ভার রান করা
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]