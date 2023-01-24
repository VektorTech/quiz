# Quiz App (WIP)
A MERN Stack Application for creating, sharing and playing quizzes.

## Features
- Create quizzes & save them to draft
- Publish quizzes to website
- Assign title, description & category to quiz
- Multiple choice questions
- Ability to reorder questions or choices through draggable list
- Star favorite quizzes
- Search quizzes
- View quizzes by category
- Login / Sign Up feature to access the quiz creator
- Mark answer among choices
- Update previously created quizzes
- Logged in users can follow / unfollow other users

## TODO
- [ ] View quiz stats (graphical representations of survey results)
- [ ] Multi-answer questions
- [ ] UI animations
- [x] Timed quizzes
- [ ] Cancel quiz creation prompt
- [ ] Assign quiz tags
- [x] Upload quiz image thumbnail feature
- [ ] Ability to edit profile
- [-] Toast notifications & indicators

## Tech Used
### Client
- TypeScript
- React v18
- Redux Toolkit & RTK Query
- React Hook Form
- React Router v6
- Chakra UI
- React Helmet
- Framer Motion
- Emotion Styled
- CRACO
- Testing: React Testing Library, Jest
- etc.

### Server
- Express
- Passport &mdash; Local, OpenID Connect
- Mongo DB &mdash; Mongoose, Connect Mongo (Sessions)
- Validator
- Testing: Mocha, Supertest
- etc.

### Other
- Auth0
- Cloudinary
- SVGRepo

## ENV
### Client
```python
REACT_APP_SERVER_ADDR="http://localhost:3001"
```
### Server
```python
MONGODB_URL="mongodb://127.0.0.1:27017/quiz_db"
MONGODB_TEST_URL="mongodb://127.0.0.1:27017/quiz_test_db"

COOKIE_SECRET="some-secret-for-encrypting-cookie"

CLIENT_ADDR="http://localhost:3000"

AUTH0_CLIENT_SECRET=
AUTH0_CLIENT_ID=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=

CLOUDINARY_URL=
```

## License
[MIT](./LICENSE.md)