```javascript
let data = {
  users: [
    {
      id: 1,
      name: {
        first: 'testUserFirst',
        last: 'testUserLast',
      },
      email: 'test@gmail.com',
      password: 'pwdAsString',
      numFailedPasswordsSinceLastLogin: 99,
      numSuccessfulLogins: 3,
      numQuizzesMade: 0,
    },
  ],

  quizzes: [
    {
      authorId: 1,
      quizId: 12345,
      name: "Test Name",
      description: "Test description",
      questions: [
        {
          question: "testQ1",
          answer: "testA1", // assuming not multiple choice, will likely change
        },
      ],
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
    },
    
  ],
}
```

[Optional] short description: 
