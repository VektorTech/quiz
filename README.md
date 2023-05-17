# Quiz App (WIP)
A MERN Stack Application for creating, sharing and playing quizzes.

## About
This is a personal project to further aid my learning about the react ecosystem.

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
- [x] View quiz stats (graphical representations of survey results i.e. bar chart)
- [ ] Multi-answer questions
- [ ] UI animations
- [ ] Optimistic UI Updates
- [x] Timed quizzes
- [ ] Prompt user before navigating away from quiz creator
- [ ] Assign quiz tags
- [x] Upload quiz image thumbnail feature
- [ ] Integrate rich text editor
- [ ] Email users notifications
- [ ] Ability to edit profile
- [ ] Award users with badges for various accomplishments
- [ ] Toast notifications & indicators

## Tech Used
### Client
- TypeScript
- React v18
- Redux + Redux Toolkit & RTK Query
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

## Things I've Learned
- Working with the Drag and Drop API
- Global state management with Redux
- Form state management with react hook form
- Interfacing with server through RTK Query
- Authentication flows using Auth0 (working w/ JWT)
- Mocking data & functions for testing

## Notes
- My initial attempt to implement the draggable list using the Drag and Drop (DnD) API came with some inconveniences, so I eventually had to switch to the Pointer/Touch APIs. The DnD API showed a ghost image of the dragged element without any way to style it and also affected the cursor icon when hovering dragged items around the page. It was difficult, if not impossible, to restrict the dragged element to the bounds of the list container and to disable the list item from being dragged along the x-axis. The DnD API also has very little support on mobile browsers. Switching to the Pointer/Touch APIs required more code, but the result was much more favourable.
- RTK Query doesn't currently have a normalized cache, so duplicates of an object can exist simultaneously in different endpoints. All endpoints for a mutual API server have to be defined in the same API slice to allow each endpoint to invalidate the cache of another endpoint.
- Because I wanted to include an embedded email/password login form, the application currently relies on Auth0's Resource Owner Password flow (access token in this application is fetched from the server) which isn't recommended. But the standard redirect flow is still available.
- Loading user profile images from google requires a "no-referrer" policy to be specified.
- I'm somehow unable to display a prompt when a user is navigating away from a page.

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
This application is [MIT Licensed](./LICENSE.md)
