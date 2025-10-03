# CrewAI 🧑‍💻

**CrewAI is a chat-based application which enables the user to interact with multiple LLM providers like Gemini, OpenAI, Mistral, and more within the same conversation.**

**The user can specify which LLM should answer a given prompt by mentioning it in the text input (e.g., `@Mistral What is the highest point in the world?).**

---


## Technologies

* **NextJS**
* **TailwindCSS**
* **Langchain**
* **MySQL**

---

## How to Run the Application

**You need NodeJS version 21 or higher**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/mango-exe/crew-ai](https://github.com/mango-exe/crew-ai)
    cd crew-ai
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables:**
    Create a file named **`.env`** in the root of the repository and add the following keys. You must replace the placeholder values with your actual API keys and secrets.

    ```bash
    DATABASE_URL=mysql://user:pass1@localhost:3306/crewai
    NEXTAUTH_SECRET=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    NEXTAUTH_URL=http://localhost:3000
    OPENAI_API_KEY=
    MISTRAL_API_KEY=
    GOOGLE_API_KEY=
    ```

4.  **Create the MySQL data directory:**
    ```bash
    mkdir data
    ```
5.  **Build the Dockerfile for the database:**
    ```bash
    docker build -t crewai-mysql .
    ```
6.  **Run the MySQL Docker container:**
    ```bash
    docker run -d \
      --name crewai-mysql \
      -p 3306:3306 \
      -v $(pwd)/data:/var/lib/mysql \
      crewai-mysql
    ```
7.  **Install Drizzle Kit (for database migrations):**
    ```bash
    npm i -D drizzle-kit
    ```
8.  **Generate the migration files:**
    ```bash
    npx drizzle-kit generate
    ```
9.  **Apply the migrations to the database:**
    ```bash
    npx drizzle-kit migrate
    ```
10. **Run the application:**
    ```bash
    npm run dev
    ```

The application should now be running locally, typically accessible at `http://localhost:3000`.

---

## Features Showcase

### Landing page
![Landing Page](screenshots/landing-page.png)

### Chat interface
![Chat interface](screenshots/chat-interface.png)


### Model Selection and Configuration
Select which model should be used for each LLM Provider, also a default LLM Provider can be selected so that it will answer the prompts without any mention.

![Chat interface](screenshots/model-configuration.png)


### Seamless Multi-LLM Conversation
Engage with different models, compare their answers, and build a richer, more comprehensive discussion.

![Chat interface](screenshots/chat-interaction-1.png)

![Chat interface](screenshots/chat-interaction-2.png)

---
