# QuestBoard

**QuestBoard** is a simple, user-friendly To-Do application that allows users to manage their tasks (referred to as "quests") through basic CRUD operations: creating, retrieving, updating, and deleting tasks. The app also includes functionality to sort tasks based on their ID.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Connecting Frontend and Backend](#connecting-frontend-and-backend)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

---

<!-- ## Features
- **Create Quest**: Add a new quest/task.
- **Retrieve Quests**: View all quests stored in the database.
- **Update Quest**: Edit details of an existing quest.
- **Delete Quest**: Remove a quest from the list.
- **Sort Quests by ID**: Sort the quests in ascending or descending order based on their ID. -->
## Tech Stack
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Java, Spring Boot

## Installation

### Prerequisites
- **Java** (version 11 or later)
- **Maven** (for managing Java dependencies)
- **Node.js** (for local server on the frontend)

### Backend Setup
1. Clone the repository:
   ```cmd
   git clone https://github.com/your-username/To_Do_App.git
   cd To_Do_App/backend
   ```
2. Install dependencies and build the project:
   ```cmd
   mvn clean install
   ```
3. Start the Spring Boot application:
    ```cmd
    mvn spring-boot:run
    ```

### Frontend Setup
1. Go to the frontend directory:4
    ```cmd
    cd ../frontend
    ```
2. Install the dependencies if any, and run the frontend server with Node.js:
    ```cmd
    npm init -y
    npm install express
    node app.js
    ```
By default, this will run the frontend on http://localhost:3000.

### Connecting Frontend and Backend
- The frontend will make HTTP requests to the backend API running on http://localhost:8080 to perform CRUD operations. Ensure CORS is configured on the backend to allow requests from http://localhost:3000.

### Usage
1. **Creating a Quest:** Use the form on the frontend to add a new quest.
2. **Updating a Quest:** Click on the edit button near a quest to edit its description.
3. **Deleting a Quest by ID:** Click the delete button next to a quest to remove it based on it's ID.
4. **Sorting by ID** Use the sort button to reorder quests based on their ID.

![DPU](https://cdn.discordapp.com/attachments/1171401595800518726/1300844967379472476/Screenshot_2024-10-29_at_16.32.47.png?ex=672251c8&is=67210048&hm=9ba17bfc06ade8d1b0f3fce6ec017574543eb8ef11090e2050a46288ab56c45e&)

### API Endpoints
- **GET /api/index:** Retrieve all quests
- **POST /api/index:** Add a new quest.
- **PUT /api/index/{id}:** Update an existing quest.
- **DELETE /api/index/{id}:** Delete a quest by ID.

## Vizija
Cilj aplikacije To-Do je zagotoviti enostaven, uporabniku prijazen vmesnik za upravljanje opravil, ki se osredotoča na preprostost in osnovno funkcionalnost. Ta aplikacija uporabnikom omogoča učinkovito organiziranje, določanje prioritet in upravljanje svojih vsakodnevnih nalog brez zapletenosti nepotrebnih funkcij.

### Glavni cilji aplikacije so:
- **Omogoči hitro ustvarjanje nalog in sledenje:** uporabniki lahko preprosto dodajo naloge, ki so prikazane v organizirani mreži.
- **Omogočite posodabljanje, brisanje in razvrščanje nalog:** uporabniki lahko po potrebi spremenijo ali izbrišejo naloge in si jih ogledajo v naraščajočem ali padajočem vrstnem redu, da ustrezajo njihovim prednostnim nalogam.
- **Zagotovite brezhibno uporabniško izkušnjo:** minimalistična zasnova aplikacije zmanjša motnje in poveča uporabnost za učinkovito upravljanje opravil.

Aplikacija To-Do je zgrajena tako, da izpolnjuje bistvene potrebe po upravljanju opravil s čisto in učinkovito zasnovo, ki uporabnika ohranja osredotočenega na dokončanje nalog.

## Besednjak

| Pojem                  | Definicija |
|------------------------|------------|
| **Aplikacija To-Do**   | Orodje za upravljanje in organiziranje opravil. |
| **Naloga**             | Predmet ali dejavnost, ki jo uporabnik želi dokončati ali si jo zapomniti. |
| **Vnosno polje**       | Element obrazca, kamor uporabniki vnesejo ime nove naloge. |
| **Mreža**              | Postavitev, kjer so opravila prikazana, ko so dodana. |
| **Funkcionalnost razvrščanja** | Funkcija, ki uporabnikom omogoča razvrščanje opravil v naraščajočem ali padajočem vrstnem redu glede na imena opravil. |
| **Posodobitev opravila** | Možnost spreminjanja imena ali podrobnosti obstoječega opravila. |
| **Brisanje opravila**  | Možnost odstranitve opravila iz mreže in seznama aktivnih opravil. |
| **Naraščajoče/padajoče** | Vrstni red razvrščanja; naraščajoče pomeni od A do Ž (abecedni vrstni red) ali od zgodnjega do najzgodnejšega, padajoče pa je od Z do A ali od najnovejšega do najzgodnejšega. |
