Copy of Virtual Internship v2

# Summarist Build Progress

[x] Section 1 — Project Setup & Home Page
[x] Section 2 — Authentication Modal
[x] Section 3 — For You Page
[x] Section 4 — Inside Book Page (/book/:id)
[ ] Section 5 — Player Page (/player/:id)
[ ] Section 6 — Sales / Choose Plan Page (/choose-plan)
[ ] Section 7 — Settings Page (/settings)
[x] Section 8 — Search Bar
[x] Section 9 — Sidebar
[ ] Section 10 — Skeleton Loading State
[ ] Section 11 — Library Page (Optional)

Solution website: https://summarist.vercel.app/

1. Choosing the technology

You can choose whatever technology you want for this virtual internship.

However, Frontend Simplified used the following technologies to complete this virtual internship:

- NextJS
- Typescript
- Firebase (firestore + authentication)
- Stripe using firebase extension
- Redux with redux toolkit
- React icons
- Vercel

Feel free to use whatever technologies you feel comfortable with.

2. Start

After you choose the technology, we will provide you with the home page design and app assets to facilitate stuff since it doesn't really have any UI logic and we don't want to waste your time by coding pure HTML, CSS, and grabbing assets.

Here is the repo for the HTML and CSS code for the home page. You will need to implement it according to your own framework of choice.

Link for home page and assets: https://github.com/hannamitri/summarist-home-page

Img tags are left empty for you to add based on the framework you chose. Icons are left there in case you want to use react-icons.

In order to install react icons, use the following command: npm install react-icons

3. Overall Features

1. Home page (https://summarist.vercel.app)
   1. Design
   2. Authentication modal
      - Register
      - Login using email and password
      - Logout
      - Guest login
      - Forgot password (Optional)
      - Google login (Optional)

2. For you page (https://summarist.vercel.app/for-you)
   1. Selected Book
   2. Recommended Books
   3. Suggested Books
   4. Book pill

3. Inside book page (https://summarist.vercel.app/book/:id)
   1. Display the content of the book
   2. Save books in library (Optional)

4. Player book page (https://summarist.vercel.app/player/:id)
   1. Display book title and book summary
   2. Build an audio player

5. Sales page (https://summarist.vercel.app/choose-plan)
   1. Design
   2. Create Payments

6. Settings page (https://summarist.vercel.app/settings)
   1. Display subscription status
   2. Display user email

7. Search bar
   1. Implement a search bar

8. Sidebar
   1. Implement a sidebar

9. Skeleton loading state
   1. Implement skeleton loading state

10. Library page (Optional)
    1. Display the saved books
    2. Display the finished books

4. Features explanation & hints

1. Home page (https://summarist.vercel.app)

   Design:
   - The HTML and CSS for the home page were already provided to you at the beginning of this document.
   - Optional: create the active heading on home page. Refer to the finished product to see its behavior.

   Authentication:
   - In this project, you're required to use a modal for authentication.
   - Register: User should be able to sign up with email and password
   - Login: User should be able to login with email and password
   - Logout: User should be able to logout.
   - Guest login: User should be able to use a guest login
   - Forgot password: Create a function that will reset a user's password if he forgot it. (OPTIONAL)
   - Google login: add a google login feature (OPTIONAL)

   Behavior:
   - If the user tried to either login or register with invalid email and password, then an error should appear.
   - The error can be:
     - Invalid email (on register and login)
     - Short password (on register)
     - User not found (on login)
   - If the user successfully entered everything correctly, they will be redirected to https://summarist.vercel.app/for-you
   - If the user has successfully logged out, display the logged out state in all the necessary pages.
   - Guest login: This is mainly used for recruiters and it is easy to implement. You just need to create a dummy email and password.
     For example:
       Email: guest@gmail.com
       Password: guest123
     Then, you can use the login function and hardcode the email and password you created.

   Hints: The auth modal will be used throughout the whole application, so make sure you use a global state variable to show/hide the modal.

2. For you page (https://summarist.vercel.app/for-you)

   Book object fields:
   - id: unique string
   - author: name of the book's author
   - title: title of the book
   - subTitle: sub title of the book
   - imageLink: image string of the book (can be directly added inside img tag)
   - audioLink: audio string of the book (can be directly added inside the audio tag)
   - totalRating: total rating of the book
   - averageRating: average rating of the book
   - keyIdeas: key ideas of the book
   - type: type of the book (audio, text, or audio & text)
   - status: status of the book (can be either selected, recommended, or suggested)
   - subscriptionRequired: states if user should be subscribed or not to read/listen to the book
   - summary: summary of the book
   - tags: tags of the book (it is an array of strings, so it can contain multiple tags)
   - bookDescription: description of the book
   - authorDescription: description of the author

   Selected Book (Ignore book duration for now, but come back and do it once you finish the audio player):
   - Display book from an api
   - Api Link: https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected
   - Returns a single book object

   Recommended Books (Ignore book duration for now, but come back and do it once you finish the audio player):
   - Display books from the api
   - Api Link: https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended
   - Returns an array of book objects

   Suggested books (Ignore book duration for now, but come back and do it once you finish the audio player):
   - Display books from the api
   - Api Link: https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested
   - Returns an array of book objects

   Book pill:
   - You can notice the pill on the top right of the book, this should be displayed according to the "subscriptionRequired" property inside the book object.
   - If the subscriptionRequired is false, you don't need to display anything.
   - If it's true, you need to display "premium".
   - Behavior: When a user clicks on any of the books, they will be redirected to /book/:id (id being the id of the book)
   - Example: https://summarist.vercel.app/book/:id

3. Inside book page (https://summarist.vercel.app/book/:id)
   (Ignore book duration for now, but come back and do it once you finish the audio player)

   - Display the content of the book.
   - You need to use this api to retrieve the book by id:
     https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}
     ${id} = dynamic id of the book

   Behavior: User clicks on the read or listen buttons.
   1. If the user is not logged in, the auth modal should appear (for them to register or login)
   2. If the user is logged in:
      a. If it's a premium book and they're not subscribed, then we need to send them to https://summarist.vercel.app/choose-plan
      b. If it's a free book or if the user is subscribed, then we need to send them to https://summarist.vercel.app/player/:id

   User clicks on add title to My Library:
   1. If not logged in, open auth modal
   2. If logged in, save book details

   Hints: Use dynamic routes in order to display the selected book.

4. Player book page (https://summarist.vercel.app/player/:id)

   - Display the book title and summary
   - Use "white-space: pre-line;" to add some space between the paragraphs of the book summary.

   Build an audio player:
   - Behavior: A user can play/stop/skip the audio using the buttons in the middle.
   - A user can drag the audio to a specific time.
   - The total duration of the book should be displayed on the right.
   - To build out the audio player, you can follow this link: https://blog.logrocket.com/building-audio-player-react/

5. Sales page (https://summarist.vercel.app/choose-plan)

   Design:
   - Code the design for the sales page. It should include everything there (Switching between plans, accordion, etc).

   Create Payments:
   - Create 2 different subscriptions. One of them should be billed monthly and the other should be billed annually (You can choose whatever prices you want).
   - Yearly subscription should have a 7-day free trial
   - Hints: In order to set up payments, you can follow this link: https://www.youtube.com/watch?v=xi3F2Zv91UE

6. Settings page (https://summarist.vercel.app/settings)

   If the user is not logged in, an image with a button to login should be displayed.

   Otherwise:
   - Display subscription status:
     a. If the user is not subscribed, display the plan as basic with a button to upgrade that will send you to the sales page: https://summarist.vercel.app/choose-plan
     b. If the user bought the premium subscription, then display premium.
     c. If the user bought the premium-plus subscription, then display premium-plus.
   - Display user email: Display the user's email

7. Search bar

   - This component should show on all pages except the home and sales page.
   - You need to implement the search with a debounce.
   - You need to use this api to search for books:
     https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${search}
     ${search} = search input of the user
   - The user can search a book by either the title or author.
   - Behavior: Debounce helps with decreasing the number of api calls. Wait 300 milliseconds after the user finishes typing before hitting the api.

8. Sidebar

   - This component should show on all pages except the home and sales page.
   - There are 7 items on the sidebar:
     1. For you: sends the user to /for-you
     2. Library: sends the user to /library
     3. Highlights: It's just a not-allowed cursor and doesn't send the user to any page
     4. Search: same as Highlights
     5. Settings: sends the user to /settings
     6. Help & Support: same as Highlights and Search
     7. Login/Logout: Either opens the auth modal or logs out the user
   - Behavior: Check the website to see the behavior. (Check out /player page to see the sidebar's behavior on mobile)

9. Skeleton loading state

   - Skeleton loading states should show on everything that needs time to be retrieved.
   - Some examples: For you page components, inside books page, settings page.
   - Check the website to make sure if you need a skeleton loading state for a specific feature.

10. Library Page (https://summarist.vercel.app/library) OPTIONAL

    - Display the saved books:
      If a user clicked on "Add title to My Library", it would be displayed here.
    - Display the finished books:
      If a user finishes a book, it will be displayed here. (A book is considered finished if the user listens till the end)

      We built the Summarist virtual internship project using Next.js 16, TypeScript, Firebase, Redux Toolkit, React Icons, and Tailwind CSS v4. Tailwind v4 does not support arbitrary values like bg-[#032b41] reliably so we use inline styles for colors and spacing, named CSS classes in globals.css for reusable styles (btn-primary, btn-library, book-tag, book-pill, book-description, app-page), and Tailwind only for structural layout (flex, grid, gap, overflow). We added @theme variables and @source directives to globals.css. The landing page keeps home.css. All app pages live in a Next.js route group at src/app/(app)/ which has a shared layout.tsx rendering the Sidebar and SearchBar. The Sidebar has a green left border active indicator, splits nav items 3 top and 3 bottom, and handles login/logout via Firebase auth and Redux modal. The SearchBar has a 300ms debounce and dropdown results. Completed sections: 3 (For You page), 4 (Book Detail page), 8 (Search Bar), 9 (Sidebar). Remaining: responsive sidebar hamburger menu, player page, settings page, choose-plan page, skeleton loading states, and library page optional.