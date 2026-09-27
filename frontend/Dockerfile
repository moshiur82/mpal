# ১. Node.js ইমেজ ব্যবহার করা হচ্ছে
FROM node:20-slim

# ২. কাজের ডিরেক্টরি সেট করা
WORKDIR /app

# ৩. ডিপেন্ডেন্সি ফাইল কপি করা এবং ইন্সটল করা
COPY package*.json ./
RUN npm install

# ৪. প্রজেক্টের ফাইল কপি করা
COPY . .

# ৫. Vite অ্যাপটি বিল্ড করা এবং সার্ভ করা
RUN npm run build

# ৬. পোর্ট এক্সপোজ করা
EXPOSE 5173

# ৭. সার্ভার রান করা (Vite dev mode ব্যবহার করছি যাতে দ্রুত কাজ করে)
CMD ["npm", "run", "dev", "--", "--host"]