# UNvote

Welcome to the UNvote, a slightly audacious and arguably necessary tool in the grand tradition of tilting at windmills. Inspired by the works of luminaries like David Graeber, Noam Chomsky, and Yanis Varoufakis, this project aims to dive deep into the heart of the United Nations' effectiveness—or, as we suspect, the lack thereof. Because nothing says "I'm making a difference" quite like a body that gathers annually to agree overwhelmingly on things that rarely change.

## What's This?

This repository contains a Deno script for scraping all [UN voting documents](https://digitallibrary.un.org/search?ln=en&c=Voting+Data&rg=200&jrec=1&fct__2=General+Assembly&cc=Voting+Data&fct__9=Vote) and store them locally in a sqlite3 database. Because, let's face it, if you want something done right (or at all), you're probably going to have to do it yourself. The UN has been churning out resolutions like a factory of good intentions since 1945, and we're here to analyze just how much of a dent all this has made in the real world.

## Why, Though?

Why not? Also, because reading through the voting records manually would be as fun as watching paint dry on a wall that's already been painted too many times. Our hypothesis is that the UN might just be a glorified debating club with really good catering. But hey, we're open to being proven wrong—sort of.

## Features

- **Scraping Efficiency**: Because if we're going to critique inefficiency, we might as well be efficient about it.
- **Database of Disappointment**: A neatly organized SQLite (or Postgresql, if we're feeling fancy) database of voting records, ready to have its data spun into a narrative of well-meaning ineffectuality.

## Getting Started

Ensure you have [Deno](https://deno.land/) and SQLite3 installed on your system to run this project.

1. **Clone the repository:**

```bash
git clone https://github.com/rix1/unvote.git # or gh repo clone rix1/unvote
cd unvote
```

2. **Create the Database Schema:**

Run the following command to create the database and apply the schema:

```bash
sqlite3 un_voting_data.db < schema.sql
```

This command will initialize a new SQLite database according to the `schema.sql` file included in the project repository.

3. **Running the Application:**

To start the application, run:

```bash
deno run --allow-net --allow-read --allow-write main.ts
```


## Contributing

Feel free to fork, submit pull requests, or just angrily vent about the UN in the issues section. All contributions are welcome, especially from fellow cynics and disillusioned idealists.

## Disclaimer

This project is meant for educational and entertainment purposes and is not affiliated with the United Nations or any authors mentioned. It's a passion project by someone who's passionate about pointing out that the emperor is, indeed, not wearing any clothes.

So, strap in, and let's see if we can statistically prove what many have suspected all along: that the UN is excellent at producing paperwork.
