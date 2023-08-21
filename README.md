# QnA - [QnA.caleb.works](https://qna.caleb.works/)

Qna is a web application that enhances memory retention through active recall. Users create personalized question-and-answer collections, and the web app utilizes active recall techniques to prompt information retrieval, boosting long-term memory. QnA's intelligent review system highlights questions needing review after seven days or a set due date, ensuring effective learning and memory reinforcement.

## Features

- **Personalized Question Collections:** Qna enables users to create their own collections of questions and corresponding answers. This feature empowers you to tailor your learning experience to your specific interests, subjects, or areas of focus.
- **Active Recall Technique:** Qna employs the proven active recall technique to facilitate effective learning. By prompting your brain to retrieve information from memory, you'll not only reinforce your understanding but also improve long-term retention.
- **Active Recall Technique:** The heart of Qna's functionality lies in its smart review system. The application tracks the last time you interacted with each question. If a question remains unreviewed for seven days (or the due date you set upon creating the question), it will be flagged for review. These flagged questions will be highlighted in red, serving as a visual cue that it's time to revisit and reinforce your memory of that particular piece of information.

## How Qna Works

- **Question Collection:** Create your own collections of questions and answers, organizing your learning materials in a way that suits your preferences.

- **Active Recall Practice:** Regularly engage with your question collections. When you attempt to recall the answer before checking, you actively stimulate your memory, leading to stronger retention.

- **Intelligent Review:** Qna intelligently tracks when you last interacted with a question. If a question goes unreviewed for seven days (or the designated due date), it's highlighted in red, indicating that it's time to refresh your memory.

## Run Locally

Clone the project

```bash
git clone https://github.com/calebareeveso/QnA.git
```

Go to the project directory

```bash
cd QnA
```

Install dependencies

```bash
npm install
```

Begin development

```bash
npm run dev
```

Create production bundle

```bash
npm run build
```

Serve production bundle

```bash
npm run preview
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`

`NEXT_PUBLIC_APP_UPLOAD_PRESET`

`NEXT_PUBLIC_APP_CLOUD_NAME`

`NEXTAUTH_URL`

`NEXTAUTH_SECRET`

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [@calebareeveso](https://www.github.com/calebareeveso) - [calebareeveso.com](https://www.calebareeveso.com)
