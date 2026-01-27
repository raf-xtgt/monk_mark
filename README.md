# MonkMark: Deep Reading & Intellectual Growth

**Project Vision:** To bridge the gap between digital convenience and the sanctity of physical books, fostering a habit of deep work and intellectual mastery.

---

## 1. Problem Statement

### 1.1 The Digital Focus Crisis
Smartphones are designed for "brain rot"—short-form, high-dopamine content that erodes our attention spans. Even educational platforms (like YouTube) are cluttered with ads and algorithmic distractions, making it nearly impossible to engage in the "Deep Work" required for significant personal growth.

### 1.2 The Preservationist’s Dilemma
Active reading (highlighting, underlining, note-taking) is essential for retention, but many readers are "preservationists" who refuse to mark physical books. Currently, this forces a choice between:
1. **Passive Reading:** High aesthetic preservation but low knowledge retention.
2. **Destructive Reading:** High retention but "ruining" the physical asset with ink and stickers.

### 1.3 The Retention Gap
Note-taking is often a slow, tedious process that breaks the "flow state" of reading. Without a structured way to reflect on the material, the content is often forgotten days after the book is closed.

---

## 2. Solution: The "Monk Mode" Learning Ecosystem
MonkMark is a personal growth tool designed to facilitate distraction-free reading and high-fidelity knowledge retention.

### 2.1 Focus Module (Monk Mode)
* **Timed Deep Work:** Users set a 1–5 hour timer. Upon activation, the app triggers "Do Not Disturb" (via system APIs) to silence the digital world.
* **Contextual Encouragement:** Based on the book title, an AI agent generates motivational "Growth Mantras" aligned with the book's themes to prevent session abandonment.

### 2.2 Non-Destructive Annotation (The Digital Margin)
* **Optical Highlighting:** Users capture photos of passages they find impactful.
* **Virtual Margin:** Users can highlight text within the image and attach "floating notes" or "standalone reflections" without touching the physical page.
* **Spatial Indexing:** Each note is tied to a specific page number, creating a digital twin of the physical book’s insights.

### 2.3 Intellectual Reflection (AI Tutor)
* **Socratic Dialogue:** An AI agent acts as a reading companion, allowing users to clarify complex concepts or debate ideas via voice or text.
* **Active Recall:** Rather than just storing notes, the AI uses the user’s highlights to challenge their understanding.

### 2.4 Auto-Logging & Intellectual Growth Tracking
* **Reading Ledger:** Automatically tracks books completed and "Deep Work" hours logged.
* **Progress Visualization:** A dashboard showing the user's journey toward their "book-a-month" resolution.

---

## 3. Reward System: The "Legacy Art"
To encourage consistent reflection and emotional growth, MonkMark utilizes a unique reward loop:
* **Proof of Growth:** To unlock the reward, users must have 6+ hours of logged reading and answer three AI-generated synthesis questions. 
* **Depth Validation:** The AI evaluates answers not for "correctness," but for **depth of thought** and **personal application**.
* **Generative Pixel Art:** Upon success, the app generates a unique piece of Pixel Art. This art is a visual "culmination" of the book's themes, the user's specific notes, and their personal reflections, serving as a digital badge of their intellectual growth.

---

## 4. Tech Stack (Proposed for Hackathon)
* **Frontend:** React Native or Flutter (for DND/Notification API access).
* **OCR Engine:** Google Vision API or Tesseract for capturing and highlighting text from photos.
* **LLM Integration:** OpenAI GPT-4o or Gemini Pro for generating mantras, Socratic Q&A, and synthesis questions.
* **Image Generation:** DALL-E 3 or Midjourney API (stylized for Pixel Art) for the reward system.


## Run backend
```
uvicorn main:app --reload
```

## Run frontend
```
npx expo start -c
```

## Get a ngrok url for testing
```
ngrok http 8000
```